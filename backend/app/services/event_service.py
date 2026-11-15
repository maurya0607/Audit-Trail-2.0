import uuid
from datetime import datetime, timezone
from fastapi import HTTPException
from app.database import db
from app.services.hash_service import GENESIS_HASH, compute_event_hash
from app.services.gemini_service import analyze_event_risk

TERMINAL_EVENTS = {"DELIVERED", "CANCELLED"}

async def process_and_ingest_event(payload) -> dict:
    ev_id = payload.event_id or f"evt_{uuid.uuid4().hex[:10]}"

    # 1. Idempotency / Duplicate Check
    if await db.events.find_one({"event_id": ev_id}):
        raise HTTPException(status_code=409, detail=f"Duplicate event_id '{ev_id}' rejected.")

    # 2. Sequence & State Order Validation
    last_event = await db.events.find_one(
        {"shipment_id": payload.shipment_id}, sort=[("sequence_number", -1)]
    )
    if last_event and last_event["event_type"] in TERMINAL_EVENTS:
        raise HTTPException(
            status_code=400,
            detail=f"Out-of-order event rejected: Shipment {payload.shipment_id} is already {last_event['event_type']}."
        )

    seq_num = (last_event["sequence_number"] + 1) if last_event else 1
    prev_hash = last_event["event_hash"] if last_event else GENESIS_HASH
    timestamp = datetime.now(timezone.utc).isoformat()

    # 3. SHA-256 Hash Chaining
    ev_hash = compute_event_hash(
        ev_id, payload.shipment_id, seq_num, payload.event_type, payload.event_data, timestamp, prev_hash
    )

    event_doc = {
        "event_id": ev_id,
        "shipment_id": payload.shipment_id,
        "sequence_number": seq_num,
        "event_type": payload.event_type,
        "event_data": payload.event_data,
        "timestamp": timestamp,
        "previous_hash": prev_hash,
        "event_hash": ev_hash
    }
    await db.events.insert_one(event_doc)

    # 4. Update Current Read Projection (CQRS)
    await db.shipments.update_one(
        {"shipment_id": payload.shipment_id},
        {"$set": {"current_status": payload.event_type, "last_updated": timestamp}}
    )

    # 5. Periodic Snapshot Optimization (every 5 events)
    if seq_num % 5 == 0:
        all_so_far = await db.events.find({"shipment_id": payload.shipment_id}, {"_id": 0}).sort("sequence_number", 1).to_list(500)
        merged_state = {}
        for item in all_so_far:
            merged_state.update(item["event_data"])
        await db.snapshots.insert_one({
            "shipment_id": payload.shipment_id,
            "sequence_number": seq_num,
            "shipment_state": merged_state,
            "last_event_hash": ev_hash,
            "created_at": timestamp
        })

    # 6. Hybrid AI Risk Detection
    recent_events = await db.events.find({"shipment_id": payload.shipment_id}, {"_id": 0}).sort("sequence_number", -1).to_list(5)
    risk_result = analyze_event_risk(payload.event_type, payload.event_data, recent_events)

    alert_doc = None
    if risk_result["risk_score"] > 25:
        alert_doc = {
            "shipment_id": payload.shipment_id,
            "event_id": ev_id,
            "risk_score": risk_result["risk_score"],
            "severity": risk_result["severity"],
            "risk_type": risk_result["risk_type"],
            "ai_explanation": risk_result["ai_explanation"],
            "created_at": timestamp
        }
        await db.risk_alerts.insert_one(alert_doc)
        alert_doc.pop("_id", None)

    event_doc.pop("_id", None)
    return {"event": event_doc, "risk_assessment": risk_result, "alert_created": alert_doc}