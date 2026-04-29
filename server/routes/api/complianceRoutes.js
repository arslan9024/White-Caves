/**
 * complianceRoutes.js
 * API routes for compliance operations
 * Handles CDD, EDD, approval workflows, and goAML registration
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken, requireRole } = require('../../middleware/auth');
const CompliancePolicyService = require('../../services/compliance/CompliancePolicyService');
const GoAMLRegistrationService = require('../../services/compliance/GoAMLRegistrationService');
const ApprovalWorkflowService = require('../../services/compliance/ApprovalWorkflowService');
const CustomerDueDiligenceService = require('../../services/compliance/CustomerDueDiligenceService');
const KYCService = require('../../services/compliance/KYCService');
const DocumentProcessingService = require('../../services/compliance/DocumentProcessingService');
const DocumentValidationService = require('../../services/compliance/DocumentValidationService');
const logger = require('../../config/logger');

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and GIF are supported.'));
    }
  }
});

// ============================================
// COMPLIANCE POLICY ROUTES
// ============================================

/**
 * GET /api/compliance/policies - List all compliance policies
 */
router.get('/policies', verifyToken, async (req, res) => {
  try {
    const policies = await CompliancePolicyService.getPolicies(req.query);
    res.json({
      success: true,
      data: policies,
    });
  } catch (error) {
    logger.error(`Error fetching policies: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/compliance/policies/:policyId - Get specific compliance policy
 */
router.get('/policies/:policyId', verifyToken, async (req, res) => {
  try {
    const policy = await CompliancePolicyService.getPolicyById(req.params.policyId);
    res.json({
      success: true,
      data: policy,
    });
  } catch (error) {
    logger.error(`Error fetching policy: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/compliance/policies - Create new compliance policy
 */
router.post('/policies', verifyToken, requireRole(['admin', 'compliance_officer']), async (req, res) => {
  try {
    const policy = await CompliancePolicyService.createPolicy(
      req.body,
      req.user.id,
      req.user.name
    );
    res.status(201).json({
      success: true,
      message: 'Compliance policy created successfully',
      data: policy,
    });
  } catch (error) {
    logger.error(`Error creating policy: ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/compliance/policies/:policyId/approve - Approve compliance policy
 */
router.post(
  '/policies/:policyId/approve',
  verifyToken,
  requireRole(['admin', 'compliance_officer']),
  async (req, res) => {
    try {
      const result = await CompliancePolicyService.approvePolicy(
        req.params.policyId,
        req.user.id,
        req.user.name,
        req.body.comments || ''
      );
      res.json({
        success: true,
        message: 'Policy approved successfully',
        data: result,
      });
    } catch (error) {
      logger.error(`Error approving policy: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ============================================
// GOAML REGISTRATION ROUTES
// ============================================

/**
 * POST /api/compliance/goaml/register - Initialize goAML registration
 */
router.post('/goaml/register', verifyToken, requireRole(['admin', 'compliance_officer']), async (req, res) => {
  try {
    const registration = await GoAMLRegistrationService.initializeCompanyRegistration(req.body);
    res.status(201).json({
      success: true,
      message: 'GoAML registration initialized',
      data: registration,
    });
  } catch (error) {
    logger.error(`Error initializing goAML registration: ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/compliance/goaml/registrations - List all goAML registrations
 */
router.get('/goaml/registrations', verifyToken, async (req, res) => {
  try {
    const registrations = await GoAMLRegistrationService.getRegistrations(req.query);
    res.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    logger.error(`Error fetching registrations: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/compliance/goaml/registrations/:registrationId - Get specific registration
 */
router.get('/goaml/registrations/:registrationId', verifyToken, async (req, res) => {
  try {
    const details = await GoAMLRegistrationService.getRegistrationDetails(req.params.registrationId);
    res.json({
      success: true,
      data: details,
    });
  } catch (error) {
    logger.error(`Error fetching registration details: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/compliance/goaml/registrations/:registrationId/submit - Submit to goAML portal
 */
router.post(
  '/goaml/registrations/:registrationId/submit',
  verifyToken,
  requireRole(['admin', 'compliance_officer']),
  async (req, res) => {
    try {
      const result = await GoAMLRegistrationService.submitToGoAMLPortal(
        req.params.registrationId,
        req.body.portalCredentials
      );
      res.json({
        success: true,
        message: 'Registration submitted to goAML portal',
        data: result,
      });
    } catch (error) {
      logger.error(`Error submitting to goAML: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/compliance/goaml/str - File a Suspicious Transaction Report
 */
router.post('/goaml/str', verifyToken, requireRole(['admin', 'compliance_officer']), async (req, res) => {
  try {
    const result = await GoAMLRegistrationService.fileSuspiciousTransactionReport(req.body);
    res.json({
      success: true,
      message: 'STR filed successfully',
      data: result,
    });
  } catch (error) {
    logger.error(`Error filing STR: ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/compliance/goaml/registrations/:registrationId/str-history - Get STR filing history
 */
router.get('/goaml/registrations/:registrationId/str-history', verifyToken, async (req, res) => {
  try {
    const history = await GoAMLRegistrationService.getSTRFilingHistory(req.params.registrationId);
    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    logger.error(`Error fetching STR history: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================
// CUSTOMER DUE DILIGENCE ROUTES
// ============================================

/**
 * POST /api/compliance/cdd - Create new CDD record
 */
router.post('/cdd', verifyToken, requireRole(['admin', 'compliance_officer', 'sales']), async (req, res) => {
  try {
    const cddRecord = await CustomerDueDiligenceService.createCDDRecord(req.body);
    res.status(201).json({
      success: true,
      message: 'CDD record created',
      data: cddRecord,
    });
  } catch (error) {
    logger.error(`Error creating CDD record: ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/compliance/cdd/:customerId - Get CDD record for customer
 */
router.get('/cdd/:customerId', verifyToken, async (req, res) => {
  try {
    const cddRecord = await CustomerDueDiligenceService.getCDDRecord(req.params.customerId);
    res.json({
      success: true,
      data: cddRecord,
    });
  } catch (error) {
    logger.error(`Error fetching CDD record: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/compliance/cdd/:customerId/pep-screening - Perform PEP screening
 */
router.post(
  '/cdd/:customerId/pep-screening',
  verifyToken,
  requireRole(['admin', 'compliance_officer']),
  async (req, res) => {
    try {
      const result = await CustomerDueDiligenceService.performPEPScreening(
        req.params.customerId,
        req.body.customerName,
        req.body.nationality
      );
      res.json({
        success: true,
        message: 'PEP screening completed',
        data: result,
      });
    } catch (error) {
      logger.error(`Error performing PEP screening: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/compliance/cdd/:customerId/edd - Perform Enhanced Due Diligence
 */
router.post(
  '/cdd/:customerId/edd',
  verifyToken,
  requireRole(['admin', 'compliance_officer']),
  async (req, res) => {
    try {
      const result = await CustomerDueDiligenceService.performEnhancedDueDiligence(
        req.params.customerId,
        req.body
      );
      res.json({
        success: true,
        message: 'Enhanced Due Diligence completed',
        data: result,
      });
    } catch (error) {
      logger.error(`Error performing EDD: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/compliance/cdd/:customerId/approve - Approve CDD record
 */
router.post(
  '/cdd/:customerId/approve',
  verifyToken,
  requireRole(['admin', 'compliance_officer']),
  async (req, res) => {
    try {
      const result = await CustomerDueDiligenceService.approveCDD(req.params.customerId, {
        approverId: req.user.id,
        approverName: req.user.name,
        approvalComments: req.body.comments,
        conditionsForApproval: req.body.conditions,
      });
      res.json({
        success: true,
        message: 'CDD record approved',
        data: result,
      });
    } catch (error) {
      logger.error(`Error approving CDD: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/compliance/cdd/:customerId/reject - Reject CDD record
 */
router.post(
  '/cdd/:customerId/reject',
  verifyToken,
  requireRole(['admin', 'compliance_officer']),
  async (req, res) => {
    try {
      const result = await CustomerDueDiligenceService.rejectCDD(req.params.customerId, {
        rejecterId: req.user.id,
        rejectorName: req.user.name,
        rejectionReason: req.body.reason,
        requiredCorrectionss: req.body.corrections,
      });
      res.json({
        success: true,
        message: 'CDD record rejected',
        data: result,
      });
    } catch (error) {
      logger.error(`Error rejecting CDD: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ============================================
// DOCUMENT VERIFICATION ROUTES
// ============================================

/**
 * POST /api/compliance/documents/verify - Upload and verify document
 * Handles OCR processing, data extraction, and validation
 */
router.post(
  '/documents/verify',
  verifyToken,
  upload.single('document'),
  async (req, res) => {
    const { documentType, userId } = req.body;
    const documentPath = req.file?.path;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No document file provided'
        });
      }

      if (!documentType || !['emirates_id', 'passport', 'visa'].includes(documentType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid document type. Must be emirates_id, passport, or visa'
        });
      }

      logger.info(`Processing document: ${documentType} for user ${userId}`);

      // Step 1: Process document (OCR, extraction)
      const processingResult = await DocumentProcessingService.processDocument(
        documentPath,
        documentType
      );

      // Step 2: Validate extracted data
      const validationResult = await DocumentValidationService.validateDocument(
        processingResult,
        userId || req.user.id,
        documentType
      );

      // Step 3: Check sanctions and watchlists
      const screeningResult = await DocumentValidationService.checkSanctionsAndWatchlists(
        processingResult
      );

      // Step 4: Verify document status (expiry, etc.)
      const statusVerification = await DocumentProcessingService.verifyDocumentStatus(
        processingResult,
        documentType
      );

      // Step 5: Generate compliance report
      const complianceReport = DocumentValidationService.generateComplianceReport(
        processingResult,
        validationResult,
        { isAuthentic: true, confidence: 0.95 },
        screeningResult
      );

      // Step 6: Store in KYC profile
      const kycUpdate = await KYCService.updateDocumentVerification(
        userId || req.user.id,
        {
          documentType,
          status: validationResult.isValid && screeningResult.isClear ? 'verified' : 'pending_review',
          ocrConfidence: Math.round(processingResult.confidence),
          extractedData: processingResult.parsedData.extractedFields,
          validationResult,
          complianceReport,
          uploadedAt: new Date(),
          uploadedBy: req.user.id
        }
      );

      res.status(200).json({
        success: true,
        message: 'Document verified successfully',
        data: {
          documentId: kycUpdate._id,
          processingResult: {
            confidence: processingResult.confidence,
            extractedFields: processingResult.parsedData.extractedFields
          },
          validation: validationResult,
          screening: screeningResult,
          compliance: complianceReport,
          status: kycUpdate.documents[kycUpdate.documents.length - 1].status
        }
      });

    } catch (error) {
      logger.error(`Document verification error: ${error.message}`, error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to verify document'
      });
    }
  }
);

/**
 * GET /api/compliance/documents/:documentId/status - Get document verification status
 */
router.get('/documents/:documentId/status', verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;

    const KYCProfile = require('../../models/compliance/KYCProfile.js').default ||
      require('../../models/compliance/KYCProfile.js');
    const profile = await KYCProfile.findOne({ 'documents._id': documentId }).select('documents');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const document = profile.documents.find(d => d._id.toString() === documentId);

    res.json({
      success: true,
      data: {
        documentId,
        type: document.type,
        status: document.status,
        verifiedAt: document.verifiedAt,
        verifiedBy: document.verifiedBy,
        ocrConfidence: document.ocrConfidence,
        extractedData: document.extractedData,
        validation: document.validation,
        rejectionReason: document.rejectionReason
      }
    });
  } catch (error) {
    logger.error(`Error fetching document status: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/compliance/documents/:documentId/approve - Approve document verification
 */
router.post(
  '/documents/:documentId/approve',
  verifyToken,
  requireRole(['admin', 'compliance_officer']),
  async (req, res) => {
    try {
      const { documentId } = req.params;
      const { comments } = req.body;

      const KYCProfile = require('../../models/compliance/KYCProfile.js').default ||
        require('../../models/compliance/KYCProfile.js');

      const profile = await KYCProfile.findOneAndUpdate(
        { 'documents._id': documentId },
        {
          $set: {
            'documents.$.status': 'verified',
            'documents.$.verifiedAt': new Date(),
            'documents.$.verifiedBy': req.user.id,
            'documents.$.verificationComments': comments
          }
        },
        { new: true }
      );

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      res.json({
        success: true,
        message: 'Document approved successfully',
        data: profile
      });
    } catch (error) {
      logger.error(`Error approving document: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/**
 * POST /api/compliance/documents/:documentId/reject - Reject document verification
 */
router.post(
  '/documents/:documentId/reject',
  verifyToken,
  requireRole(['admin', 'compliance_officer']),
  async (req, res) => {
    try {
      const { documentId } = req.params;
      const { reason } = req.body;

      const KYCProfile = require('../../models/compliance/KYCProfile.js').default ||
        require('../../models/compliance/KYCProfile.js');

      const profile = await KYCProfile.findOneAndUpdate(
        { 'documents._id': documentId },
        {
          $set: {
            'documents.$.status': 'rejected',
            'documents.$.rejectedAt': new Date(),
            'documents.$.rejectedBy': req.user.id,
            'documents.$.rejectionReason': reason
          }
        },
        { new: true }
      );

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      res.json({
        success: true,
        message: 'Document rejected',
        data: profile
      });
    } catch (error) {
      logger.error(`Error rejecting document: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// ============================================
// APPROVAL WORKFLOW ROUTES
// ============================================

/**
 * POST /api/compliance/workflow - Create approval workflow
 */
router.post('/workflow', verifyToken, requireRole(['admin', 'compliance_officer']), async (req, res) => {
  try {
    const workflow = await ApprovalWorkflowService.createWorkflow(req.body);
    res.status(201).json({
      success: true,
      message: 'Approval workflow created',
      data: workflow,
    });
  } catch (error) {
    logger.error(`Error creating workflow: ${error.message}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/compliance/workflow/:workflowId - Get workflow status
 */
router.get('/workflow/:workflowId', verifyToken, async (req, res) => {
  try {
    const status = await ApprovalWorkflowService.getWorkflowStatus(req.params.workflowId);
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    logger.error(`Error fetching workflow status: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/compliance/workflow/:workflowId/approve - Approve at current stage
 */
router.post(
  '/workflow/:workflowId/approve',
  verifyToken,
  async (req, res) => {
    try {
      const result = await ApprovalWorkflowService.approveDocument(req.params.workflowId, {
        approverId: req.user.id,
        approverName: req.user.name,
        approverTitle: req.user.title || 'Staff',
        approverEmail: req.user.email,
        comments: req.body.comments,
        signatureMethod: req.body.signatureMethod || 'digital',
        signatureData: req.body.signatureData,
      });
      res.json({
        success: true,
        message: 'Document approved successfully',
        data: result,
      });
    } catch (error) {
      logger.error(`Error approving document: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/compliance/workflow/:workflowId/reject - Reject document
 */
router.post(
  '/workflow/:workflowId/reject',
  verifyToken,
  async (req, res) => {
    try {
      const result = await ApprovalWorkflowService.rejectDocument(req.params.workflowId, {
        approverId: req.user.id,
        approverName: req.user.name,
        rejectionReason: req.body.reason,
        requirementsForResubmission: req.body.requirements,
      });
      res.json({
        success: true,
        message: 'Document rejected',
        data: result,
      });
    } catch (error) {
      logger.error(`Error rejecting document: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * GET /api/compliance/workflow/:workflowId/audit-trail - Get audit trail
 */
router.get('/workflow/:workflowId/audit-trail', verifyToken, async (req, res) => {
  try {
    const auditTrail = await ApprovalWorkflowService.getAuditTrail(req.params.workflowId);
    res.json({
      success: true,
      data: auditTrail,
    });
  } catch (error) {
    logger.error(`Error fetching audit trail: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/compliance/pending-approvals - Get pending approvals for user
 */
router.get('/pending-approvals', verifyToken, async (req, res) => {
  try {
    const pending = await ApprovalWorkflowService.getPendingApprovalsForUser(
      req.user.id,
      req.user.email
    );
    res.json({
      success: true,
      data: pending,
    });
  } catch (error) {
    logger.error(`Error fetching pending approvals: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================
// DOCUMENT VERIFICATION ROUTES
// ============================================

/**
 * POST /api/compliance/documents/process
 * Process document with OCR and extract data
 * Body: { customerId, documentType, filePath }
 */
router.post('/documents/process', verifyToken, requireRole(['admin', 'compliance_officer']), async (req, res) => {
  try {
    const { customerId, documentType, filePath } = req.body;
    
    if (!customerId || !documentType || !filePath) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerId, documentType, filePath'
      });
    }

    const KYCService = require('../../services/compliance/KYCService.js').default || require('../../services/compliance/KYCService.js');
    const result = await KYCService.processDocumentWithOCR(customerId, documentType, filePath);

    logger.info(`Document processed successfully for ${customerId}: ${documentType}`);

    res.json({
      success: true,
      message: 'Document processed successfully',
      data: result
    });
  } catch (error) {
    logger.error(`Error processing document: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/compliance/documents/validate
 * Validate extracted document data
 * Body: { documentType, extractedData }
 */
router.post('/documents/validate', verifyToken, requireRole(['admin', 'compliance_officer']), async (req, res) => {
  try {
    const { documentType, extractedData } = req.body;
    
    if (!documentType || !extractedData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: documentType, extractedData'
      });
    }

    const KYCService = require('../../services/compliance/KYCService.js').default || require('../../services/compliance/KYCService.js');
    const validation = KYCService.validateExtractedData(documentType, extractedData);

    res.json({
      success: true,
      message: 'Validation completed',
      data: validation
    });
  } catch (error) {
    logger.error(`Error validating document data: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/compliance/documents/verify
 * Mark document as verified or rejected after manual review
 * Body: { customerId, documentType, approved, confidence, ocrData, rejectionReason }
 */
router.post('/documents/verify', verifyToken, requireRole(['admin', 'compliance_officer']), async (req, res) => {
  try {
    const { customerId, documentType, approved, confidence, ocrData, rejectionReason } = req.body;
    
    if (!customerId || !documentType || approved === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const KYCService = require('../../services/compliance/KYCService.js').default || require('../../services/compliance/KYCService.js');
    const verificationData = {
      approved,
      confidence: confidence || 0,
      ocrData: ocrData || {},
      rejectionReason: rejectionReason || null
    };

    const result = await KYCService.verifyDocument(customerId, documentType, verificationData, req.user);

    logger.info(`Document ${approved ? 'approved' : 'rejected'} for ${customerId}: ${documentType}`);

    res.json({
      success: true,
      message: `Document ${approved ? 'verified' : 'rejected'} successfully`,
      data: result
    });
  } catch (error) {
    logger.error(`Error verifying document: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/compliance/documents/customer/:customerId
 * Get all documents for a customer
 */
router.get('/documents/customer/:customerId', verifyToken, requireRole(['admin', 'compliance_officer', 'sales']), async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const KYCProfile = require('../../models/compliance/KYCProfile.js').default || require('../../models/compliance/KYCProfile.js');
    const profile = await KYCProfile.findOne({ customerId }).select('documents personalInfo');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: {
        customerId,
        documents: profile.documents,
        personalInfo: profile.personalInfo
      }
    });
  } catch (error) {
    logger.error(`Error fetching customer documents: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/compliance/documents/:documentId/status
 * Get processing status of a specific document
 */
router.get('/documents/:documentId/status', verifyToken, async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const KYCProfile = require('../../models/compliance/KYCProfile.js').default || require('../../models/compliance/KYCProfile.js');
    const profile = await KYCProfile.findOne({ 'documents._id': documentId }).select('documents');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const document = profile.documents.find(d => d._id.toString() === documentId);

    res.json({
      success: true,
      data: {
        documentId,
        type: document.type,
        status: document.status,
        verifiedAt: document.verifiedAt,
        verifiedBy: document.verifiedBy,
        ocrConfidence: document.ocrConfidence,
        rejectionReason: document.rejectionReason
      }
    });
  } catch (error) {
    logger.error(`Error fetching document status: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
