/**
 * White Caves Real Estate LLC - Deal Management Logic
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Logic)
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { DealItem, DealType, DealStatus } from './DealManager.types';
import { CANONICAL_DEALS } from './DealManager.data';
import { v1DealsApi } from '../../../services/api/v1ApiClient';

export interface UseDealManagerProps {
  initialDeals?: DealItem[];
  selectedDealId?: string | null;
  onSelectDeal?: (id: string) => void;
  onNavigateBack?: () => void;
}

export function useDealManager({
  initialDeals = CANONICAL_DEALS,
  selectedDealId,
  onSelectDeal,
}: UseDealManagerProps = {}) {
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | DealType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DealStatus>('ALL');

  // Modal / Drawer state
  const [selectedDealForModal, setSelectedDealForModal] = useState<DealItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealItem | null>(null);

  // Sync with selectedDealId deep link
  useEffect(() => {
    if (selectedDealId) {
      const match = deals.find(
        d =>
          d.id.toLowerCase() === selectedDealId.toLowerCase() ||
          d._id.toLowerCase() === selectedDealId.toLowerCase() ||
          d.dealNumber.toLowerCase() === selectedDealId.toLowerCase()
      );
      if (match) {
        setSelectedDealForModal(match);
      }
    }
  }, [selectedDealId, deals]);

  // Filtered deals
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      if (typeFilter !== 'ALL' && deal.dealType !== typeFilter) return false;
      if (statusFilter !== 'ALL' && deal.status !== statusFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        deal.id.toLowerCase().includes(q) ||
        deal.dealNumber.toLowerCase().includes(q) ||
        deal.title.toLowerCase().includes(q) ||
        deal.propertyCommunity.toLowerCase().includes(q) ||
        deal.agentName.toLowerCase().includes(q) ||
        deal.clientName.toLowerCase().includes(q)
      );
    });
  }, [deals, typeFilter, statusFilter, searchQuery]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalCommission = deals.reduce((acc, d) => acc + d.commissionAED, 0);
    const completedVolume = deals
      .filter(d => d.status === 'COMPLETED')
      .reduce((acc, d) => acc + d.valueAED, 0);
    const activePipelineCount = deals.filter(
      d => d.status !== 'COMPLETED' && d.status !== 'CANCELLED'
    ).length;

    return {
      totalDealsCount: deals.length,
      totalCommissionAED: totalCommission,
      completedVolumeAED: completedVolume,
      activePipelineCount,
    };
  }, [deals]);

  // Handlers
  const handleOpenDetailModal = useCallback(
    (deal: DealItem) => {
      setSelectedDealForModal(deal);
      onSelectDeal?.(deal.id);
    },
    [onSelectDeal]
  );

  const handleCloseDetailModal = useCallback(() => {
    setSelectedDealForModal(null);
  }, []);

  const handleOpenCreateDrawer = useCallback(() => {
    setEditingDeal(null);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenEditDrawer = useCallback((deal: DealItem) => {
    setEditingDeal(deal);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setEditingDeal(null);
  }, []);

  const handleAdvanceStatus = useCallback((dealId: string, newStatus: DealStatus) => {
    setDeals(prev =>
      prev.map(d => {
        if (d.id === dealId || d._id === dealId) {
          return {
            ...d,
            status: newStatus,
          };
        }
        return d;
      })
    );

    setSelectedDealForModal(prev => {
      if (!prev) return null;
      if (prev.id === dealId || prev._id === dealId) {
        return {
          ...prev,
          status: newStatus,
        };
      }
      return prev;
    });

    // Fire live REST mutation in background
    v1DealsApi.updateStatus(dealId, newStatus).catch(() => {});
  }, []);

  const handleSaveDeal = useCallback((dealData: Partial<DealItem>) => {
    setDeals(prev => {
      const exists = prev.find(d => d.id === dealData.id || d._id === dealData._id);
      if (exists) {
        return prev.map(d => (d.id === exists.id ? ({ ...d, ...dealData } as DealItem) : d));
      }
      const newId = `DEAL-00${prev.length + 1}`;
      const newDeal: DealItem = {
        id: newId,
        _id: `deal-00${prev.length + 1}`,
        dealNumber: `WC-D-2026-00${prev.length + 1}`,
        title: dealData.title || 'Untitled Deal',
        dealType: dealData.dealType || 'LEASING',
        status: dealData.status || 'INQUIRY',
        propertyId: dealData.propertyId || 'REP-001',
        propertyTitle: dealData.propertyTitle || 'DAMAC Hills 2 Villa',
        propertyCommunity: dealData.propertyCommunity || 'DAMAC Hills 2',
        agentId: dealData.agentId || 'EMP-001',
        agentName: dealData.agentName || 'Arslan Malik',
        agentRole: dealData.agentRole || 'Managing Director',
        clientId: dealData.clientId || 'tenant-001',
        clientName: dealData.clientName || 'Hassan Al-Nuaimi',
        clientRole: dealData.clientRole || 'tenant',
        ownerName: dealData.ownerName || 'Emaar Asset Holdings',
        valueAED: dealData.valueAED || 180000,
        commissionAED:
          dealData.commissionAED ||
          (dealData.valueAED || 180000) * (dealData.dealType === 'SALES' ? 0.02 : 0.05),
        commissionRate: dealData.dealType === 'SALES' ? 2 : 5,
        pdcSchedule: dealData.pdcSchedule || [],
        documents: dealData.documents || [],
        tasksCompleted: dealData.tasksCompleted || ['TSK-001'],
        meritXPAwarded: dealData.dealType === 'SALES' ? 1500 : 500,
      };
      return [newDeal, ...prev];
    });
    // Fire live REST mutation in background
    v1DealsApi.create(dealData).catch(() => {});
    setIsDrawerOpen(false);
    setEditingDeal(null);
  }, []);

  const handleDecommissionDeal = useCallback((dealId: string) => {
    setDeals(prev =>
      prev.map(d => {
        if (d.id === dealId || d._id === dealId) {
          return { ...d, status: 'CANCELLED' };
        }
        return d;
      })
    );
    setSelectedDealForModal(null);
  }, []);

  return {
    deals: filteredDeals,
    allDeals: deals,
    metrics,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    selectedDealForModal,
    isDrawerOpen,
    editingDeal,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleOpenCreateDrawer,
    handleOpenEditDrawer,
    handleCloseDrawer,
    handleAdvanceStatus,
    handleSaveDeal,
    handleDecommissionDeal,
  };
}
