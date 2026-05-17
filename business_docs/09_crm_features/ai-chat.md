# AI Chat

> **Owner:** @Corinne | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** Context-aware AI chat API powering all 40 White Caves AI assistant personas.
> **Status:** Stub -- awaiting expansion by @Corinne.

---

## 1. Overview

> _TODO: expand this section with full spec._

## 2. API Endpoint Spec (POST /api/ai-chat)

> _TODO: expand this section with full spec._

## 3. Context Injection Strategy

> _TODO: expand this section with full spec._

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
