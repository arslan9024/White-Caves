
import express from 'express';
import Stripe from 'stripe';
import { ConfigurationError, PaymentError, ValidationError } from '../../utils/errors.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateAmount, validateRequired } from '../middleware/validation.js';

const router = express.Router();

let stripe;
const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;

if (isStripeConfigured) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
} else {
  console.warn('STRIPE_SECRET_KEY not found. Payment processing will not work until this is set.');
}

const checkStripeConfig = (req, res, next) => {
  if (!isStripeConfigured || !stripe) {
    throw new ConfigurationError('Payment processing is currently unavailable. Please contact support.');
  }
  next();
};

router.post('/create-payment-intent', checkStripeConfig, asyncHandler(async (req, res) => {
  const { amount, propertyId, propertyTitle } = req.body;

  validateRequired(amount, 'amount');
  validateAmount(amount);
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: {
        propertyId: propertyId || 'N/A',
        propertyTitle: propertyTitle || 'Property Purchase',
      },
    });

    res.json({ 
      success: true,
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    throw new PaymentError(error.message || 'Payment processing failed');
  }
}));

router.post('/payment-success', asyncHandler(async (req, res) => {
  const { paymentIntentId, propertyId, userId } = req.body;
  
  validateRequired(paymentIntentId, 'paymentIntentId');
  
  res.json({ 
    success: true,
    message: 'Payment processed successfully',
    paymentIntentId 
  });
}));

router.get('/status', (req, res) => {
  res.json({
    configured: isStripeConfigured,
    message: isStripeConfigured 
      ? 'Payment processing is available' 
      : 'Payment processing is not configured'
  });
});

export default router;
