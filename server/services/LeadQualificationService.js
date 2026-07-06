/**
 * Lead Qualification Service - Phase 1C Part 3
 * Combines resume score + conversation metrics + intent analysis
 * Generates comprehensive lead quality score (0-100) and lead temperature
 */

import ConversationMetricsAnalyzer from './ConversationMetricsAnalyzer.js';
import EnhancedIntentDetectionService from './EnhancedIntentDetectionService.js';
import Sentiment from 'sentiment';

const sentimentAnalyzer = new Sentiment();

export class LeadQualificationService {
  // Temperature thresholds
  static TEMPERATURE_THRESHOLDS = {
    HOT: { min: 80, max: 100, label: 'Hot' },
    WARM: { min: 60, max: 79, label: 'Warm' },
    COLD: { min: 0, max: 59, label: 'Cold' }
  };

  // Lead quality factors and their weights
  static SCORE_WEIGHTS = {
    resumeScore: 0.40,        // 40% - Resume/application quality
    conversationScore: 0.25,  // 25% - Conversation metrics
    intentScore: 0.20,        // 20% - Intent alignment
    engagementVelocity: 0.10, // 10% - How quickly engagement is growing
    sentimentScore: 0.05      // 5% - Overall sentiment trend
  };

  /**
   * Calculate comprehensive lead qualification score
   * @param {Number} resumeScore - Resume screening score (0-100)
   * @param {Array} conversationMessages - Array of message objects
   * @param {String} candidateId - For reference
   * @param {Object} previousLeadScore - Previous score for velocity calculation
   * @returns {Object} Comprehensive lead score with all components
   */
  static calculateLeadScore(resumeScore, conversationMessages, candidateId, previousLeadScore = null) {
    // Validate inputs
    const validResumeScore = Math.max(0, Math.min(100, resumeScore || 0));

    // Get conversation metrics
    const conversationMetrics = ConversationMetricsAnalyzer.analyzeConversation(
      conversationMessages || []
    );

    // Analyze intent from latest message
    const latestMessage = conversationMessages && conversationMessages.length > 0
      ? conversationMessages[conversationMessages.length - 1].content
      : '';
    
    const intentAnalysis = EnhancedIntentDetectionService.detectIntent(
      latestMessage,
      (conversationMessages || []).slice(-5)
    );

    // Get qualification assessment
    const qualificationAssessment = EnhancedIntentDetectionService.assessQualification(
      conversationMessages || []
    );

    // Calculate individual scores
    const conversationScore = conversationMetrics.engagementScore;
    const intentScore = this.calculateIntentScore(intentAnalysis, qualificationAssessment);
    const engagementVelocity = this.calculateEngagementVelocity(
      conversationMetrics,
      previousLeadScore
    );
    const sentimentScore = this.calculateSentimentScore(conversationMessages);

    // Calculate composite score using weighted formula
    const compositeScore = 
      (validResumeScore * this.SCORE_WEIGHTS.resumeScore) +
      (conversationScore * this.SCORE_WEIGHTS.conversationScore) +
      (intentScore * this.SCORE_WEIGHTS.intentScore) +
      (engagementVelocity * this.SCORE_WEIGHTS.engagementVelocity) +
      (sentimentScore * this.SCORE_WEIGHTS.sentimentScore);

    // Ensure score is between 0-100
    const finalScore = Math.max(0, Math.min(100, compositeScore));

    // Determine lead temperature
    const temperature = this.determineTemperature(finalScore, engagementVelocity);

    // Generate reasoning and recommendations
    const reasoning = this.generateReasoning(
      finalScore,
      validResumeScore,
      conversationScore,
      intentScore,
      temperature
    );

    return {
      candidateId,
      overallScore: parseFloat(finalScore.toFixed(1)),
      scoreBreakdown: {
        resumeScore: parseFloat(validResumeScore.toFixed(1)),
        conversationScore: parseFloat(conversationScore.toFixed(1)),
        intentScore: parseFloat(intentScore.toFixed(1)),
        engagementVelocity: parseFloat(engagementVelocity.toFixed(1)),
        sentimentScore: parseFloat(sentimentScore.toFixed(1))
      },
      leadTemperature: temperature,
      qualificationLevel: qualificationAssessment.qualificationLevel,
      reasoning,
      conversationMetrics: {
        messageCount: conversationMetrics.messageCount,
        avgResponseTime: conversationMetrics.avgResponseTime,
        engagementScore: conversationMetrics.engagementScore,
        conversationDuration: conversationMetrics.conversationDuration
      },
      intentAnalysis: {
        primaryIntent: intentAnalysis.type,
        intentConfidence: intentAnalysis.confidence,
        sentiment: intentAnalysis.sentiment,
        sentimentLabel: intentAnalysis.sentimentLabel
      },
      recommendations: this.generateRecommendations(
        temperature,
        intentAnalysis.type,
        qualificationAssessment
      ),
      scoredAt: new Date().toISOString()
    };
  }

  /**
   * Calculate intent score (0-100) from intent analysis
   * @param {Object} intentAnalysis
   * @param {Object} qualificationAssessment
   * @returns {Number} Intent score
   */
  static calculateIntentScore(intentAnalysis, qualificationAssessment) {
    let score = 0;

    // Base score from primary intent confidence
    const intentConfidence = intentAnalysis.confidence || 0;
    score += intentConfidence * 50; // Up to 50 points

    // Bonus for positive intents
    const positiveIntents = [
      'interested',
      'role_interest',
      'deep_inquiry',
      'urgency_signal',
      'qualified_prospect'
    ];

    if (positiveIntents.includes(intentAnalysis.type)) {
      score += 30;
    } else if (intentAnalysis.type === 'question' || intentAnalysis.type === 'job_fit_question') {
      score += 20;
    } else if (intentAnalysis.type === 'unsure') {
      score += 10;
    }

    // Sentiment adjustment
    const sentiment = intentAnalysis.sentiment || 0;
    score += Math.max(0, sentiment * 10); // Positive sentiment adds up to 10 points

    // Qualification assessment bonus
    if (qualificationAssessment && qualificationAssessment.positiveSignalCount > 0) {
      score += Math.min(10, qualificationAssessment.positiveSignalCount * 3);
    }

    return Math.min(100, score);
  }

  /**
   * Calculate engagement velocity (how quickly is engagement growing?)
   * @param {Object} currentMetrics
   * @param {Object} previousLeadScore
   * @returns {Number} Velocity score (0-100)
   */
  static calculateEngagementVelocity(currentMetrics, previousLeadScore) {
    // If no previous score, use current engagement as baseline
    if (!previousLeadScore) {
      return currentMetrics.engagementScore;
    }

    const previousEngagementScore = previousLeadScore.scoreBreakdown?.conversationScore || 0;
    const currentEngagementScore = currentMetrics.engagementScore;
    
    // Calculate improvement rate
    const improvement = currentEngagementScore - previousEngagementScore;
    
    // If engagement is improving, boost the score
    // Maximum boost: 20 points
    const velocityBoost = Math.min(20, Math.max(-20, improvement));
    
    return currentEngagementScore + (velocityBoost * 0.5);
  }

  /**
   * Calculate sentiment score across all messages
   * @param {Array} messages
   * @returns {Number} Sentiment score (0-100, normalized from -1 to 1)
   */
  static calculateSentimentScore(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
      return 50; // Neutral
    }

    let totalSentiment = 0;
    let validMessages = 0;

    messages.forEach(msg => {
      if (msg.content) {
        const sentiment = sentimentAnalyzer.analyze(msg.content);
        // Normalize comparative sentiment to 0-100 scale
        // comparative ranges from about -5 to 5, normalize to -1 to 1, then to 0-100
        const normalized = Math.max(-1, Math.min(1, sentiment.comparative));
        const score = ((normalized + 1) / 2) * 100; // 0-100
        totalSentiment += score;
        validMessages++;
      }
    });

    if (validMessages === 0) return 50;
    return totalSentiment / validMessages;
  }

  /**
   * Determine lead temperature (Hot/Warm/Cold)
   * @param {Number} score
   * @param {Number} engagementVelocity
   * @returns {String}
   */
  static determineTemperature(score, engagementVelocity) {
    // Base temperature from score
    let baseTemperature = null;
    for (const [key, threshold] of Object.entries(this.TEMPERATURE_THRESHOLDS)) {
      if (score >= threshold.min && score <= threshold.max) {
        baseTemperature = key;
        break;
      }
    }

    if (!baseTemperature) {
      baseTemperature = score > 100 ? 'HOT' : 'COLD';
    }

    // Adjust based on velocity (if engagement is improving rapidly, might bump up)
    if (engagementVelocity > 70 && baseTemperature === 'WARM') {
      return 'HOT'; // Fast-warming lead
    }
    if (engagementVelocity < 30 && baseTemperature === 'WARM') {
      return 'COLD'; // Cooling lead
    }

    return baseTemperature;
  }

  /**
   * Generate human-readable reasoning for the score
   * @param {Number} score
   * @param {Number} resumeScore
   * @param {Number} conversationScore
   * @param {Number} intentScore
   * @param {String} temperature
   * @returns {String}
   */
  static generateReasoning(score, resumeScore, conversationScore, intentScore, temperature) {
    let reasoning = [];

    // Resume assessment
    if (resumeScore >= 80) {
      reasoning.push('Strong resume match');
    } else if (resumeScore >= 60) {
      reasoning.push('Good resume match');
    } else {
      reasoning.push('Resume needs review');
    }

    // Conversation assessment
    if (conversationScore >= 70) {
      reasoning.push('High engagement in conversation');
    } else if (conversationScore >= 40) {
      reasoning.push('Moderate engagement level');
    } else if (conversationScore > 0) {
      reasoning.push('Limited conversation activity');
    }

    // Intent assessment
    if (intentScore >= 70) {
      reasoning.push('Strong positive intent signals');
    } else if (intentScore >= 40) {
      reasoning.push('Mixed intent signals');
    } else {
      reasoning.push('Unclear or negative intent');
    }

    // Temperature
    reasoning.push(`Lead classified as ${temperature.toLowerCase()}`);

    return reasoning.join('. ') + '.';
  }

  /**
   * Generate actionable recommendations based on lead quality
   * @param {String} temperature
   * @param {String} primaryIntent
   * @param {Object} qualificationAssessment
   * @returns {Array} Recommendations
   */
  static generateRecommendations(temperature, primaryIntent, qualificationAssessment) {
    const recommendations = [];

    if (temperature === 'HOT') {
      recommendations.push({
        action: 'PRIORITY_INTERVIEW',
        priority: 'High',
        description: 'Schedule interview within 24 hours'
      });
      recommendations.push({
        action: 'ASSIGN_SENIOR_INTERVIEWER',
        priority: 'High',
        description: 'Assign to senior team member for premium experience'
      });
      recommendations.push({
        action: 'PERSONALIZED_FOLLOW_UP',
        priority: 'Medium',
        description: 'Send personalized role-specific information'
      });
    } else if (temperature === 'WARM') {
      recommendations.push({
        action: 'SCHEDULE_INTERVIEW',
        priority: 'Medium',
        description: 'Schedule interview within 3-5 days'
      });
      recommendations.push({
        action: 'SEND_ENCOURAGEMENT',
        priority: 'Medium',
        description: 'Send encouraging message addressing any concerns'
      });
      if (qualificationAssessment.concernCount > 0) {
        recommendations.push({
          action: 'ADDRESS_CONCERNS',
          priority: 'High',
          description: `Address identified concerns: ${qualificationAssessment.concerns
            .map(c => c.reason)
            .join(', ')}`
        });
      }
    } else if (temperature === 'COLD') {
      recommendations.push({
        action: 'NURTURE_SEQUENCE',
        priority: 'Low',
        description: 'Add to nurture email sequence'
      });
      recommendations.push({
        action: 'MANUAL_REVIEW',
        priority: 'Medium',
        description: 'Flag for hiring manager review'
      });
      recommendations.push({
        action: 'ALTERNATIVE_ROLES',
        priority: 'Low',
        description: 'Consider for future alternative roles'
      });
    }

    // Intent-based recommendations
    if (primaryIntent === 'skills_match_concern') {
      recommendations.push({
        action: 'SKILL_DEVELOPMENT_PATH',
        priority: 'Medium',
        description: 'Offer skill development or training information'
      });
    }

    if (primaryIntent === 'urgency_signal') {
      recommendations.push({
        action: 'EXPEDITE_PROCESS',
        priority: 'High',
        description: 'Expedite interview scheduling to match timeline'
      });
    }

    return recommendations;
  }

  /**
   * Get lead score history trend (improving, stable, declining)
   * @param {Array} scoreHistory - Array of previous LeadScore objects
   * @returns {Object} Trend analysis
   */
  static analyzeTrend(scoreHistory) {
    if (!Array.isArray(scoreHistory) || scoreHistory.length < 2) {
      return { trend: 'Insufficient data', direction: null, change: 0 };
    }

    const latest = scoreHistory[scoreHistory.length - 1].overallScore;
    const previous = scoreHistory[scoreHistory.length - 2].overallScore;
    const change = latest - previous;
    const changePercent = ((change / previous) * 100).toFixed(1);

    let trend = 'Stable';
    if (change > 5) trend = 'Improving';
    if (change < -5) trend = 'Declining';

    return {
      trend,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      change: parseFloat(changePercent),
      previousScore: previous,
      currentScore: latest
    };
  }
}

export default LeadQualificationService;
