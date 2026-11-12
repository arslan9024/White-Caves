import { createServer } from 'http';
import logger from '../utils/logger.js';

export const PREFERRED_PORT =
  process.env.API_PORT ||
  (process.env.NODE_ENV === 'development' ? 5001 : process.env.PORT || 5001);

export const parsePort = (value: string | number): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    logger.error('Invalid API port configuration');
    throw new RangeError('API_PORT/PORT must be an integer between 1 and 65535');
  }
  return parsed;
};

export const listenWithPortFallback = async (
  server: ReturnType<typeof createServer>,
  preferredPort: number,
  options: { enableFallback: boolean; maxAttempts?: number }
): Promise<number> => {
  const maxAttempts = Math.max(1, options.maxAttempts ?? 12);
  let attempts = 0;
  let suppressedRetryLogs = 0;

  return new Promise<number>((resolve, reject) => {
    const tryListen = (port: number): void => {
      const onListening = (): void => {
        server.off('error', onError);
        server.off('listening', onListening);

        if (suppressedRetryLogs > 0) {
          logger.warn(
            `Suppressed ${suppressedRetryLogs} additional port retry log(s) during fallback before binding to ${port}`
          );
        }

        resolve(port);
      };

      const onError = (error: NodeJS.ErrnoException): void => {
        server.off('error', onError);
        server.off('listening', onListening);

        if (
          error.code === 'EADDRINUSE' &&
          options.enableFallback &&
          attempts < maxAttempts &&
          port < 65535
        ) {
          attempts += 1;
          const nextPort = port + 1;
          const shouldLogRetry = attempts <= 3 || attempts % 5 === 0 || attempts === maxAttempts;
          if (shouldLogRetry) {
            logger.warn(`Port ${port} is already in use — retrying on ${nextPort}`);
          } else {
            suppressedRetryLogs += 1;
          }
          tryListen(nextPort);
          return;
        }

        reject(error);
      };

      server.once('listening', onListening);
      server.once('error', onError);
      server.listen(port);
    };

    tryListen(preferredPort);
  });
};
