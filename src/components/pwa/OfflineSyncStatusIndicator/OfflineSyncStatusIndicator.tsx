/**
 * OfflineSyncStatusIndicator.tsx — View Layer (4-Way Component Architecture)
 * Compact pill showing online/offline/syncing/error state for mobile CRM toolbar.
 */

import React, { FC } from 'react';
import { CheckCircle, WifiOff, Loader, AlertCircle } from 'lucide-react';
import { useOfflineSyncStatusLogic, SyncPhase } from './logic/OfflineSyncStatusIndicator.logic';
import { Pill, SpinIcon } from './styles/OfflineSyncStatusIndicator.style';

const ICON: Record<SyncPhase, React.ReactNode> = {
  synced: <CheckCircle size={13} />,
  syncing: (
    <SpinIcon>
      <Loader size={13} />
    </SpinIcon>
  ),
  offline: <WifiOff size={13} />,
  error: <AlertCircle size={13} />,
};

export const OfflineSyncStatusIndicator: FC = () => {
  const { phase, label } = useOfflineSyncStatusLogic();

  return (
    <Pill $phase={phase} data-testid="offline-sync-indicator">
      {ICON[phase]}
      {label}
    </Pill>
  );
};

export default OfflineSyncStatusIndicator;
