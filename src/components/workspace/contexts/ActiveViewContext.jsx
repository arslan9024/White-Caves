import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ─── View Registry ──────────────────────────────────────────────────────────
// All valid view keys in the workspace. Adding a new view is as simple as
// adding a string here and a corresponding render branch in MainLayout.
export const VIEW_KEYS = {
  DASHBOARD:   'dashboard',
  LEADS:       'leads',
  DEALS:       'deals',
  LEADERBOARD: 'leaderboard',
  COMPLIANCE:  'compliance',
  LEDGERS:     'ledgers',
  AI_COMMAND:  'ai-command',
};

// ─── Context ────────────────────────────────────────────────────────────────
const ActiveViewContext = createContext(null);

export function ActiveViewProvider({ children }) {
  const [activeView, setActiveViewState] = useState(VIEW_KEYS.DASHBOARD);
  const [viewHistory, setViewHistory] = useState([VIEW_KEYS.DASHBOARD]);

  const setActiveView = useCallback((viewKey) => {
    setActiveViewState((prev) => {
      if (prev !== viewKey) {
        setViewHistory((h) => [...h.slice(-19), viewKey]); // keep last 20
      }
      return viewKey;
    });
  }, []);

  const goBack = useCallback(() => {
    setViewHistory((h) => {
      if (h.length <= 1) return h;
      const newHistory = h.slice(0, -1);
      setActiveViewState(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  }, []);

  const value = useMemo(() => ({
    activeView,
    setActiveView,
    goBack,
    viewHistory,
  }), [activeView, setActiveView, goBack, viewHistory]);

  return (
    <ActiveViewContext.Provider value={value}>
      {children}
    </ActiveViewContext.Provider>
  );
}

export function useActiveView() {
  const ctx = useContext(ActiveViewContext);
  if (!ctx) {
    throw new Error('useActiveView must be used within an <ActiveViewProvider>');
  }
  return ctx;
}

export default ActiveViewContext;
