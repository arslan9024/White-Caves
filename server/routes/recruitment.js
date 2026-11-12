/**
 * recruitment.js — Backwards-compatible entry point
 * Implementation decomposed into ./recruitment/ domain modules
 * (Single Purpose File Law). Public API is unchanged.
 */
export { default } from './recruitment/index.js';
export {
  __setRecruitmentTestDeps,
  __resetRecruitmentTestDeps,
  requireRecruitmentAccess,
  requireManagerReviewAccess,
  computeScreeningMetrics,
  buildRecruitmentOverview,
  buildKpiTrends,
  buildKpiTrendExportRows,
  toCsv,
  buildOnboardingChecklist,
} from './recruitment/index.js';
