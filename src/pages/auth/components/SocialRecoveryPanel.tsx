import React, { memo } from 'react';
import type { SocialRecoveryState } from './authTypes';

interface SocialRecoveryPanelProps {
  socialRecovery: SocialRecoveryState;
  onRetry: () => void;
  onDismiss: () => void;
}

export const SocialRecoveryPanel = memo(function SocialRecoveryPanel({
  socialRecovery,
  onRetry,
  onDismiss,
}: SocialRecoveryPanelProps) {
  if (!socialRecovery.visible) return null;

  const retriesLeft = socialRecovery.retryCount;
  const providerLabel =
    socialRecovery.provider === 'google' ? 'Google' : socialRecovery.provider;

  return (
    <div className="social-recovery-panel" role="alert">
      <p>Your sign-in needs one more step</p>
      <p className="recovery-detail">
        backend session setup failed — Reason: {socialRecovery.reason}
      </p>
      <p>Retries remaining: {retriesLeft}</p>

      {retriesLeft <= 0 ? (
        <>
          <p>Too many retry attempts. Please try again later or use email sign-in.</p>
          <button
            type="button"
            className="btn btn-secondary"
            disabled
            aria-label="Retry limit reached"
          >
            Retry limit reached
          </button>
        </>
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onRetry}
          disabled={socialRecovery.isRetrying}
          aria-label={
            socialRecovery.isRetrying ? 'Retrying...' : `Retry ${providerLabel} sign-in`
          }
        >
          {socialRecovery.isRetrying ? 'Retrying...' : `Retry ${providerLabel} sign-in`}
        </button>
      )}

      <button
        type="button"
        className="btn btn-ghost"
        onClick={onDismiss}
        disabled={socialRecovery.isRetrying}
        aria-label="Dismiss recovery notice"
      >
        Dismiss
      </button>
    </div>
  );
});

export default SocialRecoveryPanel;
