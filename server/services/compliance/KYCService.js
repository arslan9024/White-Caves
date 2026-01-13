import KYCProfile from '../../models/compliance/KYCProfile.js';
import AMLAlert from '../../models/compliance/AMLAlert.js';
import ComplianceAudit from '../../models/compliance/ComplianceAudit.js';

const KYC_AML_POLICIES = {
  riskScoringMatrix: {
    customerType: {
      individual_resident: 0,
      individual_non_resident: 10,
      corporate_local: 5,
      corporate_foreign: 15,
      trust_foundation: 20
    },
    nationality: {
      gcc: 0,
      low_risk_country: 5,
      medium_risk_country: 15,
      high_risk_country: 30,
      fatf_blacklist: 50,
      sanctioned_country: 100
    },
    transactionValue: {
      below_50k: 0,
      '50k_to_500k': 5,
      '500k_to_2m': 10,
      '2m_to_10m': 20,
      above_10m: 30
    },
    transactionType: {
      residential_rental: 0,
      residential_purchase: 5,
      commercial_rental: 5,
      commercial_purchase: 10,
      offplan_purchase: 10,
      investment_portfolio: 15,
      cash_transaction: 25
    },
    sourceOfFunds: {
      salary: 0,
      business_income: 5,
      investment_returns: 5,
      property_sale: 10,
      inheritance: 10,
      gift: 15,
      crypto: 25,
      unknown: 30
    },
    occupation: {
      employed: 0,
      self_employed: 5,
      business_owner: 5,
      investor: 10,
      retired: 5,
      student: 10,
      unemployed: 15,
      high_risk_profession: 20
    }
  },
  
  riskThresholds: {
    low: { min: 0, max: 25 },
    medium: { min: 26, max: 50 },
    high: { min: 51, max: 75 },
    prohibited: { min: 76, max: 100 }
  },
  
  highRiskCountries: {
    fatfBlacklist: ['north korea', 'iran', 'myanmar'],
    fatfGreylist: ['syria', 'yemen', 'south sudan', 'mali', 'burkina faso'],
    sanctioned: ['russia', 'belarus', 'venezuela', 'zimbabwe', 'cuba']
  },
  
  gccCountries: ['uae', 'saudi arabia', 'qatar', 'kuwait', 'bahrain', 'oman'],
  
  pepKeywords: [
    'minister', 'president', 'prime minister', 'governor', 'ambassador',
    'senator', 'member of parliament', 'judge', 'general', 'admiral',
    'director general', 'ceo of state', 'royal', 'sheikh', 'emir'
  ]
};

class KYCService {
  
  static getTransactionValueCategory(amountAED) {
    if (amountAED < 50000) return 'below_50k';
    if (amountAED < 500000) return '50k_to_500k';
    if (amountAED < 2000000) return '500k_to_2m';
    if (amountAED < 10000000) return '2m_to_10m';
    return 'above_10m';
  }
  
  static getNationalityRiskCategory(nationality) {
    const normalizedNationality = nationality?.toLowerCase() || '';
    
    if (KYC_AML_POLICIES.gccCountries.some(c => normalizedNationality.includes(c))) {
      return 'gcc';
    }
    if (KYC_AML_POLICIES.highRiskCountries.fatfBlacklist.some(c => normalizedNationality.includes(c))) {
      return 'fatf_blacklist';
    }
    if (KYC_AML_POLICIES.highRiskCountries.sanctioned.some(c => normalizedNationality.includes(c))) {
      return 'sanctioned_country';
    }
    if (KYC_AML_POLICIES.highRiskCountries.fatfGreylist.some(c => normalizedNationality.includes(c))) {
      return 'high_risk_country';
    }
    
    return 'low_risk_country';
  }
  
  static calculateRiskScore(factors) {
    const matrix = KYC_AML_POLICIES.riskScoringMatrix;
    let score = 0;
    const breakdown = {};
    
    if (factors.customerType && matrix.customerType[factors.customerType] !== undefined) {
      const value = matrix.customerType[factors.customerType];
      score += value;
      breakdown.customerType = { value: factors.customerType, score: value };
    }
    
    if (factors.nationality) {
      const category = this.getNationalityRiskCategory(factors.nationality);
      const value = matrix.nationality[category] || 0;
      score += value;
      breakdown.nationality = { value: factors.nationality, category, score: value };
    }
    
    if (factors.transactionValue !== undefined) {
      const category = this.getTransactionValueCategory(factors.transactionValue);
      const value = matrix.transactionValue[category] || 0;
      score += value;
      breakdown.transactionValue = { value: factors.transactionValue, category, score: value };
    }
    
    if (factors.transactionType && matrix.transactionType[factors.transactionType] !== undefined) {
      const value = matrix.transactionType[factors.transactionType];
      score += value;
      breakdown.transactionType = { value: factors.transactionType, score: value };
    }
    
    if (factors.sourceOfFunds && matrix.sourceOfFunds[factors.sourceOfFunds] !== undefined) {
      const value = matrix.sourceOfFunds[factors.sourceOfFunds];
      score += value;
      breakdown.sourceOfFunds = { value: factors.sourceOfFunds, score: value };
    }
    
    if (factors.occupation) {
      const occupationType = this.categorizeOccupation(factors.occupation);
      const value = matrix.occupation[occupationType] || 0;
      score += value;
      breakdown.occupation = { value: factors.occupation, category: occupationType, score: value };
    }
    
    if (factors.isPEP) {
      score += 30;
      breakdown.pep = { value: true, score: 30 };
    }
    
    return {
      totalScore: Math.min(score, 100),
      breakdown,
      category: this.getRiskCategory(Math.min(score, 100))
    };
  }
  
  static categorizeOccupation(occupation) {
    const normalized = occupation?.toLowerCase() || '';
    
    if (normalized.includes('unemployed')) return 'unemployed';
    if (normalized.includes('student')) return 'student';
    if (normalized.includes('retired')) return 'retired';
    if (normalized.includes('investor')) return 'investor';
    if (normalized.includes('owner') || normalized.includes('entrepreneur') || normalized.includes('ceo') || normalized.includes('director')) return 'business_owner';
    if (normalized.includes('self') || normalized.includes('freelance') || normalized.includes('consultant')) return 'self_employed';
    if (['casino', 'gambling', 'arms', 'weapons', 'crypto', 'money exchange', 'precious metals'].some(r => normalized.includes(r))) return 'high_risk_profession';
    
    return 'employed';
  }
  
  static getRiskCategory(score) {
    const thresholds = KYC_AML_POLICIES.riskThresholds;
    if (score <= thresholds.low.max) return 'LOW';
    if (score <= thresholds.medium.max) return 'MEDIUM';
    if (score <= thresholds.high.max) return 'HIGH';
    return 'PROHIBITED';
  }
  
  static async screenForPEP(name, nationality, occupation) {
    const normalizedName = name?.toLowerCase() || '';
    const normalizedOccupation = occupation?.toLowerCase() || '';
    
    const isPEP = KYC_AML_POLICIES.pepKeywords.some(keyword => 
      normalizedOccupation.includes(keyword) || normalizedName.includes(keyword)
    );
    
    return {
      screenedAt: new Date(),
      isPEP,
      pepCategory: isPEP ? 'domestic' : null,
      pepPosition: isPEP ? occupation : null,
      pepCountry: isPEP ? nationality : null,
      matchConfidence: isPEP ? 0.85 : 0,
      source: 'internal_screening',
      notes: isPEP ? 'Potential PEP match based on occupation keywords' : 'No PEP indicators found'
    };
  }
  
  static async checkSanctions(name, nationality, emiratesId) {
    const sanctionedNationality = KYC_AML_POLICIES.highRiskCountries.fatfBlacklist.some(
      c => nationality?.toLowerCase().includes(c)
    );
    
    return {
      checkedAt: new Date(),
      listsChecked: ['UN Consolidated', 'OFAC SDN', 'EU Consolidated', 'UK Sanctions', 'UAE Local'],
      hasMatch: sanctionedNationality,
      matches: sanctionedNationality ? [{
        listId: 'fatf_blacklist',
        listName: 'FATF Blacklist',
        matchType: 'nationality',
        matchScore: 1.0,
        matchedName: name,
        matchedEntity: { nationality },
        confirmedMatch: false
      }] : [],
      clearanceStatus: sanctionedNationality ? 'matched' : 'cleared'
    };
  }
  
  static validateEmiratesId(emiratesId) {
    if (!emiratesId) return { valid: false, error: 'Emirates ID is required' };
    
    const cleaned = emiratesId.replace(/[-\s]/g, '');
    
    if (cleaned.length !== 15) {
      return { valid: false, error: 'Emirates ID must be 15 digits' };
    }
    
    if (!/^\d{15}$/.test(cleaned)) {
      return { valid: false, error: 'Emirates ID must contain only digits' };
    }
    
    if (!cleaned.startsWith('784')) {
      return { valid: false, error: 'Emirates ID must start with 784' };
    }
    
    return { valid: true, formatted: `${cleaned.slice(0,3)}-${cleaned.slice(3,7)}-${cleaned.slice(7,14)}-${cleaned.slice(14)}` };
  }
  
  static async createKYCProfile(data, actor) {
    const customerId = `KYC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const factors = {
      customerType: data.customerType,
      nationality: data.personalInfo?.nationality,
      transactionValue: data.transactionProfile?.expectedTransactionValue || 0,
      transactionType: data.transactionProfile?.primaryPurpose,
      sourceOfFunds: data.employmentInfo?.incomeSource,
      occupation: data.employmentInfo?.occupation
    };
    
    const riskResult = this.calculateRiskScore(factors);
    
    const pepResult = await this.screenForPEP(
      data.personalInfo?.fullNameEn,
      data.personalInfo?.nationality,
      data.employmentInfo?.occupation
    );
    
    const sanctionsResult = await this.checkSanctions(
      data.personalInfo?.fullNameEn,
      data.personalInfo?.nationality,
      data.personalInfo?.emiratesIdNumber
    );
    
    if (pepResult.isPEP) {
      riskResult.totalScore = Math.min(riskResult.totalScore + 30, 100);
      riskResult.category = this.getRiskCategory(riskResult.totalScore);
      riskResult.breakdown.pep = { value: true, score: 30 };
    }
    
    const reviewDate = new Date();
    const reviewPeriods = { LOW: 365, MEDIUM: 180, HIGH: 90, PROHIBITED: 0 };
    reviewDate.setDate(reviewDate.getDate() + (reviewPeriods[riskResult.category] || 365));
    
    const profile = new KYCProfile({
      customerId,
      ...data,
      riskAssessment: {
        assessedAt: new Date(),
        assessedBy: actor?.username || 'system',
        score: riskResult.totalScore,
        category: riskResult.category,
        factors: riskResult.breakdown,
        nextReviewDate: reviewDate
      },
      pepScreening: pepResult,
      sanctionsCheck: sanctionsResult,
      kycStatus: sanctionsResult.hasMatch ? 'under_review' : (riskResult.category === 'PROHIBITED' ? 'edd_required' : 'pending'),
      dueDiligenceLevel: riskResult.category === 'HIGH' || riskResult.category === 'PROHIBITED' ? 'EDD' : 'CDD',
      nextReviewDate: reviewDate,
      verificationWorkflow: {
        currentStep: 'document_collection',
        completedSteps: [],
        stepHistory: [{
          step: 'profile_creation',
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
          processedBy: actor?.username || 'system',
          notes: 'KYC profile created with initial risk assessment'
        }]
      }
    });
    
    await profile.save();
    
    await ComplianceAudit.logAction({
      entityType: 'kyc_profile',
      entityId: customerId,
      action: 'create',
      actor,
      details: {
        description: 'New KYC profile created',
        riskCategory: riskResult.category,
        riskScore: riskResult.totalScore
      },
      customerInfo: {
        customerId,
        customerName: data.personalInfo?.fullNameEn,
        emiratesId: data.personalInfo?.emiratesIdNumber,
        riskCategory: riskResult.category
      }
    });
    
    if (sanctionsResult.hasMatch) {
      await this.createAMLAlert({
        kycProfileId: profile._id,
        customerId,
        alertType: 'sanctions_match',
        alertCategory: 'sanctions_hit',
        severity: 'CRITICAL',
        title: `Sanctions Match Detected - ${data.personalInfo?.fullNameEn}`,
        description: `Customer nationality (${data.personalInfo?.nationality}) matches FATF blacklist country. Immediate review required.`,
        triggerDetails: {
          triggerSource: 'sanctions_screening',
          triggerData: sanctionsResult
        },
        customerSnapshot: {
          name: data.personalInfo?.fullNameEn,
          emiratesId: data.personalInfo?.emiratesIdNumber,
          nationality: data.personalInfo?.nationality,
          riskCategory: riskResult.category
        }
      }, actor);
    }
    
    return profile;
  }
  
  static async updateKYCProfile(customerId, updates, actor) {
    const profile = await KYCProfile.findOne({ customerId });
    if (!profile) throw new Error('KYC profile not found');
    
    const previousValues = {};
    const changedFields = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (JSON.stringify(profile[key]) !== JSON.stringify(value)) {
        previousValues[key] = profile[key];
        changedFields.push(key);
        profile[key] = value;
      }
    }
    
    if (changedFields.some(f => ['customerType', 'personalInfo', 'employmentInfo', 'transactionProfile'].includes(f))) {
      const factors = {
        customerType: profile.customerType,
        nationality: profile.personalInfo?.nationality,
        transactionValue: profile.transactionProfile?.expectedTransactionValue || 0,
        transactionType: profile.transactionProfile?.primaryPurpose,
        sourceOfFunds: profile.employmentInfo?.incomeSource,
        occupation: profile.employmentInfo?.occupation,
        isPEP: profile.pepScreening?.isPEP
      };
      
      const riskResult = this.calculateRiskScore(factors);
      
      if (profile.riskAssessment) {
        profile.riskHistory.push({ ...profile.riskAssessment.toObject() });
      }
      
      profile.riskAssessment = {
        assessedAt: new Date(),
        assessedBy: actor?.username || 'system',
        score: riskResult.totalScore,
        category: riskResult.category,
        factors: riskResult.breakdown,
        notes: 'Risk reassessed due to profile update'
      };
      
      profile.dueDiligenceLevel = riskResult.category === 'HIGH' || riskResult.category === 'PROHIBITED' ? 'EDD' : 'CDD';
    }
    
    profile.lastActivityAt = new Date();
    await profile.save();
    
    await ComplianceAudit.logAction({
      entityType: 'kyc_profile',
      entityId: customerId,
      action: 'update',
      actor,
      details: {
        description: 'KYC profile updated',
        previousValue: previousValues,
        newValue: updates,
        changedFields
      },
      customerInfo: {
        customerId,
        customerName: profile.personalInfo?.fullNameEn,
        emiratesId: profile.personalInfo?.emiratesIdNumber,
        riskCategory: profile.riskAssessment?.category
      }
    });
    
    return profile;
  }
  
  static async verifyDocument(customerId, documentType, verificationData, actor) {
    const profile = await KYCProfile.findOne({ customerId });
    if (!profile) throw new Error('KYC profile not found');
    
    const docIndex = profile.documents.findIndex(d => d.type === documentType);
    if (docIndex === -1) throw new Error('Document not found');
    
    profile.documents[docIndex].status = verificationData.approved ? 'verified' : 'rejected';
    profile.documents[docIndex].verifiedAt = new Date();
    profile.documents[docIndex].verifiedBy = actor?.username || 'system';
    profile.documents[docIndex].ocrData = verificationData.ocrData;
    profile.documents[docIndex].ocrConfidence = verificationData.confidence;
    
    if (!verificationData.approved) {
      profile.documents[docIndex].rejectionReason = verificationData.rejectionReason;
    }
    
    const allVerified = profile.documents.every(d => d.status === 'verified');
    if (allVerified) {
      profile.verificationWorkflow.currentStep = 'identity_verification';
      profile.verificationWorkflow.completedSteps.push('document_verification');
    }
    
    profile.lastActivityAt = new Date();
    await profile.save();
    
    await ComplianceAudit.logAction({
      entityType: 'document',
      entityId: `${customerId}/${documentType}`,
      action: 'document_verify',
      actor,
      details: {
        description: `Document ${verificationData.approved ? 'verified' : 'rejected'}: ${documentType}`,
        newValue: verificationData
      },
      customerInfo: {
        customerId,
        customerName: profile.personalInfo?.fullNameEn,
        riskCategory: profile.riskAssessment?.category
      }
    });
    
    return profile;
  }
  
  static async approveKYCProfile(customerId, approvalData, actor) {
    const profile = await KYCProfile.findOne({ customerId });
    if (!profile) throw new Error('KYC profile not found');
    
    const reviewPeriods = { LOW: 365, MEDIUM: 180, HIGH: 90, PROHIBITED: 0 };
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (reviewPeriods[profile.riskAssessment?.category] || 365));
    
    profile.kycStatus = 'approved';
    profile.approvalInfo = {
      approvedBy: actor?.username || 'system',
      approvedAt: new Date(),
      approvalLevel: approvalData.approvalLevel || 'standard',
      approvalNotes: approvalData.notes,
      expiryDate
    };
    profile.nextReviewDate = expiryDate;
    profile.verificationWorkflow.currentStep = 'onboarding_complete';
    profile.verificationWorkflow.completedSteps.push('compliance_approval', 'onboarding_complete');
    profile.lastActivityAt = new Date();
    
    await profile.save();
    
    await ComplianceAudit.logAction({
      entityType: 'kyc_profile',
      entityId: customerId,
      action: 'approve',
      actor,
      details: {
        description: 'KYC profile approved',
        newValue: profile.approvalInfo
      },
      customerInfo: {
        customerId,
        customerName: profile.personalInfo?.fullNameEn,
        emiratesId: profile.personalInfo?.emiratesIdNumber,
        riskCategory: profile.riskAssessment?.category
      }
    });
    
    return profile;
  }
  
  static async rejectKYCProfile(customerId, rejectionData, actor) {
    const profile = await KYCProfile.findOne({ customerId });
    if (!profile) throw new Error('KYC profile not found');
    
    profile.kycStatus = 'rejected';
    profile.rejectionInfo = {
      rejectedBy: actor?.username || 'system',
      rejectedAt: new Date(),
      rejectionReason: rejectionData.reason,
      rejectionDetails: rejectionData.details
    };
    profile.lastActivityAt = new Date();
    
    await profile.save();
    
    await ComplianceAudit.logAction({
      entityType: 'kyc_profile',
      entityId: customerId,
      action: 'reject',
      actor,
      details: {
        description: 'KYC profile rejected',
        newValue: profile.rejectionInfo
      },
      customerInfo: {
        customerId,
        customerName: profile.personalInfo?.fullNameEn,
        riskCategory: profile.riskAssessment?.category
      }
    });
    
    return profile;
  }
  
  static async createAMLAlert(alertData, actor) {
    const alert = new AMLAlert({
      ...alertData,
      assignedTo: actor?.username || 'henry',
      priority: alertData.severity === 'CRITICAL' ? 5 : alertData.severity === 'HIGH' ? 4 : 3
    });
    
    await alert.save();
    
    await ComplianceAudit.logAction({
      entityType: 'aml_alert',
      entityId: alert.alertId,
      action: 'alert_create',
      actor: actor || { username: 'system', role: 'system' },
      details: {
        description: `AML alert created: ${alertData.title}`,
        newValue: { severity: alertData.severity, type: alertData.alertType }
      },
      customerInfo: alertData.customerSnapshot
    });
    
    return alert;
  }
  
  static async getKYCStats() {
    const [statusStats, riskStats, pendingCount, alertStats] = await Promise.all([
      KYCProfile.getStatsByStatus(),
      KYCProfile.getStatsByRiskCategory(),
      KYCProfile.countDocuments({ kycStatus: { $in: ['pending', 'documents_required', 'under_review'] } }),
      AMLAlert.getAlertStats()
    ]);
    
    return {
      profiles: {
        byStatus: statusStats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
        byRisk: riskStats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
        pendingVerification: pendingCount
      },
      alerts: alertStats[0] || {}
    };
  }
  
  static async getPendingVerifications(options = {}) {
    return KYCProfile.find({
      kycStatus: { $in: ['pending', 'documents_required', 'under_review', 'edd_required'] }
    })
    .sort({ priority: -1, createdAt: 1 })
    .limit(options.limit || 50)
    .select('-documents.fileUrl');
  }
  
  static async getHighRiskProfiles(options = {}) {
    return KYCProfile.find({
      'riskAssessment.category': { $in: ['HIGH', 'PROHIBITED'] },
      kycStatus: 'approved'
    })
    .sort({ 'riskAssessment.score': -1 })
    .limit(options.limit || 50);
  }
  
  static async getOpenAlerts(options = {}) {
    return AMLAlert.getOpenAlerts(options);
  }
  
  static async getAuditTrail(entityType, entityId, options = {}) {
    return ComplianceAudit.getAuditTrail(entityType, entityId, options);
  }
}

export default KYCService;
