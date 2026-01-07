
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import './config/firebaseAdmin.js';
import usersRouter from './routes/users.js';
import propertiesRouter from './routes/properties.js';
import appointmentsRouter from './routes/appointments.js';
import paymentsRouter from './routes/payments.js';
import tenancyAgreementsRouter from './routes/tenancyAgreements.js';
import favoritesRouter from './routes/favorites.js';
import savedSearchesRouter from './routes/savedSearches.js';
import alertsRouter from './routes/alerts.js';
import authRouter from './routes/auth.js';
import recommendationsRouter from './routes/recommendations.js';
import dashboardRouter from './routes/dashboard.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

let isMongoDBConnected = false;

// Health check endpoint - responds immediately without waiting for DB
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.use(cors());

// Build MongoDB URI from credentials or use direct URI
let mongoURI = process.env.MONGODB_URI;
if (process.env.DB_PASSWORD) {
  mongoURI = `mongodb+srv://arslanmalikgoraha_db_user:${encodeURIComponent(process.env.DB_PASSWORD)}@whitecavesdb.opetsag.mongodb.net/whitecaves?retryWrites=true&w=majority&appName=WhiteCavesDB`;
}

// Connect to MongoDB in background (non-blocking)
if (mongoURI) {
  mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }).then(() => {
    isMongoDBConnected = true;
    console.log('✓ Connected to MongoDB');
  }).catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
    console.warn('Database features will be unavailable');
  });
} else {
  console.warn('WARNING: MongoDB credentials not set. Database features will not work.');
}

export { isMongoDBConnected };
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/properties', propertiesRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/tenancy-agreements', tenancyAgreementsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/saved-searches', savedSearchesRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/dashboard', dashboardRouter);

// Try multiple possible dist paths
const possiblePaths = [
  path.resolve(__dirname, '../../dist'),
  path.join(process.cwd(), 'dist'),
  '/home/runner/workspace/dist'
];

let distPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    distPath = p;
    console.log('✓ Found dist folder at:', p);
    try {
      console.log('dist contents:', fs.readdirSync(p));
    } catch (e) {}
    break;
  }
}

if (distPath) {
  // Serve static files from dist
  app.use(express.static(distPath, { 
    index: 'index.html',
    maxAge: '1d'
  }));
  
  // Serve index.html for all non-API routes (SPA routing)
  app.use((req, res, next) => {
    // Skip API routes and health check
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
} else {
  console.warn('⚠ dist folder not found - frontend will not be served');
}

// Error handlers (only for API routes)
app.use('/api', notFound);
app.use('/api', errorHandler);

// Always use port 5000 for Replit deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
