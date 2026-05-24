# Wave 14 — Test Rollout Plan

**Wave:** 14  
**Focus:** Product Features  
**Status:** 📋 Planned  
**Date:** 2026-05-24

---

| Area | Validation | Pass Condition |
| --- | --- | --- |
| Lead scoring triggers | unit/integration tests | score updates on lifecycle events |
| Audit log UI | component + API integration tests | filters and pagination return consistent results |
| Mortgage API | route tests | stable formula outputs across scenarios |
| Calendar sync | integration tests | event create/sync succeeds with valid auth |
| Multi-currency | route tests | rates cached and conversion consistent |
| Regression | `npm run build && npm run plans:validate` | both pass |
