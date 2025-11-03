
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import usersRouter from './routes/users.js';
import propertiesRouter from './routes/properties.js';
import appointmentsRouter from './routes/appointments.js';
import paymentsRouter from './routes/payments.js';
import tenancyAgreementsRouter from './routes/tenancyAgreements.js';

const app = express();

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
} else {
  console.warn('WARNING: MONGODB_URI not set. Database features will not work.');
}

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/properties', propertiesRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/tenancy-agreements', tenancyAgreementsRouter);

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
