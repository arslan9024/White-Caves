# Scenario Batch A2 — Sales, Viewings, Offers, Conversion (0201–0500)

**Status:** Active  
**Owner:** Product + Sales Ops + Compliance + QA  
**Batch Size:** 300 scenarios  
**Priority:** P0/P1 revenue and conversion controls  
**Last Updated:** 2026-08-03  
**Next Review:** 2026-08-21  
**Source of Truth:** Scenario batch A2 catalog for sales/viewings/offers/conversion traceability coverage

## Canonical governance links

- [`../../05_requirements/functional-requirements.md`](../../05_requirements/functional-requirements.md)
- [`../../05_requirements/non-functional-requirements.md`](../../05_requirements/non-functional-requirements.md)
- [`../../../plans/documentation/REQ_CROSSWALK.md`](../../../plans/documentation/REQ_CROSSWALK.md)
- [`../../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- scenario expansion/closure and frontend reliability linkage lanes in `docs/plans/waves/WAVE_35_*` through `WAVE_40_*`

## 1. Scope

This batch covers critical scenarios for:

- lead intake, deduplication, and qualification,
- viewing lifecycle and conflict-safe scheduling,
- offer creation, negotiation, and acceptance controls,
- conversion workflows with compliance transitions,
- revenue funnel automation and governance checks.

## 2. Scenario family map

| Family | ID Range | Count | Domain |
| --- | --- | ---: | --- |
| Lead intake, triage, assignment | 0201–0260 | 60 | Sales |
| Viewing scheduling and completion | 0261–0330 | 70 | Sales/Operations |
| Offer and negotiation engine | 0331–0410 | 80 | Sales/Finance |
| Conversion, contracting, compliance transitions | 0411–0470 | 60 | Sales/Leasing/Compliance |
| Automation, analytics, governance closeout | 0471–0500 | 30 | Cross-domain |

## 3. Detailed scenario catalog

| Scenario ID | Title | Primary Actor | Trigger | Expected Outcome | Key Refs |
| --- | --- | --- | --- | --- | --- |
| SCN-SALES-LEAD-INGEST-OPS-0201 | Capture lead from portal form | Sales Agent | Lead submit | Lead created with source metadata | REQ-SALES-001, POL-PDPL-001 |
| SCN-SALES-LEAD-INGEST-OPS-0202 | Capture lead from WhatsApp handoff | Sales Agent | WhatsApp webhook | Lead created and tagged `whatsapp` | REQ-SALES-002, POL-PDPL-001 |
| SCN-SALES-LEAD-INGEST-OPS-0203 | Capture lead from call-center intake | Call Center | Manual intake | Lead created with call notes | REQ-SALES-003, BR-SALES-001 |
| SCN-SALES-LEAD-INGEST-OPS-0204 | Capture lead from referral channel | Sales Agent | Referral form | Lead source set to referral | REQ-SALES-004, BR-SALES-002 |
| SCN-SALES-LEAD-INGEST-OPS-0205 | Reject lead create with missing phone/email | Sales Agent | Invalid payload | 400 validation response | REQ-SALES-005, BR-SALES-003 |
| SCN-SALES-LEAD-INGEST-OPS-0206 | Reject malformed budget range | Sales Agent | Invalid payload | Budget validation error | REQ-SALES-006, BR-SALES-004 |
| SCN-SALES-LEAD-INGEST-OPS-0207 | Auto-normalize phone to E.164 | Sales Agent | Lead create | Phone normalized and stored | REQ-SALES-007, BR-SALES-005 |
| SCN-SALES-LEAD-INGEST-OPS-0208 | Detect duplicate by phone | Sales Agent | Lead create | Duplicate warning returned | REQ-SALES-008, BR-SALES-006 |
| SCN-SALES-LEAD-INGEST-OPS-0209 | Detect duplicate by email | Sales Agent | Lead create | Duplicate warning returned | REQ-SALES-008, BR-SALES-006 |
| SCN-SALES-LEAD-INGEST-OPS-0210 | Merge duplicate into existing profile | Sales Manager | Merge action | Single canonical profile retained | REQ-SALES-009, BR-SALES-007 |
| SCN-SALES-LEAD-QUALIFY-OPS-0211 | Initial qualification score generation | Sales Agent | Lead created | Score calculated and stored | REQ-SALES-010, FR-SALES-010 |
| SCN-SALES-LEAD-QUALIFY-OPS-0212 | Qualification score updates on budget change | Sales Agent | Lead update | Score recalculated | REQ-SALES-011, FR-SALES-011 |
| SCN-SALES-LEAD-QUALIFY-OPS-0213 | Qualification score updates on area preference | Sales Agent | Lead update | Score recalculated | REQ-SALES-011, FR-SALES-011 |
| SCN-SALES-LEAD-QUALIFY-OPS-0214 | Mark lead high-intent above threshold | Sales Agent | Score >= threshold | Lead stage set high-intent | REQ-SALES-012, BR-SALES-010 |
| SCN-SALES-LEAD-QUALIFY-OPS-0215 | Mark lead nurture when below threshold | Sales Agent | Score < threshold | Lead routed to nurture queue | REQ-SALES-013, BR-SALES-011 |
| SCN-SALES-LEAD-QUALIFY-OPS-0216 | Qualification denied for blocked user | Suspended Agent | Qualification action | 403 response | REQ-SALES-014, BR-RBAC-070 |
| SCN-SALES-LEAD-QUALIFY-OPS-0217 | Qualification audit event emitted | Sales Agent | Qualification action | immutable event logged | REQ-SALES-015, BR-AUDIT-050 |
| SCN-SALES-LEAD-QUALIFY-OPS-0218 | Qualification comment required for manual override | Sales Manager | Override action | Override accepted with reason | REQ-SALES-016, BR-SALES-013 |
| SCN-SALES-LEAD-QUALIFY-OPS-0219 | Reject manual override without reason | Sales Manager | Invalid override | 400 response | REQ-SALES-016, BR-SALES-013 |
| SCN-SALES-LEAD-QUALIFY-OPS-0220 | Manual override blocked for agent role | Sales Agent | Override action | 403 denied | REQ-SALES-017, BR-RBAC-071 |
| SCN-SALES-LEAD-ASSIGN-OPS-0221 | Auto-assign by area ownership | Router | Lead enters queue | Owner agent assigned | REQ-SALES-018, BR-SALES-020 |
| SCN-SALES-LEAD-ASSIGN-OPS-0222 | Auto-assign by workload balancing | Router | Queue trigger | Lowest-load eligible agent chosen | REQ-SALES-019, BR-SALES-021 |
| SCN-SALES-LEAD-ASSIGN-OPS-0223 | Auto-assign by language preference | Router | Lead profile includes language | Matching-language agent chosen | REQ-SALES-020, BR-SALES-022 |
| SCN-SALES-LEAD-ASSIGN-OPS-0224 | Auto-assign fallback when no specialty match | Router | No match | General queue assignment | REQ-SALES-021, BR-SALES-023 |
| SCN-SALES-LEAD-ASSIGN-OPS-0225 | Prevent assignment to inactive agent | Router | Candidate evaluation | Inactive agent skipped | REQ-SALES-022, BR-SALES-024 |
| SCN-SALES-LEAD-ASSIGN-OPS-0226 | Prevent assignment to suspended agent | Router | Candidate evaluation | Suspended agent skipped | REQ-SALES-022, BR-SALES-024 |
| SCN-SALES-LEAD-ASSIGN-OPS-0227 | Prevent assignment to DNC lead | Router | Assignment attempt | Assignment blocked and flagged | REQ-SALES-023, POL-PDPL-001 |
| SCN-SALES-LEAD-ASSIGN-OPS-0228 | Reassign lead by manager request | Sales Manager | Reassign action | Owner updated and event logged | REQ-SALES-024, BR-SALES-025 |
| SCN-SALES-LEAD-ASSIGN-OPS-0229 | Reassign blocked for peer agent | Sales Agent | Reassign action | 403 denied | REQ-SALES-024, BR-RBAC-072 |
| SCN-SALES-LEAD-ASSIGN-OPS-0230 | Assignment event includes reason code | Router | Assignment action | reason code persisted | REQ-SALES-025, BR-AUDIT-051 |
| SCN-SALES-LEAD-STAGE-OPS-0231 | Stage transition new→contacted | Sales Agent | Stage update | Stage changed with timestamp | REQ-SALES-026, FR-SALES-020 |
| SCN-SALES-LEAD-STAGE-OPS-0232 | Stage transition contacted→qualified | Sales Agent | Stage update | Stage changed with timestamp | REQ-SALES-026, FR-SALES-020 |
| SCN-SALES-LEAD-STAGE-OPS-0233 | Stage transition qualified→viewing_booked | Sales Agent | Stage update | Stage changed with timestamp | REQ-SALES-026, FR-SALES-020 |
| SCN-SALES-LEAD-STAGE-OPS-0234 | Stage transition viewing_completed→offer_submitted | Sales Agent | Stage update | Stage changed with timestamp | REQ-SALES-026, FR-SALES-020 |
| SCN-SALES-LEAD-STAGE-OPS-0235 | Stage transition offer_accepted→won | Sales Manager | Stage update | Lead marked won | REQ-SALES-027, BR-SALES-030 |
| SCN-SALES-LEAD-STAGE-OPS-0236 | Stage transition to lost with reason | Sales Agent | Lost action | Lead lost with mandatory reason | REQ-SALES-028, BR-SALES-031 |
| SCN-SALES-LEAD-STAGE-OPS-0237 | Reject lost transition without reason | Sales Agent | Invalid update | 400 response | REQ-SALES-028, BR-SALES-031 |
| SCN-SALES-LEAD-STAGE-OPS-0238 | Block invalid stage jump | Sales Agent | Invalid transition | 422 response with allowed transitions | REQ-SALES-029, BR-SALES-032 |
| SCN-SALES-LEAD-STAGE-OPS-0239 | Stage rollback requires manager approval | Sales Agent | Rollback request | Pending approval created | REQ-SALES-030, BR-SALES-033 |
| SCN-SALES-LEAD-STAGE-OPS-0240 | Manager approves stage rollback | Sales Manager | Approval action | Rollback executed | REQ-SALES-030, BR-SALES-033 |
| SCN-SALES-LEAD-ACTIVITY-OPS-0241 | Log outbound call activity | Sales Agent | Call complete | Activity entry recorded | REQ-SALES-031, FR-SALES-030 |
| SCN-SALES-LEAD-ACTIVITY-OPS-0242 | Log inbound call activity | Sales Agent | Call receive | Activity entry recorded | REQ-SALES-031, FR-SALES-030 |
| SCN-SALES-LEAD-ACTIVITY-OPS-0243 | Log WhatsApp interaction activity | Sales Agent | Message event | Activity entry recorded | REQ-SALES-032, FR-SALES-031 |
| SCN-SALES-LEAD-ACTIVITY-OPS-0244 | Log email interaction activity | Sales Agent | Email event | Activity entry recorded | REQ-SALES-032, FR-SALES-031 |
| SCN-SALES-LEAD-ACTIVITY-OPS-0245 | Activity note supports attachment metadata | Sales Agent | Note action | Attachment refs persisted | REQ-SALES-033, BR-SALES-035 |
| SCN-SALES-LEAD-ACTIVITY-OPS-0246 | Activity note redacts sensitive fields | Sales Agent | Note action | Sensitive content masked | REQ-SALES-034, POL-PDPL-001 |
| SCN-SALES-LEAD-ACTIVITY-OPS-0247 | Activity immutable after retention lock | System | Edit attempt | Mutation denied | REQ-SALES-035, BR-AUDIT-052 |
| SCN-SALES-LEAD-ACTIVITY-OPS-0248 | Activity export by manager role | Sales Manager | Export action | Export generated | REQ-SALES-036, FR-SALES-035 |
| SCN-SALES-LEAD-ACTIVITY-OPS-0249 | Activity export blocked for agent role | Sales Agent | Export action | 403 denied | REQ-SALES-036, BR-RBAC-073 |
| SCN-SALES-LEAD-ACTIVITY-OPS-0250 | Activity timeline sort stable by timestamp | Sales Agent | Timeline view | Deterministic ordering | REQ-SALES-037, NFR-UX-020 |
| SCN-SALES-LEAD-QUEUE-OPS-0251 | My queue only shows assigned leads | Sales Agent | Queue load | Filtered to owner leads | REQ-SALES-038, FR-SALES-040 |
| SCN-SALES-LEAD-QUEUE-OPS-0252 | Manager queue shows team leads | Sales Manager | Queue load | Team scope returned | REQ-SALES-039, BR-RBAC-074 |
| SCN-SALES-LEAD-QUEUE-OPS-0253 | Queue filter by stage | Sales Agent | Filter apply | Filtered list returned | REQ-SALES-040, FR-SALES-041 |
| SCN-SALES-LEAD-QUEUE-OPS-0254 | Queue filter by priority | Sales Agent | Filter apply | Filtered list returned | REQ-SALES-040, FR-SALES-041 |
| SCN-SALES-LEAD-QUEUE-OPS-0255 | Queue search by name or phone | Sales Agent | Search query | Matching leads returned | REQ-SALES-041, FR-SALES-042 |
| SCN-SALES-LEAD-QUEUE-OPS-0256 | Queue limit clamp prevents abuse | Sales Agent | limit=1000 | Safe limit enforced | REQ-SALES-042, NFR-PERF-020 |
| SCN-SALES-LEAD-QUEUE-OPS-0257 | Queue pagination consistency under updates | Sales Agent | Page navigate | Cursor consistency retained | REQ-SALES-043, NFR-REL-040 |
| SCN-SALES-LEAD-QUEUE-OPS-0258 | Queue empty-state shows recovery CTA | Sales Agent | No assigned leads | Empty state plus CTA shown | REQ-SALES-044, NFR-UX-021 |
| SCN-SALES-LEAD-QUEUE-OPS-0259 | Queue SLA badge highlights stale leads | Sales Agent | Queue load | stale leads flagged | REQ-SALES-045, NFR-OPS-040 |
| SCN-SALES-LEAD-QUEUE-OPS-0260 | Lead queue snapshot included in daily digest | Sales Manager | Daily digest job | Summary delivered | REQ-SALES-046, FR-SALES-045 |
| SCN-SALES-VIEWING-SLOT-OPS-0261 | Create viewing slot for property | Sales Agent | Slot create | Slot stored and visible | REQ-SALES-050, FR-SALES-050 |
| SCN-SALES-VIEWING-SLOT-OPS-0262 | Reject slot create with missing property | Sales Agent | Invalid payload | 400 response | REQ-SALES-051, BR-SALES-050 |
| SCN-SALES-VIEWING-SLOT-OPS-0263 | Reject slot create with past datetime | Sales Agent | Invalid datetime | 422 response | REQ-SALES-052, BR-SALES-051 |
| SCN-SALES-VIEWING-SLOT-OPS-0264 | Create recurring open-house slots | Sales Agent | Recurrence create | Slots generated idempotently | REQ-SALES-053, FR-SALES-051 |
| SCN-SALES-VIEWING-SLOT-OPS-0265 | Recurrence stop on blackout date | Scheduler | Slot generation | Blackout dates skipped | REQ-SALES-054, BR-SALES-052 |
| SCN-SALES-VIEWING-BOOK-OPS-0266 | Book viewing from lead profile | Sales Agent | Booking action | Viewing created and linked | REQ-SALES-055, FR-SALES-052 |
| SCN-SALES-VIEWING-BOOK-OPS-0267 | Book viewing from chatbot CTA | Lead | Booking action | Viewing request created | REQ-SALES-056, FR-SALES-053 |
| SCN-SALES-VIEWING-BOOK-OPS-0268 | Booking blocked on conflicting agent schedule | Scheduler | Conflict detect | 409 conflict response | REQ-SALES-057, BR-SALES-053 |
| SCN-SALES-VIEWING-BOOK-OPS-0269 | Booking blocked on conflicting property slot | Scheduler | Conflict detect | 409 conflict response | REQ-SALES-057, BR-SALES-053 |
| SCN-SALES-VIEWING-BOOK-OPS-0270 | Booking blocked when lead in DNC state | Sales Agent | Booking action | 422 policy block | REQ-SALES-058, POL-PDPL-001 |
| SCN-SALES-VIEWING-BOOK-OPS-0271 | Viewing booking generates confirmation message | Sales Agent | Booking success | confirmation queued | REQ-SALES-059, FR-SALES-054 |
| SCN-SALES-VIEWING-BOOK-OPS-0272 | Viewing booking generates ICS artifact | Sales Agent | Booking success | ICS file produced | REQ-SALES-060, FR-SALES-055 |
| SCN-SALES-VIEWING-BOOK-OPS-0273 | Viewing booking emits audit event | Sales Agent | Booking success | immutable event logged | REQ-SALES-061, BR-AUDIT-060 |
| SCN-SALES-VIEWING-BOOK-OPS-0274 | Manager books on behalf of agent | Sales Manager | Booking action | Booking succeeds with actor context | REQ-SALES-062, BR-RBAC-075 |
| SCN-SALES-VIEWING-BOOK-OPS-0275 | Booking denied for unauthorized external role | External User | Booking action | 403 denied | REQ-SALES-063, BR-RBAC-076 |
| SCN-SALES-VIEWING-CONFIRM-OPS-0276 | Confirm viewing by lead reply | Lead | Confirm action | status=confirmed | REQ-SALES-064, FR-SALES-056 |
| SCN-SALES-VIEWING-CONFIRM-OPS-0277 | Confirm viewing by agent callback | Sales Agent | Confirm action | status=confirmed | REQ-SALES-064, FR-SALES-056 |
| SCN-SALES-VIEWING-CONFIRM-OPS-0278 | Auto-confirm for prequalified VIP leads | Scheduler | VIP rule match | status auto-confirmed | REQ-SALES-065, BR-SALES-060 |
| SCN-SALES-VIEWING-CONFIRM-OPS-0279 | Reject confirmation for canceled viewing | Sales Agent | Confirm action | 422 invalid state | REQ-SALES-066, BR-SALES-061 |
| SCN-SALES-VIEWING-CONFIRM-OPS-0280 | Confirmation logs channel metadata | Sales Agent | Confirm action | channel stored in event | REQ-SALES-067, BR-AUDIT-061 |
| SCN-SALES-VIEWING-REMINDER-OPS-0281 | Send 24h reminder | Scheduler | Time threshold | reminder sent | REQ-SALES-068, FR-SALES-057 |
| SCN-SALES-VIEWING-REMINDER-OPS-0282 | Send 3h reminder | Scheduler | Time threshold | reminder sent | REQ-SALES-068, FR-SALES-057 |
| SCN-SALES-VIEWING-REMINDER-OPS-0283 | Send 30m reminder | Scheduler | Time threshold | reminder sent | REQ-SALES-068, FR-SALES-057 |
| SCN-SALES-VIEWING-REMINDER-OPS-0284 | Reminder dedupe across retries | Scheduler | Retries | single effective reminder | REQ-SALES-069, NFR-REL-050 |
| SCN-SALES-VIEWING-REMINDER-OPS-0285 | Reminder suppressed after cancellation | Scheduler | Canceled status | no reminder sent | REQ-SALES-070, BR-SALES-062 |
| SCN-SALES-VIEWING-REMINDER-OPS-0286 | Reminder fallback channel from WhatsApp to SMS | Scheduler | Delivery fail | fallback dispatched | REQ-SALES-071, NFR-REL-051 |
| SCN-SALES-VIEWING-REMINDER-OPS-0287 | Reminder fallback to email when phone unreachable | Scheduler | Delivery fail | email fallback sent | REQ-SALES-071, NFR-REL-051 |
| SCN-SALES-VIEWING-REMINDER-OPS-0288 | Reminder SLA miss triggers manager alert | Scheduler | delayed send | escalation event emitted | REQ-SALES-072, NFR-OPS-050 |
| SCN-SALES-VIEWING-RESCHEDULE-OPS-0289 | Reschedule viewing by agent | Sales Agent | Reschedule action | new slot assigned | REQ-SALES-073, FR-SALES-058 |
| SCN-SALES-VIEWING-RESCHEDULE-OPS-0290 | Reschedule viewing by lead | Lead | Reschedule request | pending slot options returned | REQ-SALES-074, FR-SALES-059 |
| SCN-SALES-VIEWING-RESCHEDULE-OPS-0291 | Reschedule blocked when <2h to slot | Sales Agent | Reschedule action | policy block returned | REQ-SALES-075, BR-SALES-063 |
| SCN-SALES-VIEWING-RESCHEDULE-OPS-0292 | Reschedule blocked on conflict | Scheduler | Conflict check | 409 conflict | REQ-SALES-076, BR-SALES-064 |
| SCN-SALES-VIEWING-RESCHEDULE-OPS-0293 | Reschedule updates reminders atomically | Scheduler | Reschedule success | old reminders canceled, new queued | REQ-SALES-077, NFR-REL-052 |
| SCN-SALES-VIEWING-RESCHEDULE-OPS-0294 | Reschedule event logs old/new times | Sales Agent | Reschedule success | delta persisted | REQ-SALES-078, BR-AUDIT-062 |
| SCN-SALES-VIEWING-CANCEL-OPS-0295 | Cancel viewing by lead | Lead | Cancel action | status=canceled with reason | REQ-SALES-079, FR-SALES-060 |
| SCN-SALES-VIEWING-CANCEL-OPS-0296 | Cancel viewing by agent | Sales Agent | Cancel action | status=canceled with reason | REQ-SALES-079, FR-SALES-060 |
| SCN-SALES-VIEWING-CANCEL-OPS-0297 | Cancel viewing by manager override | Sales Manager | Cancel action | status=canceled override | REQ-SALES-080, BR-SALES-065 |
| SCN-SALES-VIEWING-CANCEL-OPS-0298 | Cancellation blocked in completed state | Sales Agent | Cancel action | 422 invalid state | REQ-SALES-081, BR-SALES-066 |
| SCN-SALES-VIEWING-CANCEL-OPS-0299 | Cancellation triggers follow-up task | Scheduler | Cancel success | follow-up task created | REQ-SALES-082, FR-SALES-061 |
| SCN-SALES-VIEWING-CANCEL-OPS-0300 | Cancellation event includes actor context | Sales Agent | Cancel action | audit actor recorded | REQ-SALES-083, BR-AUDIT-063 |
| SCN-SALES-VIEWING-CHECKIN-OPS-0301 | Agent check-in at property geofence | Sales Agent | Check-in action | checked-in status set | REQ-SALES-084, FR-SALES-062 |
| SCN-SALES-VIEWING-CHECKIN-OPS-0302 | Check-in blocked outside geofence | Sales Agent | Check-in action | 422 geofence violation | REQ-SALES-085, BR-SALES-067 |
| SCN-SALES-VIEWING-CHECKIN-OPS-0303 | Manual check-in override by manager | Sales Manager | Override action | check-in accepted with reason | REQ-SALES-086, BR-SALES-068 |
| SCN-SALES-VIEWING-CHECKIN-OPS-0304 | Lead attendance captured | Sales Agent | Attendance mark | attendance=true persisted | REQ-SALES-087, FR-SALES-063 |
| SCN-SALES-VIEWING-CHECKIN-OPS-0305 | Lead no-show captured | Sales Agent | Attendance mark | no_show status persisted | REQ-SALES-087, FR-SALES-063 |
| SCN-SALES-VIEWING-CHECKIN-OPS-0306 | No-show auto-recovery sequence starts | Scheduler | no_show status | recovery sequence queued | REQ-SALES-088, FR-SALES-064 |
| SCN-SALES-VIEWING-CHECKIN-OPS-0307 | No-show repeated triggers manager review | Scheduler | repeated no_show | escalation task created | REQ-SALES-089, NFR-OPS-051 |
| SCN-SALES-VIEWING-CHECKIN-OPS-0308 | Check-in event immutable | System | Edit attempt | mutation denied | REQ-SALES-090, BR-AUDIT-064 |
| SCN-SALES-VIEWING-FEEDBACK-OPS-0309 | Capture post-viewing lead rating | Lead | Feedback submit | rating persisted | REQ-SALES-091, FR-SALES-065 |
| SCN-SALES-VIEWING-FEEDBACK-OPS-0310 | Capture post-viewing lead comment | Lead | Feedback submit | comment persisted | REQ-SALES-091, FR-SALES-065 |
| SCN-SALES-VIEWING-FEEDBACK-OPS-0311 | Reject invalid rating bounds | Lead | Feedback submit | 400 validation error | REQ-SALES-092, BR-SALES-069 |
| SCN-SALES-VIEWING-FEEDBACK-OPS-0312 | Feedback missing for 24h triggers reminder | Scheduler | Time threshold | reminder queued | REQ-SALES-093, FR-SALES-066 |
| SCN-SALES-VIEWING-FEEDBACK-OPS-0313 | Negative feedback opens QA review | Scheduler | rating <= 2 | QA review task created | REQ-SALES-094, NFR-OPS-052 |
| SCN-SALES-VIEWING-FEEDBACK-OPS-0314 | Positive feedback nudges offer CTA | Scheduler | rating >= 4 | CTA message sent | REQ-SALES-095, FR-SALES-067 |
| SCN-SALES-VIEWING-FEEDBACK-OPS-0315 | Feedback event linked to conversion analytics | Analytics | Feedback ingest | funnel metrics updated | REQ-SALES-096, FR-DA-040 |
| SCN-SALES-VIEWING-COMPLETE-OPS-0316 | Mark viewing complete by agent | Sales Agent | Complete action | status=completed | REQ-SALES-097, FR-SALES-068 |
| SCN-SALES-VIEWING-COMPLETE-OPS-0317 | Complete blocked without notes | Sales Agent | Complete action | 400 notes required | REQ-SALES-098, BR-SALES-070 |
| SCN-SALES-VIEWING-COMPLETE-OPS-0318 | Completion auto-creates follow-up task | Scheduler | Complete success | follow-up task created | REQ-SALES-099, FR-SALES-069 |
| SCN-SALES-VIEWING-COMPLETE-OPS-0319 | Completion updates lead stage | Scheduler | Complete success | stage=viewing_completed | REQ-SALES-100, FR-SALES-070 |
| SCN-SALES-VIEWING-COMPLETE-OPS-0320 | Completion event includes property context | Sales Agent | Complete action | context stored in audit | REQ-SALES-101, BR-AUDIT-065 |
| SCN-SALES-VIEWING-PIPELINE-OPS-0321 | Viewings dashboard counts by status | Sales Manager | Dashboard load | counts returned | REQ-SALES-102, FR-DA-041 |
| SCN-SALES-VIEWING-PIPELINE-OPS-0322 | Dashboard counts by agent | Sales Manager | Dashboard load | agent split returned | REQ-SALES-103, FR-DA-042 |
| SCN-SALES-VIEWING-PIPELINE-OPS-0323 | Dashboard conversion viewing→offer | Sales Manager | Dashboard load | conversion metric returned | REQ-SALES-104, FR-DA-043 |
| SCN-SALES-VIEWING-PIPELINE-OPS-0324 | Dashboard stale data warning | Scheduler | freshness breach | warning badge shown | REQ-SALES-105, NFR-OPS-053 |
| SCN-SALES-VIEWING-PIPELINE-OPS-0325 | Dashboard role-based visibility enforced | Sales Agent | Dashboard load | restricted scope returned | REQ-SALES-106, BR-RBAC-077 |
| SCN-SALES-VIEWING-PIPELINE-OPS-0326 | Export viewing report CSV | Sales Manager | Export action | CSV generated | REQ-SALES-107, FR-SALES-075 |
| SCN-SALES-VIEWING-PIPELINE-OPS-0327 | Export viewing report PDF | Sales Manager | Export action | PDF generated | REQ-SALES-107, FR-SALES-075 |
| SCN-SALES-VIEWING-PIPELINE-OPS-0328 | Export blocked for unauthorized role | Sales Agent | Export action | 403 denied | REQ-SALES-108, BR-RBAC-078 |
| SCN-SALES-VIEWING-PIPELINE-OPS-0329 | Export async status tracking | Sales Manager | Export action | job status traceable | REQ-SALES-109, NFR-REL-053 |
| SCN-SALES-VIEWING-PIPELINE-OPS-0330 | Viewing pipeline weekly digest sent | Scheduler | Weekly digest | digest delivered | REQ-SALES-110, FR-SALES-076 |
| SCN-SALES-OFFER-CREATE-FIN-0331 | Submit purchase offer | Sales Agent | Offer submit | offer created pending | REQ-SALES-120, FR-SALES-080 |
| SCN-SALES-OFFER-CREATE-FIN-0332 | Submit lease offer | Sales Agent | Offer submit | offer created pending | REQ-SALES-121, FR-SALES-081 |
| SCN-SALES-OFFER-CREATE-FIN-0333 | Offer blocked with missing price | Sales Agent | Invalid payload | 400 validation error | REQ-SALES-122, BR-SALES-080 |
| SCN-SALES-OFFER-CREATE-FIN-0334 | Offer blocked with expired validity date | Sales Agent | Invalid payload | 422 invalid validity | REQ-SALES-123, BR-SALES-081 |
| SCN-SALES-OFFER-CREATE-FIN-0335 | Offer includes conditions payload | Sales Agent | Offer submit | conditions saved | REQ-SALES-124, FR-SALES-082 |
| SCN-SALES-OFFER-CREATE-FIN-0336 | Offer auto-links to latest viewing | Sales Agent | Offer submit | viewing reference attached | REQ-SALES-125, BR-SALES-082 |
| SCN-SALES-OFFER-CREATE-FIN-0337 | Offer denied for unqualified lead | Sales Agent | Offer submit | 422 qualification block | REQ-SALES-126, BR-SALES-083 |
| SCN-SALES-OFFER-CREATE-FIN-0338 | Offer denied for archived property | Sales Agent | Offer submit | 422 property state block | REQ-SALES-127, BR-SALES-084 |
| SCN-SALES-OFFER-CREATE-FIN-0339 | Offer submit writes immutable event | Sales Agent | Offer submit | `offer_submitted` logged | REQ-SALES-128, BR-AUDIT-070 |
| SCN-SALES-OFFER-CREATE-FIN-0340 | Offer submit triggers stakeholder notifications | Scheduler | Offer created | notifications queued | REQ-SALES-129, FR-SALES-083 |
| SCN-SALES-OFFER-NEGOTIATE-FIN-0341 | Seller counter-offer create | Sales Manager | Counter action | counter-offer saved | REQ-SALES-130, FR-SALES-084 |
| SCN-SALES-OFFER-NEGOTIATE-FIN-0342 | Buyer counter-offer response | Sales Agent | Counter response | chain updated | REQ-SALES-131, FR-SALES-085 |
| SCN-SALES-OFFER-NEGOTIATE-FIN-0343 | Reject counter with invalid amount | Sales Agent | Invalid counter | 400 validation error | REQ-SALES-132, BR-SALES-085 |
| SCN-SALES-OFFER-NEGOTIATE-FIN-0344 | Negotiation round limit enforcement | Scheduler | Round exceed | escalation required | REQ-SALES-133, BR-SALES-086 |
| SCN-SALES-OFFER-NEGOTIATE-FIN-0345 | Negotiation timeout auto-expiry | Scheduler | Validity elapsed | offer marked expired | REQ-SALES-134, FR-SALES-086 |
| SCN-SALES-OFFER-NEGOTIATE-FIN-0346 | Timeout warning at T-24h | Scheduler | Threshold hit | warning sent | REQ-SALES-135, FR-SALES-087 |
| SCN-SALES-OFFER-NEGOTIATE-FIN-0347 | Timeout warning at T-3h | Scheduler | Threshold hit | warning sent | REQ-SALES-135, FR-SALES-087 |
| SCN-SALES-OFFER-NEGOTIATE-FIN-0348 | Counter chain immutable history preserved | System | History view | full chain visible | REQ-SALES-136, BR-AUDIT-071 |
| SCN-SALES-OFFER-NEGOTIATE-FIN-0349 | Counter action blocked by unauthorized role | External User | Counter action | 403 denied | REQ-SALES-137, BR-RBAC-080 |
| SCN-SALES-OFFER-NEGOTIATE-FIN-0350 | Negotiation analytics updates in real-time | Analytics | Counter event | negotiation KPI updated | REQ-SALES-138, FR-DA-050 |
| SCN-SALES-OFFER-APPROVE-FIN-0351 | Approve offer by authorized manager | Sales Manager | Approve action | status=accepted | REQ-SALES-139, FR-SALES-088 |
| SCN-SALES-OFFER-APPROVE-FIN-0352 | Approval blocked for non-owner manager | Sales Manager | Approve action | 403 scoped denial | REQ-SALES-140, BR-RBAC-081 |
| SCN-SALES-OFFER-APPROVE-FIN-0353 | Approval blocked when AML flag unresolved | Compliance Manager | Approve action | compliance hold state | REQ-SALES-141, POL-AML-001 |
| SCN-SALES-OFFER-APPROVE-FIN-0354 | Approval blocked when KYC incomplete | Compliance Manager | Approve action | compliance hold state | REQ-SALES-142, POL-AML-001 |
| SCN-SALES-OFFER-APPROVE-FIN-0355 | Approval with mortgage condition retained | Sales Manager | Approve action | condition persisted | REQ-SALES-143, FR-SALES-089 |
| SCN-SALES-OFFER-APPROVE-FIN-0356 | Approval with cash-proof requirement retained | Sales Manager | Approve action | condition persisted | REQ-SALES-144, POL-AML-001 |
| SCN-SALES-OFFER-APPROVE-FIN-0357 | Approval event emits contract preparation task | Scheduler | Approve success | contract task created | REQ-SALES-145, FR-SALES-090 |
| SCN-SALES-OFFER-APPROVE-FIN-0358 | Approval event updates lead stage to offer_accepted | Scheduler | Approve success | stage updated | REQ-SALES-146, FR-SALES-091 |
| SCN-SALES-OFFER-APPROVE-FIN-0359 | Approval event updates property status to reserved | Scheduler | Approve success | property reserved | REQ-SALES-147, BR-SALES-090 |
| SCN-SALES-OFFER-APPROVE-FIN-0360 | Approval writes immutable audit evidence | Sales Manager | Approve action | `offer_accepted` logged | REQ-SALES-148, BR-AUDIT-072 |
| SCN-SALES-OFFER-REJECT-FIN-0361 | Reject offer with reason | Sales Manager | Reject action | status=rejected with reason | REQ-SALES-149, FR-SALES-092 |
| SCN-SALES-OFFER-REJECT-FIN-0362 | Reject offer blocked without reason | Sales Manager | Reject action | 400 reason required | REQ-SALES-150, BR-SALES-091 |
| SCN-SALES-OFFER-REJECT-FIN-0363 | Reject offer by policy rule violation | Compliance Manager | Policy fail | status=rejected_policy | REQ-SALES-151, POL-AML-001 |
| SCN-SALES-OFFER-REJECT-FIN-0364 | Rejection notifies buyer and agent | Scheduler | Reject success | notifications dispatched | REQ-SALES-152, FR-SALES-093 |
| SCN-SALES-OFFER-REJECT-FIN-0365 | Rejection opens recovery nurture flow | Scheduler | Reject success | nurture sequence queued | REQ-SALES-153, FR-SALES-094 |
| SCN-SALES-OFFER-REJECT-FIN-0366 | Rejection event updates lead stage to offer_rejected | Scheduler | Reject success | stage updated | REQ-SALES-154, FR-SALES-095 |
| SCN-SALES-OFFER-REJECT-FIN-0367 | Rejection event unlocks property status | Scheduler | Reject success | property available | REQ-SALES-155, BR-SALES-092 |
| SCN-SALES-OFFER-REJECT-FIN-0368 | Rejection event immutable in audit timeline | System | History view | uneditable record retained | REQ-SALES-156, BR-AUDIT-073 |
| SCN-SALES-OFFER-REJECT-FIN-0369 | Rejection denied for unauthorized role | Sales Agent | Reject action | 403 denied | REQ-SALES-157, BR-RBAC-082 |
| SCN-SALES-OFFER-REJECT-FIN-0370 | Rejection analytics contributes to loss taxonomy | Analytics | Reject event | loss reason metrics updated | REQ-SALES-158, FR-DA-051 |
| SCN-SALES-OFFER-EXPIRY-FIN-0371 | Auto-expire pending offer at validity end | Scheduler | Expiry threshold | status=expired | REQ-SALES-159, FR-SALES-096 |
| SCN-SALES-OFFER-EXPIRY-FIN-0372 | Auto-expire countered offer at validity end | Scheduler | Expiry threshold | status=expired | REQ-SALES-159, FR-SALES-096 |
| SCN-SALES-OFFER-EXPIRY-FIN-0373 | Expiry warning T-48h | Scheduler | Threshold hit | warning dispatched | REQ-SALES-160, FR-SALES-097 |
| SCN-SALES-OFFER-EXPIRY-FIN-0374 | Expiry warning T-12h | Scheduler | Threshold hit | warning dispatched | REQ-SALES-160, FR-SALES-097 |
| SCN-SALES-OFFER-EXPIRY-FIN-0375 | Expiry warning dedupe | Scheduler | Retry cycle | no duplicate warning | REQ-SALES-161, NFR-REL-060 |
| SCN-SALES-OFFER-EXPIRY-FIN-0376 | Expiry updates lead stage for reactivation | Scheduler | Expiry success | stage moved to re-engage | REQ-SALES-162, FR-SALES-098 |
| SCN-SALES-OFFER-EXPIRY-FIN-0377 | Expiry unlocks property reservation | Scheduler | Expiry success | property unlocked | REQ-SALES-163, BR-SALES-093 |
| SCN-SALES-OFFER-EXPIRY-FIN-0378 | Expiry event includes timeout metadata | Scheduler | Expiry success | metadata persisted | REQ-SALES-164, BR-AUDIT-074 |
| SCN-SALES-OFFER-EXPIRY-FIN-0379 | Expiry blocked if already accepted | Scheduler | Expiry run | no-op on accepted offers | REQ-SALES-165, BR-SALES-094 |
| SCN-SALES-OFFER-EXPIRY-FIN-0380 | Expiry pipeline run summary persisted | Scheduler | Job completion | run stats logged | REQ-SALES-166, BR-OBS-020 |
| SCN-SALES-OFFER-DOCS-FIN-0381 | Generate MOU draft after acceptance | Sales Manager | Accept action | MOU draft generated | REQ-SALES-167, FR-SALES-100 |
| SCN-SALES-OFFER-DOCS-FIN-0382 | Generate LOI draft after lease acceptance | Sales Manager | Accept action | LOI generated | REQ-SALES-168, FR-SALES-101 |
| SCN-SALES-OFFER-DOCS-FIN-0383 | Document generation blocked on missing buyer ID | Sales Manager | Doc gen action | 422 missing compliance data | REQ-SALES-169, POL-AML-001 |
| SCN-SALES-OFFER-DOCS-FIN-0384 | Document generation blocked on missing seller authority | Sales Manager | Doc gen action | 422 missing authority data | REQ-SALES-170, BR-SALES-095 |
| SCN-SALES-OFFER-DOCS-FIN-0385 | Document generation includes terms version | Sales Manager | Doc gen action | terms version persisted | REQ-SALES-171, BR-AUDIT-075 |
| SCN-SALES-OFFER-DOCS-FIN-0386 | Document generation stores artifact path | Sales Manager | Doc gen action | artifact path persisted | REQ-SALES-172, FR-SALES-102 |
| SCN-SALES-OFFER-DOCS-FIN-0387 | Document generation retry after transient failure | Scheduler | Generation fail | retry succeeds | REQ-SALES-173, NFR-REL-061 |
| SCN-SALES-OFFER-DOCS-FIN-0388 | Document generation hard fail escalates | Scheduler | Generation fail | escalation emitted | REQ-SALES-174, NFR-OPS-060 |
| SCN-SALES-OFFER-DOCS-FIN-0389 | Document access scoped by role | Sales Agent | Document open | access control enforced | REQ-SALES-175, BR-RBAC-083 |
| SCN-SALES-OFFER-DOCS-FIN-0390 | Document audit trail immutable | System | Edit attempt | mutation denied | REQ-SALES-176, BR-AUDIT-076 |
| SCN-SALES-OFFER-FINANCE-FIN-0391 | Generate reservation payment task | Finance Analyst | Offer accepted | payment task created | REQ-SALES-177, FR-FIN-040 |
| SCN-SALES-OFFER-FINANCE-FIN-0392 | Reservation payment receipt marks milestone | Finance Analyst | Receipt logged | milestone status updated | REQ-SALES-178, FR-FIN-041 |
| SCN-SALES-OFFER-FINANCE-FIN-0393 | Payment mismatch opens finance exception | Finance Analyst | Amount mismatch | exception task created | REQ-SALES-179, BR-FIN-040 |
| SCN-SALES-OFFER-FINANCE-FIN-0394 | Finance exception breach escalates | Scheduler | SLA breach | escalation sent | REQ-SALES-180, NFR-OPS-061 |
| SCN-SALES-OFFER-FINANCE-FIN-0395 | Payment confirmation updates lead stage | Scheduler | Payment success | stage=reserved_paid | REQ-SALES-181, FR-SALES-103 |
| SCN-SALES-OFFER-FINANCE-FIN-0396 | Payment reversal triggers rollback | Finance Analyst | Reversal action | reservation rollback executed | REQ-SALES-182, BR-FIN-041 |
| SCN-SALES-OFFER-FINANCE-FIN-0397 | Payment reversal logs clawback candidate | Finance Analyst | Reversal action | clawback candidate created | REQ-SALES-183, BR-FIN-042 |
| SCN-SALES-OFFER-FINANCE-FIN-0398 | Payment event redacts sensitive fields in exports | Finance Analyst | Export action | sensitive fields masked | REQ-SALES-184, POL-PDPL-001 |
| SCN-SALES-OFFER-FINANCE-FIN-0399 | Payment ledger entry immutable | System | Edit attempt | mutation denied | REQ-SALES-185, BR-AUDIT-077 |
| SCN-SALES-OFFER-FINANCE-FIN-0400 | Payment reconciliation tie-out pass/fail record | Finance Manager | Reconciliation run | tie-out result stored | REQ-SALES-186, FR-FIN-042 |
| SCN-SALES-OFFER-ANALYTICS-OPS-0401 | Offers dashboard total submitted metric | Sales Manager | Dashboard load | metric returned | REQ-SALES-187, FR-DA-052 |
| SCN-SALES-OFFER-ANALYTICS-OPS-0402 | Offers dashboard acceptance rate metric | Sales Manager | Dashboard load | metric returned | REQ-SALES-188, FR-DA-053 |
| SCN-SALES-OFFER-ANALYTICS-OPS-0403 | Offers dashboard avg negotiation rounds | Sales Manager | Dashboard load | metric returned | REQ-SALES-189, FR-DA-054 |
| SCN-SALES-OFFER-ANALYTICS-OPS-0404 | Offers dashboard median time-to-decision | Sales Manager | Dashboard load | metric returned | REQ-SALES-190, FR-DA-055 |
| SCN-SALES-OFFER-ANALYTICS-OPS-0405 | Analytics freshness SLA warning | Scheduler | stale data | warning surfaced | REQ-SALES-191, NFR-OPS-062 |
| SCN-SALES-OFFER-ANALYTICS-OPS-0406 | Analytics role scope enforcement | Sales Agent | Dashboard load | restricted scope only | REQ-SALES-192, BR-RBAC-084 |
| SCN-SALES-OFFER-ANALYTICS-OPS-0407 | Offers export CSV by manager | Sales Manager | Export action | CSV generated | REQ-SALES-193, FR-SALES-110 |
| SCN-SALES-OFFER-ANALYTICS-OPS-0408 | Offers export PDF by manager | Sales Manager | Export action | PDF generated | REQ-SALES-193, FR-SALES-110 |
| SCN-SALES-OFFER-ANALYTICS-OPS-0409 | Offers export denied for unauthorized role | Sales Agent | Export action | 403 denied | REQ-SALES-194, BR-RBAC-085 |
| SCN-SALES-OFFER-ANALYTICS-OPS-0410 | Offers analytics weekly executive brief | Scheduler | Weekly cycle | brief delivered | REQ-SALES-195, FR-EXEC-020 |
| SCN-SALES-CONVERT-KYC-COMP-0411 | Conversion checks KYC verified status | Compliance Manager | Convert action | pass/fail gate applied | REQ-SALES-200, POL-AML-001 |
| SCN-SALES-CONVERT-KYC-COMP-0412 | Conversion blocked when KYC pending | Compliance Manager | Convert action | blocked with reason | REQ-SALES-201, POL-AML-001 |
| SCN-SALES-CONVERT-KYC-COMP-0413 | Conversion blocked when KYC rejected | Compliance Manager | Convert action | blocked with reason | REQ-SALES-202, POL-AML-001 |
| SCN-SALES-CONVERT-KYC-COMP-0414 | Conversion allows bypass only owner role | Owner | Override action | bypass logged and allowed | REQ-SALES-203, BR-RBAC-090 |
| SCN-SALES-CONVERT-KYC-COMP-0415 | Bypass denied for manager role | Sales Manager | Override action | 403 denied | REQ-SALES-203, BR-RBAC-091 |
| SCN-SALES-CONVERT-KYC-COMP-0416 | KYC gate writes compliance evidence event | Compliance Manager | Gate action | audit evidence persisted | REQ-SALES-204, BR-AUDIT-080 |
| SCN-SALES-CONVERT-AML-COMP-0417 | Conversion checks AML clear status | Compliance Manager | Convert action | pass/fail gate applied | REQ-SALES-205, POL-AML-001 |
| SCN-SALES-CONVERT-AML-COMP-0418 | Conversion blocked when AML alert open | Compliance Manager | Convert action | blocked with alert reference | REQ-SALES-206, POL-AML-001 |
| SCN-SALES-CONVERT-AML-COMP-0419 | Conversion unblocks after AML resolution | Compliance Manager | Resolve action | conversion gate green | REQ-SALES-207, POL-AML-001 |
| SCN-SALES-CONVERT-AML-COMP-0420 | AML gate event immutable | System | Edit attempt | mutation denied | REQ-SALES-208, BR-AUDIT-081 |
| SCN-SALES-CONVERT-CONSENT-COMP-0421 | Conversion checks PDPL active consent | Compliance Manager | Convert action | pass/fail gate applied | REQ-SALES-209, POL-PDPL-001 |
| SCN-SALES-CONVERT-CONSENT-COMP-0422 | Conversion blocked when consent revoked | Compliance Manager | Convert action | blocked with consent reason | REQ-SALES-210, POL-PDPL-001 |
| SCN-SALES-CONVERT-CONSENT-COMP-0423 | Consent refresh request generated | Compliance Manager | Block action | refresh task created | REQ-SALES-211, FR-SALES-120 |
| SCN-SALES-CONVERT-CONSENT-COMP-0424 | Consent refresh completion reopens conversion | Compliance Manager | Consent update | gate reopened | REQ-SALES-212, FR-SALES-121 |
| SCN-SALES-CONVERT-CONSENT-COMP-0425 | Consent gate logs policy IDs in evidence | Compliance Manager | Gate action | policy refs persisted | REQ-SALES-213, BR-AUDIT-082 |
| SCN-SALES-CONVERT-STAGE-OPS-0426 | Convert lead to deal record | Sales Manager | Convert action | deal record created | REQ-SALES-214, FR-SALES-122 |
| SCN-SALES-CONVERT-STAGE-OPS-0427 | Convert lead marks stage won | Sales Manager | Convert action | lead stage won | REQ-SALES-215, FR-SALES-123 |
| SCN-SALES-CONVERT-STAGE-OPS-0428 | Convert lead locks mutable profile fields | Sales Manager | Convert action | critical fields locked | REQ-SALES-216, BR-SALES-100 |
| SCN-SALES-CONVERT-STAGE-OPS-0429 | Convert lead denied for duplicate active deal | Sales Manager | Convert action | 409 duplicate deal block | REQ-SALES-217, BR-SALES-101 |
| SCN-SALES-CONVERT-STAGE-OPS-0430 | Convert lead denied for unauthorized role | Sales Agent | Convert action | 403 denied | REQ-SALES-218, BR-RBAC-092 |
| SCN-SALES-CONVERT-STAGE-OPS-0431 | Convert action creates onboarding checklist | Scheduler | Convert success | checklist created | REQ-SALES-219, FR-SALES-124 |
| SCN-SALES-CONVERT-STAGE-OPS-0432 | Convert action creates legal document checklist | Scheduler | Convert success | legal checklist created | REQ-SALES-220, FR-SALES-125 |
| SCN-SALES-CONVERT-STAGE-OPS-0433 | Convert action creates finance handoff task | Scheduler | Convert success | finance task created | REQ-SALES-221, FR-SALES-126 |
| SCN-SALES-CONVERT-STAGE-OPS-0434 | Convert action writes immutable conversion event | Sales Manager | Convert success | event logged | REQ-SALES-222, BR-AUDIT-083 |
| SCN-SALES-CONVERT-STAGE-OPS-0435 | Conversion rollback path on legal rejection | Sales Manager | Legal reject | rollback executed with reason | REQ-SALES-223, BR-SALES-102 |
| SCN-SALES-CONTRACT-OPS-0436 | Contract draft creation for sales deal | Legal Ops | Draft action | draft created | REQ-SALES-224, FR-SALES-127 |
| SCN-SALES-CONTRACT-OPS-0437 | Contract draft creation for lease deal | Legal Ops | Draft action | draft created | REQ-SALES-225, FR-SALES-128 |
| SCN-SALES-CONTRACT-OPS-0438 | Contract draft blocked on missing mandatory fields | Legal Ops | Draft action | 422 validation fail | REQ-SALES-226, BR-SALES-103 |
| SCN-SALES-CONTRACT-OPS-0439 | Contract draft blocked on missing templates | Legal Ops | Draft action | dependency error returned | REQ-SALES-227, NFR-REL-070 |
| SCN-SALES-CONTRACT-OPS-0440 | Contract draft versioning enabled | Legal Ops | Draft action | v1 created with metadata | REQ-SALES-228, BR-AUDIT-084 |
| SCN-SALES-CONTRACT-OPS-0441 | Contract send for signature | Legal Ops | Send action | signature request created | REQ-SALES-229, FR-SALES-129 |
| SCN-SALES-CONTRACT-OPS-0442 | Signature completion webhook updates status | Integration | Webhook event | contract status signed | REQ-SALES-230, FR-SALES-130 |
| SCN-SALES-CONTRACT-OPS-0443 | Signature timeout reminder sequence | Scheduler | timeout threshold | reminder queued | REQ-SALES-231, FR-SALES-131 |
| SCN-SALES-CONTRACT-OPS-0444 | Signature rejection route to legal queue | Integration | Rejection event | legal task created | REQ-SALES-232, FR-SALES-132 |
| SCN-SALES-CONTRACT-OPS-0445 | Contract signature event immutable | System | Edit attempt | mutation denied | REQ-SALES-233, BR-AUDIT-085 |
| SCN-SALES-CLOSE-OPS-0446 | Deal close readiness checklist all green | Sales Manager | Close action | close allowed | REQ-SALES-234, FR-SALES-133 |
| SCN-SALES-CLOSE-OPS-0447 | Deal close blocked by missing legal docs | Sales Manager | Close action | blocked reason provided | REQ-SALES-235, BR-SALES-104 |
| SCN-SALES-CLOSE-OPS-0448 | Deal close blocked by pending finance milestone | Sales Manager | Close action | blocked reason provided | REQ-SALES-236, BR-SALES-105 |
| SCN-SALES-CLOSE-OPS-0449 | Deal close blocked by unresolved compliance gate | Compliance Manager | Close action | blocked reason provided | REQ-SALES-237, POL-AML-001 |
| SCN-SALES-CLOSE-OPS-0450 | Deal close success emits closure events | Sales Manager | Close success | closure events published | REQ-SALES-238, BR-AUDIT-086 |
| SCN-SALES-CLOSE-OPS-0451 | Deal close updates revenue pipeline | Finance Analytics | Close success | pipeline metrics updated | REQ-SALES-239, FR-DA-060 |
| SCN-SALES-CLOSE-OPS-0452 | Deal close updates agent commission candidate | Finance Analyst | Close success | commission candidate created | REQ-SALES-240, FR-FIN-050 |
| SCN-SALES-CLOSE-OPS-0453 | Deal close marks property sold/leased | Sales Manager | Close success | property final status updated | REQ-SALES-241, BR-SALES-106 |
| SCN-SALES-CLOSE-OPS-0454 | Deal close notifies stakeholder set | Scheduler | Close success | notifications sent | REQ-SALES-242, FR-SALES-134 |
| SCN-SALES-CLOSE-OPS-0455 | Deal close evidence packet generated | Governance | Close success | evidence packet archived | REQ-SALES-243, BR-AUDIT-087 |
| SCN-SALES-RECOVERY-OPS-0456 | Recovery path for lost deal reactivation | Sales Agent | Reactivate action | lead moved to nurture | REQ-SALES-244, FR-SALES-135 |
| SCN-SALES-RECOVERY-OPS-0457 | Recovery path for failed contract signing | Legal Ops | Failure event | remedial queue created | REQ-SALES-245, FR-SALES-136 |
| SCN-SALES-RECOVERY-OPS-0458 | Recovery path for expired offer re-engagement | Sales Agent | Expiry event | re-engagement sequence queued | REQ-SALES-246, FR-SALES-137 |
| SCN-SALES-RECOVERY-OPS-0459 | Recovery path for payment reversal | Finance Analyst | Reversal event | compliance and finance rollback | REQ-SALES-247, BR-FIN-051 |
| SCN-SALES-RECOVERY-OPS-0460 | Recovery path for compliance gate failure | Compliance Manager | Gate fail | remediation checklist created | REQ-SALES-248, POL-AML-001 |
| SCN-SALES-RECOVERY-OPS-0461 | Recovery escalation after SLA miss | Scheduler | SLA breach | manager escalation | REQ-SALES-249, NFR-OPS-071 |
| SCN-SALES-RECOVERY-OPS-0462 | Recovery ownership reassignment when agent unavailable | Sales Manager | Availability change | owner reassigned | REQ-SALES-250, BR-SALES-107 |
| SCN-SALES-RECOVERY-OPS-0463 | Recovery attempt count limit guard | Scheduler | Retry exceed | escalation only, no loop | REQ-SALES-251, NFR-REL-071 |
| SCN-SALES-RECOVERY-OPS-0464 | Recovery event chain immutable | System | Edit attempt | mutation denied | REQ-SALES-252, BR-AUDIT-088 |
| SCN-SALES-RECOVERY-OPS-0465 | Recovery outcome tracked in analytics taxonomy | Analytics | Recovery completion | outcome metrics updated | REQ-SALES-253, FR-DA-061 |
| SCN-SALES-CROSS-TEAM-OPS-0466 | Sales→Leasing handoff packet generated | Sales Manager | Handoff action | packet created and delivered | REQ-SALES-254, BR-GOV-010 |
| SCN-SALES-CROSS-TEAM-OPS-0467 | Sales→Finance handoff packet generated | Sales Manager | Handoff action | packet created and delivered | REQ-SALES-255, BR-GOV-011 |
| SCN-SALES-CROSS-TEAM-OPS-0468 | Sales→Compliance handoff packet generated | Sales Manager | Handoff action | packet created and delivered | REQ-SALES-256, BR-GOV-012 |
| SCN-SALES-CROSS-TEAM-OPS-0469 | FEEDS_ACK capture for downstream acceptance | Receiving Team | Handoff receipt | ack status stored | REQ-SALES-257, BR-GOV-013 |
| SCN-SALES-CROSS-TEAM-OPS-0470 | Handoff failure escalates to governance | Governance | Handoff timeout | escalation ticket opened | REQ-SALES-258, NFR-OPS-072 |
| SCN-SALES-AUTO-NURTURE-AI-0471 | Trigger day-1 nurture message | Automation Engine | Stage transition | message sent and logged | REQ-AI-010, FR-AI-010 |
| SCN-SALES-AUTO-NURTURE-AI-0472 | Trigger day-3 follow-up task | Automation Engine | Stage transition | task created | REQ-AI-011, FR-AI-011 |
| SCN-SALES-AUTO-NURTURE-AI-0473 | Trigger day-7 market report email | Automation Engine | Stage transition | email sent | REQ-AI-012, FR-AI-012 |
| SCN-SALES-AUTO-NURTURE-AI-0474 | Pause nurture on manual agent activity | Automation Engine | Agent activity event | sequence paused | REQ-AI-013, BR-AI-010 |
| SCN-SALES-AUTO-NURTURE-AI-0475 | Resume nurture after cooldown | Automation Engine | cooldown elapsed | sequence resumed | REQ-AI-014, BR-AI-011 |
| SCN-SALES-AUTO-NURTURE-AI-0476 | Nurture blocked for consent revoked leads | Automation Engine | Consent check | sequence blocked | REQ-AI-015, POL-PDPL-001 |
| SCN-SALES-AUTO-NURTURE-AI-0477 | Nurture failure retries with backoff | Automation Engine | Delivery failure | retry scheduled | REQ-AI-016, NFR-REL-080 |
| SCN-SALES-AUTO-NURTURE-AI-0478 | Nurture hard failure escalates to owner | Automation Engine | retries exhausted | escalation sent | REQ-AI-017, NFR-OPS-080 |
| SCN-SALES-AUTO-NURTURE-AI-0479 | Nurture outcome tracked (open/reply) | Analytics | Event ingest | KPI updated | REQ-AI-018, FR-DA-070 |
| SCN-SALES-AUTO-NURTURE-AI-0480 | Nurture event audit evidence persisted | Automation Engine | Sequence event | immutable event stored | REQ-AI-019, BR-AUDIT-090 |
| SCN-SALES-AUTO-ROUTE-OPS-0481 | Auto-route hot lead to senior lane | Router | Score threshold | senior lane assignment | REQ-SALES-260, BR-SALES-110 |
| SCN-SALES-AUTO-ROUTE-OPS-0482 | Auto-route cold lead to nurture lane | Router | Score threshold | nurture lane assignment | REQ-SALES-261, BR-SALES-111 |
| SCN-SALES-AUTO-ROUTE-OPS-0483 | Auto-route respects working hours guard | Router | Assignment event | off-hours queue hold | REQ-SALES-262, NFR-OPS-081 |
| SCN-SALES-AUTO-ROUTE-OPS-0484 | Auto-route fallback on missing owner map | Router | Map miss | default queue fallback | REQ-SALES-263, NFR-REL-081 |
| SCN-SALES-AUTO-ROUTE-OPS-0485 | Auto-route fairness cap by daily lead count | Router | Assignment event | cap enforcement | REQ-SALES-264, BR-SALES-112 |
| SCN-SALES-AUTO-ROUTE-OPS-0486 | Auto-route event emits explainability payload | Router | Assignment event | explainability fields saved | REQ-SALES-265, BR-AI-012 |
| SCN-SALES-AUTO-ROUTE-OPS-0487 | Auto-route denied for agent license expired | Router | Candidate check | candidate skipped | REQ-SALES-266, POL-RERA-001 |
| SCN-SALES-AUTO-ROUTE-OPS-0488 | Auto-route denied for compliance hold agent | Router | Candidate check | candidate skipped | REQ-SALES-267, BR-SALES-113 |
| SCN-SALES-AUTO-ROUTE-OPS-0489 | Auto-route health heartbeat visible | Ops | Monitoring check | heartbeat status green | REQ-SALES-268, BR-OBS-030 |
| SCN-SALES-AUTO-ROUTE-OPS-0490 | Auto-route outage fallback to manual queue | Ops | Outage event | manual queue activated | REQ-SALES-269, NFR-REL-082 |
| SCN-SALES-GOV-VERIFY-OPS-0491 | Verify all A2 IDs unique | Governance | Validation run | no duplicates | REQ-GOV-020, BR-GOV-020 |
| SCN-SALES-GOV-VERIFY-OPS-0492 | Verify all A2 rows include REQ refs | Governance | Validation run | 100% req linkage | REQ-GOV-021, BR-GOV-021 |
| SCN-SALES-GOV-VERIFY-OPS-0493 | Verify all A2 rows include policy refs | Governance | Validation run | 100% policy linkage | REQ-GOV-022, BR-GOV-022 |
| SCN-SALES-GOV-VERIFY-OPS-0494 | Verify alternate/failure/recovery family coverage | Governance | Validation run | family coverage pass | REQ-GOV-023, BR-GOV-023 |
| SCN-SALES-GOV-VERIFY-OPS-0495 | Verify traceability matrix update complete | Governance | Validation run | matrix updated | REQ-GOV-024, BR-GOV-024 |
| SCN-SALES-GOV-VERIFY-OPS-0496 | Verify master index count synchronization | Governance | Validation run | index counts accurate | REQ-GOV-025, BR-GOV-025 |
| SCN-SALES-GOV-VERIFY-OPS-0497 | Verify business docs index links include A2 | Governance | Validation run | link exists and resolves | REQ-GOV-026, BR-GOV-026 |
| SCN-SALES-GOV-VERIFY-OPS-0498 | Verify coverage matrix implemented count updated | Governance | Validation run | coverage row updated | REQ-GOV-027, BR-GOV-027 |
| SCN-SALES-GOV-VERIFY-OPS-0499 | Verify handoff packet includes FEEDS_ACK status | Governance | Validation run | handoff evidence present | REQ-GOV-028, BR-GOV-028 |
| SCN-SALES-GOV-VERIFY-OPS-0500 | Batch A2 closure acceptance | Governance | Final signoff | batch marked complete | REQ-GOV-029, AC-GOV-010 |

## 4. Acceptance baseline

Batch A2 is complete when:

1. all 300 scenarios are indexed and traceable,
2. all scenario IDs are unique,
3. all scenario records map to at least one `REQ-*` and one `POL-*` (or `BR-*` where policy bridge is explicit),
4. all scenario families include failure and recovery coverage,
5. linkage is reflected in the master index and business docs index.

## 5. Next batch handoff

- Batch A3 target: Operations + Maintenance + Incident Workflows (0501–0800)
- Owner lane: Operations + Support + Compliance + QA
