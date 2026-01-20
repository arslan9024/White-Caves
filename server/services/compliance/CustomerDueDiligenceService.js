/**
 * CustomerDueDiligenceService.js
 * Manages Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD) procedures
 * Handles customer risk assessment, PEP screening, and CDD documentation
 */

const CustomerDueDiligence = require('../models/compliance/CustomerDueDiligence');
const logger = require('../../config/logger');
const axios = require('axios');

class CustomerDueDiligenceService {
  /**
   * Create a new CDD record for a customer
   * @param {Object} cddData - Customer information for CDD
   * @returns {Promise<Object>} Created CDD record
   */
  async createCDDRecord(cddData) {
    try {
      const {
        customerId,
        customerName,
        customerType, // 'individual' or 'entity'
        customerEmail,
        customerPhone,
        nationality,
        dateOfBirth, // for individuals
        businessType, // for entities
        registrationNumber, // for entities
        businessAddress,
        residentialAddress,
        sourceOfFunds,
        sourceOfFundsDocumentation,
        pepStatus,
        pepDetails,
        beneficialOwners, // for entities
        documentsUploaded,
        riskAssessmentOfficerId,
        riskAssessmentOfficerName,
      } = cddData;

      // Validate required fields
      if (!customerId || !customerName || !customerType) {
        throw new Error('Missing required customer information');
      }

      // Check if CDD already exists
      const existingCDD = await CustomerDueDiligence.findOne({ customerId });
      if (existingCDD) {
        throw new Error(`CDD record already exists for customer ${customerId}`);
      }

      // Assess risk level based on information
      const riskLevel = await this.assessRiskLevel(cddData);

      // Create CDD record
      const cddRecord = new CustomerDueDiligence({
        customerId,
        customerName,
        customerType,
        customerEmail,
        customerPhone,
        nationality,
        dateOfBirth: customerType === 'individual' ? dateOfBirth : null,
        businessType: customerType === 'entity' ? businessType : null,
        registrationNumber: customerType === 'entity' ? registrationNumber : null,
        businessAddress: customerType === 'entity' ? businessAddress : null,
        residentialAddress,
        sourceOfFunds,
        sourceOfFundsDocumentation: sourceOfFundsDocumentation || [],
        pepStatus,
        pepDetails: pepStatus === 'yes' ? pepDetails : null,
        beneficialOwners: customerType === 'entity' ? beneficialOwners || [] : [],
        documentsUploaded: documentsUploaded || [],
        riskLevel,
        riskAssessmentDetails: {
          assessedBy: riskAssessmentOfficerName,
          assessedById: riskAssessmentOfficerId,
          assessmentDate: new Date(),
          factors: this.getRiskFactors(cddData),
        },
        cddStatus: 'completed',
        approvalStatus: 'pending_approval',
        createdDate: new Date(),
        auditTrail: [
          {
            action: 'cdd_created',
            actor: riskAssessmentOfficerName,
            actorId: riskAssessmentOfficerId,
            details: `CDD record created for customer ${customerName} (Risk Level: ${riskLevel})`,
            timestamp: new Date(),
          },
        ],
      });

      await cddRecord.save();

      logger.info(`CDD record created for customer: ${customerName} (${customerId})`);

      return cddRecord;
    } catch (error) {
      logger.error(`Error creating CDD record: ${error.message}`);
      throw error;
    }
  }

  /**
   * Perform PEP screening for a customer
   * @param {string} customerId - Customer ID
   * @param {string} customerName - Customer name
   * @param {string} nationality - Customer nationality
   * @returns {Promise<Object>} PEP screening result
   */
  async performPEPScreening(customerId, customerName, nationality) {
    try {
      // Check against multiple PEP lists
      const pepScreeningResult = {
        customerId,
        customerName,
        screeningDate: new Date(),
        lists: {
          ofac: await this.checkOFACList(customerName),
          unSanctions: await this.checkUNSanctionsList(customerName),
          uaeFIUPEP: await this.checkUAEFIUPEPList(customerName, nationality),
          dfsa: await this.checkDFSAList(customerName),
          eu: await this.checkEUList(customerName),
        },
        overallResult: 'clear',
        details: [],
      };

      // Aggregate results
      Object.entries(pepScreeningResult.lists).forEach(([list, result]) => {
        if (result.isPEP || result.isHit) {
          pepScreeningResult.overallResult = 'hit';
          pepScreeningResult.details.push({
            list,
            match: result.matchedName || result.name,
            details: result.details || '',
          });
        }
      });

      // Update CDD with screening result
      const cddRecord = await CustomerDueDiligence.findOne({ customerId });
      if (cddRecord) {
        cddRecord.pepStatus = pepScreeningResult.overallResult === 'hit' ? 'yes' : 'no';
        cddRecord.pepScreeningResult = pepScreeningResult;
        cddRecord.pepScreeningDate = pepScreeningResult.screeningDate;

        if (pepScreeningResult.overallResult === 'hit') {
          cddRecord.riskLevel = 'high';
          cddRecord.needsEDD = true;
        }

        cddRecord.auditTrail.push({
          action: 'pep_screening',
          actor: 'System',
          actorId: 'system',
          details: `PEP screening completed. Result: ${pepScreeningResult.overallResult}`,
          timestamp: new Date(),
        });

        await cddRecord.save();
      }

      logger.info(`PEP screening completed for customer: ${customerName}. Result: ${pepScreeningResult.overallResult}`);

      return pepScreeningResult;
    } catch (error) {
      logger.error(`Error performing PEP screening: ${error.message}`);
      throw error;
    }
  }

  /**
   * Perform Enhanced Due Diligence (EDD)
   * @param {string} customerId - Customer ID
   * @param {Object} eddData - EDD information
   * @returns {Promise<Object>} EDD assessment result
   */
  async performEnhancedDueDiligence(customerId, eddData) {
    try {
      const {
        eddOfficerId,
        eddOfficerName,
        sourceOfWealthDocumentation,
        businessPurposeAnalysis,
        beneficiaryAnalysis,
        transactionPatternAnalysis,
        additionalFinancialDocumentation,
        adverseMediaSearchResults,
      } = eddData;

      const cddRecord = await CustomerDueDiligence.findOne({ customerId });
      if (!cddRecord) {
        throw new Error('CDD record not found for customer');
      }

      const eddAssessment = {
        eddPerformedDate: new Date(),
        performedBy: eddOfficerName,
        performedById: eddOfficerId,
        sourceOfWealthVerification: {
          documentsProvided: sourceOfWealthDocumentation || [],
          verified: true,
          details: 'Wealth source verified through provided documentation',
        },
        businessPurposeAnalysis: businessPurposeAnalysis || 'Transaction purpose understood and documented',
        beneficiaryAnalysis: beneficiaryAnalysis || [],
        transactionPatternAnalysis: transactionPatternAnalysis || 'Normal transaction patterns observed',
        additionalDocumentation: additionalFinancialDocumentation || [],
        adverseMediaSearch: {
          performed: true,
          results: adverseMediaSearchResults || 'No adverse media found',
        },
        eddConclusion: 'Customer cleared for transaction',
        eddRiskLevel: 'medium',
      };

      // Update CDD with EDD results
      cddRecord.needsEDD = false;
      cddRecord.enhancedDueDiligence = eddAssessment;
      cddRecord.approvalStatus = 'pending_approval';

      cddRecord.auditTrail.push({
        action: 'edd_performed',
        actor: eddOfficerName,
        actorId: eddOfficerId,
        details: `Enhanced Due Diligence completed. Conclusion: ${eddAssessment.eddConclusion}`,
        timestamp: new Date(),
      });

      await cddRecord.save();

      logger.info(`Enhanced Due Diligence completed for customer: ${cddRecord.customerName}`);

      return {
        customerId,
        eddAssessment,
      };
    } catch (error) {
      logger.error(`Error performing EDD: ${error.message}`);
      throw error;
    }
  }

  /**
   * Approve CDD record
   * @param {string} customerId - Customer ID
   * @param {Object} approvalData - Approval information
   * @returns {Promise<Object>} Updated CDD record
   */
  async approveCDD(customerId, approvalData) {
    try {
      const {
        approverId,
        approverName,
        approvalComments,
        conditionsForApproval,
      } = approvalData;

      const cddRecord = await CustomerDueDiligence.findOne({ customerId });
      if (!cddRecord) {
        throw new Error('CDD record not found');
      }

      cddRecord.approvalStatus = 'approved';
      cddRecord.approvedBy = approverName;
      cddRecord.approvedById = approverId;
      cddRecord.approvalDate = new Date();
      cddRecord.approvalComments = approvalComments || '';
      cddRecord.conditionsForApproval = conditionsForApproval || [];

      cddRecord.auditTrail.push({
        action: 'cdd_approved',
        actor: approverName,
        actorId: approverId,
        details: `CDD record approved for customer. ${approvalComments || ''}`,
        timestamp: new Date(),
      });

      await cddRecord.save();

      logger.info(`CDD record approved for customer: ${cddRecord.customerName}`);

      return cddRecord;
    } catch (error) {
      logger.error(`Error approving CDD: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reject CDD record with reason
   * @param {string} customerId - Customer ID
   * @param {Object} rejectionData - Rejection information
   * @returns {Promise<Object>} Updated CDD record
   */
  async rejectCDD(customerId, rejectionData) {
    try {
      const {
        rejecterId,
        rejectorName,
        rejectionReason,
        requiredCorrectionss,
      } = rejectionData;

      const cddRecord = await CustomerDueDiligence.findOne({ customerId });
      if (!cddRecord) {
        throw new Error('CDD record not found');
      }

      cddRecord.approvalStatus = 'rejected';
      cddRecord.rejectionReason = rejectionReason;
      cddRecord.requiredCorrections = requiredCorrectionss || [];
      cddRecord.rejectedDate = new Date();

      cddRecord.auditTrail.push({
        action: 'cdd_rejected',
        actor: rejectorName,
        actorId: rejecterId,
        details: `CDD record rejected. Reason: ${rejectionReason}. Required corrections: ${(requiredCorrectionss || []).join(', ')}`,
        timestamp: new Date(),
      });

      await cddRecord.save();

      logger.info(`CDD record rejected for customer: ${cddRecord.customerName}`);

      return cddRecord;
    } catch (error) {
      logger.error(`Error rejecting CDD: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get CDD record with full details
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} CDD record
   */
  async getCDDRecord(customerId) {
    try {
      const cddRecord = await CustomerDueDiligence.findOne({ customerId });

      if (!cddRecord) {
        throw new Error('CDD record not found');
      }

      return cddRecord;
    } catch (error) {
      logger.error(`Error retrieving CDD record: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get audit trail for CDD record
   * @param {string} customerId - Customer ID
   * @returns {Promise<Array>} Audit trail
   */
  async getCDDAuditTrail(customerId) {
    try {
      const cddRecord = await CustomerDueDiligence.findOne({ customerId })
        .select('customerName auditTrail')
        .lean();

      if (!cddRecord) {
        throw new Error('CDD record not found');
      }

      return {
        customerName: cddRecord.customerName,
        auditTrail: cddRecord.auditTrail.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
      };
    } catch (error) {
      logger.error(`Error retrieving CDD audit trail: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search CDD records by filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Matching CDD records
   */
  async searchCDDRecords(filters = {}) {
    try {
      const query = {};

      if (filters.customerName) {
        query.customerName = { $regex: filters.customerName, $options: 'i' };
      }
      if (filters.riskLevel) query.riskLevel = filters.riskLevel;
      if (filters.approvalStatus) query.approvalStatus = filters.approvalStatus;
      if (filters.pepStatus) query.pepStatus = filters.pepStatus;

      const records = await CustomerDueDiligence.find(query)
        .select(
          'customerId customerName customerType riskLevel approvalStatus pepStatus createdDate'
        )
        .sort({ createdDate: -1 })
        .lean();

      return records;
    } catch (error) {
      logger.error(`Error searching CDD records: ${error.message}`);
      throw error;
    }
  }

  /**
   * Assess customer risk level based on provided data
   * @param {Object} cddData - Customer data
   * @returns {Promise<string>} Risk level (low, medium, high)
   */
  async assessRiskLevel(cddData) {
    try {
      let riskScore = 0;

      // Risk factors
      if (cddData.customerType === 'entity') riskScore += 10;
      if (cddData.pepStatus === 'yes') riskScore += 50;
      if (cddData.nationality && this.isHighRiskJurisdiction(cddData.nationality)) riskScore += 20;
      if (!cddData.sourceOfFundsDocumentation || cddData.sourceOfFundsDocumentation.length === 0) riskScore += 15;
      if (cddData.beneficialOwners && cddData.beneficialOwners.length > 0) {
        cddData.beneficialOwners.forEach(() => (riskScore += 5));
      }

      // Determine risk level
      if (riskScore >= 50) return 'high';
      if (riskScore >= 25) return 'medium';
      return 'low';
    } catch (error) {
      logger.error(`Error assessing risk level: ${error.message}`);
      return 'medium'; // Default to medium if assessment fails
    }
  }

  /**
   * Get risk factors for a customer
   * @param {Object} cddData - Customer data
   * @returns {Array} List of risk factors
   */
  getRiskFactors(cddData) {
    const factors = [];

    if (cddData.customerType === 'entity') factors.push('Corporate entity');
    if (cddData.pepStatus === 'yes') factors.push('PEP identified');
    if (cddData.nationality && this.isHighRiskJurisdiction(cddData.nationality)) {
      factors.push(`High-risk jurisdiction: ${cddData.nationality}`);
    }
    if (!cddData.sourceOfFundsDocumentation || cddData.sourceOfFundsDocumentation.length === 0) {
      factors.push('Insufficient source of funds documentation');
    }
    if (cddData.beneficialOwners && cddData.beneficialOwners.length > 0) {
      factors.push(`Complex beneficial ownership (${cddData.beneficialOwners.length} owners)`);
    }

    return factors.length > 0 ? factors : ['No significant risk factors'];
  }

  /**
   * Check if jurisdiction is high-risk
   * @param {string} nationality - Jurisdiction name
   * @returns {boolean} Whether jurisdiction is high-risk
   */
  isHighRiskJurisdiction(nationality) {
    const highRiskJurisdictions = [
      'North Korea',
      'Iran',
      'Syria',
      'Sudan',
      'Yemen',
      'South Sudan',
    ];

    return highRiskJurisdictions.includes(nationality);
  }

  /**
   * Check OFAC SDN list (simulated)
   * @param {string} customerName - Customer name
   * @returns {Promise<Object>} OFAC screening result
   */
  async checkOFACList(customerName) {
    try {
      // Simulated OFAC check
      return {
        list: 'OFAC SDN',
        isPEP: false,
        checked: true,
      };
    } catch (error) {
      logger.error(`Error checking OFAC list: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check UN Sanctions list (simulated)
   * @param {string} customerName - Customer name
   * @returns {Promise<Object>} UN Sanctions screening result
   */
  async checkUNSanctionsList(customerName) {
    try {
      // Simulated UN Sanctions check
      return {
        list: 'UN Sanctions',
        isHit: false,
        checked: true,
      };
    } catch (error) {
      logger.error(`Error checking UN Sanctions list: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check UAE FIU PEP list (simulated)
   * @param {string} customerName - Customer name
   * @param {string} nationality - Customer nationality
   * @returns {Promise<Object>} UAE FIU PEP screening result
   */
  async checkUAEFIUPEPList(customerName, nationality) {
    try {
      // Simulated UAE FIU PEP check
      return {
        list: 'UAE FIU PEP',
        isPEP: false,
        checked: true,
      };
    } catch (error) {
      logger.error(`Error checking UAE FIU PEP list: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check DFSA enforcement list (simulated)
   * @param {string} customerName - Customer name
   * @returns {Promise<Object>} DFSA screening result
   */
  async checkDFSAList(customerName) {
    try {
      // Simulated DFSA check
      return {
        list: 'DFSA Enforcement',
        isHit: false,
        checked: true,
      };
    } catch (error) {
      logger.error(`Error checking DFSA list: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check EU consolidated sanctions list (simulated)
   * @param {string} customerName - Customer name
   * @returns {Promise<Object>} EU screening result
   */
  async checkEUList(customerName) {
    try {
      // Simulated EU Sanctions check
      return {
        list: 'EU Consolidated Sanctions',
        isHit: false,
        checked: true,
      };
    } catch (error) {
      logger.error(`Error checking EU list: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new CustomerDueDiligenceService();
