import { EventEmitter } from 'events';
import crypto from 'crypto';

class EncryptedSessionStorage extends EventEmitter {
  constructor() {
    super();
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
    this.encryptionKey = process.env.NINA_ENCRYPTION_KEY || this.generateKey();
  }

  generateKey() {
    return crypto.randomBytes(this.keyLength).toString('hex').slice(0, 32);
  }

  encrypt(data) {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey, 'utf8'),
        iv
      );
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag();

      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        tag: authTag.toString('hex'),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Encryption error:', error.message);
      return null;
    }
  }

  decrypt(encryptedData) {
    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey, 'utf8'),
        Buffer.from(encryptedData.iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error.message);
      return null;
    }
  }

  hashSensitiveData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

class AccessAuditLogger extends EventEmitter {
  constructor() {
    super();
    this.logs = [];
    this.maxLogs = 10000;
  }

  log(action, userId, details = {}) {
    const entry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      userId,
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown',
      resource: details.resource || 'unknown',
      status: details.status || 'success',
      metadata: details.metadata || {}
    };

    this.logs.unshift(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    this.emit('logged', entry);
    return entry;
  }

  getRecentLogs(limit = 100) {
    return this.logs.slice(0, limit);
  }

  getLogsByUser(userId, limit = 50) {
    return this.logs.filter(log => log.userId === userId).slice(0, limit);
  }

  getLogsByAction(action, limit = 50) {
    return this.logs.filter(log => log.action === action).slice(0, limit);
  }

  getSuspiciousActivity() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    const recentLogs = this.logs.filter(log => new Date(log.timestamp).getTime() > oneHourAgo);
    
    const userAttempts = {};
    recentLogs.forEach(log => {
      if (log.status === 'failed') {
        userAttempts[log.userId] = (userAttempts[log.userId] || 0) + 1;
      }
    });

    return Object.entries(userAttempts)
      .filter(([_, count]) => count >= 5)
      .map(([userId, count]) => ({
        userId,
        failedAttempts: count,
        risk: count >= 10 ? 'high' : 'medium'
      }));
  }
}

class RoleBasedAccessControl extends EventEmitter {
  constructor() {
    super();
    this.roles = {
      admin: {
        permissions: ['*'],
        description: 'Full system access'
      },
      manager: {
        permissions: ['campaigns.read', 'campaigns.write', 'contacts.read', 'contacts.write', 'analytics.read'],
        description: 'Campaign and contact management'
      },
      agent: {
        permissions: ['campaigns.read', 'contacts.read', 'messages.send'],
        description: 'Send messages and view campaigns'
      },
      viewer: {
        permissions: ['campaigns.read', 'contacts.read', 'analytics.read'],
        description: 'Read-only access'
      }
    };
    
    this.users = new Map();
  }

  assignRole(userId, role) {
    if (!this.roles[role]) {
      throw new Error(`Invalid role: ${role}`);
    }
    this.users.set(userId, { role, assignedAt: new Date().toISOString() });
    this.emit('roleAssigned', { userId, role });
  }

  removeRole(userId) {
    this.users.delete(userId);
    this.emit('roleRemoved', { userId });
  }

  hasPermission(userId, permission) {
    const userRole = this.users.get(userId);
    if (!userRole) return false;

    const role = this.roles[userRole.role];
    if (!role) return false;

    if (role.permissions.includes('*')) return true;
    return role.permissions.includes(permission);
  }

  getUserRole(userId) {
    return this.users.get(userId);
  }

  getAllUsers() {
    return Array.from(this.users.entries()).map(([userId, data]) => ({
      userId,
      ...data
    }));
  }
}

class SessionManager extends EventEmitter {
  constructor() {
    super();
    this.sessions = new Map();
    this.maxSessionAge = 24 * 60 * 60 * 1000;
  }

  createSession(userId) {
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.maxSessionAge,
      lastActivity: Date.now()
    };
    
    this.sessions.set(sessionId, session);
    this.emit('sessionCreated', session);
    return session;
  }

  validateSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return { valid: false, reason: 'Session not found' };
    
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return { valid: false, reason: 'Session expired' };
    }

    session.lastActivity = Date.now();
    return { valid: true, session };
  }

  destroySession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.delete(sessionId);
      this.emit('sessionDestroyed', session);
    }
  }

  getActiveSessions() {
    return Array.from(this.sessions.values()).filter(s => Date.now() < s.expiresAt);
  }

  cleanupExpiredSessions() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [sessionId, session] of this.sessions) {
      if (now > session.expiresAt) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }
    
    return cleaned;
  }
}

export const encryptedStorage = new EncryptedSessionStorage();
export const auditLogger = new AccessAuditLogger();
export const accessControl = new RoleBasedAccessControl();
export const sessionManager = new SessionManager();

export default {
  encryptedStorage,
  auditLogger,
  accessControl,
  sessionManager
};
