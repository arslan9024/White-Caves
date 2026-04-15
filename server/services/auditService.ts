/**
 * Audit Logger Service — White Caves CRM
 * 
 * Structured audit trail for all mutations. Records who changed what, when.
 * Critical for RERA compliance in Dubai real estate.
 * 
 * Modes:
 *   1. Automatic middleware — attach to Express to auto-log POST/PUT/PATCH/DELETE
 *   2. Manual logging — call auditService.log() directly for business-logic events
 * 
 * Sensitive fields (passwords, tokens, emirates IDs, OTPs) are automatically masked.
 */

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

// ─── Types ────────────────────────────────────────────────────────────────

export interface AuditEntry {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  userEmail?: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  statusCode?: number;
}

// ─── Sensitive Field Masking ─────────────────────────────────────────────

const SENSITIVE_FIELDS = new Set([
  'password', 'passwordHash', 'newPassword', 'oldPassword', 'confirmPassword',
  'token', 'accessToken', 'refreshToken', 'apiKey', 'secret', 'jwt',
  'creditCard', 'cardNumber', 'cvv', 'ccv',
  'emiratesId', 'nationalId', 'passportNumber', 'ssn',
  'otp', 'verificationCode', 'resetToken',
  'authorization', 'cookie',
]);

function maskSensitiveFields(obj: unknown, depth = 0): unknown {
  if (depth > 5 || obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitiveFields(item, depth + 1));
  }

  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_FIELDS.has(key) || SENSITIVE_FIELDS.has(key.toLowerCase())) {
      masked[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveFields(value, depth + 1);
    } else {
      masked[key] = value;
    }
  }
  return masked;
}

// ─── Entity Extraction ──────────────────────────────────────────────────

/** Extract entity type and ID from request path: /api/leads/abc123 → ['lead', 'abc123'] */
function extractEntityFromPath(path: string): { entity: string; entityId?: string } {
  // Remove /api prefix and clean
  const clean = path.replace(/^\/api\//, '').replace(/\/$/, '');
  const segments = clean.split('/');

  // Map plural route names to singular entity
  const ROUTE_TO_ENTITY: Record<string, string> = {
    leads: 'lead',
    properties: 'property',
    agents: 'user',
    users: 'user',
    transactions: 'transaction',
    commissions: 'commission',
    tenants: 'tenant',
    viewings: 'viewing',
    offers: 'offer',
    leases: 'lease',
    maintenance: 'maintenance',
    favorites: 'favorite',
    'saved-searches': 'saved_search',
    notifications: 'notification',
    auth: 'auth',
    compliance: 'compliance',
    finance: 'finance',
    crm: 'crm',
    dashboard: 'dashboard',
    reporting: 'reporting',
    nadia: 'nadia',
    linda: 'linda',
  };

  const entity = ROUTE_TO_ENTITY[segments[0]] || segments[0];
  const entityId = segments.length > 1 ? segments[1] : undefined;

  return { entity, entityId };
}

/** Map HTTP method to audit action */
function methodToAction(method: string): string {
  switch (method.toUpperCase()) {
    case 'POST': return 'create';
    case 'PUT': return 'update';
    case 'PATCH': return 'update';
    case 'DELETE': return 'delete';
    default: return method.toLowerCase();
  }
}

// ─── Audit Service ──────────────────────────────────────────────────────

class AuditService {
  private _logged = 0;
  private _errors = 0;

  /**
   * Manually log an audit entry (for business logic events like login, role change, export)
   */
  async log(entry: AuditEntry): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          action: entry.action,
          entity: entry.entity,
          entityId: entry.entityId,
          userId: entry.userId,
          userEmail: entry.userEmail,
          changes: entry.changes ? (maskSensitiveFields(entry.changes) as object) : undefined,
          metadata: entry.metadata ? (maskSensitiveFields(entry.metadata) as object) : undefined,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          duration: entry.duration,
          statusCode: entry.statusCode,
        },
      });
      this._logged++;
    } catch (err) {
      this._errors++;
      const msg = err instanceof Error ? err.message : String(err);
      logger.error('Audit log write failed', { error: msg, entry: { action: entry.action, entity: entry.entity } });
    }
  }

  /**
   * Express middleware that auto-logs all mutation requests (POST/PUT/PATCH/DELETE).
   * Attach AFTER auth middleware so req.user is available.
   */
  middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const method = req.method.toUpperCase();

      // Only log mutations
      if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        next();
        return;
      }

      const startTime = Date.now();
      const { entity, entityId } = extractEntityFromPath(req.path);
      const action = methodToAction(method);

      // Intercept response to capture status code
      const originalJson = res.json.bind(res);
      res.json = (body: unknown) => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;

        // Fire-and-forget — don't block the response
        this.log({
          action,
          entity,
          entityId: entityId || (body as Record<string, unknown>)?.data && typeof (body as Record<string, Record<string, unknown>>)?.data?.id === 'string'
            ? (body as Record<string, Record<string, string>>).data.id
            : undefined,
          userId: req.user?.id,
          userEmail: req.user?.email,
          changes: method !== 'DELETE' ? { requestBody: { old: null, new: maskSensitiveFields(req.body) } } as Record<string, { old: unknown; new: unknown }> : undefined,
          metadata: {
            method,
            path: req.originalUrl,
            query: Object.keys(req.query).length > 0 ? req.query : undefined,
            statusCode,
          },
          ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
          duration,
          statusCode,
        }).catch(() => {
          // Already logged inside .log()
        });

        return originalJson(body);
      };

      next();
    };
  }

  /**
   * Get recent audit log entries (admin only)
   */
  async getRecent(options: { page?: number; limit?: number; entity?: string; userId?: string; action?: string } = {}) {
    const { page = 1, limit = 50, entity, userId, action } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;
    if (action) where.action = action;

    const [entries, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      entries,
      pagination: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get audit stats summary
   */
  async getStats(since?: Date) {
    const where: Record<string, unknown> = {};
    if (since) where.createdAt = { gte: since };

    const [totalEntries, byAction, byEntity] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.groupBy({ by: ['action'], _count: true, where }),
      prisma.auditLog.groupBy({ by: ['entity'], _count: true, where }),
    ]);

    return {
      totalEntries,
      byAction: byAction.reduce((acc, r) => ({ ...acc, [r.action]: r._count }), {} as Record<string, number>),
      byEntity: byEntity.reduce((acc, r) => ({ ...acc, [r.entity]: r._count }), {} as Record<string, number>),
      serviceStats: { logged: this._logged, errors: this._errors },
    };
  }
}

// Singleton
export const auditService = new AuditService();
export default auditService;
