import os
import re
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Search for .env both in CWD and in backend folder
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
raw_db_name = os.getenv("DB_NAME", "audit_trail_db")
# MongoDB database names cannot contain '.'
DB_NAME = re.sub(r"[ .$/\\ ]", "_", raw_db_name)

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

async def init_db_indexes():
    """
    Creates indexes across all core collections according to Section 3:
    1. users: unique email
    2. shipments: unique shipment_id
    3. events: unique event_id, composite (shipment_id, sequence_number)
    4. disputes: unique dispute_id, shipment_id index
    5. evidence: unique evidence_id, dispute_id index
    6. risk_alerts: shipment_id index, created_at index
    7. snapshots: unique (shipment_id, sequence_number)
    """
    try:
        # 1. users
        await db.users.create_index("email", unique=True)

        # 2. shipments
        await db.shipments.create_index("shipment_id", unique=True)
        await db.shipments.create_index("current_status")

        # 3. events
        await db.events.create_index("event_id", unique=True)
        await db.events.create_index([("shipment_id", 1), ("sequence_number", 1)], unique=True)
        await db.events.create_index([("shipment_id", 1), ("timestamp", 1)])

        # 4. disputes
        await db.disputes.create_index("dispute_id", unique=True)
        await db.disputes.create_index("shipment_id")

        # 5. evidence
        await db.evidence.create_index("evidence_id", unique=True)
        await db.evidence.create_index("dispute_id")
        await db.evidence.create_index("shipment_id")

        # 6. risk_alerts
        await db.risk_alerts.create_index("shipment_id")
        await db.risk_alerts.create_index([("created_at", -1)])

        # 7. snapshots
        await db.snapshots.create_index([("shipment_id", 1), ("sequence_number", 1)], unique=True)
    except Exception as e:
        print(f"Notice: MongoDB index setup pending database availability: {e}")
