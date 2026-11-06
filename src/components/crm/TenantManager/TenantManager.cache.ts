// FILE: src/components/crm/TenantManager/TenantManager.cache.ts
/**
 * White Caves Real Estate LLC - Tenant Manager State Persistence
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import {
  TenantLease,
  TenantPaymentRecord,
  MoveInInspectionItem,
  TenantTicket,
} from './TenantManager.types';

const KEYS = {
  LEASE: 'whitecaves:tenant:lease:v1',
  PAYMENTS: 'whitecaves:tenant:payments:v1',
  INSPECTIONS: 'whitecaves:tenant:inspections:v1',
  TICKETS: 'whitecaves:tenant:tickets:v1',
};

export const TenantCache = {
  getLease: (): TenantLease | null => {
    try {
      const val = localStorage.getItem(KEYS.LEASE);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },
  setLease: (lease: TenantLease): void => {
    try {
      localStorage.setItem(KEYS.LEASE, JSON.stringify(lease));
    } catch {
      // quota resilience
    }
  },
  getPayments: (): TenantPaymentRecord[] | null => {
    try {
      const val = localStorage.getItem(KEYS.PAYMENTS);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },
  setPayments: (payments: TenantPaymentRecord[]): void => {
    try {
      localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));
    } catch {
      // quota resilience
    }
  },
  getInspections: (): MoveInInspectionItem[] | null => {
    try {
      const val = localStorage.getItem(KEYS.INSPECTIONS);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },
  setInspections: (items: MoveInInspectionItem[]): void => {
    try {
      localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(items));
    } catch {
      // quota resilience
    }
  },
  getTickets: (): TenantTicket[] | null => {
    try {
      const val = localStorage.getItem(KEYS.TICKETS);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },
  setTickets: (tickets: TenantTicket[]): void => {
    try {
      localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
    } catch {
      // quota resilience
    }
  },
};
