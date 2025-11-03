
import express from 'express';
import Stripe from 'stripe';
const router = express.Router();

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
} else {
  console.warn('STRIPE_SECRET_KEY not found. Payment processing will not work until this is set.');
}

router.post('/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ 
        error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' 
      });
    }

    const { amount, propertyId, propertyTitle } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: {
        propertyId: propertyId || 'N/A',
        propertyTitle: propertyTitle || 'Property Purchase',
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Error creating payment intent: ' + error.message 
    });
  }
});

router.post('/payment-success', async (req, res) => {
  try {
    const { paymentIntentId, propertyId, userId } = req.body;
    
    res.json({ 
      success: true,
      message: 'Payment processed successfully',
      paymentIntentId 
    });
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({ error: 'Error processing payment success' });
  }
});

export default router;
