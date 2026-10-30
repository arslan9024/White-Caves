import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission, requireMinRole } from '../middleware/rbac.js';
import {
  getComplianceStatus,
  getRequirements,
  getAuditLogs,
  generateComplianceReport,
  getVatSummary,
  getQueuesOverview,
  getComplianceOverview,
  getBrnExpiry,
  checkBrn,
  getBrnCheckHistory,
  getPermitAlertsHandler,
  getPermitsList,
  runPermitEnforcement,
  getEnforcementHistory,
  updatePropertyPermit,
  uploadKycDocument,
  getLeadKycDocuments,
  getKycReviewQueue,
  reviewKycDocument,
  screenAml,
  getAmlAlerts,
  resolveAmlAlert,
  recordConsent,
  revokeConsent,
  exportConsents,
  deleteConsentRecord,
  exportEjariData,
  updateEjariCertificate,
  registerOqood,
  activateEjari,
  renewEjari,
  getDldHealth,
} from '../controllers/compliance/index.js';

const router = Router();

// ─── Status, Requirements & Reports ──────────────────────────────────────────
router.get('/status', requirePermission('view_analytics'), asyncHandler(getComplianceStatus));
router.get('/requirements', requirePermission('view_analytics'), asyncHandler(getRequirements));
router.get('/audit-logs', requirePermission('view_audit_log'), asyncHandler(getAuditLogs));
router.post('/reports', requireMinRole('admin'), asyncHandler(generateComplianceReport));
router.get('/vat-summary', requirePermission('view_analytics'), asyncHandler(getVatSummary));
router.get('/queues', requireMinRole('manager'), asyncHandler(getQueuesOverview));
router.get('/overview', requirePermission('view_analytics'), asyncHandler(getComplianceOverview));

// ─── BRN & Permits ───────────────────────────────────────────────────────────
router.get('/brn-expiry', requireMinRole('agent'), asyncHandler(getBrnExpiry));
router.post('/brn-check', requireMinRole('agent'), asyncHandler(checkBrn));
router.get('/brn-check/history', requireMinRole('agent'), asyncHandler(getBrnCheckHistory));
router.get('/permit-alerts', requirePermission('view_analytics'), asyncHandler(getPermitAlertsHandler));
router.get('/permits', requireMinRole('agent'), asyncHandler(getPermitsList));
router.post('/permits/enforcement-run', requireMinRole('manager'), asyncHandler(runPermitEnforcement));
router.get('/permits/enforcement-history', requireMinRole('manager'), asyncHandler(getEnforcementHistory));
router.patch('/permits/:propertyId', requireMinRole('manager'), asyncHandler(updatePropertyPermit));

// ─── KYC Verification ────────────────────────────────────────────────────────
router.post('/kyc/:leadId/documents', requireMinRole('agent'), asyncHandler(uploadKycDocument));
router.get('/kyc/:leadId/documents', requireMinRole('agent'), asyncHandler(getLeadKycDocuments));
router.get('/kyc/review-queue', requireMinRole('manager'), asyncHandler(getKycReviewQueue));
router.patch('/kyc/documents/:documentId/review', requireMinRole('manager'), asyncHandler(reviewKycDocument));

// ─── AML Screening ───────────────────────────────────────────────────────────
router.post('/aml/screen', requireMinRole('agent'), asyncHandler(screenAml));
router.get('/aml/alerts', requireMinRole('manager'), asyncHandler(getAmlAlerts));
router.patch('/aml/alerts/:alertId/resolve', requireMinRole('manager'), asyncHandler(resolveAmlAlert));

// ─── GDPR / UAE PDPL Consent ─────────────────────────────────────────────────
router.post('/consent', requireMinRole('agent'), asyncHandler(recordConsent));
router.patch('/consent/:consentId/revoke', requireMinRole('agent'), asyncHandler(revokeConsent));
router.get('/consent/export', requireMinRole('manager'), asyncHandler(exportConsents));
router.delete('/consent/:consentId', requireMinRole('manager'), asyncHandler(deleteConsentRecord));

// ─── Ejari & DLD Integration ─────────────────────────────────────────────────
router.get('/ejari-export', requirePermission('view_analytics'), asyncHandler(exportEjariData));
router.patch('/ejari/:leaseId', requireMinRole('agent'), asyncHandler(updateEjariCertificate));
router.post('/dld/register-oqood', requireMinRole('agent'), asyncHandler(registerOqood));
router.post('/ejari/activate', requireMinRole('agent'), asyncHandler(activateEjari));
router.post('/ejari/renew', requireMinRole('agent'), asyncHandler(renewEjari));
router.get('/dld/health', asyncHandler(getDldHealth));

export default router;
