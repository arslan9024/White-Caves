import { useState, useCallback, useMemo } from 'react';
import {
  ACTIVE_LEASES,
  MAINTENANCE_REQUESTS,
  RENTAL_INQUIRIES,
  ActiveLease,
  MaintenanceRequest,
  PDCCheque,
  PDCStatus,
  LeaseStatus,
  MaintenanceStatus,
  LeasingStage,
  LEASING_STAGE_LABELS,
} from '../data/leasing';
import { PDC_CHEQUES, RENEWAL_RECORDS } from '../data/leasingExtended';
import { DAISY_LEASING_FEATURES } from '../data/features';

const MAX_LEASING_STAGE = 10;

export type { LeasingStage };
export { LEASING_STAGE_LABELS };

export const useLeasingData = () => {
  const [activeTab, setActiveTab] = useState<string>('leases');
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  // In production, these datasets intentionally start empty to avoid rendering mock fixtures
  // until dedicated Daisy API hydration is wired into this hook.
  const [leases, setLeases] = useState<ActiveLease[]>(import.meta.env.DEV ? ACTIVE_LEASES : []);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(
    import.meta.env.DEV ? MAINTENANCE_REQUESTS : []
  );
  const [pdcCheques, setPdcCheques] = useState<PDCCheque[]>(import.meta.env.DEV ? PDC_CHEQUES : []);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleSelectProperty = useCallback((propertyId: number) => {
    setSelectedProperty(propertyId);
  }, []);

  const getLeasesByStatus = useCallback((status: string) => {
    return leases.filter(lease => lease.status === status);
  }, [leases]);

  const getTotalAnnualRent = useCallback((): number => {
    return leases.reduce((sum, lease) => sum + (lease.rent * 12), 0);
  }, [leases]);

  const getOccupancyRate = useCallback((): string => {
    if (leases.length === 0) return '0.0';
    const occupied = leases.filter(l => l.status === 'active').length;
    return ((occupied / leases.length) * 100).toFixed(1);
  }, [leases]);

  const getActiveTenants = useCallback((): number => {
    return leases.filter(l => l.status === 'active').length;
  }, [leases]);

  const filteredLeases = useMemo(() => leases.filter(lease => {
    const matchesSearch =
      lease.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lease.tenant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lease.status === filterStatus;
    return matchesSearch && matchesStatus;
  }), [leases, searchQuery, filterStatus]);

  const updateLeaseStatus = useCallback((id: number, status: LeaseStatus) => {
    setLeases(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  }, []);

  const updateMaintenanceStatus = useCallback((id: number, status: MaintenanceStatus) => {
    setMaintenance(prev => prev.map(m =>
      m.id === id
        ? { ...m, status, completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : m.completedDate }
        : m
    ));
  }, []);

  const updatePDCStatus = useCallback((id: number, status: PDCStatus) => {
    setPdcCheques(prev => prev.map(c => {
      if (c.id !== id) return c;
      const today = new Date().toISOString().split('T')[0];
      return {
        ...c,
        status,
        presentedDate: status === 'presented' ? today : c.presentedDate,
        clearedDate: status === 'cleared' ? today : c.clearedDate,
      };
    }));
  }, []);

  const getPipelineStats = useCallback((): Record<number, number> => {
    const stats: Record<number, number> = {};
    for (let stage = 1; stage <= MAX_LEASING_STAGE; stage++) {
      stats[stage] = 0;
    }
    RENTAL_INQUIRIES.forEach(inq => {
      stats[inq.leasingStage] = (stats[inq.leasingStage] || 0) + 1;
    });
    return stats;
  }, []);

  const getPnLSummary = useCallback(() => {
    const activeLeases = leases.filter(l => l.status === 'active');
    const totalMRR = activeLeases.reduce((sum, l) => sum + l.rent, 0);
    const totalAnnualRent = activeLeases.reduce((sum, l) => sum + l.annualRent, 0);
    const totalCommission = activeLeases.reduce(
      (sum, l) => sum + (l.annualRent * l.agentCommissionPct) / 100,
      0
    );
    const totalMaintenanceCost = maintenance
      .filter(m => m.status === 'completed')
      .reduce((sum, m) => sum + (m.actualCost ?? 0), 0);
    const netIncome = totalAnnualRent - totalCommission - totalMaintenanceCost;
    return { totalMRR, totalAnnualRent, totalCommission, totalMaintenanceCost, netIncome };
  }, [leases, maintenance]);

  return {
    activeTab,
    setActiveTab,
    selectedProperty,
    handleSelectProperty,
    leases,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    getLeasesByStatus,
    getTotalAnnualRent,
    getOccupancyRate,
    getActiveTenants,
    filteredLeases,
    features: DAISY_LEASING_FEATURES,
    inquiries: RENTAL_INQUIRIES,
    maintenance,
    pdcCheques,
    renewals: RENEWAL_RECORDS,
    updateLeaseStatus,
    updateMaintenanceStatus,
    updatePDCStatus,
    getPipelineStats,
    getPnLSummary,
  };
};
