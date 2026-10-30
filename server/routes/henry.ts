import { Router } from 'express';
import { requireMinRole } from '../middleware/rbac.js';
import dossierRouter from './henry.dossiers.js';
import driveRouter from './henry.drive.js';
import {
  checkCompliance,
  createRecord,
  deleteDocumentHandler,
  deleteRecord,
  draftAi,
  extractAiFields,
  getComplianceSummaryHandler,
  getDocumentLinkOptions,
  getEventLog,
  getHealth,
  getLatestDocumentByType,
  getRecords,
  ocrEmiratesId,
  patchDocument,
  patchDocumentReminder,
  recordUpload,
  saveDocument,
  searchDocuments,
  serveDocumentOrDownload,
  serveRecordFile,
  signRecord,
  sourceUpload,
  submitEjari,
  translateAi,
  triggerOrchestrator,
  uploadRecordFile,
} from '../controllers/henry/index.js';

const router = Router();

// Sub-routers
router.use('/drive', driveRouter);

// Health check
router.get('/health', getHealth);

// Record Management
router.get('/records', requireMinRole('agent'), getRecords);
router.post('/records', requireMinRole('agent'), createRecord);
router.delete('/records/:id', requireMinRole('agent'), deleteRecord);
router.post('/records/file', requireMinRole('agent'), recordUpload.single('pdf'), uploadRecordFile);
router.post('/records/:id/sign', requireMinRole('agent'), signRecord);
router.get('/records/file', requireMinRole('agent'), serveRecordFile);

// Compliance & AI Endpoints
router.post('/compliance/check', requireMinRole('agent'), checkCompliance);
router.get('/compliance/summary', requireMinRole('agent'), getComplianceSummaryHandler);
router.post('/ocr/emirates-id', requireMinRole('agent'), ocrEmiratesId);
router.post('/ai/extract', requireMinRole('agent'), extractAiFields);
router.post('/orchestrator-trigger', requireMinRole('agent'), triggerOrchestrator);
router.get('/event-log', requireMinRole('agent'), getEventLog);
router.post('/ai-draft', requireMinRole('agent'), draftAi);
router.post('/ejari-submit', requireMinRole('agent'), submitEjari);
router.post('/translate', requireMinRole('agent'), translateAi);

// Documents Hub & Vault
router.use('/documents', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
router.use('/documents', dossierRouter);

router.post(
  '/documents/save',
  requireMinRole('agent'),
  sourceUpload.array('source', 2),
  saveDocument
);
router.get('/documents', requireMinRole('agent'), searchDocuments);
router.post('/documents/search', requireMinRole('agent'), searchDocuments);
router.get('/documents/link-options', requireMinRole('agent'), getDocumentLinkOptions);
router.get('/documents/latest/:docType', requireMinRole('agent'), getLatestDocumentByType);
router.patch('/documents/:id', requireMinRole('agent'), patchDocument);
router.patch('/documents/:id/reminder', requireMinRole('agent'), patchDocumentReminder);
router.delete('/documents/:id', requireMinRole('agent'), deleteDocumentHandler);

for (const route of ['/documents/:id/download', '/documents/:id']) {
  router.get(route, requireMinRole('agent'), serveDocumentOrDownload);
}

export default router;
