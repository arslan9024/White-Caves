import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { connectDB } from './lib/database.js';
import * as googleCalendar from './lib/googleCalendar.js';
import uaePassRoutes from './routes/uaepass.routes.js';
import webauthnRoutes from './routes/webauthn.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import oliviaRoutes from './routes/olivia.routes.js';
import zoeRoutes from './routes/zoe.routes.js';
import organizationRoutes from './routes/organization.js';
import seedRoutes from './routes/seed.js';
import transactionsRoutes from './routes/transactions.routes.js';
import seedTransactionsRoutes from './routes/seed-transactions.js';
import offplanRoutes from './routes/offplan.js';
import ninaRoutes from './routes/nina.js';
import { handleValidationErrors } from './middleware/validation.js';
import { inventoryRateLimits } from './middleware/rateLimiting.js';
import cacheManager, { cacheMiddleware, invalidateCache, prewarmCache } from './lib/cache.js';
import complianceRoutes from './routes/compliance.js';
import dealsRoutes from './routes/deals.js';
import auroraRoutes from './routes/aurora.js';
import comprehensiveSeedRoutes from './routes/comprehensive-seed.js';
import crudRoutes from './routes/crud.js';
import dubaiPlatformRoutes from './routes/dubai-platform.js';
import seedDubaiPlatformRoutes from './routes/seed-dubai-platform.js';
import errorRoutes from './routes/errors.js';
import plansRoutes from './routes/plans.js';
import contractsRoutes from './routes/contracts.js';
import whatsappRoutes from './routes/whatsapp.js';
import signaturesRoutes from './routes/signatures.js';
import statusRoutes from './routes/status.js';
import OliviaService from './services/oliviaService.js';
import schedulerService from './services/schedulerService.js';

let firebaseInitialized = false;
try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;
  
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseInitialized = true;
    console.log('Firebase Admin SDK initialized');
  } else {
    console.log('Firebase Admin SDK not configured - FIREBASE_SERVICE_ACCOUNT not set');
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error.message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Use port 5000 in production (when static files exist), 3000 in development
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || (isProduction ? 5000 : 3000);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/auth/uaepass', uaePassRoutes);
app.use('/api/auth/webauthn', webauthnRoutes);
app.use('/api/errors', errorRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Apply production hardening middleware to inventory routes
app.use('/api/inventory',
  inventoryRateLimits.search,  // Rate limiting
  cacheMiddleware(300, 'inventory'),  // Caching (5-minute TTL)
  inventoryRoutes
);

app.use('/api/featured-properties', oliviaRoutes);
app.use('/api/zoe', zoeRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/seed', seedTransactionsRoutes);
app.use('/api/offplan', offplanRoutes);
app.use('/api/nina', ninaRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/aurora', auroraRoutes);
app.use('/api/seed/comprehensive', comprehensiveSeedRoutes);
app.use('/api/crud', crudRoutes);
app.use('/api/dubai', dubaiPlatformRoutes);
app.use('/api/seed/dubai', seedDubaiPlatformRoutes);
app.use('/api/plans', plansRoutes);

// New modular routes
app.use('/api/contracts', contractsRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/signature', signaturesRoutes);
app.use('/api', statusRoutes);

// Serve static files from the dist folder in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

let useDatabase = false;

const contractsFile = path.join(__dirname, 'data', 'contracts.json');
const tokensFile = path.join(__dirname, 'data', 'tokens.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

function loadContracts() {
  try {
    if (fs.existsSync(contractsFile)) {
      return JSON.parse(fs.readFileSync(contractsFile, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading contracts:', e);
  }
  return [];
}

function saveContracts(contracts) {
  fs.writeFileSync(contractsFile, JSON.stringify(contracts, null, 2));
}

function loadTokens() {
  try {
    if (fs.existsSync(tokensFile)) {
      return JSON.parse(fs.readFileSync(tokensFile, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading tokens:', e);
  }
  return {};
}

function saveTokens(tokens) {
  fs.writeFileSync(tokensFile, JSON.stringify(tokens, null, 2));
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateContractNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `WC-${year}-${random}`;
}

function normalizeContract(contract) {
  if (!contract) return null;
  const obj = contract.toObject ? contract.toObject() : contract;
  if (obj._id && !obj.id) {
    obj.id = obj._id.toString();
  }
  return obj;
}

connectDB().then(() => {
  useDatabase = true;
  console.log('Using MongoDB for storage');
  
  schedulerService.init();
}).catch(() => {
  console.log('Using file-based storage');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), database: useDatabase ? 'mongodb' : 'file' });
});

app.get('/api/scheduler/status', (req, res) => {
  res.json({
    success: true,
    scheduledJobs: schedulerService.getJobStatus(),
    timestamp: new Date().toISOString()
  });
});

const serverStartTime = Date.now();

app.get('/api/system/health', async (req, res) => {
  const formatUptime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  let mongodbStatus = { status: 'disconnected', storageMode: 'file', database: '-' };
  if (useDatabase) {
    try {
      const mongoose = await import('mongoose');
      if (mongoose.default.connection.readyState === 1) {
        mongodbStatus = {
          status: 'connected',
          storageMode: 'mongodb',
          database: mongoose.default.connection.name || 'WhiteCavesDB'
        };
      }
    } catch (e) {
      mongodbStatus = { status: 'error', storageMode: 'file', error: e.message };
    }
  } else {
    mongodbStatus = { status: 'fallback', storageMode: 'file', error: 'Using file-based storage' };
  }

  const firebaseStatus = {
    status: process.env.FIREBASE_SERVICE_ACCOUNT ? 'configured' : 'not_configured',
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || '-',
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '-',
    adminSdk: process.env.FIREBASE_SERVICE_ACCOUNT ? 'Configured' : 'Not Set'
  };

  const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
  const stripeStatus = {
    status: stripeKey ? 'configured' : 'not_configured',
    configured: !!stripeKey,
    mode: stripeKey ? (stripeKey.includes('_test_') ? 'Test' : 'Live') : '-'
  };

  let googleDriveStatus = { status: 'not_configured', configured: false };
  try {
    const hasCredentials = !!(process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_SERVICE_ACCOUNT);
    googleDriveStatus = {
      status: hasCredentials ? 'configured' : 'not_configured',
      configured: hasCredentials
    };
  } catch (e) {
    googleDriveStatus = { status: 'error', configured: false, error: e.message };
  }

  const googleMapsStatus = {
    status: process.env.GOOGLE_API_KEY ? 'configured' : 'not_configured',
    configured: !!process.env.GOOGLE_API_KEY
  };

  const whatsappStatus = {
    status: process.env.WHATSAPP_ACCESS_TOKEN ? 'configured' : 'not_configured',
    configured: !!process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ? 'Set' : 'Not Set',
    chatbotEnabled: true
  };

  const envVars = [
    { name: 'MONGODB_URI', set: !!process.env.MONGODB_URI },
    { name: 'FIREBASE_SERVICE_ACCOUNT', set: !!process.env.FIREBASE_SERVICE_ACCOUNT },
    { name: 'VITE_FIREBASE_API_KEY', set: !!process.env.VITE_FIREBASE_API_KEY },
    { name: 'VITE_FIREBASE_PROJECT_ID', set: !!process.env.VITE_FIREBASE_PROJECT_ID },
    { name: 'STRIPE_SECRET_KEY', set: !!(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY) },
    { name: 'GOOGLE_API_KEY', set: !!process.env.GOOGLE_API_KEY },
    { name: 'SESSION_SECRET', set: !!process.env.SESSION_SECRET },
    { name: 'WHATSAPP_ACCESS_TOKEN', set: !!process.env.WHATSAPP_ACCESS_TOKEN }
  ];

  const buildExists = fs.existsSync(path.join(__dirname, '..', 'dist'));
  const isProductionMode = process.env.NODE_ENV === 'production';
  
  const deploymentChecks = [
    { 
      name: 'Production Build', 
      status: buildExists ? 'ready' : 'not_ready',
      message: buildExists ? 'Build files exist in /dist' : 'Run npm run build to create production files',
      critical: true
    },
    { 
      name: 'Environment Mode', 
      status: isProductionMode ? 'production' : 'development',
      message: isProductionMode ? 'Running in production mode' : 'Set NODE_ENV=production for deployment',
      critical: false
    },
    { 
      name: 'Database Connection', 
      status: useDatabase ? 'ready' : 'not_ready',
      message: useDatabase ? 'MongoDB connected' : 'Configure MONGODB_URI for persistent storage',
      critical: true
    },
    { 
      name: 'Authentication', 
      status: process.env.FIREBASE_SERVICE_ACCOUNT ? 'ready' : 'not_ready',
      message: process.env.FIREBASE_SERVICE_ACCOUNT ? 'Firebase configured' : 'Set FIREBASE_SERVICE_ACCOUNT',
      critical: true
    },
    { 
      name: 'Payment Processing', 
      status: stripeKey ? 'ready' : 'not_ready',
      message: stripeKey ? `Stripe ${stripeKey.includes('_test_') ? '(Test Mode)' : '(Live Mode)'}` : 'Configure STRIPE_SECRET_KEY',
      critical: false
    },
    { 
      name: 'Static Assets', 
      status: buildExists && fs.existsSync(path.join(__dirname, '..', 'dist', 'index.html')) ? 'ready' : 'not_ready',
      message: buildExists ? 'Static files ready to serve' : 'Build required for static hosting',
      critical: true
    },
    { 
      name: 'WhatsApp Integration', 
      status: process.env.WHATSAPP_ACCESS_TOKEN ? 'ready' : 'simulated',
      message: process.env.WHATSAPP_ACCESS_TOKEN ? 'WhatsApp API connected' : 'Running in simulation mode',
      critical: false
    },
    { 
      name: 'Google Services', 
      status: (process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_API_KEY) ? 'ready' : 'not_ready',
      message: (process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_API_KEY) ? 'Google APIs configured' : 'Configure Google credentials',
      critical: false
    }
  ];

  const productionReadiness = {
    score: Math.round((deploymentChecks.filter(c => c.status === 'ready' || c.status === 'production').length / deploymentChecks.length) * 100),
    criticalIssues: deploymentChecks.filter(c => c.critical && c.status !== 'ready').length,
    totalChecks: deploymentChecks.length,
    passedChecks: deploymentChecks.filter(c => c.status === 'ready' || c.status === 'production' || c.status === 'simulated').length,
    isDeployable: deploymentChecks.filter(c => c.critical && c.status !== 'ready').length === 0
  };

  res.json({
    server: {
      status: 'healthy',
      uptime: formatUptime(Date.now() - serverStartTime),
      environment: process.env.NODE_ENV || 'development',
      port: PORT
    },
    mongodb: mongodbStatus,
    firebase: firebaseStatus,
    stripe: stripeStatus,
    googleDrive: googleDriveStatus,
    googleMaps: googleMapsStatus,
    whatsapp: whatsappStatus,
    envVars,
    deploymentChecks,
    productionReadiness
  });
});



app.get('/api/drive/files', async (req, res) => {
  try {
    const { folderId } = req.query;
    const files = await listFiles(folderId || null);
    res.json({ success: true, files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/drive/create-folder', async (req, res) => {
  try {
    const { folderName, parentFolderId } = req.body;
    const result = await createFolder(folderName, parentFolderId);
    res.json({ success: true, folder: result });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/calendar/auth', (req, res) => {
  try {
    const state = req.query.state || '';
    const authUrl = googleCalendar.getAuthUrl(state);
    res.json({ success: true, authUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/calendar/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const tokens = await googleCalendar.getTokens(code);
    res.redirect(`/calendar-connected?success=true&state=${state || ''}`);
  } catch (error) {
    res.redirect(`/calendar-connected?success=false&error=${encodeURIComponent(error.message)}`);
  }
});

app.post('/api/calendar/events', async (req, res) => {
  try {
    const result = await googleCalendar.createCalendarEvent(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/calendar/viewing', async (req, res) => {
  try {
    const result = await googleCalendar.createPropertyViewingEvent(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/calendar/upcoming', async (req, res) => {
  try {
    const maxResults = parseInt(req.query.maxResults) || 10;
    const result = await googleCalendar.getUpcomingEvents(maxResults);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/calendar/events/:eventId', async (req, res) => {
  try {
    const result = await googleCalendar.deleteCalendarEvent(req.params.eventId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const result = await googleCalendar.createTask(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/tasks/followup', async (req, res) => {
  try {
    const result = await googleCalendar.createFollowUpTask(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const showCompleted = req.query.showCompleted === 'true';
    const result = await googleCalendar.getTasks('@default', showCompleted);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/tasks/:taskId/complete', async (req, res) => {
  try {
    const result = await googleCalendar.completeTask(req.params.taskId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



// Catch-all route for client-side routing (must be after API routes)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next();
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
