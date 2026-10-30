/**
 * CRM Data Types and Initial State
 * Single Purpose: Domain state shape, item collections, and baseline initial state.
 */

import {
  DEV_LEADS,
  DEV_CLIENTS,
  DEV_AGENTS,
  DEV_PROPERTIES,
  DEV_COMMISSIONS,
  DEV_ACTIVITIES,
  DEV_OVERVIEW,
} from '../../../data/devData';

export interface CRMItem {
  id: string | number;
  [key: string]: unknown;
}

export interface CRMCollection<T extends CRMItem> {
  items: T[];
  selected: T | null;
  loading: boolean;
  error: string | null;
}

export interface CommissionCollection {
  items: CRMItem[];
  loading: boolean;
  error?: string | null;
}

export interface ActivityCollection {
  items: CRMItem[];
  loading: boolean;
  error?: string | null;
}

export interface InvoiceCollection {
  items: CRMItem[];
  loading: boolean;
  error?: string | null;
}

export interface ExpenseCollection {
  items: CRMItem[];
  loading: boolean;
  error?: string | null;
}

export interface TransactionCollection {
  items: CRMItem[];
  loading: boolean;
  error?: string | null;
}

export interface CRMDataState {
  leads: CRMCollection<CRMItem>;
  clients: CRMCollection<CRMItem>;
  agents: CRMCollection<CRMItem>;
  properties: CRMCollection<CRMItem>;
  commissions: CommissionCollection;
  invoices: InvoiceCollection;
  expenses: ExpenseCollection;
  transactions: TransactionCollection;
  activities: ActivityCollection;
  overview: Record<string, unknown> | null;
  lastUpdated: string;
}

export const initialState: CRMDataState = {
  leads: {
    items: import.meta.env.DEV ? DEV_LEADS : [],
    selected: null,
    loading: false,
    error: null,
  },

  clients: {
    items: import.meta.env.DEV ? DEV_CLIENTS : [],
    selected: null,
    loading: false,
    error: null,
  },

  agents: {
    items: import.meta.env.DEV ? DEV_AGENTS : [],
    selected: null,
    loading: false,
    error: null,
  },

  properties: {
    items: import.meta.env.DEV ? DEV_PROPERTIES : [],
    selected: null,
    loading: false,
    error: null,
  },

  commissions: {
    items: import.meta.env.DEV ? DEV_COMMISSIONS : [],
    loading: false,
    error: null,
  },

  invoices: {
    items: [],
    loading: false,
    error: null,
  },

  expenses: {
    items: [],
    loading: false,
    error: null,
  },

  transactions: {
    items: [],
    loading: false,
    error: null,
  },

  activities: {
    items: import.meta.env.DEV ? DEV_ACTIVITIES : [],
    loading: false,
    error: null,
  },

  overview: import.meta.env.DEV ? DEV_OVERVIEW : null,

  lastUpdated: new Date().toISOString(),
};
