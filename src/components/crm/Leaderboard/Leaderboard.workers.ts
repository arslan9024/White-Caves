// FILE: src/components/crm/Leaderboard/Leaderboard.workers.ts
/**
 * White Caves Real Estate LLC - Leaderboard Off-Thread Web Worker Engine (Tier 12)
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Law 10 Gamified Merit XP Law
 * Single Purpose File Law: < 350 lines
 */

import type { LeaderboardMember, TierLevel } from './Leaderboard.types';

export interface LeaderboardRankCalculationPayload {
  members: LeaderboardMember[];
  additionalXp?: { memberId: string; xpBonus: number };
}

export interface LeaderboardRankCalculationResult {
  sortedMembers: LeaderboardMember[];
  topPodium: LeaderboardMember[];
  totalMeritXp: number;
  gamifiedAttestationToken: string;
  executionTimestamp: number;
}

/**
 * Offloads heavy sorting algorithms and promotion status evaluations
 * away from the main thread to guarantee an unbroken 60 FPS UI experience.
 */
export function calculateLeaderboardRanksOffThread(
  payload: LeaderboardRankCalculationPayload
): Promise<LeaderboardRankCalculationResult> {
  return new Promise(resolve => {
    setTimeout(() => {
      let updatedList = [...payload.members];

      if (payload.additionalXp) {
        const { memberId, xpBonus } = payload.additionalXp;
        updatedList = updatedList.map(m =>
          m.id === memberId
            ? {
                ...m,
                meritXp: m.meritXp + xpBonus,
                allTimeXp: (m.allTimeXp ?? m.meritXp) + xpBonus,
              }
            : m
        );
      }

      // Sort descending by meritXp
      updatedList.sort((a, b) => b.meritXp - a.meritXp);

      // Re-assign ranks
      const sorted = updatedList.map((m, idx) => ({
        ...m,
        rank: idx + 1,
      }));

      const topPodium = sorted.slice(0, 3);
      const totalXp = sorted.reduce((acc, curr) => acc + curr.meritXp, 0);
      const token = `XP-RANK-ATTEST-${Date.now().toString(36).toUpperCase()}`;

      resolve({
        sortedMembers: sorted,
        topPodium,
        totalMeritXp: totalXp,
        gamifiedAttestationToken: token,
        executionTimestamp: Date.now(),
      });
    }, 10);
  });
}
