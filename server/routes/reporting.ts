import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import {
  getDashboardConfig,
  getDashboardPreferences,
  updateDashboardPreferences,
  getDashboardSummary,
  getDashboardActivities,
  getCacheStats,
  getExecutiveAnalytics,
  getKpiMetrics,
  getLeadFunnel,
  getTrends,
  getPropertyAging,
  getAgentPerformance,
  exportAgentPerformance,
  getAgentPerformanceExportJob,
  getLeasingDashboard,
  exportLeadsExcel,
  exportPropertiesExcel,
  exportPlExcel,
  getKpiBaseline,
  exportCommissionsExcel,
  exportPnlPdf,
} from '../controllers/reporting/index.js';

const router = Router();

// ─── Dashboard Configuration & Preferences ──────────────────────────────────
router.get('/config', requirePermission('view_analytics'), asyncHandler(getDashboardConfig));
router.get('/preferences', requirePermission('view_analytics'), asyncHandler(getDashboardPreferences));
router.put('/preferences', requirePermission('view_analytics'), asyncHandler(updateDashboardPreferences));

// ─── Executive Summary & Global Activities ───────────────────────────────────
router.get(['/summary', '/overview', '/admin/summary', '/:role/summary'], requirePermission('view_analytics'), asyncHandler(getDashboardSummary));
router.get('/activities', requirePermission('view_all_reports'), asyncHandler(getDashboardActivities));

// ─── Strategic Analytics & KPI Metrics ───────────────────────────────────────
router.get('/executive', requirePermission('view_all_reports'), asyncHandler(getExecutiveAnalytics));
router.get('/kpis', requirePermission('view_analytics'), asyncHandler(getKpiMetrics));
router.get('/lead-funnel', requirePermission('view_analytics'), asyncHandler(getLeadFunnel));
router.get('/trends', requirePermission('view_analytics'), asyncHandler(getTrends));

// ─── Property Aging & Agent Performance ──────────────────────────────────────
router.get('/property-aging', requirePermission('view_analytics'), asyncHandler(getPropertyAging));
router.get('/agent-performance', requirePermission('view_analytics'), asyncHandler(getAgentPerformance));
router.post('/agent-performance/export', requirePermission('view_analytics'), asyncHandler(exportAgentPerformance));
router.get('/agent-performance/export/:jobId', requirePermission('view_analytics'), asyncHandler(getAgentPerformanceExportJob));

// ─── Leasing & Financial Exports ─────────────────────────────────────────────
router.get('/leasing', requirePermission('view_analytics'), asyncHandler(getLeasingDashboard));
router.get('/leads/excel', requirePermission('view_all_reports'), asyncHandler(exportLeadsExcel));
router.get('/properties/excel', requirePermission('view_all_reports'), asyncHandler(exportPropertiesExcel));
router.get('/pl/excel', requirePermission('view_all_reports'), asyncHandler(exportPlExcel));
router.get('/analytics/kpi-baseline', requirePermission('view_analytics'), asyncHandler(getKpiBaseline));
router.get('/reports/financial/commissions/export', requirePermission('export_financial_reports'), asyncHandler(exportCommissionsExcel));
router.get('/reports/financial/pnl/pdf', requirePermission('export_financial_reports'), asyncHandler(exportPnlPdf));

// ─── Cache Observability ─────────────────────────────────────────────────────
router.get('/cache-stats', requirePermission('view_analytics'), asyncHandler(getCacheStats));

export default router;
