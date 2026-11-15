from fastapi import APIRouter
from app.database import db
from app.services.hash_service import verify_event_chain
from app.services.replay_service import replay_shipment_state

router = APIRouter(prefix="/api/ledger", tags=["Cryptographic Ledger & Replay"])

@router.get("/verify/{shipment_id}")
async def verify_ledger(shipment_id: str):
    events = await db.events.find({"shipment_id": shipment_id}, {"_id": 0}).sort("sequence_number", 1).to_list(1000)
    return verify_event_chain(events)

@router.get("/replay/{shipment_id}")
async def replay_ledger(shipment_id: str, seq: int = 1):
    return await replay_shipment_state(shipment_id, seq)
