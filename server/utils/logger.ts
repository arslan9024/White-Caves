/**
 * Structured Logger — White Caves CRM Server
 * Wraps console with structured output, log levels, and timestamps.
 * In production, this can be replaced with Winston/Pino without changing call sites.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const VALID_LOG_LEVELS = new Set<string>(['debug', 'info', 'warn', 'error']);

function resolveLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL;
  if (envLevel && VALID_LOG_LEVELS.has(envLevel)) {
    return envLevel as LogLevel;
  }
  if (envLevel) {
    // Warn about invalid LOG_LEVEL — falls back to default
    console.warn(`[Logger] Invalid LOG_LEVEL "${envLevel}". Valid values: debug, info, warn, error. Falling back to default.`);
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

const currentLevel: LogLevel = resolveLogLevel();

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, context: string, message: string, meta?: unknown): string {
  const base = `[${formatTimestamp()}] [${level.toUpperCase()}] [${context}] ${message}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
}

/**
 * Create a logger scoped to a module/context
 * @example
 * const log = createLogger('Auth');
 * log.info('User logged in', { userId: '123' });
 */
export function createLogger(context: string) {
  return {
    debug(message: string, meta?: unknown) {
      if (shouldLog('debug')) console.debug(formatMessage('debug', context, message, meta));
    },
    info(message: string, meta?: unknown) {
      if (shouldLog('info')) console.log(formatMessage('info', context, message, meta));
    },
    warn(message: string, meta?: unknown) {
      if (shouldLog('warn')) console.warn(formatMessage('warn', context, message, meta));
    },
    error(message: string, meta?: unknown) {
      if (shouldLog('error')) console.error(formatMessage('error', context, message, meta));
    },
  };
}

/** Default server logger */
const logger = createLogger('Server');

export { logger };

export default logger;
