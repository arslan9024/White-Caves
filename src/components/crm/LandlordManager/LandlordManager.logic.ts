// FILE: src/components/crm/LandlordManager/LandlordManager.logic.ts
/**
 * White Caves Real Estate LLC - Landlord Manager State Orchestration Hooks
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  LandlordTab,
  LandlordProperty,
  PdcCheque,
  MaintenanceTicket,
  ChequeStatus,
  MaintenanceStatus,
} from './LandlordManager.types';
import {
  INITIAL_LANDLORD_PROPERTIES,
  INITIAL_PDC_CHEQUES,
  INITIAL_MAINTENANCE_TICKETS,
} from './LandlordManager.data';
import { calculateLandlordMetrics, transitionChequeStatus } from './LandlordManager.workflow';
import { LandlordCache } from './LandlordManager.cache';
import { trackLandlordEvent } from './LandlordManager.telemetry';

export function useLandlordManager() {
  const [activeTab, setActiveTab] = useState<LandlordTab>('overview');
  const [properties] = useState<LandlordProperty[]>(() => {
    return LandlordCache.getProperties() || INITIAL_LANDLORD_PROPERTIES;
  });
  const [cheques, setCheques] = useState<PdcCheque[]>(() => {
    return LandlordCache.getCheques() || INITIAL_PDC_CHEQUES;
  });
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    return LandlordCache.getTickets() || INITIAL_MAINTENANCE_TICKETS;
  });
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist state changes
  useEffect(() => {
    LandlordCache.setCheques(cheques);
  }, [cheques]);

  useEffect(() => {
    LandlordCache.setTickets(tickets);
  }, [tickets]);

  // Derived metrics
  const metrics = useMemo(() => {
    return calculateLandlordMetrics(properties, cheques, tickets);
  }, [properties, cheques, tickets]);

  const handleTabChange = useCallback((tab: LandlordTab) => {
    setActiveTab(tab);
    trackLandlordEvent('tab_switched', { tab });
  }, []);

  const handleUpdateChequeStatus = useCallback(
    (chequeId: string, newStatus: ChequeStatus) => {
      const result = transitionChequeStatus(cheques, chequeId, newStatus);
      if (result.success) {
        setCheques(result.data);
        trackLandlordEvent('cheque_status_updated', { chequeId, newStatus });
      }
    },
    [cheques]
  );

  const handleUpdateTicketStatus = useCallback((ticketId: string, newStatus: MaintenanceStatus) => {
    setTickets(prev => prev.map(t => (t.id === ticketId ? { ...t, status: newStatus } : t)));
    trackLandlordEvent('maintenance_approved', { ticketId, newStatus });
  }, []);

  // Filtered collections
  const filteredCheques = useMemo(() => {
    if (!searchQuery.trim()) return cheques;
    const q = searchQuery.toLowerCase();
    return cheques.filter(
      c =>
        c.chequeNumber.toLowerCase().includes(q) ||
        c.drawerName.toLowerCase().includes(q) ||
        c.bankName.toLowerCase().includes(q) ||
        c.unitNumber.toLowerCase().includes(q)
    );
  }, [cheques, searchQuery]);

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(
      t =>
        t.ticketCode.toLowerCase().includes(q) ||
        t.tenantName.toLowerCase().includes(q) ||
        t.unitNumber.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [tickets, searchQuery]);

  return {
    activeTab,
    setActiveTab: handleTabChange,
    properties,
    cheques: filteredCheques,
    tickets: filteredTickets,
    metrics,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    updateChequeStatus: handleUpdateChequeStatus,
    updateTicketStatus: handleUpdateTicketStatus,
  };
}
