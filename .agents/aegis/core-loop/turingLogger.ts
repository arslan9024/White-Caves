/**
 * turingLogger.ts — Structured JSON logger for the AEGIS Turing Orchestrator.
 * Zero external runtime dependencies so it works seamlessly in Node, Vitest, and CLI environments.
 * @see AEG-040
 */

import { getCurrentRequestId } from './turingRequestContext';

export interface StructuredLogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  name: string;
  timestamp: string;
  requestId?: string;
  msg: string;
  meta?: unknown;
}

function emitLog(level: StructuredLogEntry['level'], msg: string, meta?: unknown): void {
  if (process.env.NODE_ENV === 'test' && level !== 'error') {
    return;
  }
  const entry: StructuredLogEntry = {
    level,
    name: 'turingOrchestrator',
    timestamp: new Date().toISOString(),
    ...(getCurrentRequestId() ? { requestId: getCurrentRequestId() } : {}),
    msg,
    ...(meta !== undefined ? { meta } : {}),
  };
  if (level === 'error') {
    console.error(JSON.stringify(entry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

/**
 * Primary structured logger for the Turing Orchestrator.
 * @see AEG-040
 */
export const logger = {
  debug: (msg: string, meta?: unknown) => emitLog('debug', msg, meta),
  info: (msg: string, meta?: unknown) => emitLog('info', msg, meta),
  warn: (msg: string, meta?: unknown) => emitLog('warn', msg, meta),
  error: (msg: string, meta?: unknown) => emitLog('error', msg, meta),
};

export const logger2 = logger;
export default logger;
