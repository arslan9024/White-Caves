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

const router = Router();
const db = prisma as any;

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

// ─── Singleton initialisation helper ──────────────────────────────────────

async function getOrInitLindaRuntime() {
  const mode = getLindaCoreMode();
  const linda = getLindaClientForMode({
    sessionPath: process.env.LINDA_SESSIONS_PATH || './.linda-sessions',
    headless: process.env.LINDA_HEADLESS !== 'false',
    autoRestart: true,
  });

  // Auto-initialize if enabled and not yet started
  if (LINDA_ENABLED && linda.getStatus() === LindaStatus.DISCONNECTED) {
    try {
      await linda.initialize();
    } catch (err) {
      console.warn(
        '[Linda Routes] Auto-init failed (Chrome may not be available):',
        err instanceof Error ? err.message : err
      );
    }
  }

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

export default router;
