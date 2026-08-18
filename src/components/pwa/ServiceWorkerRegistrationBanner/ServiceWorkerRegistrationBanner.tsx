/**
 * ServiceWorkerRegistrationBanner.tsx — View Layer (4-Way Component Architecture)
 * Displays PWA install prompt, online/offline status badge, and sync queue counters.
 */

import React, { FC } from 'react';
import { Wifi, WifiOff, RefreshCw, Trash2, CheckCircle } from 'lucide-react';
import { useServiceWorkerRegistrationBannerLogic } from './logic/ServiceWorkerRegistrationBanner.logic';
import {
  BannerWrapper,
  StatusDot,
  StatusText,
  BadgeRow,
  Badge,
  ActionButton,
} from './styles/ServiceWorkerRegistrationBanner.style';

export const ServiceWorkerRegistrationBanner: FC = () => {
  const { isOnline, stats, swRegistered, pendingCount, handleRetryFailed, handlePurgeCompleted } =
    useServiceWorkerRegistrationBannerLogic();

  return (
    <BannerWrapper $online={isOnline} data-testid="sw-registration-banner">
      <BadgeRow>
        <StatusDot $online={isOnline} />
        {isOnline ? <Wifi size={14} color="#22c55e" /> : <WifiOff size={14} color="#ef4444" />}
        <StatusText>
          {isOnline ? 'Online — White Caves CRM' : 'Offline Mode — Changes queued'}
        </StatusText>
        {swRegistered && (
          <Badge $variant="success">
            <CheckCircle size={10} style={{ display: 'inline', marginRight: 3 }} />
            PWA Active
          </Badge>
        )}
      </BadgeRow>

      <BadgeRow>
        {pendingCount > 0 && <Badge $variant="warning">{pendingCount} pending sync</Badge>}
        {stats.failedItems > 0 && (
          <>
            <Badge $variant="error">{stats.failedItems} failed</Badge>
            <ActionButton onClick={handleRetryFailed}>
              <RefreshCw size={11} style={{ display: 'inline', marginRight: 3 }} />
              Retry
            </ActionButton>
          </>
        )}
        {stats.totalItems > 0 && stats.failedItems === 0 && pendingCount === 0 && (
          <ActionButton onClick={handlePurgeCompleted}>
            <Trash2 size={11} style={{ display: 'inline', marginRight: 3 }} />
            Clear
          </ActionButton>
        )}
      </BadgeRow>
    </BannerWrapper>
  );
};

export default ServiceWorkerRegistrationBanner;
