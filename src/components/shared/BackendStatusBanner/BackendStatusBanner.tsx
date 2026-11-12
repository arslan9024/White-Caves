import React from 'react';
import type { BackendStatusBannerProps } from './BackendStatusBanner.config';
import { BANNER_MESSAGES } from './BackendStatusBanner.data';
import { useBackendStatusBanner } from './BackendStatusBanner.logic';
import {
  BannerMessage,
  BannerWrapper,
  DismissButton,
  StatusDot,
} from './BackendStatusBanner.styles';

export const BackendStatusBanner = ({ pollIntervalMs }: BackendStatusBannerProps) => {
  const { status, visible, dismiss } = useBackendStatusBanner(pollIntervalMs);
  if (!visible || status === 'online') return null;
  return (
    <BannerWrapper role="status" aria-live="polite" data-status={status}>
      <StatusDot aria-hidden="true" />
      <BannerMessage>{BANNER_MESSAGES[status]}</BannerMessage>
      <DismissButton type="button" aria-label="Dismiss server status banner" onClick={dismiss}>
        Dismiss
      </DismissButton>
    </BannerWrapper>
  );
};
