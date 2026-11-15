from pydantic import BaseModel, Field
from typing import Dict, Any

class EventModel(BaseModel):
    event_id: str
    shipment_id: str
    sequence_number: int
    event_type: str
    event_data: Dict[str, Any]
    timestamp: str
    previous_hash: str
    event_hash: str
