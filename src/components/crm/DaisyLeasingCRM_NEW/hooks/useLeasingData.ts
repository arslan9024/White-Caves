import { useState, useCallback, useMemo } from 'react';
import { ACTIVE_LEASES, MAINTENANCE_REQUESTS, RENTAL_INQUIRIES, ActiveLease } from '../data/leasing';
import { DAISY_LEASING_FEATURES } from '../data/features';

export const useLeasingData = () => {
  const [activeTab, setActiveTab] = useState<string>('leases');
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [leases, setLeases] = useState<ActiveLease[]>(ACTIVE_LEASES);
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
    const matchesSearch = lease.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lease.tenant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lease.status === filterStatus;
    return matchesSearch && matchesStatus;
  }), [leases, searchQuery, filterStatus]);

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
    maintenance: MAINTENANCE_REQUESTS
  };
};
