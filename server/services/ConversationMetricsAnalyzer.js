/**
 * Conversation Metrics Analyzer - Phase 1C Part 3
 * Extracts engagement signals, response times, and sentiment trends from conversations
 */

export class ConversationMetricsAnalyzer {
  /**
   * Analyze conversation metrics from message history
   * @param {Array} messages - Array of WhatsApp messages with timestamps
   * @param {String} candidateId - ID of the candidate
   * @returns {Object} Detailed metrics object
   */
  static analyzeConversation(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
      return this.getEmptyMetrics();
    }

    const metrics = {
      messageCount: messages.length,
      avgResponseTime: this.calculateAvgResponseTime(messages),
      responseTimePattern: this.analyzeResponseTimePattern(messages),
      messageFrequency: this.calculateMessageFrequency(messages),
      engagementScore: 0,
      avgMessageLength: this.calculateAvgMessageLength(messages),
      conversationDuration: this.calculateDuration(messages),
      lastActivityAt: messages[messages.length - 1]?.timestamp || new Date(),
      activityTrend: this.analyzeActivityTrend(messages)
    };

    // Calculate engagement score (0-100)
    metrics.engagementScore = this.calculateEngagementScore(metrics);

    return metrics;
  }

  /**
   * Calculate average response time in minutes
   * @param {Array} messages
   * @returns {Number} Average response time in minutes
   */
  static calculateAvgResponseTime(messages) {
    const responseTimes = [];
    
    for (let i = 1; i < messages.length; i++) {
      const current = new Date(messages[i].timestamp);
      const previous = new Date(messages[i - 1].timestamp);
      const diffMinutes = (current - previous) / (1000 * 60);
      
      // Only count if from same person responding (direction changes)
      if (messages[i].direction !== messages[i - 1].direction) {
        responseTimes.push(diffMinutes);
      }
    }

    if (responseTimes.length === 0) return 0;
    return Math.round(
      responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    );
  }

  /**
   * Analyze response time pattern to detect engagement
   * Fast responses = good engagement
   * @param {Array} messages
   * @returns {Object} Pattern analysis
   */
  static analyzeResponseTimePattern(messages) {
    const responseTimes = [];
    
    for (let i = 1; i < messages.length; i++) {
      const current = new Date(messages[i].timestamp);
      const previous = new Date(messages[i - 1].timestamp);
      const diffMinutes = (current - previous) / (1000 * 60);
      
      if (messages[i].direction !== messages[i - 1].direction) {
        responseTimes.push(diffMinutes);
      }
    }

    if (responseTimes.length === 0) return { consistency: 'N/A', speed: 'N/A' };

    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / responseTimes.length;

    return {
      avgResponseMinutes: Math.round(avgTime),
      varianceMinutes: Math.round(Math.sqrt(variance)),
      speed: avgTime < 5 ? 'Very Fast' : avgTime < 15 ? 'Fast' : avgTime < 60 ? 'Moderate' : 'Slow',
      consistency: variance < 100 ? 'Consistent' : 'Variable'
    };
  }

  /**
   * Calculate message frequency per hour
   * @param {Array} messages
   * @returns {Number} Messages per hour of conversation
   */
  static calculateMessageFrequency(messages) {
    if (messages.length < 2) return 0;
    
    const firstMsg = new Date(messages[0].timestamp);
    const lastMsg = new Date(messages[messages.length - 1].timestamp);
    const durationHours = (lastMsg - firstMsg) / (1000 * 60 * 60);
    
    if (durationHours === 0) return messages.length;
    return Math.round((messages.length / durationHours) * 10) / 10;
  }

  /**
   * Calculate average message length in characters
   * @param {Array} messages
   * @returns {Number} Average character count
   */
  static calculateAvgMessageLength(messages) {
    if (messages.length === 0) return 0;
    const totalChars = messages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0);
    return Math.round(totalChars / messages.length);
  }

  /**
   * Calculate total conversation duration
   * @param {Array} messages
   * @returns {Object} Duration breakdown (days, hours, minutes)
   */
  static calculateDuration(messages) {
    if (messages.length < 2) return { days: 0, hours: 0, minutes: 0 };
    
    const first = new Date(messages[0].timestamp);
    const last = new Date(messages[messages.length - 1].timestamp);
    const diffMinutes = (last - first) / (1000 * 60);
    
    const days = Math.floor(diffMinutes / (60 * 24));
    const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
    const minutes = Math.floor(diffMinutes % 60);
    
    return { days, hours, minutes, totalMinutes: Math.floor(diffMinutes) };
  }

  /**
   * Analyze activity trend - is engagement increasing or decreasing?
   * @param {Array} messages
   * @returns {String} Trend: 'Increasing', 'Decreasing', 'Stable'
   */
  static analyzeActivityTrend(messages) {
    if (messages.length < 5) return 'Insufficient data';
    
    const half = Math.floor(messages.length / 2);
    const firstHalf = messages.slice(0, half);
    const secondHalf = messages.slice(half);
    
    const firstHalfFreq = firstHalf.length / this.calculateDuration(firstHalf).totalMinutes;
    const secondHalfFreq = secondHalf.length / this.calculateDuration(secondHalf).totalMinutes;
    
    const change = ((secondHalfFreq - firstHalfFreq) / firstHalfFreq) * 100;
    
    if (change > 20) return 'Increasing';
    if (change < -20) return 'Decreasing';
    return 'Stable';
  }

  /**
   * Calculate engagement score (0-100) based on multiple factors
   * @param {Object} metrics
   * @returns {Number} Engagement score
   */
  static calculateEngagementScore(metrics) {
    let score = 0;

    // Message frequency (0-25 points)
    // Good: 2-5 messages/hour
    if (metrics.messageFrequency >= 2 && metrics.messageFrequency <= 5) {
      score += 25;
    } else if (metrics.messageFrequency > 1 && metrics.messageFrequency < 10) {
      score += 20;
    } else if (metrics.messageFrequency > 0) {
      score += 10;
    }

    // Response time (0-25 points)
    // Good: < 5 minutes
    if (metrics.avgResponseTime < 5) {
      score += 25;
    } else if (metrics.avgResponseTime < 15) {
      score += 20;
    } else if (metrics.avgResponseTime < 60) {
      score += 15;
    } else if (metrics.avgResponseTime < 1440) { // 24 hours
      score += 8;
    }

    // Message count (0-20 points)
    // Good: > 10 messages
    if (metrics.messageCount >= 20) {
      score += 20;
    } else if (metrics.messageCount >= 10) {
      score += 15;
    } else if (metrics.messageCount >= 5) {
      score += 10;
    } else if (metrics.messageCount >= 2) {
      score += 5;
    }

    // Conversation duration (0-15 points)
    // Good: > 1 day of conversation
    if (metrics.conversationDuration.days >= 1) {
      score += 15;
    } else if (metrics.conversationDuration.hours >= 8) {
      score += 10;
    } else if (metrics.conversationDuration.hours >= 2) {
      score += 5;
    }

    // Message length (0-15 points)
    // Good: 50-200 characters per message (thoughtful but concise)
    if (metrics.avgMessageLength >= 50 && metrics.avgMessageLength <= 200) {
      score += 15;
    } else if (metrics.avgMessageLength >= 20) {
      score += 10;
    } else if (metrics.avgMessageLength > 0) {
      score += 5;
    }

    // Activity trend (bonus 0-10 points)
    if (metrics.activityTrend === 'Increasing') {
      score += 10;
    } else if (metrics.activityTrend === 'Stable') {
      score += 5;
    }

    return Math.min(100, score);
  }

  /**
   * Get empty metrics object for conversations with no messages
   * @returns {Object}
   */
  static getEmptyMetrics() {
    return {
      messageCount: 0,
      avgResponseTime: 0,
      responseTimePattern: { speed: 'N/A', consistency: 'N/A' },
      messageFrequency: 0,
      engagementScore: 0,
      avgMessageLength: 0,
      conversationDuration: { days: 0, hours: 0, minutes: 0, totalMinutes: 0 },
      lastActivityAt: null,
      activityTrend: 'N/A'
    };
  }

  /**
   * Calculate sentiment-aware engagement score
   * Combines engagement metrics with sentiment data
   * @param {Object} metrics
   * @param {Number} sentimentScore
   * @returns {Number} Adjusted engagement score (0-100)
   */
  static adjustEngagementBySentiment(engagementScore, sentimentScore) {
    // Positive sentiment boosts engagement
    // Negative sentiment reduces it
    // sentimentScore ranges from -1 to 1, normalize to 0-1
    const sentimentFactor = (sentimentScore + 1) / 2; // 0 to 1
    
    // Weight: 80% engagement + 20% sentiment
    return Math.round((engagementScore * 0.8) + (sentimentFactor * 100 * 0.2));
  }
}

export default ConversationMetricsAnalyzer;
