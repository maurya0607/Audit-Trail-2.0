from fastapi import APIRouter
from app.database import db

router = APIRouter(prefix="/api/risks", tags=["AI Risk Detection"])

@router.get("")
async def get_all_risks():
    return await db.risk_alerts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)

@router.get("/{shipment_id}")
async def get_shipment_risks(shipment_id: str):
    return await db.risk_alerts.find({"shipment_id": shipment_id}, {"_id": 0}).sort("created_at", -1).to_list(50)
