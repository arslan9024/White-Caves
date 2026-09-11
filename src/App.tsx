import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AppRouter } from './AppRouter';
import { CookieConsent } from './components/common/CookieConsent';
import { ToastNotificationSystem } from './components/common/ToastNotificationSystem/ToastNotificationSystem';

function App() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('wc_cookie_consent') === 'accepted') {
      setConsentGranted(true);
    }

    const handleConsent = () => setConsentGranted(true);
    window.addEventListener('consent_granted', handleConsent);
    return () => window.removeEventListener('consent_granted', handleConsent);
  }, []);

  return (
    <Provider store={store}>
      <HelmetProvider>
        <div className="app-root">
          <AppRouter />
        </div>
        {consentGranted && <SpeedInsights />}
        <CookieConsent />
        <ToastNotificationSystem />
      </HelmetProvider>
    </Provider>
  );
}

export default App;
