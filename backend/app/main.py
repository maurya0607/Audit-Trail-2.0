import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from fpdf import FPDF

from app.database import db, init_db_indexes
from app.services.hash_service import GENESIS_HASH, compute_event_hash, verify_event_chain
from app.services.gemini_service import analyze_event_risk, investigate_dispute_ai

app = FastAPI(title="Audit Trail 2.0 Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for conn in self.active_connections:
            try:
                await conn.send_json(message)
            except Exception:
                pass

ws_manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    await init_db_indexes()

# --- Schemas ---
class LoginRequest(BaseModel):
    email: str
    role: str = "Logistics Manager"

class ShipmentCreate(BaseModel):
    shipment_id: str
    cargo_name: Optional[str] = "Biopharma Vaccines (Cold Chain)"
    supplier_id: str
    transporter_id: str
    receiver_id: str
    origin: str
    destination: str

class EventIngest(BaseModel):
    event_id: Optional[str] = None
    shipment_id: str
    event_type: str
    event_data: Dict[str, Any]

class DisputeRaise(BaseModel):
    shipment_id: str
    raised_by: str
    dispute_type: str
    claims: Dict[str, Any]

class EvidenceSubmit(BaseModel):
    submitted_by: str
    party_role: str
    evidence_type: str
    file_reference: str

# --- APIs ---
@app.post("/api/auth/login")
async def login(req: LoginRequest):
    return {"access_token": f"token-{req.role}", "user": {"email": req.email, "role": req.role}}

@app.post("/api/shipments")
async def create_shipment(shipment: ShipmentCreate):
    doc = shipment.model_dump()
    doc["current_status"] = "CREATED"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    try:
        await db.shipments.insert_one(doc)
    except Exception:
        raise HTTPException(status_code=400, detail="Shipment ID already exists")
    doc.pop("_id", None)
    return doc

@app.get("/api/shipments")
async def list_shipments():
    return await db.shipments.find({}, {"_id": 0}).to_list(100)

@app.get("/api/shipments/{shipment_id}/timeline")
async def get_timeline(shipment_id: str):
    return await db.events.find({"shipment_id": shipment_id}, {"_id": 0}).sort("sequence_number", 1).to_list(500)

@app.post("/api/events/ingest")
async def ingest_event(payload: EventIngest):
    ev_id = payload.event_id or f"evt_{uuid.uuid4().hex[:10]}"
    if await db.events.find_one({"event_id": ev_id}):
        raise HTTPException(status_code=409, detail="Duplicate event_id rejected.")

    last_event = await db.events.find_one({"shipment_id": payload.shipment_id}, sort=[("sequence_number", -1)])
    seq_num = (last_event["sequence_number"] + 1) if last_event else 1
    prev_hash = last_event["event_hash"] if last_event else GENESIS_HASH
    timestamp = datetime.now(timezone.utc).isoformat()

    ev_hash = compute_event_hash(ev_id, payload.shipment_id, seq_num, payload.event_type, payload.event_data, timestamp, prev_hash)

    event_doc = {
        "event_id": ev_id,
        "shipment_id": payload.shipment_id,
        "sequence_number": seq_num,
        "event_type": payload.event_type,
        "event_data": payload.event_data,
        "timestamp": timestamp,
        "previous_hash": prev_hash,
        "event_hash": ev_hash
    }
    await db.events.insert_one(event_doc)
    await db.shipments.update_one({"shipment_id": payload.shipment_id}, {"$set": {"current_status": payload.event_type}})

    recent_events = await db.events.find({"shipment_id": payload.shipment_id}, {"_id": 0}).sort("sequence_number", -1).to_list(5)
    risk_result = analyze_event_risk(payload.event_type, payload.event_data, recent_events)

    if risk_result["risk_score"] > 25:
        alert_doc = {
            "shipment_id": payload.shipment_id,
            "event_id": ev_id,
            "risk_score": risk_result["risk_score"],
            "severity": risk_result["severity"],
            "risk_type": risk_result["risk_type"],
            "ai_explanation": risk_result["ai_explanation"],
            "created_at": timestamp
        }
        await db.risk_alerts.insert_one(alert_doc)
        alert_doc.pop("_id", None)
        await ws_manager.broadcast({"type": "RISK_ALERT", "data": alert_doc})

    await ws_manager.broadcast({"type": "NEW_EVENT", "shipment_id": payload.shipment_id, "sequence_number": seq_num})
    event_doc.pop("_id", None)
    return {"event": event_doc, "risk_assessment": risk_result}

@app.get("/api/ledger/verify/{shipment_id}")
async def verify_ledger(shipment_id: str):
    events = await db.events.find({"shipment_id": shipment_id}, {"_id": 0}).sort("sequence_number", 1).to_list(1000)
    return verify_event_chain(events)

@app.get("/api/ledger/replay/{shipment_id}")
async def replay_ledger(shipment_id: str, seq: int):
    events = await db.events.find({"shipment_id": shipment_id, "sequence_number": {"$lte": seq}}, {"_id": 0}).sort("sequence_number", 1).to_list(1000)
    if not events:
        raise HTTPException(status_code=404, detail="No events found")
    state = {}
    for ev in events:
        state.update(ev["event_data"])
        state["last_event_type"] = ev["event_type"]
        state["timestamp"] = ev["timestamp"]
    return {"shipment_id": shipment_id, "replayed_up_to_sequence": seq, "reconstructed_state": state}

@app.get("/api/risks")
async def get_all_risks():
    return await db.risk_alerts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)

@app.post("/api/disputes/raise")
async def raise_dispute(req: DisputeRaise):
    dispute_id = f"DSP-2026-{uuid.uuid4().hex[:3].upper()}"
    doc = {
        "dispute_id": dispute_id,
        "shipment_id": req.shipment_id,
        "raised_by": req.raised_by,
        "dispute_type": req.dispute_type,
        "claims": req.claims,
        "evidence_ids": [],
        "ai_investigation_summary": None,
        "decision_status": "OPEN",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.disputes.insert_one(doc)
    doc.pop("_id", None)
    return doc

@app.get("/api/disputes")
async def list_disputes():
    return await db.disputes.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)

@app.post("/api/disputes/{dispute_id}/evidence")
async def add_evidence(dispute_id: str, req: EvidenceSubmit):
    dispute = await db.disputes.find_one({"dispute_id": dispute_id})
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    ev_id = f"EVD-{uuid.uuid4().hex[:6].upper()}"
    doc = {
        "evidence_id": ev_id,
        "dispute_id": dispute_id,
        "shipment_id": dispute["shipment_id"],
        "submitted_by": req.submitted_by,
        "party_role": req.party_role,
        "evidence_type": req.evidence_type,
        "file_reference": req.file_reference,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.evidence.insert_one(doc)
    await db.disputes.update_one({"dispute_id": dispute_id}, {"$push": {"evidence_ids": ev_id}})
    doc.pop("_id", None)
    return doc

@app.post("/api/disputes/{dispute_id}/investigate")
async def investigate_dispute(dispute_id: str):
    dispute = await db.disputes.find_one({"dispute_id": dispute_id}, {"_id": 0})
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    events = await db.events.find({"shipment_id": dispute["shipment_id"]}, {"_id": 0}).sort("sequence_number", 1).to_list(200)
    evidence = await db.evidence.find({"dispute_id": dispute_id}, {"_id": 0}).to_list(100)
    summary = investigate_dispute_ai(dispute["shipment_id"], dispute["claims"], events, evidence)
    await db.disputes.update_one({"dispute_id": dispute_id}, {"$set": {"ai_investigation_summary": summary, "decision_status": "UNDER_REVIEW"}})
    return {"dispute_id": dispute_id, "ai_investigation_summary": summary}

@app.get("/api/reports/{shipment_id}")
async def generate_audit_pdf(shipment_id: str):
    events = await db.events.find({"shipment_id": shipment_id}, {"_id": 0}).sort("sequence_number", 1).to_list(500)
    verification = verify_event_chain(events)
    risks = await db.risk_alerts.find({"shipment_id": shipment_id}, {"_id": 0}).to_list(50)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "AUDIT TRAIL 2.0 - CRYPTOGRAPHIC VERIFICATION REPORT", ln=True)
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 8, f"Shipment ID: {shipment_id}", ln=True)
    pdf.cell(0, 8, f"Chain Status: {verification['message']}", ln=True)
    pdf.ln(5)
    for ev in events:
        pdf.cell(0, 7, f"Block #{ev['sequence_number']} [{ev['event_type']}] Hash: {ev['event_hash'][:18]}...", ln=True)
    pdf.ln(5)
    for r in risks:
        pdf.multi_cell(0, 7, f"Risk [{r['severity']} - {r['risk_score']}/100]: {r['ai_explanation']}")

    return Response(content=bytes(pdf.output()), media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=audit_{shipment_id}.pdf"})

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)