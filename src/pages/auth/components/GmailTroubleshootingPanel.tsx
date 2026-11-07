import React, { memo } from 'react';

interface GmailTroubleshootingPanelProps {
  visible: boolean;
  isDev: boolean;
  loading: boolean;
  onContinueWithEmail: () => void;
  onFounderDevLogin: () => void;
}

export const GmailTroubleshootingPanel = memo(function GmailTroubleshootingPanel({
  visible,
  isDev,
  loading,
  onContinueWithEmail,
  onFounderDevLogin,
}: GmailTroubleshootingPanelProps) {
  if (visible) {
    return (
      <div className="gmail-troubleshooting-panel" role="alert">
        <p>Trouble signing in with Gmail?</p>
        <p>
          Your browser may be blocking popups. Try allowing popups, use email sign-in, or use quick
          founder sign-in.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={onContinueWithEmail}>
            Continue with Email
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: '#EF4444', borderColor: '#EF4444', color: '#FFFFFF' }}
            onClick={onFounderDevLogin}
          >
            Sign in as Arslan Malik (MD)
          </button>
        </div>
      </div>
    );
  }

  if (isDev) {
    return (
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button
          type="button"
          className="btn btn-outline"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '12.5px',
            border: '1px dashed #EF4444',
            color: '#EF4444',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.04)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
          onClick={onFounderDevLogin}
          disabled={loading}
          title="Direct local sign-in as Arslan Malik Bashir Ahmad"
        >
          ⚡ Quick Access: Sign in as Arslan Malik (Managing Director)
        </button>
      </div>
    );
  }

  return null;
});

export default GmailTroubleshootingPanel;
