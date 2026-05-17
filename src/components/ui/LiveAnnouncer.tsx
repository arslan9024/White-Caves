/**
 * LiveAnnouncer — Screen reader announcement component
 *
 * Renders an invisible aria-live region that screen readers
 * will announce when the message changes. Use for:
 * - Filter results: "3 properties found"
 * - Loading states: "Loading data..."
 * - Success/error: "Lead saved successfully"
 * - Pagination: "Page 2 of 5"
 *
 * Usage:
 *   <LiveAnnouncer message={`${count} results found`} />
 *   <LiveAnnouncer message="Error saving" politeness="assertive" />
 *
 * Hook usage:
 *   const announce = useAnnounce();
 *   announce('3 properties found');
 */

import React, { useState, useCallback, useEffect, createContext, useContext, useRef } from 'react';

// ─── Component ────────────────────────────────────────────────────────────

interface LiveAnnouncerProps {
  /** Message to announce (changes trigger new announcement) */
  message: string;
  /** How urgently to announce: 'polite' waits for idle, 'assertive' interrupts */
  politeness?: 'polite' | 'assertive';
  /** role for the live region — 'status', 'alert', or 'log' */
  role?: 'status' | 'alert' | 'log';
}

export const LiveAnnouncer: React.FC<LiveAnnouncerProps> = React.memo(function LiveAnnouncer({
  message,
  politeness = 'polite',
  role = 'status',
}) {
  return (
    <div
      role={role}
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
      data-testid="live-announcer"
    >
      {message}
    </div>
  );
});

// ─── Context + Hook ───────────────────────────────────────────────────────

interface AnnounceContextValue {
  announce: (message: string, politeness?: 'polite' | 'assertive') => void;
}

const AnnounceContext = createContext<AnnounceContextValue | null>(null);

/**
 * AnnounceProvider — Wraps app to provide useAnnounce() hook.
 * Renders a hidden live region; children call announce() imperatively.
 */
export const AnnounceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [politeMsg, setPoliteMsg] = useState('');
  const [assertiveMsg, setAssertiveMsg] = useState('');
  const clearTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    if (politeness === 'assertive') {
      setAssertiveMsg(message);
    } else {
      setPoliteMsg(message);
    }

    // Clear after 5s to allow re-announcement of same message
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => {
      setPoliteMsg('');
      setAssertiveMsg('');
    }, 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  return (
    <AnnounceContext.Provider value={{ announce }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
        data-testid="announce-polite"
      >
        {politeMsg}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
        data-testid="announce-assertive"
      >
        {assertiveMsg}
      </div>
    </AnnounceContext.Provider>
  );
};

/**
 * useAnnounce — Imperatively announce messages to screen readers.
 * Must be used within an AnnounceProvider.
 */
export function useAnnounce(): (message: string, politeness?: 'polite' | 'assertive') => void {
  const ctx = useContext(AnnounceContext);
  if (!ctx) {
    throw new Error('useAnnounce must be used within an AnnounceProvider');
  }
  return ctx.announce;
}

export default LiveAnnouncer;
