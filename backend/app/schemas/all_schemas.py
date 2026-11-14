from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = "Logistics Manager"

class UserLogin(BaseModel):
    email: str
    password: str

class ShipmentCreate(BaseModel):
    shipment_id: str
    cargo_name: str = "Biopharma Vaccines (Cold Chain)"
    supplier_id: str
    transporter_id: str
    receiver_id: str
    origin: str
    destination: str

class EventIngest(BaseModel):
    event_id: Optional[str] = None
    shipment_id: str
    event_type: str  # GENESIS_DISPATCH, PICKED_UP, IN_TRANSIT, COLD_CHAIN_TELEMETRY, EXCURSION_ALERT, DELIVERED
    event_data: Dict[str, Any]

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