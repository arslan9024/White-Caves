# AI Chat

> **Owner:** @Corinne | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** Context-aware AI chat API powering all 40 White Caves AI assistant personas.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM AI chat feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/integration-requirements.md`](../05_requirements/integration-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend reliability/performance lanes in `docs/plans/waves/WAVE_38_*` through `WAVE_40_*`

---

## 1. Overview

The AI chat module provides context-aware assistant behavior across CRM entities, with guarded memory, streaming, and fallback routing.

## Requirement catalog

### REQ-CHAT-001: Context-aware chat requests

The system shall accept chat requests with assistant, message, and context metadata.

**Acceptance criteria:**

- [ ] Chat requests can reference lead, property, or tenant context
- [ ] Context injection is limited to the active record scope
- [ ] Request validation prevents malformed payloads

**Evidence:** chat request log and validation output.

### REQ-CHAT-002: Streaming responses and persistence

The system shall stream responses token-by-token and persist the conversation history.

**Acceptance criteria:**

- [ ] SSE streaming emits token, done, and error events
- [ ] Last 20 messages are retained per session
- [ ] TTL policy removes stale sessions automatically

**Evidence:** stream trace and persistence log.

### REQ-CHAT-003: Token budgets and provider abstraction

The system shall enforce token budgets per assistant class and support provider switching.

**Acceptance criteria:**

- [ ] Standard and executive assistants have different budgets
- [ ] Provider selection is environment-driven
- [ ] Budget overages are blocked or truncated safely

**Evidence:** budget record and provider routing audit.

### REQ-CHAT-004: Fallback chain and security controls

The system shall fail over through the configured provider chain and protect user data.

**Acceptance criteria:**

- [ ] Secondary provider is attempted on primary failure
- [ ] Final fallback returns a safe canned response
- [ ] Prompt sanitization and PII masking are enforced

**Evidence:** fallback log and security review.

## Traceability

- Maps to `REQ-WA-003`, `REQ-LEAD-003`, `REQ-TP-005`, and assistant workflows
- Aligns to `WC-SRS-008`, `WC-SRS-009`, and AI chat evidence artifacts
- Feeds streaming, memory, and fallback validation

## 2. API Endpoint Spec (POST /api/ai-chat)

The request contract should include assistantId, messages, optional entity context, and userId, with authenticated access required.

## 3. Context Injection Strategy

Context injection should prefix the model prompt with only the fields relevant to the active CRM entity and user role.

## 4. Message Schema

- Fields: role, content, timestamp, metadata.
- Supported roles: system, user, assistant, tool.

## 5. Streaming Protocol

- SSE endpoint for token streaming.
- Event types: token, done, error.

## 6. Conversation Persistence

- Store last 20 messages per session.
- 30-day TTL policy on conversation documents.

## 7. Token Budgeting

- Standard assistants: 1000 tokens/request.
- Executive assistants: 2000 tokens/request.
- Daily caps enforced per assistantId.

## 8. Provider Abstraction

- Adapter layer for OpenAI, Anthropic, Groq.
- Runtime provider switch via environment config.

## 9. Fallback Chain

- Primary provider failure -> secondary provider.
- Final fallback: canned safe response + alert.

## 10. Security and Privacy

- Prompt sanitization and PII masking.
- Access control by role and context ownership.

## 11. API Contract

- `POST /api/ai-chat`
- `GET /api/ai-chat/stream/:sessionId`
- `GET /api/ai-chat/sessions/:id`

## 12. Acceptance Criteria

- Context-aware responses match lead/property scope.
- Streaming remains stable under concurrent usage.
- Fallback path works for provider outages.

## 13. Test Plan

- Unit tests for token budgeting and fallback routing.
- Integration tests for SSE flow and persistence.
- Security tests for role/context isolation.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
