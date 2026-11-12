import type { Express } from 'express';
import { LeadScoringEngine } from '../../src/services/LeadScoringEngine.js';
import { leadScoreResponse, requestObject } from './engineResponses.config.js';
import { notImplemented, respondFailure } from './responses.js';
const scoringEngine = new LeadScoringEngine();
export function mountLeadScoring(app: Express): void {
  app.post('/api/leads/:leadId/score', async (req, res) => {
    try {
      const { leadId } = req.params;
      const lead = requestObject.parse(req.body);

      const scoreResult = leadScoreResponse.parse(scoringEngine.scoreLeadQuality(lead));

      res.json({
        success: true,
        leadId,
        score: scoreResult.overallScore,
        grade: scoreResult.scoreGrade,
        conversionProbability: scoreResult.conversionProbability,
        recommendedAction: scoreResult.recommendedAction,
        breakdown: scoreResult.components,
      });
    } catch (error) {
      respondFailure(res, error, 'leads.score', 400);
    }
  });
  app.get('/api/leads/scoring/analytics', notImplemented('Lead scoring analytics', '/api/leads'));
}
