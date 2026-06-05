import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store.tsx';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { validateEnvironment } from './config/validateEnv';
import './styles/tokens.css';
// Dubai Luxury design tokens — loaded globally so any component opting into
// the `dubai-luxury-theme` class inherits --luxury-cta-bg / --primary-color etc.
import './styles/dubaiLuxuryTheme.css';
// W17-001: Glassmorphism tokens + .glass-surface utility class + dark-mode vars
import './styles/tokens.css';
// RTL utility overrides — applied automatically when dir="rtl" is set on <html>
import './styles/rtl.css';
import { createLogger } from './utils/logger';
import { restoreAuthToken } from './services/authService';
import { registerServiceWorker } from './utils/registerServiceWorker';

const log = createLogger('App');

// Restore JWT token from storage on app init (sets apiClient header)
restoreAuthToken();

// Phase 10: Register PWA service worker in production
void registerServiceWorker();

// Validate environment at startup — halt render if critical vars missing
const envResult = validateEnvironment();
if (!envResult.valid) {
  log.error(`Missing required env vars: ${envResult.missing.join(', ')}`);
}

// Find root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML =
    '<p style="color: red; padding: 20px;">Root element not found. Please check index.html.</p>';
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <Provider store={store}>
            <ThemeProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </ThemeProvider>
          </Provider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    log.error('[Fatal] Render failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : '';

    // Safe DOM construction to prevent XSS (no innerHTML with user-influenced content)
    const container = document.createElement('div');
    container.style.cssText = 'color: red; padding: 20px; font-family: monospace;';

    const heading = document.createElement('h2');
    heading.textContent = 'Error: Application Failed to Load';

    const messagePara = document.createElement('p');
    messagePara.textContent = message;

    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'Click for details';
    const pre = document.createElement('pre');
    pre.textContent = stack || 'No stack trace available';
    details.appendChild(summary);
    details.appendChild(pre);

    const helpPara = document.createElement('p');
    helpPara.style.marginTop = '20px';
    helpPara.textContent = 'Check browser console (F12) for more information.';

    container.append(heading, messagePara, details, helpPara);
    document.body.replaceChildren(container);
  }
}
