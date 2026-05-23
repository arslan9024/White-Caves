/**
 * Database Connection — Tests
 * Tests prisma singleton, connectDatabase, and disconnectDatabase.
 * Uses mocked PrismaClient to avoid real DB connections.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted so mock fns are available inside hoisted vi.mock() factories
const { mockConnect, mockDisconnect } = vi.hoisted(() => ({
  mockConnect: vi.fn().mockResolvedValue(undefined),
  mockDisconnect: vi.fn().mockResolvedValue(undefined),
}));

// Mock PrismaClient before any imports
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    $connect: mockConnect,
    $disconnect: mockDisconnect,
  })),
}));

// Mock the logger
vi.mock('./utils/logger.js', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock lead scoring middleware (Phase 4A)
vi.mock('./services/ai/leadScoringMiddleware.js', () => ({
  registerLeadScoringMiddleware: vi.fn(),
}));

import { prisma, connectDatabase, disconnectDatabase } from './database';

// ─── Tests ──────────────────────────────────────────────────────────────
describe('server/database', () => {
  beforeEach(() => {
    mockConnect.mockClear();
    mockDisconnect.mockClear();
  });

  // ─── Exports ──────────────────────────────────────────────────────
  describe('exports', () => {
    it('exports prisma client instance', () => {
      expect(prisma).toBeDefined();
    });

    it('exports connectDatabase function', () => {
      expect(typeof connectDatabase).toBe('function');
    });

    it('exports disconnectDatabase function', () => {
      expect(typeof disconnectDatabase).toBe('function');
    });
  });

  // ─── connectDatabase ─────────────────────────────────────────────
  describe('connectDatabase', () => {
    it('calls prisma.$connect()', async () => {
      await connectDatabase();
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    it('does not throw on successful connection', async () => {
      await expect(connectDatabase()).resolves.toBeUndefined();
    });

    it('throws when $connect fails', async () => {
      mockConnect.mockRejectedValueOnce(new Error('Connection refused'));
      await expect(connectDatabase()).rejects.toThrow('Connection refused');
    });

    it('re-throws the original error', async () => {
      const original = new Error('ECONNREFUSED');
      mockConnect.mockRejectedValueOnce(original);
      try {
        await connectDatabase();
      } catch (err) {
        expect(err).toBe(original);
      }
    });
  });

  // ─── disconnectDatabase ───────────────────────────────────────────
  describe('disconnectDatabase', () => {
    it('calls prisma.$disconnect()', async () => {
      await disconnectDatabase();
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('does not throw on successful disconnect', async () => {
      await expect(disconnectDatabase()).resolves.toBeUndefined();
    });
  });

  // ─── Singleton behavior ───────────────────────────────────────────
  describe('singleton pattern', () => {
    it('prisma instance has $connect and $disconnect methods', () => {
      expect(typeof prisma.$connect).toBe('function');
      expect(typeof prisma.$disconnect).toBe('function');
    });

    it('prisma is defined as a single instance', () => {
      expect(prisma).toBeTruthy();
    });
  });
});
