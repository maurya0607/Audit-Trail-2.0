# Audit-Trail-2.0 System Architecture

## 1. High-Level Architecture

```
+-------------------------------------------------------------------------+
|                        Frontend Layer (React + Vite)                    |
|                                                                         |
|  +--------------------+   +---------------------+   +----------------+  |
|  |    Auth Context    |-->| Dynamic RBAC Navbar |-->| Active Views   |  |
|  +--------------------+   +---------------------+   +----------------+  |
|            |                                                |           |
|            v                                                v           |
|  [Auditor | Carrier | Consignee | Admin]        [Ledger | Telemetry]    |
+-------------------------------------------------------------------------+
                                     |
                                     | REST / JSON APIs
                                     v
+-------------------------------------------------------------------------+
|                        Backend Layer (FastAPI API)                      |
|                                                                         |
|  +--------------------+   +---------------------+   +----------------+  |
|  |  Shipment Service  |   |   Risk Engine AI    |   | Dispute Solver |  |
|  +--------------------+   +---------------------+   +----------------+  |
|            |                         |                      |           |
|            +-------------------------+----------------------+           |
|                                      |                                  |
|                                      v                                  |
|                 +----------------------------------------+              |
|                 | Cryptographic SHA-256 Event Chain Engine|              |
|                 +----------------------------------------+              |
+-------------------------------------------------------------------------+
```

---

## 2. Frontend Component Hierarchy

```
frontend/src/
├── context/
│   └── AuthContext.jsx         # User session, RBAC state, and 1-click role switcher
├── components/
│   ├── Navbar.jsx              # Role-filtered tabs, dark/light toggle, profile menu
│   ├── AuthModal.jsx           # Sign in, registration, and demo profile access
│   ├── StatsCards.jsx          # KPI metrics with dynamic SVG sparkline telemetry
│   ├── ShipmentTracker.jsx     # Live shipment table, sensor data, and status pills
│   ├── AuditLedger.jsx         # SHA-256 block ledger with verification & tamper test
│   ├── RiskAlerts.jsx          # Predictive risk notifications & recommended protocols
│   └── DisputeDesk.jsx         # Non-repudiable claim settlement dossiers
├── App.jsx                     # Layout shell, role banner, and dynamic view routing
└── index.css                   # Custom scrollbars, Tailwind directives, dark theme
```

---

## 3. Cryptographic Audit Chain Mechanics

Every event block in a shipment's audit trail is cryptographically linked to its predecessor:

$$\text{PayloadHash}_n = \text{SHA256}(\text{CanonicalJSON}(\text{Payload}_n))$$

$$\text{EventHash}_n = \text{SHA256}(\text{Index}_n + \text{Timestamp}_n + \text{EventType}_n + \text{PayloadHash}_n + \text{EventHash}_{n-1})$$

### Genesis Block Specification:
- $\text{Index} = 0$
- $\text{PreviousHash} = 0000000000000000000000000000000000000000000000000000000000000000$
- $\text{EventType} = \text{GENESIS\_DISPATCH}$

### Tamper Detection Algorithm ($O(N)$ Complexity):
1. Traverse blocks sequentially from index $0$ to $N$.
2. Recalculate $\text{PayloadHash}$ for block $i$. If it diverges from stored $\text{PayloadHash}$, flag mutation.
3. Recalculate expected $\text{EventHash}_i$ using predecessor hash $\text{EventHash}_{i-1}$.
4. If expected hash diverges from stored hash, identify block $i$ as the point of tampering.
5. If $\text{PreviousHash}_i \neq \text{EventHash}_{i-1}$, flag broken chain linkage.

---

## 4. Role-Based Access Control (RBAC) Matrix

| Feature / View | Compliance Auditor | Logistics Carrier | Cargo Consignee | Platform Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Live Overview (Dashboard)** | Permitted | Permitted | Permitted | Permitted |
| **Shipments Monitoring** | View Only | Full Access | Track Cargo | Full Access |
| **Audit Trail Ledger** | Full Verify | Restricted | Restricted | Full Access |
| **Tamper Simulation Test** | Permitted | Restricted | Restricted | Permitted |
| **AI Risk Monitor** | Review Alerts | Telemetry Action | Status View | Full Access |
| **Dispute Resolution Desk** | Arbitrate & Sign | Respond Only | File & Review | Full Access |
| **System Settings & Keys** | Restricted | Restricted | Restricted | Full Access |
