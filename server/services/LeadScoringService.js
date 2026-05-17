/**
 * LeadScoringService
 * Advanced lead scoring based on behavior, engagement, and property fit
 */
class LeadScoringService {
  constructor() {
    this.scoreWeights = {
      recencyWeight: 0.25,
      frequencyWeight: 0.20,
      sentimentWeight: 0.15,
      propertyFitWeight: 0.20,
      engagementQualityWeight: 0.20,
    };

    this.scoreThresholds = {
      hot: 70,
      warm: 40,
      cold: 0,
    };
  }

  /**
   * Calculate comprehensive lead score
   */
  calculateScore(lead) {
    const scores = {
      recency: this.calculateRecencyScore(lead),
      frequency: this.calculateFrequencyScore(lead),
      sentiment: this.calculateSentimentScore(lead),
      propertyFit: this.calculatePropertyFitScore(lead),
      engagementQuality: this.calculateEngagementQualityScore(lead),
    };

    // Weighted average
    const totalScore =
      scores.recency * this.scoreWeights.recencyWeight +
      scores.frequency * this.scoreWeights.frequencyWeight +
      scores.sentiment * this.scoreWeights.sentimentWeight +
      scores.propertyFit * this.scoreWeights.propertyFitWeight +
      scores.engagementQuality * this.scoreWeights.engagementQualityWeight;

    return {
      score: Math.min(100, totalScore),
      breakdown: scores,
      level: this.getLeadLevel(totalScore),
    };
  }

  /**
   * Recency Score: How recently the lead engaged
   * Max: 30 points
   */
  calculateRecencyScore(lead) {
    if (!lead.lastInteractionDate) return 0;

    const hoursSinceLastInteraction = (new Date() - lead.lastInteractionDate) / (1000 * 60 * 60);

    if (hoursSinceLastInteraction < 1) return 30; // Interacted within last hour
    if (hoursSinceLastInteraction < 6) return 25;
    if (hoursSinceLastInteraction < 24) return 20;
    if (hoursSinceLastInteraction < 7 * 24) return 10;
    if (hoursSinceLastInteraction < 30 * 24) return 5;
    return 0; // No interaction in last 30 days
  }

  /**
   * Frequency Score: How often lead engages
   * Max: 25 points
   */
  calculateFrequencyScore(lead) {
    let score = 0;

    // Message count
    if (lead.messageCount >= 20) score += 10;
    else if (lead.messageCount >= 10) score += 8;
    else if (lead.messageCount >= 5) score += 5;
    else if (lead.messageCount >= 2) score += 2;

    // Conversation engagement (responses to bot messages)
    const responseCount = lead.conversationHistory.filter((m) => m.sender === 'user').length;
    if (responseCount >= 15) score += 10;
    else if (responseCount >= 8) score += 6;
    else if (responseCount >= 3) score += 3;

    // Return rate (came back after first interaction)
    if (lead.firstContactDate) {
      const daysSinceFirst = (new Date() - lead.firstContactDate) / (1000 * 60 * 60 * 24);
      const daysActive = lead.lastInteractionDate
        ? (lead.lastInteractionDate - lead.firstContactDate) / (1000 * 60 * 60 * 24)
        : daysSinceFirst;

      if (daysSinceFirst > 1 && responseCount > 2) score += 5; // Returns after first day
    }

    return Math.min(25, score);
  }

  /**
   * Sentiment Score: Positivity of lead interactions
   * Max: 20 points
   */
  calculateSentimentScore(lead) {
    if (!lead.nlpAnalysis) return 10; // Default neutral

    const { sentiment } = lead.nlpAnalysis;

    if (sentiment === 'positive') return 20;
    if (sentiment === 'neutral') return 10;
    return 0; // negative
  }

  /**
   * Property Fit Score: How well lead matches available properties
   * Max: 25 points
   */
  calculatePropertyFitScore(lead) {
    let score = 0;

    // Has specified preferences
    if (lead.preferredAreas && lead.preferredAreas.length > 0) score += 5;
    if (lead.budgetMin || lead.budgetMax) score += 5;
    if (lead.propertyType && lead.propertyType.length > 0) score += 5;
    if (lead.bedrooms) score += 5;

    // Has viewed/saved properties
    if (lead.propertyIds && lead.propertyIds.length > 0) {
      score += Math.min(10, lead.propertyIds.length * 2);
    }

    return Math.min(25, score);
  }

  /**
   * Engagement Quality Score: Quality of interactions (intent clarity)
   * Max: 20 points
   */
  calculateEngagementQualityScore(lead) {
    let score = 0;

    // Intent is clear and qualified
    if (lead.nlpAnalysis && lead.nlpAnalysis.intent) {
      const qualifiedIntents = [
        'schedule_viewing',
        'property_inquiry',
        'price_inquiry',
        'contact_agent',
      ];
      if (qualifiedIntents.includes(lead.nlpAnalysis.intent)) score += 10;
      else if (lead.nlpAnalysis.intent !== 'help') score += 5;
    }

    // Lead type indicates intent
    if (lead.leadType !== 'other') score += 5;

    // Multiple entities detected (specific needs)
    if (lead.nlpAnalysis && lead.nlpAnalysis.entities) {
      const entityCount = Object.keys(lead.nlpAnalysis.entities).length;
      if (entityCount >= 3) score += 5;
    }

    return Math.min(20, score);
  }

  /**
   * Get lead classification based on score
   */
  getLeadLevel(score) {
    if (score >= this.scoreThresholds.hot) return 'hot';
    if (score >= this.scoreThresholds.warm) return 'warm';
    return 'cold';
  }

  /**
   * Predict lead conversion probability (0-1)
   */
  predictConversionProbability(lead) {
    const { score, level } = this.calculateScore(lead);

    // Base conversion probability by level
    let baseProbability = {
      hot: 0.6,
      warm: 0.3,
      cold: 0.1,
    }[level];

    // Adjustments
    if (lead.status === 'qualified') baseProbability += 0.1;
    if (lead.assignedAgentId) baseProbability += 0.15;
    if (lead.conversationHistory.length > 15) baseProbability += 0.05;

    return Math.min(0.95, baseProbability);
  }

  /**
   * Get recommended next actions for lead
   */
  getRecommendedActions(lead) {
    const actions = [];
    const { level } = this.calculateScore(lead);

    if (level === 'hot') {
      if (!lead.assignedAgentId) {
        actions.push({
          priority: 'HIGH',
          action: 'assign_agent',
          description: 'Assign hot lead to dedicated agent immediately',
        });
      }
      if (lead.status === 'new') {
        actions.push({
          priority: 'HIGH',
          action: 'send_personalized_offer',
          description: 'Send personalized property offer matching lead preferences',
        });
      }
      if (lead.conversationHistory.length < 5) {
        actions.push({
          priority: 'MEDIUM',
          action: 'schedule_viewing',
          description: 'Suggest scheduling property viewing',
        });
      }
    }

    if (level === 'warm') {
      if (!lead.assignedAgentId) {
        actions.push({
          priority: 'MEDIUM',
          action: 'assign_agent',
          description: 'Assign warm lead to agent for nurturing',
        });
      }
      if (!lead.propertyIds || lead.propertyIds.length === 0) {
        actions.push({
          priority: 'MEDIUM',
          action: 'send_property_suggestions',
          description: 'Send property suggestions based on preferences',
        });
      }
    }

    if (level === 'cold') {
      if (lead.lastInteractionDate && new Date() - lead.lastInteractionDate > 7 * 24 * 60 * 60 * 1000) {
        actions.push({
          priority: 'LOW',
          action: 'send_re_engagement',
          description: 'Send re-engagement message after inactivity',
        });
      }
    }

    // Always applicable actions
    if (lead.nlpAnalysis && lead.nlpAnalysis.sentiment === 'positive') {
      actions.push({
        priority: 'MEDIUM',
        action: 'encourage_referral',
        description: 'Encourage lead to refer friends/family',
      });
    }

    return actions;
  }

  /**
   * Batch score multiple leads
   */
  scoreLeads(leads) {
    return leads.map((lead) => ({
      ...lead.toObject(),
      scoring: this.calculateScore(lead),
      recommendedActions: this.getRecommendedActions(lead),
      conversionProbability: this.predictConversionProbability(lead),
    }));
  }
}

module.exports = new LeadScoringService();
