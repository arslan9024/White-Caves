# Discovered Upgrades

Auto-discovered Aegis queue-empty upgrades are appended here when the orchestrator finds a planning gap and seeds a new task.
## 2026-11-07T18:13:40.583Z — Queue-empty discovery run

### DU001 — CSRF coverage for mutation routes
- Feature ID: security-csrf-mutation-routes
- Agent: @S5
- Target file: business_docs/09_crm_features/wave-16-security-hardening.md
- Research basis: OWASP CSRF mitigation requirement for session-backed mutation endpoints
- Score: 125
- Gap evidence: 0/2 signatures matched
- Plan evidence: 0 keyword hits in planning docs
- Scan evidence: 1 keyword hits in codebase scan signals
- Prompt: @S5 -- EXPAND: wave-16-security-hardening.md -> add CSRF coverage plan for all mutation routes, token issuance, validation points, and rollout verification

## 2026-11-07T20:59:56.822Z — Queue-empty discovery run

### DU008 — PDC bounce escalation
- Feature ID: leasing-pdc-bounce-escalation
- Agent: @Victoria
- Target file: business_docs/09_crm_features/tenancy-ejari.md
- Research basis: Dubai leasing ops norms for bounced cheque escalation and landlord notification
- Score: 80
- Gap evidence: 1/2 signatures matched
- Plan evidence: 0 keyword hits in planning docs
- Scan evidence: 0 keyword hits in codebase scan signals
- Prompt: @Victoria -- EXPAND: tenancy-ejari.md -> add bounced PDC escalation flow including cheque-return capture, landlord alerting, grace-period rules, legal escalation checkpoints, and acceptance criteria

## 2026-11-07T21:25:51.782Z — Queue-empty discovery run

### DU009 — AI lead-score re-trigger automation
- Feature ID: ai-lead-score-retrigger
- Agent: @Joelle
- Target file: business_docs/03_ai_assistants/README.md
- Research basis: CRM AI scoring best practice for re-evaluating leads after behavior changes
- Score: 100
- Gap evidence: 0/2 signatures matched
- Plan evidence: 2 keyword hits in planning docs
- Scan evidence: 0 keyword hits in codebase scan signals
- Prompt: @Joelle -- DRAFT: README.md -> add AI lead-score re-trigger automation covering behavior triggers, cooldowns, fallback handling, and audit visibility

### DU010 — AML risk scoring
- Feature ID: compliance-aml-risk-scoring
- Agent: @Sofia
- Target file: business_docs/05_requirements/compliance-requirements.md
- Research basis: UAE AML enhanced due diligence expectations for real-estate brokerages
- Score: 100
- Gap evidence: 0/2 signatures matched
- Plan evidence: 1 keyword hits in planning docs
- Scan evidence: 0 keyword hits in codebase scan signals
- Prompt: @Sofia -- EXPAND: compliance-requirements.md -> add AML risk scoring model covering source-of-funds triggers, PEP checks, sanctions screening, review cadence, and audit outputs

### DU011 — Document template registry
- Feature ID: documents-template-registry
- Agent: @Annie
- Target file: business_docs/09_crm_features/document-generation.md
- Research basis: Enterprise document ops requirement for governed template sets
- Score: 100
- Gap evidence: 0/2 signatures matched
- Plan evidence: 2 keyword hits in planning docs
- Scan evidence: 0 keyword hits in codebase scan signals
- Prompt: @Annie -- EXPAND: document-generation.md -> add a document template registry with versioning, variable maps, approval controls, and deprecation workflow

### DU012 — Mobile analytics view
- Feature ID: analytics-mobile-view
- Agent: @Cassie
- Target file: business_docs/09_crm_features/analytics-dashboard.md
- Research basis: Field-agent mobile KPI access benchmark for broker CRMs
- Score: 100
- Gap evidence: 0/2 signatures matched
- Plan evidence: 1 keyword hits in planning docs
- Scan evidence: 0 keyword hits in codebase scan signals
- Prompt: @Cassie -- EXPAND: analytics-dashboard.md -> add mobile analytics view with compact KPI cards, thumb-friendly filters, offline considerations, and validation criteria

### DU013 — Tenant e-NOC generation
- Feature ID: leasing-enoc-generation
- Agent: @Victoria
- Target file: business_docs/09_crm_features/landlord-portal.md
- Research basis: Dubai tenant services benchmark for bank/visa NOC self-service
- Score: 100
- Gap evidence: 0/2 signatures matched
- Plan evidence: 2 keyword hits in planning docs
- Scan evidence: 0 keyword hits in codebase scan signals
- Prompt: @Victoria -- DRAFT: landlord-portal.md -> add tenant e-NOC generation workflow for bank, visa, and move-out use cases with approval routing, PDF issuance, and audit trail requirements

