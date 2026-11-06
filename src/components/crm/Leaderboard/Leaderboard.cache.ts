// FILE: src/components/crm/Leaderboard/Leaderboard.cache.ts
/**
 * White Caves Real Estate LLC - Leaderboard Localized State Persistence & Cache (Tier 11)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import type { LeaderboardMember } from './Leaderboard.types';
import { CANONICAL_LEADERBOARD_MEMBERS } from './Leaderboard.data';

const STORAGE_KEY = 'whitecaves_leaderboard_cache';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes TTL

interface CacheEnvelope {
  timestamp: number;
  data: LeaderboardMember[];
}

// In-memory O(1) Map Index for instantaneous lookup by Turing ID
const inMemoryIndex = new Map<string, LeaderboardMember>();

export function indexLeaderboardInMemory(members: LeaderboardMember[]): void {
  inMemoryIndex.clear();
  if (!Array.isArray(members)) return;
  for (const member of members) {
    if (member && member.id) {
      inMemoryIndex.set(member.id.toUpperCase(), member);
    }
    if (member && member.rank) {
      inMemoryIndex.set(`RANK-${member.rank}`, member);
    }
  }
}

export function getLeaderboardMemberByTuringId(turingId: string): LeaderboardMember | null {
  if (!turingId) return null;
  const cleanId = turingId.trim().toUpperCase();
  return inMemoryIndex.get(cleanId) || null;
}

export function loadLeaderboardCache(): LeaderboardMember[] | null {
  if (typeof window === 'undefined') return CANONICAL_LEADERBOARD_MEMBERS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      indexLeaderboardInMemory(CANONICAL_LEADERBOARD_MEMBERS);
      return CANONICAL_LEADERBOARD_MEMBERS;
    }

    const envelope: CacheEnvelope = JSON.parse(raw);
    const isExpired = Date.now() - envelope.timestamp > CACHE_TTL_MS;

    if (isExpired || !Array.isArray(envelope.data) || envelope.data.length === 0) {
      indexLeaderboardInMemory(CANONICAL_LEADERBOARD_MEMBERS);
      return CANONICAL_LEADERBOARD_MEMBERS;
    }

    indexLeaderboardInMemory(envelope.data);
    return envelope.data;
  } catch {
    indexLeaderboardInMemory(CANONICAL_LEADERBOARD_MEMBERS);
    return CANONICAL_LEADERBOARD_MEMBERS;
  }
}

export function saveLeaderboardCache(members: LeaderboardMember[]): void {
  if (typeof window === 'undefined') return;

  try {
    const envelope: CacheEnvelope = {
      timestamp: Date.now(),
      data: members,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    indexLeaderboardInMemory(members);
  } catch {
    // Non-fatal fallback
  }
}
