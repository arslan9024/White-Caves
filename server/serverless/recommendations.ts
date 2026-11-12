import type { Express } from 'express';
import { ServiceRecommendationEngine } from '../../src/services/ServiceRecommendationEngine.js';
const recommendationEngine = new ServiceRecommendationEngine();
import { readStringQuery } from './query.js';
import { notImplemented, respondFailure } from './responses.js';
import { requestObject } from './engineResponses.config.js';
export function mountRecommendations(app: Express): void {
  app.post('/api/customers/:customerId/recommendations', async (req, res) => {
    const query = readStringQuery(req.query);
    try {
      const { customerId } = req.params;
      const { limit } = query;

      const customerData = requestObject.parse(req.body);

      const recommendations = recommendationEngine.getRecommendations(customerData, {
        limit: limit || 5,
      });

      res.json({
        success: true,
        customerId,
        recommendations: recommendations.recommendations,
        estimatedRevenue: recommendations.estimatedAdditionalRevenue,
        message: `${recommendations.recommendations.length} service recommendations for ${customerData.tier} tier customer`,
      });
    } catch (error) {
      respondFailure(res, error, 'recommendations.list', 400);
    }
  });
  app.post(
    '/api/recommendations/:recId/outcome',
    notImplemented('Recommendation outcome persistence', '/api/recommendations')
  );
}
