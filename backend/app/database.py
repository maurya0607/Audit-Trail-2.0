import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "audit_trail_db")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

async def init_db_indexes():
    await db.events.create_index("event_id", unique=True)
    await db.events.create_index([("shipment_id", 1), ("sequence_number", 1)], unique=True)
    await db.shipments.create_index("shipment_id", unique=True)