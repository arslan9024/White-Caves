import logger from '../../utils/logger.js';
import { scoreLead } from './leadScoringEngine.js';

/**
 * Fire-and-forget lead re-scoring helper for lifecycle events.
 * Never throws into request handlers.
 */
export function triggerLeadRescore(
  leadId: string | null | undefined,
  context: string
): void {
  if (!leadId) return;

  Promise.resolve(scoreLead(leadId))
    .then(result => {
      if (result.changed) {
        logger.info('Lead auto-rescored', {
          leadId,
          context,
          previousScore: result.previousScore,
          newScore: result.newScore,
          previousTier: result.previousTier,
          newTier: result.newTier,
        });
      }
    })
    .catch(error => {
      logger.warn('Lead auto-rescore failed', {
        leadId,
        context,
        error: error instanceof Error ? error.message : String(error),
      });
    });
}

export default triggerLeadRescore;
