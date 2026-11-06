// FILE: src/components/crm/DealManager/DealManager.cache.ts
/**
 * White Caves Real Estate LLC - DealManager Localized State Persistence & Cache (Tier 11)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import type { DealItem } from './DealManager.types';
import { CANONICAL_DEALS } from './DealManager.data';

const STORAGE_KEY = 'whitecaves_deals_cache';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes TTL

interface CacheEnvelope {
  timestamp: number;
  data: DealItem[];
}

// In-memory O(1) Map Index for instantaneous lookup by Turing ID
const inMemoryIndex = new Map<string, DealItem>();

export function indexDealsInMemory(deals: DealItem[]): void {
  inMemoryIndex.clear();
  for (const deal of deals) {
    inMemoryIndex.set(deal.id.toUpperCase(), deal);
    inMemoryIndex.set(deal._id.toUpperCase(), deal);
    if (deal.dealNumber) {
      inMemoryIndex.set(deal.dealNumber.toUpperCase(), deal);
    }
  }
}

export function getDealByTuringId(turingId: string): DealItem | null {
  if (!turingId) return null;
  const cleanId = turingId.trim().toUpperCase();
  return inMemoryIndex.get(cleanId) || null;
}

export function loadDealsCache(): DealItem[] | null {
  if (typeof window === 'undefined') return CANONICAL_DEALS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      indexDealsInMemory(CANONICAL_DEALS);
      return CANONICAL_DEALS;
    }

    const envelope: CacheEnvelope = JSON.parse(raw);
    const isExpired = Date.now() - envelope.timestamp > CACHE_TTL_MS;

    if (isExpired || !Array.isArray(envelope.data) || envelope.data.length === 0) {
      indexDealsInMemory(CANONICAL_DEALS);
      return CANONICAL_DEALS;
    }

    indexDealsInMemory(envelope.data);
    return envelope.data;
  } catch {
    indexDealsInMemory(CANONICAL_DEALS);
    return CANONICAL_DEALS;
  }
}

export function saveDealsCache(deals: DealItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    const envelope: CacheEnvelope = {
      timestamp: Date.now(),
      data: deals,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    indexDealsInMemory(deals);
  } catch {
    // Ignore storage quota errors silently
  }
}

export function invalidateDealsCache(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    inMemoryIndex.clear();
  } catch {}
}
