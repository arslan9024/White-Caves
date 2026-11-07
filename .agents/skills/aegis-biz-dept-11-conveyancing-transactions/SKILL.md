---
name: aegis-biz-dept-11-conveyancing-transactions
description: SOPs, title deed registrations, NOC issuances, escrow settlements, and trustee transfers for Dept 11
---

# AEGIS Business Dept 11: Conveyancing & Trustee Transfers

## 1. Department Overview & SLA Watchdog
- **Standard SLA:** 15-minute P0 watchdog response.
- **Latency Standard:** Sub-10ms in-memory cache lookup.
- **Statutory Rules:** Strict alignment with UAE DLD, RERA, and FTA tax standards.

## 2. Operational Procedures
- Run autonomous department engine: `node .agents/zoe-business-assistants/dept-11-conveyancing-transactions/dept.engine.js`
- Execute continuous validation and pipeline synchronization.
- Maintain immutable audit trail of customer interactions and transactional records.
