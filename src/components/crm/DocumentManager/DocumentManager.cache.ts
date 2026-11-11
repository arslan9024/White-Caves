// FILE: src/components/crm/DocumentManager/DocumentManager.cache.ts
/**
 * White Caves Real Estate LLC - DocumentManager Localized State Persistence & Cache (Tier 11)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import type { DocumentItem } from './DocumentManager.types';
import { CANONICAL_DOCUMENTS } from './DocumentManager.data';

const STORAGE_KEY = 'whitecaves_documents_cache';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes TTL

interface CacheEnvelope {
  timestamp: number;
  data: DocumentItem[];
}

// In-memory O(1) Map Index for instantaneous lookup by Turing ID
const inMemoryIndex = new Map<string, DocumentItem>();

export function indexDocumentsInMemory(documents: DocumentItem[]): void {
  inMemoryIndex.clear();
  for (const doc of documents) {
    inMemoryIndex.set(doc.id.toUpperCase(), doc);
    inMemoryIndex.set(doc._id.toUpperCase(), doc);
    if (doc.docCode) {
      inMemoryIndex.set(doc.docCode.toUpperCase(), doc);
    }
  }
}

export function getDocumentByTuringId(turingId: string): DocumentItem | null {
  if (!turingId) return null;
  const cleanId = turingId.trim().toUpperCase();
  return inMemoryIndex.get(cleanId) || null;
}

export function loadDocumentsCache(): DocumentItem[] | null {
  if (typeof window === 'undefined') return CANONICAL_DOCUMENTS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      indexDocumentsInMemory(CANONICAL_DOCUMENTS);
      return CANONICAL_DOCUMENTS;
    }

    const envelope: CacheEnvelope = JSON.parse(raw);
    const isExpired = Date.now() - envelope.timestamp > CACHE_TTL_MS;

    if (isExpired || !Array.isArray(envelope.data) || envelope.data.length === 0) {
      indexDocumentsInMemory(CANONICAL_DOCUMENTS);
      return CANONICAL_DOCUMENTS;
    }

    indexDocumentsInMemory(envelope.data);
    return envelope.data;
  } catch {
    indexDocumentsInMemory(CANONICAL_DOCUMENTS);
    return CANONICAL_DOCUMENTS;
  }
}

export function saveDocumentsCache(documents: DocumentItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    const envelope: CacheEnvelope = {
      timestamp: Date.now(),
      data: documents,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    indexDocumentsInMemory(documents);
  } catch {
    // Non-fatal fallback
  }
}
