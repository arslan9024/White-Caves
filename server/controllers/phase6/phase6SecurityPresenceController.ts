/**
 * Phase 6 Security & Presence Controller
 * Endpoints for end-to-end payload encryption/decryption, user presence, state sync, and health checks.
 */

import { Request, Response } from 'express';
import logger from '../../utils/logger.js';
import {
  queueService,
  analyticsService,
  encryptionService,
  presenceService,
} from './phase6Common.js';

// ============ ENCRYPTION ENDPOINTS ============

export const generateKeyPair = (req: Request, res: Response): void => {
  const keyPair = encryptionService.generateUserKeyPair((req as any).userId);
  res.json({
    keyId: keyPair.keyId,
    publicKey: keyPair.publicKey,
    createdAt: keyPair.createdAt,
    expiresAt: keyPair.expiresAt,
  });
};

export const getPublicKey = (req: Request, res: Response): void => {
  const { userId } = req.params as Record<string, string>;
  const publicKey = encryptionService.getUserPublicKey(userId);

  if (!publicKey) {
    res.status(404).json({ error: 'Public key not found' });
    return;
  }

  res.json({ publicKey });
};

export const encryptMessage = (req: Request, res: Response): void => {
  const { message, key } = req.body;

  if (!message || !key) {
    res.status(400).json({ error: 'Message and key are required' });
    return;
  }

  const encrypted = encryptionService.encryptMessage(message, key);
  analyticsService.trackEvent((req as any).userId, 'message_encrypted');

  res.json(encrypted);
};

export const decryptMessage = (req: Request, res: Response): void => {
  const { encrypted, key } = req.body;

  if (!encrypted || !key) {
    res.status(400).json({ error: 'Encrypted message and key are required' });
    return;
  }

  try {
    const decrypted = encryptionService.decryptMessage(encrypted, key);
    analyticsService.trackEvent((req as any).userId, 'message_decrypted');
    res.json({ message: decrypted });
  } catch (error) {
    logger.error('Decryption failed:', error);
    res.status(400).json({ error: 'Decryption failed' });
  }
};

export const getSecurityMetrics = (_req: Request, res: Response): void => {
  const metrics = encryptionService.getSecurityMetrics();
  res.json(metrics);
};

// ============ PRESENCE & SYNC ENDPOINTS ============

export const updatePresence = (req: Request, res: Response): void => {
  const { status } = req.body;

  if (!status || !['online', 'offline', 'away', 'busy'].includes(status)) {
    res.status(400).json({ error: 'Valid status is required' });
    return;
  }

  presenceService.updatePresence((req as any).userId, status);
  res.json({ message: 'Presence updated' });
};

export const getUserPresence = (req: Request, res: Response): void => {
  const { userId } = req.params as Record<string, string>;
  const presence = presenceService.getPresence(userId);

  if (!presence) {
    res.status(404).json({ error: 'Presence not found' });
    return;
  }

  res.json(presence);
};

export const getOnlineUsers = (_req: Request, res: Response): void => {
  const onlineUsers = presenceService.getOnlineUsers();
  res.json({ users: onlineUsers, count: onlineUsers.length });
};

export const getConversationUsers = (req: Request, res: Response): void => {
  const { conversationId } = req.params as Record<string, string>;
  const users = presenceService.getUsersInConversation(conversationId);
  res.json({ users, count: users.length });
};

export const getSyncState = (req: Request, res: Response): void => {
  const syncState = presenceService.getSyncState((req as any).userId);
  res.json(syncState);
};

export const getSyncChanges = (req: Request, res: Response): void => {
  const { lastSyncTime } = req.query as Record<string, string | undefined>;

  if (!lastSyncTime) {
    res.status(400).json({ error: 'Last sync time is required' });
    return;
  }

  const changes = presenceService.getChangesSinceSync(
    (req as any).userId,
    new Date(lastSyncTime as string)
  );

  res.json(changes);
};

export const getPresenceHistory = (req: Request, res: Response): void => {
  const { userId } = req.params as Record<string, string>;
  const { hoursBack = 24 } = req.query as Record<string, string | undefined>;

  const history = presenceService.getPresenceHistory(userId, Number(hoursBack));
  res.json({ history, count: history.length });
};

export const getPresenceAnalyticsSummary = (req: Request, res: Response): void => {
  const { hoursBack = 24 } = req.query as Record<string, string | undefined>;
  const analytics = presenceService.getPresenceAnalytics(Number(hoursBack));
  res.json(analytics);
};

export const getHealth = (_req: Request, res: Response): void => {
  const health = {
    status: 'healthy',
    queue: queueService.getStats(),
    presence: presenceService.getHealth(),
    timestamp: new Date(),
  };

  res.json(health);
};

