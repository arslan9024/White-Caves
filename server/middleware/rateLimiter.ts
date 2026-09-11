/**
 * Rate Limiting Middleware — White Caves CRM
 * Protects against brute-force attacks and API abuse.
 * Uses express-rate-limit backed by Redis (ioredis) with automatic in-memory fallback.
 */

import Redis from 'ioredis';
import rateLimit, {
  type RateLimitRequestHandler,
  type Store,
  type Options as RateLimitOptions,
  type IncrementResponse,
  type ClientRateLimitInfo,
} from 'express-rate-limit';
import { REDIS_URL } from '../config/env.js';
import logger from '../utils/logger.js';

interface FirebaseSyncBody {
  firebaseUid?: unknown;
  email?: unknown;
}

// ─── Shared Redis Connection ─────────────────────────────────────────────
let sharedRedisClient: Redis | null = null;
let sharedRedisInitialized = false;

export const getSharedRateLimitRedisClient = (): Redis | null => {
  if (sharedRedisInitialized) return sharedRedisClient;
  sharedRedisInitialized = true;

  if (!REDIS_URL) {
    logger.info('REDIS_URL not set — rate limiters operating with local in-memory store');
    return null;
  }

  try {
    sharedRedisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      lazyConnect: true,
      connectTimeout: 3000,
      keepAlive: 10000,
      retryStrategy: (times: number) => {
        if (times > 5) return null;
        return Math.min(times * 200, 2000);
      },
    });

    sharedRedisClient.on('connect', () => {
      logger.info('Rate limiter Redis client connected successfully');
    });

    sharedRedisClient.on('error', (err: Error) => {
      logger.warn('Rate limiter Redis connection error:', err.message);
    });

    void sharedRedisClient.connect().catch((err: Error) => {
      logger.warn('Rate limiter Redis lazy connection failed, falling back to memory store:', err.message);
    });
  } catch (err: unknown) {
    logger.warn('Failed to initialize Redis client for rate limiter:', (err as Error).message);
    sharedRedisClient = null;
  }

  return sharedRedisClient;
};

export const closeSharedRateLimitRedisClient = async (): Promise<void> => {
  if (sharedRedisClient) {
    try {
      await sharedRedisClient.quit();
    } catch {
      sharedRedisClient.disconnect();
    } finally {
      sharedRedisClient = null;
      sharedRedisInitialized = false;
    }
  }
};

// ─── Redis Rate Limit Store Abstraction ──────────────────────────────────
const LUA_INCR_EXPIRE_SCRIPT = `
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
local pttl = redis.call('PTTL', KEYS[1])
if pttl < 0 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
  pttl = tonumber(ARGV[1])
end
return { current, pttl }
`;

export interface RedisRateLimitStoreOptions {
  prefix: string;
  client?: Redis | null;
  windowMs?: number;
}

export class RedisRateLimitStore implements Store {
  prefix: string;
  localKeys = false;
  windowMs: number;
  private client: Redis | null;
  private memoryFallback = new Map<string, { hits: number; resetTime: number }>();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(options: RedisRateLimitStoreOptions) {
    this.prefix = options.prefix;
    this.windowMs = options.windowMs || 60000;
    this.client = options.client !== undefined ? options.client : null;

    // Periodic sweep for expired memory entries (unreferenced so process can exit)
    this.cleanupTimer = setInterval(() => {
      this.sweepExpiredMemory();
    }, 60000);
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  private resolveClient(): Redis | null {
    if (this.client !== null) return this.client;
    return getSharedRateLimitRedisClient();
  }

  private isClientReady(client: Redis | null): boolean {
    if (!client) return false;
    if (typeof (client as any).status === 'string') {
      return (client as any).status === 'ready' || (client as any).status === 'connect';
    }
    return typeof (client as any).eval === 'function';
  }

  private sweepExpiredMemory(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryFallback.entries()) {
      if (now >= entry.resetTime) {
        this.memoryFallback.delete(key);
      }
    }
  }

  init(options: RateLimitOptions): void {
    if (options.windowMs) {
      this.windowMs = options.windowMs;
    }
  }

  async increment(key: string): Promise<IncrementResponse> {
    const fullKey = `${this.prefix}${key}`;
    const client = this.resolveClient();

    if (this.isClientReady(client)) {
      try {
        const result = (await (client as Redis).eval(
          LUA_INCR_EXPIRE_SCRIPT,
          1,
          fullKey,
          this.windowMs.toString()
        )) as [number, number];

        const totalHits = Number(result[0]);
        const pttl = Number(result[1]);
        const resetTime = new Date(Date.now() + Math.max(pttl, 0));

        return { totalHits, resetTime };
      } catch (err: unknown) {
        logger.warn(
          `Redis rate limit increment failed for ${fullKey}, falling back to memory: ${(err as Error).message}`
        );
      }
    }

    // Memory fallback
    return this.incrementMemory(key);
  }

  private incrementMemory(key: string): IncrementResponse {
    const now = Date.now();
    const existing = this.memoryFallback.get(key);

    if (!existing || now >= existing.resetTime) {
      const resetTime = now + this.windowMs;
      this.memoryFallback.set(key, { hits: 1, resetTime });
      return { totalHits: 1, resetTime: new Date(resetTime) };
    }

    existing.hits += 1;
    return { totalHits: existing.hits, resetTime: new Date(existing.resetTime) };
  }

  async decrement(key: string): Promise<void> {
    const fullKey = `${this.prefix}${key}`;
    const client = this.resolveClient();

    if (this.isClientReady(client)) {
      try {
        await (client as Redis).decr(fullKey);
        return;
      } catch (err: unknown) {
        logger.warn(`Redis rate limit decrement failed for ${fullKey}: ${(err as Error).message}`);
      }
    }

    const existing = this.memoryFallback.get(key);
    if (existing && existing.hits > 0) {
      existing.hits -= 1;
    }
  }

  async resetKey(key: string): Promise<void> {
    const fullKey = `${this.prefix}${key}`;
    const client = this.resolveClient();

    if (this.isClientReady(client)) {
      try {
        await (client as Redis).del(fullKey);
        return;
      } catch (err: unknown) {
        logger.warn(`Redis rate limit resetKey failed for ${fullKey}: ${(err as Error).message}`);
      }
    }

    this.memoryFallback.delete(key);
  }

  async resetAll(): Promise<void> {
    const client = this.resolveClient();

    if (this.isClientReady(client)) {
      try {
        const keys = await (client as Redis).keys(`${this.prefix}*`);
        if (keys.length > 0) {
          await (client as Redis).del(...keys);
        }
        return;
      } catch (err: unknown) {
        logger.warn(`Redis rate limit resetAll failed for ${this.prefix}: ${(err as Error).message}`);
      }
    }

    this.memoryFallback.clear();
  }

  async get(key: string): Promise<ClientRateLimitInfo | undefined> {
    const fullKey = `${this.prefix}${key}`;
    const client = this.resolveClient();

    if (this.isClientReady(client)) {
      try {
        const [val, pttl] = await Promise.all([
          (client as Redis).get(fullKey),
          (client as Redis).pttl(fullKey),
        ]);

        if (val !== null && pttl >= 0) {
          return {
            totalHits: parseInt(val, 10),
            resetTime: new Date(Date.now() + pttl),
          };
        }
        return undefined;
      } catch (err: unknown) {
        logger.warn(`Redis rate limit get failed for ${fullKey}: ${(err as Error).message}`);
      }
    }

    const existing = this.memoryFallback.get(key);
    if (existing && Date.now() < existing.resetTime) {
      return {
        totalHits: existing.hits,
        resetTime: new Date(existing.resetTime),
      };
    }

    return undefined;
  }

  shutdown(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.memoryFallback.clear();
  }
}

/**
 * Factory helper to create dedicated namespaced store instances.
 */
export const createRateLimitStore = (
  name: string,
  options?: Partial<RedisRateLimitStoreOptions>
): Store => {
  return new RedisRateLimitStore({
    prefix: `rl:${name}:`,
    ...options,
  });
};

// ─── Helpers ─────────────────────────────────────────────────────────────
const resolveFirebaseIdentity = (body: unknown): string => {
  if (!body || typeof body !== 'object') {
    return 'anonymous';
  }

  const payload = body as FirebaseSyncBody;
  const firebaseUid =
    typeof payload.firebaseUid === 'string' && payload.firebaseUid.trim().length > 0
      ? payload.firebaseUid.trim()
      : '';

  if (firebaseUid) {
    return `uid:${firebaseUid}`;
  }

  const email =
    typeof payload.email === 'string' && payload.email.trim().length > 0
      ? payload.email.trim().toLowerCase()
      : '';

  return email ? `email:${email}` : 'anonymous';
};

const normalizeIpKey = (ip: string | undefined): string => (ip || '').trim() || 'unknown-ip';

let forceRateLimitTesting = false;
export const setRateLimitingEnabledInTest = (enabled: boolean): void => {
  forceRateLimitTesting = enabled;
};

export const isRateLimitingSkipped = (): boolean => {
  if (forceRateLimitTesting) return false;
  return process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';
};

// ============================================================================
// AUTH RATE LIMITER — Strict limits for login/register/password
// ============================================================================

/** Login: 5 attempts per 15 minutes per IP */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  store: createRateLimitStore('auth'),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: 'Too many login attempts',
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
    statusCode: 429,
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  skip: () => isRateLimitingSkipped(),
});

/** Firebase sync: allow more attempts for social auth handshake retries (shared IP safe) */
export const firebaseSyncLimiter: RateLimitRequestHandler = rateLimit({
  store: createRateLimitStore('fb_sync'),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120,
  message: {
    success: false,
    error: 'Too many Firebase sync attempts',
    message:
      'Too many Firebase session sync attempts from this IP. Please wait a few minutes and try again.',
    statusCode: 429,
  },
  keyGenerator: req => {
    const baseIp = normalizeIpKey(req.ip || req.socket.remoteAddress || undefined);
    const identity = resolveFirebaseIdentity(req.body);
    return `${baseIp}:${identity}`;
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Successful auth sync should not consume quota.
  skipSuccessfulRequests: true,
  skip: () => isRateLimitingSkipped(),
});

/** Registration: 3 attempts per hour per IP */
export const registerLimiter: RateLimitRequestHandler = rateLimit({
  store: createRateLimitStore('register'),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: 'Too many registration attempts',
    message: 'Too many registration attempts from this IP. Please try again after 1 hour.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isRateLimitingSkipped(),
});

/** Password change: 5 attempts per hour */
export const passwordLimiter: RateLimitRequestHandler = rateLimit({
  store: createRateLimitStore('password'),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    error: 'Too many password change attempts',
    message: 'Too many password change attempts. Please try again later.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isRateLimitingSkipped(),
});

// ============================================================================
// API RATE LIMITER — General API protection
// ============================================================================

/** General API: 100 requests per minute per IP */
export const apiLimiter: RateLimitRequestHandler = rateLimit({
  store: createRateLimitStore('api'),
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many requests from this IP. Please try again after 1 minute.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => {
    if (isRateLimitingSkipped()) return true;
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health';
  },
});

// ============================================================================
// STRICT LIMITER — For sensitive operations (2FA, exports, bulk actions)
// ============================================================================

/** Strict: 10 requests per 15 minutes */
export const strictLimiter: RateLimitRequestHandler = rateLimit({
  store: createRateLimitStore('strict'),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many requests for this operation. Please try again later.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isRateLimitingSkipped(),
});

// ============================================================================
// CONTACT LIMITER — Public unauthenticated form submissions
// ============================================================================

/**
 * Contact form: 10 submissions per hour per IP.
 * Tighter than the general apiLimiter because this creates DB records from
 * unauthenticated requests and is a spam/flood vector.
 */
export const contactLimiter: RateLimitRequestHandler = rateLimit({
  store: createRateLimitStore('contact'),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: 'Too many contact form submissions',
    message: 'Too many submissions from this IP. Please try again after 1 hour.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isRateLimitingSkipped(),
});

export default {
  authLimiter,
  firebaseSyncLimiter,
  registerLimiter,
  passwordLimiter,
  apiLimiter,
  strictLimiter,
  contactLimiter,
  createRateLimitStore,
  RedisRateLimitStore,
  getSharedRateLimitRedisClient,
  closeSharedRateLimitRedisClient,
  setRateLimitingEnabledInTest,
  isRateLimitingSkipped,
};

