// FILE: src/components/crm/TenantManager/TenantManager.logic.ts
/**
 * White Caves Real Estate LLC - Tenant Manager State Hooks
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  TenantTab,
  TenantLease,
  TenantPaymentRecord,
  MoveInInspectionItem,
  TenantTicket,
} from './TenantManager.types';
import {
  INITIAL_TENANT_LEASE,
  INITIAL_TENANT_PAYMENTS,
  INITIAL_INSPECTION_ITEMS,
  INITIAL_TENANT_TICKETS,
} from './TenantManager.data';
import {
  calculateTenantMetrics,
  executeDigitalSignature,
  updateSnagItemStatus,
} from './TenantManager.workflow';
import { TenantCache } from './TenantManager.cache';
import { trackTenantEvent } from './TenantManager.telemetry';

export function useTenantManager() {
  const [activeTab, setActiveTab] = useState<TenantTab>('overview');
  const [lease, setLease] = useState<TenantLease>(() => {
    return TenantCache.getLease() || INITIAL_TENANT_LEASE;
  });
  const [payments, setPayments] = useState<TenantPaymentRecord[]>(() => {
    return TenantCache.getPayments() || INITIAL_TENANT_PAYMENTS;
  });
  const [inspections, setInspections] = useState<MoveInInspectionItem[]>(() => {
    return TenantCache.getInspections() || INITIAL_INSPECTION_ITEMS;
  });
  const [tickets, setTickets] = useState<TenantTicket[]>(() => {
    return TenantCache.getTickets() || INITIAL_TENANT_TICKETS;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    TenantCache.setLease(lease);
  }, [lease]);

  useEffect(() => {
    TenantCache.setPayments(payments);
  }, [payments]);

  useEffect(() => {
    TenantCache.setInspections(inspections);
  }, [inspections]);

  useEffect(() => {
    TenantCache.setTickets(tickets);
  }, [tickets]);

  const metrics = useMemo(() => {
    return calculateTenantMetrics(lease, payments, tickets, inspections);
  }, [lease, payments, tickets, inspections]);

  const handleSignLease = useCallback(() => {
    const updated = executeDigitalSignature(lease);
    setLease(updated);
    trackTenantEvent('lease_signed', { leaseId: updated.id });
  }, [lease]);

  const handleResolveSnag = useCallback(
    (id: string) => {
      const updated = updateSnagItemStatus(inspections, id, 'resolved');
      setInspections(updated);
      trackTenantEvent('snag_resolved', { snagId: id });
    },
    [inspections]
  );

  return {
    activeTab,
    setActiveTab,
    lease,
    payments,
    inspections,
    tickets,
    metrics,
    error,
    setError,
    signLease: handleSignLease,
    resolveSnag: handleResolveSnag,
  };
}
