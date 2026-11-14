import hashlib
import json

GENESIS_HASH = "0" * 64

def compute_event_hash(event_id: str, shipment_id: str, sequence_number: int,
                       event_type: str, event_data: dict, timestamp: str,
                       previous_hash: str) -> str:
    payload_str = json.dumps(event_data, sort_keys=True)
    raw_string = f"{event_id}|{shipment_id}|{sequence_number}|{event_type}|{payload_str}|{timestamp}|{previous_hash}"
    return hashlib.sha256(raw_string.encode("utf-8")).hexdigest()

def verify_event_chain(events: list) -> dict:
    if not events:
        return {"is_valid": True, "total_events": 0, "message": "No events recorded yet."}

    expected_prev_hash = GENESIS_HASH
    for ev in events:
        if ev["previous_hash"] != expected_prev_hash:
            return {
                "is_valid": False,
                "tampered_at_sequence": ev["sequence_number"],
                "tampered_event_id": ev["event_id"],
                "message": f"CHAIN BROKEN at Block #{ev['sequence_number']}: previous_hash mismatch."
            }
        recalculated = compute_event_hash(
            ev["event_id"], ev["shipment_id"], ev["sequence_number"],
            ev["event_type"], ev["event_data"], ev["timestamp"], ev["previous_hash"]
        )
        if recalculated != ev["event_hash"]:
            return {
                "is_valid": False,
                "tampered_at_sequence": ev["sequence_number"],
                "tampered_event_id": ev["event_id"],
                "message": f"TAMPER ALERT at Block #{ev['sequence_number']} ({ev['event_id']}): Record modified!"
            }
        expected_prev_hash = ev["event_hash"]

    return {
        "is_valid": True,
        "total_events": len(events),
        "latest_hash": expected_prev_hash,
        "message": "SHA-256 SYNCED: All blocks cryptographically verified."
    }