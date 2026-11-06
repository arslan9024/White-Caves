// FILE: src/components/crm/LandlordManager/LandlordManager.cache.ts
/**
 * White Caves Real Estate LLC - Landlord Manager State Persistence & Cache
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import { LandlordProperty, PdcCheque, MaintenanceTicket } from './LandlordManager.types';

const CACHE_KEYS = {
  PROPERTIES: 'whitecaves:landlord:properties:v1',
  CHEQUES: 'whitecaves:landlord:cheques:v1',
  TICKETS: 'whitecaves:landlord:tickets:v1',
};

export const LandlordCache = {
  getProperties: (): LandlordProperty[] | null => {
    try {
      const data = localStorage.getItem(CACHE_KEYS.PROPERTIES);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setProperties: (properties: LandlordProperty[]): void => {
    try {
      localStorage.setItem(CACHE_KEYS.PROPERTIES, JSON.stringify(properties));
    } catch {
      // Storage quota resilience
    }
  },

  getCheques: (): PdcCheque[] | null => {
    try {
      const data = localStorage.getItem(CACHE_KEYS.CHEQUES);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCheques: (cheques: PdcCheque[]): void => {
    try {
      localStorage.setItem(CACHE_KEYS.CHEQUES, JSON.stringify(cheques));
    } catch {
      // Storage quota resilience
    }
  },

  getTickets: (): MaintenanceTicket[] | null => {
    try {
      const data = localStorage.getItem(CACHE_KEYS.TICKETS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setTickets: (tickets: MaintenanceTicket[]): void => {
    try {
      localStorage.setItem(CACHE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch {
      // Storage quota resilience
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(CACHE_KEYS.PROPERTIES);
      localStorage.removeItem(CACHE_KEYS.CHEQUES);
      localStorage.removeItem(CACHE_KEYS.TICKETS);
    } catch {
      // Storage resilience
    }
  },
};
