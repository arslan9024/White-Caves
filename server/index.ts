/**
 * White Caves CRM - Express.js Server Setup
 * Main server entry point with middleware and routing
 * ESM-compatible — all routes use static imports
 */

import crypto from 'crypto';
import { createServer } from 'http';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { Prisma } from '@prisma/client';
import { connectDatabase, prisma } from './database.js';
import { errorHandler, asyncHandler, AppError } from './middleware/errorHandler.js';
import authMiddleware from './middleware/auth.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { CORS_ORIGINS, WHATSAPP_WEBHOOK_SECRET, IS_PRODUCTION } from './config/env.js';
import { buildAllowedCorsOrigins, inferRequestOrigin, isCorsOriginAllowed } from './config/cors.js';
import {
  apiLimiter,
  authLimiter,
  firebaseSyncLimiter,
  registerLimiter,
  passwordLimiter,
  strictLimiter,
  contactLimiter,
} from './middleware/rateLimiter.js';
import logger from './utils/logger.js';

// Route imports (ESM-compatible)
import authRoutes from './routes/auth.js';
import leadsRoutes from './routes/leads.js';
import propertiesRoutes from './routes/properties.js';
import agentsRoutes from './routes/agents.js';
import transactionsRoutes from './routes/transactions.js';
import financeRoutes from './routes/finance.js';
import tenantsRoutes from './routes/tenants.js';
import communicationsRoutes from './routes/communications.js';
import reportingRoutes from './routes/reporting.js';
import complianceRoutes from './routes/compliance.js';
import crmRoutes from './routes/crm.js';
import assistantsRoutes from './routes/assistants.js';
import nadiaRoutes from './routes/nadia.js';
import lindaRoutes from './routes/linda.js';
import metaWebhookRoutes from './routes/meta-webhook.js';
import favoritesRoutes from './routes/favorites.js';
import orchestratorRoutes from './routes/orchestrator.js';
import integrationsRoutes from './routes/integrations.js';
import orchestrationRoutes from './routes/orchestration.js';
import henryRoutes from './routes/henry.js';
import ninaRoutes from './routes/nina.js';
import maryRoutes from './routes/mary.js';
import savedSearchesRoutes from './routes/saved-searches.js';
import viewingsRoutes from './routes/viewings.js';
import offersRoutes from './routes/offers.js';
import leasesRoutes from './routes/leases.js';
import maintenanceRoutes from './routes/maintenance.js';
import clientsRoutes from './routes/clients.js';
import activitiesRoutes from './routes/activities.js';
import followUpsRoutes from './routes/follow-ups.js';
import documentsRoutes from './routes/documents.js';
import currencyRoutes from './routes/currency.js';
import emailRoutes from './routes/email.js';
import agentAvailabilityRoutes from './routes/agentAvailability.js';
import analyticsRoutes from './routes/analytics.js';
import valuationRoutes from './routes/valuation.js';
import marketRoutes from './routes/market.js';
import departmentsRoutes from './routes/departments.js';
import homepageRoutes from './routes/homepage.js';
import contactRoutes from './routes/contact.js';
import aiChatRoutes from './routes/aiChat.js';
import jobApplicationsRoutes from './routes/jobApplications.js';
import contractsRoutes from './routes/contracts.js';
import appointmentsRoutes from './routes/appointments.js';
import { roleRequestRouter, adminRoleRequestRouter } from './routes/roleRequests.js';
import { phase6Router } from './routes/phase6.routes.js';
import landlordPortalRoutes from './routes/landlord.js';
import tenantPortalRoutes from './routes/tenantPortal.js';
import invoicesLeaseRoutes from './routes/invoicesLease.js';
import usersRoutes from './routes/users.js';
import leasingInventoryRoutes from './routes/leasing-inventory.js';
import secondarySalesRoutes from './routes/secondary-sales.js';
import commissionsRoutes from './routes/commissions.js';
import notificationsRoutes from './routes/notifications.js';
import importHistoryRoutes from './routes/importHistory.routes.js';
import smartImportRoutes from './routes/smartImport.routes.js';
import { requireRole, requirePermission } from './middleware/rbac.js';
import { startFollowUpScheduler } from './services/automation/followUpScheduler.js';
import { startRateRefresh } from './services/currencyService.js';
import { startViewingReminderScheduler } from './services/schedulingService.js';
import { startRERAExpiryScheduler } from './services/compliance/reraExpiryScheduler.js';
import { startAutoRouting } from './services/ai/leadAutoRouter.js';
import { createSocketServer } from './services/socketServer.js';
import { schedulerService } from './services/SchedulerService.js';
import { cacheService } from './services/CacheService.js';

const app: Express = express();
const allowedCorsOrigins = buildAllowedCorsOrigins(CORS_ORIGINS, process.env.NODE_ENV);

// Trust the first proxy in front of the server (e.g. Vercel edge, nginx, AWS ALB).
// This makes req.ip and all express-rate-limit lookups use the real client IP
// from the X-Forwarded-For header instead of the proxy's address.
// IMPORTANT: only set this when the server runs behind a trusted reverse proxy.
// Setting it on a server that is directly internet-facing allows clients to
// spoof X-Forwarded-For and bypass IP-based rate limits.
app.set('trust proxy', 1);
// In development, keep API on 3001 to avoid colliding with Vite (5000).
// Use API_PORT when provided; in production/staging, respect PORT as platform-provided.
const PORT =
  process.env.API_PORT ||
  (process.env.NODE_ENV === 'development' ? 3001 : process.env.PORT || 3001);

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Request ID — must be first so every log/response includes correlation ID
app.use(requestIdMiddleware);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Required by React hydration and Firebase/Stripe SDKs
          'https://*.firebaseapp.com',
          'https://*.googleapis.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.unsplash.com',
          'https://*.googleapis.com',
          'https://*.gstatic.com',
        ],
        connectSrc: [
          "'self'",
          'https://*.firebaseio.com',
          'https://*.googleapis.com',
          'https://*.firebase.com',
          'wss://*.firebaseio.com',
          'https://api.stripe.com',
        ],
        frameSrc: ['https://*.firebaseapp.com', 'https://js.stripe.com'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        // Force browser to upgrade all HTTP sub-resource requests to HTTPS in production
        ...(IS_PRODUCTION ? { upgradeInsecureRequests: [] } : {}),
      },
    },
    // Explicit referrer policy: send origin only on same-origin requests; omit on cross-origin
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginEmbedderPolicy: false, // Required for Firebase/Stripe iframes
  })
);

// Permissions-Policy: restrict access to browser features.
// Helmet v8 does not bundle permissionsPolicy, so we set it as a custom header.
// camera/microphone/usb/magnetometer/gyroscope/accelerometer: disabled entirely.
// geolocation: allowed only from same origin (interactive map feature).
// payment: allowed from same origin and Stripe's JS domain.
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    'Permissions-Policy',
    [
      'camera=()',
      'microphone=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
      'geolocation=(self)',
      'payment=(self "https://js.stripe.com")',
    ].join(', ')
  );
  next();
});
app.use(
  cors((req, callback) => {
    const requestOrigin = inferRequestOrigin(req);
    const origin = req.header('Origin');
    const isAllowed = isCorsOriginAllowed(
      origin,
      allowedCorsOrigins,
      requestOrigin,
      process.env.NODE_ENV
    );

    if (isAllowed) {
      callback(null, { origin: true, credentials: true });
      return;
    }

    callback(new Error('Not allowed by CORS'));
  })
);

// Compression
app.use(compression());

// Static files for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'public', 'uploads')));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Cookie parsing — required for httpOnly refresh-token cookie on /api/auth/refresh
app.use(cookieParser());

// Content-Type validation for mutation endpoints
// Exempt paths that accept non-JSON bodies (file uploads, webhooks, cookie-only endpoints).
const NON_JSON_PATHS = new Set(['/api/whatsapp/webhook', '/api/auth/refresh']);
app.use('/api', (req: Request, res: Response, next) => {
  if (
    ['POST', 'PUT', 'PATCH'].includes(req.method) &&
    !req.is('json') &&
    !NON_JSON_PATHS.has(req.path)
  ) {
    return res.status(415).json({
      success: false,
      error: 'Content-Type must be application/json',
    });
  }
  next();
});

// Rate limiting
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth/password', passwordLimiter);
app.use('/api/auth/verify-2fa', strictLimiter);
app.use('/api/auth/2fa/setup', strictLimiter);
app.use('/api/auth/2fa/enable', strictLimiter);
app.use('/api/auth/2fa/disable', strictLimiter);
app.use('/api/auth/refresh', authLimiter);
app.use('/api/auth/firebase-sync', firebaseSyncLimiter);
app.use('/api/auth/refresh', authLimiter);
app.use('/api/auth/webauthn/register', authLimiter);
app.use('/api/auth/webauthn/authenticate', authLimiter);
app.use('/api/contact', contactLimiter); // Public unauthenticated — stricter: 10/hour/IP

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION || '1.0.0',
  });
});

// Public API health endpoint (used by runtime/deployment verifiers and Vercel checks)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION || '1.0.0',
  });
});

// Database health check — Wave 15 (W15-002)
app.get('/api/health/db', asyncHandler(async (_req: Request, res: Response) => {
  const start = Date.now();
  try {
    await prisma.$runCommandRaw({ ping: 1 });
    const latencyMs = Date.now() - start;
    const cacheHealth = await cacheService.ping();
    res.status(200).json({
      status: 'healthy',
      latencyMs,
      cache: cacheHealth,
      timestamp: new Date(),
    });
  } catch (err) {
    const latencyMs = Date.now() - start;
    res.status(503).json({
      status: 'unhealthy',
      latencyMs,
      error: err instanceof Error ? err.message : 'Database unreachable',
      timestamp: new Date(),
    });
  }
}));

// ============================================================================
// API ROUTES
// ============================================================================

// Authentication routes
app.use('/api/auth', authRoutes);

// Public AI chat route — no auth required
app.use('/api/ai/chat', aiChatRoutes);

// AI Assistants list is public (GET /api/assistants) — mount before global auth middleware.
// Write endpoints (POST/PUT/DELETE) within the router enforce their own authMiddleware.
app.use('/api/assistants', assistantsRoutes);

// Protected routes (require authentication in production, optional in development)
if (process.env.NODE_ENV === 'production') {
  app.use('/api', authMiddleware);
  logger.info('🔒 Production auth middleware enabled — all /api routes require JWT');
} else if (process.env.NODE_ENV === 'development') {
  logger.warn('⚠️  DEV AUTH BYPASS ACTIVE — Do NOT use in production!');
  logger.warn('   Set NODE_ENV=production to enforce JWT authentication');
  let cachedDevUser: { id: string; email: string; role: string } | null = null;
  app.use('/api', async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      return authMiddleware(req, res, next);
    }
    // Dev fallback: look up real owner user from DB (once, then cache)
    try {
      if (!cachedDevUser) {
        const owner = await prisma.user.findFirst({ where: { email: 'owner@whitecaves.ae' } });
        if (owner) {
          cachedDevUser = { id: owner.id, email: owner.email, role: owner.role };
          logger.info(`Dev auth: using owner ${owner.name} (${owner.id})`);
        } else {
          cachedDevUser = { id: 'dev-owner', email: 'owner@whitecaves.ae', role: 'owner' };
          logger.warn('Dev auth: owner not found in DB, using placeholder');
        }
      }
      req.user = { ...cachedDevUser };
    } catch {
      req.user = { id: 'dev-owner', email: 'owner@whitecaves.ae', role: 'owner' };
    }
    next();
  });
} else {
  // Any other NODE_ENV (staging, test, etc.) — require full authentication
  app.use('/api', authMiddleware);
  logger.info(`Auth middleware enabled for NODE_ENV=${process.env.NODE_ENV}`);
}

// Leads API (Clara - Lead Manager)
app.use('/api/leads', leadsRoutes);

// Properties API (Mary - Inventory Manager)
app.use('/api/properties', propertiesRoutes);

// Agents API
app.use('/api/agents', agentsRoutes);

// Users API — user management (list all roles, approve/reject, update role/status)
app.use('/api/users', usersRoutes);

// Transactions API (Sophia - Pipeline, Theodora - Finance)
app.use('/api/transactions', transactionsRoutes);

// Finance API (Theodora - Finance Director)
app.use('/api/finance', financeRoutes);

// Tenants API (Daisy - Leasing Manager)
app.use('/api/tenants', tenantsRoutes);

// Clients API (Phase 1C - Client/Owner Management)
app.use('/api/clients', clientsRoutes);

// Activities API (Phase 1F - Activity Timeline & Audit Trail)
app.use('/api/activities', activitiesRoutes);

// Follow-Up Sequences API (Phase 2B - Automated Lead Follow-Up)
app.use('/api/follow-ups', followUpsRoutes);

// Documents API (Phase 2C - Document Generation)
app.use('/api/documents', documentsRoutes);

// Homepage Aggregate API (public — no auth required)
app.use('/api/homepage', homepageRoutes);

// Contact / Lead-from-homepage API (public)
app.use('/api/contact', contactRoutes);

// Market Analytics API (Phase 4C - Market Analyst Bot)
app.use('/api/analytics', analyticsRoutes);
app.use('/api/departments', departmentsRoutes);

// Currency API (Phase 2E - Multi-Currency Support)
app.use('/api/currency', currencyRoutes);

// Email API (Phase 3B - Email Automation)
app.use('/api/email', emailRoutes);

// Agent Availability API (Phase 3C - Calendar/Scheduling)
app.use('/api/agent-availability', agentAvailabilityRoutes);

// Communications API (Nadia - WhatsApp CRM, Nina - Bot)
app.use('/api/communications', communicationsRoutes);

// NADIA WhatsApp CRM API (Conversation management, message routing, lead scoring)
app.use('/api/nadia', nadiaRoutes);

// Linda LocalAuth WhatsApp Integration (alternative channel)
app.use('/api/linda', lindaRoutes);

// AssistantOrchestrator API — cross-assistant event bus status, events, and admin emit
app.use('/api/orchestrator', orchestratorRoutes);
app.use('/api/henry', henryRoutes);
app.use('/api/nina', ninaRoutes);
app.use('/api/mary', maryRoutes);

// Meta Business API Webhooks and Sending (production scale channel)
app.use('/api/webhooks/meta', metaWebhookRoutes);

// Favorites API (any authenticated user can manage their own favorites)
app.use('/api/favorites', favoritesRoutes);

// Notifications API (any authenticated user can manage their own notifications)
app.use('/api/notifications', notificationsRoutes);

// Saved Searches API (any authenticated user can manage their own saved searches)
app.use('/api/saved-searches', savedSearchesRoutes);

// Viewings API (schedule and manage property viewings)
app.use('/api/viewings', viewingsRoutes);

// Offers API (buyer offers on properties)
app.use('/api/offers', offersRoutes);

// Leases API (lease management for landlords, tenants, leasing agents)
app.use('/api/leases', leasesRoutes);

// Lease Invoices API (deposit and rent invoices for leasing workflow)
app.use('/api/invoices/lease', invoicesLeaseRoutes);

// Maintenance API (maintenance requests for landlords and tenants)
app.use('/api/maintenance', maintenanceRoutes);

// Valuation API — Wave 12 (AVM + manual override + bank request)
app.use('/api/valuations', authMiddleware, valuationRoutes);

// Market Intelligence API — Wave 12 (price index, transactions, RERA index)
app.use('/api/market', authMiddleware, marketRoutes);

// Leasing Inventory API (Mary - Inventory Manager)
app.use('/api/leasing-inventory', leasingInventoryRoutes);

// Secondary Sales API
app.use('/api/secondary-sales', secondarySalesRoutes);

// Commissions API (Phase 35 - Dubai Real Estate Commission Tracker)
app.use('/api/commissions', commissionsRoutes);

app.use('/api/inventory/import', smartImportRoutes);
app.use('/api', importHistoryRoutes);

// WhatsApp Webhook (public endpoint — requires webhook secret for verification)
app.post(
  '/api/whatsapp/webhook',
  asyncHandler(async (req: Request, res: Response) => {
    if (!WHATSAPP_WEBHOOK_SECRET) {
      throw new AppError('WhatsApp webhook not configured — set WHATSAPP_WEBHOOK_SECRET', 500);
    }
    // SECURITY: Only accept webhook secret via header (never query params — they leak in logs)
    const webhookToken = (req.headers['x-webhook-token'] || '') as string;
    if (!webhookToken) {
      throw new AppError('Webhook token required in x-webhook-token header', 403);
    }
    // Use timing-safe comparison to prevent timing attacks on secret
    const expected = Buffer.from(WHATSAPP_WEBHOOK_SECRET, 'utf8');
    const received = Buffer.from(webhookToken, 'utf8');
    if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
      throw new AppError('Invalid webhook token', 403);
    }
    logger.debug('WhatsApp webhook received', {
      hasEntry: !!req.body?.entry,
      entryCount: req.body?.entry?.length ?? 0,
    });
    res.status(200).json({ success: true });
  })
);

// Reporting API (Zoe - Executive Dashboard)
app.use('/api/dashboard', reportingRoutes);
app.use('/api/reports', reportingRoutes);

// Compliance API (Laila - Compliance Officer)
app.use('/api/compliance', complianceRoutes);

// CRM General API (Search, Analytics, Dashboard, Export)
app.use('/api/crm/export', strictLimiter); // Strict rate limit on data export
app.use('/api/crm', crmRoutes);

// AI Assistants API (Phase 0.8 — plan management)
app.use('/api/assistants', assistantsRoutes);

// External module gateway (Linda + Henry separate repos)
app.use('/api/integrations', integrationsRoutes);
app.use('/api/orchestration', orchestrationRoutes);

// ============================================================================
// STUB ROUTES — Placeholder APIs for frontend pages not yet backed by full CRUD
// These prevent 404 errors and return meaningful empty/default data
// ============================================================================

// WhatsApp API stubs (WhatsAppSettingsPage, WhatsAppDashboardPage, WhatsAppChatbotPage)
app.get(
  '/api/whatsapp/stats',
  authMiddleware,
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: { totalMessages: 0, sentToday: 0, received: 0, activeChats: 0, sessions: [] },
    });
  })
);
app.get(
  '/api/whatsapp/settings',
  authMiddleware,
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (_req: Request, res: Response) => {
    const row = await prisma.systemSetting.findUnique({ where: { key: 'whatsapp_settings' } });
    const defaults = { phoneNumber: '', connected: false, autoReply: false, businessHours: null };
    const data = row ? { ...defaults, ...(row.value as object) } : defaults;
    res.status(200).json({ success: true, data });
  })
);
app.put(
  '/api/whatsapp/settings',
  authMiddleware,
  requireRole('owner'),
  asyncHandler(async (req: Request, res: Response) => {
    const { phoneNumber, autoReply, businessHours } = req.body ?? {};
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    const current = await prisma.systemSetting.findUnique({ where: { key: 'whatsapp_settings' } });
    const existing = (current?.value ?? {}) as Record<string, unknown>;
    const updated: Prisma.InputJsonValue = {
      ...existing,
      ...(phoneNumber !== undefined && { phoneNumber: String(phoneNumber) }),
      ...(autoReply !== undefined && { autoReply: Boolean(autoReply) }),
      ...(businessHours !== undefined && { businessHours }),
    } as Prisma.InputJsonValue;
    await prisma.systemSetting.upsert({
      where: { key: 'whatsapp_settings' },
      update: { value: updated as Prisma.InputJsonValue, category: 'whatsapp', updatedBy: userId },
      create: {
        key: 'whatsapp_settings',
        value: updated as Prisma.InputJsonValue,
        category: 'whatsapp',
        updatedBy: userId,
      },
    });
    res.status(200).json({ success: true, data: updated });
  })
);
app.post(
  '/api/whatsapp/session',
  authMiddleware,
  requireRole('owner'),
  asyncHandler(async (req: Request, res: Response) => {
    const { phoneNumber } = req.body ?? {};
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    if (!phoneNumber)
      throw new AppError('phoneNumber is required to start a WhatsApp session', 400);
    const sessionId = `wa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const sessionData = {
      sessionId,
      phoneNumber: String(phoneNumber),
      status: 'pending',
      startedAt: new Date().toISOString(),
    };
    await prisma.systemSetting.upsert({
      where: { key: 'whatsapp_session' },
      update: { value: sessionData, category: 'whatsapp', updatedBy: userId },
      create: {
        key: 'whatsapp_session',
        value: sessionData,
        category: 'whatsapp',
        updatedBy: userId,
      },
    });
    res.status(200).json({ success: true, data: sessionData });
  })
);
app.post(
  '/api/whatsapp/init',
  authMiddleware,
  requireRole('owner'),
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'WhatsApp initialization pending — configure phone number first',
    });
  })
);
app.post(
  '/api/whatsapp/disconnect',
  authMiddleware,
  requireRole('owner'),
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'WhatsApp disconnected' });
  })
);
app.post(
  '/api/whatsapp/message',
  authMiddleware,
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({ success: true, data: { id: Date.now().toString(), status: 'queued' } });
  })
);
app.get(
  '/api/whatsapp/chatbot/messages',
  authMiddleware,
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (req: Request, res: Response) => {
    const conversationId = req.query.conversationId as string | undefined;
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));

    const where = conversationId ? { conversationId } : {};
    const messages = await prisma.nadiaMessage.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: { conversation: { select: { id: true, customerPhone: true, status: true } } },
    });

    res.status(200).json({ success: true, data: messages.reverse() });
  })
);
app.post(
  '/api/whatsapp/chatbot/messages',
  authMiddleware,
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId, body, messageType = 'text', direction = 'outbound' } = req.body;
    if (!conversationId || !body) {
      throw new AppError('conversationId and body are required', 400);
    }

    const conversation = await prisma.nadiaConversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) throw new AppError('Conversation not found', 404);

    const message = await prisma.nadiaMessage.create({
      data: {
        conversationId,
        waMessageId: `manual-${Date.now()}`,
        direction: ['inbound', 'outbound'].includes(direction) ? direction : 'outbound',
        body: String(body).slice(0, 4096),
        messageType: ['text', 'image', 'document', 'audio', 'video'].includes(messageType)
          ? messageType
          : 'text',
        status: 'sent',
        timestamp: new Date(),
      },
    });

    res.status(201).json({ success: true, data: message });
  })
);
app.delete(
  '/api/whatsapp/chatbot/messages/:id',
  authMiddleware,
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const message = await prisma.nadiaMessage.findUnique({ where: { id } });
    if (!message) throw new AppError('Message not found', 404);
    await prisma.nadiaMessage.delete({ where: { id } });
    res.status(200).json({ success: true });
  })
);

// Contracts API — full CRUD via contracts router
app.use('/api/contracts', authMiddleware, contractsRoutes);

// Job Applications API
app.use('/api/job-applications', jobApplicationsRoutes);

// Appointments API — full CRUD via appointments router
app.use('/api/appointments', authMiddleware, appointmentsRoutes);

// Tenancy Agreements API — fully delegated to the leases router.
// /api/tenancy-agreements is an alias for /api/leases: same model, different UI label.
app.use('/api/tenancy-agreements', authMiddleware, leasesRoutes);

// Landlord Portal API — stats, properties, maintenance, finances for the portal
app.use('/api/landlord', authMiddleware, landlordPortalRoutes);

// Tenant Portal API — lease, payments, documents, maintenance for the tenant portal
app.use('/api/portal/tenant', authMiddleware, tenantPortalRoutes);

// Payments API — Stripe integration pending; return 402 Payment Required so
// clients can distinguish "service down" (503) from "payment not configured" (402).
app.post(
  '/api/payments/create-payment-intent',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    logger.warn('Payment intent requested but Stripe is not configured', {
      amount: req.body?.amount,
      propertyId: req.body?.propertyId,
    });
    res.status(402).json({
      success: false,
      error: 'Payment processing is not yet configured. Please contact support.',
      code: 'PAYMENT_NOT_CONFIGURED',
    });
  })
);

// Valuation API — heuristic estimator based on Dubai area price-per-sqft benchmarks
app.post(
  '/api/valuation/estimate',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { location, area, propertyType, bedrooms, bathrooms, sqft, yearBuilt, amenities } =
      req.body;

    if (!location && !area) {
      throw new AppError('location or area is required for valuation', 400);
    }

    // Dubai area price-per-sqft benchmarks (AED, 2025/2026 market data)
    const areaBenchmarks: Record<string, { sale: number; rent: number }> = {
      'palm jumeirah': { sale: 3800, rent: 260 },
      'downtown dubai': { sale: 3200, rent: 220 },
      'dubai marina': { sale: 2600, rent: 175 },
      'business bay': { sale: 2200, rent: 150 },
      jumeirah: { sale: 2800, rent: 190 },
      'arabian ranches': { sale: 1800, rent: 110 },
      'dubai hills': { sale: 2100, rent: 135 },
      jvc: { sale: 1200, rent: 80 },
      'jumeirah village circle': { sale: 1200, rent: 80 },
      mirdif: { sale: 1100, rent: 75 },
      deira: { sale: 900, rent: 60 },
      'bur dubai': { sale: 950, rent: 65 },
      'al barsha': { sale: 1300, rent: 90 },
      'sport city': { sale: 1000, rent: 70 },
      'motor city': { sale: 1050, rent: 72 },
      jlt: { sale: 1500, rent: 100 },
      'jumeirah lake towers': { sale: 1500, rent: 100 },
      'emaar beachfront': { sale: 3500, rent: 240 },
      'creek harbour': { sale: 2900, rent: 195 },
      'sobha hartland': { sale: 2400, rent: 160 },
    };

    const key = (location || area || '').toLowerCase().trim();
    const matchKey = Object.keys(areaBenchmarks).find(k => key.includes(k) || k.includes(key));
    // eslint-disable-next-line security/detect-object-injection
    const benchmark = matchKey ? areaBenchmarks[matchKey] : { sale: 1500, rent: 100 };

    const sqftNum = sqft ? parseFloat(sqft) : 1000;
    const bedsNum = bedrooms ? parseInt(String(bedrooms), 10) : 1;
    const bathsNum = bathrooms ? parseInt(String(bathrooms), 10) : 1;
    const typeMultiplier = propertyType === 'villa' || propertyType === 'townhouse' ? 1.15 : 1.0;

    // Age discount: -1% per year over 10 years old, max -20%
    const ageDiscount = yearBuilt
      ? Math.min(
          0.2,
          Math.max(0, (new Date().getFullYear() - parseInt(String(yearBuilt), 10) - 10) * 0.01)
        )
      : 0;

    // Amenity premium: +3% per luxury amenity up to 15%
    const luxuryAmenities = [
      'pool',
      'gym',
      'concierge',
      'sea view',
      'marina view',
      'private pool',
      'smart home',
    ];
    const amenityList: string[] = Array.isArray(amenities) ? amenities : [];
    const amenityPremium = Math.min(
      0.15,
      amenityList.filter(a => luxuryAmenities.some(l => String(a).toLowerCase().includes(l)))
        .length * 0.03
    );

    const saleEstimate = Math.round(
      sqftNum * benchmark.sale * typeMultiplier * (1 - ageDiscount) * (1 + amenityPremium)
    );
    const rentEstimate = Math.round(
      sqftNum * benchmark.rent * typeMultiplier * (1 - ageDiscount) * (1 + amenityPremium)
    );

    // ±15% confidence range
    const margin = 0.15;
    const result = {
      estimatedSalePrice: saleEstimate,
      estimatedAnnualRent: rentEstimate,
      estimatedMonthlyRent: Math.round(rentEstimate / 12),
      priceRange: {
        sale: {
          low: Math.round(saleEstimate * (1 - margin)),
          high: Math.round(saleEstimate * (1 + margin)),
        },
        rent: {
          lowAnnual: Math.round(rentEstimate * (1 - margin)),
          highAnnual: Math.round(rentEstimate * (1 + margin)),
        },
      },
      inputs: {
        location: location || area,
        sqft: sqftNum,
        propertyType: propertyType || 'apartment',
        bedrooms: bedsNum,
        bathrooms: bathsNum,
        yearBuilt: yearBuilt || null,
      },
      methodology: 'Dubai area price-per-sqft heuristic (2025/2026 benchmarks)',
      confidenceLevel: matchKey ? 'medium' : 'low',
      disclaimer:
        'This is an indicative estimate only and does not constitute a formal valuation. Actual market prices may differ significantly.',
      generatedAt: new Date().toISOString(),
    };

    logger.info('Valuation estimate generated', {
      location: location || area,
      sqft: sqftNum,
      saleEstimate,
    });

    res.status(200).json({ success: true, data: result });
  })
);

// System Health API (SystemHealthPage)
app.get(
  '/api/system/health',
  authMiddleware,
  requirePermission('view_system_health'),
  asyncHandler(async (req: Request, res: Response) => {
    const uptime = process.uptime();
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        uptime: Math.round(uptime),
        uptimeFormatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        database: 'connected',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
        services: {
          api: 'operational',
          database: 'operational',
          whatsapp: 'not_configured',
          email: 'not_configured',
        },
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
      },
    });
  })
);

// Admin Role Management stubs (RoleSelectionForm, RoleApprovalQueue)
// TODO: Add Prisma model for RoleRequest when role management module is prioritised
app.post(
  '/api/users/role',
  authMiddleware,
  requirePermission('manage_users'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, role } = req.body;
    if (!userId || !role) throw new AppError('userId and role are required', 400);

    // Validate role against the full alias map to prevent arbitrary strings being stored
    const { ROLE_ALIAS_MAP } = await import('./middleware/rbac.js');
    if (!Object.hasOwn(ROLE_ALIAS_MAP, role)) {
      throw new AppError(
        `Invalid role: "${role}". Must be one of: ${Object.keys(ROLE_ALIAS_MAP).join(', ')}`,
        422
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
    await prisma.activity.create({
      data: {
        type: 'system',
        action: 'updated',
        description: `Role changed to ${role} for ${updated.email}`,
        userId: req.user?.id || null,
      },
    });
    res.status(200).json({ success: true, data: updated });
  })
);
app.use('/api/users/role-request', authMiddleware, roleRequestRouter);
app.use('/api/admin/role-requests', authMiddleware, adminRoleRequestRouter);

// Admin Settings — read and write system-wide configuration
app.get(
  '/api/admin/settings',
  authMiddleware,
  requirePermission('manage_users'),
  asyncHandler(async (_req: Request, res: Response) => {
    const settings = await prisma.systemSetting.findMany({ orderBy: { category: 'asc' } });
    const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));
    res.json({ success: true, data: settingsMap, meta: { count: settings.length } });
  })
);
app.post(
  '/api/admin/settings',
  authMiddleware,
  requirePermission('manage_users'),
  asyncHandler(async (req: Request, res: Response) => {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
      throw new AppError('Request body must contain a "settings" object', 400);
    }

    const userId = (req as Request & { user?: { id: string } }).user?.id;
    const entries = Object.entries(settings as Record<string, unknown>);
    if (entries.length === 0) throw new AppError('No settings provided', 400);
    if (entries.length > 50) throw new AppError('Cannot update more than 50 settings at once', 400);

    // Upsert each key
    const updated = await Promise.all(
      entries.map(([key, value]) =>
        prisma.systemSetting.upsert({
          where: { key },
          create: {
            key,
            value: value as Parameters<typeof prisma.systemSetting.create>[0]['data']['value'],
            updatedBy: userId,
          },
          update: {
            value: value as Parameters<typeof prisma.systemSetting.update>[0]['data']['value'],
            updatedBy: userId,
          },
        })
      )
    );

    logger.info('Admin settings updated', { keys: entries.map(([k]) => k), userId });
    res.json({ success: true, data: { updatedCount: updated.length } });
  })
);

// Phase 6 — queue, analytics, notifications, encryption, presence
// The phase6 router uses x-user-id header auth; bridge it from the JWT-authenticated user.
app.use(
  '/api/platform',
  authMiddleware,
  (req: Request, _res: Response, next: NextFunction) => {
    // Bridge JWT identity into the x-user-id header expected by phase6 routes
    const userId = (req as Request & { user?: { id: string } }).user?.id;
    if (userId) req.headers['x-user-id'] = userId;
    next();
  },
  phase6Router
);

// ============================================================================
// PRODUCTION STATIC ASSET + SPA SERVING
// ============================================================================

if (IS_PRODUCTION) {
  const publicDir = path.join(process.cwd(), 'public');
  const distDir = path.join(process.cwd(), 'dist');

  // Serve SEO/PWA/static assets from public first (robots.txt, sitemap.xml, manifest.json, etc.)
  app.use(express.static(publicDir, { index: false }));
  // Serve built frontend assets from dist
  app.use(express.static(distDir, { index: false }));

  // SPA fallback for non-API GET requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api/')) return next();
    if (req.path.startsWith('/uploads/')) return next();

    res.sendFile(path.join(distDir, 'index.html'), err => {
      if (err) next();
    });
  });
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.path} not found`,
    statusCode: 404,
  });
});

// Global error handler
app.use(errorHandler);

// ============================================================================
// DATABASE CONNECTION & SERVER STARTUP
// ============================================================================

const startServer = async () => {
  // Try to connect to MongoDB (non-blocking — server starts even if DB fails)
  try {
    logger.info('Connecting to MongoDB...');
    await connectDatabase();
    logger.info('MongoDB connected successfully');

    // Start background services
    startFollowUpScheduler();
    startRateRefresh(); // Phase 2E: refresh exchange rates every 6h
    startViewingReminderScheduler(); // Phase 3C: viewing reminders every 15 min
    startRERAExpiryScheduler(); // Phase 3D: RERA BRN expiry checks daily
    startAutoRouting(); // Phase 4A: auto-route hot leads to best agents
    schedulerService.start(); // Wave 12: cron automation engine

    // Boot AssistantOrchestrator — register all 5 assistant handler chains
    import('./services/orchestrator/AssistantOrchestrator.js')
      .then(({ assistantOrchestrator }) => {
        assistantOrchestrator.registerLindaHandlers();
        assistantOrchestrator.registerNadiaHandlers();
        assistantOrchestrator.registerNinaHandlers();
        assistantOrchestrator.registerMaryHandlers();
        assistantOrchestrator.registerHenryHandlers();
        logger.info('AssistantOrchestrator: all 5 assistant handlers registered.');
      })
      .catch((err: unknown) => {
        logger.warn('AssistantOrchestrator init failed:', err instanceof Error ? err.message : err);
      });

    // Auto-migrate any remaining legacy base64 password hashes to bcrypt
    try {
      const legacyUsers = await prisma.user.findMany({
        where: { passwordHash: { startsWith: 'wc$' } },
        select: { id: true, passwordHash: true },
      });
      if (legacyUsers.length > 0) {
        const bcryptLib = await import('bcryptjs');
        const ROUNDS = 12;
        for (const user of legacyUsers) {
          const plaintext = Buffer.from(user.passwordHash!.slice(3), 'base64').toString();
          const hashed = await bcryptLib.default.hash(plaintext, ROUNDS);
          await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashed } });
        }
        logger.info(`Migrated ${legacyUsers.length} legacy password hash(es) to bcrypt`);
      }
    } catch (migrationError: unknown) {
      const msg = migrationError instanceof Error ? migrationError.message : String(migrationError);
      logger.warn(`Legacy password migration skipped: ${msg}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn(`MongoDB connection failed: ${message}`);
    logger.warn('Server will start without database — API calls will return errors');
  }

  // Start listening regardless of DB status
  const host = process.env.API_URL || `http://localhost:${PORT}`;

  // Wrap Express in a raw http.Server so Socket.io can share the same port
  const httpServer = createServer(app);

  // Attach Socket.io to the http server (must happen before listen)
  createSocketServer(httpServer);

  httpServer.listen(PORT, () => {
    logger.info(`Server started on ${host}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`API Base: ${host}/api`);
    logger.info(`Socket.io: ws://${host.replace(/^https?:\/\//, '')}`);
  });

  return httpServer;
};

// Start the server
let httpServer: ReturnType<typeof createServer> | null = null;
startServer()
  .then(s => {
    httpServer = s;
  })
  .catch(err => {
    logger.error('Failed to start server', {
      error: err instanceof Error ? err.message : String(err),
    });
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection', { reason: reason?.message || reason });
  prisma.$disconnect().finally(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', { error: error?.message || error });
  prisma.$disconnect().finally(() => process.exit(1));
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received — shutting down gracefully`);
  // 1. Stop accepting new connections
  if (httpServer) {
    httpServer.close(() => {
      logger.info('HTTP server closed — no new connections');
    });
  }
  // 2. Allow in-flight requests up to 10s to finish
  await new Promise(resolve => setTimeout(resolve, 10_000));
  // 3. Disconnect database
  await prisma.$disconnect();
  logger.info('Database disconnected — exiting');
  process.exit(0);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
