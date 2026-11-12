import { useEffect, useState } from 'react';
import { useBackendStatus, type BackendHealthStatus } from '../../../hooks/useBackendStatus';

export function useBackendStatusBanner(pollIntervalMs?: number) {
  const { status } = useBackendStatus({ pollIntervalMs });
  const [dismissedStatus, setDismissedStatus] = useState<BackendHealthStatus | null>(null);
  useEffect(() => {
    if (status === 'online') setDismissedStatus(null);
  }, [status]);
  return {
    status,
    visible: status !== 'online' && status !== dismissedStatus,
    dismiss: () => setDismissedStatus(status),
  };
}
