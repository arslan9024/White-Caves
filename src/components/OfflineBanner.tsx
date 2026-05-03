/**
 * OfflineBanner — Phase 25 Error UX
 * @agent @Una (Luxury UI/UX Specialist)
 *
 * Shows a sticky top banner when the user loses internet connectivity.
 * Automatically disappears when connection is restored.
 * Fully accessible: role="alert", aria-live="assertive", keyboard-dismissible.
 */

import React, { useEffect, useReducer } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

// ─── Reducer (avoids setState-in-effect lint rule) ────────────────────────────

type BannerAction =
  | { type: 'WENT_OFFLINE' }
  | { type: 'WENT_ONLINE' }
  | { type: 'RECOVERY_COMPLETE' }
  | { type: 'DISMISS' };

type BannerState = {
  visible: boolean;
  justRecovered: boolean;
  dismissed: boolean;
};

const initialBannerState: BannerState = {
  visible: false,
  justRecovered: false,
  dismissed: false,
};

function bannerReducer(state: BannerState, action: BannerAction): BannerState {
  switch (action.type) {
    case 'WENT_OFFLINE':
      return { visible: true, justRecovered: false, dismissed: false };
    case 'WENT_ONLINE':
      if (!state.visible) return state;
      return { ...state, justRecovered: true };
    case 'RECOVERY_COMPLETE':
      return { visible: false, justRecovered: false, dismissed: false };
    case 'DISMISS':
      return { ...state, dismissed: true };
    default:
      return state;
  }
}

const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [state, dispatch] = useReducer(bannerReducer, initialBannerState);
  const { visible, justRecovered, dismissed } = state;

  // Respond to online/offline transitions — dispatch keeps setState out of effect body
  useEffect(() => {
    if (!isOnline) {
      dispatch({ type: 'WENT_OFFLINE' });
    } else {
      dispatch({ type: 'WENT_ONLINE' });
      const timer = setTimeout(() => dispatch({ type: 'RECOVERY_COMPLETE' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!visible || dismissed) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        backgroundColor: justRecovered ? '#065f46' : '#7f1d1d',
        color: '#fff',
        fontSize: '0.9rem',
        fontWeight: 500,
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        transition: 'background-color 0.4s ease',
      }}
    >
      {justRecovered ? (
        <Wifi size={18} aria-hidden="true" />
      ) : (
        <WifiOff size={18} aria-hidden="true" />
      )}
      <span>
        {justRecovered
          ? 'Connection restored — you are back online.'
          : 'You are offline. Some features may not be available.'}
      </span>
      {!justRecovered && (
        <button
          onClick={() => dispatch({ type: 'DISMISS' })}
          aria-label="Dismiss offline notification"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            marginLeft: '0.5rem',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 4,
            opacity: 0.8,
          }}
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default OfflineBanner;
