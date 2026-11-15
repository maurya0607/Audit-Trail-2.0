from fastapi import APIRouter
from app.schemas.event_schema import EventIngest
from app.services.event_service import process_and_ingest_event
from app.websocket.manager import ws_manager

router = APIRouter(prefix="/api/events", tags=["Event Ingestion"])

@router.post("/ingest")
async def ingest_event(payload: EventIngest):
    result = await process_and_ingest_event(payload)
    if result.get("alert_created"):
        await ws_manager.broadcast({"type": "RISK_ALERT", "data": result["alert_created"]})
    await ws_manager.broadcast({
        "type": "NEW_EVENT",
        "shipment_id": payload.shipment_id,
        "sequence_number": result["event"]["sequence_number"]
    })
    return result
