# Scenario Batch A1 — Compliance, Leasing, Finance (0001–0200)

**Status:** Active
**Batch Size:** 200 scenarios
**Priority:** P0 critical controls
**Last Updated:** 2026-08-03

## 1. Scope

This batch covers critical scenarios for:

- compliance document lifecycle,
- regulatory alerts and acknowledgement,
- KYC/AML/PDPL controls,
- Ejari lifecycle and lease compliance,
- commission/vat/reporting controls,
- audit and governance checkpoints.

## 2. Scenario family map

| Family | ID Range | Count | Domain |
| --- | --- | ---: | --- |
| Corporate document register lifecycle | 0001–0030 | 30 | Compliance |
| Expiry and alert engine | 0031–0060 | 30 | Compliance |
| KYC/AML/PDPL controls | 0061–0110 | 50 | Compliance |
| Ejari and tenancy compliance | 0111–0150 | 40 | Leasing |
| Finance reporting and approvals | 0151–0190 | 40 | Finance |
| Audit/governance and closeout | 0191–0200 | 10 | Cross-domain |

## 3. Detailed scenario catalog

| Scenario ID | Title | Primary Actor | Trigger | Expected Outcome | Key Refs |
| --- | --- | --- | --- | --- | --- |
| SCN-COMP-DOC-REGISTER-COMP-0001 | Register corporate credential from manual form | Compliance Manager | New document created | Record stored with immutable create audit event | REQ-COMP-001, POL-RERA-001 |
| SCN-COMP-DOC-REGISTER-COMP-0002 | Register credential with missing optional fields | Compliance Officer | Partial payload submit | Save succeeds with nullable optional fields | REQ-COMP-001, BR-COMP-001 |
| SCN-COMP-DOC-REGISTER-COMP-0003 | Reject create when authority missing | Compliance Officer | Invalid payload | 400 response with validation message | REQ-COMP-002, BR-COMP-002 |
| SCN-COMP-DOC-REGISTER-COMP-0004 | Reject create when title missing | Compliance Officer | Invalid payload | 400 response with validation message | REQ-COMP-002, BR-COMP-002 |
| SCN-COMP-DOC-REGISTER-COMP-0005 | Create credential with sourcePath metadata | Compliance Manager | Manual registry entry | sourcePath retained for audit lineage | REQ-COMP-003, POL-PDPL-001 |
| SCN-COMP-DOC-UPDATE-COMP-0006 | Update reference number | Compliance Manager | Edit action | Versioned update and audit entry generated | REQ-COMP-004, POL-RERA-001 |
| SCN-COMP-DOC-UPDATE-COMP-0007 | Update expiry date across threshold boundary | Compliance Manager | Edit action | Status recalculated and alerts adjusted | REQ-COMP-005, BR-COMP-004 |
| SCN-COMP-DOC-UPDATE-COMP-0008 | Reject update for non-existent ID | Compliance Manager | Invalid ID | 404 response, no write | REQ-COMP-006, BR-COMP-005 |
| SCN-COMP-DOC-UPDATE-COMP-0009 | Manager role can update | Manager | Authorized update | Update succeeds | REQ-COMP-007, BR-RBAC-001 |
| SCN-COMP-DOC-UPDATE-COMP-0010 | Agent role blocked from update | Agent | Unauthorized update | 403 response and deny event | REQ-COMP-007, BR-RBAC-002 |
| SCN-COMP-DOC-ARCHIVE-COMP-0011 | Archive active corporate credential | Compliance Manager | Archive action | status=archived + audit trail | REQ-COMP-008, POL-RERA-001 |
| SCN-COMP-DOC-ARCHIVE-COMP-0012 | Block archive for unauthorized role | Agent | Archive action | 403 denied | REQ-COMP-008, BR-RBAC-002 |
| SCN-COMP-DOC-IMPORT-COMP-0013 | Import registry file idempotently | Admin | Import endpoint | Existing rows updated, new rows created | REQ-COMP-009, BR-COMP-007 |
| SCN-COMP-DOC-IMPORT-COMP-0014 | Import with custom relative file path | Admin | Import endpoint with path | File resolved under workspace root | REQ-COMP-009, BR-COMP-008 |
| SCN-COMP-DOC-IMPORT-COMP-0015 | Import malformed JSON rejected | Admin | Import endpoint | Safe failure with error details | REQ-COMP-010, NFR-REL-002 |
| SCN-COMP-DOC-IMPORT-COMP-0016 | Import logs aggregate audit row | Admin | Successful import | imported audit record with totals | REQ-COMP-011, POL-PDPL-001 |
| SCN-COMP-DOC-LIST-COMP-0017 | List documents with status filter | Finance | Query status=expired | Filtered result set | REQ-COMP-012, FR-COMP-020 |
| SCN-COMP-DOC-LIST-COMP-0018 | List documents with authority filter | Manager | Query authority | Filtered authority subset | REQ-COMP-012, FR-COMP-020 |
| SCN-COMP-DOC-LIST-COMP-0019 | List documents with search term | Compliance Manager | Query search | Search matches title/reference/license | REQ-COMP-013, FR-COMP-021 |
| SCN-COMP-DOC-LIST-COMP-0020 | Clamp over-limit query | Manager | limit=1000 | Result limited to safe maximum | REQ-COMP-014, NFR-PERF-001 |
| SCN-COMP-DOC-DETAIL-COMP-0021 | Get detail with active alerts | Manager | Open detail page | Includes open/acknowledged alerts | REQ-COMP-015, FR-COMP-022 |
| SCN-COMP-DOC-DETAIL-COMP-0022 | Detail request with missing id | Manager | Invalid ID | 404 response | REQ-COMP-015, BR-COMP-009 |
| SCN-COMP-DOC-META-COMP-0023 | Preserve metadata map on update | Compliance Manager | Update metadata | Metadata retained and merged | REQ-COMP-016, POL-PDPL-001 |
| SCN-COMP-DOC-META-COMP-0024 | Reject invalid date field | Compliance Manager | Invalid expiryDate | Validation error, no write | REQ-COMP-017, BR-COMP-010 |
| SCN-COMP-DOC-AUDIT-COMP-0025 | Create event written on manual create | Compliance Manager | Create action | corporate_document_created evidence | REQ-COMP-018, POL-RERA-001 |
| SCN-COMP-DOC-AUDIT-COMP-0026 | Update event written on patch | Compliance Manager | Update action | corporate_document_updated evidence | REQ-COMP-018, POL-RERA-001 |
| SCN-COMP-DOC-AUDIT-COMP-0027 | Import event written once per run | Admin | Import action | imported event with counters | REQ-COMP-018, POL-PDPL-001 |
| SCN-COMP-DOC-AUDIT-COMP-0028 | Alert acknowledge logs audit event | Finance | Acknowledge alert | alert_acknowledged event | REQ-COMP-019, POL-PDPL-001 |
| SCN-COMP-DOC-AUDIT-COMP-0029 | Audit record immutable by policy | Manager | Attempt mutation | denied mutation path | REQ-COMP-020, BR-AUDIT-001 |
| SCN-COMP-DOC-AUDIT-COMP-0030 | Audit event includes actor context | Compliance Manager | Any protected action | actorUserId captured | REQ-COMP-021, BR-AUDIT-002 |
| SCN-COMP-ALERT-WARN-COMP-0031 | Generate 60-day warning | Scheduler | Expiry within threshold | open warning alert created | REQ-COMP-030, BR-COMP-020 |
| SCN-COMP-ALERT-WARN-COMP-0032 | Generate expired alert | Scheduler | Expiry elapsed | expired alert created | REQ-COMP-031, BR-COMP-021 |
| SCN-COMP-ALERT-WARN-COMP-0033 | No alert for active beyond threshold | Scheduler | Expiry > threshold | no alert created | REQ-COMP-032, BR-COMP-022 |
| SCN-COMP-ALERT-WARN-COMP-0034 | Prevent duplicate warning alert | Scheduler rerun | Existing open alert | no duplicate alert | REQ-COMP-033, NFR-REL-004 |
| SCN-COMP-ALERT-WARN-COMP-0035 | Prevent duplicate expired alert | Scheduler rerun | Existing expired alert | no duplicate alert | REQ-COMP-033, NFR-REL-004 |
| SCN-COMP-ALERT-ACK-COMP-0036 | Finance acknowledges warning | Finance | Ack endpoint | status=acknowledged | REQ-COMP-034, BR-RBAC-010 |
| SCN-COMP-ALERT-ACK-COMP-0037 | Owner acknowledges expired alert | Owner | Ack endpoint | status=acknowledged | REQ-COMP-034, BR-RBAC-010 |
| SCN-COMP-ALERT-ACK-COMP-0038 | Agent blocked from acknowledge | Agent | Ack endpoint | 403 denied | REQ-COMP-034, BR-RBAC-011 |
| SCN-COMP-ALERT-LIST-COMP-0039 | Alert list summary counts | Manager | List endpoint | open + acknowledged counts | REQ-COMP-035, FR-COMP-030 |
| SCN-COMP-ALERT-LIST-COMP-0040 | Alert list includes document context | Manager | List endpoint | includes title/authority/expiry | REQ-COMP-035, FR-COMP-031 |
| SCN-COMP-ALERT-LIST-COMP-0041 | Limit clamp on alert list | Manager | limit=1000 | safe capped list | REQ-COMP-036, NFR-PERF-002 |
| SCN-COMP-ALERT-SLA-COMP-0042 | Warning response SLA tracked | Compliance Team | open warning | SLA timer starts | REQ-COMP-037, NFR-OPS-010 |
| SCN-COMP-ALERT-SLA-COMP-0043 | Expired response escalates | Compliance Team | open expired alert | escalation event emitted | REQ-COMP-038, NFR-OPS-011 |
| SCN-COMP-ALERT-SLA-COMP-0044 | Escalation after missed SLA | Scheduler | SLA breach | manager notified | REQ-COMP-038, POL-PDPL-001 |
| SCN-COMP-ALERT-NOTE-COMP-0045 | Attach analyst note to alert workflow | Compliance Officer | triage action | note retained in metadata | REQ-COMP-039, BR-COMP-026 |
| SCN-COMP-ALERT-NOTE-COMP-0046 | Preserve acknowledgment actor and timestamp | Finance | ack action | actor and time persisted | REQ-COMP-040, BR-AUDIT-003 |
| SCN-COMP-ALERT-NOTE-COMP-0047 | Alert sort by due date and status | Manager | list endpoint | deterministic sort order | REQ-COMP-041, NFR-UX-003 |
| SCN-COMP-ALERT-NOTE-COMP-0048 | Alert includes threshold metadata | Manager | detail view | threshold value visible | REQ-COMP-042, FR-COMP-033 |
| SCN-COMP-ALERT-RISK-COMP-0049 | High-risk docs prioritized in queue | Compliance Manager | queue generation | risk-prioritized ordering | REQ-COMP-043, BR-COMP-028 |
| SCN-COMP-ALERT-RISK-COMP-0050 | Low-risk docs remain in normal queue | Compliance Manager | queue generation | standard ordering | REQ-COMP-043, BR-COMP-029 |
| SCN-COMP-ALERT-RISK-COMP-0051 | Authority-based escalation routing | Compliance Manager | escalation | route by authority owner | REQ-COMP-044, BR-COMP-030 |
| SCN-COMP-ALERT-RISK-COMP-0052 | Cross-check alert against policy index | Compliance Officer | triage | linked `POL-*` shown | REQ-COMP-045, POL-RERA-001 |
| SCN-COMP-ALERT-RISK-COMP-0053 | Archive closed alert after retention threshold | Scheduler | retention window met | archival flag applied | REQ-COMP-046, POL-PDPL-001 |
| SCN-COMP-ALERT-RISK-COMP-0054 | Closed alert searchable in audit mode | Compliance Manager | archive lookup | discoverable historical event | REQ-COMP-047, BR-AUDIT-004 |
| SCN-COMP-ALERT-RISK-COMP-0055 | Alert pipeline resilient to partial failures | Scheduler | processing fault | retries and error counters | REQ-COMP-048, NFR-REL-006 |
| SCN-COMP-ALERT-RISK-COMP-0056 | Alert pipeline records execution summary | Scheduler | run completion | run stats logged | REQ-COMP-049, BR-OBS-001 |
| SCN-COMP-ALERT-RISK-COMP-0057 | Alert pipeline avoids duplicate execution overlap | Scheduler | overlapping run | skip/lock behavior | REQ-COMP-050, NFR-REL-007 |
| SCN-COMP-ALERT-RISK-COMP-0058 | Alert run supports dry-run mode | Operator | dry-run request | no writes, preview only | REQ-COMP-051, BR-OPS-020 |
| SCN-COMP-ALERT-RISK-COMP-0059 | Alert run history available to governance roles | Governance | history request | run history returned | REQ-COMP-052, BR-RBAC-012 |
| SCN-COMP-ALERT-RISK-COMP-0060 | Alert lifecycle full closeout | Compliance Manager | close action | closed state + audit | REQ-COMP-053, BR-AUDIT-005 |
| SCN-COMP-KYC-UPLOAD-COMP-0061 | Upload KYC passport metadata | Agent | upload action | pending review record created | REQ-COMP-060, POL-AML-001 |
| SCN-COMP-KYC-UPLOAD-COMP-0062 | Upload KYC Emirates ID metadata | Agent | upload action | pending review record created | REQ-COMP-060, POL-AML-001 |
| SCN-COMP-KYC-UPLOAD-COMP-0063 | Reject upload when lead missing | Agent | invalid leadId | 404 response | REQ-COMP-061, BR-COMP-040 |
| SCN-COMP-KYC-UPLOAD-COMP-0064 | Reject upload when documentType missing | Agent | invalid payload | 400 response | REQ-COMP-061, BR-COMP-040 |
| SCN-COMP-KYC-UPLOAD-COMP-0065 | List KYC docs by lead | Manager | list action | ordered documents returned | REQ-COMP-062, FR-COMP-040 |
| SCN-COMP-KYC-UPLOAD-COMP-0066 | Review queue returns pending only | Compliance Manager | queue request | pending set returned | REQ-COMP-063, FR-COMP-041 |
| SCN-COMP-KYC-REVIEW-COMP-0067 | Approve KYC document | Compliance Manager | review action | status reviewed + lead tag `kyc_verified` | REQ-COMP-064, POL-AML-001 |
| SCN-COMP-KYC-REVIEW-COMP-0068 | Reject KYC document | Compliance Manager | review action | status reviewed + lead tag `kyc_rejected` | REQ-COMP-064, POL-AML-001 |
| SCN-COMP-KYC-REVIEW-COMP-0069 | Finance can review KYC | Finance | review action | authorized success | REQ-COMP-065, BR-RBAC-020 |
| SCN-COMP-KYC-REVIEW-COMP-0070 | Agent blocked from KYC review | Agent | review action | 403 denied | REQ-COMP-065, BR-RBAC-021 |
| SCN-COMP-KYC-REVIEW-COMP-0071 | Reject invalid review decision | Compliance Manager | decision=unknown | 400 response | REQ-COMP-066, BR-COMP-043 |
| SCN-COMP-KYC-REVIEW-COMP-0072 | Review writes audit metadata | Compliance Manager | review action | reviewedBy/reviewedAt persisted | REQ-COMP-067, BR-AUDIT-010 |
| SCN-COMP-KYC-REVIEW-COMP-0073 | Auto-remove rejected tag when later approved | Compliance Manager | approve after reject | tags normalized | REQ-COMP-068, BR-COMP-045 |
| SCN-COMP-KYC-REVIEW-COMP-0074 | Auto-remove verified tag when later rejected | Compliance Manager | reject after approve | tags normalized | REQ-COMP-068, BR-COMP-045 |
| SCN-COMP-AML-SCREEN-COMP-0075 | High-risk AML screening creates open alert | Agent | screen action | alert created + `aml_flagged` tag | REQ-COMP-070, POL-AML-001 |
| SCN-COMP-AML-SCREEN-COMP-0076 | Low-risk AML screening creates clear event | Agent | screen action | screened event with status cleared | REQ-COMP-070, POL-AML-001 |
| SCN-COMP-AML-SCREEN-COMP-0077 | Screening with missing leadId rejected | Agent | invalid payload | 400 response | REQ-COMP-071, BR-COMP-050 |
| SCN-COMP-AML-SCREEN-COMP-0078 | Screening with unknown lead rejected | Agent | invalid lead | 404 response | REQ-COMP-071, BR-COMP-050 |
| SCN-COMP-AML-SCREEN-COMP-0079 | AML alert list status=open | Manager | list action | only open alerts returned | REQ-COMP-072, FR-COMP-050 |
| SCN-COMP-AML-SCREEN-COMP-0080 | AML alert list status=all | Manager | list action | all alerts returned | REQ-COMP-072, FR-COMP-050 |
| SCN-COMP-AML-RESOLVE-COMP-0081 | Resolve AML alert by manager | Manager | resolve action | status resolved + audit event | REQ-COMP-073, BR-COMP-052 |
| SCN-COMP-AML-RESOLVE-COMP-0082 | Resolve AML alert by finance | Finance | resolve action | status resolved + audit event | REQ-COMP-073, BR-COMP-052 |
| SCN-COMP-AML-RESOLVE-COMP-0083 | Resolve unknown AML alert rejected | Manager | invalid alert id | 404 response | REQ-COMP-074, BR-COMP-053 |
| SCN-COMP-AML-RESOLVE-COMP-0084 | Resolve captures reason and notes | Manager | resolve action | resolution metadata persisted | REQ-COMP-075, BR-AUDIT-011 |
| SCN-COMP-PDPL-CREATE-COMP-0085 | Create PDPL consent record | Manager | consent capture | active consent recorded | REQ-PRIV-001, POL-PDPL-001 |
| SCN-COMP-PDPL-CREATE-COMP-0086 | Finance can create consent record | Finance | consent capture | active consent recorded | REQ-PRIV-001, BR-RBAC-025 |
| SCN-COMP-PDPL-CREATE-COMP-0087 | Agent blocked from consent create | Agent | consent capture | 403 denied | REQ-PRIV-001, BR-RBAC-026 |
| SCN-COMP-PDPL-CREATE-COMP-0088 | Consent create validates required fields | Manager | invalid payload | 400 response | REQ-PRIV-002, BR-PRIV-002 |
| SCN-COMP-PDPL-REVOKE-COMP-0089 | Revoke active consent | Manager | revoke action | status revoked + timestamp | REQ-PRIV-003, POL-PDPL-001 |
| SCN-COMP-PDPL-REVOKE-COMP-0090 | Revoke unknown consent rejected | Manager | invalid consent id | 404 response | REQ-PRIV-003, BR-PRIV-003 |
| SCN-COMP-PDPL-REVOKE-COMP-0091 | Revoke writes dedicated audit event | Manager | revoke action | `pdpl_consent_revoked` logged | REQ-PRIV-004, BR-AUDIT-012 |
| SCN-COMP-PDPL-DELETE-COMP-0092 | Delete/anonymize consent record | Finance | delete action | status deleted, fields anonymized | REQ-PRIV-005, POL-PDPL-001 |
| SCN-COMP-PDPL-DELETE-COMP-0093 | Delete unknown consent rejected | Finance | invalid id | 404 response | REQ-PRIV-005, BR-PRIV-005 |
| SCN-COMP-PDPL-DELETE-COMP-0094 | Delete writes dedicated audit event | Finance | delete action | `pdpl_consent_deleted` logged | REQ-PRIV-006, BR-AUDIT-013 |
| SCN-COMP-PDPL-EXPORT-COMP-0095 | Export all consent records | Owner | export action | records returned with summary | REQ-PRIV-007, FR-PRIV-010 |
| SCN-COMP-PDPL-EXPORT-COMP-0096 | Export filters by status | Owner | query status | filtered export | REQ-PRIV-007, FR-PRIV-011 |
| SCN-COMP-PDPL-EXPORT-COMP-0097 | Export filters by entityType | Owner | query entityType | filtered export | REQ-PRIV-007, FR-PRIV-011 |
| SCN-COMP-PDPL-EXPORT-COMP-0098 | Export filters by entityId | Owner | query entityId | filtered export | REQ-PRIV-007, FR-PRIV-011 |
| SCN-COMP-PDPL-EXPORT-COMP-0099 | Agent blocked from consent export | Agent | export action | 403 denied | REQ-PRIV-008, BR-RBAC-027 |
| SCN-COMP-PDPL-EXPORT-COMP-0100 | Consent export includes creator/lead context | Owner | export action | actor and lead context visible | REQ-PRIV-009, BR-PRIV-010 |
| SCN-COMP-QUEUE-COMP-0101 | Compliance queue aggregates permit+KYC+AML | Manager | queue request | unified summary returned | REQ-COMP-080, FR-COMP-060 |
| SCN-COMP-QUEUE-COMP-0102 | Queue returns permit issues top 20 | Manager | queue request | bounded list returned | REQ-COMP-080, FR-COMP-061 |
| SCN-COMP-QUEUE-COMP-0103 | Queue returns pending KYC top 20 | Manager | queue request | bounded list returned | REQ-COMP-080, FR-COMP-061 |
| SCN-COMP-QUEUE-COMP-0104 | Queue returns open AML top 20 | Manager | queue request | bounded list returned | REQ-COMP-080, FR-COMP-061 |
| SCN-COMP-QUEUE-COMP-0105 | Agent blocked from queue endpoint | Agent | queue request | 403 denied | REQ-COMP-081, BR-RBAC-030 |
| SCN-COMP-QUEUE-COMP-0106 | Queue summary counts consistent with payload | Manager | queue request | count integrity guaranteed | REQ-COMP-082, NFR-REL-010 |
| SCN-COMP-QUEUE-COMP-0107 | Queue supports governance role visibility | Finance | queue request | read allowed for finance | REQ-COMP-083, BR-RBAC-031 |
| SCN-COMP-QUEUE-COMP-0108 | Queue ordering deterministic by recency | Manager | queue request | predictable order | REQ-COMP-084, NFR-UX-006 |
| SCN-COMP-QUEUE-COMP-0109 | Queue resilient with empty lists | Manager | queue request | empty arrays with summary | REQ-COMP-085, NFR-REL-011 |
| SCN-COMP-QUEUE-COMP-0110 | Queue response includes compliance evidence links | Manager | queue request | evidence metadata present | REQ-COMP-086, BR-OBS-010 |
| SCN-LEASE-EJARI-REGISTER-COMP-0111 | Activate Ejari contract via compliance route | Manager | registration request | ejari registered with contract number | REQ-LEASE-010, POL-EJARI-001 |
| SCN-LEASE-EJARI-REGISTER-COMP-0112 | Block Ejari activation for unauthorized role | Agent | registration request | 403 denied | REQ-LEASE-010, BR-RBAC-040 |
| SCN-LEASE-EJARI-REGISTER-COMP-0113 | Ejari activation requires mandatory fields | Manager | invalid payload | 400 validation response | REQ-LEASE-011, BR-LEASE-010 |
| SCN-LEASE-EJARI-REGISTER-COMP-0114 | Ejari activation writes lease status update | Manager | successful activation | lease set to registered | REQ-LEASE-012, FR-LEASE-020 |
| SCN-LEASE-EJARI-REGISTER-COMP-0115 | Ejari registration logged for audit | Manager | successful activation | compliance audit event logged | REQ-LEASE-013, BR-AUDIT-020 |
| SCN-LEASE-EJARI-RENEW-COMP-0116 | Renew Ejari within RERA cap | Manager | renewal request | renewal succeeds | REQ-LEASE-014, POL-EJARI-001 |
| SCN-LEASE-EJARI-RENEW-COMP-0117 | Reject renewal beyond RERA cap | Manager | renewal request | 422 with cap details | REQ-LEASE-015, POL-EJARI-001 |
| SCN-LEASE-EJARI-RENEW-COMP-0118 | Renewal blocked when mandatory identifiers missing | Manager | invalid payload | 400 response | REQ-LEASE-016, BR-LEASE-012 |
| SCN-LEASE-EJARI-RENEW-COMP-0119 | Renewal trail captures previous and new rent | Manager | renewal request | delta captured in metadata | REQ-LEASE-017, BR-AUDIT-021 |
| SCN-LEASE-EJARI-RENEW-COMP-0120 | Renewal action routed to compliance dashboard | Manager | renewal complete | compliance KPI updated | REQ-LEASE-018, FR-DA-010 |
| SCN-LEASE-EJARI-TRACK-COMP-0121 | Get Ejari tracking summary by role | Manager | tracking request | pending/registered/expired counts | REQ-LEASE-019, FR-LEASE-021 |
| SCN-LEASE-EJARI-TRACK-COMP-0122 | Tracking endpoint excludes unauthorized users | Agent | tracking request | 403 denied | REQ-LEASE-019, BR-RBAC-041 |
| SCN-LEASE-EJARI-TRACK-COMP-0123 | Tracking includes expiringSoon bucket | Manager | tracking request | expiringSoon present | REQ-LEASE-020, BR-LEASE-014 |
| SCN-LEASE-EJARI-TRACK-COMP-0124 | Tracking fallback summary when dataset empty | Manager | tracking request | zero-state summary valid | REQ-LEASE-021, NFR-REL-015 |
| SCN-LEASE-EJARI-NOTIFY-COMP-0125 | Notify overdue collection queue item | Manager | reminder action | reminder event queued | REQ-LEASE-022, BR-LEASE-015 |
| SCN-LEASE-EJARI-NOTIFY-COMP-0126 | Notify blocked for unauthorized role | Agent | reminder action | 403 denied | REQ-LEASE-022, BR-RBAC-042 |
| SCN-LEASE-EJARI-NOTIFY-COMP-0127 | Notify idempotent retry behavior | Scheduler | duplicate reminder trigger | single effective send | REQ-LEASE-023, NFR-REL-016 |
| SCN-LEASE-EJARI-NOTIFY-COMP-0128 | Notify writes activity record | Manager | reminder action | immutable activity entry | REQ-LEASE-024, BR-AUDIT-022 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0129 | Tenant support request linked to lease timeline | Support Agent | ticket action | timeline updated | REQ-LEASE-030, FR-LEASE-030 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0130 | Tenant escalation to manager after SLA breach | Support Agent | SLA breach | escalation workflow triggered | REQ-LEASE-031, NFR-OPS-020 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0131 | Emergency maintenance tied to lease compliance status | Support Agent | emergency ticket | high-priority route + compliance tag | REQ-LEASE-032, POL-PDPL-001 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0132 | Lease renewal reminder at 90-day window | Scheduler | date threshold | reminder event created | REQ-LEASE-033, BR-LEASE-020 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0133 | Lease renewal reminder at 60-day window | Scheduler | date threshold | reminder event created | REQ-LEASE-033, BR-LEASE-020 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0134 | Lease renewal reminder at 30-day window | Scheduler | date threshold | reminder event created | REQ-LEASE-033, BR-LEASE-020 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0135 | Lease renewal reminder at 14-day window | Scheduler | date threshold | reminder event created | REQ-LEASE-033, BR-LEASE-020 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0136 | Lease renewal reminder at 7-day window | Scheduler | date threshold | reminder event created | REQ-LEASE-033, BR-LEASE-020 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0137 | Lease renewal reminder at 0-day threshold | Scheduler | date threshold | urgent reminder event created | REQ-LEASE-033, BR-LEASE-020 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0138 | Renewal reminder dedupe by threshold | Scheduler | rerun | no duplicate reminder | REQ-LEASE-034, NFR-REL-017 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0139 | Renewal reminder suppress when lease closed | Scheduler | lease status closed | no reminder created | REQ-LEASE-035, BR-LEASE-023 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0140 | Renewal reminder audit evidence persisted | Scheduler | reminder dispatch | audit event recorded | REQ-LEASE-036, BR-AUDIT-023 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0141 | Tenancy contract doc status sync | Compliance Manager | contract update | sync reflected in dashboard | REQ-LEASE-037, FR-LEASE-035 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0142 | Ejari cancellation path handled | Compliance Manager | cancellation event | status cancelled + evidence | REQ-LEASE-038, POL-EJARI-001 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0143 | Ejari status correction by manager | Manager | correction action | controlled override logged | REQ-LEASE-039, BR-AUDIT-024 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0144 | Ejari correction blocked for agent | Agent | correction action | 403 denied | REQ-LEASE-039, BR-RBAC-043 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0145 | Lease compliance summary in landlord portal | Landlord Manager | dashboard view | summary visible and accurate | REQ-LEASE-040, FR-LEASE-040 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0146 | Lease compliance summary empty-state behavior | Landlord Manager | no leases | valid empty state | REQ-LEASE-041, NFR-UX-010 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0147 | Lease compliance export for audit | Compliance Manager | export action | export generated | REQ-LEASE-042, BR-LEASE-030 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0148 | Lease compliance export permission denial | Agent | export action | 403 denied | REQ-LEASE-042, BR-RBAC-044 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0149 | Lease compliance report includes SLA metrics | Compliance Manager | report generation | SLA metrics present | REQ-LEASE-043, NFR-OPS-022 |
| SCN-LEASE-TENANT-SUPPORT-OPS-0150 | Lease compliance closeout complete | Compliance Manager | closeout action | closeout checklist marked complete | REQ-LEASE-044, AC-LEASE-010 |
| SCN-FIN-COMMISSION-FIN-0151 | Calculate base commission on transaction create | Finance Analyst | transaction create | base commission record created | REQ-FIN-001, FR-FIN-001 |
| SCN-FIN-COMMISSION-FIN-0152 | Apply tier rule for high-value sale | Finance Analyst | transaction value threshold | tiered commission applied | REQ-FIN-002, BR-FIN-002 |
| SCN-FIN-COMMISSION-FIN-0153 | Apply split rule for co-brokered deal | Finance Analyst | split configuration | split distribution stored | REQ-FIN-003, BR-FIN-003 |
| SCN-FIN-COMMISSION-FIN-0154 | Transition commission status submitted→approved | Finance Manager | approval action | status changed + audit | REQ-FIN-004, BR-FIN-004 |
| SCN-FIN-COMMISSION-FIN-0155 | Transition blocked for unauthorized role | Agent | approval action | 403 denied | REQ-FIN-004, BR-RBAC-050 |
| SCN-FIN-COMMISSION-FIN-0156 | Lock period prevents retroactive changes | Finance Manager | period locked | mutation denied | REQ-FIN-005, BR-FIN-006 |
| SCN-FIN-COMMISSION-FIN-0157 | Clawback rule applies after failed closing condition | Finance Analyst | closing reversal | clawback event emitted | REQ-FIN-006, BR-FIN-007 |
| SCN-FIN-COMMISSION-FIN-0158 | Currency conversion applied with cache | Finance Analyst | non-AED calc | converted values persisted | REQ-FIN-007, NFR-PERF-010 |
| SCN-FIN-COMMISSION-FIN-0159 | Conversion fallback on provider failure | Finance Analyst | provider unavailable | fallback rate used + warning | REQ-FIN-008, NFR-REL-020 |
| SCN-FIN-COMMISSION-FIN-0160 | Commission statement export generated | Finance Manager | export action | statement file produced | REQ-FIN-009, FR-FIN-015 |
| SCN-FIN-VAT-FIN-0161 | VAT summary generated for date range | Finance Manager | summary request | VAT totals and breakdown returned | REQ-FIN-010, POL-PDPL-001 |
| SCN-FIN-VAT-FIN-0162 | VAT summary empty-range behavior | Finance Manager | no transactions range | zeroed summary response | REQ-FIN-011, NFR-UX-011 |
| SCN-FIN-VAT-FIN-0163 | VAT summary blocked for unauthorized role | Agent | summary request | 403 denied | REQ-FIN-012, BR-RBAC-051 |
| SCN-FIN-VAT-FIN-0164 | VAT report includes category segmentation | Finance Manager | summary request | segmented VAT values | REQ-FIN-013, FR-FIN-020 |
| SCN-FIN-VAT-FIN-0165 | VAT generation event logged | Finance Manager | report generated | audit event persisted | REQ-FIN-014, BR-AUDIT-030 |
| SCN-FIN-AR-FIN-0166 | AR aging bucket updates on payment receipt | Finance Analyst | payment posted | bucket recalculated | REQ-FIN-015, FR-FIN-025 |
| SCN-FIN-AR-FIN-0167 | Overdue threshold triggers collection reminder | Finance Analyst | bucket aging breach | reminder queued | REQ-FIN-016, BR-FIN-012 |
| SCN-FIN-AR-FIN-0168 | Collection reminder dedupe by invoice cycle | Scheduler | duplicate trigger | no duplicate reminder | REQ-FIN-017, NFR-REL-022 |
| SCN-FIN-AR-FIN-0169 | AR summary visible to executive role | Executive | dashboard request | AR totals returned | REQ-FIN-018, FR-DA-020 |
| SCN-FIN-AR-FIN-0170 | AR details blocked for non-finance roles | Agent | details request | 403 denied | REQ-FIN-019, BR-RBAC-052 |
| SCN-FIN-CLOSE-FIN-0171 | Monthly close checklist starts on schedule | Finance Manager | month-end trigger | close workflow opened | REQ-FIN-020, NFR-OPS-030 |
| SCN-FIN-CLOSE-FIN-0172 | Reconciliation mismatch creates exception ticket | Finance Analyst | mismatch detected | exception logged | REQ-FIN-021, BR-FIN-020 |
| SCN-FIN-CLOSE-FIN-0173 | Exception ticket escalates after SLA breach | Finance Manager | unresolved mismatch | escalation triggered | REQ-FIN-022, NFR-OPS-031 |
| SCN-FIN-CLOSE-FIN-0174 | Close workflow blocked until exceptions resolved | Finance Manager | close action | blocked state with reasons | REQ-FIN-023, BR-FIN-021 |
| SCN-FIN-CLOSE-FIN-0175 | Close completion writes governance evidence | Finance Manager | close completion | close evidence archived | REQ-FIN-024, BR-AUDIT-032 |
| SCN-FIN-REPORT-FIN-0176 | Executive P&L summary generated weekly | Finance Manager | scheduled report | executive summary delivered | REQ-FIN-025, FR-EXEC-010 |
| SCN-FIN-REPORT-FIN-0177 | Budget vs actual variance report | Finance Analyst | report request | variance metrics returned | REQ-FIN-026, FR-FIN-030 |
| SCN-FIN-REPORT-FIN-0178 | Variance threshold breach alert | Finance Analyst | variance exceeds limit | alert generated | REQ-FIN-027, BR-FIN-025 |
| SCN-FIN-REPORT-FIN-0179 | Finance report export (CSV) | Finance Manager | export action | CSV generated | REQ-FIN-028, FR-FIN-031 |
| SCN-FIN-REPORT-FIN-0180 | Finance report export (PDF) | Finance Manager | export action | PDF generated | REQ-FIN-028, FR-FIN-031 |
| SCN-FIN-REPORT-FIN-0181 | Export queue tracks job status | Finance Manager | async export | jobId and status trace | REQ-FIN-029, NFR-REL-025 |
| SCN-FIN-REPORT-FIN-0182 | Export retry on temporary failure | Scheduler | transient failure | retry attempt logged | REQ-FIN-030, NFR-REL-026 |
| SCN-FIN-REPORT-FIN-0183 | Export hard failure escalated to ops | Scheduler | terminal failure | escalation event emitted | REQ-FIN-031, NFR-OPS-032 |
| SCN-FIN-REPORT-FIN-0184 | Export data redaction for sensitive fields | Finance Manager | export action | sensitive fields redacted | REQ-FIN-032, POL-PDPL-001 |
| SCN-FIN-REPORT-FIN-0185 | Audit of report generation events | Finance Manager | audit request | report events returned | REQ-FIN-033, BR-AUDIT-033 |
| SCN-FIN-REPORT-FIN-0186 | Finance dashboard freshness SLA met | Scheduler | dashboard refresh | freshness metric within SLA | REQ-FIN-034, NFR-PERF-015 |
| SCN-FIN-REPORT-FIN-0187 | Finance dashboard freshness breach | Scheduler | delayed refresh | breach event + notification | REQ-FIN-035, NFR-OPS-033 |
| SCN-FIN-REPORT-FIN-0188 | Multi-currency display fallback on stale rates | Finance Analyst | stale rates | warning + safe fallback values | REQ-FIN-036, NFR-REL-028 |
| SCN-FIN-REPORT-FIN-0189 | Commission + VAT reconciliation consistency check | Finance Manager | reconciliation action | consistency pass/fail produced | REQ-FIN-037, BR-FIN-030 |
| SCN-FIN-REPORT-FIN-0190 | Finance closeout pack assembled | Finance Manager | closeout request | closeout pack complete | REQ-FIN-038, AC-FIN-010 |
| SCN-GOV-AUDIT-OPS-0191 | Immutable compliance activity export | Governance | export request | append-only evidence export | REQ-GOV-001, BR-AUDIT-040 |
| SCN-GOV-AUDIT-OPS-0192 | Compliance route permission verification | Governance | access test | all role guards enforced | REQ-GOV-002, BR-RBAC-060 |
| SCN-GOV-AUDIT-OPS-0193 | Policy mapping completeness check | Governance | review cycle | all scenarios map to policy IDs | REQ-GOV-003, POL-PDPL-001 |
| SCN-GOV-AUDIT-OPS-0194 | Requirement trace completeness check | Governance | review cycle | no orphan scenarios | REQ-GOV-004, BR-GOV-001 |
| SCN-GOV-AUDIT-OPS-0195 | Test linkage completeness check | Governance | review cycle | each scenario has UAT/test ref | REQ-GOV-005, BR-GOV-002 |
| SCN-GOV-AUDIT-OPS-0196 | Scenario duplicate ID check | Governance | validation run | no duplicates | REQ-GOV-006, NFR-REL-030 |
| SCN-GOV-AUDIT-OPS-0197 | Scenario index update check | Governance | batch publish | master index counts synchronized | REQ-GOV-007, BR-GOV-003 |
| SCN-GOV-AUDIT-OPS-0198 | Coverage matrix synchronization check | Governance | batch publish | coverage matrix updated | REQ-GOV-008, BR-GOV-004 |
| SCN-GOV-AUDIT-OPS-0199 | Tracker sync evidence check | Governance | closure | plan/progress trackers updated | REQ-GOV-009, BR-GOV-005 |
| SCN-GOV-AUDIT-OPS-0200 | Batch A1 closure acceptance | Governance | final signoff | batch marked complete | REQ-GOV-010, AC-GOV-001 |

## 4. Acceptance baseline

Batch A1 is complete when:

1. all 200 scenarios are indexed and traceable,
2. all scenario IDs are unique,
3. all scenario records map to at least one `REQ-*` and one `POL-*`,
4. all scenario families include failure and recovery coverage,
5. linkage is reflected in the master index and business docs index.

## 5. Next batch handoff

- Batch A2 target: Sales + Viewings + Offers + Conversion Automation (0201–0500)
- Owner lane: Product + Sales Ops + Compliance + QA
