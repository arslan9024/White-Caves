/**
 * ComplianceValidationService
 * Validates Nina/Linda messages against compliance rules
 * Prevents RERA violations, guarantees, and other regulated communications
 */

class ComplianceValidationService {
  constructor() {
    this.complianceRules = this.initializeRules();
    this.violationLog = [];
  }

  /**
   * Initialize compliance rules against RERA and DLD regulations
   */
  initializeRules() {
    return {
      // RERA violation patterns
      yield_guarantee: {
        pattern: /(?:guaranteed|guarantee|promised|promise).*(?:return|yield|roi|profit|return on investment)/i,
        severity: 'critical',
        message: 'Cannot guarantee specific ROI or yields - RERA violation',
        suggestion: 'Replace with: "Based on market trends, similar properties have generated..."'
      },

      price_guarantee: {
        pattern: /(?:guaranteed|guarantee).*(?:price|appreciation|value)/i,
        severity: 'critical',
        message: 'Cannot guarantee property value appreciation',
        suggestion: 'Use: "Market analysis indicates potential for appreciation"'
      },

      illegal_frequency: {
        pattern: /(?:spam|bomb|blast|campaign).*(?:messages|contacts|numbers)/i,
        severity: 'high',
        message: 'Cannot conduct message spam or bombing campaigns',
        suggestion: 'Ensure compliance with anti-spam regulations'
      },

      unlicensed_advice: {
        pattern: /(?:investment|financing|mortgage|loan).*(?:advice|should|must|will)/i,
        severity: 'high',
        message: 'Cannot give financial or investment advice without proper licensing',
        suggestion: 'Recommend consulting with licensed financial advisor'
      },

      undisclosed_affiliation: {
        pattern: /I'm (?!from|with|representing|at).*(?:recommending|suggesting|advising)/i,
        severity: 'medium',
        message: 'Must disclose company affiliation clearly',
        suggestion: 'Include: "As a representative of [Company], I recommend..."'
      },

      omitted_information: {
        pattern: /^(?!.*(?:terms|condition|fee|cost|risk)).*(?:buy|invest|purchase)/i,
        severity: 'medium',
        message: 'Must disclose all material terms and conditions',
        suggestion: 'Include information about: terms, conditions, fees, costs, risks'
      },

      discriminatory_language: {
        pattern: /(?:only for|exclusively|restricted to|not suitable for).*(?:expats|nationals|families|single)/i,
        severity: 'critical',
        message: 'Discriminatory language or restrictions - RERA violation',
        suggestion: 'Remove discriminatory language; fair housing laws apply'
      },

      false_availability: {
        pattern: /(?:available|ready).*(?:immediately|now|today)/i,
        severity: 'high',
        message: 'Cannot claim availability without verifying current status',
        suggestion: 'Verify with Mary system first; use "expected to be available"'
      },

      misleading_features: {
        pattern: /(?:ocean view|beach|waterfront).*(?:villa|apartment)/i,
        severity: 'medium',
        message: 'Must verify actual property features and views',
        suggestion: 'Only mention confirmed features from property record'
      }
    };
  }

  /**
   * Validate a message before sending
   * Returns: { valid: boolean, violations: [], warnings: [], suggestions: [] }
   */
  validateMessage(messageText, context = {}) {
    const violations = [];
    const warnings = [];
    const suggestions = [];

    // Check against all compliance rules
    Object.entries(this.complianceRules).forEach(([ruleKey, rule]) => {
      if (rule.pattern.test(messageText)) {
        const violation = {
          rule: ruleKey,
          severity: rule.severity,
          message: rule.message,
          suggestion: rule.suggestion
        };

        if (rule.severity === 'critical') {
          violations.push(violation);
        } else if (rule.severity === 'high') {
          violations.push(violation);
        } else {
          warnings.push(violation);
        }

        suggestions.push(rule.suggestion);
      }
    });

    // Additional context-based checks
    if (context.propertyStatus === 'not_available' && this.claimsAvailability(messageText)) {
      violations.push({
        rule: 'false_availability',
        severity: 'critical',
        message: 'Property is not available - cannot claim availability',
        suggestion: `This property is currently ${context.propertyStatus}. Remove availability claims.`
      });
    }

    // Check for undisclosed property details
    if (context.propertyId && !this.hasVerifiedDetails(messageText, context)) {
      warnings.push({
        rule: 'unverified_details',
        severity: 'medium',
        message: 'Mentioning property details without verification',
        suggestion: 'Verify all property details match database before sending'
      });
    }

    return {
      valid: violations.length === 0,
      violations,
      warnings,
      suggestions: [...new Set(suggestions)],
      score: this.calculateComplianceScore(violations, warnings)
    };
  }

  /**
   * Check if message claims property is available
   */
  claimsAvailability(text) {
    const availabilityPatterns = [
      /available|ready|immediate|now|today/i,
      /move in|handover|possession/i,
      /vacant|empty|free/i
    ];
    return availabilityPatterns.some(p => p.test(text));
  }

  /**
   * Check if message mentions unverified property details
   */
  hasVerifiedDetails(text, context) {
    if (!context.propertyDetails) return true;

    const details = context.propertyDetails;

    // Check if mentioned features match database
    const mentionedFeatures = this.extractFeatures(text);
    const actualFeatures = details.tags || [];

    // All mentioned features should be in actual features
    return mentionedFeatures.every(feature =>
      actualFeatures.some(f => f.toLowerCase().includes(feature.toLowerCase()))
    );
  }

  /**
   * Extract mentioned features from message
   */
  extractFeatures(text) {
    const featureKeywords = [
      'pool', 'garden', 'gym', 'parking', 'balcony', 'laundry',
      'ac', 'kitchen', 'view', 'furnished', 'terrace', 'office',
      'maid room', 'storage', 'elevator'
    ];

    return featureKeywords.filter(feature =>
      text.toLowerCase().includes(feature.toLowerCase())
    );
  }

  /**
   * Calculate compliance score (0-100)
   * 100 = fully compliant, 0 = critical violations
   */
  calculateComplianceScore(violations, warnings) {
    let score = 100;

    // Deduct for violations
    score -= violations.length * 20; // Each critical violation = -20 points
    score -= warnings.length * 5; // Each warning = -5 points

    return Math.max(0, score);
  }

  /**
   * Suggest compliant alternative for message
   */
  suggestCompliantAlternative(messageText, violations) {
    let suggestion = messageText;

    violations.forEach(violation => {
      switch (violation.rule) {
        case 'yield_guarantee':
          suggestion = suggestion.replace(
            /guaranteed.*?(?:return|yield|roi|profit)/i,
            'potential returns based on market analysis'
          );
          break;

        case 'price_guarantee':
          suggestion = suggestion.replace(
            /guaranteed.*?(?:price|appreciation)/i,
            'historically strong property appreciation'
          );
          break;

        case 'false_availability':
          suggestion = suggestion.replace(
            /available.*?(?:immediately|now|today)/i,
            'expected to be available soon'
          );
          break;

        case 'unlicensed_advice':
          suggestion = suggestion.replace(
            /(?:investment|financing).*?advice/i,
            'I recommend consulting with a licensed financial advisor about'
          );
          break;
      }
    });

    return suggestion;
  }

  /**
   * Validate message before sending in Linda's chat
   */
  validateBeforeSending(message, context = {}) {
    const validation = this.validateMessage(message, context);

    return {
      canSend: validation.valid,
      complianceScore: validation.score,
      violations: validation.violations,
      warnings: validation.warnings,
      suggestions: validation.suggestions,
      isCompliant: validation.score >= 80 // 80+ is acceptable
    };
  }

  /**
   * Log compliance violations for audit trail
   */
  logViolation(messageText, violations, context = {}) {
    const log = {
      timestamp: new Date(),
      messageText,
      violations,
      context,
      userId: context.userId,
      propertyId: context.propertyId
    };

    this.violationLog.push(log);

    // Keep recent logs only
    if (this.violationLog.length > 1000) {
      this.violationLog.shift();
    }

    // In production, would save to database for compliance audit
    console.warn('[COMPLIANCE] Violation detected:', log);

    return log;
  }

  /**
   * Get compliance dashboard stats
   */
  getComplianceStats() {
    const total = this.violationLog.length;
    const bySeverity = {
      critical: 0,
      high: 0,
      medium: 0
    };

    this.violationLog.forEach(log => {
      log.violations.forEach(v => {
        bySeverity[v.severity]++;
      });
    });

    return {
      totalViolations: total,
      byType: this.groupViolationsByType(),
      bySeverity,
      complianceRate: total === 0 ? 100 : Math.round((1 - total / 10000) * 100),
      lastViolations: this.violationLog.slice(-10)
    };
  }

  /**
   * Group violations by type for analysis
   */
  groupViolationsByType() {
    const groups = {};

    this.violationLog.forEach(log => {
      log.violations.forEach(v => {
        groups[v.rule] = (groups[v.rule] || 0) + 1;
      });
    });

    return groups;
  }

  /**
   * Certify message as compliant with audit trail
   */
  certifyCompliantMessage(messageText, context = {}) {
    const validation = this.validateMessage(messageText, context);

    if (!validation.valid) {
      throw new Error(`Message contains compliance violations: ${validation.violations.map(v => v.message).join('; ')}`);
    }

    return {
      certified: true,
      timestamp: new Date(),
      complianceScore: validation.score,
      context,
      auditId: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }
}

export default ComplianceValidationService;
