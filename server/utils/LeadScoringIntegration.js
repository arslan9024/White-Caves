/**
 * Lead Scoring Integration Service - Phase 1C Part 3
 * Integrates lead scoring with existing services
 * - Updates InterviewSchedulingService with lead scores
 * - Hooks into MessageTemplateService for smart routing
 * - Triggers auto-actions based on thresholds
 */

import LeadQualificationService from '../services/LeadQualificationService.js';

export class LeadScoringIntegration {
  // Integration thresholds - what triggers auto-actions vs advisory
  static INTEGRATION_CONFIG = {
    // Interview scheduling auto-actions
    interviewScheduling: {
      hotThreshold: 80,        // Hot leads: auto-prioritize
      coldThreshold: 50,       // Cold leads: flag for review
      advisoryOnly: false      // If true, no auto-actions, just scoring
    },

    // Message routing based on temperature
    messageRouting: {
      hotTemplate: 'premium_follow_up',        // Premium template for hot leads
      warmTemplate: 'encouraging_follow_up',   // Standard encouraging template
      coldTemplate: 'nurture_inquiry'          // Nurture/alternative paths
    },

    // Resume score adjustment based on conversation
    resumeAdjustment: {
      enabled: true,
      maxAdjustment: 15,       // Can adjust resume score ±15 points
      minConversationScore: 50 // Only adjust if conversation score > 50
    },

    // Logging configuration
    logging: {
      enabled: true,
      logDecisions: true,
      auditTrail: true
    }
  };

  /**
   * Integrate lead score into interview scheduling logic
   * @param {Object} candidateData - Candidate with lead score
   * @param {Object} interviewSchedulingService - Service to update
   * @returns {Object} Integration result with routing decisions
   */
  static integrateWithInterviewScheduling(candidateData, interviewSchedulingService) {
    const { leadScore, resumeScore } = candidateData;

    if (!leadScore) {
      return {
        integrated: false,
        reason: 'No lead score available',
        advisoryMode: true
      };
    }

    const decision = {
      candidateId: candidateData.candidateId,
      temperature: leadScore.leadTemperature,
      leadScore: leadScore.overallScore,
      resumeScore: resumeScore,
      recommendations: [],
      autoActions: [],
      notes: []
    };

    // HOT LEADS: Fast-track interview
    if (leadScore.leadTemperature === 'HOT' && !this.INTEGRATION_CONFIG.interviewScheduling.advisoryOnly) {
      decision.autoActions.push({
        action: 'PRIORITIZE_INTERVIEW',
        config: {
          expediteScheduling: true,
          targetInterviewDays: 1,
          assignSeniorInterviewer: true,
          sendUrgentInvite: true
        },
        timestamp: new Date()
      });

      decision.notes.push('🔴 Hot lead: Prioritize interview scheduling');
    }

    // COLD LEADS: Flag for manual review
    if (leadScore.leadTemperature === 'COLD' && !this.INTEGRATION_CONFIG.interviewScheduling.advisoryOnly) {
      decision.autoActions.push({
        action: 'FLAG_FOR_REVIEW',
        config: {
          requiresHiringManagerApproval: true,
          alternativeRoleSuggestion: true,
          sendAlternativeOpportunities: true
        },
        timestamp: new Date()
      });

      decision.notes.push('🔵 Cold lead: Flagged for hiring manager review');
    }

    // WARM LEADS: Standard processing
    if (leadScore.leadTemperature === 'WARM') {
      decision.notes.push('🟡 Warm lead: Standard interview scheduling');
    }

    // Add recommendations from lead score
    if (leadScore.recommendations && Array.isArray(leadScore.recommendations)) {
      decision.recommendations = leadScore.recommendations;
    }

    this.logDecision('Interview Scheduling Integration', decision);

    return {
      integrated: true,
      decision,
      advisoryMode: this.INTEGRATION_CONFIG.interviewScheduling.advisoryOnly
    };
  }

  /**
   * Integrate lead score into message template routing
   * @param {Object} candidateData - Candidate with lead score
   * @param {String} interactionContext - Context of interaction
   * @returns {Object} Template routing decision
   */
  static integrateWithMessageRouting(candidateData, interactionContext = 'follow_up') {
    const { leadScore } = candidateData;

    if (!leadScore) {
      return {
        routed: false,
        reason: 'No lead score available',
        defaultTemplate: 'standard_follow_up'
      };
    }

    const routing = {
      candidateId: candidateData.candidateId,
      temperature: leadScore.leadTemperature,
      selectedTemplate: null,
      personalizationLevel: 'standard',
      urgencyLevel: 'normal',
      variables: {
        candidateName: candidateData.firstName || 'Candidate',
        leadTemperature: leadScore.leadTemperature,
        scorePercentage: Math.round(leadScore.overallScore),
        qualificationLevel: leadScore.qualificationLevel
      },
      reasoning: []
    };

    // Select template based on temperature
    if (leadScore.leadTemperature === 'HOT') {
      routing.selectedTemplate = this.INTEGRATION_CONFIG.messageRouting.hotTemplate;
      routing.personalizationLevel = 'premium';
      routing.urgencyLevel = 'high';
      routing.reasoning.push('Premium template for high-quality lead');
      routing.variables.premiumTreatment = true;
      routing.variables.interviewerName = 'Senior Team Member'; // Could be populated with actual name
    } else if (leadScore.leadTemperature === 'WARM') {
      routing.selectedTemplate = this.INTEGRATION_CONFIG.messageRouting.warmTemplate;
      routing.personalizationLevel = 'encouraging';
      routing.urgencyLevel = 'normal';
      routing.reasoning.push('Encouraging template for developing lead');
    } else if (leadScore.leadTemperature === 'COLD') {
      routing.selectedTemplate = this.INTEGRATION_CONFIG.messageRouting.coldTemplate;
      routing.personalizationLevel = 'nurture';
      routing.urgencyLevel = 'low';
      routing.reasoning.push('Nurture template for cold lead');
      routing.variables.alternativeRoles = ['Role 1', 'Role 2']; // Could be populated
    }

    // Adjust based on intent
    if (leadScore.intentAnalysis?.type === 'skills_match_concern') {
      routing.specialHandling = 'SKILL_MATCH_ADDRESSED';
      routing.variables.skillsGapInfo = 'training_available';
      routing.reasoning.push('Addressing skills match concerns');
    }

    if (leadScore.intentAnalysis?.type === 'urgency_signal') {
      routing.urgencyLevel = 'high';
      routing.variables.expeditedTimeline = true;
      routing.reasoning.push('Responding to time-sensitive candidate');
    }

    this.logDecision('Message Routing Integration', routing);

    return {
      routed: true,
      routing
    };
  }

  /**
   * Adjust resume score based on conversation signals
   * Only adjust if conversation shows significant strength or weakness
   * @param {Number} resumeScore - Original resume score
   * @param {Object} conversationMetrics - Conversation analysis
   * @param {Object} intentAnalysis - Intent analysis
   * @returns {Object} Adjustment result
   */
  static adjustResumeScoreBySentiment(resumeScore, conversationMetrics, intentAnalysis) {
    if (!this.INTEGRATION_CONFIG.resumeAdjustment.enabled) {
      return {
        adjusted: false,
        originalScore: resumeScore,
        finalScore: resumeScore,
        reason: 'Resume adjustment disabled'
      };
    }

    const conversationScore = conversationMetrics?.engagementScore || 0;

    // Only adjust if conversation score is significant
    if (conversationScore < this.INTEGRATION_CONFIG.resumeAdjustment.minConversationScore) {
      return {
        adjusted: false,
        originalScore: resumeScore,
        finalScore: resumeScore,
        reason: 'Conversation score too low to adjust'
      };
    }

    let adjustment = 0;
    const adjustmentReasons = [];

    // Positive adjustments
    if (intentAnalysis?.sentiment > 0.5) {
      adjustment += 5;
      adjustmentReasons.push('Very positive sentiment in conversation');
    } else if (intentAnalysis?.sentiment > 0) {
      adjustment += 2;
      adjustmentReasons.push('Positive sentiment in conversation');
    }

    // Engagement bonus
    if (conversationScore > 75) {
      adjustment += 5;
      adjustmentReasons.push('High engagement with role');
    } else if (conversationScore > 50) {
      adjustment += 2;
      adjustmentReasons.push('Moderate engagement with role');
    }

    // Negative adjustments
    if (intentAnalysis?.sentiment < -0.5) {
      adjustment -= 5;
      adjustmentReasons.push('Very negative sentiment or concerns');
    }

    // Cap adjustment
    adjustment = Math.max(
      -this.INTEGRATION_CONFIG.resumeAdjustment.maxAdjustment,
      Math.min(this.INTEGRATION_CONFIG.resumeAdjustment.maxAdjustment, adjustment)
    );

    const finalScore = Math.max(0, Math.min(100, resumeScore + adjustment));

    return {
      adjusted: adjustment !== 0,
      originalScore: resumeScore,
      adjustment,
      finalScore,
      reasons: adjustmentReasons,
      timestamp: new Date()
    };
  }

  /**
   * Get holistic candidate assessment combining all signals
   * @param {Object} candidateData - Complete candidate data
   * @returns {Object} Comprehensive assessment
   */
  static generateComprehensiveAssessment(candidateData) {
    const { leadScore, resumeScore } = candidateData;

    if (!leadScore) {
      return {
        assessment: 'Incomplete',
        reason: 'Lead score not available'
      };
    }

    const assessment = {
      candidateId: candidateData.candidateId,
      generatedAt: new Date(),

      // Overall recommendation
      overallRecommendation: this.getOverallRecommendation(leadScore),

      // Strength assessment
      strengths: this.identifyStrengths(leadScore, resumeScore),
      weaknesses: this.identifyWeaknesses(leadScore, resumeScore),

      // Fit assessment
      jobFit: {
        resumeFit: resumeScore >= 70 ? 'Strong' : resumeScore >= 50 ? 'Moderate' : 'Weak',
        conversationFit: leadScore.conversationMetrics.engagementScore >= 70 ? 'Engaged' : 'Moderate',
        culturalFit: this.assessCulturalFit(leadScore)
      },

      // Risk assessment
      riskLevel: this.assessRisk(leadScore),

      // Next steps
      recommendedActions: leadScore.recommendations,

      // Interview readiness
      interviewReadiness: {
        prepared: leadScore.intentAnalysis?.confidence > 0.8,
        engaged: leadScore.conversationMetrics.engagementScore > 70,
        qualificationMatch: leadScore.qualificationLevel !== 'Poor'
      }
    };

    this.logDecision('Comprehensive Assessment', assessment);

    return assessment;
  }

  /**
   * Determine overall recommendation
   * @param {Object} leadScore
   * @returns {String}
   */
  static getOverallRecommendation(leadScore) {
    const score = leadScore.overallScore;

    if (score >= 85) {
      return '✅ STRONGLY RECOMMEND - Schedule interview immediately';
    } else if (score >= 70) {
      return '✓ RECOMMEND - Schedule interview within week';
    } else if (score >= 55) {
      return '⚠ CONSIDER - Review and follow up to assess further';
    } else if (score >= 40) {
      return '✗ UNLIKELY - Consider for alternative roles';
    } else {
      return '✗✗ NOT RECOMMENDED - Archive for future reference';
    }
  }

  /**
   * Identify candidate strengths from assessment
   * @param {Object} leadScore
   * @param {Number} resumeScore
   * @returns {Array}
   */
  static identifyStrengths(leadScore, resumeScore) {
    const strengths = [];

    if (resumeScore >= 75) strengths.push('Strong resume match');
    if (leadScore.conversationMetrics.engagementScore >= 75) strengths.push('High engagement level');
    if (leadScore.intentAnalysis?.sentiment > 0.5) strengths.push('Positive outlook and enthusiasm');
    if (leadScore.qualificationLevel === 'Excellent') strengths.push('Excellent qualification signals');
    if (leadScore.conversationMetrics.avgResponseTime < 10) strengths.push('Responsive and attentive');

    return strengths.length > 0 ? strengths : ['Meets minimum requirements'];
  }

  /**
   * Identify candidate weaknesses from assessment
   * @param {Object} leadScore
   * @param {Number} resumeScore
   * @returns {Array}
   */
  static identifyWeaknesses(leadScore, resumeScore) {
    const weaknesses = [];

    if (resumeScore < 60) weaknesses.push('Resume has gaps or less relevant experience');
    if (leadScore.conversationMetrics.engagementScore < 40) weaknesses.push('Low engagement level');
    if (leadScore.intentAnalysis?.sentiment < -0.3) weaknesses.push('Concerns or skepticism detected');
    if (leadScore.qualificationLevel === 'Poor') weaknesses.push('Poor qualification signals');
    if (leadScore.conversationMetrics.messageCount < 3) weaknesses.push('Limited conversation history');

    return weaknesses;
  }

  /**
   * Assess cultural fit from conversation
   * @param {Object} leadScore
   * @returns {String}
   */
  static assessCulturalFit(leadScore) {
    const sentiment = leadScore.intentAnalysis?.sentiment || 0;
    const engagement = leadScore.conversationMetrics.engagementScore || 0;

    if (sentiment > 0.3 && engagement > 70) {
      return 'Likely Good Fit';
    } else if (sentiment > -0.3 && engagement > 40) {
      return 'Possible Fit';
    } else {
      return 'Uncertain Fit';
    }
  }

  /**
   * Assess risk level
   * @param {Object} leadScore
   * @returns {String}
   */
  static assessRisk(leadScore) {
    const score = leadScore.overallScore;
    const sentiment = leadScore.intentAnalysis?.sentiment || 0;

    if (score < 40 || sentiment < -0.5) {
      return 'High Risk';
    } else if (score < 60 || sentiment < 0) {
      return 'Medium Risk';
    } else {
      return 'Low Risk';
    }
  }

  /**
   * Log integration decision for audit trail
   * @param {String} context
   * @param {Object} decision
   */
  static logDecision(context, decision) {
    if (!this.INTEGRATION_CONFIG.logging.enabled) return;

    const logEntry = {
      context,
      decision,
      timestamp: new Date(),
      logLevel: 'INFO'
    };

    if (this.INTEGRATION_CONFIG.logging.logDecisions) {
      console.log(`[${context}]`, JSON.stringify(logEntry, null, 2));
    }

    // Could be extended to save to database for audit trail
    if (this.INTEGRATION_CONFIG.logging.auditTrail) {
      // audit_log_collection.insert(logEntry);
    }
  }
}

export default LeadScoringIntegration;
