import { useState, useEffect, useCallback } from 'react';

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (import.meta?.env?.DEV) {
        clearServiceWorkerArtifacts().catch(() => {
          // Ignore cleanup errors in dev; app should continue rendering.
        });
      } else {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Ignore registration errors; PWA is optional.
        });
      }
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
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
    };
  }, []);

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
    installApp
  };
}

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
          <h3>Install White Caves</h3>
          <p>Add to your home screen for quick access</p>
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
