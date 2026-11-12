/**
 * BackendStatusBanner — Slim dismissible banner surfaced while the backend
 * is degraded (tunnel 502/503/504) or unreachable. Renders nothing when
 * online. NOT yet wired into App.tsx/layouts — integration is a later wave.
 */
import React, { useEffect, useState } from 'react';
import { useBackendStatus } from '../../../hooks/useBackendStatus';
import {
  BannerMessage,
  BannerWrapper,
  DismissButton,
  StatusDot,
} from './BackendStatusBanner.styles';

export interface BackendStatusBannerProps {
  /** Optional override of the health-poll cadence (ms). Default: 30 000. */
  pollIntervalMs?: number;
}

const BANNER_MESSAGES: Record<'degraded' | 'offline', string> = {
  degraded: 'Reconnecting to server…',
  offline: 'Server unreachable — some features are unavailable',
};

export const BackendStatusBanner: React.FC<BackendStatusBannerProps> = ({ pollIntervalMs }) => {
  const { status } = useBackendStatus(
    pollIntervalMs !== undefined ? { pollIntervalMs } : undefined
  );
  const [dismissed, setDismissed] = useState<boolean>(false);

  // A status change (e.g. degraded → offline) re-surfaces a dismissed banner.
  useEffect(() => {
    setDismissed(false);
  }, [status]);

  if (status === 'online' || dismissed) {
    return null;
  }

  return (
    <BannerWrapper role="status" aria-live="polite" data-status={status}>
      <StatusDot aria-hidden="true" />
      <BannerMessage>{BANNER_MESSAGES[status]}</BannerMessage>
      <DismissButton
        type="button"
        aria-label="Dismiss server status banner"
        onClick={() => setDismissed(true)}
      >
        ✕
      </DismissButton>
    </BannerWrapper>
  );
};
