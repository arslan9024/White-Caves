# PHASE 1: NADIA Implementation

## Meta Business API Webhook Receiver & routing Engine

**Project**: White Caves Real Estate Platform  
**Phase**: 1 of 3 (Linda, Nina, Nadia)  
**Objective**: Build the webhook receiver and orchestration layer for WhatsApp Business API  
**Duration**: 2-3 days estimated  
**Date**: March 29, 2026

---

## 🎯 PHASE 1 OBJECTIVES

Build the **Communications Manager** - NADIA's role as the webhook receiver, router, and orchestrator for all WhatsApp Business API interactions.

### Deliverables

1. ✅ Webhook listener (`/api/webhooks/whatsapp`)
2. ✅ Message router (to Nina for NLP, to agents via Linda)
3. ✅ Agent management (23+ phone numbers)
4. ✅ Lead prioritization (routing based on score)
5. ✅ CRM conversation archiving
6. ✅ SLA tracking (agent response time <5min)
7. ✅ Comprehensive documentation & examples
8. ✅ E2E tests for webhook delivery

---

## 📋 PREREQUISITES: Check Before Starting

### Required Credentials (Get from Meta)

```
✓ Meta Business Account ID
✓ WABA (WhatsApp Business Account) ID
✓ Phone Number ID
✓ Permanent Access Token (from Meta)
✓ Webhook Verify Token (generate a secure random string)
✓ Graph API Version (v18.0 or later)
```

**Time to set up**: ~1 hour (if you haven't already)  
**Cost**: $0.05 per 1,000 messages (once live)

### Required in Environment

```bash
# .env file
NADIA_META_BUSINESS_ACCOUNT_ID=xxxxx
NADIA_META_WABA_ID=xxxxx
NADIA_META_PHONE_NUMBER_ID=xxxxx
NADIA_META_ACCESS_TOKEN=xxxxx (keep secret!)
NADIA_WEBHOOK_VERIFY_TOKEN=xxxxx (random secure string)
NADIA_GRAPH_API_VERSION=v18.0
NADIA_WEBHOOK_URL=https://yourdomain.com/api/webhooks/whatsapp
```

### Node Packages Required

```bash
npm install axios crypto dotenv joi
# Already in package.json? Verify with: npm list axios crypto joi
```

---

## 🏗️ ARCHITECTURE: What We're Building

### Request Flow

```
Customer WhatsApp
    ↓
Meta Cloud (incoming message)
    ↓
NADIA Webhook (/api/webhooks/whatsapp)
    ↓
Verify Webhook Signature (HMAC-SHA256)
    ↓
Parse Message + Extract Intent
    ↓
Call NINA (NLP Processing)
    ↓
Route Decision:
  ├─ Score > 75 → Notify Agent (via Linda)
  ├─ Score 50-75 → Queue for Agent Queue
  ├─ Score < 50 → Bot Flow
  └─ Unknown → Support Team
    ↓
NADIA Sends Response (template or agent message)
    ↓
NADIA Archives to CRM
    ↓
Return 200 OK to Meta
```

---

## 📂 FILES TO CREATE

### 1. `src/services/whatsapp/NadiaWebhookService.ts`

**Purpose**: Core webhook handler and router

```typescript
import axios from 'axios';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';

interface WhatsAppWebhookPayload {
  object: 'whatsapp_business_account';
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: 'whatsapp';
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: 'text' | 'image' | 'document' | 'audio' | 'video';
          text?: { body: string };
          image?: { id: string; mime_type: string; sha256: string };
          // ... other fields
        }>;
        statuses?: Array<{
          id: string;
          status: 'sent' | 'delivered' | 'read' | 'failed';
          timestamp: string;
          recipient_id: string;
        }>;
      };
    }>;
  }>;
}

export class NadiaWebhookService {
  private wabaId: string;
  private accessToken: string;
  private webhookToken: string;
  private graphApiVersion: string;

  constructor() {
    this.wabaId = process.env.NADIA_META_WABA_ID!;
    this.accessToken = process.env.NADIA_META_ACCESS_TOKEN!;
    this.webhookToken = process.env.NADIA_WEBHOOK_VERIFY_TOKEN!;
    this.graphApiVersion = process.env.NADIA_GRAPH_API_VERSION || 'v18.0';
  }

  /**
   * Verify webhook signature (HMAC-SHA256)
   * Meta sends: X-Hub-Signature header
   */
  verifyWebhookSignature(body: string, signature: string): boolean {
    const expectedSignature = `sha1=${crypto
      .createHmac('sha256', this.accessToken)
      .update(body)
      .digest('hex')}`;

    return crypto.timingSafeEqual(signature, expectedSignature);
  }

  /**
   * Handle webhook verification (GET request)
   */
  verifyWebhook(verifyToken: string, challenge: string): { challenge: string } | null {
    if (verifyToken === this.webhookToken) {
      return { challenge };
    }
    return null;
  }

  /**
   * Process incoming webhook message
   */
  async handleIncomingMessage(payload: WhatsAppWebhookPayload): Promise<void> {
    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        const { value } = change;

        // Handle messages
        if (value.messages && value.messages.length > 0) {
          for (const message of value.messages) {
            await this.processIncomingMessage(message, value.metadata);
          }
        }

        // Handle status updates
        if (value.statuses && value.statuses.length > 0) {
          for (const status of value.statuses) {
            await this.processStatusUpdate(status);
          }
        }
      }
    }
  }

  /**
   * Process individual message
   */
  private async processIncomingMessage(message: any, metadata: any): Promise<void> {
    const { from, timestamp, text } = message;
    const messageBody = text?.body || '';

    // 1. Create conversation record (if not exists)
    const conversation = await prisma.nadia_Conversation.upsert({
      where: { customerPhone: from },
      create: {
        wabaId: this.wabaId,
        customerPhone: from,
        status: 'active',
        leadScore: 0,
        intent: 'unknown',
        createdAt: new Date(parseInt(timestamp) * 1000),
        updatedAt: new Date(),
      },
      update: {
        updatedAt: new Date(),
        status: 'active',
      },
    });

    // 2. Call NINA for NLP processing
    const ninaOutput = await this.callNina(messageBody, conversation.id);

    // 3. Route based on lead score
    await this.routeMessage(conversation.id, ninaOutput, from, messageBody);

    // 4. Archive message
    await prisma.nadia_Message.create({
      data: {
        conversationId: conversation.id,
        waMessageId: message.id,
        direction: 'inbound',
        body: messageBody,
        status: 'received',
        timestamp: new Date(parseInt(timestamp) * 1000),
      },
    });
  }

  /**
   * Call NINA (NLP engine)
   */
  private async callNina(text: string, conversationId: string): Promise<any> {
    try {
      const response = await axios.post('http://localhost:3001/api/nina/process', {
        text,
        conversationId,
      });
      return response.data;
    } catch (error) {
      console.error('Error calling NINA:', error);
      return { intent: 'unknown', leadScore: 0, confidence: 0 };
    }
  }

  /**
   * Route message to appropriate handler
   */
  private async routeMessage(
    conversationId: string,
    ninaOutput: any,
    customerPhone: string,
    messageBody: string
  ): Promise<void> {
    const { leadScore, intent, entities } = ninaOutput;

    // Update conversation with Nina's output
    await prisma.nadia_Conversation.update({
      where: { id: conversationId },
      data: {
        leadScore,
        intent,
        status: leadScore > 75 ? 'hot_lead' : 'active',
      },
    });

    // Routing decisions
    if (leadScore > 75) {
      // HOT LEAD → Route to senior agent
      await this.notifyAgentViaLinda(customerPhone, conversationId, ninaOutput);
    } else if (leadScore >= 50) {
      // WARM LEAD → Queue for agent
      await this.queueForAgent(conversationId, ninaOutput);
    } else if (intent === 'property_search') {
      // BOT FLOW → Property search bot
      await this.sendBotResponse(customerPhone, conversationId, entities);
    } else {
      // DEFAULT → Support queue
      await this.queueForSupport(conversationId);
    }
  }

  /**
   * Notify agent via LINDA
   */
  private async notifyAgentViaLinda(
    customerPhone: string,
    conversationId: string,
    ninaOutput: any
  ): Promise<void> {
    try {
      // Send notification to Linda (local WhatsApp client)
      await axios.post('http://localhost:3001/api/linda/notify', {
        type: 'HOT_LEAD',
        customerPhone,
        conversationId,
        leadScore: ninaOutput.leadScore,
        intent: ninaOutput.intent,
        entities: ninaOutput.entities,
      });

      // Record routing decision
      await prisma.nadia_Conversation.update({
        where: { id: conversationId },
        data: {
          status: 'assigned_to_agent',
          routedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error notifying agent via Linda:', error);
    }
  }

  /**
   * Queue for next available agent
   */
  private async queueForAgent(conversationId: string, ninaOutput: any): Promise<void> {
    await prisma.nadia_ConversationQueue.create({
      data: {
        conversationId,
        priority: Math.floor(ninaOutput.leadScore / 10), // 5-7 priority level
        status: 'waiting',
        queuedAt: new Date(),
      },
    });
  }

  /**
   * Send bot response (e.g., property search)
   */
  private async sendBotResponse(
    customerPhone: string,
    conversationId: string,
    entities: any
  ): Promise<void> {
    const { type, location, budget } = entities;

    // Simple template response
    const messageText = `🏠 Found ${3} properties matching your criteria:
1. Downtown Villa - AED 2.5M
2. Marina Apartment - AED 1.8M  
3. Business Bay Studio - AED 950K

Reply with a number to see details or /schedule for a tour!`;

    await this.sendMessageToCustomer(customerPhone, messageText, conversationId);
  }

  /**
   * Queue for support
   */
  private async queueForSupport(conversationId: string): Promise<void> {
    await prisma.nadia_ConversationQueue.create({
      data: {
        conversationId,
        priority: 1, // Low priority
        status: 'waiting',
        queuedAt: new Date(),
      },
    });
  }

  /**
   * Send message to customer (via Meta Cloud API)
   */
  async sendMessageToCustomer(
    phoneNumber: string,
    messageText: string,
    conversationId: string
  ): Promise<void> {
    try {
      const response = await axios.post(
        `https://graph.instagram.com/${this.graphApiVersion}/${process.env.NADIA_META_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: phoneNumber,
          type: 'text',
          text: { preview_url: true, body: messageText },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Archive sent message
      await prisma.nadia_Message.create({
        data: {
          conversationId,
          waMessageId: response.data.messages[0].id,
          direction: 'outbound',
          body: messageText,
          status: 'sent',
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Error sending message to customer:', error);
      throw error;
    }
  }

  /**
   * Process status update (sent, delivered, read)
   */
  private async processStatusUpdate(status: any): Promise<void> {
    await prisma.nadia_Message.updateMany({
      where: { waMessageId: status.id },
      data: {
        status: status.status,
        updatedAt: new Date(),
      },
    });
  }
}
```

### 2. `src/routes/api/webhooks/whatsapp.ts`

**Purpose**: Express endpoint handler

```typescript
import { Router, Request, Response } from 'express';
import { NadiaWebhookService } from '../../../services/whatsapp/NadiaWebhookService';

const router = Router();
const nadia = new NadiaWebhookService();

// GET: Webhook verification (Meta initial handshake)
router.get('/whatsapp', (req: Request, res: Response) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token) {
    const verified = nadia.verifyWebhook(token as string, challenge as string);
    if (verified) {
      res.status(200).send(verified.challenge);
      console.log('✓ Webhook verified by Meta');
      return;
    }
  }

  res.status(403).json({ error: 'Verification failed' });
});

// POST: Incoming messages from Meta
router.post('/whatsapp', async (req: Request, res: Response) => {
  // Verify webhook signature
  const xHubSignature = req.headers['x-hub-signature-256'] as string;
  const rawBody = JSON.stringify(req.body);

  try {
    const isValid = nadia.verifyWebhookSignature(rawBody, xHubSignature);
    if (!isValid) {
      return res.status(403).json({ error: 'Invalid signature' });
    }

    // Parse and process webhook
    const payload = req.body as WhatsAppWebhookPayload;
    await nadia.handleIncomingMessage(payload);

    // Must return 200 OK within 30 seconds
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

### 3. `prisma/schema.prisma` (Add Models)

**Purpose**: Database schema for NADIA

```prisma
// ─── NADIA CONVERSATIONS ─────────────────────────────────────────────────────

model NadiaConversation {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  wabaId      String   // Meta WABA ID
  customerPhone String  // Customer's WhatsApp number
  agentPhone  String?  // Assigned agent phone (if assigned)

  // Message history
  messages    NadiaMessage[]

  // NLP & Routing
  intent      String?  // From Nina: property_search, schedule_tour, etc.
  leadScore   Int      @default(0) // 0-100 from Nina
  timeline    String?  // From Nina: ASAP, 1-3mo, etc.

  // Status
  status      String   @default("active") // active, assigned_to_agent, in_bot_flow, closed
  routedAt    DateTime?
  closedAt    DateTime?
  closedReason String?  // why conversation closed

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([customerPhone])
  @@index([status])
  @@index([leadScore])
  @@index([createdAt])
  @@index([agentPhone])
}

model NadiaMessage {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  conversationId String @db.ObjectId
  conversation NadiaConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  waMessageId String   // Message ID from Meta WhatsApp
  direction   String   // inbound | outbound
  body        String
  messageType String   @default("text") // text, image, document, audio, video

  status      String   @default("sent") // sent, delivered, read, failed

  timestamp   DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([conversationId])
  @@index([status])
  @@index([timestamp])
}

model NadiaConversationQueue {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  conversationId  String   @unique @db.ObjectId
  conversation    NadiaConversation @relation(fields: [conversationId], references: [id])

  priority        Int      // 1-10, higher = better
  status          String   @default("waiting") // waiting, assigned, completed
  assignedTo      String?  // Agent phone if assigned
  assignedAt      DateTime?
  queuedAt        DateTime @default(now())
  completedAt     DateTime?

  // SLA tracking
  responseTime    Int?     // milliseconds
  slaMetTarget    DateTime @default(dbgenerated("dateAdd(queuedAt, interval '5 minute')"))

  @@index([status])
  @@index([priority])
  @@index([queuedAt])
}
```

---

## 📝 IMPLEMENTATION STEPS

### Step 1: Create Prisma Models (15 min)

```bash
# 1. Add models to prisma/schema.prisma (NADIA section)
# 2. Generate and push
npx prisma generate
npx prisma db push
```

### Step 2: Create NadiaWebhookService (45 min)

```bash
# 1. Create: src/services/whatsapp/NadiaWebhookService.ts
# 2. Implement all methods from template above
# 3. Verify imports resolve
```

### Step 3: Create Express Endpoint (15 min)

```bash
# 1. Create: src/routes/api/webhooks/whatsapp.ts
# 2. Register route in src/routes/index.ts or server.ts
app.use('/api/webhooks', whatsappRoutes);
```

### Step 4: Add Environment Variables (5 min)

```bash
# Update .env with Meta credentials
NADIA_META_BUSINESS_ACCOUNT_ID=xxxxx
NADIA_META_WABA_ID=xxxxx
NADIA_META_PHONE_NUMBER_ID=xxxxx
NADIA_META_ACCESS_TOKEN=xxxxx
NADIA_WEBHOOK_VERIFY_TOKEN=xxxxx
NADIA_GRAPH_API_VERSION=v18.0
```

### Step 5: Create Tests (30 min)

```typescript
// tests/nadia-webhook.spec.ts
describe('NadiaWebhookService', () => {
  it('should verify valid webhook signature');
  it('should reject invalid webhook signature');
  it('should parse incoming message correctly');
  it('should call NINA for NLP processing');
  it('should route hot leads (score > 75) to agents');
  it('should queue warm leads (score 50-75)');
  it('should send bot responses for property searches');
  it('should archive all messages to database');
});
```

### Step 6: E2E Testing (30 min)

```bash
# 1. Start local server: npm run dev
# 2. Test with ngrok: npx ngrok http 3000
# 3. Register ngrok URL with Meta Webhook
# 4. Send test messages via Meta API
# 5. Verify messages appear in dashboard
```

---

## 🧪 TESTING CHECKLIST

- [ ] Webhook verification (GET request from Meta)
- [ ] Incoming message handling (POST request)
- [ ] Signature verification (HMAC-SHA256)
- [ ] NINA integration (mock if not yet available)
- [ ] Message routing (hot/warm/cold leads)
- [ ] Database archiving
- [ ] Error handling (invalid signature, timeout, etc.)
- [ ] Status updates (sent, delivered, read)
- [ ] SLA tracking (response time <5min)

---

## 📊 SUCCESS METRICS

✅ **Phase 1 Complete When:**

1. [ ] Webhook receives messages from Meta without errors
2. [ ] All incoming messages archived in DB
3. [ ] Routing logic directs leads correctly (hot/warm/cold)
4. [ ] NINA integration works (messages processed for intent)
5. [ ] Agent notifications sent via Linda (when available)
6. [ ] SLA tracking calculated accurately
7. [ ] All E2E tests passing
8. [ ] Documentation complete

---

## 📁 DELIVERABLES

📦 **Phase 1 Package Includes:**

1. ✅ `NadiaWebhookService.ts` - Core webhook handler
2. ✅ `whatsapp.ts` - Express routes
3. ✅ Prisma models (NadiaConversation, NadiaMessage, Queue)
4. ✅ `.env` template
5. ✅ E2E tests (webhook.spec.ts)
6. ✅ Integration guide (this document)
7. ✅ Example API payloads
8. ✅ Troubleshooting guide

---

## ⏱️ TIMELINE

- **Step 1 (Prisma)**: 15 min
- **Step 2 (WebhookService)**: 45 min
- **Step 3 (Routes)**: 15 min
- **Step 4 (Env Vars)**: 5 min
- **Step 5 (Tests)**: 30 min
- **Step 6 (E2E Testing)**: 30 min
- **Buffer/Debugging**: 30 min

**TOTAL**: 2.5-3 hours

---

## 🔗 NEXT: PHASES 2 & 3

After Phase 1 completes:

- **Phase 2**: NINA (NLP Engine)
  - Claude integration
  - Intent classification
  - Entity extraction
  - Lead scoring

- **Phase 3**: LINDA (LocalAuth WhatsApp)
  - whatsapp-web.js integration
  - QR code sessions
  - Local message sending
  - Real estate command execution

---

## 💡 tips

1. **Start with mocks**: Mock NINA and LINDA responses while building Phase 1
2. **Use ngrok for testing**: Expose local server to Meta webhooks
3. **Keep logs verbose**: Log all webhook payloads for debugging
4. **Test manually first**: Use Postman to send test payloads before E2E
5. **Backup DB**: Keep MongoDB backup before large changes

---

**Ready to Start?** → Run Step 1 (Prisma models)  
**Questions?** → Check troubleshooting section  
**Status**: ✅ Ready for Implementation
