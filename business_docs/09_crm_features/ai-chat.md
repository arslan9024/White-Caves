# AI Chat — Business Specification

**Owner:** @Corinne | **Tool:** DeepSeek Chat (DeepSeek V3)
**Purpose:** Context-aware AI chat API powering all 40 White Caves AI assistant personas.
**Status:** ✅ Expanded by @Corinne.

CONSUMES←@Jaime: business_docs/09_crm_features/whatsapp-integration.md#ai-routing
FEEDS→@Rachel: business_docs/09_crm_features/ai-chat.md#search-intent-signals

---

## 1. Overview

The AI Chat API is the unified backbone powering all 40 White Caves AI assistant personas. Every persona (Nina the chatbot, Nadia the WhatsApp agent, Cipher the market analyst, Atlas the legal advisor, etc.) routes through this single API with context injection, provider abstraction, streaming response, and fallback chain logic.

**Key Capabilities:**
- Unified `/api/ai-chat` endpoint for all 40 personas
- Context injection from CRM entity data (lead, property, tenant, lease)
- SSE streaming for token-by-token response delivery
- Per-persona token budget enforcement
- Provider abstraction (OpenAI / Anthropic / Groq swap via env var)
- Conversation persistence (30-day TTL, last 20 messages)
- Fallback chain on provider failure + canned response + Slack alert

---

## 2. API Endpoint Spec

### Request (POST /api/ai-chat)
```ts
interface AIChatRequest {
  assistantId: string;          // e.g. "nina", "cipher", "atlas"
  messages: ChatMessage[];      // conversation history
  context?: {
    leadId?: string;
    propertyId?: string;
    tenantId?: string;
    leaseId?: string;
  };
  userId: string;
  sessionId?: string;           // for conversation continuity
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}
```

### Response
```ts
interface AIChatResponse {
  message: ChatMessage;
  sessionId: string;
  assistantId: string;
  tokensUsed: number;
  provider: string;             // which AI provider handled this request
  fallbackUsed: boolean;
}
```

### Error Codes
| Code | Meaning |
|---|---|
| 400 | Invalid assistantId or empty messages |
| 401 | Unauthenticated |
| 403 | Token budget exceeded for this assistantId today |
| 429 | Rate limit (10 req/min per user) |
| 503 | All providers failed — canned response returned |

---

## 3. Context Injection Strategy

When `context` fields are provided, relevant CRM data is fetched and injected as a system message prefix before the user's messages:

```ts
// server/services/ai/contextInjector.ts
async function buildContext(context: AIChatContext): Promise<string> {
  const parts: string[] = [];

  if (context.leadId) {
    const lead = await prisma.lead.findUnique({ where: { id: context.leadId } });
    parts.push(`Current Lead: ${lead.name}, Budget: AED ${lead.budgetMax}, Area: ${lead.preferredArea}, Stage: ${lead.stage}`);
  }

  if (context.propertyId) {
    const prop = await prisma.property.findUnique({ where: { id: context.propertyId } });
    parts.push(`Current Property: ${prop.address}, ${prop.bedrooms}BR, AED ${prop.price}, Status: ${prop.status}`);
  }

  if (context.tenantId) {
    const tenant = await prisma.user.findUnique({ where: { id: context.tenantId } });
    const lease = await getActiveLease(context.tenantId);
    parts.push(`Current Tenant: ${tenant.name}, Lease: ${lease.propertyAddress}, Expires: ${lease.endDate}`);
  }

  return parts.join('\n');
}
```

**Context size limit:** 500 tokens max for injected context (truncated if exceeded).

---

## 4. SSE Streaming

**Endpoint:** `GET /api/ai-chat/stream/:sessionId`

```ts
// Server-Sent Events: browser connects with EventSource
// Server pushes: data: { token: "Hello" }\n\n
// On completion: data: { done: true, tokensUsed: 245 }\n\n

router.get('/ai-chat/stream/:sessionId', authMiddleware, async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // subscribe to streaming session
  const session = streamSessions.get(req.params.sessionId);
  session.on('token', (t: string) => res.write(`data: ${JSON.stringify({ token: t })}\n\n`));
  session.on('done', (usage) => { res.write(`data: ${JSON.stringify({ done: true, ...usage })}\n\n`); res.end(); });
});
```

**Frontend:** `EventSource('/api/ai-chat/stream/{sessionId}')` — append tokens to message bubble as they arrive.

---

## 5. Conversation Persistence

```prisma
model AiConversation {
  id          String   @id @default(cuid())
  sessionId   String   @unique
  assistantId String
  userId      String
  messages    Json[]   // last 20 messages
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  expiresAt   DateTime  // TTL: 30 days from last message
  @@index([userId, assistantId])
}
```

**Message window:** Only last 20 messages included in API calls to control context length costs. Older messages archived (not sent to provider).

---

## 6. Per-Persona Token Budget

| Role | Daily Token Budget | Model |
|---|---|---|
| Standard assistants (Nina, booking, etc.) | 100,000 tokens/day | gpt-4o-mini |
| Senior assistants (Cipher, Atlas, Maven) | 200,000 tokens/day | gpt-4o |
| Executive assistants (Kairos, Evangeline) | 300,000 tokens/day | gpt-4o |

Budget tracked in Redis: `INCRBY ai:tokens:{assistantId}:{YYYYMMDD} {tokensUsed}` with 25-hour TTL.
When budget exceeded → `403 Token budget exceeded`. Admin can raise per-assistant budget in system settings.

---

## 7. Provider Abstraction Layer

```ts
// server/services/ai/providerRouter.ts
type Provider = 'openai' | 'anthropic' | 'groq';

const PROVIDER_PRIMARY: Provider = (process.env.AI_PROVIDER as Provider) || 'openai';

const FALLBACK_CHAIN: Provider[] = ['openai', 'anthropic', 'groq'];

async function callWithFallback(messages: ChatMessage[], model: string): Promise<AIResponse> {
  for (const provider of [PROVIDER_PRIMARY, ...FALLBACK_CHAIN.filter(p => p !== PROVIDER_PRIMARY)]) {
    try {
      return await callProvider(provider, messages, model);
    } catch (err) {
      logger.warn(`AI provider ${provider} failed: ${err.message}`);
    }
  }
  // All providers failed
  await notifySlack('🚨 ALL AI PROVIDERS FAILED — returning canned response');
  return { content: "I'm temporarily unavailable. Please contact your agent directly.", fallbackUsed: true };
}
```

---

## 8. Rate Limiting

- **Per user:** 10 requests/minute (Redis sliding window)
- **Per assistant:** 100 requests/minute across all users
- On rate limit → `429 Too Many Requests` + `Retry-After: 60` header

---

## 9. Unit / Integration Tests

| Test | Coverage |
|---|---|
| Context injection builds correct system prompt | Unit |
| Streaming delivers tokens in order | Integration |
| Token budget enforced at 403 | Integration |
| Fallback chain: openai fails → anthropic used | Unit (mocked) |
| All providers fail → canned response + Slack | Integration |
| Conversation history pruned to last 20 messages | Unit |

---

## 10. Observability / Metrics

| Metric | Alert |
|---|---|
| Provider error rate | > 5% → PagerDuty |
| Token budget utilisation | > 80% → Slack |
| Average response latency | > 3s → Slack |
| Fallback rate | > 2% → Slack |
| Daily token spend by assistant | Dashboard bar chart |

---

## 11. Security Controls

- All AI chat requests require JWT authentication
- Context data (lead, property, tenant) scoped to requesting user's RBAC permissions
- No PII sent to AI provider in plaintext — names replaced with `[TENANT]`, `[LEAD]` tokens for privacy-sensitive personas
- API keys for all providers stored in env vars; never logged
- Conversation data encrypted at rest (MongoDB field-level encryption for `messages` array)