import { createLogger } from './logger';

const log = createLogger('PWA');

async function clearServiceWorkerArtifacts(): Promise<void> {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map(registration => registration.unregister()));

  if ('caches' in window) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map(key => caches.delete(key)));
  }
}

/**
 * Phase 10 PWA bootstrap.
 * Registers `/sw.js` in production builds.
 */
export const registerServiceWorker = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  if (import.meta.env.DEV) {
    try {
      await clearServiceWorkerArtifacts();
      log.info('Cleared service worker registrations and caches in development');
    } catch (error) {
      log.warn(
        'Failed to clear service worker artifacts in development:',
        error instanceof Error ? error.message : String(error)
      );
    }
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
