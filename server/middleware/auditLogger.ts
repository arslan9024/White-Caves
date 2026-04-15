/**
 * Audit Logger Middleware — White Caves CRM
 *
 * Structured audit trail for all state-changing API requests.
 * Captures: who, what, when, where, outcome, and duration.
 *
 * Features:
 *   - Automatic detection of mutation methods (POST/PUT/PATCH/DELETE)
 *   - Sensitive field masking (passwords, tokens, CC numbers)
 *   - Response interception for status code capture
 *   - Request duration tracking
 *   - Configurable storage (console, file, or database)
 *   - Minimal overhead on read-only requests
 *
 * Usage:
 *   import { auditLogger } from '../middleware/auditLogger.js';
 *   app.use('/api', auditLogger);   // Log all mutations
 *
 *   // Or selective:
 *   router.delete('/:id', auditLogger, handler);
 */

import type { Request, Response, NextFunction } from 'express';
import { createLogger } from '../utils/logger.js';

const log = createLogger('Audit');

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

/** HTTP methods considered state-changing (logged with full detail) */
const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Fields to redact from request body logging */
const SENSITIVE_FIELDS = new Set([
  'password',
  'newPassword',
  'oldPassword',
  'confirmPassword',
  'token',
  'refreshToken',
  'accessToken',
  'secret',
  'apiKey',
  'creditCard',
  'cardNumber',
  'cvv',
  'ssn',
  'emiratesId',
  'otp',
  'pin',
]);

/** Maximum body size to log (prevents huge payloads in audit log) */
const MAX_BODY_LOG_SIZE = 2048; // 2KB

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface AuditEntry {
  timestamp: string;
  requestId: string;
  method: string;
  path: string;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  ip: string;
  userAgent: string;
  statusCode: number;
  durationMs: number;
  body: Record<string, unknown> | null;
  query: Record<string, unknown> | null;
  isMutation: boolean;
  resource: string;       // Derived from path (e.g. 'leads', 'properties')
  action: string;         // Derived from method + path (e.g. 'CREATE', 'UPDATE', 'DELETE')
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

let requestCounter = 0;

function generateRequestId(): string {
  requestCounter += 1;
  return `req_${Date.now()}_${requestCounter}`;
}

/**
 * Deep-mask sensitive fields in an object.
 * Returns a new object with sensitive values replaced by '[REDACTED]'.
 */
function maskSensitiveFields(obj: Record<string, unknown>): Record<string, unknown> {
  const masked: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.has(key.toLowerCase()) || SENSITIVE_FIELDS.has(key)) {
      masked[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      masked[key] = maskSensitiveFields(value as Record<string, unknown>);
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

/**
 * Truncate body to MAX_BODY_LOG_SIZE to prevent log bloat.
 */
function truncateBody(body: Record<string, unknown>): Record<string, unknown> | null {
  const json = JSON.stringify(body);
  if (json.length <= MAX_BODY_LOG_SIZE) return body;

  // Return a summary instead
  return {
    _truncated: true,
    _originalSize: json.length,
    _fields: Object.keys(body),
  };
}

/**
 * Extract resource name from API path.
 * '/api/leads/abc123' → 'leads'
 * '/api/properties/abc/photos' → 'properties'
 */
function extractResource(path: string): string {
  const segments = path.replace(/^\/api\//, '').split('/');
  return segments[0] || 'unknown';
}

/**
 * Derive action from HTTP method.
 */
function deriveAction(method: string, path: string): string {
  switch (method) {
    case 'POST':
      return 'CREATE';
    case 'PUT':
    case 'PATCH':
      return 'UPDATE';
    case 'DELETE':
      return 'DELETE';
    case 'GET':
      return 'READ';
    default:
      return method;
  }
}

/**
 * Get client IP — handles proxies (X-Forwarded-For).
 */
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip || req.socket.remoteAddress || 'unknown';
}

// ─────────────────────────────────────────────────────────────
// Audit Storage (pluggable)
// ─────────────────────────────────────────────────────────────

type AuditStoreFn = (entry: AuditEntry) => void | Promise<void>;

/** Default: structured log output */
const consoleStore: AuditStoreFn = (entry) => {
  const level = entry.statusCode >= 400 ? 'warn' : 'info';
  log[level](
    `[AUDIT] ${entry.action} ${entry.resource} — ${entry.statusCode} (${entry.durationMs}ms)`,
    {
      requestId: entry.requestId,
      userId: entry.userId,
      method: entry.method,
      path: entry.path,
      status: entry.statusCode,
      duration: `${entry.durationMs}ms`,
      ip: entry.ip,
    }
  );
};

/** Storage backend — defaults to console, can be overridden */
let auditStore: AuditStoreFn = consoleStore;

/**
 * Set a custom audit storage backend (e.g. MongoDB, file, external service).
 * @param store Function that receives AuditEntry objects
 */
export function setAuditStore(store: AuditStoreFn): void {
  auditStore = store;
  log.info('Audit store backend updated');
}

// ─────────────────────────────────────────────────────────────
// In-Memory Audit Buffer (for /api/audit/recent endpoint)
// ─────────────────────────────────────────────────────────────

const AUDIT_BUFFER_SIZE = 500;
const auditBuffer: AuditEntry[] = [];

function bufferAuditEntry(entry: AuditEntry): void {
  auditBuffer.push(entry);
  if (auditBuffer.length > AUDIT_BUFFER_SIZE) {
    auditBuffer.shift(); // Remove oldest
  }
}

/** Get recent audit entries (for admin dashboard) */
export function getRecentAuditEntries(limit: number = 50): AuditEntry[] {
  return auditBuffer.slice(-limit).reverse();
}

/** Query audit entries by user */
export function getAuditEntriesByUser(userId: string, limit: number = 50): AuditEntry[] {
  return auditBuffer
    .filter((e) => e.userId === userId)
    .slice(-limit)
    .reverse();
}

/** Get audit statistics */
export function getAuditStats(): {
  totalEntries: number;
  mutations: number;
  errors: number;
  uniqueUsers: number;
  topResources: Array<{ resource: string; count: number }>;
} {
  const mutations = auditBuffer.filter((e) => e.isMutation).length;
  const errors = auditBuffer.filter((e) => e.statusCode >= 400).length;
  const uniqueUsers = new Set(auditBuffer.map((e) => e.userId).filter(Boolean)).size;

  const resourceCounts: Record<string, number> = {};
  for (const entry of auditBuffer) {
    resourceCounts[entry.resource] = (resourceCounts[entry.resource] || 0) + 1;
  }
  const topResources = Object.entries(resourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([resource, count]) => ({ resource, count }));

  return { totalEntries: auditBuffer.length, mutations, errors, uniqueUsers, topResources };
}

// ─────────────────────────────────────────────────────────────
// Express Middleware
// ─────────────────────────────────────────────────────────────

/**
 * Audit logging middleware.
 * Intercepts response to capture status code and duration.
 *
 * - Mutations (POST/PUT/PATCH/DELETE): full audit with masked body
 * - Reads (GET): lightweight audit (no body logging)
 */
export function auditLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const isMutation = MUTATION_METHODS.has(req.method);

  // Attach requestId to request for correlation in error logs
  (req as any).requestId = requestId;

  // Intercept response finish to capture status code
  const originalEnd = res.end;
  res.end = function (...args: any[]) {
    const durationMs = Date.now() - startTime;
    const user = (req as any).user;

    // Build body (masked, truncated) — only for mutations
    let body: Record<string, unknown> | null = null;
    if (isMutation && req.body && typeof req.body === 'object') {
      body = truncateBody(maskSensitiveFields(req.body));
    }

    // Build query params (for search auditing)
    const query = Object.keys(req.query).length > 0
      ? (req.query as Record<string, unknown>)
      : null;

    const entry: AuditEntry = {
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      path: req.originalUrl || req.path,
      userId: user?.id ?? null,
      userEmail: user?.email ?? null,
      userRole: user?.role ?? null,
      ip: getClientIp(req),
      userAgent: (req.headers['user-agent'] || '').substring(0, 200),
      statusCode: res.statusCode,
      durationMs,
      body,
      query,
      isMutation,
      resource: extractResource(req.originalUrl || req.path),
      action: deriveAction(req.method, req.originalUrl || req.path),
    };

    // Store audit entry (async-safe — fire and forget)
    try {
      bufferAuditEntry(entry);
      const storeResult = auditStore(entry);
      if (storeResult instanceof Promise) {
        storeResult.catch((err) => {
          log.error('Audit store write failed', { error: err instanceof Error ? err.message : err });
        });
      }
    } catch (err) {
      log.error('Audit logging failed', { error: err instanceof Error ? err.message : err });
    }

    return originalEnd.apply(res, args as any);
  } as any;

  next();
}

/**
 * Selective audit middleware — only logs mutations.
 * Lighter weight than full auditLogger.
 */
export function auditMutations(req: Request, res: Response, next: NextFunction): void {
  if (MUTATION_METHODS.has(req.method)) {
    return auditLogger(req, res, next);
  }
  next();
}
