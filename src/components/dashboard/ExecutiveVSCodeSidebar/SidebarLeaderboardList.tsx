/**
 * White Caves Real Estate LLC - Sidebar Leaderboard List
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Component)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Trophy, Award, Sparkles, ChevronRight, Crown } from 'lucide-react';
import { INITIAL_LEADERBOARD_DATA } from '../../crm/Leaderboard/Leaderboard.data';
import { TIER_METADATA } from '../../crm/Leaderboard/Leaderboard.config';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

interface SidebarLeaderboardListProps {
  filterQuery?: string;
  selectedMemberId?: string | null;
  onSelectMember?: (id: string, name: string) => void;
}

export const SidebarLeaderboardList: FC<SidebarLeaderboardListProps> = ({
  filterQuery = '',
  selectedMemberId,
  onSelectMember,
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
          Merit Rankings ({sortedMembers.length})
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {sortedMembers.map((member, index) => {
          const isSelected = selectedMemberId === member.id;
          const tierMeta = TIER_METADATA[member.currentTier];
          const isGold = index === 0;

          return (
            <div
              key={member.id}
              onClick={() => onSelectMember?.(member.id, member.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                borderRadius: '6px',
                background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                border: isSelected
                  ? '1px solid rgba(245, 158, 11, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Rank */}
              <div
                style={{
                  width: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: isGold ? '#F59E0B' : '#94A3B8',
                }}
              >
                {isGold ? <Crown size={12} color="#F59E0B" /> : `#${index + 1}`}
              </div>

              {/* Avatar */}
              <img
                src={member.avatar}
                alt={member.name}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: isGold ? '1.5px solid #F59E0B' : '1px solid #475569',
                }}
              />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#F8FAFC',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {member.name}
                  </span>
                  {member.promotionStatus === 'ELIGIBLE' && <Sparkles size={10} color="#10B981" />}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.64rem',
                    color: '#94A3B8',
                  }}
                >
                  <span
                    style={{
                      padding: '0.5px 3px',
                      borderRadius: '3px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      fontWeight: 700,
                      color: isGold ? '#FCD34D' : '#CBD5E1',
                    }}
                  >
                    {tierMeta.tier}
                  </span>
                  <span>•</span>
                  <span>{member.meritXp.toLocaleString()} XP</span>
                </div>
              </div>

              <ChevronRight size={12} color="#64748B" />
            </div>
          );
        })}
      </div>
    </SidebarListWrapper>
  );
};
