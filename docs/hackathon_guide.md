# Audit-Trail-2.0 — Hackathon Demo & Pitch Guide

A 3-minute pitch framework designed for judges and evaluators.

---

## 1. The 30-Second Elevator Pitch
> *"Over $35 billion is lost each year in global logistics due to temperature spoilage, cargo theft, and protracted legal disputes where carriers and consignees blame each other. Audit-Trail-2.0 solves this by creating a zero-trust cryptographic audit trail: every sensor reading and custody handoff is chained using SHA-256 blocks. When a dispute occurs, our AI engine cross-references the immutable ledger to determine non-repudiable liability in under 45 seconds."*

---

## 2. Interactive Demo Walkthrough (Step-by-Step)

### Step 1: Real-Time Freight Monitoring & Sparklines
- **Action**: Show the top KPI cards.
- **Talking Point**: *"Judges can see our live freight monitoring with inline SVG sparklines showing real-time trends: 1,428 units monitored across 48 ports with zero chain breaches."*

### Step 2: Role-Based Access Control (RBAC) Demonstration
- **Action**: Use the **Demo Switch** bar on the dashboard.
- **Talking Point**:
  - Click **Carrier**: *"Notice how the navigation bar adapts. A carrier only sees fleet dispatch and telemetry exceptions — they cannot tamper with compliance dossiers."*
  - Click **Auditor**: *"Now switching to Dr. Sarah Chen, our Compliance Auditor. The Audit Ledger and Dispute Resolution Desk instantly unlock."*

### Step 3: The Tamper-Evident Ledger Demo
- **Action**: Open the **Audit Trail Ledger** tab.
- **Talking Point**: *"Here is our SHA-256 linked block chain for pharmaceutical vaccines. Click 'Verify Chain' — all 4 blocks show 100% mathematical continuity."*
- **The Wow Factor**: Click **'Simulate Tamper at Block #2'** then click **'Verify Chain'**:
  - *"Watch this: an attacker tries to alter the temperature log after the fact. Our cryptographic engine flags Block #2 with a mathematically proven hash mismatch instantly."*

### Step 4: Evidence-Based Dispute Resolution Desk
- **Action**: Open the **Dispute Desk** tab.
- **Talking Point**: *"Here is an active $24,500 spoilage claim. Rather than months of litigation, our platform links Block #5's compressor telemetry to the carrier's timestamped custody, generating a non-repudiable liability verdict automatically."*

---

## 3. Anticipated Judge Q&A

**Q: Is this a blockchain?**
> **A:** *"It uses the same cryptographic primitive — SHA-256 Merkle hash-chaining — but without the energy overhead, gas fees, and latency of proof-of-work blockchains. It runs at microsecond speeds ideal for enterprise IoT logistics."*

**Q: How does this prevent fake data injection?**
> **A:** *"Each hardware sensor and carrier custodian signs their payload cryptographically at ingestion. Any retroactive edit breaks the chain continuity immediately."*

**Q: What is the tech stack?**
> **A:** *"Frontend is React 18, Vite, and Tailwind CSS with custom SVG telemetry curves. Backend is FastAPI with asynchronous cryptographic hashing modules."*
