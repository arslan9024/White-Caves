import type { Express } from 'express';
import { DynamicPricingEngine } from '../../src/services/DynamicPricingEngine.js';
import { pricingResponse, pricingRequest } from './engineResponses.config.js';
import { respondFailure } from './responses.js';
const pricingEngine = new DynamicPricingEngine();
export function mountPricing(app: Express): void {
  app.post('/api/services/pricing/calculate', async (req, res) => {
    try {
      const { serviceType, clientData, propertyData, contextData } = pricingRequest.parse(req.body);

      const pricing = pricingResponse.parse(
        pricingEngine.calculatePrice({ serviceType }, clientData, propertyData, contextData)
      );

      res.json({
        success: true,
        pricing,
        message: `Dynamic pricing calculated: ${pricing.finalRate * 100}% with ${pricing.metadata.propertyRarity} property multiplier`,
      });
    } catch (error) {
      respondFailure(res, error, 'pricing.calculate', 400);
    }
  });
  app.post('/api/services/pricing/compare', async (req, res) => {
    try {
      const { serviceType, propertyValue, clientTier, transactionCount } = req.body;

      const comparison = pricingEngine.comparePricing(
        serviceType,
        propertyValue,
        clientTier,
        transactionCount
      );

      res.json({
        success: true,
        comparison,
        savings: comparison.isIncrease ? 'Premium applied' : 'Loyalty discount applied',
        transparencyNote: 'Client sees exact breakdown of pricing factors',
      });
    } catch (error) {
      respondFailure(res, error, 'pricing.compare', 400);
    }
  });
}
