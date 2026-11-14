# Audit-Trail-2.0 — API Specification

Base Endpoint: `http://localhost:8000/api/v1`

---

## 1. Authentication & Identity Endpoints

### 1.1 Authenticate User
- **Endpoint**: `POST /auth/login`
- **Request Body**:
  ```json
  {
    "email": "sarah.chen@globalaudit.org",
    "password": "string"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "jwt_token_string",
    "token_type": "bearer",
    "user": {
      "id": "USR-AUD-01",
      "name": "Dr. Sarah Chen",
      "email": "sarah.chen@globalaudit.org",
      "role": "AUDITOR",
      "organization": "Global Compliance Bureau"
    }
  }
  ```

### 1.2 Register Profile
- **Endpoint**: `POST /auth/register`
- **Request Body**:
  ```json
  {
    "name": "Marcus Vance",
    "email": "marcus.v@aerocold.com",
    "password": "string",
    "role": "CARRIER",
    "organization": "AeroCold Logistics Global"
  }
  ```

---

## 2. Shipment & Telemetry Endpoints

### 2.1 List Shipments
- **Endpoint**: `GET /shipments`
- **Query Params**: `status` (optional: `IN_TRANSIT`, `CUSTOMS_HOLD`, `EXCURSION_ALERT`)
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "SHP-88219-DXB",
      "title": "Biopharma Vaccines (Cold Chain)",
      "origin": "Basel, Switzerland",
      "destination": "Dubai Health Hub, UAE",
      "carrier": "AeroCold Global",
      "status": "IN_TRANSIT",
      "temperature_celsius": 3.8,
      "risk_level": "LOW",
      "tamper_status": "VERIFIED"
    }
  ]
  ```

### 2.2 Record Sensor Telemetry Event
- **Endpoint**: `POST /shipments/{id}/events`
- **Request Body**:
  ```json
  {
    "event_type": "COLD_CHAIN_TELEMETRY",
    "location": "Flight LX108 (38,000 ft)",
    "custodian": "Swiss WorldCargo AG",
    "payload": {
      "temperature_celsius": 3.8,
      "humidity_percent": 45.2,
      "shock_g_force": 0.08,
      "compressor_active": true
    }
  }
  ```

---

## 3. Cryptographic Audit Trail Endpoints

### 3.1 Fetch Audit Chain
- **Endpoint**: `GET /audit-trail/{shipment_id}`
- **Response (200 OK)**:
  ```json
  {
    "shipment_id": "SHP-88219-DXB",
    "total_blocks": 4,
    "chain_status": "VALID",
    "blocks": [
      {
        "index": 0,
        "timestamp": "2026-11-14T08:15:22Z",
        "event_type": "GENESIS_DISPATCH",
        "payload_hash": "a718c29038ba9812e81a",
        "previous_hash": "0000000000000000000000000000000000000000000000000000000000000000",
        "event_hash": "9d4f8e12a819b48c1092a01347890bcaf89211d0831a482b8f9e018a38217f2a"
      }
    ]
  }
  ```

### 3.2 Verify Chain Integrity
- **Endpoint**: `POST /audit-trail/verify`
- **Request Body**: `{"shipment_id": "SHP-88219-DXB"}`
- **Response (200 OK)**:
  ```json
  {
    "shipment_id": "SHP-88219-DXB",
    "is_valid": true,
    "broken_at_index": null,
    "blocks_verified": 4,
    "verification_time_ms": 1.42,
    "message": "All cryptographic blocks verified with 100% SHA-256 chain continuity."
  }
  ```

---

## 4. AI Risk Radar Endpoints

### 4.1 Get Active Risk Warnings
- **Endpoint**: `GET /risks/active`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "RSK-991",
      "severity": "HIGH",
      "category": "TEMPERATURE_EXCURSION",
      "shipment_id": "SHP-77103-LAX",
      "title": "Cold-Chain Excursion Risk (+6.4°C over threshold)",
      "confidence_score": 0.94,
      "recommended_action": "Automated notification dispatched to carrier refrigeration dispatch."
    }
  ]
  ```

---

## 5. Dispute Resolution Endpoints

### 5.1 File Claim
- **Endpoint**: `POST /disputes`
- **Request Body**:
  ```json
  {
    "shipment_id": "SHP-77103-LAX",
    "claimant": "FreshMart Organics LLC",
    "claim_type": "Perishable Produce Spoilage",
    "disputed_amount_usd": 24500.00
  }
  ```

### 5.2 Auto-Resolve Dispute
- **Endpoint**: `POST /disputes/{id}/resolve`
- **Response (200 OK)**:
  ```json
  {
    "dispute_id": "DSP-2026-081",
    "verdict": "CARRIER_LIABLE",
    "liability_percentage": 100.0,
    "settlement_amount_usd": 24500.00,
    "audit_proof_hash": "9a8f10bc39104fa2891cd01948ba",
    "evidence_summary": "Block #5 verified refrigeration compressor off-state for 3h 12m during NorthStar custody."
  }
  ```
