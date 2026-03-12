import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';

// Debug: Log initialization
console.log('🚀 White Caves App Initializing...');
console.log('Store:', store);

// Find root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ CRITICAL: Root element not found!');
  document.body.innerHTML = '<p style="color: red; padding: 20px;">Root element not found. Please check index.html.</p>';
} else {
  console.log('✅ Root element found');

  try {
    const root = ReactDOM.createRoot(rootElement);
    console.log('✅ React root created');

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
    console.log('✅ App rendered successfully');
  } catch (error) {
    console.error('❌ CRITICAL ERROR during render:', error);
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : '';
    document.body.innerHTML = `
      <div style="color: red; padding: 20px; font-family: monospace;">
        <h2>Error: Application Failed to Load</h2>
        <p>${message}</p>
        <details>
          <summary>Click for details</summary>
          <pre>${stack}</pre>
        </details>
        <p style="margin-top: 20px;">Check browser console (F12) for more information.</p>
      </div>
    `;
  }
}
