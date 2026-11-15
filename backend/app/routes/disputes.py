from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.database import db
from app.schemas.dispute_schema import DisputeRaise, EvidenceSubmit, DisputeResolve
from app.services.dispute_service import create_new_dispute, add_evidence_to_dispute, trigger_dispute_ai_investigation

router = APIRouter(prefix="/api/disputes", tags=["Multi-Party Disputes"])

@router.post("/raise")
async def raise_dispute(req: DisputeRaise):
    return await create_new_dispute(req)

@router.get("")
async def list_disputes():
    return await db.disputes.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)

@router.get("/{id}")
async def get_dispute_details(id: str):
    dispute = await db.disputes.find_one({"dispute_id": id}, {"_id": 0})
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")
    evidence = await db.evidence.find({"dispute_id": id}, {"_id": 0}).to_list(100)
    return {**dispute, "evidence_list": evidence}

@router.post("/{id}/evidence")
async def submit_evidence(id: str, req: EvidenceSubmit):
    return await add_evidence_to_dispute(id, req)

@router.post("/{id}/investigate")
async def run_ai_investigation(id: str):
    return await trigger_dispute_ai_investigation(id)

@router.patch("/{id}/resolve")
async def manager_resolve_dispute(id: str, req: DisputeResolve):
    res = await db.disputes.update_one(
        {"dispute_id": id},
        {"$set": {
            "final_verdict": req.final_verdict,
            "resolved_by": req.resolved_by,
            "decision_status": req.decision_status,
            "resolved_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Dispute not found")
    return {"dispute_id": id, "status": req.decision_status, "final_verdict": req.final_verdict}
