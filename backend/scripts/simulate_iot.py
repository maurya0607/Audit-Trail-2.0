import time
import requests

BASE_URL = "http://127.0.0.1:8000"

def run_demo_simulation():
    print("🚀 Starting Audit Trail 2.0 Live IoT & Dispute Simulation...")

    # 1. Create Biopharma Shipment (Matches Frontend UI)
    shipment = {
        "shipment_id": "SHP-88219-DXB",
        "cargo_name": "Biopharma Vaccines (Cold Chain)",
        "supplier_id": "Novartis Pharma AG",
        "transporter_id": "Swiss WorldCargo AG",
        "receiver_id": "Dubai Health Hub UAE",
        "origin": "Basel, Switzerland",
        "destination": "Dubai Health Hub, UAE"
    }
    r = requests.post(f"{BASE_URL}/api/shipments", json=shipment)
    print("1. Shipment Created:", r.status_code)

    # 2. Stream Sequential Events (Normal -> Thermal Spike -> Recovery)
    events = [
        {"shipment_id": "SHP-88219-DXB", "event_type": "GENESIS_DISPATCH", "event_data": {"custodian": "Novartis Pharma AG", "location": "Basel Bio Logistics Hub", "temperature_c": 3.8, "boxes": 100}},
        {"shipment_id": "SHP-88219-DXB", "event_type": "CUSTODY_TRANSFER", "event_data": {"custodian": "Swiss WorldCargo AG", "location": "Zurich Airport Cargo Bay 4", "temperature_c": 4.1, "boxes": 100}},
        {"shipment_id": "SHP-88219-DXB", "event_type": "EXCURSION_ALERT", "event_data": {"custodian": "Swiss WorldCargo AG", "location": "In-Flight Cargo Hold LX108", "temperature_c": 14.2, "status": "COMPRESSOR_FAULT", "boxes": 100}},
        {"shipment_id": "SHP-88219-DXB", "event_type": "CHECKPOINT_CUSTOMS", "event_data": {"custodian": "Emirates SkyCargo Ground", "location": "Dubai International DWC Hub", "temperature_c": 4.5, "boxes": 92}}
    ]

    for ev in events:
        res = requests.post(f"{BASE_URL}/api/events/ingest", json=ev).json()
        print(f"   -> Recorded {ev['event_type']} | Risk Score: {res['risk_assessment']['risk_score']}")
        time.sleep(1)

    # 3. Raise Multi-Party Dispute & Trigger Gemini AI Investigation
    dispute_payload = {
        "shipment_id": "SHP-88219-DXB",
        "raised_by": "Dubai Health Hub UAE (Receiver)",
        "dispute_type": "Cold-Chain Spoilage & Quantity Shortage (8 Boxes Missing)",
        "disputed_amount_usd": 24500.0,
        "claims": {
            "supplier": "Dispatched 100 sealed vaccine boxes at 3.8°C",
            "transporter": "Picked up 100 boxes; minor flight turbulence reported",
            "receiver": "Received only 92 boxes and thermal logger recorded 14.2°C spike"
        }
    }
    dsp = requests.post(f"{BASE_URL}/api/disputes/raise", json=dispute_payload).json()
    dsp_id = dsp["dispute_id"]
    print(f"3. Dispute Raised: {dsp_id}")

    requests.post(f"{BASE_URL}/api/disputes/{dsp_id}/evidence", json={
        "submitted_by": "Novartis Dispatch", "party_role": "Supplier",
        "evidence_type": "Dispatch Packing List & Thermal Seal", "file_reference": "inv_basel_88219.pdf"
    })
    inv = requests.post(f"{BASE_URL}/api/disputes/{dsp_id}/investigate").json()
    print("4. Gemini AI Investigation Summary Generated:\n", inv["ai_investigation_summary"])

if __name__ == "__main__":
    run_demo_simulation()