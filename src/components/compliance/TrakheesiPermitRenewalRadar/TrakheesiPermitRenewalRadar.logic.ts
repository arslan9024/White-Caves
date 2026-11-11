import { useState, useMemo, useCallback } from 'react';
import { TrakheesiPermitRecord } from './TrakheesiPermitRenewalRadar.types';

export const DEFAULT_PERMITS: TrakheesiPermitRecord[] = [
  {
    id: 'tp-01',
    permitNumber: 'TRK-2026-781920',
    type: 'property_ad',
    holderName: 'Palm Jumeirah Signature Villa 8BR',
    referenceCode: 'PROP-PALM-04',
    issueDate: '2025-11-15',
    expiryDate: '2026-05-14',
    daysRemaining: 12,
    riskLevel: 'critical',
    portalSyncStatus: 'synced',
    autoRenewEnabled: true,
    statutoryFeeAED: 1020,
  },
  {
    id: 'tp-02',
    permitNumber: 'TRK-2026-102948',
    type: 'broker_card',
    holderName: 'Elena Rostova (Senior Director)',
    referenceCode: 'BRN-55291',
    issueDate: '2025-06-01',
    expiryDate: '2026-05-31',
    daysRemaining: 28,
    riskLevel: 'warning',
    portalSyncStatus: 'synced',
    autoRenewEnabled: true,
    statutoryFeeAED: 510,
  },
  {
    id: 'tp-03',
    permitNumber: 'TRK-2026-993821',
    type: 'property_ad',
    holderName: 'Downtown Burj Crown Penthouse',
    referenceCode: 'PROP-DWTN-12',
    issueDate: '2026-01-10',
    expiryDate: '2026-07-09',
    daysRemaining: 68,
    riskLevel: 'compliant',
    portalSyncStatus: 'synced',
    autoRenewEnabled: false,
    statutoryFeeAED: 1020,
  },
  {
    id: 'tp-04',
    permitNumber: 'TRK-2026-444830',
    type: 'company_orn',
    holderName: 'White Caves Real Estate LLC',
    referenceCode: 'RERA-ORN-44483',
    issueDate: '2025-08-01',
    expiryDate: '2026-07-31',
    daysRemaining: 90,
    riskLevel: 'compliant',
    portalSyncStatus: 'synced',
    autoRenewEnabled: true,
    statutoryFeeAED: 5020,
  },
  {
    id: 'tp-05',
    permitNumber: 'TRK-2026-302911',
    type: 'noc_permit',
    holderName: 'DAMAC Lagoons Title Transfer Mandate',
    referenceCode: 'NOC-2026-90',
    issueDate: '2026-04-10',
    expiryDate: '2026-05-10',
    daysRemaining: 7,
    riskLevel: 'critical',
    portalSyncStatus: 'pending_sync',
    autoRenewEnabled: false,
    statutoryFeeAED: 1550,
  },
];

export function useTrakheesiRadarLogic(
  initialPermits?: TrakheesiPermitRecord[],
  onTriggerRenewal?: (permitId: string, statutoryFeeAED: number) => void,
  onSyncDldPortal?: () => void
) {
  const [permits, setPermits] = useState<TrakheesiPermitRecord[]>(initialPermits || DEFAULT_PERMITS);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const filteredPermits = useMemo(() => {
    return permits.filter(p => {
      const matchType = filterType === 'all' || p.type === filterType;
      const matchQuery =
        p.permitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.holderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchQuery;
    });
  }, [permits, filterType, searchQuery]);

  const metrics = useMemo(() => {
    const criticalCount = permits.filter(p => p.riskLevel === 'critical').length;
    const warningCount = permits.filter(p => p.riskLevel === 'warning').length;
    const compliantCount = permits.filter(p => p.riskLevel === 'compliant').length;
    const totalRenewalsDueAED = permits
      .filter(p => p.riskLevel === 'critical' || p.riskLevel === 'warning')
      .reduce((acc, curr) => acc + curr.statutoryFeeAED, 0);

    return { criticalCount, warningCount, compliantCount, totalRenewalsDueAED };
  }, [permits]);

  const handleQueueRenewal = useCallback(
    (permitId: string) => {
      let renewedFee = 0;
      setPermits(prev =>
        prev.map(p => {
          if (p.id === permitId) {
            renewedFee = p.statutoryFeeAED;
            return {
              ...p,
              portalSyncStatus: 'renewal_queued',
              daysRemaining: p.daysRemaining + 180,
              riskLevel: 'compliant',
            };
          }
          return p;
        })
      );
      setNotification(`DLD Trakheesi renewal queued for ${permitId}. Statutory fee AED ${renewedFee.toLocaleString()} reserved.`);
      if (onTriggerRenewal) onTriggerRenewal(permitId, renewedFee);
    },
    [onTriggerRenewal]
  );

  const handleToggleAutoRenew = useCallback((permitId: string) => {
    setPermits(prev =>
      prev.map(p => (p.id === permitId ? { ...p, autoRenewEnabled: !p.autoRenewEnabled } : p))
    );
  }, []);

  const handlePortalSync = useCallback(() => {
    setPermits(prev =>
      prev.map(p => ({
        ...p,
        portalSyncStatus: 'synced',
      }))
    );
    setNotification('Successfully harmonized all permits with DLD Trakheesi Gateway API (Latency: 28ms).');
    if (onSyncDldPortal) onSyncDldPortal();
  }, [onSyncDldPortal]);

  return {
    permits,
    filteredPermits,
    metrics,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    notification,
    setNotification,
    handleQueueRenewal,
    handleToggleAutoRenew,
    handlePortalSync,
  };
}
