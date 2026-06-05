// @ts-nocheck
/**
 * Linda WhatsApp Routes
 *
 * Full CRUD + management surface for the Linda WhatsApp LocalAuth channel.
 *
 * Endpoints:
 *  GET  /api/linda/status                         — connection status
 *  GET  /api/linda/qr                             — current QR code (base64 PNG)
 *  POST /api/linda/connect                        — trigger initialization (owner only)
 *  POST /api/linda/disconnect                     — graceful disconnect (owner only)
 *  GET  /api/linda/stats                          — detailed statistics
 *  GET  /api/linda/sessions                       — active bot sessions list
 *  GET  /api/linda/health                         — simple health check (no auth)
 *  POST /api/linda/send/:conversationId           — send message to one contact
 *  POST /api/linda/broadcast                      — broadcast to multiple phones
 *  POST /api/linda/webhook                        — poll-based message ingestion
 *  GET  /api/linda/conversations                  — list active chats
 *  GET  /api/linda/conversations/:phone/history   — conversation history
 *  POST /api/linda/ready                          — readiness check
 */

import { Router, Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import {
  getLindaClientForMode,
  getLindaCoreMode,
  LindaStatus,
} from '../services/whatsapp/linda-core/adapters/LindaCoreAdapter.js';
import { LindaSessionBridge } from '../services/whatsapp/linda-core/bridge/LindaSessionBridge.js';
import { LindaMessageBridge } from '../services/whatsapp/linda-core/bridge/LindaMessageBridge.js';
import {
  buildLindaParitySnapshot,
  emitLindaParitySnapshot,
} from '../services/whatsapp/linda-core/bridge/shadowParityReporter.js';
import { requirePermission, requireRole } from '../middleware/rbac.js';
import { getSocketServer } from '../services/socketServer.js';
import { LINDA_ENABLED } from '../config/env.js';
import { prisma } from '../database.js';
import { rateLimiter } from '../services/whatsapp/whatsappUtils.js';
import {
  dispatchLindaCampaign,
  dispatchDueLindaCampaigns,
} from '../services/whatsapp/lindaCampaignService.js';
import { checkPhoneSavedInGoraha } from '../services/whatsapp/gorahaContactCheckService.js';

function applyTemplate(
  messageTemplate: string,
  templateVars?: Record<string, unknown> | null
): string {
  if (!templateVars || typeof templateVars !== 'object') return messageTemplate;
  let rendered = messageTemplate;
  for (const [key, value] of Object.entries(templateVars)) {
    rendered = rendered.split(`{{${key}}}`).join(String(value));
  }
  return rendered;
}

const router = Router();
const db = prisma as any;

// ─── Singleton initialisation helper ──────────────────────────────────────

async function getOrInitLindaRuntime() {
  const mode = getLindaCoreMode();
  const linda = getLindaClientForMode({
    sessionPath: process.env.LINDA_SESSIONS_PATH || './.linda-sessions',
    headless: process.env.LINDA_HEADLESS !== 'false',
    autoRestart: true,
  });

  const sessionBridge = new LindaSessionBridge(linda, mode);
  const messageBridge = new LindaMessageBridge(linda, mode);

  if (mode === 'shadow') {
    const snapshot = buildLindaParitySnapshot('route_get_or_init', linda, mode);
    emitLindaParitySnapshot(snapshot);
  }

  return { linda, mode, sessionBridge, messageBridge };
}

// ─── GET /api/linda/status ────────────────────────────────────────────────

router.get(
  '/status',
  requirePermission('view_whatsapp_conversations'),
  async (_req: Request, res: Response) => {
    try {
      const { linda, mode } = await getOrInitLindaRuntime();
      const stats = linda.getStats();

      if (mode === 'shadow') {
        emitLindaParitySnapshot(buildLindaParitySnapshot('route_status', linda, mode));
      }

      res.json({ success: true, data: { ...stats, enabled: LINDA_ENABLED } });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── GET /api/linda/qr ────────────────────────────────────────────────────

router.get(
  '/qr',
  requirePermission('view_whatsapp_conversations'),
  async (_req: Request, res: Response) => {
    try {
      const { linda, mode } = await getOrInitLindaRuntime();
      const qr = linda.getQRCode();

      if (mode === 'shadow') {
        emitLindaParitySnapshot(buildLindaParitySnapshot('route_qr', linda, mode));
      }

      if (!qr) {
        return res.json({
          success: true,
          data: {
            qr: null,
            message: linda.isConnected()
              ? 'Already authenticated — no QR needed'
              : 'QR not yet generated — initialize first',
            isConnected: linda.isConnected(),
          },
        });
      }

      // Return raw QR string; client can render it with a library (qrcode.js etc.)
      res.json({ success: true, data: { qr, isConnected: false } });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── POST /api/linda/connect ──────────────────────────────────────────────

router.post('/connect', requireRole('owner', 'admin'), async (_req: Request, res: Response) => {
  try {
    if (!LINDA_ENABLED) {
      return res
        .status(400)
        .json({ success: false, error: 'Linda channel is disabled (LINDA_ENABLED=false)' });
    }
    const linda = getLindaClientForMode();
    await linda.initialize();
    res.json({
      success: true,
      message: 'Linda initialization started — scan the QR code at /api/linda/qr',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Initialization failed',
    });
  }
});

// ─── POST /api/linda/disconnect ───────────────────────────────────────────

router.post('/disconnect', requireRole('owner', 'admin'), async (_req: Request, res: Response) => {
  try {
    const linda = getLindaClientForMode();
    await linda.disconnect();
    res.json({ success: true, message: 'Linda disconnected' });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── GET /api/linda/stats ─────────────────────────────────────────────────

router.get(
  '/stats',
  requirePermission('view_whatsapp_conversations'),
  async (_req: Request, res: Response) => {
    try {
      const { linda, mode } = await getOrInitLindaRuntime();
      if (mode === 'shadow') {
        emitLindaParitySnapshot(buildLindaParitySnapshot('route_stats', linda, mode));
      }
      res.json({ success: true, data: linda.getStats(), timestamp: new Date() });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── GET /api/linda/sessions ──────────────────────────────────────────────

router.get(
  '/sessions',
  requirePermission('view_whatsapp_conversations'),
  async (_req: Request, res: Response) => {
    try {
      const { linda, mode, sessionBridge } = await getOrInitLindaRuntime();
      const stats = linda.getStats();

      if (mode === 'shadow') {
        sessionBridge.traceSnapshot('route_sessions');
      }

      // Single-bot for now; multi-bot can extend this array
      const sessions = [
        {
          botId: 'linda-primary',
          role: 'primary',
          status: stats.status,
          isConnected: stats.isConnected,
          messagesSent: stats.messagesSent,
          messagesReceived: stats.messagesReceived,
          reconnectAttempts: stats.reconnectAttempts,
        },
      ];
      res.json({ success: true, data: { sessions, total: sessions.length } });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── GET /api/linda/health ────────────────────────────────────────────────

router.get('/health', async (_req: Request, res: Response) => {
  try {
    const linda = getLindaClientForMode();
    const stats = linda.getStats();
    const healthy = stats.isConnected;
    res.status(healthy ? 200 : 503).json({
      success: healthy,
      status: stats.status,
      isConnected: stats.isConnected,
      enabled: LINDA_ENABLED,
      timestamp: new Date(),
    });
  } catch {
    res.status(500).json({ success: false, error: 'Health check failed' });
  }
});

// ─── POST /api/linda/send/:conversationId ─────────────────────────────────

router.post(
  '/send/:conversationId',
  requirePermission('reply_whatsapp_conversations'),
  async (req: Request, res: Response) => {
    try {
      const { phoneNumber, message } = req.body;
      const { conversationId } = req.params;

      if (!phoneNumber || !message) {
        return res
          .status(400)
          .json({ success: false, error: 'Missing required fields: phoneNumber, message' });
      }

      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        return res.status(400).json({ success: false, error: 'Invalid phone number format' });
      }

      const { linda, mode, messageBridge } = await getOrInitLindaRuntime();
      const messageId = await messageBridge.send({ phoneNumber: cleanPhone, message });

      if (mode === 'shadow') {
        emitLindaParitySnapshot(buildLindaParitySnapshot('route_send', linda, mode));
      }

      res.json({
        success: true,
        data: {
          conversationId,
          messageId,
          phoneNumber: cleanPhone,
          message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
          timestamp: new Date(),
          channel: 'LINDA_WHATSAPP',
        },
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── POST /api/linda/broadcast ────────────────────────────────────────────

router.post('/broadcast', requireRole('owner', 'admin'), async (req: Request, res: Response) => {
  try {
    const { phoneNumbers, message, templateName, templateVars } = req.body;

    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: 'phoneNumbers must be a non-empty array' });
    }
    if (!message && !templateName) {
      return res
        .status(400)
        .json({ success: false, error: 'Either message or templateName is required' });
    }
    if (phoneNumbers.length > 1000) {
      return res
        .status(400)
        .json({ success: false, error: 'Maximum 1000 recipients per broadcast request' });
    }

    const cleanNumbers = phoneNumbers
      .map((p: string) => p.replace(/\D/g, ''))
      .filter((p: string) => p.length >= 10);

    let broadcastMessage = message;
    if (!broadcastMessage && templateName) {
      // Simple template variable substitution using {{var}} syntax
      broadcastMessage = templateName;
      broadcastMessage = applyTemplate(
        broadcastMessage,
        templateVars as Record<string, unknown> | null
      );
    }

    const { linda, mode, messageBridge } = await getOrInitLindaRuntime();

    // Run broadcast asynchronously — respond immediately with accepted status
    res.json({
      success: true,
      data: {
        accepted: true,
        recipients: cleanNumbers.length,
        channel: 'LINDA_WHATSAPP',
        timestamp: new Date(),
      },
    });

    // Fire broadcast after responding so we don't block the HTTP response
    messageBridge
      .broadcast({ phoneNumbers: cleanNumbers, message: broadcastMessage })
      .then(results => {
        const failed = results.filter(r => r.error).length;
        console.warn(
          `[Linda] Broadcast complete: ${results.length - failed} sent, ${failed} failed`
        );
        getSocketServer()?.emitLindaMessage({
          id: `broadcast_${Date.now()}`,
          from: 'system',
          body: `Broadcast complete: ${results.length - failed} sent, ${failed} failed`,
          timestamp: new Date(),
          hasMedia: false,
          type: 'chat',
        });

        if (mode === 'shadow') {
          emitLindaParitySnapshot(buildLindaParitySnapshot('route_broadcast', linda, mode));
        }
      })
      .catch(err => {
        console.error('[Linda] Broadcast error:', err);
      });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── GET /api/linda/campaigns ─────────────────────────────────────────────

router.get('/campaigns', requireRole('owner', 'admin'), async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const take = Math.min(parseInt(String(req.query.limit || '50'), 10) || 50, 200);

    const campaigns = await db.lindaBroadcastCampaign.findMany({
      where: status && status !== 'all' ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take,
    });

    res.json({ success: true, data: campaigns });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/linda/campaigns ────────────────────────────────────────────

router.post('/campaigns', requireRole('owner', 'admin'), async (req: Request, res: Response) => {
  try {
    const { name, targetList, messageTemplate, templateVars, scheduledAt } = req.body;
    if (!name || !Array.isArray(targetList) || targetList.length === 0 || !messageTemplate) {
      return res.status(400).json({
        success: false,
        error: 'Required: name, targetList (non-empty array), messageTemplate',
      });
    }

    const cleanTargets = targetList
      .map((p: string) => String(p).replace(/\D/g, ''))
      .filter((p: string) => p.length >= 10);
    if (cleanTargets.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid target phone numbers' });
    }

    const campaign = await db.lindaBroadcastCampaign.create({
      data: {
        name: String(name),
        targetList: cleanTargets,
        messageTemplate: String(messageTemplate),
        templateVars: templateVars || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? 'scheduled' : 'draft',
        createdById: req.user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/linda/campaigns/:id/dispatch ───────────────────────────────

router.post(
  '/campaigns/:id/dispatch',
  requireRole('owner', 'admin'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updated = await dispatchLindaCampaign(id);
      res.json({ success: true, data: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message === 'Campaign not found') {
        return res.status(404).json({ success: false, error: message });
      }
      if (
        message.startsWith('Campaign cannot be dispatched from status:') ||
        message.includes('no valid recipients')
      ) {
        return res.status(409).json({ success: false, error: message });
      }
      res.status(500).json({ success: false, error: message });
    }
  }
);

// ─── POST /api/linda/campaigns/dispatch-due ───────────────────────────────

router.post(
  '/campaigns/dispatch-due',
  requireRole('owner', 'admin'),
  async (_req: Request, res: Response) => {
    try {
      const summary = await dispatchDueLindaCampaigns();

      res.json({
        success: true,
        data: summary,
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── POST /api/linda/webhook ──────────────────────────────────────────────

router.post(
  '/webhook',
  requirePermission('view_whatsapp_conversations'),
  async (_req: Request, res: Response) => {
    try {
      const { linda, mode, messageBridge } = await getOrInitLindaRuntime();
      const messages = messageBridge.getQueue();

      if (mode === 'shadow') {
        emitLindaParitySnapshot(buildLindaParitySnapshot('route_webhook_poll', linda, mode));
      }

      const processedMessages = messages.map(msg => {
        const payload = { ...msg };
        getSocketServer()?.emitLindaMessage(payload);
        return {
          ...payload,
          conversationId: `LINDA_${msg.from.replace(/\D/g, '')}`,
          channel: 'LINDA_WHATSAPP',
        };
      });

      res.json({
        success: true,
        data: { messages: processedMessages, count: processedMessages.length },
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── GET /api/linda/conversations ─────────────────────────────────────────

router.get(
  '/conversations',
  requirePermission('view_whatsapp_conversations'),
  async (_req: Request, res: Response) => {
    try {
      const { messageBridge } = await getOrInitLindaRuntime();
      const conversations = await messageBridge.getConversations();
      res.json({ success: true, data: { conversations, count: conversations.length } });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── GET /api/linda/conversations/:phoneNumber/history ────────────────────

router.get(
  '/conversations/:phoneNumber/history',
  requirePermission('view_whatsapp_conversations'),
  async (req: Request, res: Response) => {
    try {
      const { phoneNumber } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const { messageBridge } = await getOrInitLindaRuntime();
      const history = await messageBridge.getConversationHistory(phoneNumber, limit);

      res.json({ success: true, data: { phoneNumber, messages: history, count: history.length } });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── GET /api/linda/conversations/:phoneNumber/goraha-saved ────────────────

router.get(
  '/conversations/:phoneNumber/goraha-saved',
  requirePermission('view_whatsapp_conversations'),
  async (req: Request, res: Response) => {
    try {
      const { phoneNumber } = req.params;
      const cleanPhone = String(phoneNumber || '').replace(/\D/g, '');

      if (cleanPhone.length < 8) {
        return res.status(400).json({ success: false, error: 'Invalid phone number format' });
      }

      const { messageBridge } = await getOrInitLindaRuntime();
      const history = await messageBridge.getConversationHistory(cleanPhone, 1);
      const goraha = await checkPhoneSavedInGoraha(cleanPhone);

      res.json({
        success: true,
        data: {
          phoneNumber: cleanPhone,
          hasLindaConversation: history.length > 0,
          isSavedInGoraha: goraha.isSaved,
          conversationSavedToGoraha: history.length > 0 && goraha.isSaved,
          gorahaAccount: {
            isConfigured: goraha.isConfigured,
            isCredentialValid: goraha.isCredentialValid,
            apiAccessValid: goraha.apiAccessValid,
          },
          matchedContact: goraha.isSaved
            ? {
                name: goraha.matchedContactName || null,
                phone: goraha.matchedPhone || null,
              }
            : null,
          details: goraha.error || null,
        },
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── POST /api/linda/ready ────────────────────────────────────────────────

router.post('/ready', async (_req: Request, res: Response) => {
  try {
    const linda = getLindaClientForMode();
    if (!linda.isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Linda not connected — scan QR at /api/linda/qr',
      });
    }
    res.json({ success: true, message: 'Linda is ready' });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ============================================================================
// CROSS-INTEGRATION ENDPOINTS — Nina NLP · Mary Inventory · Henry Documents
// ============================================================================

// ─── POST /api/linda/nlp-route ────────────────────────────────────────────────

/**
 * Route an incoming Linda WhatsApp message through the Nina NLP pipeline.
 *
 * Calls detectIntent + extractEntities from the shared Nadia message processor,
 * emits 'linda:message_received' on the orchestrator (triggering Nina/Nadia handlers),
 * and returns the classified intent, entities, and recommended routing action.
 *
 * Body: { message: string, phone: string }
 */
router.post('/nlp-route', async (req: Request, res: Response) => {
  try {
    const { message, phone } = req.body as { message?: unknown; phone?: unknown };

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'message is required' });
    }
    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ success: false, error: 'phone is required' });
    }

    // Inline NLP classification via the Nadia message processor (shared with Nina integration)
    const { detectIntent, extractEntities } = await import('../services/nadia/messageProcessor.js');
    const intent = detectIntent(message);
    const entities = extractEntities(message);

    // Map intent → recommended downstream routing action
    const ACTION_MAP: Record<string, string> = {
      property_search: 'route_to_mary_inventory',
      schedule_tour: 'route_to_agent_calendar',
      information_request: 'send_property_details',
      make_offer: 'escalate_to_sales_manager',
      financing: 'route_to_finance_team',
      legal_enquiry: 'route_to_henry_compliance',
      complaint: 'escalate_to_manager',
      general_inquiry: 'route_to_nadia_queue',
    };
    const recommendedAction = ACTION_MAP[intent] ?? 'route_to_nadia_queue';

    // Emit orchestrator event — triggers Nina NLP handler + Nadia routing handler
    const { assistantOrchestrator } =
      await import('../services/orchestrator/AssistantOrchestrator.js');
    assistantOrchestrator.emitEvent('linda:message_received', {
      from: phone,
      message,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, data: { intent, entities, recommendedAction } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/linda/inventory-broadcast ──────────────────────────────────────

/**
 * Broadcast a Mary property-status change to a list of WhatsApp contacts.
 *
 * Validates inputs, emits 'mary:property_status_changed' on the orchestrator
 * (which triggers Linda's registered WA broadcast handler), and returns a
 * queued confirmation with the recipient count.
 *
 * Body: { propertyId: string, propertyData: object, targetPhones: string[] }
 */
router.post('/inventory-broadcast', async (req: Request, res: Response) => {
  try {
    const { propertyId, propertyData, targetPhones } = req.body as {
      propertyId?: unknown;
      propertyData?: unknown;
      targetPhones?: unknown;
    };

    if (!propertyId || typeof propertyId !== 'string') {
      return res.status(400).json({ success: false, error: 'propertyId is required' });
    }
    if (!propertyData || typeof propertyData !== 'object' || Array.isArray(propertyData)) {
      return res
        .status(400)
        .json({ success: false, error: 'propertyData must be a non-null object' });
    }
    if (!Array.isArray(targetPhones) || targetPhones.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: 'targetPhones must be a non-empty array' });
    }
    if (targetPhones.length > 500) {
      return res
        .status(400)
        .json({ success: false, error: 'targetPhones cannot exceed 500 entries per broadcast' });
    }

    const data = propertyData as Record<string, unknown>;

    const { assistantOrchestrator } =
      await import('../services/orchestrator/AssistantOrchestrator.js');
    assistantOrchestrator.emitEvent('mary:property_status_changed', {
      propertyId,
      previousStatus: typeof data.previousStatus === 'string' ? data.previousStatus : 'unknown',
      newStatus: typeof data.newStatus === 'string' ? data.newStatus : 'updated',
      broadcastPayload: data,
      targetPhones: targetPhones as string[],
    });

    res.json({ success: true, data: { queued: true, count: targetPhones.length } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/linda/henry-trigger ────────────────────────────────────────────

/**
 * Trigger a Henry document generation event via the orchestrator.
 *
 * Viewing/handover keys  → emits 'cross:viewing_booked'
 * Offer/booking/tenancy  → emits 'cross:offer_accepted'
 *
 * Body: { templateKey: string, documentData: object, conversationId?: string }
 */
router.post('/henry-trigger', async (req: Request, res: Response) => {
  try {
    const { templateKey, documentData, conversationId } = req.body as {
      templateKey?: unknown;
      documentData?: unknown;
      conversationId?: unknown;
    };

    if (!templateKey || typeof templateKey !== 'string') {
      return res.status(400).json({ success: false, error: 'templateKey is required' });
    }
    if (!documentData || typeof documentData !== 'object' || Array.isArray(documentData)) {
      return res
        .status(400)
        .json({ success: false, error: 'documentData must be a non-null object' });
    }

    const data = documentData as Record<string, unknown>;
    const convId = typeof conversationId === 'string' ? conversationId : undefined;

    const VIEWING_KEYS = ['viewing_agreement', 'key_handover'];
    const OFFER_KEYS = ['offer_letter', 'booking_form', 'tenancy_contract', 'gov_employee_booking'];

    const { assistantOrchestrator } =
      await import('../services/orchestrator/AssistantOrchestrator.js');

    if (VIEWING_KEYS.includes(templateKey)) {
      assistantOrchestrator.emitEvent('cross:viewing_booked', {
        propertyId: String(data.propertyId ?? data.unit ?? 'unknown'),
        contactPhone: String(data.tenantPhone ?? data.contactPhone ?? ''),
        scheduledAt: String(data.scheduledAt ?? new Date().toISOString()),
        documentData: data,
        conversationId: convId,
      });
    } else if (OFFER_KEYS.includes(templateKey)) {
      assistantOrchestrator.emitEvent('cross:offer_accepted', {
        propertyId: String(data.propertyId ?? data.unit ?? 'unknown'),
        buyerPhone: String(data.buyerPhone ?? data.tenantPhone ?? ''),
        agentPhone: typeof data.agentPhone === 'string' ? data.agentPhone : undefined,
        offerAmount: Number(data.offerAmount ?? data.annualRent ?? 0),
        documentData: data,
        conversationId: convId,
      });
    } else {
      return res.status(400).json({
        success: false,
        error:
          `templateKey "${templateKey}" does not map to a cross-assistant event. ` +
          `Viewing keys: ${VIEWING_KEYS.join(', ')}. ` +
          `Offer keys: ${OFFER_KEYS.join(', ')}.`,
      });
    }

    res.json({ success: true, data: { triggered: true } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/linda/transcribe ──────────────────────────────────────────────

/**
 * Transcribe a WhatsApp voice message using Whisper API.
 * Accepts multipart/form-data with field `audio` (buffer) and `format` (string).
 * Also accepts JSON with `audioBase64` and `format` for smaller messages.
 *
 * Returns graceful error when OPENAI_API_KEY is not set.
 */
router.post(
  '/transcribe',
  requirePermission('view_whatsapp_conversations'),
  async (req: Request, res: Response) => {
    try {
      const { transcribeVoiceMessage } = await import('../services/linda/voiceTranscription.js');
      const {
        audioBase64,
        format = 'ogg',
        languageHint,
        contextPrompt,
      } = req.body as {
        audioBase64?: string;
        format?: string;
        languageHint?: string;
        contextPrompt?: string;
      };

      if (!audioBase64) {
        return res.status(400).json({ success: false, error: 'audioBase64 is required' });
      }

      const audioBuffer = Buffer.from(audioBase64, 'base64');
      const result = await transcribeVoiceMessage({
        audioBuffer,
        format: format as 'ogg' | 'mp3' | 'm4a' | 'wav' | 'webm',
        languageHint,
        contextPrompt,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── GET /api/linda/sentiment-alerts ─────────────────────────────────────────

/**
 * Return real-time sentiment alerts for the CRM agent dashboard.
 * Query params: unacknowledged=true|false, limit=N (default 50)
 */
router.get(
  '/sentiment-alerts',
  requirePermission('view_whatsapp_conversations'),
  async (req: Request, res: Response) => {
    try {
      const { getAlerts, getAlertSummary } =
        await import('../services/linda/sentimentAlertService.js');
      const onlyUnacked = req.query['unacknowledged'] === 'true';
      const limit = parseInt(String(req.query['limit'] ?? '50'), 10);
      const alerts = getAlerts(onlyUnacked, limit);
      const summary = getAlertSummary();
      res.json({ success: true, data: { alerts, summary, count: alerts.length } });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── POST /api/linda/sentiment-alerts/:alertId/acknowledge ───────────────────

/**
 * Acknowledge a sentiment alert (mark as seen by agent).
 */
router.post(
  '/sentiment-alerts/:alertId/acknowledge',
  requirePermission('view_whatsapp_conversations'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { acknowledgeAlert } = await import('../services/linda/sentimentAlertService.js');
      const { alertId } = req.params as { alertId: string };
      const agentId = req.user?.id ?? 'unknown';
      const ok = acknowledgeAlert(alertId, agentId);
      if (!ok) return res.status(404).json({ success: false, error: `Alert ${alertId} not found` });
      res.json({ success: true, data: { acknowledged: true, alertId } });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

// ─── POST /api/linda/background-analysis/opt-in ──────────────────────────────

/**
 * Privacy-safe background analysis for Linda+Nina collaboration.
 * Requires explicit consent confirmation and operates on provided conversation text.
 *
 * Body:
 * {
 *   accountLabel: string,
 *   consentConfirmed: boolean,
 *   consentReference: string,
 *   messages: Array<{ conversationId: string, text: string, timestamp?: string }>
 * }
 */
router.post(
  '/background-analysis/opt-in',
  requireRole('owner', 'admin'),
  async (req: Request, res: Response) => {
    try {
      const { accountLabel, consentConfirmed, consentReference, messages } = req.body as {
        accountLabel?: unknown;
        consentConfirmed?: unknown;
        consentReference?: unknown;
        messages?: unknown;
      };

      if (consentConfirmed !== true) {
        return res.status(400).json({
          success: false,
          error: 'Explicit consent is required before any background analysis.',
        });
      }

      if (!consentReference || typeof consentReference !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'consentReference is required for auditability.',
        });
      }

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'messages must be a non-empty array.',
        });
      }

      const rows = messages
        .filter(m => m && typeof m === 'object')
        .map(m => ({
          conversationId: String((m as { conversationId?: unknown }).conversationId ?? 'unknown'),
          text: String((m as { text?: unknown }).text ?? ''),
        }))
        .filter(m => m.text.trim().length > 0);

      const keywordHits = {
        viewing: rows.filter(r => /view|tour|معاينة/i.test(r.text)).length,
        pricing: rows.filter(r => /price|budget|aed|سعر|درهم/i.test(r.text)).length,
        complaint: rows.filter(r => /problem|issue|complaint|شكوى|مشكلة/i.test(r.text)).length,
        maintenance: rows.filter(r => /maintenance|repair|صيانة/i.test(r.text)).length,
      };

      const scheduleRecommendations = [
        keywordHits.viewing > 0
          ? 'Increase viewing coordination blocks for high-intent conversations.'
          : 'No viewing surge detected.',
        keywordHits.complaint > 0
          ? 'Add daily complaint triage slot with a senior agent.'
          : 'Complaint volume currently stable.',
        keywordHits.pricing > 0
          ? 'Prepare pricing FAQ snippets for sales agents before outbound follow-ups.'
          : 'Pricing objection volume is low in this sample.',
      ];

      res.json({
        success: true,
        data: {
          accountLabel: typeof accountLabel === 'string' ? accountLabel : 'linked-account',
          analyzedConversationCount: new Set(rows.map(r => r.conversationId)).size,
          analyzedMessageCount: rows.length,
          keywordHits,
          scheduleRecommendations,
          compliance: {
            consentReference,
            consentConfirmed: true,
            mode: 'opt-in-background-analysis',
          },
          analyzedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
);

export default router;
