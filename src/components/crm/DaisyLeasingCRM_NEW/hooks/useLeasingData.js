import { useState, useCallback } from 'react';
import { ACTIVE_LEASES, MAINTENANCE_REQUESTS, RENTAL_INQUIRIES } from '../data/leasing';
import { DAISY_LEASING_FEATURES } from '../data/features';

export const useLeasingData = () => {
  const [activeTab, setActiveTab] = useState('leases');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [leases, setLeases] = useState(ACTIVE_LEASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleSelectProperty = useCallback((propertyId) => {
    setSelectedProperty(propertyId);
  }, []);

  const getLeasesByStatus = useCallback((status) => {
    return leases.filter(lease => lease.status === status);
  }, [leases]);

  const getTotalAnnualRent = useCallback(() => {
    return leases.reduce((sum, lease) => sum + (lease.rent * 12), 0);
  }, [leases]);

  const getOccupancyRate = useCallback(() => {
    const occupied = leases.filter(l => l.status === 'active').length;
    return ((occupied / leases.length) * 100).toFixed(1);
  }, [leases]);

  const getActiveTenants = useCallback(() => {
    return leases.filter(l => l.status === 'active').length;
  }, [leases]);

  const filteredLeases = leases.filter(lease => {
    const matchesSearch = lease.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lease.tenant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lease.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
