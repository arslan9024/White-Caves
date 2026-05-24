# Wave 13 — Test Rollout Plan

**Wave:** 13  
**Focus:** Real-Time & Media  
**Status:** 📋 Planned  
**Date:** 2026-05-24

---

| Area | Command / Method | Pass Condition |
| --- | --- | --- |
| Socket auth | targeted socket integration tests | unauthenticated socket rejected |
| Notification push | route-to-socket integration tests | event delivered within 2s |
| Upload endpoint | multipart route test | files validated and URLs persisted |
| Image deletion | route test | image removed and metadata updated |
| Virtual tour UI | component + visual smoke check | viewer lazy-loads and renders |
| Regression | `npm run build && npm run plans:validate` | both pass |
