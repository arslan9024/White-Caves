// FILE: src/components/crm/RoleManager/RoleManager.cache.ts
/**
 * White Caves Real Estate LLC - Role Manager State Persistence & O(1) Index (Tier 11)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import type { SovereignRoleDefinition } from './RoleManager.types';
import { CANONICAL_SOVEREIGN_ROLES } from './RoleManager.data';

const STORAGE_KEY = 'whitecaves_roles_cache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour TTL

interface CacheEnvelope {
  timestamp: number;
  data: SovereignRoleDefinition[];
}

const inMemoryIndex = new Map<string, SovereignRoleDefinition>();

export function indexRolesInMemory(roles: SovereignRoleDefinition[]): void {
  inMemoryIndex.clear();
  if (!Array.isArray(roles)) return;
  for (const role of roles) {
    if (role && role.id) {
      inMemoryIndex.set(role.id.toUpperCase(), role);
    }
    if (role && role.code) {
      inMemoryIndex.set(role.code.toUpperCase(), role);
    }
  }
}

export function getRoleById(roleId: string): SovereignRoleDefinition | null {
  if (!roleId) return null;
  const cleanId = roleId.trim().toUpperCase();
  return inMemoryIndex.get(cleanId) || null;
}

export function loadRoleCache(): SovereignRoleDefinition[] | null {
  if (typeof window === 'undefined') return CANONICAL_SOVEREIGN_ROLES;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const envelope: CacheEnvelope = JSON.parse(raw);
    const now = Date.now();

    if (now - envelope.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return envelope.data;
  } catch {
    return null;
  }
}

export function saveRoleCache(roles: SovereignRoleDefinition[]): void {
  if (typeof window === 'undefined') return;

  try {
    const envelope: CacheEnvelope = {
      timestamp: Date.now(),
      data: roles,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  } catch {
    // Fail silently on storage errors
  }
}
