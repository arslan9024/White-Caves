// FILE: src/components/crm/CustomerManager/CustomerManager.cache.ts
/**
 * White Caves Real Estate LLC - CustomerManager Localized State Persistence & Cache (Tier 11)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import type { CustomerItem } from './CustomerManager.types';
import { CANONICAL_CUSTOMERS } from './CustomerManager.data';

const STORAGE_KEY = 'whitecaves_customers_cache';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes TTL

interface CacheEnvelope {
  timestamp: number;
  data: CustomerItem[];
}

// In-memory O(1) Map Index for instantaneous lookup by Turing ID
const inMemoryIndex = new Map<string, CustomerItem>();

export function indexCustomersInMemory(customers: CustomerItem[]): void {
  inMemoryIndex.clear();
  for (const customer of customers) {
    inMemoryIndex.set(customer.id.toUpperCase(), customer);
    inMemoryIndex.set(customer._id.toUpperCase(), customer);
    if (customer.customerCode) {
      inMemoryIndex.set(customer.customerCode.toUpperCase(), customer);
    }
  }
}

export function getCustomerByTuringId(turingId: string): CustomerItem | null {
  if (!turingId) return null;
  const cleanId = turingId.trim().toUpperCase();
  return inMemoryIndex.get(cleanId) || null;
}

export function loadCustomersCache(): CustomerItem[] | null {
  if (typeof window === 'undefined') return CANONICAL_CUSTOMERS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      indexCustomersInMemory(CANONICAL_CUSTOMERS);
      return CANONICAL_CUSTOMERS;
    }

    const envelope: CacheEnvelope = JSON.parse(raw);
    const isExpired = Date.now() - envelope.timestamp > CACHE_TTL_MS;

    if (isExpired || !Array.isArray(envelope.data) || envelope.data.length === 0) {
      indexCustomersInMemory(CANONICAL_CUSTOMERS);
      return CANONICAL_CUSTOMERS;
    }

    indexCustomersInMemory(envelope.data);
    return envelope.data;
  } catch {
    indexCustomersInMemory(CANONICAL_CUSTOMERS);
    return CANONICAL_CUSTOMERS;
  }
}

export function saveCustomersCache(customers: CustomerItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    const envelope: CacheEnvelope = {
      timestamp: Date.now(),
      data: customers,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    indexCustomersInMemory(customers);
  } catch {
    // Non-fatal fallback
  }
}
