import { useState, useCallback, useMemo, useEffect } from 'react';
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
import { RENEWAL_RECORDS } from '../data/leasingExtended';
import { DAISY_LEASING_FEATURES } from '../data/features';
import { authFetch } from '../../../../utils/authFetch';

export type { LeasingStage };
export { LEASING_STAGE_LABELS };

// ─── API response shapes ───────────────────────────────────────────────────

interface LeaseApiItem {
  id: string;
  monthlyRent?: number | null;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  ejariNumber?: string | null;
  ejariStatus?: string | null;
  keyHandoverDate?: string | null;
  tenant?: { name?: string | null; phone?: string | null; email?: string | null } | null;
  property?: { title?: string | null; location?: string | null } | null;
}

interface MaintenanceApiItem {
  id: string;
  title?: string | null;
  category?: string | null;
  priority?: string | null;
  status?: string | null;
  createdAt?: string | null;
  scheduledDate?: string | null;
  completedAt?: string | null;
  cost?: number | null;
  notes?: string | null;
  property?: { title?: string | null; location?: string | null } | null;
  requester?: { name?: string | null } | null;
}

// Map API lease status → ActiveLease status
function mapLeaseStatus(s: string | null | undefined): LeaseStatus {
  switch (s) {
    case 'active':
      return 'active';
    case 'expiring':
      return 'expiring_soon';
    case 'renewed':
      return 'renewal_pending';
    case 'expired':
      return 'expired';
    case 'terminated':
      return 'terminated';
    default:
      return 'active';
  }
}

// Map API ejariStatus → ActiveLease ejariStatus
function mapEjariStatus(s: string | null | undefined): 'registered' | 'pending' | 'expired' | null {
  switch (s) {
    case 'registered':
      return 'registered';
    case 'pending':
      return 'pending';
    case 'expired':
      return 'expired';
    default:
      return null;
  }
}

// Map API maintenance priority → MaintenancePriority
function mapPriority(p: string | null | undefined): 'critical' | 'high' | 'medium' | 'low' {
  switch (p) {
    case 'emergency':
      return 'critical';
    case 'high':
      return 'high';
    case 'low':
      return 'low';
    default:
      return 'medium';
  }
}

// Map API maintenance status → MaintenanceStatus
function mapMaintStatus(s: string | null | undefined): MaintenanceStatus {
  switch (s) {
    case 'in_progress':
      return 'in_progress';
    case 'scheduled':
      return 'scheduled';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
}

function mapLeaseToActive(lease: LeaseApiItem, index: number): ActiveLease {
  const rent = Number(lease.monthlyRent ?? 0);
  const endDate = lease.endDate ? new Date(lease.endDate) : new Date();
  const daysRemaining = Math.max(0, Math.floor((endDate.getTime() - Date.now()) / 86_400_000));
  const propertyTitle = String(lease.property?.title ?? 'Unknown Property');
  // Split title into unit / building heuristically (first word = unit, rest = building)
  const titleParts = propertyTitle.split(' - ');
  const unit = titleParts[0] ?? propertyTitle;
  const building = titleParts[1] ?? '';

  return {
    id: index + 1,
    unit,
    building,
    tenant: String(lease.tenant?.name ?? 'Unknown Tenant'),
    tenantPhone: String(lease.tenant?.phone ?? ''),
    tenantEmail: String(lease.tenant?.email ?? ''),
    rent,
    annualRent: rent * 12,
    startDate: lease.startDate ? String(lease.startDate).split('T')[0] : '',
    endDate: lease.endDate ? String(lease.endDate).split('T')[0] : '',
    status: mapLeaseStatus(lease.status),
    daysRemaining,
    ejariNumber: lease.ejariNumber ? String(lease.ejariNumber) : null,
    ejariStatus: mapEjariStatus(lease.ejariStatus),
    pdcCount: 0,
    pdcCleared: 0,
    pdcBounced: 0,
    agentCommissionPct: 5, // default
    keyHandedOver: !!lease.keyHandoverDate,
    renewalNotice: daysRemaining <= 90,
  };
}

function mapMaintenanceItem(item: MaintenanceApiItem, index: number): MaintenanceRequest {
  const propertyTitle = String(item.property?.title ?? 'Unknown Property');
  const titleParts = propertyTitle.split(' - ');
  const unit = titleParts[0] ?? propertyTitle;
  const building = titleParts[1] ?? '';

  return {
    id: index + 1,
    unit,
    building,
    tenant: String(item.requester?.name ?? 'Unknown'),
    issue: String(item.title ?? 'Maintenance request'),
    category: String(item.category ?? 'general'),
    priority: mapPriority(item.priority),
    status: mapMaintStatus(item.status),
    created: item.createdAt
      ? String(item.createdAt).split('T')[0]
      : new Date().toISOString().split('T')[0],
    scheduledDate: item.scheduledDate ? String(item.scheduledDate).split('T')[0] : null,
    completedDate: item.completedAt ? String(item.completedAt).split('T')[0] : null,
    estimatedCost: item.cost != null ? Number(item.cost) : null,
    actualCost: item.cost != null ? Number(item.cost) : null,
    assignedTo: null,
  };
}

export const useLeasingData = () => {
  const [activeTab, setActiveTab] = useState<string>('leases');
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [leases, setLeases] = useState<ActiveLease[]>(ACTIVE_LEASES);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(MAINTENANCE_REQUESTS);
  const [pdcCheques, setPdcCheques] = useState<PDCCheque[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // true = loading on mount
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // ─── Fetch live data ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const leasesPromise = authFetch('/api/leases?pageSize=50')
      .then((r: Response) => r.json() as Promise<{ data?: LeaseApiItem[] }>)
      .catch(() => ({ data: [] as LeaseApiItem[] }));

    const maintPromise = authFetch('/api/maintenance?pageSize=50')
      .then((r: Response) => r.json() as Promise<{ data?: MaintenanceApiItem[] }>)
      .catch(() => ({ data: [] as MaintenanceApiItem[] }));

    Promise.all([leasesPromise, maintPromise]).then(([leasesRes, maintRes]) => {
      if (cancelled) return;
      const rawLeases: LeaseApiItem[] = Array.isArray(leasesRes.data) ? leasesRes.data : [];
      const rawMaint: MaintenanceApiItem[] = Array.isArray(maintRes.data) ? maintRes.data : [];
      if (rawLeases.length > 0) {
        setLeases(rawLeases.map(mapLeaseToActive));
      }
      if (rawMaint.length > 0) {
        setMaintenance(rawMaint.map(mapMaintenanceItem));
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectProperty = useCallback((propertyId: number) => {
    setSelectedProperty(propertyId);
  }, []);

  const getLeasesByStatus = useCallback(
    (status: string) => {
      return leases.filter(lease => lease.status === status);
    },
    [leases]
  );

  const getTotalAnnualRent = useCallback((): number => {
    return leases.reduce((sum, lease) => sum + lease.rent * 12, 0);
  }, [leases]);

  const getOccupancyRate = useCallback((): string => {
    if (leases.length === 0) return '0.0';
    const occupied = leases.filter(l => l.status === 'active').length;
    return ((occupied / leases.length) * 100).toFixed(1);
  }, [leases]);

  const getActiveTenants = useCallback((): number => {
    return leases.filter(l => l.status === 'active').length;
  }, [leases]);

  const filteredLeases = useMemo(
    () =>
      leases.filter(lease => {
        const matchesSearch =
          lease.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lease.tenant.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || lease.status === filterStatus;
        return matchesSearch && matchesStatus;
      }),
    [leases, searchQuery, filterStatus]
  );

  const updateLeaseStatus = useCallback((id: number, status: LeaseStatus) => {
    setLeases(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
  }, []);

  const updateMaintenanceStatus = useCallback((id: number, status: MaintenanceStatus) => {
    setMaintenance(prev =>
      prev.map(m =>
        m.id === id
          ? {
              ...m,
              status,
              completedDate:
                status === 'completed' ? new Date().toISOString().split('T')[0] : m.completedDate,
            }
          : m
      )
    );
  }, []);

  const updatePDCStatus = useCallback((id: number, status: PDCStatus) => {
    setPdcCheques(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const today = new Date().toISOString().split('T')[0];
        return {
          ...c,
          status,
          presentedDate: status === 'presented' ? today : c.presentedDate,
          clearedDate: status === 'cleared' ? today : c.clearedDate,
        };
      })
    );
  }, []);

  const getPipelineStats = useCallback((): Record<number, number> => {
    const stats: Record<number, number> = {};
    for (let s = 1; s <= 10; s++) stats[s] = 0; // eslint-disable-line security/detect-object-injection
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
    loading,
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
