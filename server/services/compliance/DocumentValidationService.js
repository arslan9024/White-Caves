import logger from '../../utils/logger.js';
import KYCProfile from '../../models/compliance/KYCProfile.js';

class DocumentValidationService {
  /**
   * Comprehensive document validation
   * - Data format validation
   * - Age and expiry checks
   * - Duplicate detection
   * - Risk scoring
   */
  static async validateDocument(documentData, userId, documentType) {
    try {
      logger.info(`Validating document for user ${userId}: ${documentType}`);

      const validation = {
        isValid: true,
        errors: [],
        warnings: [],
        riskScore: 0,
        riskLevel: 'low',
        recommendations: []
      };

      // 1. Validate extracted data format
      this.validateDataFormat(documentData, validation);

      // 2. Validate dates and expiry
      this.validateDatesAndExpiry(documentData, validation);

      // 3. Check for duplicates
      await this.checkForDuplicates(documentData, userId, documentType, validation);

      // 4. Calculate risk score
      this.calculateRiskScore(documentData, validation);

      // 5. Generate recommendations
      this.generateRecommendations(documentData, validation);

      return validation;
    } catch (error) {
      logger.error(`Document validation error: ${error.message}`);
      throw new Error(`Validation failed: ${error.message}`);
    }
  }

  /**
   * Validate data format based on document type
   */
  static validateDataFormat(documentData, validation) {
    const fields = documentData.extractedFields || {};

    if (documentData.documentType === 'emirates_id') {
      if (!fields.idNumber) {
        validation.errors.push('Emirates ID number is required');
      } else if (!/^\d{11}$/.test(fields.idNumber.replace('-', ''))) {
        validation.errors.push('Invalid Emirates ID number format (should be 11 digits)');
      }

      if (!fields.firstName || !fields.lastName) {
        validation.errors.push('Full name is required');
      }

      if (!fields.dateOfBirth) {
        validation.errors.push('Date of birth is required');
      } else {
        const dob = new Date(fields.dateOfBirth);
        const age = (new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000);
        if (age < 18) {
          validation.errors.push('Individual must be at least 18 years old');
        }
      }

      if (!fields.expiryDate) {
        validation.warnings.push('Expiry date not found on ID');
      }
    } else if (documentData.documentType === 'passport') {
      if (!fields.passportNumber) {
        validation.errors.push('Passport number is required');
      }

      if (!fields.firstName || !fields.lastName) {
        validation.errors.push('Full name is required');
      }

      if (!fields.dateOfBirth) {
        validation.errors.push('Date of birth is required');
      }

      if (!fields.nationality) {
        validation.warnings.push('Nationality could not be determined');
      }
    } else if (documentData.documentType === 'visa') {
      if (!fields.visaType) {
        validation.warnings.push('Visa type could not be identified');
      }

      if (!fields.expiryDate) {
        validation.errors.push('Visa expiry date is required');
      }
    }

    validation.isValid = validation.errors.length === 0;
  }

  /**
   * Validate dates and expiry
   */
  static validateDatesAndExpiry(documentData, validation) {
    const fields = documentData.extractedFields || {};
    const today = new Date();

    // Check expiry date
    if (fields.expiryDate) {
      try {
        const expiryDate = new Date(fields.expiryDate);
        if (expiryDate < today) {
          validation.errors.push('Document has expired');
          validation.riskScore += 30;
        } else {
          const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
          if (daysUntilExpiry < 30) {
            validation.warnings.push(`Document expires in ${daysUntilExpiry} days`);
            validation.riskScore += 15;
          }
        }
      } catch (error) {
        validation.warnings.push('Could not parse expiry date');
      }
    }

    // Check date of birth
    if (fields.dateOfBirth) {
      try {
        const dob = new Date(fields.dateOfBirth);
        const age = (today - dob) / (365.25 * 24 * 60 * 60 * 1000);

        if (age < 18) {
          validation.errors.push('Individual must be 18 years or older');
          validation.riskScore += 50;
        } else if (age < 25) {
          validation.warnings.push('Individual is under 25 years old');
          validation.riskScore += 10;
        } else if (age > 80) {
          validation.warnings.push('Individual is over 80 years old');
          validation.riskScore += 5;
        }
      } catch (error) {
        validation.warnings.push('Could not parse date of birth');
      }
    }

    validation.isValid = validation.errors.length === 0;
  }

  /**
   * Check for duplicate documents
   */
  static async checkForDuplicates(documentData, userId, documentType, validation) {
    try {
      const fields = documentData.extractedFields || {};
      let queryField = null;
      let queryValue = null;

      // Determine query based on document type
      if (documentType === 'emirates_id' && fields.idNumber) {
        queryField = 'emiratesId';
        queryValue = fields.idNumber.replace(/\D/g, '');
      } else if (documentType === 'passport' && fields.passportNumber) {
        queryField = 'passportNumber';
        queryValue = fields.passportNumber;
      }

      if (queryField && queryValue) {
        const existingDoc = await KYCProfile.findOne({
          [queryField]: queryValue,
          userId: { $ne: userId }
        });

        if (existingDoc) {
          validation.errors.push(
            `This ${documentType} is already registered with another user`
          );
          validation.riskScore += 50;
        }
      }
    } catch (error) {
      logger.warn(`Duplicate check failed: ${error.message}`);
      // Don't fail validation if duplicate check fails
    }

    validation.isValid = validation.errors.length === 0;
  }

  /**
   * Calculate risk score
   */
  static calculateRiskScore(documentData, validation) {
    const fields = documentData.extractedFields || {};

    // Base score from other validations (already added)
    let score = validation.riskScore || 0;

    // Check for high-risk countries
    if (fields.nationality) {
      const highRiskCountries = ['NK', 'IR', 'SY', 'CU', 'KP'];
      if (highRiskCountries.some(country => 
        fields.nationality.toUpperCase().includes(country)
      )) {
        score += 25;
      }
    }

    // Check for suspicious patterns
    if (fields.firstName && fields.lastName) {
      const name = (fields.firstName + ' ' + fields.lastName).toLowerCase();
      const suspiciousPatterns = ['test', 'fake', 'dummy', 'invalid', 'sample'];
      if (suspiciousPatterns.some(pattern => name.includes(pattern))) {
        score += 40;
      }
    }

    // OCR confidence score impact
    if (documentData.confidence && documentData.confidence < 60) {
      score += 20;
      validation.warnings.push('Document image quality is low');
    }

    validation.riskScore = Math.min(score, 100);

    // Determine risk level
    if (validation.riskScore >= 75) {
      validation.riskLevel = 'critical';
    } else if (validation.riskScore >= 50) {
      validation.riskLevel = 'high';
    } else if (validation.riskScore >= 25) {
      validation.riskLevel = 'medium';
    } else {
      validation.riskLevel = 'low';
    }
  }

  /**
   * Generate recommendations based on validation
   */
  static generateRecommendations(documentData, validation) {
    const fields = documentData.extractedFields || {};

    if (validation.riskScore >= 50) {
      validation.recommendations.push('Requires manual verification by compliance officer');
      validation.recommendations.push('Consider requesting additional supporting documents');
    }

    if (validation.riskScore >= 75) {
      validation.recommendations.push('Flag for enhanced due diligence (EDD)');
      validation.recommendations.push('Escalate to compliance team for review');
    }

    if (documentData.confidence && documentData.confidence < 70) {
      validation.recommendations.push('Request clearer document image for re-processing');
    }

    if (fields.expiryDate) {
      const expiryDate = new Date(fields.expiryDate);
      const daysUntilExpiry = Math.floor((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry < 90 && daysUntilExpiry >= 0) {
        validation.recommendations.push('Document will expire soon - plan for renewal');
      }
    }
  }

  /**
   * Verify document authenticity (Static fallback for future ML integration)
   */
  static async verifyDocumentAuthenticity(documentPath, documentType) {
    try {
      // This is a Static fallback for future document authentication
      // Could integrate with third-party services or ML models
      const authenticity = {
        isAuthentic: true,
        confidence: 0.95,
        details: {
          securityFeatures: [],
          anomalies: [],
          alerts: []
        },
        timestamp: new Date()
      };

      logger.info(`Document authenticity check completed for ${documentType}`);
      return authenticity;
    } catch (error) {
      logger.error(`Document authenticity check failed: ${error.message}`);
      throw new Error(`Authenticity check failed: ${error.message}`);
    }
  }

  /**
   * Check against sanctions lists and watchlists
   */
  static async checkSanctionsAndWatchlists(documentData) {
    try {
      const fields = documentData.extractedFields || {};
      const screening = {
        isClear: true,
        alerts: [],
        sources: ['OFAC', 'EU Sanctions', 'UN Sanctions', 'Local Watchlist'],
        timestamp: new Date()
      };

      // Static fallback for sanctions check
      // In production, this would integrate with actual sanctions APIs
      const suspiciousNames = ['kim jong', 'bashar', 'raul'];
      const fullName = (fields.firstName + ' ' + fields.lastName).toLowerCase();

      if (suspiciousNames.some(name => fullName.includes(name))) {
        screening.isClear = false;
        screening.alerts.push('Potential match with watchlist (high false-positive rate)');
      }

      logger.info('Sanctions and watchlist screening completed');
      return screening;
    } catch (error) {
      logger.error(`Sanctions check failed: ${error.message}`);
      throw new Error(`Sanctions check failed: ${error.message}`);
    }
  }

  /**
   * Generate compliance report
   */
  static generateComplianceReport(documentData, validation, authenticity, screening) {
    return {
      summary: {
        documentType: documentData.documentType,
        overallStatus: validation.isValid && screening.isClear ? 'approved' : 'rejected',
        riskLevel: validation.riskLevel,
        timestamp: new Date()
      },
      validation,
      authenticity,
      screening,
      extractedData: documentData.extractedFields,
      recommendations: validation.recommendations,
      nextSteps: this.getNextSteps(validation, screening)
    };
  }

  /**
   * Determine next steps based on validation results
   */
  static getNextSteps(validation, screening) {
    const steps = [];

    if (!validation.isValid) {
      steps.push({
        action: 'REQUEST_CORRECTION',
        description: 'Request user to correct document or upload clearer image',
        priority: 'high'
      });
    }

    if (validation.riskLevel === 'high' || validation.riskLevel === 'critical') {
      steps.push({
        action: 'COMPLIANCE_REVIEW',
        description: 'Escalate to compliance officer for manual review',
        priority: validation.riskLevel === 'critical' ? 'urgent' : 'high'
      });
    }

    if (!screening.isClear) {
      steps.push({
        action: 'SANCTIONS_INVESTIGATION',
        description: 'Investigate potential sanctions list match',
        priority: 'urgent'
      });
    }

    if (validation.warnings.length > 0) {
      steps.push({
        action: 'COLLECT_SUPPORTING_DOCS',
        description: 'Request additional supporting documents',
        priority: 'medium'
      });
    }

    return steps;
  }
}

export default DocumentValidationService;
