
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
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

// Connect to MongoDB in background (non-blocking)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
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
  console.warn('WARNING: MONGODB_URI not set. Database features will not work.');
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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
} else {
  app.use(notFound);
}

app.use(errorHandler);

// Use port 3000 for production deployment, 3000 for development backend
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
