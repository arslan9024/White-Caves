/**
 * White Caves CRM - Express.js Server Setup
 * Main server entry point with middleware and routing
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDatabase } from './database';
import { errorHandler, asyncHandler } from './middleware/errorHandler';
import authMiddleware from './middleware/auth';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5000',
  credentials: true,
}));

// Compression
app.use(compression());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
app.use('/api/auth', require('./routes/auth').default);

// Protected routes (require authentication in production, optional in development)
if (process.env.NODE_ENV === 'production') {
  app.use('/api', authMiddleware);
} else {
  // In dev mode, attach a default user if no token provided
  app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      return authMiddleware(req, res, next);
    }
    // Dev fallback: attach owner user
    (req as any).user = { id: 'dev-owner', email: 'owner@whitecaves.ae', role: 'owner' };
    next();
  });
}

// Leads API (Clara - Lead Manager)
app.use('/api/leads', require('./routes/leads').default);

// Properties API (Mary - Inventory Manager)
app.use('/api/properties', require('./routes/properties').default);

// Agents API
app.use('/api/agents', require('./routes/agents').default);

// Users API — alias for /api/agents (frontend calls /api/users?role=agent)
app.use('/api/users', require('./routes/agents').default);

// Transactions API (Sophia - Pipeline, Theodora - Finance)
app.use('/api/transactions', require('./routes/transactions').default);

// Finance API (Theodora - Finance Director)
app.use('/api/finance', require('./routes/finance').default);

// Tenants API (Daisy - Leasing Manager)
app.use('/api/tenants', require('./routes/tenants').default);

// Communications API (Linda - WhatsApp CRM, Nina - Bot)
app.use('/api/communications', require('./routes/communications').default);

// WhatsApp Webhook (public, no auth required)
app.post('/api/whatsapp/webhook', (req: Request, res: Response) => {
  // Handle incoming WhatsApp messages
  console.log('WhatsApp webhook:', req.body);
  res.status(200).json({ success: true });
});

// Reporting API (Zoe - Executive Dashboard)
app.use('/api/dashboard', require('./routes/reporting').default);

// Compliance API (Laila - Compliance Officer)
app.use('/api/compliance', require('./routes/compliance').default);

// CRM General API (Search, Analytics, Dashboard, Export)
app.use('/api/crm', require('./routes/crm').default);

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
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await connectDatabase();
    console.log('✅ MongoDB connected successfully');

    // Start listening
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║  🚀 WHITE CAVES CRM SERVER STARTED                          ║
╠════════════════════════════════════════════════════════════╣
║  Server: http://localhost:${PORT}                      │
║  Environment: ${process.env.NODE_ENV || 'development'}
║  API Base: http://localhost:${PORT}/api                │
║  Health Check: http://localhost:${PORT}/health         │
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

export default app;
