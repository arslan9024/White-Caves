import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AppRouter } from './AppRouter';

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <div className="app-root">
          <AppRouter />
        </div>
        <SpeedInsights />
      </HelmetProvider>
    </Provider>
  );
}

export default App;
