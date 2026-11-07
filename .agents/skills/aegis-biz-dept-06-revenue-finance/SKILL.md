---
name: aegis-biz-dept-06-revenue-finance
description: SOPs, UAE 5% VAT, 9% Corporate Tax reserves, commission splits, and escrow sync for Dept 06
---

# AEGIS Business Dept 06: Treasury, Invoicing & Financial Operations

## 1. Department Overview & SLA Watchdog
- **Standard SLA:** 15-minute P0 watchdog response.
- **Latency Standard:** Sub-10ms in-memory cache lookup.
- **Statutory Rules:** Strict alignment with UAE DLD, RERA, and FTA tax standards.

## 2. Operational Procedures
- Run autonomous department engine: `node .agents/zoe-business-assistants/dept-06-revenue-finance/dept.engine.js`
- Execute continuous validation and pipeline synchronization.
- Maintain immutable audit trail of customer interactions and transactional records.
