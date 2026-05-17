import logger from '../utils/logger.js';

interface EventData {
  userId: string;
  eventType: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface UserAnalytics {
  userId: string;
  totalMessages: number;
  totalConversations: number;
  avgResponseTime: number;
  activeHours: number[];
  deviceTypes: Map<string, number>;
  messageFrequency: { hour: number; count: number }[];
}

interface ConversationAnalytics {
  conversationId: string;
  participantCount: number;
  duration: number;
  messageCount: number;
  mediaCount: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  resolution?: boolean;
  tags?: string[];
}

interface DashboardMetrics {
  totalUsers: number;
  activeUsers24h: number;
  totalConversations: number;
  totalMessages: number;
  avgResponseTime: number;
  messagePerHour: number;
  topUsers: Array<{ userId: string; messageCount: number }>;
  topConversations: Array<{ conversationId: string; messageCount: number }>;
}

export class AnalyticsService {
  private events: EventData[] = [];
  private userAnalytics: Map<string, UserAnalytics> = new Map();
  private conversationAnalytics: Map<string, ConversationAnalytics> = new Map();
  private maxEvents: number = 10000;

  constructor() {
    this.setupCleanup();
  }

  /**
   * Track an event
   */
  public trackEvent(
    userId: string,
    eventType: string,
    metadata?: Record<string, any>
  ): void {
    try {
      const event: EventData = {
        userId,
        eventType,
        timestamp: new Date(),
        metadata,
      };

      this.events.push(event);

      // Maintain max events size
      if (this.events.length > this.maxEvents) {
        this.events.shift();
      }

      // Update user analytics
      this.updateUserAnalytics(userId, event);

      logger.debug(`Event tracked: ${eventType} by user ${userId}`);
    } catch (error) {
      logger.error(`Error tracking event ${eventType} for user ${userId}:`, error);
    }
  }

  /**
   * Track message sent
   */
  public trackMessageSent(
    userId: string,
    conversationId: string,
    hasMedia: boolean = false
  ): void {
    this.trackEvent(userId, 'message_sent', {
      conversationId,
      hasMedia,
    });

    // Update conversation analytics
    this.updateConversationAnalytics(conversationId, {
      messageCount: 1,
      mediaCount: hasMedia ? 1 : 0,
    });
  }

  /**
   * Track conversation started
   */
  public trackConversationStarted(
    userId: string,
    conversationId: string,
    participantCount: number
  ): void {
    this.trackEvent(userId, 'conversation_started', {
      conversationId,
      participantCount,
    });

    const analytics = this.conversationAnalytics.get(conversationId) || {
      conversationId,
      participantCount,
      duration: 0,
      messageCount: 0,
      mediaCount: 0,
    };

    this.conversationAnalytics.set(conversationId, analytics);
  }

  /**
   * Track user login
   */
  public trackUserLogin(userId: string, deviceType?: string): void {
    this.trackEvent(userId, 'user_login', { deviceType });

    // Update device info
    if (deviceType) {
      const analytics = this.userAnalytics.get(userId);
      if (analytics) {
        const count = analytics.deviceTypes.get(deviceType) || 0;
        analytics.deviceTypes.set(deviceType, count + 1);
      }
    }
  }

  /**
   * Track search query
   */
  public trackSearch(userId: string, query: string, resultCount: number): void {
    this.trackEvent(userId, 'search_query', {
      query,
      resultCount,
    });
  }

  /**
   * Track API call
   */
  public trackAPICall(
    userId: string,
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number
  ): void {
    this.trackEvent(userId, 'api_call', {
      endpoint,
      method,
      duration,
      statusCode,
    });
  }

  /**
   * Get user analytics
   */
  public getUserAnalytics(userId: string): UserAnalytics | null {
    return this.userAnalytics.get(userId) || null;
  }

  /**
   * Get conversation analytics
   */
  public getConversationAnalytics(conversationId: string): ConversationAnalytics | null {
    return this.conversationAnalytics.get(conversationId) || null;
  }

  /**
   * Get dashboard metrics
   */
  public getDashboardMetrics(): DashboardMetrics {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Count active users in last 24 hours
    const activeUsersSet = new Set<string>();
    for (const event of this.events) {
      if (event.timestamp >= twentyFourHoursAgo && event.eventType === 'user_login') {
        activeUsersSet.add(event.userId);
      }
    }

    // Count messages
    let totalMessages = 0;
    let totalResponseTime = 0;
    let responseTimeCount = 0;

    for (const event of this.events) {
      if (event.eventType === 'message_sent') {
        totalMessages++;
      }
      if (event.eventType === 'message_response_time' && event.metadata?.duration) {
        totalResponseTime += event.metadata.duration;
        responseTimeCount++;
      }
    }

    const avgResponseTime = responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0;

    // Messages per hour
    const messageCount24h = this.events.filter(
      (e) => e.eventType === 'message_sent' && e.timestamp >= twentyFourHoursAgo
    ).length;
    const messagePerHour = messageCount24h / 24;

    // Top users
    const userMessageCount = new Map<string, number>();
    for (const event of this.events) {
      if (event.eventType === 'message_sent') {
        const count = userMessageCount.get(event.userId) || 0;
        userMessageCount.set(event.userId, count + 1);
      }
    }

    const topUsers = Array.from(userMessageCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([userId, count]) => ({ userId, messageCount: count }));

    // Top conversations
    const convMessageCount = new Map<string, number>();
    for (const event of this.events) {
      if (event.eventType === 'message_sent' && event.metadata?.conversationId) {
        const convId = event.metadata.conversationId;
        const count = convMessageCount.get(convId) || 0;
        convMessageCount.set(convId, count + 1);
      }
    }

    const topConversations = Array.from(convMessageCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([conversationId, count]) => ({ conversationId, messageCount: count }));

    return {
      totalUsers: this.userAnalytics.size,
      activeUsers24h: activeUsersSet.size,
      totalConversations: this.conversationAnalytics.size,
      totalMessages,
      avgResponseTime,
      messagePerHour,
      topUsers,
      topConversations,
    };
  }

  /**
   * Get analytics by time range
   */
  public getAnalyticsByTimeRange(
    startDate: Date,
    endDate: Date
  ): {
    messageCount: number;
    userCount: number;
    conversationCount: number;
    events: EventData[];
  } {
    const rangeEvents = this.events.filter(
      (e) => e.timestamp >= startDate && e.timestamp <= endDate
    );

    const userSet = new Set<string>();
    const conversationSet = new Set<string>();
    let messageCount = 0;

    for (const event of rangeEvents) {
      userSet.add(event.userId);

      if (event.eventType === 'message_sent') {
        messageCount++;
        if (event.metadata?.conversationId) {
          conversationSet.add(event.metadata.conversationId);
        }
      }
    }

    return {
      messageCount,
      userCount: userSet.size,
      conversationCount: conversationSet.size,
      events: rangeEvents,
    };
  }

  /**
   * Get user behavior patterns
   */
  public getUserBehaviorPatterns(userId: string): {
    peakHours: number[];
    averageMessagesPerHour: number;
    preferredDevices: string[];
    averageResponseTime: number;
  } {
    const userEvents = this.events.filter((e) => e.userId === userId);

    // Peak hours
    const hourCounts = new Map<number, number>();
    for (const event of userEvents) {
      const hour = event.timestamp.getHours();
      const count = hourCounts.get(hour) || 0;
      hourCounts.set(hour, count + 1);
    }

    const peakHours = Array.from(hourCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([hour]) => hour);

    // Average messages per hour
    const messageEvents = userEvents.filter((e) => e.eventType === 'message_sent');
    const uniqueHours = new Set(userEvents.map((e) => {
      const date = new Date(e.timestamp);
      return `${date.getDate()}-${date.getHours()}`;
    })).size;
    const averageMessagesPerHour = uniqueHours > 0 ? messageEvents.length / uniqueHours : 0;

    // Preferred devices
    const deviceCounts = new Map<string, number>();
    for (const event of userEvents) {
      if (event.metadata?.deviceType) {
        const count = deviceCounts.get(event.metadata.deviceType) || 0;
        deviceCounts.set(event.metadata.deviceType, count + 1);
      }
    }

    const preferredDevices = Array.from(deviceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([device]) => device);

    // Average response time
    const responseTimes = userEvents
      .filter((e) => e.metadata?.duration)
      .map((e) => e.metadata!.duration as number);

    const averageResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    return {
      peakHours,
      averageMessagesPerHour,
      preferredDevices,
      averageResponseTime,
    };
  }

  /**
   * Export analytics to CSV
   */
  public exportAnalyticsToCSV(): string {
    let csv = 'timestamp,userId,eventType,metadata\n';

    for (const event of this.events) {
      const metadataStr = event.metadata ? JSON.stringify(event.metadata) : '';
      csv += `${event.timestamp.toISOString()},${event.userId},${event.eventType},"${metadataStr}"\n`;
    }

    return csv;
  }

  /**
   * Clear old events
   */
  private setupCleanup(): void {
    setInterval(() => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const initialSize = this.events.length;

      this.events = this.events.filter((e) => e.timestamp >= thirtyDaysAgo);

      logger.info(`Analytics cleanup: Removed ${initialSize - this.events.length} old events`);
    }, 24 * 60 * 60 * 1000); // Every 24 hours
  }

  /**
   * Update user analytics
   */
  private updateUserAnalytics(userId: string, event: EventData): void {
    let analytics = this.userAnalytics.get(userId);

    if (!analytics) {
      analytics = {
        userId,
        totalMessages: 0,
        totalConversations: 0,
        avgResponseTime: 0,
        activeHours: [],
        deviceTypes: new Map(),
        messageFrequency: Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 })),
      };
      this.userAnalytics.set(userId, analytics);
    }

    if (event.eventType === 'message_sent') {
      analytics.totalMessages++;
      const hour = event.timestamp.getHours();
      const freqItem = analytics.messageFrequency[hour];
      if (freqItem) {
        freqItem.count++;
      }
    }

    if (event.eventType === 'conversation_started') {
      analytics.totalConversations++;
    }
  }

  /**
   * Update conversation analytics
   */
  private updateConversationAnalytics(
    conversationId: string,
    updates: Partial<ConversationAnalytics>
  ): void {
    const analytics = this.conversationAnalytics.get(conversationId);

    if (analytics) {
      if (updates.messageCount) {
        analytics.messageCount += updates.messageCount;
      }
      if (updates.mediaCount) {
        analytics.mediaCount += updates.mediaCount;
      }
    }
  }
}

export default AnalyticsService;
