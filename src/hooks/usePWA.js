/**
 * usePWA — Wave 23 Enhanced PWA Install Hook
 *
 * Deferred install prompt: only surfaces after 2nd visit AND 60-second engagement.
 * Tracks visit count + engagement time in localStorage.
 *
 * Features:
 *  - beforeinstallprompt captured + deferred
 *  - Custom install banner surfaces only when criteria met
 *  - Online/offline state tracking
 *  - Standalone display mode detection
 *
 * @agent @Cyra + @Una
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY_VISITS = 'wc-pwa-visit-count';
const STORAGE_KEY_ENGAGEMENT = 'wc-pwa-engagement-start';
const ENGAGEMENT_THRESHOLD_MS = 60_000; // 60 seconds
const VISIT_THRESHOLD = 2;

function getVisitCount() {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY_VISITS) || '0', 10);
  } catch {
    return 0;
  }
}

function incrementVisitCount() {
  try {
    const count = getVisitCount() + 1;
    localStorage.setItem(STORAGE_KEY_VISITS, String(count));
    return count;
  } catch {
    return 1;
  }
}

function getEngagementStart() {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY_ENGAGEMENT) || '0', 10);
  } catch {
    return 0;
  }
}

function setEngagementStart(ts) {
  try {
    localStorage.setItem(STORAGE_KEY_ENGAGEMENT, String(ts));
  } catch {
    // Ignore localStorage errors
  }
}

async function clearServiceWorkerArtifacts() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map(registration => registration.unregister()));

  if ('caches' in window) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map(key => caches.delete(key)));
  }
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [meetsEngagementCriteria, setMeetsEngagementCriteria] = useState(false);
  const engagementTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Service worker registration
    if ('serviceWorker' in navigator) {
      if (import.meta?.env?.DEV) {
        clearServiceWorkerArtifacts().catch(() => {});
      } else {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      }
    }

    // Track visit count
    const visits = incrementVisitCount();

    // Track engagement start time
    const existingStart = getEngagementStart();
    if (!existingStart) {
      setEngagementStart(Date.now());
    }

    // Check if engagement criteria are met (2nd visit + 60s)
    const checkEngagement = () => {
      const start = getEngagementStart();
      const engagedLongEnough = start > 0 && (Date.now() - start) >= ENGAGEMENT_THRESHOLD_MS;
      const enoughVisits = visits >= VISIT_THRESHOLD;

      if (engagedLongEnough && enoughVisits) {
        setMeetsEngagementCriteria(true);
        if (engagementTimerRef.current) {
          clearInterval(engagementTimerRef.current);
        }
      }
    };

    // Check every 10 seconds
    checkEngagement();
    engagementTimerRef.current = setInterval(checkEngagement, 10_000);

    // Install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show installable if engagement criteria are met
      const start = getEngagementStart();
      const engagedLongEnough = start > 0 && (Date.now() - start) >= ENGAGEMENT_THRESHOLD_MS;
      if (visits >= VISIT_THRESHOLD && engagedLongEnough) {
        setIsInstallable(true);
        setMeetsEngagementCriteria(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (engagementTimerRef.current) {
        clearInterval(engagementTimerRef.current);
      }
    };
  }, []);

  // Update installable state when engagement criteria change
  useEffect(() => {
    if (meetsEngagementCriteria && deferredPrompt && !isInstalled) {
      setIsInstallable(true);
    }
  }, [meetsEngagementCriteria, deferredPrompt, isInstalled]);

  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setIsInstallable(false);

    return outcome === 'accepted';
  }, [deferredPrompt]);

  return {
    isInstallable,
    isInstalled,
    isOnline,
    meetsEngagementCriteria,
    installApp,
  };
}

/**
 * PWA Install Prompt — Premium branded banner
 */
export function InstallPrompt({ onClose }) {
  const { isInstallable, installApp } = usePWA();

  if (!isInstallable) return null;

  const handleInstall = async () => {
    await installApp();
    onClose?.();
  };

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-icon">
          <img src="/favicon.svg" alt="White Caves" width="48" height="48" />
        </div>
        <div className="install-text">
          <h3>Install White Caves CRM</h3>
          <p>Get quick access to leads, viewings, and properties from your home screen</p>
        </div>
        <div className="install-actions">
          <button className="install-btn" onClick={handleInstall}>
            Install
          </button>
          <button className="dismiss-btn" onClick={onClose}>
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
