/**
 * Frontend Logger Utility — White Caves CRM
 * Filters logs by environment: only debug/info in dev, errors always.
 * Drop-in replacement for console.log across the frontend.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = import.meta.env.DEV;

function createLogger(context: string) {
  const prefix = `[${context}]`;

  return {
    debug(message: string, ...args: unknown[]) {
      if (isDev) console.debug(prefix, message, ...args);
    },
    info(message: string, ...args: unknown[]) {
      if (isDev) console.log(prefix, message, ...args);
    },
    warn(message: string, ...args: unknown[]) {
      console.warn(prefix, message, ...args);
    },
    error(message: string, ...args: unknown[]) {
      console.error(prefix, message, ...args);
    },
  };
}

/** Default app logger */
const logger = createLogger('App');

export { createLogger };
export default logger;
