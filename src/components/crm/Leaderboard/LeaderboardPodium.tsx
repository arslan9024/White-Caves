/**
 * White Caves Real Estate LLC - Leaderboard Podium Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { Crown, Trophy, Medal, Sparkles } from 'lucide-react';
import { LeaderboardMember } from './Leaderboard.types';
import { TIER_METADATA } from './Leaderboard.config';
import { LEADERBOARD_STYLES } from './Leaderboard.styles';

interface LeaderboardPodiumProps {
  topThree: {
    gold: LeaderboardMember | null;
    silver: LeaderboardMember | null;
    bronze: LeaderboardMember | null;
  };
  onSelectMember: (member: LeaderboardMember) => void;
}

export const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({
  topThree,
  onSelectMember,
}) => {
  const { gold, silver, bronze } = topThree;

  return (
    <div className={LEADERBOARD_STYLES.podiumContainer}>
      {/* 2nd Place: Silver (Left) */}
      {silver && (
        <div
          onClick={() => onSelectMember(silver)}
          className={`${LEADERBOARD_STYLES.podiumCardSilver} cursor-pointer group`}
        >
          <span className={`${LEADERBOARD_STYLES.podiumRankBadge} bg-slate-300 text-slate-900`}>
            Rank #2 • Silver
          </span>
          <Medal className="w-6 h-6 text-slate-300 mb-2 drop-shadow" />
          <img
            src={silver.avatar}
            alt={silver.name}
            className={`${LEADERBOARD_STYLES.podiumAvatar} ring-slate-400`}
          />
          <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
            {silver.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{silver.currentRole}</p>
          <span className="text-xs text-slate-500 mt-1">{silver.departmentName}</span>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-lg font-black text-slate-200">
              {silver.meritXp.toLocaleString()} XP
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            {silver.tasksCompleted} Tasks • {silver.slaOnTimeRate}% SLA
          </span>
        </div>
      )}

      {/* 1st Place: Gold (Center / Elevated) */}
      {gold && (
        <div
          onClick={() => onSelectMember(gold)}
          className={`${LEADERBOARD_STYLES.podiumCardGold} cursor-pointer group order-first md:order-none`}
        >
          <span
            className={`${LEADERBOARD_STYLES.podiumRankBadge} bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20`}
          >
            👑 Champion • Gold
          </span>
          <Crown className={LEADERBOARD_STYLES.crownIcon} />
          <img
            src={gold.avatar}
            alt={gold.name}
            className={`${LEADERBOARD_STYLES.podiumAvatar} ring-amber-400 w-24 h-24`}
          />
          <h3 className="font-extrabold text-white text-lg group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
            {gold.name}
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h3>
          <p className="text-xs text-amber-200/80 mt-0.5 line-clamp-1 font-medium">
            {gold.currentRole}
          </p>
          <span className="text-xs text-slate-400 mt-1">{gold.departmentName}</span>

          <div className="mt-4 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <span className="text-2xl font-black text-amber-400">
              {gold.meritXp.toLocaleString()} XP
            </span>
          </div>
          <span className="text-xs text-amber-200/60 mt-1.5">
            {gold.tasksCompleted} Tasks Delivered • {gold.slaOnTimeRate}% SLA
          </span>
        </div>
      )}

      {/* 3rd Place: Bronze (Right) */}
      {bronze && (
        <div
          onClick={() => onSelectMember(bronze)}
          className={`${LEADERBOARD_STYLES.podiumCardBronze} cursor-pointer group`}
        >
          <span className={`${LEADERBOARD_STYLES.podiumRankBadge} bg-amber-800 text-amber-100`}>
            Rank #3 • Bronze
          </span>
          <Trophy className="w-6 h-6 text-amber-700 mb-2 drop-shadow" />
          <img
            src={bronze.avatar}
            alt={bronze.name}
            className={`${LEADERBOARD_STYLES.podiumAvatar} ring-amber-700`}
          />
          <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
            {bronze.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{bronze.currentRole}</p>
          <span className="text-xs text-slate-500 mt-1">{bronze.departmentName}</span>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-lg font-black text-amber-600">
              {bronze.meritXp.toLocaleString()} XP
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            {bronze.tasksCompleted} Tasks • {bronze.slaOnTimeRate}% SLA
          </span>
        </div>
      )}
    </div>
  );
};
