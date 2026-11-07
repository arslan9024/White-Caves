// turingLogger.ts – structured JSON logger using pino
import pino from 'pino';
import { getCurrentRequestId } from './turingRequestContext';
import path from 'path';
import { format } from 'date-fns';

// Create a daily rotating log file name (e.g., turing-2026-11-07.log)
function getLogFilePath() {
  const date = format(new Date(), 'yyyy-MM-dd');
  return path.join(process.cwd(), `turing-${date}.log`);
}

const logger2 = pino({
  name: 'turingOrchestrator',
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {}, // privacy: omit pid, hostname
  serializers: {
    // Attach requestId if available
    requestId: () => getCurrentRequestId() || undefined,
  },
}, pino.destination({ dest: getLogFilePath(), sync: false }));

export { logger2 };


// Minimal pino configuration respecting AEGIS policies
const logger = pino({
  name: 'turingOrchestrator',
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {}, // no automatic pid, hostname fields (privacy)
});

export { logger };
