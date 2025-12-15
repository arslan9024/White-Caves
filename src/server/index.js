
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import usersRouter from './routes/users.js';
import propertiesRouter from './routes/properties.js';
import appointmentsRouter from './routes/appointments.js';
import paymentsRouter from './routes/payments.js';
import tenancyAgreementsRouter from './routes/tenancyAgreements.js';
import favoritesRouter from './routes/favorites.js';
import savedSearchesRouter from './routes/savedSearches.js';
import alertsRouter from './routes/alerts.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

let isMongoDBConnected = false;

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
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

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/users', usersRouter);
app.use('/api/properties', propertiesRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/tenancy-agreements', tenancyAgreementsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/saved-searches', savedSearchesRouter);
app.use('/api/alerts', alertsRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
