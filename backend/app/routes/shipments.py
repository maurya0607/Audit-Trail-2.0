from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.database import db
from app.schemas.shipment_schema import ShipmentCreate
from app.middleware.auth_middleware import decode_token

router = APIRouter(prefix="/api/shipments", tags=["Shipment Management"])

@router.post("")
async def create_shipment(shipment: ShipmentCreate):
    doc = shipment.model_dump()
    doc["current_status"] = "CREATED"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    try:
        await db.shipments.insert_one(doc)
    except Exception:
        raise HTTPException(status_code=400, detail="Shipment ID already exists")
    doc.pop("_id", None)
    return doc

@router.get("")
async def list_shipments():
    return await db.shipments.find({}, {"_id": 0}).to_list(100)

@router.get("/{id}")
async def get_shipment(id: str):
    doc = await db.shipments.find_one({"shipment_id": id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return doc

@router.get("/{id}/timeline")
async def get_shipment_timeline(id: str):
    events = await db.events.find({"shipment_id": id}, {"_id": 0}).sort("sequence_number", 1).to_list(500)
    return events
