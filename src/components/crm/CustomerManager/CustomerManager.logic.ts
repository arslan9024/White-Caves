/**
 * White Caves Real Estate LLC - Customer Management Logic
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Logic)
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  CustomerItem,
  CustomerType,
  LeadSource,
  CustomerInteraction,
} from './CustomerManager.types';
import { CANONICAL_CUSTOMERS } from './CustomerManager.data';
import { v1CustomersApi } from '../../../services/api/v1ApiClient';

export interface UseCustomerManagerProps {
  initialCustomers?: CustomerItem[];
  selectedCustomerId?: string | null;
  onSelectCustomer?: (id: string) => void;
  onNavigateBack?: () => void;
}

export function useCustomerManager({
  initialCustomers = CANONICAL_CUSTOMERS,
  selectedCustomerId,
  onSelectCustomer,
}: UseCustomerManagerProps = {}) {
  const [customers, setCustomers] = useState<CustomerItem[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | CustomerType>('ALL');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | LeadSource>('ALL');

  // Modal / Drawer state
  const [selectedCustomerForModal, setSelectedCustomerForModal] = useState<CustomerItem | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync with selectedCustomerId deep link
  useEffect(() => {
    if (selectedCustomerId) {
      const match = customers.find(
        c =>
          c.id.toLowerCase() === selectedCustomerId.toLowerCase() ||
          c._id.toLowerCase() === selectedCustomerId.toLowerCase() ||
          c.customerCode.toLowerCase() === selectedCustomerId.toLowerCase()
      );
      if (match) {
        setSelectedCustomerForModal(match);
      }
    }
  }, [selectedCustomerId, customers]);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(cust => {
      if (typeFilter !== 'ALL' && cust.customerType !== typeFilter) return false;
      if (sourceFilter !== 'ALL' && cust.source !== sourceFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        cust.id.toLowerCase().includes(q) ||
        cust.customerCode.toLowerCase().includes(q) ||
        cust.fullName.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        cust.preferredCommunity.toLowerCase().includes(q) ||
        cust.assignedAgentName.toLowerCase().includes(q)
      );
    });
  }, [customers, typeFilter, sourceFilter, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const total = customers.length;
    const leads = customers.filter(c => c.customerType === 'LEAD').length;
    const tenantsAndBuyers = customers.filter(
      c => c.customerType === 'TENANT' || c.customerType === 'BUYER'
    ).length;
    const kycVerifiedCount = customers.filter(c => c.kycVerified).length;
    const kycRate = Math.round((kycVerifiedCount / (total || 1)) * 100);

    return {
      totalCustomers: total,
      qualifiedLeads: leads,
      activeTenantsAndBuyers: tenantsAndBuyers,
      kycVerifiedRatePercent: kycRate,
    };
  }, [customers]);

  // Handlers
  const handleOpenDetailModal = useCallback(
    (cust: CustomerItem) => {
      setSelectedCustomerForModal(cust);
      onSelectCustomer?.(cust.id);
    },
    [onSelectCustomer]
  );

  const handleCloseDetailModal = useCallback(() => {
    setSelectedCustomerForModal(null);
  }, []);

  const handleOpenCreateDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleCloseCreateDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleAdvanceStep = useCallback(
    (customerId: string, nextStep: number, nextStepName: string) => {
      setCustomers(prev =>
        prev.map(c => {
          if (c.id === customerId || c._id === customerId) {
            return {
              ...c,
              currentStep: nextStep,
              stepName: nextStepName,
            };
          }
          return c;
        })
      );

      setSelectedCustomerForModal(prev => {
        if (!prev) return null;
        if (prev.id === customerId || prev._id === customerId) {
          return {
            ...prev,
            currentStep: nextStep,
            stepName: nextStepName,
          };
        }
        return prev;
      });

      // Live REST API sync
      v1CustomersApi.advanceStep(customerId, nextStep, nextStepName).catch(() => {});
    },
    []
  );

  const handleVerifyCustomerKyc = useCallback((customerId: string) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId || c._id === customerId) {
          return { ...c, kycVerified: true };
        }
        return c;
      })
    );

    setSelectedCustomerForModal(prev => {
      if (!prev) return null;
      if (prev.id === customerId || prev._id === customerId) {
        return { ...prev, kycVerified: true };
      }
      return prev;
    });

    // Live REST API sync
    v1CustomersApi.verifyKyc(customerId).catch(() => {});
  }, []);

  const handleAddInteraction = useCallback(
    (customerId: string, interaction: Omit<CustomerInteraction, 'id'>) => {
      const newInteraction: CustomerInteraction = {
        ...interaction,
        id: `int-${Date.now()}`,
      };

      setCustomers(prev =>
        prev.map(c => {
          if (c.id === customerId || c._id === customerId) {
            return {
              ...c,
              interactions: [newInteraction, ...c.interactions],
            };
          }
          return c;
        })
      );

      setSelectedCustomerForModal(prev => {
        if (!prev) return null;
        if (prev.id === customerId || prev._id === customerId) {
          return {
            ...prev,
            interactions: [newInteraction, ...prev.interactions],
          };
        }
        return prev;
      });

      // Live REST API sync
      v1CustomersApi.addInteraction(customerId, interaction).catch(() => {});
    },
    []
  );

  const handleSaveCustomer = useCallback((custData: Partial<CustomerItem>) => {
    setCustomers(prev => {
      const newId = `CUST-00${prev.length + 1}`;
      const newCust: CustomerItem = {
        id: newId,
        _id: `cust-00${prev.length + 1}`,
        customerCode: `WC-CUST-00${prev.length + 1}`,
        fullName: custData.fullName || 'New Real Estate Client',
        email: custData.email || 'client@whitecaves.ae',
        phone: custData.phone || '+971 50 000 0000',
        customerType: custData.customerType || 'LEAD',
        source: custData.source || 'WHATSAPP',
        currentStep: 1,
        stepName: 'LEAD_INQUIRY',
        preferredCommunity: custData.preferredCommunity || 'Dubai Marina',
        budgetAED: custData.budgetAED || 200000,
        assignedAgentId: custData.assignedAgentId || 'EMP-001',
        assignedAgentName: custData.assignedAgentName || 'Arslan Malik',
        interactions: [
          {
            id: `int-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            channel: 'WHATSAPP',
            notes: 'Initial client capture in White Caves Sovereign CRM',
            agentName: 'Arslan Malik',
          },
        ],
        kycVerified: false,
        createdAt: new Date().toISOString().split('T')[0],
      };
      return [newCust, ...prev];
    });
    // Live REST API sync
    v1CustomersApi.create(custData).catch(() => {});
    setIsDrawerOpen(false);
  }, []);

  return {
    customers: filteredCustomers,
    filteredCustomers,
    allCustomers: customers,
    metrics,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    sourceFilter,
    setSourceFilter,
    selectedCustomerForModal,
    isDrawerOpen,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleOpenCreateDrawer,
    handleCloseCreateDrawer,
    handleAdvanceStep,
    handleVerifyCustomerKyc,
    handleAddInteraction,
    handleSaveCustomer,
    handleCreateCustomer: handleSaveCustomer,
  };
}
