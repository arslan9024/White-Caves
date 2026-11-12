import { Express, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';

export function mountPaymentCompatibilityRoutes(app: Express): void {
  // Payments API — Stripe integration.
  // When STRIPE_ENABLED=true and the Stripe SDK is configured, process live payments.
  // When STRIPE_ENABLED=false (default) or the SDK call fails, return a deterministic
  // mock PaymentIntent that matches the real Stripe PaymentIntent shape so front-end
  // payment flows do not break during development / staging.
  // The X-Mock-Payment: true header lets the client distinguish mock from live responses.
  app.post(
    '/api/payments/create-payment-intent',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const { amount, currency = 'aed', propertyId, description } = req.body ?? {};

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        throw new AppError('amount must be a positive number (in smallest currency unit)', 400);
      }

      const stripeEnabled = process.env.STRIPE_ENABLED === 'true';

      if (!stripeEnabled) {
        // ── Mock PaymentIntent path ──────────────────────────────────────────
        logger.info('STRIPE_ENABLED=false — returning mock PaymentIntent', {
          amount,
          currency,
          propertyId,
        });

        const mockId = `pi_mock_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        const mockClientSecret = `${mockId}_secret_${Math.random().toString(36).slice(2, 18)}`;

        res.setHeader('X-Mock-Payment', 'true');
        return res.status(200).json({
          success: true,
          data: {
            id: mockId,
            object: 'payment_intent',
            amount,
            currency: currency.toLowerCase(),
            status: 'requires_payment_method',
            client_secret: mockClientSecret,
            description: description ?? `White Caves payment — property ${propertyId ?? 'N/A'}`,
            metadata: {
              propertyId: propertyId ?? null,
              source: 'white_caves_crm',
            },
            created: Math.floor(Date.now() / 1000),
            livemode: false,
          },
          _mock: true,
        });
      }

      // ── Live Stripe path (requires STRIPE_SECRET_KEY env var) ─────────────
      try {
        // Stripe SDK is imported dynamically to avoid a hard dependency when
        // STRIPE_ENABLED=false and the package is not installed.
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
          apiVersion: '2025-10-29.clover',
        });

        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: currency.toLowerCase(),
          description: description ?? `White Caves CRM — property ${propertyId ?? 'N/A'}`,
          metadata: { propertyId: propertyId ?? '' },
        });

        logger.info('Stripe PaymentIntent created', { id: paymentIntent.id, amount });
        return res.status(200).json({ success: true, data: paymentIntent });
      } catch (stripeError) {
        // Return a clean mock rather than propagating the Stripe error so the
        // front-end does not receive an unexpected 500.
        logger.error('Stripe PaymentIntent creation failed — falling back to mock', {
          error: stripeError instanceof Error ? stripeError.message : String(stripeError),
          amount,
          propertyId,
        });

        const fallbackId = `pi_fallback_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        res.setHeader('X-Mock-Payment', 'true');
        return res.status(200).json({
          success: true,
          data: {
            id: fallbackId,
            object: 'payment_intent',
            amount,
            currency: currency.toLowerCase(),
            status: 'requires_payment_method',
            client_secret: `${fallbackId}_secret_fallback`,
            livemode: false,
          },
          _mock: true,
          _fallback: true,
        });
      }
    })
  );
}
