/**
 * Authentication Middleware — Tests
 * Tests JWT validation, token extraction, error handling for expired/invalid tokens.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';

// Mock logger (used by errorHandler which is imported by auth)
vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock env to provide a known JWT_SECRET
vi.mock('../config/env', () => ({
  JWT_SECRET: 'test-secret-key-for-auth-tests',
  JWT_EXPIRES_SECONDS: 3600,
  IS_PRODUCTION: false,
  NODE_ENV: 'test',
  PORT: 3001,
}));

import authMiddleware from './auth.js';
import type { AuthRequest } from './auth.js';
import type { Response, NextFunction } from 'express';

// ─── Helpers ────────────────────────────────────────────────────────────
const TEST_SECRET = 'test-secret-key-for-auth-tests';

function createToken(payload: Record<string, unknown>, secret = TEST_SECRET, expiresIn = '1h'): string {
  return jwt.sign(payload, secret, { expiresIn });
}

function mockReq(token?: string): AuthRequest {
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
  } as unknown as AuthRequest;
}

function mockRes(): Response {
  return {} as unknown as Response;
}

// ─── Tests ──────────────────────────────────────────────────────────────
describe('authMiddleware', () => {
  let next: NextFunction & ReturnType<typeof vi.fn>;

  beforeEach(() => {
    next = vi.fn();
  });

  describe('valid tokens', () => {
    it('attaches decoded user to req.user and calls next()', () => {
      const payload = { id: 'user123', email: 'test@whitecaves.ae', role: 'admin' };
      const token = createToken(payload);
      const req = mockReq(token);

      authMiddleware(req, mockRes(), next);

      expect(req.user).toBeDefined();
      expect(req.user!.id).toBe('user123');
      expect(req.user!.email).toBe('test@whitecaves.ae');
      expect(req.user!.role).toBe('admin');
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(); // no error
    });

    it('works with different roles', () => {
      const roles = ['owner', 'manager', 'agent', 'viewer'];
      for (const role of roles) {
        const token = createToken({ id: 'u1', email: 'u@test.com', role });
        const req = mockReq(token);
        const n = vi.fn();
        authMiddleware(req, mockRes(), n);
        expect(req.user!.role).toBe(role);
        expect(n).toHaveBeenCalledWith();
      }
    });

    it('strips "Bearer " prefix correctly', () => {
      const token = createToken({ id: 'u1', email: 'e@t.com', role: 'admin' });
      const req = mockReq(token);
      authMiddleware(req, mockRes(), next);
      expect(req.user).toBeDefined();
    });
  });

  describe('missing token', () => {
    it('calls next with 401 AppError when no authorization header', () => {
      const req = { headers: {} } as unknown as AuthRequest;
      authMiddleware(req, mockRes(), next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error).toBeDefined();
      expect(error.message).toBe('No token provided');
      expect(error.statusCode).toBe(401);
    });

    it('calls next with 401 when authorization header is empty', () => {
      const req = { headers: { authorization: '' } } as unknown as AuthRequest;
      authMiddleware(req, mockRes(), next);

      // Empty string after stripping "Bearer " is still empty → jwt.verify will throw
      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error).toBeDefined();
      expect(error.statusCode).toBe(401);
    });
  });

  describe('expired token', () => {
    it('calls next with 401 "Token expired" error', () => {
      // Create a token that expired 1 hour ago
      const token = jwt.sign(
        { id: 'u1', email: 'e@t.com', role: 'admin' },
        TEST_SECRET,
        { expiresIn: -10 } // already expired
      );
      const req = mockReq(token);
      authMiddleware(req, mockRes(), next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Token expired');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('invalid token', () => {
    it('calls next with 401 for malformed token', () => {
      const req = mockReq('not-a-valid-jwt');
      authMiddleware(req, mockRes(), next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Invalid token');
      expect(error.statusCode).toBe(401);
    });

    it('calls next with 401 for token signed with wrong secret', () => {
      const token = jwt.sign(
        { id: 'u1', email: 'e@t.com', role: 'admin' },
        'wrong-secret-key',
        { expiresIn: '1h' }
      );
      const req = mockReq(token);
      authMiddleware(req, mockRes(), next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Invalid token');
      expect(error.statusCode).toBe(401);
    });

    it('calls next with 401 for tampered token', () => {
      const validToken = createToken({ id: 'u1', email: 'e@t.com', role: 'admin' });
      // Tamper with the payload section
      const parts = validToken.split('.');
      parts[1] = Buffer.from(JSON.stringify({ id: 'HACKED', email: 'hacker@evil.com', role: 'owner' })).toString('base64url');
      const tamperedToken = parts.join('.');

      const req = mockReq(tamperedToken);
      authMiddleware(req, mockRes(), next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });
  });

  describe('edge cases', () => {
    it('does not set req.user on authentication failure', () => {
      const req = mockReq('invalid-token');
      authMiddleware(req, mockRes(), next);
      expect(req.user).toBeUndefined();
    });

    it('handles token with extra payload fields gracefully', () => {
      const token = createToken({
        id: 'u1',
        email: 'e@t.com',
        role: 'admin',
        extraField: 'should be ignored',
      });
      const req = mockReq(token);
      authMiddleware(req, mockRes(), next);
      expect(req.user).toBeDefined();
      expect(req.user!.id).toBe('u1');
    });
  });
});
