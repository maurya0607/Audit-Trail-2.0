# Audit-Trail-2.0 — Project Overview

An AI-powered logistics auditing and shipment tracking platform featuring real-time telemetry monitoring, tamper-evident cryptographic event chains, and evidence-based dispute resolution.

---

## 1. Executive Summary
Global supply chains suffer from multi-billion dollar dispute delays, undetected cold-chain spoilage, and repudiation of responsibility between carriers, consignors, and consignees.

**Audit-Trail-2.0** solves this with a zero-trust provenance engine:
1. **Immutable Cryptographic Ledger**: Every sensor reading, customs checkpoint, and custody handoff is cryptographically chained using SHA-256 block hashes. Any post-facto data alteration is mathematically detected.
2. **Predictive AI Risk Radar**: Continuous evaluation of sensor data (temperature, shock, humidity) and transit corridors flags anomalies before irreversible loss occurs.
3. **Automated Evidence-Based Dispute Arbitration**: Disputed shipments are automatically correlated against non-repudiable audit proofs to calculate liability in seconds without manual overhead.
4. **Role-Based Access Control (RBAC)**: Distinct permissions for Compliance Auditors, Logistics Carriers, Cargo Consignees, and System Administrators.

---

## 2. Completed Milestones

### Hour 1: Core Setup & UI Foundations
- Project scaffolding: Clean separation between `frontend/`, `backend/`, and `docs/`.
- Modern frontend build: React 18, Vite, Tailwind CSS, PostCSS, and Lucide React vector icons.
- Seamless Dark & Light theme switching with localStorage persistence.
- Zero-emoji enterprise styling following Linear/Stripe design standards.
- Hackathon-grade Stats Cards featuring live SVG sparkline curves, animated beacon indicators, and overflow-safe typography.

### Hour 2: Authentication & Role-Based Navigation
- Centralized Authentication Context (`AuthContext.jsx`) managing session persistence and active roles.
- Modal authentication interface (`AuthModal.jsx`) supporting Sign In and New Profile Registration.
- 1-Click Demo Profiles for instant Hackathon judging evaluations:
  - Dr. Sarah Chen (Compliance Auditor)
  - Marcus Vance (Logistics Carrier)
  - Elena Rostova (Cargo Consignee)
  - Vishal Maurya (Platform Admin)
- Dynamic role-based navigation filtering: tabs adapt automatically according to role authority.
- Live role switcher strip embedded on the dashboard for seamless feature demonstrations.
