/**
 * White Caves Real Estate LLC - Leaderboard Promotion Drawer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Component)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  History,
} from 'lucide-react';
import { LeaderboardMember, PromotionCriteria } from './Leaderboard.types';
import { TIER_METADATA } from './Leaderboard.config';
import { LEADERBOARD_STYLES } from './Leaderboard.styles';

interface LeaderboardPromotionDrawerProps {
  member: LeaderboardMember | null;
  audit: {
    isEligible: boolean;
    criteria: PromotionCriteria | null;
    missingRequirements: string[];
    progressPercent: number;
  } | null;
  onClose: () => void;
  onPromote: (memberId: string) => void;
}

export const LeaderboardPromotionDrawer: React.FC<LeaderboardPromotionDrawerProps> = ({
  member,
  audit,
  onClose,
  onPromote,
}) => {
  if (!member) return null;

  const currentTierMeta = TIER_METADATA[member.currentTier];
  const nextTierMeta = member.nextTier ? TIER_METADATA[member.nextTier] : null;

  return (
    <div className={LEADERBOARD_STYLES.drawerOverlay} onClick={onClose}>
      <div className={LEADERBOARD_STYLES.drawerContent} onClick={e => e.stopPropagation()}>
        <div className="space-y-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Career Dossier & Promotion Audit</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Member Card */}
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500/30"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base truncate">{member.name}</h3>
              <p className="text-xs text-slate-400 truncate">{member.currentRole}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`${LEADERBOARD_STYLES.tierBadge} ${currentTierMeta.badgeBg} ${currentTierMeta.badgeText} ${currentTierMeta.badgeBorder}`}
                >
                  {currentTierMeta.tier} • {currentTierMeta.label}
                </span>
                {nextTierMeta && (
                  <>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span
                      className={`${LEADERBOARD_STYLES.tierBadge} ${nextTierMeta.badgeBg} ${nextTierMeta.badgeText} ${nextTierMeta.badgeBorder}`}
                    >
                      Target: {nextTierMeta.tier}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Merit XP</span>
              <p className="text-lg font-black text-amber-400 mt-1">
                {member.meritXp.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Tasks Closed
              </span>
              <p className="text-lg font-black text-white mt-1">{member.tasksCompleted}</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                SLA Compliance
              </span>
              <p className="text-lg font-black text-emerald-400 mt-1">{member.slaOnTimeRate}%</p>
            </div>
          </div>

          {/* Promotion Criteria Checklist */}
          {audit?.criteria ? (
            <div className={LEADERBOARD_STYLES.checklistCard}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  {audit.criteria.title}
                </span>
                <span className="text-xs font-semibold text-amber-400">
                  {audit.progressPercent}% Complete
                </span>
              </div>

              {/* Progress bar */}
              <div className={LEADERBOARD_STYLES.progressBarBg}>
                <div
                  className={LEADERBOARD_STYLES.progressBarFill}
                  style={{ width: `${audit.progressPercent}%` }}
                />
              </div>

              <div className="space-y-2.5 pt-2">
                {/* Rule 1: Tasks */}
                <div className={LEADERBOARD_STYLES.checklistItem}>
                  {member.tasksCompleted >= audit.criteria.minTasksCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <span className="text-slate-300 text-xs">
                    Completed Tasks: <strong className="text-white">{member.tasksCompleted}</strong>{' '}
                    / {audit.criteria.minTasksCompleted}
                  </span>
                </div>

                {/* Rule 2: XP */}
                <div className={LEADERBOARD_STYLES.checklistItem}>
                  {member.meritXp >= audit.criteria.minMeritXp ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <span className="text-slate-300 text-xs">
                    Merit XP Points: <strong className="text-white">{member.meritXp}</strong> /{' '}
                    {audit.criteria.minMeritXp} XP
                  </span>
                </div>

                {/* Rule 3: SLA */}
                <div className={LEADERBOARD_STYLES.checklistItem}>
                  {member.slaOnTimeRate >= audit.criteria.minSlaRate ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <span className="text-slate-300 text-xs">
                    SLA On-Time Standard:{' '}
                    <strong className="text-white">{member.slaOnTimeRate}%</strong> (min{' '}
                    {audit.criteria.minSlaRate}%)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">Peak Executive Tier Achieved</p>
              <p className="text-xs text-slate-400 mt-1">
                This member operates at the highest corporate tier.
              </p>
            </div>
          )}

          {/* Career Milestones */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-400" />
              Career Milestones ({member.milestones.length})
            </span>
            {member.milestones.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No previous promotions recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {member.milestones.map(m => (
                  <div
                    key={m.id}
                    className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center text-slate-400 font-mono text-[10px]">
                      <span>{m.timestamp}</span>
                      <span className="text-amber-400 font-bold">
                        {m.fromTier} → {m.toTier}
                      </span>
                    </div>
                    <p className="text-slate-200 font-semibold">{m.newRole}</p>
                    <p className="text-slate-400 text-[11px]">{m.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Promotion Action Footer */}
        <div className="pt-4 border-t border-slate-800 mt-6">
          {audit?.isEligible ? (
            <button onClick={() => onPromote(member.id)} className={LEADERBOARD_STYLES.promoteBtn}>
              <Sparkles className="w-5 h-5 text-slate-950" />
              Promote to {audit.criteria?.targetRole} ({audit.criteria?.toTier})
            </button>
          ) : (
            <div className="text-center py-2">
              <span className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-slate-500" />
                Criteria in progress:{' '}
                {audit?.missingRequirements[0] || 'Advancing towards next tier'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
