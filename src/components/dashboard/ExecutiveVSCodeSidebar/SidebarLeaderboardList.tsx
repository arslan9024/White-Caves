/**
 * SidebarLeaderboardList.tsx
 * White Caves Real Estate LLC - Leaderboard Left Sidebar Drawer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Double-Layer Routing
 */

import React, { FC } from 'react';
import { Trophy, Award, Sparkles, ChevronRight, Crown, ArrowRight } from 'lucide-react';
import { INITIAL_LEADERBOARD_DATA } from '../../crm/Leaderboard/Leaderboard.data';
import { TIER_METADATA } from '../../crm/Leaderboard/Leaderboard.config';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

export interface SidebarLeaderboardListProps {
  filterQuery?: string;
  selectedMemberId?: string | null;
  onSelectMember?: (id: string, name: string) => void;
  onNavigateToView?: (route: string) => void;
}

export const SidebarLeaderboardList: FC<SidebarLeaderboardListProps> = ({
  filterQuery = '',
  selectedMemberId,
  onSelectMember,
  onNavigateToView,
}) => {
  const query = filterQuery.trim().toLowerCase();

  const sortedMembers = [...INITIAL_LEADERBOARD_DATA]
    .filter(m => {
      if (!query) return true;
      return (
        m.name.toLowerCase().includes(query) ||
        m.currentRole.toLowerCase().includes(query) ||
        m.departmentName.toLowerCase().includes(query) ||
        m.currentTier.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => b.meritXp - a.meritXp);

  return (
    <SidebarListWrapper data-testid="sidebar-leaderboard-list">
      {/* ── Level 1 Category Portals ─────────────────────────────────── */}
      <div style={{ marginBottom: '8px' }}>
        <div
          onClick={() => onNavigateToView?.('/dashboard/leaderboard/rankings')}
          style={{
            fontSize: '0.68rem',
            color: '#F59E0B',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '6px',
            marginBottom: '4px',
          }}
          data-testid="link-all-leaderboard-rankings"
        >
          🏆 Open Leaderboard Standings <ArrowRight size={11} />
        </div>
        <div
          onClick={() => onNavigateToView?.('/dashboard/leaderboard/tiers')}
          style={{
            fontSize: '0.68rem',
            color: '#C084FC',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(192, 132, 252, 0.08)',
            border: '1px solid rgba(192, 132, 252, 0.2)',
            borderRadius: '6px',
            marginBottom: '8px',
          }}
          data-testid="link-leaderboard-tiers"
        >
          🎖️ Tier Structure & Rules (L0–L5) <ArrowRight size={11} />
        </div>
      </div>

      {/* Header bar with Count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px 10px 8px',
        }}
      >
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#F59E0B',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Trophy size={12} color="#F59E0B" />
          Rankings ({sortedMembers.length})
        </span>
      </div>

      {/* ── Level 2 Sub-Items: Members with Turing IDs ───────────────── */}
      {sortedMembers.map((member, idx) => {
        const isSelected = selectedMemberId === member.id;
        const tierInfo = TIER_METADATA[member.currentTier];

        return (
          <div
            key={member.id}
            onClick={() => {
              onSelectMember?.(member.id, member.name);
              onNavigateToView?.(`/dashboard/leaderboard/${member.id}`);
            }}
            data-testid={`sidebar-member-${member.id}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(245, 158, 11, 0.15)' : '#070D18',
              border: isSelected ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.05)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    color:
                      idx === 0
                        ? '#F59E0B'
                        : idx === 1
                          ? '#94A3B8'
                          : idx === 2
                            ? '#B45309'
                            : '#64748B',
                  }}
                >
                  #{idx + 1}
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontFamily: 'monospace',
                    color: '#F59E0B',
                    background: 'rgba(245, 158, 11, 0.12)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  {member.currentTier}
                </span>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#F59E0B' }}>
                {member.meritXp.toLocaleString()} XP
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC' }}>
              {member.name}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: '#64748B',
              }}
            >
              <span>{member.currentRole}</span>
              <span style={{ color: '#94A3B8' }}>{member.departmentName}</span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarLeaderboardList;
