// FILE: src/components/crm/BrokerManager/BrokerManager.logic.ts
/**
 * White Caves Real Estate LLC - Broker Manager State Hooks
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  BrokerTab,
  BrokerCommissionDeal,
  AssignedLead,
  ReraBrokerProfile,
  CommissionPayoutStatus,
} from './BrokerManager.types';
import {
  INITIAL_BROKER_DEALS,
  INITIAL_ASSIGNED_LEADS,
  INITIAL_RERA_PROFILE,
} from './BrokerManager.data';
import { calculateBrokerMetrics, updateLeadStatus } from './BrokerManager.workflow';
import { BrokerCache } from './BrokerManager.cache';
import { trackBrokerEvent } from './BrokerManager.telemetry';

export function useBrokerManager() {
  const [activeTab, setActiveTab] = useState<BrokerTab>('overview');
  const [deals, setDeals] = useState<BrokerCommissionDeal[]>(() => {
    return BrokerCache.getDeals() || INITIAL_BROKER_DEALS;
  });
  const [leads, setLeads] = useState<AssignedLead[]>(() => {
    return BrokerCache.getLeads() || INITIAL_ASSIGNED_LEADS;
  });
  const [reraProfile] = useState<ReraBrokerProfile>(() => {
    return BrokerCache.getRera() || INITIAL_RERA_PROFILE;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    BrokerCache.setDeals(deals);
  }, [deals]);

  useEffect(() => {
    BrokerCache.setLeads(leads);
  }, [leads]);

  const metrics = useMemo(() => {
    return calculateBrokerMetrics(deals, leads, reraProfile);
  }, [deals, leads, reraProfile]);

  const handleRequestPayout = useCallback((dealId: string) => {
    setDeals(prev =>
      prev.map(d =>
        d.id === dealId ? { ...d, payoutStatus: 'approved' as CommissionPayoutStatus } : d
      )
    );
    trackBrokerEvent('payout_requested', { dealId });
  }, []);

  const handleContactLead = useCallback(
    (leadId: string) => {
      const updated = updateLeadStatus(leads, leadId, 'contacted');
      setLeads(updated);
      trackBrokerEvent('lead_contacted', { leadId });
    },
    [leads]
  );

  return {
    activeTab,
    setActiveTab,
    deals,
    leads,
    reraProfile,
    metrics,
    error,
    setError,
    requestPayout: handleRequestPayout,
    contactLead: handleContactLead,
  };
}
