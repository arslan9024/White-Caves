/**
 * White Caves Real Estate LLC - V1 REST API Client
 * Architecture: AEGIS Canonical 7-Category Architecture Standard (Service)
 * Single Purpose File Law: < 350 lines
 */

import { DealItem } from '../../components/crm/DealManager/DealManager.types';
import {
  CustomerItem,
  CustomerInteraction,
} from '../../components/crm/CustomerManager/CustomerManager.types';
import { RelationshipChain } from '../../components/crm/RelationshipManager/RelationshipManager.types';
import { DocumentItem } from '../../components/crm/DocumentManager/DocumentManager.types';
import { getApiUrl } from '../../config/constants';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';

const BASE_URL = getApiUrl('v1');
const log = createLogger('v1ApiClient');

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const headers = new Headers(options?.headers);
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');
    const res = await authFetch(url, {
      ...options,
      headers,
    });
    if (!res.ok) {
      log.warn('V1 API request failed', { status: res.status });
      return null;
    }
    const data = await res.json();
    return data.data ?? data;
  } catch (err) {
    log.warn('V1 API request failed', {
      errorType: err instanceof Error ? err.name : 'UnknownError',
    });
    return null;
  }
}

export const v1DealsApi = {
  async getAll(): Promise<DealItem[] | null> {
    return fetchJson<DealItem[]>(`${BASE_URL}/deals`);
  },

  async getById(id: string): Promise<DealItem | null> {
    return fetchJson<DealItem>(`${BASE_URL}/deals/${encodeURIComponent(id)}`);
  },

  async create(payload: Partial<DealItem>): Promise<DealItem | null> {
    return fetchJson<DealItem>(`${BASE_URL}/deals`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateStatus(id: string, status: string): Promise<DealItem | null> {
    return fetchJson<DealItem>(`${BASE_URL}/deals/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

export const v1CustomersApi = {
  async getAll(): Promise<CustomerItem[] | null> {
    return fetchJson<CustomerItem[]>(`${BASE_URL}/customers`);
  },

  async getById(id: string): Promise<CustomerItem | null> {
    return fetchJson<CustomerItem>(`${BASE_URL}/customers/${encodeURIComponent(id)}`);
  },

  async create(payload: Partial<CustomerItem>): Promise<CustomerItem | null> {
    return fetchJson<CustomerItem>(`${BASE_URL}/customers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async advanceStep(id: string, step: number, stepName: string): Promise<CustomerItem | null> {
    return fetchJson<CustomerItem>(`${BASE_URL}/customers/${encodeURIComponent(id)}/step`, {
      method: 'PATCH',
      body: JSON.stringify({ step, stepName }),
    });
  },

  async addInteraction(
    id: string,
    interaction: Omit<CustomerInteraction, 'id'>
  ): Promise<CustomerItem | null> {
    return fetchJson<CustomerItem>(`${BASE_URL}/customers/${encodeURIComponent(id)}/interactions`, {
      method: 'POST',
      body: JSON.stringify(interaction),
    });
  },

  async verifyKyc(id: string): Promise<CustomerItem | null> {
    return fetchJson<CustomerItem>(`${BASE_URL}/customers/${encodeURIComponent(id)}/kyc`, {
      method: 'PATCH',
    });
  },
};

export const v1RelationshipsApi = {
  async getAll(): Promise<RelationshipChain[] | null> {
    return fetchJson<RelationshipChain[]>(`${BASE_URL}/relationships`);
  },

  async getById(id: string): Promise<RelationshipChain | null> {
    return fetchJson<RelationshipChain>(`${BASE_URL}/relationships/${encodeURIComponent(id)}`);
  },
};

export const v1DocumentsApi = {
  async getAll(): Promise<DocumentItem[] | null> {
    return fetchJson<DocumentItem[]>(`${BASE_URL}/documents`);
  },

  async getById(id: string): Promise<DocumentItem | null> {
    return fetchJson<DocumentItem>(`${BASE_URL}/documents/${encodeURIComponent(id)}`);
  },
};
