/**
 * index.js — Recruitment router composition & public API
 * Mounts domain sub-routers in the original recruitment.js definition
 * order so Express route-matching semantics are preserved exactly.
 */
import express from 'express';
import candidatesRouter from './candidates.routes.js';
import jobsRouter from './jobs.routes.js';
import applicationsRouter from './applications.routes.js';
import screeningScoringRouter from './screening-scoring.routes.js';
import screeningReviewRouter from './screening-review.routes.js';
import screeningInsightsRouter from './screening-insights.routes.js';
import overviewRouter from './overview.routes.js';
import whatsappRouter from './whatsapp.routes.js';
import offersRouter from './offers.routes.js';
import interviewsRouter from './interviews.routes.js';
import leadScoringRouter from './lead-scoring.routes.js';
import leadsRouter from './leads.routes.js';

export { __setRecruitmentTestDeps, __resetRecruitmentTestDeps } from './recruitment.context.js';
export { requireRecruitmentAccess, requireManagerReviewAccess } from './recruitment.access.js';
export {
  computeScreeningMetrics,
  buildRecruitmentOverview,
  buildKpiTrends,
  buildKpiTrendExportRows,
  toCsv,
  buildOnboardingChecklist,
} from './recruitment.metrics.js';

const router = express.Router();

router.use(candidatesRouter);
router.use(jobsRouter);
router.use(applicationsRouter);
router.use(screeningScoringRouter);
router.use(screeningReviewRouter);
router.use(screeningInsightsRouter);
router.use(overviewRouter);
router.use(whatsappRouter);
router.use(offersRouter);
router.use(interviewsRouter);
router.use(leadScoringRouter);
router.use(leadsRouter);

export default router;
