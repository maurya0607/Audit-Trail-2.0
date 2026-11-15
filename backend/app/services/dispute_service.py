import uuid
import hashlib
from datetime import datetime, timezone
from fastapi import HTTPException
from app.database import db
from app.services.gemini_service import investigate_dispute_ai

async def create_new_dispute(payload) -> dict:
    dispute_id = f"DSP-2026-{uuid.uuid4().hex[:3].upper()}"
    doc = {
        "dispute_id": dispute_id,
        "shipment_id": payload.shipment_id,
        "raised_by": payload.raised_by,
        "dispute_type": payload.dispute_type,
        "disputed_amount_usd": payload.disputed_amount_usd,
        "claims": payload.claims,
        "evidence_ids": [],
        "ai_investigation_summary": None,
        "final_verdict": None,
        "decision_status": "OPEN",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.disputes.insert_one(doc)
    doc.pop("_id", None)
    return doc

async def add_evidence_to_dispute(dispute_id: str, payload) -> dict:
    dispute = await db.disputes.find_one({"dispute_id": dispute_id})
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")

    ev_id = f"EVD-{uuid.uuid4().hex[:6].upper()}"
    file_hash = hashlib.sha256(f"{payload.file_reference}|{payload.party_role}".encode()).hexdigest()

    doc = {
        "evidence_id": ev_id,
        "dispute_id": dispute_id,
        "shipment_id": dispute["shipment_id"],
        "submitted_by": payload.submitted_by,
        "party_role": payload.party_role,
        "evidence_type": payload.evidence_type,
        "file_reference": payload.file_reference,
        "file_hash": file_hash,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.evidence.insert_one(doc)
    await db.disputes.update_one({"dispute_id": dispute_id}, {"$push": {"evidence_ids": ev_id}})
    doc.pop("_id", None)
    return doc

async def trigger_dispute_ai_investigation(dispute_id: str) -> dict:
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
