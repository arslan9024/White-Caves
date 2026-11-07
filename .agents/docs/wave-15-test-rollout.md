# Wave 15 — Test Rollout Plan

**Wave:** 15  
**Focus:** Performance & PWA  
**Status:** 📋 Planned  
**Date:** 2026-05-24

---

| Area | Validation | Pass Condition |
| --- | --- | --- |
| Redis caching | integration tests | cache hit ratio and correctness validated |
| DB pooling | load smoke | no connection exhaustion under test load |
| PWA manifest | browser/lighthouse validation | installable manifest recognized |
| Service worker | offline smoke | offline shell served for cached routes |
| Regression | `npm run build && npm run plans:validate` | both pass |
