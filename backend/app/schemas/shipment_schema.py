from pydantic import BaseModel, Field
from typing import Optional

class ShipmentCreate(BaseModel):
    shipment_id: str = Field(..., min_length=3)
    cargo_name: str = "Biopharma Vaccines (Cold Chain)"
    supplier_id: str
    transporter_id: str
    receiver_id: str
    origin: str
    destination: str

class ShipmentResponse(BaseModel):
    shipment_id: str
    cargo_name: str
    supplier_id: str
    transporter_id: str
    receiver_id: str
    origin: str
    destination: str
    current_status: str
    created_at: str
