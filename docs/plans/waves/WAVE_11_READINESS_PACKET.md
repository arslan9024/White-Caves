# Wave 11 — Readiness Packet

**Wave:** 11  
**Focus:** Incomplete Features Closure + Architecture Refactor  
**Status:** 🔮 Backlog  
**Date:** 2026-05-22  
**Readiness Score:** 60% (meets unlock threshold; activates when Wave 10 completes)

---

## Gate Checklist

| Gate                     | Check                                                 | Status              |
| ------------------------ | ----------------------------------------------------- | ------------------- |
| Wave 10 complete         | Performance + SEO + security green                    | ⬜ Pending Wave 10  |
| `npm run plans:validate` | Planning governance pass                              | ✅ Confirmed May 22 |
| Business rules           | `IMPROVEMENTS_INCOMPLETE_FEATURES.md` fully specified | ✅                  |
| API contract             | New routes designed in SDD                            | ✅                  |
| PDF/Excel tech choice    | `puppeteer` + `exceljs`                               | ✅                  |
| Cron tech choice         | `node-cron`                                           | ✅                  |
| Test scenarios           | Service tests + integration tests                     | ✅                  |
| Rollback plan            | Feature flags or route removal                        | ✅                  |

---

## Risk Assessment

| Risk                                                   | Likelihood | Impact | Mitigation                                      |
| ------------------------------------------------------ | ---------- | ------ | ----------------------------------------------- |
| Puppeteer adds large binary to build                   | Medium     | Medium | Use `puppeteer-core` + system Chrome in CI      |
| Cron jobs double-fire on multi-instance                | Low        | High   | Overlap-safe ticks (already pattern in Wave 04) |
| Excel export OOM on large datasets                     | Low        | Medium | Streaming ExcelJS writer; paginate at 10k rows  |
| Error handler refactor breaks existing error contracts | Medium     | High   | Test each route before + after; staged rollout  |

---

## Dependency Chain

```
IMPROVEMENTS_INCOMPLETE_FEATURES.md (Items 6, 7, 8)
  → Wave 11 SDD (design)
  → Wave 11 Implementation Backlog (task list)
  → Wave 11 Test Rollout (validation)

IMPROVEMENTS_ARCHITECTURE.md
  → Wave 11 SDD (architecture section)
  → Wave 11 Implementation Backlog (W11-018 to W11-020)
```

---

## Estimated Effort

| Cluster                | Owner            | Estimated Sessions |
| ---------------------- | ---------------- | ------------------ |
| F1 Scheduler           | @Mira            | 2 sessions         |
| F2 Documents           | @Barbara         | 3 sessions         |
| F3 Email wiring        | @Mira + @Daniela | 1 session          |
| Architecture refactors | @Mira + @Ada     | 2 sessions         |

**Total: ~8 focused sessions**
