---
name: aegis-biz-dept-05-asset-facilities
description: SOPs, IoT facility monitoring, work orders, and maintenance SLA enforcement for Dept 05
---

# AEGIS Business Dept 05: Community Facilities & Asset Management

## 1. Department Overview & SLA Watchdog
- **Standard SLA:** 15-minute P0 watchdog response.
- **Latency Standard:** Sub-10ms in-memory cache lookup.
- **Statutory Rules:** Strict alignment with UAE DLD, RERA, and FTA tax standards.

## 2. Operational Procedures
- Run autonomous department engine: `node .agents/zoe-business-assistants/dept-05-asset-facilities/dept.engine.js`
- Execute continuous validation and pipeline synchronization.
- Maintain immutable audit trail of customer interactions and transactional records.
