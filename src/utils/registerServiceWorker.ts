import { createLogger } from './logger';

const log = createLogger('PWA');

/**
 * Phase 10 PWA bootstrap.
 * Registers `/sw.js` in production builds.
 */
export const registerServiceWorker = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  if (import.meta.env.DEV) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    log.info(`Service worker registered: ${registration.scope}`);
  } catch (error) {
    log.warn(
      'Service worker registration failed:',
      error instanceof Error ? error.message : String(error)
    );
  }
};
