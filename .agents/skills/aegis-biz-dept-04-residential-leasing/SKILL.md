---
name: aegis-biz-dept-04-residential-leasing
description: SOPs, tenant screening, Ejari registration, and lease contract management for Dept 04
---

# AEGIS Business Dept 04: Autonomous Leasing & Ejari Operations

## 1. Department Overview & SLA Watchdog
- **Standard SLA:** 15-minute P0 watchdog response.
- **Latency Standard:** Sub-10ms in-memory cache lookup.
- **Statutory Rules:** Strict alignment with UAE DLD, RERA, and FTA tax standards.

## 2. Operational Procedures
- Run autonomous department engine: `node .agents/zoe-business-assistants/dept-04-residential-leasing/dept.engine.js`
- Execute continuous validation and pipeline synchronization.
- Maintain immutable audit trail of customer interactions and transactional records.
