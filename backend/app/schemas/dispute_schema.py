from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class DisputeRaise(BaseModel):
    shipment_id: str
    raised_by: str
    dispute_type: str
    disputed_amount_usd: float = 0.0
    claims: Dict[str, Any]

class EvidenceSubmit(BaseModel):
    submitted_by: str
    party_role: str
    evidence_type: str
    file_reference: str

class DisputeResolve(BaseModel):
    resolved_by: str
    final_verdict: str
    decision_status: str = "RESOLVED"
