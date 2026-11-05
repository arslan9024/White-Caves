/**
 * White Caves Real Estate LLC - Gamified Leaderboard & Tier Progression View
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Pure View)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import {
  Trophy,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle,
  Users,
  ChevronRight,
  Shield,
  ArrowUpRight,
} from 'lucide-react';
import { useLeaderboardLogic } from './Leaderboard.logic';
import { LeaderboardPodium } from './LeaderboardPodium';
import { LeaderboardPromotionDrawer } from './LeaderboardPromotionDrawer';
import { TIER_METADATA } from './Leaderboard.config';
import { LEADERBOARD_STYLES } from './Leaderboard.styles';
import { TierLevel } from './Leaderboard.types';

export const LeaderboardView: React.FC = () => {
  const {
    filteredAndRankedMembers,
    topThree,
    stats,
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    selectedTier,
    setSelectedTier,
    selectedTimeframe,
    setSelectedTimeframe,
    selectedMemberForPromotion,
    promotionAudit,
    notification,
    handlePromoteMember,
    openPromotionDrawer,
    closePromotionDrawer,
  } = useLeaderboardLogic();

  return (
    <div className={LEADERBOARD_STYLES.container} data-testid="leaderboard-view">
      <div className={LEADERBOARD_STYLES.contentWrapper}>
        {/* Notification Toast */}
        {notification && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-xl flex items-center justify-between shadow-lg shadow-amber-500/5 animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-semibold">{notification}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className={LEADERBOARD_STYLES.headerContainer}>
          <div>
            <div className={LEADERBOARD_STYLES.titleRow}>
              <Trophy className={LEADERBOARD_STYLES.titleIcon} />
              <h1 className={LEADERBOARD_STYLES.title}>
                Corporate Merit Leaderboard & Tier Progression (L0–L5)
              </h1>
            </div>
            <p className={LEADERBOARD_STYLES.subtitle}>
              Verifiable task completion XP, SLA compliance tracking, and transparent merit-based
              promotions from L4 Specialist to L1 Director.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              {stats.totalPersonnel} Active Roster
            </span>
            <span className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs font-semibold text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {stats.eligibleCount} Promotion Ready
            </span>
          </div>
        </div>

        {/* Aggregate Metrics Deck */}
        <div className={LEADERBOARD_STYLES.metricsGrid}>
          <div className={LEADERBOARD_STYLES.metricCard}>
            <span className={LEADERBOARD_STYLES.metricLabel}>
              Total Merit XP
              <Award className="w-4 h-4 text-amber-400" />
            </span>
            <span className={LEADERBOARD_STYLES.metricValue}>{stats.totalXp.toLocaleString()}</span>
            <span className={LEADERBOARD_STYLES.metricSubtext}>Across all departments</span>
          </div>

          <div className={LEADERBOARD_STYLES.metricCard}>
            <span className={LEADERBOARD_STYLES.metricLabel}>
              Tasks Completed
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </span>
            <span className={LEADERBOARD_STYLES.metricValue}>{stats.totalTasks}</span>
            <span className={LEADERBOARD_STYLES.metricSubtext}>Verified L5 deliverables</span>
          </div>

          <div className={LEADERBOARD_STYLES.metricCard}>
            <span className={LEADERBOARD_STYLES.metricLabel}>
              Promotion Ready
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            </span>
            <span className={LEADERBOARD_STYLES.metricValue}>{stats.eligibleCount} Candidates</span>
            <span className={LEADERBOARD_STYLES.metricSubtext}>Criteria 100% fulfilled</span>
          </div>

          <div className={LEADERBOARD_STYLES.metricCard}>
            <span className={LEADERBOARD_STYLES.metricLabel}>
              Average SLA Compliance
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </span>
            <span className={LEADERBOARD_STYLES.metricValue}>{stats.avgSla}%</span>
            <span className={LEADERBOARD_STYLES.metricSubtext}>On-time resolution rate</span>
          </div>
        </div>

        {/* Podium Deck */}
        <LeaderboardPodium topThree={topThree} onSelectMember={openPromotionDrawer} />

        {/* Filter and Search Bar */}
        <div className={LEADERBOARD_STYLES.filterBar}>
          {/* Search Box */}
          <div className={LEADERBOARD_STYLES.searchBox}>
            <Search className={LEADERBOARD_STYLES.searchIcon} />
            <input
              type="text"
              placeholder="Search employee by name, department, or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={LEADERBOARD_STYLES.searchInput}
            />
          </div>

          {/* Tier Tabs */}
          <div className={LEADERBOARD_STYLES.tabGroup}>
            {['ALL', 'L1', 'L2', 'L3', 'L4'].map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`${LEADERBOARD_STYLES.tabBtn} ${
                  selectedTier === tier
                    ? LEADERBOARD_STYLES.tabBtnActive
                    : LEADERBOARD_STYLES.tabBtnInactive
                }`}
              >
                {tier === 'ALL' ? 'All Tiers' : tier}
              </button>
            ))}
          </div>

          {/* Timeframe Tabs */}
          <div className={LEADERBOARD_STYLES.tabGroup}>
            {(['ALL_TIME', 'THIS_MONTH', 'THIS_WEEK'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`${LEADERBOARD_STYLES.tabBtn} ${
                  selectedTimeframe === tf
                    ? LEADERBOARD_STYLES.tabBtnActive
                    : LEADERBOARD_STYLES.tabBtnInactive
                }`}
              >
                {tf === 'ALL_TIME' ? 'All-Time' : tf === 'THIS_MONTH' ? 'Month' : 'Week'}
              </button>
            ))}
          </div>
        </div>

        {/* Full Ranked Table */}
        <div className={LEADERBOARD_STYLES.tableCard}>
          <div className={LEADERBOARD_STYLES.tableHeader}>
            <div className={LEADERBOARD_STYLES.rankCol}>Rank</div>
            <div className={LEADERBOARD_STYLES.memberCol}>Personnel & Division</div>
            <div className={LEADERBOARD_STYLES.tierCol}>Corporate Tier</div>
            <div className={LEADERBOARD_STYLES.xpCol}>Merit Score</div>
            <div className={LEADERBOARD_STYLES.progressCol}>Promotion Progress</div>
            <div className={LEADERBOARD_STYLES.actionCol}>Action</div>
          </div>

          <div className="divide-y divide-slate-800/40">
            {filteredAndRankedMembers.map((member, index) => {
              const tierMeta = TIER_METADATA[member.currentTier];
              const isEligible = member.promotionStatus === 'ELIGIBLE';

              return (
                <div
                  key={member.id}
                  className={`${LEADERBOARD_STYLES.tableRow} ${
                    isEligible ? LEADERBOARD_STYLES.tableRowEligible : ''
                  }`}
                >
                  {/* Rank */}
                  <div className={LEADERBOARD_STYLES.rankCol}>
                    <span className="text-sm font-black text-slate-300">#{index + 1}</span>
                  </div>

                  {/* Member */}
                  <div className={LEADERBOARD_STYLES.memberCol}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm truncate">{member.name}</span>
                        {isEligible && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ELIGIBLE
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 block truncate">
                        {member.currentRole}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {member.departmentName}
                      </span>
                    </div>
                  </div>

                  {/* Corporate Tier */}
                  <div className={LEADERBOARD_STYLES.tierCol}>
                    <span
                      className={`${LEADERBOARD_STYLES.tierBadge} ${tierMeta.badgeBg} ${tierMeta.badgeText} ${tierMeta.badgeBorder}`}
                    >
                      {tierMeta.tier} • {tierMeta.label.split(' ')[0]}
                    </span>
                  </div>

                  {/* XP & Tasks */}
                  <div className={LEADERBOARD_STYLES.xpCol}>
                    <span className="text-sm font-black text-amber-400">
                      {member.meritXp.toLocaleString()} XP
                    </span>
                    <span className="text-xs text-slate-400">
                      {member.tasksCompleted} tasks • {member.slaOnTimeRate}% SLA
                    </span>
                  </div>

                  {/* Progress */}
                  <div className={LEADERBOARD_STYLES.progressCol}>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-400 text-[11px]">
                        {member.nextTier ? `Target: ${member.nextTier}` : 'Peak Tier'}
                      </span>
                      <span className="font-semibold text-slate-300 text-[11px]">
                        {member.nextTierProgressPercent}%
                      </span>
                    </div>
                    <div className={LEADERBOARD_STYLES.progressBarBg}>
                      <div
                        className={LEADERBOARD_STYLES.progressBarFill}
                        style={{ width: `${member.nextTierProgressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action */}
                  <div className={LEADERBOARD_STYLES.actionCol}>
                    {isEligible ? (
                      <button
                        onClick={() => openPromotionDrawer(member)}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-black rounded-lg shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Promote
                      </button>
                    ) : (
                      <button
                        onClick={() => openPromotionDrawer(member)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                      >
                        Inspect
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Promotion Drawer */}
      <LeaderboardPromotionDrawer
        member={selectedMemberForPromotion}
        audit={promotionAudit}
        onClose={closePromotionDrawer}
        onPromote={handlePromoteMember}
      />
    </div>
  );
};
