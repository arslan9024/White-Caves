/**
 * Enhanced Intent Detection Service - Phase 1C Part 3
 * Detects 15+ intent types from candidate messages with sentiment analysis
 * Expands from basic 6 interview intents to full recruitment pipeline
 */

import Sentiment from 'sentiment';

const sentimentAnalyzer = new Sentiment();

export class EnhancedIntentDetectionService {
  // Extended intent types covering full recruitment lifecycle
  static INTENT_TYPES = {
    // Interview-related (original 6)
    SLOT_SELECTED: 'slot_selected',
    INTERESTED: 'interested',
    RESCHEDULE: 'reschedule',
    DECLINE: 'decline',
    QUESTION: 'question',
    UNSURE: 'unsure',

    // Job/Role fit assessment (new)
    JOB_FIT_QUESTION: 'job_fit_question',
    ROLE_INTEREST: 'role_interest',
    SKILLS_MATCH: 'skills_match_concern',

    // Timeline & urgency (new)
    URGENCY_SIGNAL: 'urgency_signal',
    TIMELINE_QUESTION: 'timeline_question',
    AVAILABILITY_CONCERN: 'availability_concern',

    // Engagement quality (new)
    DEEP_INQUIRY: 'deep_inquiry',
    CASUAL_INTEREST: 'casual_interest',
    OBJECTION_HANDLING: 'objection_handling',

    // Qualification indicators (new)
    QUALIFIED_PROSPECT: 'qualified_prospect'
  };

  // Pattern keywords for each intent
  static INTENT_PATTERNS = {
    slot_selected: {
      regex: /^([1-5])$/,
      keywords: [],
      confidence: 0.95
    },
    interested: {
      regex: /(schedule|book|confirm|yes|ready|let's do this|count me in|i'm interested)/i,
      keywords: ['schedule', 'book', 'confirm', 'yes', 'ready'],
      confidence: 0.90
    },
    reschedule: {
      regex: /(reschedule|different time|other time|can't make it|change|another slot|conflict|busy that day)/i,
      keywords: ['reschedule', 'different time', 'change', 'conflict'],
      confidence: 0.85
    },
    decline: {
      regex: /(decline|not interested|no thanks|not right now|cancel|not suitable|pass)/i,
      keywords: ['decline', 'not interested', 'no thanks', 'cancel'],
      confidence: 0.90
    },
    question: {
      regex: /(question\?|when|how|where|what|tell me more|more info|unclear|don't understand|can you explain)/i,
      keywords: ['question', 'when', 'how', 'where', 'explain'],
      confidence: 0.70
    },
    job_fit_question: {
      regex: /(is this role|does it involve|what does the role|role responsibilities|what are the duties|job description)/i,
      keywords: ['role', 'responsibilities', 'duties', 'job description'],
      confidence: 0.75
    },
    role_interest: {
      regex: /(excited about|looking for|interested in|perfect fit|aligns with|matches my|searching for)/i,
      keywords: ['excited', 'perfect fit', 'aligns', 'searching'],
      confidence: 0.85
    },
    skills_match_concern: {
      regex: /(require|need|required skills|do i have|missing|lack|unfamiliar|new to|learning)/i,
      keywords: ['skills', 'require', 'missing', 'learning', 'unfamiliar'],
      confidence: 0.78
    },
    urgency_signal: {
      regex: /(asap|immediately|urgent|need to start soon|quick|hurry|time sensitive|deadline)/i,
      keywords: ['asap', 'immediately', 'urgent', 'soon', 'deadline'],
      confidence: 0.85
    },
    timeline_question: {
      regex: /(when does it start|start date|how long|timeline|interview process duration|next steps)/i,
      keywords: ['when', 'start date', 'timeline', 'next steps'],
      confidence: 0.80
    },
    availability_concern: {
      regex: /(available|notice period|current job|transition|leave|free|can start|employment status)/i,
      keywords: ['available', 'notice period', 'can start', 'employment'],
      confidence: 0.82
    },
    deep_inquiry: {
      regex: /(tell me more|elaborate|details|comprehensive|full picture|thorough|in-depth|specifics)/i,
      keywords: ['elaborate', 'details', 'comprehensive', 'thorough'],
      confidence: 0.80
    },
    casual_interest: {
      regex: /(maybe|perhaps|could be|might consider|possibly|could work|interesting)/i,
      keywords: ['maybe', 'perhaps', 'possibly', 'interesting'],
      confidence: 0.70
    },
    objection_handling: {
      regex: /(but|however|concern|worry|hesitant|doubt|not sure about|what about)/i,
      keywords: ['but', 'concern', 'worry', 'doubt', 'hesitant'],
      confidence: 0.75
    }
  };

  /**
   * Detect intent from a message with multi-message context
   * @param {String} message - Current message
   * @param {Array} previousMessages - Last 5 messages for context
   * @returns {Object} Intent with type, confidence, sentiment, and reasoning
   */
  static detectIntent(message, previousMessages = []) {
    if (!message || typeof message !== 'string') {
      return {
        type: this.INTENT_TYPES.UNSURE,
        confidence: 0.5,
        sentiment: 0,
        reasoning: 'Invalid message',
        contextConfidence: 0
      };
    }

    // Calculate sentiment of the message
    const sentiment = sentimentAnalyzer.analyze(message);
    const sentimentScore = Math.min(1, Math.max(-1, sentiment.comparative)); // Normalize to -1 to 1

    // Match against all patterns
    let detectedIntents = [];
    
    for (const [intentKey, pattern] of Object.entries(this.INTENT_PATTERNS)) {
      if (pattern.regex.test(message)) {
        detectedIntents.push({
          type: intentKey,
          baseConfidence: pattern.confidence,
          sentiment: sentimentScore
        });
      }
    }

    // If no patterns match, detect based on context
    if (detectedIntents.length === 0) {
      detectedIntents.push({
        type: this.INTENT_TYPES.UNSURE,
        baseConfidence: 0.5,
        sentiment: sentimentScore
      });
    }

    // Sort by confidence and get top intent
    detectedIntents.sort((a, b) => b.baseConfidence - a.baseConfidence);
    const topIntent = detectedIntents[0];

    // Adjust confidence based on context (previous messages)
    const contextConfidence = this.analyzeContext(message, previousMessages, topIntent.type);

    // Adjust confidence based on sentiment (strong positive/negative reinforces intent)
    const sentimentAdjustment = Math.abs(sentimentScore) * 0.15; // Up to 15% boost/penalty
    let finalConfidence = topIntent.baseConfidence + (sentimentScore > 0 ? sentimentAdjustment : -sentimentAdjustment * 0.5);
    finalConfidence = Math.min(1, Math.max(0, finalConfidence));

    return {
      type: topIntent.type,
      confidence: parseFloat(finalConfidence.toFixed(2)),
      sentiment: parseFloat(sentimentScore.toFixed(2)),
      sentimentLabel: this.getSentimentLabel(sentimentScore),
      reasoning: this.generateReasoning(topIntent.type, message, sentimentScore),
      contextConfidence: contextConfidence,
      allDetected: detectedIntents.slice(0, 3) // Top 3 alternatives
    };
  }

  /**
   * Analyze context from previous messages to confirm intent
   * @param {String} currentMessage
   * @param {Array} previousMessages
   * @param {String} detectedIntent
   * @returns {Number} Confidence boost from context (0-0.3)
   */
  static analyzeContext(currentMessage, previousMessages, detectedIntent) {
    if (!Array.isArray(previousMessages) || previousMessages.length === 0) return 0;

    let contextBoost = 0;

    // Check if intent is consistent with conversation flow
    const recentIntents = previousMessages
      .slice(-3)
      .map(msg => this.detectIntent(msg.content || '').type);

    // Consistent intents get confidence boost
    const matchingPreviousIntents = recentIntents.filter(intent => intent === detectedIntent).length;
    contextBoost = (matchingPreviousIntents / 3) * 0.2; // Max 20% boost from consistency

    // Check conversation progression
    if (previousMessages.length >= 2) {
      const lastTwo = previousMessages.slice(-2);
      const progression = this.analyzeProgression(lastTwo, currentMessage, detectedIntent);
      contextBoost += progression * 0.1; // Additional 10% based on natural progression
    }

    return parseFloat(Math.min(0.3, contextBoost).toFixed(2));
  }

  /**
   * Analyze if current intent represents natural progression
   * @param {Array} lastMessages - Last 2 messages
   * @param {String} currentMessage
   * @param {String} currentIntent
   * @returns {Number} Progression score (0-1)
   */
  static analyzeProgression(lastMessages, currentMessage, currentIntent) {
    // Natural progressions that should boost confidence
    const naturalProgressions = [
      { from: 'question', to: 'interested' },
      { from: 'job_fit_question', to: 'role_interest' },
      { from: 'urgency_signal', to: 'interested' },
      { from: 'objection_handling', to: 'interested' },
      { from: 'casual_interest', to: 'interested' },
      { from: 'unsure', to: 'interested' }
    ];

    if (lastMessages.length < 2) return 0;

    const previousIntent = this.detectIntent(lastMessages[lastMessages.length - 1].content || '').type;
    
    const isNaturalProgression = naturalProgressions.some(
      p => p.from === previousIntent && p.to === currentIntent
    );

    return isNaturalProgression ? 0.8 : 0.3;
  }

  /**
   * Get human-readable sentiment label
   * @param {Number} sentimentScore
   * @returns {String}
   */
  static getSentimentLabel(sentimentScore) {
    if (sentimentScore >= 0.5) return 'Very Positive';
    if (sentimentScore >= 0.1) return 'Positive';
    if (sentimentScore >= -0.1) return 'Neutral';
    if (sentimentScore >= -0.5) return 'Negative';
    return 'Very Negative';
  }

  /**
   * Generate explanation for detected intent
   * @param {String} intentType
   * @param {String} message
   * @param {Number} sentiment
   * @returns {String}
   */
  static generateReasoning(intentType, message, sentiment) {
    const sentimentContext = sentiment > 0.5 ? 'with enthusiasm' : sentiment < -0.5 ? 'with concerns' : 'neutrally';
    
    const reasoningMap = {
      slot_selected: `Selected interview slot from options`,
      interested: `Expressed interest in proceeding with interview`,
      reschedule: `Requested reschedule of interview appointment`,
      decline: `Declined the interview invitation ${sentimentContext}`,
      question: `Asked clarifying questions about the role`,
      job_fit_question: `Inquired about role fit and responsibilities`,
      role_interest: `Showed active interest in the role`,
      skills_match_concern: `Raised concerns about skill requirements`,
      urgency_signal: `Indicated time-sensitive availability`,
      timeline_question: `Asked about process timeline and next steps`,
      availability_concern: `Mentioned employment status or availability`,
      deep_inquiry: `Requested comprehensive role information`,
      casual_interest: `Showed tentative interest in the opportunity`,
      objection_handling: `Raised concerns but open to discussion`,
      qualified_prospect: `Demonstrated strong qualification signals`
    };

    return reasoningMap[intentType] || 'Unable to determine intent';
  }

  /**
   * Extract decline reason (extended from original)
   * @param {String} message
   * @returns {String}
   */
  static extractDeclineReason(message) {
    if (/busy|don't have time|schedule|can't|conflict|not free/i.test(message)) {
      return 'Scheduling conflict';
    }
    if (/interested|right role|looking for|not a fit|wrong position/i.test(message)) {
      return 'Not interested in role';
    }
    if (/already found|other job|accepted|another offer|going with/i.test(message)) {
      return 'Already accepted another offer';
    }
    if (/salary|compensation|pay|amount/i.test(message)) {
      return 'Salary/compensation concern';
    }
    if (/location|remote|office|commute|travel/i.test(message)) {
      return 'Location/work arrangement concern';
    }
    if (/growth|career|development|learning|opportunity/i.test(message)) {
      return 'Career growth concern';
    }
    return 'Candidate declined';
  }

  /**
   * Calculate overall qualification score based on multi-message analysis
   * @param {Array} messages - Array of message objects with content
   * @returns {Object} Qualification assessment
   */
  static assessQualification(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        qualificationLevel: 'Unknown',
        score: 0,
        signals: [],
        concerns: []
      };
    }

    let positiveSignals = 0;
    let concerns = 0;
    let signals = [];
    let concerns_list = [];

    messages.forEach((msg, index) => {
      const intent = this.detectIntent(msg.content || '', messages.slice(Math.max(0, index - 3), index));
      
      // Positive qualification signals
      if (
        [
          this.INTENT_TYPES.ROLE_INTEREST,
          this.INTENT_TYPES.INTERESTED,
          this.INTENT_TYPES.DEEP_INQUIRY,
          this.INTENT_TYPES.URGENCY_SIGNAL
        ].includes(intent.type) &&
        intent.confidence > 0.7
      ) {
        positiveSignals++;
        signals.push({
          type: intent.type,
          confidence: intent.confidence,
          sentiment: intent.sentiment,
          index: index
        });
      }

      // Concerns
      if (
        [
          this.INTENT_TYPES.SKILLS_MATCH_CONCERN,
          this.INTENT_TYPES.AVAILABILITY_CONCERN,
          this.INTENT_TYPES.OBJECTION_HANDLING,
          this.INTENT_TYPES.DECLINE
        ].includes(intent.type) &&
        intent.confidence > 0.7
      ) {
        concerns++;
        concerns_list.push({
          type: intent.type,
          reason: this.extractDeclineReason(msg.content || ''),
          index: index
        });
      }
    });

    // Calculate qualification score (0-100)
    const signalWeight = positiveSignals * 15; // 15 points per positive signal
    const concernPenalty = concerns * 10; // -10 points per concern
    const qualificationScore = Math.max(0, Math.min(100, 50 + signalWeight - concernPenalty));

    let qualificationLevel = 'Poor';
    if (qualificationScore >= 80) qualificationLevel = 'Excellent';
    else if (qualificationScore >= 60) qualificationLevel = 'Good';
    else if (qualificationScore >= 40) qualificationLevel = 'Fair';
    else if (qualificationScore >= 20) qualificationLevel = 'Weak';

    return {
      qualificationLevel,
      score: qualificationScore,
      signals,
      concerns: concerns_list,
      positiveSignalCount: positiveSignals,
      concernCount: concerns,
      messageCount: messages.length
    };
  }
}

export default EnhancedIntentDetectionService;
