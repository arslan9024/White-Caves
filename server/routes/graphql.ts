import { Router, Request, Response } from 'express';
import { resolvers } from '../graphql/schema.js';
import logger from '../utils/logger.js';

const router = Router();

/**
 * Lightweight GraphQL compatibility gateway
 * Serves components requesting /graphql or /api/graphql without heavyweight Apollo dependencies
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { query, variables } = req.body || {};
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ errors: [{ message: 'GraphQL query is required' }] });
    }

    const data: Record<string, unknown> = {};

    if (query.includes('calculateReraCommercialRent')) {
      const zone = variables?.zone || 'Business Bay - Commercial Office';
      const currentRentAed = Number(variables?.currentRentAed) || 1;
      data.calculateReraCommercialRent = await resolvers.Query.calculateReraCommercialRent(
        null,
        { zone, currentRentAed }
      );
    }

    if (query.includes('generateVatInvoice')) {
      const amount = Number(variables?.amount) || 0;
      const isExempt = Boolean(variables?.isExempt);
      data.generateVatInvoice = await resolvers.Query.generateVatInvoice(
        null,
        { amount, isExempt }
      );
    }

    if (query.includes('postDatedCheques')) {
      const status = variables?.status;
      data.postDatedCheques = await resolvers.Query.postDatedCheques(
        null,
        { status }
      );
    }

    if (query.includes('pdcDashboard') || query.includes('pdcAnalytics')) {
      const result = await resolvers.Query.pdcDashboard();
      data.pdcDashboard = result;
      data.pdcAnalytics = result;
    }

    if (query.includes('health')) {
      data.health = resolvers.Query.health();
    }

    return res.status(200).json({ data });
  } catch (error: any) {
    logger.error('GraphQL route handler error:', error);
    return res.status(500).json({ errors: [{ message: error.message || 'Internal GraphQL error' }] });
  }
});

export default router;
