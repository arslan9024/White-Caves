// FILE: src/components/crm/BrokerManager/BrokerManager.cache.ts
/**
 * White Caves Real Estate LLC - Broker Manager State Cache
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import { BrokerCommissionDeal, AssignedLead, ReraBrokerProfile } from './BrokerManager.types';

const KEYS = {
  DEALS: 'whitecaves:broker:deals:v1',
  LEADS: 'whitecaves:broker:leads:v1',
  RERA: 'whitecaves:broker:rera:v1',
};

export const BrokerCache = {
  getDeals: (): BrokerCommissionDeal[] | null => {
    try {
      const v = localStorage.getItem(KEYS.DEALS);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  setDeals: (deals: BrokerCommissionDeal[]): void => {
    try {
      localStorage.setItem(KEYS.DEALS, JSON.stringify(deals));
    } catch {
      // quota resilience
    }
  },
  getLeads: (): AssignedLead[] | null => {
    try {
      const v = localStorage.getItem(KEYS.LEADS);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  setLeads: (leads: AssignedLead[]): void => {
    try {
      localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
    } catch {
      // quota resilience
    }
  },
  getRera: (): ReraBrokerProfile | null => {
    try {
      const v = localStorage.getItem(KEYS.RERA);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  setRera: (profile: ReraBrokerProfile): void => {
    try {
      localStorage.setItem(KEYS.RERA, JSON.stringify(profile));
    } catch {
      // quota resilience
    }
  },
};
