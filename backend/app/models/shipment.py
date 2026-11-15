from pydantic import BaseModel, Field
from typing import Optional

class ShipmentModel(BaseModel):
    shipment_id: str
    supplier_id: str
    transporter_id: str
    receiver_id: str
    origin: str
    destination: str
    current_status: str
    created_at: str
