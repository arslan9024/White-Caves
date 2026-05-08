/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '../utils/logger.js';
import type WebSocketService from '../websocket/websocket.service.js';

export interface UserPresence {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen: Date;
  activeConversations: string[];
  device?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface PresenceUpdate {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  timestamp: Date;
}

export interface SyncState {
  userId: string;
  lastSyncTime: Date;
  conversationVersions: Map<string, number>;
  messageVersions: Map<string, number>;
}

export class PresenceAndSyncService {
  private userPresence: Map<string, UserPresence> = new Map();
  private presenceHistory: PresenceUpdate[] = [];
  private userSyncStates: Map<string, SyncState> = new Map();
  private maxHistorySize: number = 10000;
  private wsService: WebSocketService | null = null;
  private inactivityTimeout: number = 30 * 60 * 1000; // 30 minutes
  private inactivityTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.setupCleanup();
  }

  /**
   * Set WebSocket service instance
   */
  public setWebSocketService(wsService: WebSocketService): void {
    this.wsService = wsService;
  }

  /**
   * Update user presence
   */
  public updatePresence(userId: string, status: 'online' | 'offline' | 'away' | 'busy'): void {
    const now = new Date();

    let presence = this.userPresence.get(userId);
    if (!presence) {
      presence = {
        userId,
        status,
        lastSeen: now,
        activeConversations: [],
      };
    } else {
      presence.status = status;
      if (status !== 'offline') {
        presence.lastSeen = now;
      }
    }

    this.userPresence.set(userId, presence);

    // Add to history
    const update: PresenceUpdate = {
      userId,
      status,
      timestamp: now,
    };
    this.presenceHistory.push(update);

    // Maintain max history size
    if (this.presenceHistory.length > this.maxHistorySize) {
      this.presenceHistory.shift();
    }

    // Reset inactivity timer
    this.resetInactivityTimer(userId);

    // Broadcast update
    this.broadcastPresenceUpdate(userId, presence);

    logger.debug(`Presence updated: ${userId} -> ${status}`);
  }

  /**
   * Get user presence
   */
  public getPresence(userId: string): UserPresence | null {
    return this.userPresence.get(userId) || null;
  }

  /**
   * Get all online users
   */
  public getOnlineUsers(): UserPresence[] {
    return Array.from(this.userPresence.values()).filter(p => p.status === 'online');
  }

  /**
   * Get users in conversation
   */
  public getUsersInConversation(conversationId: string): UserPresence[] {
    return Array.from(this.userPresence.values()).filter(
      p =>
        p.activeConversations.includes(conversationId) &&
        (p.status === 'online' || p.status === 'away')
    );
  }

  /**
   * Add user to conversation
   */
  public addUserToConversation(userId: string, conversationId: string): void {
    let presence = this.userPresence.get(userId);
    if (!presence) {
      presence = {
        userId,
        status: 'online',
        lastSeen: new Date(),
        activeConversations: [],
      };
      this.userPresence.set(userId, presence);
    }

    if (!presence.activeConversations.includes(conversationId)) {
      presence.activeConversations.push(conversationId);

      // Broadcast update
      this.broadcastPresenceUpdate(userId, presence);

      logger.debug(`User ${userId} added to conversation ${conversationId}`);
    }
  }

  /**
   * Remove user from conversation
   */
  public removeUserFromConversation(userId: string, conversationId: string): void {
    const presence = this.userPresence.get(userId);
    if (presence) {
      const index = presence.activeConversations.indexOf(conversationId);
      if (index > -1) {
        presence.activeConversations.splice(index, 1);

        // Broadcast update
        this.broadcastPresenceUpdate(userId, presence);

        logger.debug(`User ${userId} removed from conversation ${conversationId}`);
      }
    }
  }

  /**
   * Set user location
   */
  public setUserLocation(userId: string, latitude: number, longitude: number): void {
    let presence = this.userPresence.get(userId);
    if (!presence) {
      presence = {
        userId,
        status: 'online',
        lastSeen: new Date(),
        activeConversations: [],
      };
      this.userPresence.set(userId, presence);
    }

    presence.location = { latitude, longitude };

    // Broadcast update
    this.broadcastPresenceUpdate(userId, presence);

    logger.debug(`User location updated: ${userId}`);
  }

  /**
   * Get sync state for user
   */
  public getSyncState(userId: string): SyncState {
    let syncState = this.userSyncStates.get(userId);
    if (!syncState) {
      syncState = {
        userId,
        lastSyncTime: new Date(),
        conversationVersions: new Map(),
        messageVersions: new Map(),
      };
      this.userSyncStates.set(userId, syncState);
    }

    return syncState;
  }

  /**
   * Update conversation version
   */
  public updateConversationVersion(userId: string, conversationId: string): void {
    const syncState = this.getSyncState(userId);
    const version = (syncState.conversationVersions.get(conversationId) || 0) + 1;
    syncState.conversationVersions.set(conversationId, version);
    syncState.lastSyncTime = new Date();
  }

  /**
   * Update message version
   */
  public updateMessageVersion(userId: string, messageId: string): void {
    const syncState = this.getSyncState(userId);
    const version = (syncState.messageVersions.get(messageId) || 0) + 1;
    syncState.messageVersions.set(messageId, version);
    syncState.lastSyncTime = new Date();
  }

  /**
   * Get changes since last sync
   */
  public getChangesSinceSync(
    userId: string,
    _lastSyncTime: Date
  ): {
    changedConversations: string[];
    changedMessages: string[];
  } {
    const syncState = this.getSyncState(userId);

    // For now, return all. In production, track actual changes
    return {
      changedConversations: Array.from(syncState.conversationVersions.keys()),
      changedMessages: Array.from(syncState.messageVersions.keys()),
    };
  }

  /**
   * Get presence history
   */
  public getPresenceHistory(userId: string, hoursBack: number = 24): PresenceUpdate[] {
    const cutoff = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    return this.presenceHistory.filter(p => p.userId === userId && p.timestamp >= cutoff);
  }

  /**
   * Get presence analytics
   */
  public getPresenceAnalytics(hoursBack: number = 24): {
    totalUsers: number;
    onlineUsers: number;
    avgSessionDuration: number;
    peakOnlineTime: number;
  } {
    const cutoff = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    const recentHistory = this.presenceHistory.filter(p => p.timestamp >= cutoff);

    // Unique users
    const uniqueUsers = new Set(recentHistory.map(p => p.userId)).size;

    // Currently online
    const onlineUsers = this.getOnlineUsers().length;

    // Calculate average session duration
    const userSessions = new Map<string, { start: Date; end?: Date }>();

    for (const update of recentHistory) {
      if (!userSessions.has(update.userId)) {
        userSessions.set(update.userId, { start: update.timestamp });
      }

      if (update.status === 'offline') {
        const session = userSessions.get(update.userId)!;
        session.end = update.timestamp;
      }
    }

    let totalDuration = 0;
    let sessionCount = 0;

    for (const session of userSessions.values()) {
      const endTime = session.end || new Date();
      totalDuration += endTime.getTime() - session.start.getTime();
      sessionCount++;
    }

    const avgSessionDuration = sessionCount > 0 ? totalDuration / sessionCount / 1000 / 60 : 0; // minutes

    // Peak online time
    const hourCounts = new Map<number, number>();
    for (const update of recentHistory) {
      if (update.status === 'online') {
        const hour = update.timestamp.getHours();
        const count = hourCounts.get(hour) || 0;
        hourCounts.set(hour, count + 1);
      }
    }

    let peakOnlineTime = 0;
    let maxCount = 0;

    for (const [hour, count] of hourCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        peakOnlineTime = hour;
      }
    }

    return {
      totalUsers: uniqueUsers,
      onlineUsers,
      avgSessionDuration,
      peakOnlineTime,
    };
  }

  /**
   * Broadcast presence update to connected clients
   */
  private broadcastPresenceUpdate(userId: string, presence: UserPresence): void {
    if (this.wsService) {
      // Broadcast to all connected clients
      (this.wsService as any).broadcast('presence_update', {
        userId,
        status: presence.status,
        lastSeen: presence.lastSeen,
        activeConversations: presence.activeConversations,
      });
    }
  }

  /**
   * Reset inactivity timer
   */
  private resetInactivityTimer(userId: string): void {
    // Clear existing timer
    const existingTimer = this.inactivityTimers.get(userId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      const presence = this.userPresence.get(userId);
      if (presence && presence.status !== 'offline') {
        // Mark as away if still online
        if (presence.status === 'online') {
          this.updatePresence(userId, 'away');
        }
      }

      this.inactivityTimers.delete(userId);
    }, this.inactivityTimeout);

    this.inactivityTimers.set(userId, timer);
  }

  /**
   * Setup periodic cleanup
   */
  private setupCleanup(): void {
    setInterval(
      () => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        // Mark offline users who haven't been active
        for (const [userId, presence] of this.userPresence.entries()) {
          if (presence.status !== 'offline' && presence.lastSeen < oneHourAgo) {
            presence.status = 'offline';
            this.broadcastPresenceUpdate(userId, presence);
          }
        }

        logger.debug('Presence cleanup completed');
      },
      5 * 60 * 1000
    ); // Every 5 minutes
  }

  /**
   * Get service health
   */
  public getHealth(): {
    onlineCount: number;
    offlineCount: number;
    activeTimers: number;
    syncStatesTracked: number;
  } {
    const onlineCount = this.getOnlineUsers().length;
    const offlineCount = Array.from(this.userPresence.values()).filter(
      p => p.status === 'offline'
    ).length;

    return {
      onlineCount,
      offlineCount,
      activeTimers: this.inactivityTimers.size,
      syncStatesTracked: this.userSyncStates.size,
    };
  }
}

export default PresenceAndSyncService;
