/**
 * White Caves CRM - Express.js Server Setup
 * Main server entry point with middleware and routing
 * ESM-compatible — all routes use static imports
 */

import crypto from 'crypto';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDatabase, prisma } from './database.js';
import { errorHandler, asyncHandler, AppError } from './middleware/errorHandler.js';
import authMiddleware from './middleware/auth.js';
import { CORS_ORIGINS, WHATSAPP_WEBHOOK_SECRET } from './config/env.js';
import { apiLimiter, authLimiter, registerLimiter, passwordLimiter, strictLimiter } from './middleware/rateLimiter.js';
import logger, { createLogger } from './utils/logger.js';

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

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://*.firebaseapp.com", "https://*.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://*.unsplash.com", "https://*.googleapis.com", "https://*.gstatic.com"],
      connectSrc: ["'self'", "https://*.firebaseio.com", "https://*.googleapis.com", "https://*.firebase.com", "wss://*.firebaseio.com", "https://api.stripe.com"],
      frameSrc: ["https://*.firebaseapp.com", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for Firebase/Stripe iframes
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, mobile apps)
    if (!origin || CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Compression
app.use(compression());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Content-Type validation for mutation endpoints
// Exempt paths that accept non-JSON bodies (file uploads, webhooks).
const NON_JSON_PATHS = new Set(['/api/whatsapp/webhook']);
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
app.use('/api/auth/firebase-sync', authLimiter);

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

// ============================================================================
// API ROUTES
// ============================================================================

// Authentication routes
app.use('/api/auth', authRoutes);

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

// Users API — alias for /api/agents (frontend calls /api/users?role=agent)
app.use('/api/users', agentsRoutes);

// Transactions API (Sophia - Pipeline, Theodora - Finance)
app.use('/api/transactions', transactionsRoutes);

// Finance API (Theodora - Finance Director)
app.use('/api/finance', financeRoutes);

// Tenants API (Daisy - Leasing Manager)
app.use('/api/tenants', tenantsRoutes);

// Communications API (Nadia - WhatsApp CRM, Nina - Bot)
app.use('/api/communications', communicationsRoutes);

// WhatsApp Webhook (public endpoint — requires webhook secret for verification)
app.post('/api/whatsapp/webhook', asyncHandler(async (req: Request, res: Response) => {
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
}));

// Reporting API (Zoe - Executive Dashboard)
app.use('/api/dashboard', reportingRoutes);

// Compliance API (Laila - Compliance Officer)
app.use('/api/compliance', complianceRoutes);

// CRM General API (Search, Analytics, Dashboard, Export)
app.use('/api/crm/export', strictLimiter); // Strict rate limit on data export
app.use('/api/crm', crmRoutes);

// AI Assistants API (Phase 0.8 — plan management)
app.use('/api/assistants', assistantsRoutes);

// ============================================================================
// STUB ROUTES — Placeholder APIs for frontend pages not yet backed by full CRUD
// These prevent 404 errors and return meaningful empty/default data
// ============================================================================

// WhatsApp API stubs (WhatsAppSettingsPage, WhatsAppDashboardPage, WhatsAppChatbotPage)
app.get('/api/whatsapp/stats', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { totalMessages: 0, sentToday: 0, received: 0, activeChats: 0, sessions: [] } });
}));
app.get('/api/whatsapp/settings', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { phoneNumber: '', connected: false, autoReply: false, businessHours: null } });
}));
app.put('/api/whatsapp/settings', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Settings updated (stub)' });
}));
app.post('/api/whatsapp/session', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { sessionId: 'stub-session', status: 'pending' } });
}));
app.post('/api/whatsapp/init', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'WhatsApp initialization pending — configure phone number first' });
}));
app.post('/api/whatsapp/disconnect', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'WhatsApp disconnected' });
}));
app.post('/api/whatsapp/message', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { id: Date.now().toString(), status: 'queued' } });
}));
app.get('/api/whatsapp/chatbot/messages', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: [] });
}));
app.post('/api/whatsapp/chatbot/messages', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { id: Date.now().toString(), role: 'user', createdAt: new Date() } });
}));
app.delete('/api/whatsapp/chatbot/messages/:id', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true });
}));

// Contracts API stubs (ContractManagementPage)
app.get('/api/contracts', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } });
}));
app.post('/api/contracts', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(201).json({ success: true, data: { id: Date.now().toString(), status: 'draft', createdAt: new Date() } });
}));

// Job Applications API stubs (JobBoard, JobApplicants)
// TODO: Add Prisma model and full CRUD when HR module is prioritised
app.get('/api/job-applications', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } });
}));
app.post('/api/job-applications', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  logger.info('Job application received (stub)', { body: Object.keys(req.body || {}) });
  res.status(201).json({ success: true, data: { id: Date.now().toString(), status: 'pending', createdAt: new Date() } });
}));
app.patch('/api/job-applications/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body || {};
  logger.info('Job application status update (stub)', { id, status });
  res.status(200).json({ success: true, data: { id, status: status || 'pending', updatedAt: new Date() } });
}));

// Appointments API stubs (AppointmentScheduler)
// TODO: Add Prisma model and full CRUD when scheduling module is prioritised
app.post('/api/appointments', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  logger.info('Appointment created (stub)', { propertyId: req.body?.propertyId, agentId: req.body?.agentId });
  res.status(201).json({ success: true, data: { id: Date.now().toString(), status: 'confirmed', createdAt: new Date() } });
}));
app.get('/api/appointments', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } });
}));
app.patch('/api/appointments/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { id: req.params.id, status: 'updated', updatedAt: new Date() } });
}));
app.delete('/api/appointments/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: `Appointment ${req.params.id} cancelled (stub)` });
}));

// Tenancy Agreements API stubs (CreateTenancyAgreement)
// TODO: Add Prisma model and full CRUD when lease management module is prioritised
app.get('/api/tenancy-agreements', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } });
}));
app.post('/api/tenancy-agreements', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  logger.info('Tenancy agreement created (stub)', { propertyId: req.body?.propertyId });
  res.status(201).json({ success: true, data: { id: Date.now().toString(), status: 'draft', createdAt: new Date() } });
}));
app.patch('/api/tenancy-agreements/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { id: req.params.id, status: 'updated', updatedAt: new Date() } });
}));

// Payments API stub (Checkout — Stripe integration pending)
// TODO: Integrate Stripe SDK when payment processing is prioritised
app.post('/api/payments/create-payment-intent', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  logger.warn('Payment intent requested but Stripe is not configured', { amount: req.body?.amount, propertyId: req.body?.propertyId });
  res.status(503).json({ success: false, error: 'Payment processing is not yet configured. Please contact support.' });
}));

// Valuation API stub (PropertyValuationModule — ML engine pending)
// TODO: Integrate property valuation ML model when available
app.post('/api/valuation/estimate', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  logger.info('Valuation estimate requested (stub)', { location: req.body?.location, area: req.body?.area });
  // Return 501 so frontend falls back to local estimation
  res.status(501).json({ success: false, error: 'Valuation engine not yet available' });
}));

// System Health API stub (SystemHealthPage)
// AUTHORIZATION: Restrict server internals to admin roles only
app.get('/api/system/health', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — system health requires admin role', 403);
  }

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
}));

// Admin Role Management stubs (RoleSelectionForm, RoleApprovalQueue)
// TODO: Add Prisma model for RoleRequest when role management module is prioritised
app.post('/api/users/role', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — role assignment requires admin role', 403);
  }
  const { userId, role } = req.body;
  if (!userId || !role) throw new AppError('userId and role are required', 400);
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, email: true, name: true, role: true },
  });
  await prisma.activity.create({
    data: { type: 'system', action: 'updated', description: `Role changed to ${role} for ${updated.email}`, userId: req.user?.id || null },
  });
  res.status(200).json({ success: true, data: updated });
}));
app.post('/api/users/role-request', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { userId, requestedRole, reason } = req.body;
  if (!requestedRole) throw new AppError('requestedRole is required', 400);
  logger.info('Role request submitted (stub)', { userId: userId || req.user?.id, requestedRole });
  res.status(201).json({ success: true, data: { id: Date.now().toString(), userId: userId || req.user?.id, requestedRole, reason, status: 'pending', createdAt: new Date() } });
}));
app.get('/api/admin/role-requests', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — admin role required', 403);
  }
  res.status(200).json({ success: true, data: { requests: [] } });
}));
app.post('/api/admin/role-requests/:id/approve', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — admin role required', 403);
  }
  res.status(200).json({ success: true, data: { id: req.params.id, status: 'approved', reviewedBy: req.user?.id } });
}));
app.post('/api/admin/role-requests/:id/reject', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — admin role required', 403);
  }
  res.status(200).json({ success: true, data: { id: req.params.id, status: 'rejected', reviewedBy: req.user?.id, reason: req.body?.reason } });
}));

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
  const server = app.listen(PORT, () => {
    logger.info(`Server started on ${host}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`API Base: ${host}/api`);
  });

  return server;
};

// Start the server
let httpServer: ReturnType<typeof app.listen> | null = null;
startServer()
  .then((s) => { httpServer = s; })
  .catch((err) => {
    logger.error('Failed to start server', { error: err instanceof Error ? err.message : String(err) });
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
  await new Promise((resolve) => setTimeout(resolve, 10_000));
  // 3. Disconnect database
  await prisma.$disconnect();
  logger.info('Database disconnected — exiting');
  process.exit(0);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
