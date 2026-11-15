import uuid
import hashlib
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.database import db
from app.schemas.all_schemas import DisputeRaise, EvidenceSubmit, DisputeResolve
from app.services.gemini_service import investigate_dispute_ai

router = APIRouter(prefix="/api/disputes", tags=["Multi-Party Disputes"])

@router.post("/raise")
async def raise_dispute(req: DisputeRaise):
    dispute_id = f"DSP-2026-{uuid.uuid4().hex[:3].upper()}"
    doc = {
        "dispute_id": dispute_id,
        "shipment_id": req.shipment_id,
        "raised_by": req.raised_by,
        "dispute_type": req.dispute_type,
        "disputed_amount_usd": req.disputed_amount_usd,
        "claims": req.claims,
        "evidence_ids": [],
        "ai_investigation_summary": None,
        "final_verdict": None,
        "decision_status": "OPEN",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.disputes.insert_one(doc)
    doc.pop("_id", None)
    return doc

@router.get("")
async def list_disputes():
    return await db.disputes.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)

@router.get("/{dispute_id}")
async def get_dispute_details(dispute_id: str):
    dispute = await db.disputes.find_one({"dispute_id": dispute_id}, {"_id": 0})
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    evidence = await db.evidence.find({"dispute_id": dispute_id}, {"_id": 0}).to_list(100)
    return {**dispute, "evidence_list": evidence}

@router.post("/{dispute_id}/evidence")
async def submit_evidence(dispute_id: str, req: EvidenceSubmit):
    dispute = await db.disputes.find_one({"dispute_id": dispute_id})
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")

    ev_id = f"EVD-{uuid.uuid4().hex[:6].upper()}"
    file_hash = hashlib.sha256(f"{req.file_reference}|{req.party_role}".encode()).hexdigest()
    doc = {
        "evidence_id": ev_id,
        "dispute_id": dispute_id,
        "shipment_id": dispute["shipment_id"],
        "submitted_by": req.submitted_by,
        "party_role": req.party_role,
        "evidence_type": req.evidence_type,
        "file_reference": req.file_reference,
        "file_hash": file_hash,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.evidence.insert_one(doc)
    await db.disputes.update_one({"dispute_id": dispute_id}, {"$push": {"evidence_ids": ev_id}})
    doc.pop("_id", None)
    return doc

@router.post("/{dispute_id}/investigate")
async def run_ai_investigation(dispute_id: str):
    dispute = await db.disputes.find_one({"dispute_id": dispute_id}, {"_id": 0})
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    events = await db.events.find({"shipment_id": dispute["shipment_id"]}, {"_id": 0}).sort("sequence_number", 1).to_list(200)
    evidence = await db.evidence.find({"dispute_id": dispute_id}, {"_id": 0}).to_list(100)
    summary = investigate_dispute_ai(dispute["shipment_id"], dispute["claims"], events, evidence)
    await db.disputes.update_one(
        {"dispute_id": dispute_id},
        {"$set": {"ai_investigation_summary": summary, "decision_status": "UNDER_REVIEW"}}
    )
    return {"dispute_id": dispute_id, "ai_investigation_summary": summary}

@router.patch("/{dispute_id}/resolve")
async def manager_resolve_dispute(dispute_id: str, req: DisputeResolve):
    res = await db.disputes.update_one(
        {"dispute_id": dispute_id},
        {"$set": {
            "final_verdict": req.final_verdict,
            "resolved_by": req.resolved_by,
            "decision_status": req.decision_status,
            "resolved_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Dispute not found")
    return {"dispute_id": dispute_id, "status": req.decision_status, "final_verdict": req.final_verdict}