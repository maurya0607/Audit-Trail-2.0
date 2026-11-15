from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class EventIngest(BaseModel):
    event_id: Optional[str] = None
    shipment_id: str
    event_type: str  # DISPATCHED, PICKED_UP, IN_TRANSIT, TEMP_LOG, DELAY_DETECTED, DELIVERED, DISPUTE_RAISED
    event_data: Dict[str, Any]

class EventResponse(BaseModel):
    event_id: str
    shipment_id: str
    sequence_number: int
    event_type: str
    event_data: Dict[str, Any]
    timestamp: str
    previous_hash: str
    event_hash: str
