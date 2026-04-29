import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to test both DEV and PROD modes.
// logger.ts reads import.meta.env.DEV at module level, so we use vi.hoisted + dynamic import.

describe('logger utility', () => {
  let consoleSpy: {
    debug: ReturnType<typeof vi.spyOn>;
    log: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    consoleSpy = {
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // In test environment (Vitest), import.meta.env.DEV is typically true.
  // We test the actual behavior accordingly.

  describe('createLogger', () => {
    it('returns an object with debug, info, warn, error methods', async () => {
      const { createLogger } = await import('./logger');
      const log = createLogger('Test');
      expect(typeof log.debug).toBe('function');
      expect(typeof log.info).toBe('function');
      expect(typeof log.warn).toBe('function');
      expect(typeof log.error).toBe('function');
    });

    it('prefixes all messages with context', async () => {
      const { createLogger } = await import('./logger');
      const log = createLogger('MyModule');
      log.warn('test message');
      expect(consoleSpy.warn).toHaveBeenCalledWith('[MyModule]', 'test message');
    });
  });

  describe('warn() — always logs', () => {
    it('calls console.warn with prefix', async () => {
      const { createLogger } = await import('./logger');
      const log = createLogger('WarnTest');
      log.warn('something happened', { detail: 1 });
      expect(consoleSpy.warn).toHaveBeenCalledWith('[WarnTest]', 'something happened', { detail: 1 });
    });
  });

  describe('error() — always logs', () => {
    it('calls console.error with prefix', async () => {
      const { createLogger } = await import('./logger');
      const log = createLogger('ErrTest');
      log.error('failure', new Error('boom'));
      expect(consoleSpy.error).toHaveBeenCalledWith('[ErrTest]', 'failure', expect.any(Error));
    });
  });

  describe('debug() — dev-only', () => {
    it('logs in dev mode (test env = dev)', async () => {
      const { createLogger } = await import('./logger');
      const log = createLogger('DbgTest');
      log.debug('debug msg');
      // In Vitest, DEV is true so debug should log
      expect(consoleSpy.debug).toHaveBeenCalledWith('[DbgTest]', 'debug msg');
    });
  });

  describe('info() — dev-only', () => {
    it('logs in dev mode (test env = dev)', async () => {
      const { createLogger } = await import('./logger');
      const log = createLogger('InfoTest');
      log.info('info msg', 42);
      // In Vitest, DEV is true so info should log via console.log
      expect(consoleSpy.log).toHaveBeenCalledWith('[InfoTest]', 'info msg', 42);
    });
  });

  describe('default logger export', () => {
    it('default export is a logger with App context', async () => {
      const loggerModule = await import('./logger');
      const defaultLogger = loggerModule.default;
      expect(typeof defaultLogger.debug).toBe('function');
      expect(typeof defaultLogger.info).toBe('function');
      expect(typeof defaultLogger.warn).toBe('function');
      expect(typeof defaultLogger.error).toBe('function');

      defaultLogger.warn('test');
      expect(consoleSpy.warn).toHaveBeenCalledWith('[App]', 'test');
    });
  });

  describe('multiple args', () => {
    it('passes all extra args through', async () => {
      const { createLogger } = await import('./logger');
      const log = createLogger('Multi');
      log.error('err', 1, 'two', { three: 3 });
      expect(consoleSpy.error).toHaveBeenCalledWith('[Multi]', 'err', 1, 'two', { three: 3 });
    });
  });
});
