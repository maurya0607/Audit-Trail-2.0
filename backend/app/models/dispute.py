from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class DisputeModel(BaseModel):
    dispute_id: str
    shipment_id: str
    raised_by: str
    dispute_type: str
    claims: Dict[str, Any]
    evidence_ids: List[str] = []
    ai_investigation_summary: Optional[str] = None
    final_verdict: Optional[str] = None
    decision_status: str = "OPEN"
    created_at: str
