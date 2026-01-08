import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';
import admin from 'firebase-admin';
import { uploadToDrive, createFolder, listFiles } from './lib/googleDrive.js';
import { connectDB, Contract, SignatureToken, WhatsAppMessage, WhatsAppChatbotRule, WhatsAppSettings, WhatsAppContact } from './lib/database.js';
import WhatsAppSession from './models/WhatsAppSession.js';
import * as googleCalendar from './lib/googleCalendar.js';
import chatbotService from './services/ChatbotService.js';
import uaePassRoutes from './routes/uaepass.routes.js';
import webauthnRoutes from './routes/webauthn.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

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
app.use('/api/dashboard', dashboardRoutes);

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
}).catch(() => {
  console.log('Using file-based storage');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), database: useDatabase ? 'mongodb' : 'file' });
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

app.get('/api/contracts', async (req, res) => {
  try {
    if (useDatabase) {
      const contracts = await Contract.find().sort({ createdAt: -1 });
      return res.json({ success: true, contracts: contracts.map(normalizeContract) });
    }
    const contracts = loadContracts();
    res.json({ success: true, contracts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/contracts/:id', async (req, res) => {
  try {
    if (useDatabase) {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }
      return res.json({ success: true, contract: normalizeContract(contract) });
    }
    const contracts = loadContracts();
    const contract = contracts.find(c => c.id === req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    res.json({ success: true, contract });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/contracts', async (req, res) => {
  try {
    const contractData = req.body;
    const contractNumber = generateContractNumber();
    
    if (useDatabase) {
      const newContract = new Contract({
        ...contractData,
        contractNumber,
        status: 'draft',
        signatures: { lessor: null, tenant: null, broker: null },
        signatureLinks: { lessor: null, tenant: null }
      });
      await newContract.save();
      return res.json({ success: true, contract: normalizeContract(newContract) });
    }
    
    const contracts = loadContracts();
    const newContract = {
      id: crypto.randomUUID(),
      contractNumber,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...contractData,
      signatures: { lessor: null, tenant: null, broker: null },
      signatureLinks: { lessor: null, tenant: null }
    };
    
    contracts.unshift(newContract);
    saveContracts(contracts);
    res.json({ success: true, contract: newContract });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/contracts/:id', async (req, res) => {
  try {
    if (useDatabase) {
      const contract = await Contract.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      if (!contract) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }
      return res.json({ success: true, contract: normalizeContract(contract) });
    }
    
    const contracts = loadContracts();
    const index = contracts.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    contracts[index] = { ...contracts[index], ...req.body, updatedAt: new Date().toISOString() };
    saveContracts(contracts);
    res.json({ success: true, contract: contracts[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/contracts/:id/generate-signature-link', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['lessor', 'tenant'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role. Must be lessor or tenant.' });
    }
    
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'http://localhost:5000';
    const signatureLink = `${baseUrl}/sign/${token}`;
    
    if (useDatabase) {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }
      
      const signatureToken = new SignatureToken({
        token,
        contractId: contract._id,
        role,
        expiresAt
      });
      await signatureToken.save();
      
      contract.signatureLinks[role] = { token, link: signatureLink, expiresAt, createdAt: new Date() };
      await contract.save();
      
      return res.json({ success: true, signatureLink, expiresAt, role });
    }
    
    const contracts = loadContracts();
    const contract = contracts.find(c => c.id === req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    const tokens = loadTokens();
    tokens[token] = { contractId: contract.id, role, expiresAt: expiresAt.toISOString(), used: false, createdAt: new Date().toISOString() };
    saveTokens(tokens);
    
    const contractIndex = contracts.findIndex(c => c.id === req.params.id);
    contracts[contractIndex].signatureLinks[role] = { token, link: signatureLink, expiresAt: expiresAt.toISOString(), createdAt: new Date().toISOString() };
    saveContracts(contracts);
    
    res.json({ success: true, signatureLink, expiresAt, role });
  } catch (error) {
    console.error('Error generating signature link:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/signature/:token', async (req, res) => {
  try {
    if (useDatabase) {
      const tokenData = await SignatureToken.findOne({ token: req.params.token });
      if (!tokenData) {
        return res.status(404).json({ success: false, error: 'Invalid signature link' });
      }
      if (tokenData.used) {
        return res.status(400).json({ success: false, error: 'This signature link has already been used' });
      }
      if (new Date(tokenData.expiresAt) < new Date()) {
        return res.status(400).json({ success: false, error: 'This signature link has expired' });
      }
      
      const contract = await Contract.findById(tokenData.contractId);
      if (!contract) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }
      
      const safeContract = {
        id: contract._id,
        contractNumber: contract.contractNumber,
        ownerName: contract.ownerName,
        lessorName: contract.lessorName,
        tenantName: contract.tenantName,
        propertyUsage: contract.propertyUsage,
        buildingName: contract.buildingName,
        propertyType: contract.propertyType,
        location: contract.location,
        contractPeriodFrom: contract.contractPeriodFrom,
        contractPeriodTo: contract.contractPeriodTo,
        annualRent: contract.annualRent,
        securityDeposit: contract.securityDeposit,
        modeOfPayment: contract.modeOfPayment
      };
      
      return res.json({
        success: true,
        contract: safeContract,
        role: tokenData.role,
        signerName: tokenData.role === 'lessor' ? contract.lessorName : contract.tenantName
      });
    }
    
    const tokens = loadTokens();
    const tokenData = tokens[req.params.token];
    if (!tokenData) {
      return res.status(404).json({ success: false, error: 'Invalid signature link' });
    }
    if (tokenData.used) {
      return res.status(400).json({ success: false, error: 'This signature link has already been used' });
    }
    if (new Date(tokenData.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: 'This signature link has expired' });
    }
    
    const contracts = loadContracts();
    const contract = contracts.find(c => c.id === tokenData.contractId);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    const safeContract = {
      id: contract.id,
      contractNumber: contract.contractNumber,
      ownerName: contract.ownerName,
      lessorName: contract.lessorName,
      tenantName: contract.tenantName,
      propertyUsage: contract.propertyUsage,
      buildingName: contract.buildingName,
      propertyType: contract.propertyType,
      location: contract.location,
      contractPeriodFrom: contract.contractPeriodFrom,
      contractPeriodTo: contract.contractPeriodTo,
      annualRent: contract.annualRent,
      securityDeposit: contract.securityDeposit,
      modeOfPayment: contract.modeOfPayment
    };
    
    res.json({
      success: true,
      contract: safeContract,
      role: tokenData.role,
      signerName: tokenData.role === 'lessor' ? contract.lessorName : contract.tenantName
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/signature/:token/sign', async (req, res) => {
  try {
    const { signature, signerName } = req.body;
    if (!signature) {
      return res.status(400).json({ success: false, error: 'Signature is required' });
    }
    
    if (useDatabase) {
      const tokenData = await SignatureToken.findOne({ token: req.params.token });
      if (!tokenData) {
        return res.status(404).json({ success: false, error: 'Invalid signature link' });
      }
      if (tokenData.used) {
        return res.status(400).json({ success: false, error: 'This signature link has already been used' });
      }
      if (new Date(tokenData.expiresAt) < new Date()) {
        return res.status(400).json({ success: false, error: 'This signature link has expired' });
      }
      
      const contract = await Contract.findById(tokenData.contractId);
      if (!contract) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }
      
      contract.signatures[tokenData.role] = {
        signature,
        signerName: signerName || (tokenData.role === 'lessor' ? contract.lessorName : contract.tenantName),
        signedAt: new Date(),
        ipAddress: req.ip
      };
      
      const hasLessor = !!contract.signatures.lessor?.signature;
      const hasTenant = !!contract.signatures.tenant?.signature;
      contract.status = (hasLessor && hasTenant) ? 'fully_signed' : 'partially_signed';
      
      await contract.save();
      
      tokenData.used = true;
      tokenData.usedAt = new Date();
      await tokenData.save();
      
      return res.json({ success: true, message: 'Contract signed successfully', status: contract.status });
    }
    
    const tokens = loadTokens();
    const tokenData = tokens[req.params.token];
    if (!tokenData) {
      return res.status(404).json({ success: false, error: 'Invalid signature link' });
    }
    if (tokenData.used) {
      return res.status(400).json({ success: false, error: 'This signature link has already been used' });
    }
    if (new Date(tokenData.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: 'This signature link has expired' });
    }
    
    const contracts = loadContracts();
    const contractIndex = contracts.findIndex(c => c.id === tokenData.contractId);
    if (contractIndex === -1) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    
    contracts[contractIndex].signatures[tokenData.role] = {
      signature,
      signerName: signerName || (tokenData.role === 'lessor' ? contracts[contractIndex].lessorName : contracts[contractIndex].tenantName),
      signedAt: new Date().toISOString(),
      ipAddress: req.ip
    };
    
    const hasLessor = !!contracts[contractIndex].signatures.lessor;
    const hasTenant = !!contracts[contractIndex].signatures.tenant;
    contracts[contractIndex].status = (hasLessor && hasTenant) ? 'fully_signed' : 'partially_signed';
    contracts[contractIndex].updatedAt = new Date().toISOString();
    saveContracts(contracts);
    
    tokens[req.params.token].used = true;
    tokens[req.params.token].usedAt = new Date().toISOString();
    saveTokens(tokens);
    
    res.json({ success: true, message: 'Contract signed successfully', status: contracts[contractIndex].status });
  } catch (error) {
    console.error('Error signing contract:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/contracts/:id/broker-sign', async (req, res) => {
  try {
    const { signature, signerName } = req.body;
    if (!signature) {
      return res.status(400).json({ success: false, error: 'Signature is required' });
    }
    
    if (useDatabase) {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }
      contract.signatures.broker = { signature, signerName, signedAt: new Date() };
      await contract.save();
      return res.json({ success: true, message: 'Broker signature added successfully' });
    }
    
    const contracts = loadContracts();
    const contractIndex = contracts.findIndex(c => c.id === req.params.id);
    if (contractIndex === -1) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    contracts[contractIndex].signatures.broker = { signature, signerName, signedAt: new Date().toISOString() };
    contracts[contractIndex].updatedAt = new Date().toISOString();
    saveContracts(contracts);
    res.json({ success: true, message: 'Broker signature added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/contracts/upload-to-drive', async (req, res) => {
  try {
    const contractData = req.body;
    const contractHtml = generateContractHtml(contractData);
    const fileName = `TenancyContract_${contractData.contractNumber}_${Date.now()}.html`;
    const htmlStream = Readable.from([contractHtml]);
    const result = await uploadToDrive(fileName, htmlStream, 'text/html');
    
    if (useDatabase && contractData._id) {
      await Contract.findByIdAndUpdate(contractData._id, {
        driveFileId: result.id,
        driveWebViewLink: result.webViewLink
      });
    }
    
    res.json({ success: true, fileId: result.id, fileName: result.name, webViewLink: result.webViewLink });
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to upload contract to Google Drive' });
  }
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

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const isOwnerMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Authorization required' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    if (firebaseInitialized) {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (decodedToken.email !== OWNER_EMAIL) {
        return res.status(403).json({ success: false, error: 'Access denied. Owner only feature.' });
      }
      req.user = decodedToken;
    } else {
      const headerEmail = req.headers['x-owner-email'];
      if (headerEmail !== OWNER_EMAIL) {
        return res.status(403).json({ success: false, error: 'Access denied. Owner only feature.' });
      }
    }
    
    next();
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return res.status(401).json({ success: false, error: 'Invalid authentication token' });
  }
};

app.get('/api/whatsapp/settings', isOwnerMiddleware, async (req, res) => {
  try {
    if (!useDatabase) {
      return res.json({ success: true, settings: { isConnected: false } });
    }
    let settings = await WhatsAppSettings.findOne({ ownerEmail: OWNER_EMAIL });
    if (!settings) {
      settings = await WhatsAppSettings.create({ ownerEmail: OWNER_EMAIL });
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/whatsapp/settings', isOwnerMiddleware, async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(400).json({ success: false, error: 'Database not available' });
    }
    const settings = await WhatsAppSettings.findOneAndUpdate(
      { ownerEmail: OWNER_EMAIL },
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/whatsapp/messages', isOwnerMiddleware, async (req, res) => {
  try {
    if (!useDatabase) {
      return res.json({ success: true, messages: [] });
    }
    const { contactId, limit = 50 } = req.query;
    const query = contactId ? { waId: contactId } : {};
    const messages = await WhatsAppMessage.find(query).sort({ createdAt: -1 }).limit(parseInt(limit));
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/whatsapp/messages', isOwnerMiddleware, async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(400).json({ success: false, error: 'Database not available' });
    }
    const message = await WhatsAppMessage.create({
      ...req.body,
      direction: 'outgoing',
      status: 'sent'
    });
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/whatsapp/contacts', isOwnerMiddleware, async (req, res) => {
  try {
    if (!useDatabase) {
      return res.json({ success: true, contacts: [] });
    }
    const contacts = await WhatsAppContact.find().sort({ lastMessageAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/whatsapp/chatbot/rules', isOwnerMiddleware, async (req, res) => {
  try {
    if (!useDatabase) {
      return res.json({ success: true, rules: [] });
    }
    const rules = await WhatsAppChatbotRule.find().sort({ priority: -1 });
    res.json({ success: true, rules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/whatsapp/chatbot/rules', isOwnerMiddleware, async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(400).json({ success: false, error: 'Database not available' });
    }
    const rule = await WhatsAppChatbotRule.create(req.body);
    res.json({ success: true, rule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/whatsapp/chatbot/rules/:id', isOwnerMiddleware, async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(400).json({ success: false, error: 'Database not available' });
    }
    const rule = await WhatsAppChatbotRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rule) {
      return res.status(404).json({ success: false, error: 'Rule not found' });
    }
    res.json({ success: true, rule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/whatsapp/chatbot/rules/:id', isOwnerMiddleware, async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(400).json({ success: false, error: 'Database not available' });
    }
    await WhatsAppChatbotRule.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Rule deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/whatsapp/analytics', isOwnerMiddleware, async (req, res) => {
  try {
    if (!useDatabase) {
      return res.json({ success: true, analytics: { totalMessages: 0, uniqueContacts: 0 } });
    }
    const totalMessages = await WhatsAppMessage.countDocuments();
    const uniqueContacts = await WhatsAppContact.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayMessages = await WhatsAppMessage.countDocuments({ createdAt: { $gte: todayStart } });
    const unreadCount = await WhatsAppMessage.countDocuments({ isRead: false, direction: 'incoming' });
    res.json({
      success: true,
      analytics: { totalMessages, uniqueContacts, todayMessages, unreadCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

async function isWithinBusinessHours(session) {
  if (!session?.businessHoursOnly) return true;
  const now = new Date();
  const dubaiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
  const hours = dubaiTime.getHours();
  const businessHours = session.businessHours || { start: '09:00', end: '22:00' };
  const startHour = parseInt(businessHours.start.split(':')[0], 10);
  const endHour = parseInt(businessHours.end.split(':')[0], 10);
  return hours >= startHour && hours < endHour;
}

async function sendWhatsAppReply(phoneNumber, message, session) {
  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.log('[WhatsApp] Auto-reply simulated (no API credentials):', { to: phoneNumber, message: message.substring(0, 50) + '...' });
    return { success: true, simulated: true };
  }
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      })
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('[WhatsApp] Send error:', error);
    return { success: false, error: error.message };
  }
}

app.post('/api/whatsapp/webhook', async (req, res) => {
  try {
    const { entry } = req.body;
    if (entry) {
      const session = useDatabase ? await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL }) : null;
      
      for (const e of entry) {
        const changes = e.changes || [];
        for (const change of changes) {
          if (change.value && change.value.messages) {
            for (const msg of change.value.messages) {
              const messageContent = msg.text?.body || '';
              const senderPhone = msg.from;
              const conversationId = `wa_${senderPhone}`;
              
              if (useDatabase) {
                await WhatsAppMessage.create({
                  waId: senderPhone,
                  phoneNumber: senderPhone,
                  direction: 'incoming',
                  messageType: msg.type || 'text',
                  content: messageContent,
                  isRead: false
                });
                await WhatsAppContact.findOneAndUpdate(
                  { waId: senderPhone },
                  { waId: senderPhone, phoneNumber: senderPhone, lastMessageAt: new Date(), $inc: { unreadCount: 1 } },
                  { upsert: true }
                );
              }
              
              if (session?.chatbotEnabled && messageContent) {
                const withinHours = await isWithinBusinessHours(session);
                let replyMessage = null;
                
                if (!withinHours && session.awayMessage) {
                  replyMessage = session.awayMessage;
                } else if (withinHours) {
                  const quickReply = session.quickReplies?.find(qr => 
                    qr.enabled && messageContent.toLowerCase().includes(qr.trigger.toLowerCase())
                  );
                  
                  if (quickReply) {
                    replyMessage = quickReply.response;
                  } else {
                    const chatResponse = chatbotService.processMessage(messageContent, conversationId);
                    replyMessage = chatResponse.response;
                    
                    const leadScore = chatbotService.calculateLeadScore(conversationId);
                    if (useDatabase && leadScore > 0) {
                      await WhatsAppContact.findOneAndUpdate(
                        { waId: senderPhone },
                        { 
                          leadScore,
                          detectedIntent: chatResponse.intent,
                          detectedLanguage: chatResponse.language,
                          extractedEntities: chatResponse.entities
                        }
                      );
                    }
                  }
                }
                
                if (replyMessage) {
                  const sendResult = await sendWhatsAppReply(senderPhone, replyMessage, session);
                  
                  if (useDatabase && sendResult.success) {
                    await WhatsAppMessage.create({
                      waId: senderPhone,
                      phoneNumber: senderPhone,
                      direction: 'outgoing',
                      messageType: 'text',
                      content: replyMessage,
                      isRead: true,
                      metadata: { automated: true, simulated: sendResult.simulated }
                    });
                    
                    if (session) {
                      session.messageCount = (session.messageCount || 0) + 1;
                      session.lastMessageAt = new Date();
                      await session.save();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

app.get('/api/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'whitecaves_whatsapp_verify';
  if (mode === 'subscribe' && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

app.get('/api/whatsapp/session', isOwnerMiddleware, async (req, res) => {
  try {
    let session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) {
      session = await WhatsAppSession.create({
        userId: req.user?.uid || null,
        ownerEmail: OWNER_EMAIL,
        sessionId: `wa_${crypto.randomBytes(16).toString('hex')}`,
        connectionStatus: 'disconnected'
      });
    }
    res.json({
      sessionId: session.sessionId,
      connectionStatus: session.connectionStatus,
      phoneNumber: session.phoneNumber,
      businessName: session.businessName,
      connectedAt: session.connectedAt,
      lastMessageAt: session.lastMessageAt,
      messageCount: session.messageCount,
      autoReplyEnabled: session.autoReplyEnabled,
      chatbotEnabled: session.chatbotEnabled,
      businessHoursOnly: session.businessHoursOnly,
      businessHours: session.businessHours,
      welcomeMessage: session.welcomeMessage,
      awayMessage: session.awayMessage,
      quickReplies: session.quickReplies
    });
  } catch (error) {
    console.error('Error fetching WhatsApp session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

app.post('/api/whatsapp/connect', isOwnerMiddleware, async (req, res) => {
  try {
    const { connectionMethod } = req.body;
    let session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) {
      session = await WhatsAppSession.create({
        userId: req.user?.uid || null,
        ownerEmail: OWNER_EMAIL,
        sessionId: `wa_${crypto.randomBytes(16).toString('hex')}`,
        connectionStatus: 'connecting'
      });
    }
    if (connectionMethod === 'qr') {
      const qrData = `whatsapp://connect?session=${session.sessionId}&token=${crypto.randomBytes(32).toString('base64')}`;
      const qrExpiry = new Date(Date.now() + 5 * 60 * 1000);
      session.connectionStatus = 'qr_pending';
      session.lastQrCode = qrData;
      session.qrCodeExpiry = qrExpiry;
      await session.save();
      res.json({ success: true, connectionStatus: 'qr_pending', qrCode: qrData, qrExpiry, message: 'Scan the QR code with WhatsApp to connect' });
    } else if (connectionMethod === 'meta') {
      session.connectionStatus = 'connecting';
      await session.save();
      const metaAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.META_APP_ID || 'YOUR_META_APP_ID'}&redirect_uri=${encodeURIComponent(process.env.META_REDIRECT_URI || 'https://whitecaves.com/api/whatsapp/meta/callback')}&scope=whatsapp_business_management,whatsapp_business_messaging&response_type=code&state=${session.sessionId}`;
      res.json({ success: true, connectionStatus: 'connecting', authUrl: metaAuthUrl, message: 'Redirect to Meta to authenticate' });
    } else {
      res.status(400).json({ error: 'Invalid connection method' });
    }
  } catch (error) {
    console.error('Error initiating WhatsApp connection:', error);
    res.status(500).json({ error: 'Failed to initiate connection' });
  }
});

app.post('/api/whatsapp/disconnect', isOwnerMiddleware, async (req, res) => {
  try {
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) return res.status(404).json({ error: 'No session found' });
    session.connectionStatus = 'disconnected';
    session.lastQrCode = null;
    session.qrCodeExpiry = null;
    session.accessToken = null;
    session.refreshToken = null;
    session.connectedAt = null;
    await session.save();
    res.json({ success: true, message: 'WhatsApp disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting WhatsApp:', error);
    res.status(500).json({ error: 'Failed to disconnect' });
  }
});

app.put('/api/whatsapp/session/settings', isOwnerMiddleware, async (req, res) => {
  try {
    const { autoReplyEnabled, chatbotEnabled, businessHoursOnly, businessHours, welcomeMessage, awayMessage, quickReplies } = req.body;
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) return res.status(404).json({ error: 'No session found' });
    if (autoReplyEnabled !== undefined) session.autoReplyEnabled = autoReplyEnabled;
    if (chatbotEnabled !== undefined) session.chatbotEnabled = chatbotEnabled;
    if (businessHoursOnly !== undefined) session.businessHoursOnly = businessHoursOnly;
    if (businessHours) session.businessHours = { ...session.businessHours, ...businessHours };
    if (welcomeMessage) session.welcomeMessage = welcomeMessage;
    if (awayMessage) session.awayMessage = awayMessage;
    if (quickReplies) session.quickReplies = quickReplies;
    await session.save();
    res.json({ success: true, message: 'Settings updated successfully', settings: { autoReplyEnabled: session.autoReplyEnabled, chatbotEnabled: session.chatbotEnabled, businessHoursOnly: session.businessHoursOnly, businessHours: session.businessHours, welcomeMessage: session.welcomeMessage, awayMessage: session.awayMessage, quickReplies: session.quickReplies } });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

app.get('/api/whatsapp/qr/refresh', isOwnerMiddleware, async (req, res) => {
  try {
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) return res.status(404).json({ error: 'No session found' });
    const qrData = `whatsapp://connect?session=${session.sessionId}&token=${crypto.randomBytes(32).toString('base64')}&t=${Date.now()}`;
    const qrExpiry = new Date(Date.now() + 5 * 60 * 1000);
    session.connectionStatus = 'qr_pending';
    session.lastQrCode = qrData;
    session.qrCodeExpiry = qrExpiry;
    await session.save();
    res.json({ success: true, qrCode: qrData, qrExpiry });
  } catch (error) {
    console.error('Error refreshing QR code:', error);
    res.status(500).json({ error: 'Failed to refresh QR code' });
  }
});

app.post('/api/whatsapp/simulate/connect', isOwnerMiddleware, async (req, res) => {
  try {
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) return res.status(404).json({ error: 'No session found' });
    session.connectionStatus = 'connected';
    session.phoneNumber = '+971 56 361 6136';
    session.connectedAt = new Date();
    await session.save();
    res.json({ success: true, connectionStatus: 'connected', phoneNumber: session.phoneNumber, connectedAt: session.connectedAt });
  } catch (error) {
    console.error('Error simulating connection:', error);
    res.status(500).json({ error: 'Failed to simulate connection' });
  }
});

app.get('/api/whatsapp/meta/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) return res.redirect('/owner/whatsapp/settings?error=missing_params');
    const session = await WhatsAppSession.findOne({ sessionId: state });
    if (!session) return res.redirect('/owner/whatsapp/settings?error=invalid_session');
    session.connectionStatus = 'connected';
    session.connectedAt = new Date();
    session.phoneNumber = '+971 56 361 6136';
    await session.save();
    res.redirect('/owner/whatsapp/settings?success=connected');
  } catch (error) {
    console.error('Meta callback error:', error);
    res.redirect('/owner/whatsapp/settings?error=callback_failed');
  }
});

app.post('/api/whatsapp/chatbot/test', isOwnerMiddleware, async (req, res) => {
  try {
    const { message, conversationId = 'test_conversation' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    
    const result = chatbotService.processMessage(message, conversationId);
    const leadScore = chatbotService.calculateLeadScore(conversationId);
    
    res.json({
      success: true,
      input: message,
      response: result.response,
      intent: result.intent,
      confidence: Math.round(result.confidence * 100),
      language: result.language,
      entities: result.entities,
      suggestedActions: result.suggestedActions,
      leadScore
    });
  } catch (error) {
    console.error('Chatbot test error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.post('/api/whatsapp/chatbot/clear-context', isOwnerMiddleware, (req, res) => {
  const { conversationId = 'test_conversation' } = req.body;
  chatbotService.clearContext(conversationId);
  res.json({ success: true, message: 'Conversation context cleared' });
});

app.post('/api/whatsapp/simulate/message', isOwnerMiddleware, async (req, res) => {
  try {
    const { from, message } = req.body;
    if (!from || !message) return res.status(400).json({ error: 'from and message are required' });
    
    const webhookPayload = {
      entry: [{
        changes: [{
          value: {
            messages: [{
              from: from,
              type: 'text',
              text: { body: message }
            }]
          }
        }]
      }]
    };
    
    const response = await fetch(`http://localhost:${PORT}/api/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });
    
    res.json({ success: true, message: 'Simulated message sent to webhook', webhookResponse: response.status });
  } catch (error) {
    console.error('Simulate message error:', error);
    res.status(500).json({ error: 'Failed to simulate message' });
  }
});

function generateContractHtml(data) {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `AED ${Number(amount).toLocaleString()}`;
  };

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ejari Unified Tenancy Contract - ${data.contractNumber}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 30px; color: #333; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #D4AF37; padding-bottom: 20px; margin-bottom: 25px; }
    .logo h2 { color: #1a1a2e; margin: 0; font-size: 24px; }
    .logo p { color: #666; margin: 5px 0 0; font-size: 13px; }
    .contract-meta { text-align: right; }
    .contract-number { color: #666; font-size: 13px; margin-bottom: 5px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 15px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .status.fully_signed { background: #d4edda; color: #155724; }
    .status.partially_signed { background: #fff3cd; color: #856404; }
    .status.draft { background: #e9ecef; color: #495057; }
    h1 { text-align: center; margin: 20px 0 5px; font-size: 22px; color: #1a1a2e; }
    .subtitle { text-align: center; color: #666; margin-bottom: 25px; font-size: 14px; }
    .section { background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .section-title { display: flex; justify-content: space-between; color: #D4AF37; font-size: 14px; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .field { background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 10px 12px; }
    .field-label { display: flex; justify-content: space-between; font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 4px; }
    .field-value { font-size: 14px; font-weight: 500; color: #333; min-height: 20px; }
    .signatures-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 15px; }
    .sig-box { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; text-align: center; }
    .sig-box h4 { color: #666; margin: 0 0 15px; font-size: 13px; }
    .sig-content { min-height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .sig-box img { max-width: 180px; max-height: 70px; }
    .sig-name { font-weight: 600; margin-top: 10px; font-size: 14px; }
    .sig-date { font-size: 11px; color: #888; margin-top: 4px; }
    .pending { color: #999; font-style: italic; font-size: 13px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; }
    .footer p { margin: 5px 0; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo"><h2>White Caves Real Estate LLC</h2><p>Licensed Real Estate Brokerage - Dubai, UAE</p></div>
    <div class="contract-meta"><div class="contract-number">Contract #${data.contractNumber}</div><span class="status ${data.status}">${(data.status || 'draft').replace('_', ' ')}</span></div>
  </div>
  <h1>EJARI UNIFIED TENANCY CONTRACT</h1>
  <p class="subtitle">عقد الإيجار الموحد - إيجاري</p>
  <div class="section">
    <div class="section-title"><span>Owner / Lessor Information</span><span>معلومات المالك / المؤجر</span></div>
    <div class="grid">
      <div class="field"><div class="field-label"><span>Owner's Name</span></div><div class="field-value">${data.ownerName || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Lessor's Name</span></div><div class="field-value">${data.lessorName || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Emirates ID</span></div><div class="field-value">${data.lessorEmiratesId || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Email</span></div><div class="field-value">${data.lessorEmail || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Phone</span></div><div class="field-value">${data.lessorPhone || '-'}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title"><span>Tenant Information</span><span>معلومات المستأجر</span></div>
    <div class="grid">
      <div class="field"><div class="field-label"><span>Tenant's Name</span></div><div class="field-value">${data.tenantName || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Emirates ID</span></div><div class="field-value">${data.tenantEmiratesId || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Email</span></div><div class="field-value">${data.tenantEmail || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Phone</span></div><div class="field-value">${data.tenantPhone || '-'}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title"><span>Property Information</span><span>معلومات العقار</span></div>
    <div class="grid">
      <div class="field"><div class="field-label"><span>Property Usage</span></div><div class="field-value">${data.propertyUsage || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Building Name</span></div><div class="field-value">${data.buildingName || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Property Type</span></div><div class="field-value">${data.propertyType || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Location</span></div><div class="field-value">${data.location || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Property Area</span></div><div class="field-value">${data.propertyArea ? data.propertyArea + ' sq.m' : '-'}</div></div>
      <div class="field"><div class="field-label"><span>DEWA Premises No.</span></div><div class="field-value">${data.premisesNo || '-'}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title"><span>Contract Information</span><span>معلومات العقد</span></div>
    <div class="grid">
      <div class="field"><div class="field-label"><span>Contract Period</span></div><div class="field-value">${formatDate(data.contractPeriodFrom)} - ${formatDate(data.contractPeriodTo)}</div></div>
      <div class="field"><div class="field-label"><span>Annual Rent</span></div><div class="field-value">${formatCurrency(data.annualRent)}</div></div>
      <div class="field"><div class="field-label"><span>Security Deposit</span></div><div class="field-value">${formatCurrency(data.securityDeposit)}</div></div>
      <div class="field"><div class="field-label"><span>Payment Mode</span></div><div class="field-value">${data.modeOfPayment || '-'}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title"><span>Signatures</span><span>التوقيعات</span></div>
    <div class="signatures-grid">
      <div class="sig-box"><h4>Tenant | المستأجر</h4><div class="sig-content">${data.signatures?.tenant ? `<img src="${data.signatures.tenant.signature}" alt="Signature" /><div class="sig-name">${data.signatures.tenant.signerName || data.tenantName}</div><div class="sig-date">${formatDate(data.signatures.tenant.signedAt)}</div>` : '<div class="pending">Pending</div>'}</div></div>
      <div class="sig-box"><h4>Lessor | المؤجر</h4><div class="sig-content">${data.signatures?.lessor ? `<img src="${data.signatures.lessor.signature}" alt="Signature" /><div class="sig-name">${data.signatures.lessor.signerName || data.lessorName}</div><div class="sig-date">${formatDate(data.signatures.lessor.signedAt)}</div>` : '<div class="pending">Pending</div>'}</div></div>
    </div>
    <div style="margin-top:15px;"><div class="sig-box"><h4>Broker | الوسيط</h4><div class="sig-content">${data.signatures?.broker ? `<img src="${data.signatures.broker.signature}" alt="Signature" /><div class="sig-name">${data.signatures.broker.signerName || data.brokerName}</div><div class="sig-date">${formatDate(data.signatures.broker.signedAt)}</div>` : '<div class="pending">Pending</div>'}</div></div></div>
  </div>
  <div class="footer"><p><strong>White Caves Real Estate LLC</strong></p><p>admin@whitecaves.com | Dubai, UAE</p><p>Generated on ${formatDate(new Date())}</p></div>
</body>
</html>`;
}

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
