/**
 * LeaderboardOverviewView.tsx
 * White Caves Real Estate LLC - LMS Executive Overview for /dashboard/leaderboard
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol & Gamification Tiers (L0–L5)
 */

import React, { FC } from 'react';
import { Trophy, Award, Crown, Sparkles, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { INITIAL_LEADERBOARD_DATA } from './Leaderboard.data';
import { TIER_METADATA } from './Leaderboard.config';

export interface LeaderboardOverviewViewProps {
  onNavigate: (route: string) => void;
}

export const LeaderboardOverviewView: FC<LeaderboardOverviewViewProps> = ({ onNavigate }) => {
  const members = INITIAL_LEADERBOARD_DATA;
  const totalMerit = members.reduce((acc, curr) => acc + curr.meritXp, 0);
  const topMember = [...members].sort((a, b) => b.meritXp - a.meritXp)[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" data-testid="leaderboard-overview-view">
      {/* ── 1. Top Sovereign Header ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy size={15} /> System #8 · Merit Leaderboard & Gamification (LMS)
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Merit Performance Ranking & Sovereign Tier Progression
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
          The sovereign gamified merit engine of White Caves Real Estate LLC: real-time XP scoring
          based on deal closures, statutory task completion velocity, regulatory accuracy, and tier
          promotions across L0 Sovereign Director to L5 Junior Broker.
        </p>
      </div>

      {/* ── 2. Real-Time Telemetry Deck ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Ranked Staff</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {members.length} <span className="text-xs text-slate-500">Members</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active Merit Participants</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Merit XP</div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {totalMerit.toLocaleString()} <span className="text-xs text-slate-500">XP</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Corporate Merit Pool</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Current #1 Leader</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 truncate">
            {topMember ? topMember.name.split(' ')[0] : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {topMember ? `${topMember.meritXp.toLocaleString()} XP · ${topMember.currentTier}` : ''}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Merit Tiers</div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            6 <span className="text-xs text-slate-500">Tiers</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">L0 Sovereign down to L5</div>
        </div>
      </div>

      {/* ── 3. Primary Double-Layer Navigation Portals ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Layer 1: Rankings Standings */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase mb-2">
              <Crown size={16} /> Double-Layer Route 1
            </div>
            <h3 className="text-lg font-bold text-white">Leaderboard Standings & Podium</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              View the corporate podium, filter rankings by department, review completed task count
              and deal velocity, and award peer bonuses.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/leaderboard/rankings</code> &{' '}
              <code>/dashboard/leaderboard/:memberId</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/leaderboard/rankings')}
            data-testid="navigate-to-leaderboard-rankings-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Open Leaderboard Standings</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Layer 2: Merit Tiers */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase mb-2">
              <Sparkles size={16} /> Double-Layer Route 2
            </div>
            <h3 className="text-lg font-bold text-white">Tier Structure & Sovereign Privileges</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Explore the 6 merit tiers (L0 to L5), threshold requirements, commission multiplier
              bonuses, and sovereign executive override clearance.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/leaderboard/tiers</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/leaderboard/tiers')}
            data-testid="navigate-to-leaderboard-tiers-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Review Tier Structure & Rules</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 4. Quick Access Member Chips ────────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-3">
          Top Merit Performers (Direct Deep View)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {members.slice(0, 8).map((member, idx) => (
            <button
              key={member.id}
              onClick={() => onNavigate(`/dashboard/leaderboard/${member.id}`)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 text-left transition-all cursor-pointer group"
            >
              <div className="truncate">
                <span className="text-[10px] font-mono text-amber-400 block font-bold">
                  #{idx + 1} · {member.currentTier} · {member.meritXp.toLocaleString()} XP
                </span>
                <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate block">
                  {member.name}
                </span>
              </div>
              <ArrowRight
                size={12}
                className="text-slate-600 group-hover:text-amber-400 shrink-0 ml-1 transition-colors"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardOverviewView;
