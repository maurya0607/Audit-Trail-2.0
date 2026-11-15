from pydantic import BaseModel, Field

class EvidenceModel(BaseModel):
    evidence_id: str
    dispute_id: str
    shipment_id: str
    submitted_by: str
    party_role: str
    evidence_type: str
    file_reference: str
    file_hash: str
    timestamp: str
