import express from 'express';
import KYCService from '../services/compliance/KYCService.js';
import KYCProfile from '../models/compliance/KYCProfile.js';
import AMLAlert from '../models/compliance/AMLAlert.js';
import ComplianceAudit from '../models/compliance/ComplianceAudit.js';

const router = express.Router();

const getActor = (req) => ({
  userId: req.user?.id || 'anonymous',
  username: req.user?.email || req.user?.name || 'anonymous',
  role: req.user?.role || 'user',
  department: req.user?.department || 'unknown',
  ipAddress: req.ip,
  userAgent: req.get('User-Agent'),
  sessionId: req.session?.id
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await KYCService.getKYCStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/kyc', async (req, res) => {
  try {
    const { status, riskCategory, page = 1, limit = 20, search } = req.query;
    const query = {};
    
    if (status) query.kycStatus = status;
    if (riskCategory) query['riskAssessment.category'] = riskCategory;
    if (search) {
      query.$or = [
        { 'personalInfo.fullNameEn': new RegExp(search, 'i') },
        { 'personalInfo.emiratesIdNumber': new RegExp(search, 'i') },
        { customerId: new RegExp(search, 'i') }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [profiles, total] = await Promise.all([
      KYCProfile.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-documents.fileUrl'),
      KYCProfile.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: profiles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/kyc/pending', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const profiles = await KYCService.getPendingVerifications({ limit: parseInt(limit) });
    res.json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/kyc/high-risk', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const profiles = await KYCService.getHighRiskProfiles({ limit: parseInt(limit) });
    res.json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/kyc/reviews-due', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const profiles = await KYCProfile.getUpcomingReviews(parseInt(days));
    res.json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/kyc/:customerId', async (req, res) => {
  try {
    const profile = await KYCProfile.findOne({ customerId: req.params.customerId });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'KYC profile not found' });
    }
    
    await ComplianceAudit.logAction({
      entityType: 'kyc_profile',
      entityId: req.params.customerId,
      action: 'view',
      actor: getActor(req),
      details: { description: 'KYC profile viewed' },
      customerInfo: {
        customerId: profile.customerId,
        customerName: profile.personalInfo?.fullNameEn,
        riskCategory: profile.riskAssessment?.category
      }
    });
    
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/kyc', async (req, res) => {
  try {
    const profile = await KYCService.createKYCProfile(req.body, getActor(req));
    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/kyc/:customerId', async (req, res) => {
  try {
    const profile = await KYCService.updateKYCProfile(
      req.params.customerId,
      req.body,
      getActor(req)
    );
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/kyc/:customerId/verify-document', async (req, res) => {
  try {
    const { documentType, ...verificationData } = req.body;
    const profile = await KYCService.verifyDocument(
      req.params.customerId,
      documentType,
      verificationData,
      getActor(req)
    );
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/kyc/:customerId/approve', async (req, res) => {
  try {
    const profile = await KYCService.approveKYCProfile(
      req.params.customerId,
      req.body,
      getActor(req)
    );
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/kyc/:customerId/reject', async (req, res) => {
  try {
    const profile = await KYCService.rejectKYCProfile(
      req.params.customerId,
      req.body,
      getActor(req)
    );
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/kyc/:customerId/risk-assessment', async (req, res) => {
  try {
    const profile = await KYCProfile.findOne({ customerId: req.params.customerId });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'KYC profile not found' });
    }
    
    const factors = {
      customerType: profile.customerType,
      nationality: profile.personalInfo?.nationality,
      transactionValue: req.body.transactionValue || profile.transactionProfile?.expectedTransactionValue || 0,
      transactionType: req.body.transactionType || profile.transactionProfile?.primaryPurpose,
      sourceOfFunds: profile.employmentInfo?.incomeSource,
      occupation: profile.employmentInfo?.occupation,
      isPEP: profile.pepScreening?.isPEP
    };
    
    const riskResult = KYCService.calculateRiskScore(factors);
    
    if (profile.riskAssessment) {
      profile.riskHistory.push({ ...profile.riskAssessment.toObject() });
    }
    
    profile.riskAssessment = {
      assessedAt: new Date(),
      assessedBy: getActor(req).username,
      score: riskResult.totalScore,
      category: riskResult.category,
      factors: riskResult.breakdown,
      notes: req.body.notes || 'Manual risk assessment'
    };
    
    await profile.save();
    
    await ComplianceAudit.logAction({
      entityType: 'kyc_profile',
      entityId: req.params.customerId,
      action: 'risk_assessment',
      actor: getActor(req),
      details: {
        description: 'Risk assessment performed',
        newValue: riskResult
      },
      customerInfo: {
        customerId: profile.customerId,
        customerName: profile.personalInfo?.fullNameEn,
        riskCategory: riskResult.category
      }
    });
    
    res.json({ success: true, data: { profile, riskResult } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/kyc/:customerId/pep-screening', async (req, res) => {
  try {
    const profile = await KYCProfile.findOne({ customerId: req.params.customerId });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'KYC profile not found' });
    }
    
    const pepResult = await KYCService.screenForPEP(
      profile.personalInfo?.fullNameEn,
      profile.personalInfo?.nationality,
      profile.employmentInfo?.occupation
    );
    
    if (profile.pepScreening) {
      profile.pepScreeningHistory.push({ ...profile.pepScreening.toObject() });
    }
    
    profile.pepScreening = pepResult;
    await profile.save();
    
    await ComplianceAudit.logAction({
      entityType: 'kyc_profile',
      entityId: req.params.customerId,
      action: 'pep_screening',
      actor: getActor(req),
      details: {
        description: 'PEP screening performed',
        newValue: { isPEP: pepResult.isPEP }
      },
      customerInfo: {
        customerId: profile.customerId,
        customerName: profile.personalInfo?.fullNameEn,
        riskCategory: profile.riskAssessment?.category
      }
    });
    
    res.json({ success: true, data: { profile, pepResult } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/kyc/:customerId/sanctions-check', async (req, res) => {
  try {
    const profile = await KYCProfile.findOne({ customerId: req.params.customerId });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'KYC profile not found' });
    }
    
    const sanctionsResult = await KYCService.checkSanctions(
      profile.personalInfo?.fullNameEn,
      profile.personalInfo?.nationality,
      profile.personalInfo?.emiratesIdNumber
    );
    
    if (profile.sanctionsCheck) {
      profile.sanctionsCheckHistory.push({ ...profile.sanctionsCheck.toObject() });
    }
    
    profile.sanctionsCheck = sanctionsResult;
    await profile.save();
    
    await ComplianceAudit.logAction({
      entityType: 'kyc_profile',
      entityId: req.params.customerId,
      action: 'sanctions_check',
      actor: getActor(req),
      details: {
        description: 'Sanctions check performed',
        newValue: { hasMatch: sanctionsResult.hasMatch }
      },
      customerInfo: {
        customerId: profile.customerId,
        customerName: profile.personalInfo?.fullNameEn,
        riskCategory: profile.riskAssessment?.category
      }
    });
    
    if (sanctionsResult.hasMatch) {
      await KYCService.createAMLAlert({
        kycProfileId: profile._id,
        customerId: profile.customerId,
        alertType: 'sanctions_match',
        alertCategory: 'sanctions_hit',
        severity: 'CRITICAL',
        title: `Sanctions Match - ${profile.personalInfo?.fullNameEn}`,
        description: 'Sanctions screening returned a potential match',
        triggerDetails: { triggerSource: 'manual_sanctions_check', triggerData: sanctionsResult },
        customerSnapshot: {
          name: profile.personalInfo?.fullNameEn,
          emiratesId: profile.personalInfo?.emiratesIdNumber,
          nationality: profile.personalInfo?.nationality,
          riskCategory: profile.riskAssessment?.category
        }
      }, getActor(req));
    }
    
    res.json({ success: true, data: { profile, sanctionsResult } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/alerts', async (req, res) => {
  try {
    const { status, severity, assignedTo, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (assignedTo) query.assignedTo = assignedTo;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [alerts, total] = await Promise.all([
      AMLAlert.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AMLAlert.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/alerts/open', async (req, res) => {
  try {
    const { severity, limit = 50 } = req.query;
    const alerts = await KYCService.getOpenAlerts({ severity, limit: parseInt(limit) });
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/alerts/:alertId', async (req, res) => {
  try {
    const alert = await AMLAlert.findOne({ alertId: req.params.alertId });
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/alerts', async (req, res) => {
  try {
    const alert = await KYCService.createAMLAlert(req.body, getActor(req));
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/alerts/:alertId/assign', async (req, res) => {
  try {
    const alert = await AMLAlert.findOne({ alertId: req.params.alertId });
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }
    
    await alert.assignTo(req.body.assignee, getActor(req).username, req.body.reason);
    
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/alerts/:alertId/escalate', async (req, res) => {
  try {
    const alert = await AMLAlert.findOne({ alertId: req.params.alertId });
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }
    
    await alert.escalate(getActor(req).username, req.body.escalateTo, req.body.reason);
    
    await ComplianceAudit.logAction({
      entityType: 'aml_alert',
      entityId: req.params.alertId,
      action: 'escalate',
      actor: getActor(req),
      details: {
        description: `Alert escalated to ${req.body.escalateTo}`,
        newValue: { escalateTo: req.body.escalateTo, reason: req.body.reason }
      },
      customerInfo: alert.customerSnapshot
    });
    
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/alerts/:alertId/close', async (req, res) => {
  try {
    const alert = await AMLAlert.findOne({ alertId: req.params.alertId });
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }
    
    await alert.close(getActor(req).username, req.body.resolutionType, req.body.notes);
    
    await ComplianceAudit.logAction({
      entityType: 'aml_alert',
      entityId: req.params.alertId,
      action: 'alert_close',
      actor: getActor(req),
      details: {
        description: `Alert closed: ${req.body.resolutionType}`,
        newValue: { resolutionType: req.body.resolutionType, notes: req.body.notes }
      },
      customerInfo: alert.customerSnapshot
    });
    
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/alerts/:alertId/file-str', async (req, res) => {
  try {
    const alert = await AMLAlert.findOne({ alertId: req.params.alertId });
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }
    
    await alert.fileSTR(getActor(req).username, req.body);
    
    await ComplianceAudit.logAction({
      entityType: 'aml_alert',
      entityId: req.params.alertId,
      action: 'str_file',
      actor: getActor(req),
      details: {
        description: 'Suspicious Transaction Report filed',
        newValue: req.body
      },
      customerInfo: alert.customerSnapshot,
      complianceFlags: { regulatoryReport: true }
    });
    
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/audit', async (req, res) => {
  try {
    const result = await ComplianceAudit.searchAuditLogs(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/audit/entity/:entityType/:entityId', async (req, res) => {
  try {
    const logs = await ComplianceAudit.getAuditTrail(
      req.params.entityType,
      req.params.entityId,
      req.query
    );
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/audit/user/:userId', async (req, res) => {
  try {
    const logs = await ComplianceAudit.getUserActivity(req.params.userId, req.query);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/audit/report', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await ComplianceAudit.getComplianceReport(
      new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
      new Date(endDate || Date.now())
    );
    res.json({ success: true, data: report[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/validate/emirates-id', (req, res) => {
  try {
    const result = KYCService.validateEmiratesId(req.body.emiratesId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/calculate-risk', (req, res) => {
  try {
    const result = KYCService.calculateRiskScore(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
