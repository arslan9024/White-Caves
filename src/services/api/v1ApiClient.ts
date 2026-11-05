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

const BASE_URL = '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      console.warn(`[v1ApiClient] HTTP ${res.status} for ${url}`);
      return null;
    }
    const data = await res.json();
    return data.data ?? data;
  } catch (err) {
    console.warn(`[v1ApiClient] Network/Fetch error for ${url}:`, err);
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
