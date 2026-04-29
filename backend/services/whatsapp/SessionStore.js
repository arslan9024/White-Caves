/**
 * WhatsApp Session Store
 * 
 * Manages persistent storage of WhatsApp Web sessions
 * Supports in-memory and database backends
 */

class SessionStore {
  constructor(type = 'memory', database = null) {
    this.type = type;
    this.db = database;
    this.memoryStore = new Map();
    console.log(`[SessionStore] Using ${type} backend`);
  }

  /**
   * Save session to store
   */
  async save(sessionId, sessionData) {
    try {
      if (this.type === 'memory') {
        this.memoryStore.set(sessionId, sessionData);
        console.log(`[SessionStore] Session saved (memory): ${sessionId}`);
      } else if (this.type === 'database' && this.db) {
        await this.db.collection('whatsapp_sessions').updateOne(
          { sessionId },
          { $set: sessionData },
          { upsert: true }
        );
        console.log(`[SessionStore] Session saved (database): ${sessionId}`);
      }

      return sessionData;
    } catch (error) {
      console.error('[SessionStore] Save failed:', error);
      throw error;
    }
  }

  /**
   * Get session from store
   */
  async get(sessionId) {
    try {
      if (this.type === 'memory') {
        const data = this.memoryStore.get(sessionId);
        if (data) {
          console.log(`[SessionStore] Session retrieved (memory): ${sessionId}`);
        }
        return data || null;
      } else if (this.type === 'database' && this.db) {
        const data = await this.db.collection('whatsapp_sessions').findOne({
          sessionId,
        });
        if (data) {
          console.log(`[SessionStore] Session retrieved (database): ${sessionId}`);
        }
        return data || null;
      }
    } catch (error) {
      console.error('[SessionStore] Get failed:', error);
      throw error;
    }
  }

  /**
   * Delete session from store
   */
  async delete(sessionId) {
    try {
      if (this.type === 'memory') {
        this.memoryStore.delete(sessionId);
        console.log(`[SessionStore] Session deleted (memory): ${sessionId}`);
      } else if (this.type === 'database' && this.db) {
        await this.db.collection('whatsapp_sessions').deleteOne({
          sessionId,
        });
        console.log(`[SessionStore] Session deleted (database): ${sessionId}`);
      }

      return true;
    } catch (error) {
      console.error('[SessionStore] Delete failed:', error);
      throw error;
    }
  }

  /**
   * Get all sessions
   */
  async getAllSessions() {
    try {
      if (this.type === 'memory') {
        return Array.from(this.memoryStore.values());
      } else if (this.type === 'database' && this.db) {
        return await this.db.collection('whatsapp_sessions').find({}).toArray();
      }
    } catch (error) {
      console.error('[SessionStore] Get all sessions failed:', error);
      throw error;
    }
  }

  /**
   * Get sessions by account
   */
  async getSessionsByAccount(accountId) {
    try {
      if (this.type === 'memory') {
        return Array.from(this.memoryStore.values()).filter(
          s => s.accountId === accountId
        );
      } else if (this.type === 'database' && this.db) {
        return await this.db.collection('whatsapp_sessions')
          .find({ accountId })
          .toArray();
      }
    } catch (error) {
      console.error('[SessionStore] Get account sessions failed:', error);
      throw error;
    }
  }

  /**
   * Clear all sessions
   */
  async clear() {
    try {
      if (this.type === 'memory') {
        this.memoryStore.clear();
        console.log('[SessionStore] All sessions cleared (memory)');
      } else if (this.type === 'database' && this.db) {
        await this.db.collection('whatsapp_sessions').deleteMany({});
        console.log('[SessionStore] All sessions cleared (database)');
      }

      return true;
    } catch (error) {
      console.error('[SessionStore] Clear failed:', error);
      throw error;
    }
  }

  /**
   * Check if session exists
   */
  async exists(sessionId) {
    try {
      if (this.type === 'memory') {
        return this.memoryStore.has(sessionId);
      } else if (this.type === 'database' && this.db) {
        const count = await this.db.collection('whatsapp_sessions').countDocuments({
          sessionId,
        });
        return count > 0;
      }
    } catch (error) {
      console.error('[SessionStore] Exists check failed:', error);
      throw error;
    }
  }

  /**
   * Get session count
   */
  async count() {
    try {
      if (this.type === 'memory') {
        return this.memoryStore.size;
      } else if (this.type === 'database' && this.db) {
        return await this.db.collection('whatsapp_sessions').countDocuments({});
      }
    } catch (error) {
      console.error('[SessionStore] Count failed:', error);
      throw error;
    }
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpiredSessions() {
    try {
      if (this.type === 'memory') {
        const now = new Date();
        let deletedCount = 0;

        for (const [sessionId, sessionData] of this.memoryStore) {
          if (sessionData.expiresAt && sessionData.expiresAt < now) {
            this.memoryStore.delete(sessionId);
            deletedCount++;
          }
        }

        console.log(`[SessionStore] Cleanup (memory): ${deletedCount} expired sessions removed`);
        return deletedCount;
      } else if (this.type === 'database' && this.db) {
        const result = await this.db.collection('whatsapp_sessions').deleteMany({
          expiresAt: { $lt: new Date() },
        });

        console.log(`[SessionStore] Cleanup (database): ${result.deletedCount} expired sessions removed`);
        return result.deletedCount;
      }
    } catch (error) {
      console.error('[SessionStore] Cleanup failed:', error);
      throw error;
    }
  }
}

module.exports = SessionStore;
