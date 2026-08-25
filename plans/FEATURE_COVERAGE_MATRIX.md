# 🗺️ Feature Coverage & Traceability Matrix

> **White Caves Real Estate LLC — AEGIS Governance Framework**
> Last Verified: 2026-08-26 | Policy Version: `v2026.08.13-aegis-vnext-dedup-opt-v1`

| Feature | Business Rule Doc | Workflow Doc | Wave Backlog | Code Module | Test Surface |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Properties & Off-Plan Inventory** | `business_docs/01_business_overview/company-profile.md` | `business_docs/04_workflows/deal-pipeline.md` | `plans/MASTER_PLAN.md` | `src/components/properties/` | `src/components/properties/**/*.test.tsx` |
| **Leasing & Ejari Attestation** | `business_docs/09_crm_features/tenancy-ejari.md` | `business_docs/04_workflows/leasing-workflow.md` | `plans/MASTER_PLAN.md` | `src/components/crm/` | `src/components/crm/**/*.test.ts*` |
| **Theodora Financial Intelligence** | `business_docs/09_crm_features/financial-reporting.md` | `business_docs/04_workflows/financial-reporting.md` | `plans/IN_HOUSE_FINANCE_ACCOUNTING_ROADMAP.md` | `src/components/crm/TheodoraFinanceCRM_NEW/` | `src/hooks/crm/__tests__/useReporting.test.ts` |
| **RERA Compliance & AML Audit** | `business_docs/05_requirements/compliance-requirements.md` | `business_docs/04_workflows/compliance-workflow.md` | `plans/MASTER_PLAN.md` | `src/components/security/` | `src/hooks/crm/__tests__/useCompliance.test.ts` |
| **UHNW VIP Private Vault & Concierge** | `business_docs/09_crm_features/landlord-portal.md` | `business_docs/04_workflows/vip-concierge.md` | `plans/FUTURE_100_TASKS_BACKLOG.md` | `src/components/vip/` | `src/components/vip/**/*.test.tsx` |
| **PWA & Offline Offline Sync** | `business_docs/05_requirements/non-functional-requirements.md` | `business_docs/04_workflows/offline-sync.md` | `plans/MASTER_PLAN.md` | `src/components/pwa/` | `src/components/pwa/**/*.test.ts*` |
| **Henry Document Hub & OCR** | `business_docs/09_crm_features/document-generation.md` | `business_docs/04_workflows/document-workflow.md` | `plans/MASTER_PLAN.md` | `src/components/shared/HenryDocumentHub/` | `src/components/shared/HenryDocumentHub/*.test.ts*` |
| **Zoe & Aurora Autonomous Portals** | `business_docs/03_ai_assistants/README.md` | `business_docs/04_workflows/ai-orchestration.md` | `plans/FUTURE_100_TASKS_BACKLOG.md` | `src/components/dashboard/` | `src/components/dashboard/**/*.test.ts*` |
| **Lead Routing & Pipeline Velocity** | `business_docs/09_crm_features/lead-scoring.md` | `business_docs/04_workflows/lead-routing.md` | `plans/MASTER_PLAN.md` | `src/components/crm/` | `src/components/crm/**/*.test.ts*` |
