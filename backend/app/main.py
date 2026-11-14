from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from typing import List
from fpdf import FPDF

from app.database import db, init_db_indexes
from app.schemas.all_schemas import ShipmentCreate, EventIngest
from app.services.hash_service import verify_event_chain
from app.services.event_service import process_and_ingest_event
from app.services.replay_service import replay_shipment_state
from app.routes import auth, disputes

app = FastAPI(title="Audit Trail 2.0 - Enterprise Logistics Ledger & AI Dispute API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(disputes.router)

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
        for conn in list(self.active_connections):
            try:
                await conn.send_json(message)
            except Exception:
                pass

ws_manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    try:
        await init_db_indexes()
    except Exception as e:
        print(f"Warning: Database index initialization skipped (MongoDB may be connecting): {e}")

# --- Root & Health Check ---
@app.get("/")
async def root():
    return {
        "status": "ONLINE",
        "service": "Audit Trail 2.0 API Engine",
        "version": "2.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# --- Dashboard KPI Stats ---
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    try:
        total_shipments = await db.shipments.count_documents({})
        total_events = await db.events.count_documents({})
        active_risks = await db.risk_alerts.count_documents({})
        open_disputes = await db.disputes.count_documents({})
        return {
            "active_freight_monitored": total_shipments,
            "chained_blocks": total_events,
            "active_risk_interceptions": active_risks,
            "total_disputes": open_disputes,
            "integrity_status": "SHA-256 SYNCED"
        }
    except Exception as e:
        return {
            "active_freight_monitored": 0,
            "chained_blocks": 0,
            "active_risk_interceptions": 0,
            "total_disputes": 0,
            "integrity_status": "WAITING_DATA"
        }

# --- Shipments ---
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

@app.get("/api/shipments/{shipment_id}")
async def get_shipment(shipment_id: str):
    doc = await db.shipments.find_one({"shipment_id": shipment_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return doc

@app.get("/api/shipments/{shipment_id}/timeline")
async def get_timeline(shipment_id: str):
    return await db.events.find({"shipment_id": shipment_id}, {"_id": 0}).sort("sequence_number", 1).to_list(500)

# --- Ledger & Events ---
@app.post("/api/events/ingest")
async def ingest_event(payload: EventIngest):
    result = await process_and_ingest_event(payload)
    if result.get("alert_created"):
        await ws_manager.broadcast({"type": "RISK_ALERT", "data": result["alert_created"]})
    await ws_manager.broadcast({
        "type": "NEW_EVENT",
        "shipment_id": payload.shipment_id,
        "sequence_number": result["event"]["sequence_number"]
    })
    return result

@app.get("/api/ledger/verify/{shipment_id}")
async def verify_ledger(shipment_id: str):
    events = await db.events.find({"shipment_id": shipment_id}, {"_id": 0}).sort("sequence_number", 1).to_list(1000)
    return verify_event_chain(events)

@app.get("/api/ledger/replay/{shipment_id}")
async def replay_ledger(shipment_id: str, seq: int = 1):
    return await replay_shipment_state(shipment_id, seq)

# --- Risks ---
@app.get("/api/risks")
async def get_all_risks():
    return await db.risk_alerts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)

@app.get("/api/risks/{shipment_id}")
async def get_shipment_risks(shipment_id: str):
    return await db.risk_alerts.find({"shipment_id": shipment_id}, {"_id": 0}).sort("created_at", -1).to_list(50)

# --- Audit PDF Report ---
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

    return Response(
        content=bytes(pdf.output()),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=audit_{shipment_id}.pdf"}
    )

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
