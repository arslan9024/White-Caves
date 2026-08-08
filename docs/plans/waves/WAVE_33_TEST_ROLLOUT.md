# Wave 33 — Test Rollout

**Wave:** 33  
**Status:** planned  
**Date:** 2026-08-07

---

## Validation Matrix

| Scope | Validation Type | Target | Pass Criteria |
| --- | --- | --- | --- |
| Business docs root | Markdown diagnostics | `docs/business_docs/README.md` | No markdown diagnostics |
| CRM features root | Markdown diagnostics + inventory review | `docs/business_docs/09_crm_features/README.md` | No markdown diagnostics + later-wave docs listed |
| Requirements front door | Link review + markdown diagnostics | `docs/business_docs/05_requirements/README.md` | Canonical references only |
| Requirements framework | Reference audit | `docs/business_docs/05_requirements/requirements-framework.md` | Dead/non-canonical references resolved or retired |
| Scenario posture | Content review | `docs/business_docs/13_testing/uat-scenarios.md` | Exception/regression/compliance framing visible |
| Release management root | Freshness review | `docs/business_docs/15_release_management/README.md` | No stale pre-July 2026 operational framing |
| Planning sync | Script | `npm run plans:validate` | Pass |

## Suggested Commands

- `npm run plans:validate`
- Markdown diagnostics on all touched business-doc and planning files

## Evidence Capture

- before/after business-doc index snapshot
- business-doc coverage matrix snapshot
- acceptance-criteria gap log snapshot
- tracker snapshot after Wave 33 registration
