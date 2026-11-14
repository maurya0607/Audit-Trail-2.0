from fastapi import HTTPException
from app.database import db

async def replay_shipment_state(shipment_id: str, target_seq: int) -> dict:
    # Check nearest snapshot <= target_seq for fast optimization
    snapshot = await db.snapshots.find_one(
        {"shipment_id": shipment_id, "sequence_number": {"$lte": target_seq}},
        {"_id": 0},
        sort=[("sequence_number", -1)]
    )

    start_seq = 1
    reconstructed_state = {}
    used_snapshot = False

    if snapshot:
        reconstructed_state = dict(snapshot["shipment_state"])
        start_seq = snapshot["sequence_number"] + 1
        used_snapshot = True

    events = await db.events.find(
        {"shipment_id": shipment_id, "sequence_number": {"$gte": start_seq, "$lte": target_seq}},
        {"_id": 0}
    ).sort("sequence_number", 1).to_list(1000)

    if not events and not snapshot:
        raise HTTPException(status_code=404, detail="No events found for this shipment/sequence.")

    for ev in events:
        reconstructed_state.update(ev["event_data"])
        reconstructed_state["last_event_type"] = ev["event_type"]
        reconstructed_state["timestamp"] = ev["timestamp"]

    return {
        "shipment_id": shipment_id,
        "replayed_up_to_sequence": target_seq,
        "snapshot_optimization_used": used_snapshot,
        "reconstructed_state": reconstructed_state
    }