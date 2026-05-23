/**
 * WhatsApp Counter Manager
 * 
 * Manages daily, weekly, and monthly counters for different
 * customer segments (landlords, tenants, buyers, sellers, agents)
 * 
 * Features:
 * - Automatic counter aggregation
 * - Time-based counter reset
 * - Customer segment classification
 * - Analytics & reporting
 */

class CounterManager {
  constructor(database) {
    this.db = database;
    this.counterCache = new Map();
    this.counterUpdateInterval = 60 * 1000; // 60 seconds
    this.lastCounterUpdate = new Map();
  }

  /**
   * Initialize counter manager
   */
  async initialize() {
    console.log('[CounterManager] Initializing...');
    
    try {
      // Start counter update scheduler
      this.startCounterScheduler();
      console.log('[CounterManager] ✅ Initialization complete');
    } catch (error) {
      console.error('[CounterManager] ❌ Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Increment counter for a message
   */
  async incrementCounter(accountId, messageData) {
    try {
      const {
        from,
        to,
        direction,
        timestamp = new Date(),
      } = messageData;

      // Determine customer segment
      const segment = await this.classifyCustomerSegment(accountId, from);

      // Get date keys
      const today = this.getDateKey(timestamp, 'day');
      const week = this.getDateKey(timestamp, 'week');
      const month = this.getDateKey(timestamp, 'month');

      // Prepare counter updates
      const updates = {
        // Daily counters
        [`counters.daily.${today}.total`]: 1,
        [`counters.daily.${today}.segments.${segment}`]: 1,
        [`counters.daily.${today}.direction.${direction}`]: 1,

        // Weekly counters
        [`counters.weekly.${week}.total`]: 1,
        [`counters.weekly.${week}.segments.${segment}`]: 1,
        [`counters.weekly.${week}.direction.${direction}`]: 1,

        // Monthly counters
        [`counters.monthly.${month}.total`]: 1,
        [`counters.monthly.${month}.segments.${segment}`]: 1,
        [`counters.monthly.${month}.direction.${direction}`]: 1,

        // All-time stats
        'stats.totalMessages': 1,
        [`stats.bySegment.${segment}`]: 1,
        [`stats.byDirection.${direction}`]: 1,
        'lastCounterUpdate': new Date(),
      };

      // Update database
      await this.db.collection('whatsapp_counters').updateOne(
        { accountId },
        { $inc: updates },
        { upsert: true }
      );

      // Update cache
      this.updateCounterCache(accountId);

      return { success: true, segment };
    } catch (error) {
      console.error('[CounterManager] Increment counter failed:', error);
      throw error;
    }
  }

  /**
   * Get counters for account
   */
  async getCounters(accountId, period = 'all') {
    try {
      // Check cache first
      const cacheKey = `${accountId}:${period}`;
      if (this.counterCache.has(cacheKey)) {
        return this.counterCache.get(cacheKey);
      }

      // Query database
      const counter = await this.db.collection('whatsapp_counters').findOne({
        accountId,
      });

      if (!counter) {
        return this.getDefaultCounters();
      }

      let result;

      if (period === 'all') {
        result = {
          daily: counter.counters?.daily || {},
          weekly: counter.counters?.weekly || {},
          monthly: counter.counters?.monthly || {},
          stats: counter.stats || {},
        };
      } else {
        result = {
          [period]: counter.counters?.[period] || {},
          stats: counter.stats || {},
        };
      }

      // Cache result
      this.counterCache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('[CounterManager] Get counters failed:', error);
      throw error;
    }
  }

  /**
   * Get today's counters
   */
  async getTodayCounters(accountId) {
    try {
      const today = this.getDateKey(new Date(), 'day');
      const counters = await this.getCounters(accountId, 'daily');

      return {
        date: today,
        ...counters.daily[today],
        stats: counters.stats,
      };
    } catch (error) {
      console.error('[CounterManager] Get today counters failed:', error);
      throw error;
    }
  }

  /**
   * Get this week's counters
   */
  async getThisWeekCounters(accountId) {
    try {
      const week = this.getDateKey(new Date(), 'week');
      const counters = await this.getCounters(accountId, 'weekly');

      return {
        week,
        ...counters.weekly[week],
        stats: counters.stats,
      };
    } catch (error) {
      console.error('[CounterManager] Get week counters failed:', error);
      throw error;
    }
  }

  /**
   * Get this month's counters
   */
  async getThisMonthCounters(accountId) {
    try {
      const month = this.getDateKey(new Date(), 'month');
      const counters = await this.getCounters(accountId, 'monthly');

      return {
        month,
        ...counters.monthly[month],
        stats: counters.stats,
      };
    } catch (error) {
      console.error('[CounterManager] Get month counters failed:', error);
      throw error;
    }
  }

  /**
   * Get counter trends
   */
  async getCounterTrends(accountId, days = 7) {
    try {
      const trends = [];
      const today = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = this.getDateKey(date, 'day');

        const counters = await this.getCounters(accountId, 'daily');
        const dayCounter = counters.daily[dateKey] || {
          total: 0,
          direction: { incoming: 0, outgoing: 0 },
          segments: {},
        };

        trends.unshift({
          date: dateKey,
          ...dayCounter,
        });
      }

      return trends;
    } catch (error) {
      console.error('[CounterManager] Get trends failed:', error);
      throw error;
    }
  }

  /**
   * Get segment breakdown
   */
  async getSegmentBreakdown(accountId, period = 'today') {
    try {
      let counters;

      if (period === 'today') {
        counters = await this.getTodayCounters(accountId);
      } else if (period === 'week') {
        counters = await this.getThisWeekCounters(accountId);
      } else if (period === 'month') {
        counters = await this.getThisMonthCounters(accountId);
      } else {
        counters = await this.getCounters(accountId, 'all');
      }

      const breakdown = counters.segments || {};

      return {
        period,
        segments: breakdown,
        total: (breakdown.landlord || 0) +
               (breakdown.tenant || 0) +
               (breakdown.buyer || 0) +
               (breakdown.seller || 0) +
               (breakdown.agent || 0),
      };
    } catch (error) {
      console.error('[CounterManager] Get segment breakdown failed:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(accountId) {
    try {
      const today = await this.getTodayCounters(accountId);
      const week = await this.getThisWeekCounters(accountId);
      const month = await this.getThisMonthCounters(accountId);
      const trends = await this.getCounterTrends(accountId, 7);

      // Calculate averages
      const avgDaily = week.total / 7;
      const avgWeekly = month.total / 4;

      // Calculate growth
      const dailyGrowth = trends[trends.length - 1]?.total > 0
        ? ((today.total - trends[trends.length - 1].total) / trends[trends.length - 1].total * 100)
        : 0;

      return {
        today: {
          total: today.total || 0,
          incoming: today.direction?.incoming || 0,
          outgoing: today.direction?.outgoing || 0,
        },
        week: {
          total: week.total || 0,
          average: Math.round(avgDaily),
        },
        month: {
          total: month.total || 0,
          average: Math.round(avgWeekly),
        },
        growth: {
          daily: Math.round(dailyGrowth),
        },
        topSegment: this.getTopSegment(today.segments || {}),
        responseRate: this.calculateResponseRate(today),
      };
    } catch (error) {
      console.error('[CounterManager] Get performance metrics failed:', error);
      throw error;
    }
  }

  /**
   * Reset old counters (cleanup)
   */
  async cleanupOldCounters(accountId, daysToKeep = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      const cutoffKey = this.getDateKey(cutoffDate, 'day');

      const counter = await this.db.collection('whatsapp_counters').findOne({
        accountId,
      });

      if (!counter || !counter.counters?.daily) {
        return { deleted: 0 };
      }

      const dailyKeys = Object.keys(counter.counters.daily);
      let deletedCount = 0;

      for (const key of dailyKeys) {
        if (key < cutoffKey) {
          await this.db.collection('whatsapp_counters').updateOne(
            { accountId },
            { $unset: { [`counters.daily.${key}`]: 1 } }
          );
          deletedCount++;
        }
      }

      this.invalidateCounterCache(accountId);

      return { deleted: deletedCount };
    } catch (error) {
      console.error('[CounterManager] Cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Helper: Classify customer segment
   */
  async classifyCustomerSegment(accountId, phoneNumber) {
    try {
      // Query conversation/contact data to determine segment
      const conversation = await this.db.collection('conversations').findOne({
        accountId,
        recipientPhone: phoneNumber,
      });

      if (!conversation) {
        return 'unknown';
      }

      // Check metadata for segment classification
      const segment = conversation.metadata?.customerSegment;
      return segment || 'unknown';
    } catch (error) {
      // Default to unknown if lookup fails
      return 'unknown';
    }
  }

  /**
   * Helper: Get date key
   */
  getDateKey(date, period) {
    const d = new Date(date);

    if (period === 'day') {
      return d.toISOString().split('T')[0]; // YYYY-MM-DD
    } else if (period === 'week') {
      // ISO week number (Monday as first day)
      const firstDay = new Date(d.setDate(d.getDate() - d.getDay() + 1));
      return firstDay.toISOString().split('T')[0]; // Week start date
    } else if (period === 'month') {
      return d.toISOString().substring(0, 7); // YYYY-MM
    }

    return null;
  }

  /**
   * Helper: Update counter cache
   */
  updateCounterCache(accountId) {
    // Invalidate all cache entries for this account
    const keysToDelete = [];
    for (const [key] of this.counterCache) {
      if (key.startsWith(accountId)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.counterCache.delete(key));
  }

  /**
   * Helper: Invalidate counter cache
   */
  invalidateCounterCache(accountId) {
    this.updateCounterCache(accountId);
  }

  /**
   * Helper: Get top segment
   */
  getTopSegment(segments) {
    let topSegment = 'unknown';
    let maxCount = 0;

    for (const [segment, count] of Object.entries(segments || {})) {
      if (count > maxCount) {
        maxCount = count;
        topSegment = segment;
      }
    }

    return { segment: topSegment, count: maxCount };
  }

  /**
   * Helper: Calculate response rate
   */
  calculateResponseRate(counters) {
    const incoming = counters.direction?.incoming || 0;
    const outgoing = counters.direction?.outgoing || 0;

    if (incoming === 0) {
      return 0;
    }

    return Math.round((outgoing / incoming) * 100);
  }

  /**
   * Start counter update scheduler
   */
  startCounterScheduler() {
    setInterval(async () => {
      try {
        // Periodic cleanup
        const accounts = await this.db.collection('whatsapp_counters')
          .find({})
          .toArray();

        for (const account of accounts) {
          await this.cleanupOldCounters(account.accountId, 90);
        }

        console.log('[CounterManager] Scheduler: Cleanup completed');
      } catch (error) {
        console.error('[CounterManager] Scheduler error:', error);
      }
    }, 24 * 60 * 60 * 1000); // Daily
  }

  /**
   * Get default counters structure
   */
  getDefaultCounters() {
    return {
      daily: {},
      weekly: {},
      monthly: {},
      stats: {
        totalMessages: 0,
        bySegment: {},
        byDirection: {},
      },
    };
  }
}

module.exports = CounterManager;
