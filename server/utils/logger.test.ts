/**
 * Structured Logger — Tests
 * Tests createLogger, log level filtering, output format, and metadata serialization.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Helpers ────────────────────────────────────────────────────────────
function importLoggerFresh() {
  vi.resetModules();
  return import('./logger');
}

describe('server/utils/logger', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    delete process.env.LOG_LEVEL;
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  // ─── createLogger returns scoped logger ───────────────────────────
  describe('createLogger', () => {
    it('returns an object with debug, info, warn, error methods', async () => {
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      expect(typeof log.debug).toBe('function');
      expect(typeof log.info).toBe('function');
      expect(typeof log.warn).toBe('function');
      expect(typeof log.error).toBe('function');
    });

    it('includes context name in output', async () => {
      process.env.LOG_LEVEL = 'debug';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('AuthModule');

      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      log.info('User logged in');

      expect(spy).toHaveBeenCalledTimes(1);
      const output = spy.mock.calls[0][0] as string;
      expect(output).toContain('[AuthModule]');
      expect(output).toContain('User logged in');
    });

    it('includes timestamp in ISO format', async () => {
      process.env.LOG_LEVEL = 'debug';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      log.info('test message');

      const output = spy.mock.calls[0][0] as string;
      // ISO timestamp pattern: 2026-03-26T12:00:00.000Z
      expect(output).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('includes log level in uppercase', async () => {
      process.env.LOG_LEVEL = 'debug';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      log.warn('something happened');

      const output = warnSpy.mock.calls[0][0] as string;
      expect(output).toContain('[WARN]');
    });

    it('includes serialized metadata when provided', async () => {
      process.env.LOG_LEVEL = 'debug';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      log.info('User action', { userId: '123', action: 'login' });

      const output = spy.mock.calls[0][0] as string;
      expect(output).toContain('"userId":"123"');
      expect(output).toContain('"action":"login"');
    });

    it('works without metadata', async () => {
      process.env.LOG_LEVEL = 'debug';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      log.info('simple message');

      const output = spy.mock.calls[0][0] as string;
      expect(output).toContain('simple message');
      // Should not contain stray "undefined" or "null"
      expect(output).not.toContain('undefined');
    });
  });

  // ─── Log methods use correct console methods ──────────────────────
  describe('console method routing', () => {
    it('debug uses console.debug', async () => {
      process.env.LOG_LEVEL = 'debug';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      log.debug('debug msg');

      expect(spy).toHaveBeenCalledTimes(1);
      expect((spy.mock.calls[0][0] as string)).toContain('[DEBUG]');
    });

    it('info uses console.log', async () => {
      process.env.LOG_LEVEL = 'debug';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      log.info('info msg');

      expect(spy).toHaveBeenCalledTimes(1);
      expect((spy.mock.calls[0][0] as string)).toContain('[INFO]');
    });

    it('warn uses console.warn', async () => {
      process.env.LOG_LEVEL = 'debug';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      log.warn('warn msg');

      expect(spy).toHaveBeenCalledTimes(1);
      expect((spy.mock.calls[0][0] as string)).toContain('[WARN]');
    });

    it('error uses console.error', async () => {
      process.env.LOG_LEVEL = 'debug';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      log.error('error msg');

      expect(spy).toHaveBeenCalledTimes(1);
      expect((spy.mock.calls[0][0] as string)).toContain('[ERROR]');
    });
  });

  // ─── Log level filtering ─────────────────────────────────────────
  describe('log level filtering', () => {
    it('debug level logs everything', async () => {
      process.env.LOG_LEVEL = 'debug';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      log.debug('d');
      log.info('i');
      log.warn('w');
      log.error('e');

      expect(debugSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    it('info level suppresses debug', async () => {
      process.env.LOG_LEVEL = 'info';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      log.debug('should not appear');
      log.info('should appear');

      expect(debugSpy).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledTimes(1);
    });

    it('warn level suppresses debug and info', async () => {
      process.env.LOG_LEVEL = 'warn';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      log.debug('no');
      log.info('no');
      log.warn('yes');
      log.error('yes');

      expect(debugSpy).not.toHaveBeenCalled();
      expect(logSpy).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    it('error level only logs error', async () => {
      process.env.LOG_LEVEL = 'error';
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      log.debug('no');
      log.info('no');
      log.warn('no');
      log.error('yes');

      expect(debugSpy).not.toHaveBeenCalled();
      expect(logSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Default log level resolution ────────────────────────────────
  describe('default log level', () => {
    it('defaults to debug in development', async () => {
      process.env.NODE_ENV = 'development';
      // No LOG_LEVEL set
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      log.debug('dev debug');

      expect(debugSpy).toHaveBeenCalledTimes(1);
    });

    it('defaults to info in production', async () => {
      process.env.NODE_ENV = 'production';
      // No LOG_LEVEL set
      const { createLogger } = await importLoggerFresh();
      const log = createLogger('Test');

      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      log.debug('should not appear');
      log.info('should appear');

      expect(debugSpy).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledTimes(1);
    });

    it('warns on invalid LOG_LEVEL and falls back', async () => {
      process.env.LOG_LEVEL = 'VERBOSE';
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      await importLoggerFresh();

      // Should have printed a warning about invalid LOG_LEVEL
      expect(warnSpy).toHaveBeenCalled();
      const warnOutput = warnSpy.mock.calls.find(
        (c) => typeof c[0] === 'string' && c[0].includes('Invalid LOG_LEVEL')
      );
      expect(warnOutput).toBeDefined();
    });
  });

  // ─── Default logger export ───────────────────────────────────────
  describe('default export', () => {
    it('exports a default logger with Server context', async () => {
      process.env.LOG_LEVEL = 'debug';
      const mod = await importLoggerFresh();
      const logger = mod.default;

      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');

      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logger.info('hello');
      const output = spy.mock.calls[0][0] as string;
      expect(output).toContain('[Server]');
    });
  });
});
