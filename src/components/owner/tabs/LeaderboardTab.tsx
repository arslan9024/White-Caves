import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, typography, media } from '@/design-tokens';
// import removed

interface Agent {
  id: string;
  name: string;
  rank: number;
  deals: number;
  revenue: number;
  satisfaction: number;
  badge?: string;
  milestoneBadge?: string;
  voucherRewardAed?: number;
  uncappedRateLock?: number;
}

interface LeaderboardTabProps {
  data?: {
    agents?: Agent[];
    period?: string;
  };
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

// ─── Styled Components ───────────────────────────────────────────

const Container = styled.div`
  padding: ${spacing[6]};
  color: ${colors.text.primary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[6]};

  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing[2]};
  }
`;

const Title = styled.h2`
  margin: 0;
  ${typography.presets.heading2};
  color: ${colors.primary[400]};
`;

const PeriodBadge = styled.span`
  background: rgba(212, 175, 55, 0.15);
  color: ${colors.primary[400]};
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 20px;
  padding: 4px 14px;
  ${typography.presets.bodySmall};
`;

const TabToggle = styled.div`
  display: flex;
  gap: ${spacing[2]};
  margin-bottom: ${spacing[6]};
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: ${borderRadius.lg};
  border: 1px solid ${colors.border.default};
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${spacing[3]} ${spacing[4]};
  border-radius: ${borderRadius.md};
  border: none;
  background: ${({ $active }) =>
    $active ? 'linear-gradient(135deg, #c9a84c, #e4b75e)' : 'transparent'};
  color: ${({ $active }) => ($active ? '#1f1300' : colors.text.secondary)};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ $active }) => ($active ? '#1f1300' : '#fff')};
  }
`;

const AgentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`;

const AgentRow = styled.div<{ $isTop3: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  background: ${({ $isTop3 }) =>
    $isTop3 ? 'rgba(212, 175, 55, 0.08)' : colors.background.surface};
  border: 1px solid
    ${({ $isTop3 }) => ($isTop3 ? 'rgba(212, 175, 55, 0.25)' : colors.border.default)};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[4]} ${spacing[5]};
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  ${media.sm} {
    flex-wrap: wrap;
    gap: ${spacing[2]};
    padding: ${spacing[3]};
  }
`;

const RankBadge = styled.span`
  font-size: 1.5rem;
  min-width: 36px;
  text-align: center;
`;

const AgentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const AgentName = styled.div`
  font-weight: 600;
  color: ${colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

const RewardPill = styled.span<{ $type?: 'voucher' | 'lock' }>`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${({ $type }) =>
    $type === 'lock' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(34, 197, 94, 0.2)'};
  color: ${({ $type }) => ($type === 'lock' ? '#c084fc' : '#4ade80')};
  border: 1px solid
    ${({ $type }) => ($type === 'lock' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(34, 197, 94, 0.4)')};
`;

const AgentBadge = styled.div`
  ${typography.presets.bodySmall};
  color: ${colors.primary[400]};
  margin-top: 2px;
`;

const StatsBlock = styled.div`
  text-align: right;

  ${media.sm} {
    text-align: left;
  }
`;

const DealCount = styled.div`
  color: ${colors.primary[400]};
  font-weight: 700;
`;

const RevenueText = styled.div`
  color: ${colors.text.secondary};
  ${typography.presets.bodySmall};
`;

interface TrackLeaderboardItem {
  id: string;
  name: string;
  unitsTransacted: number;
  gwcRevenue: number;
  tier: string;
  milestoneBadge?: string;
  voucherRewardAed?: number;
  uncappedRateLock?: boolean | number;
  commissionCapWaived?: boolean;
}

// ─── Component ───────────────────────────────────────────────────

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ data }) => {
  const [activeTrack, setActiveTrack] = useState<'sales' | 'leasing'>('sales');
  const dualTrack: any = {
    trackASales: [
      { id: '1', name: 'Agent 1', unitsTransacted: 5, gwcRevenue: 500000, tier: 'gold', milestoneBadge: 'top_performer' }
    ],
    trackBLeasing: [
      { id: '2', name: 'Agent 2', unitsTransacted: 10, gwcRevenue: 100000, tier: 'silver', milestoneBadge: 'fast_leaser' }
    ]
  };
  const period = data?.period ?? 'July 2026';

  const currentList: Agent[] =
    activeTrack === 'sales'
      ? dualTrack.trackASales.map((item: TrackLeaderboardItem, idx: number) => ({
          id: item.id,
          name: item.name,
          rank: idx + 1,
          deals: item.unitsTransacted,
          revenue: item.gwcRevenue,
          satisfaction: 99,
          badge: item.tier,
          milestoneBadge: item.milestoneBadge,
          voucherRewardAed: item.voucherRewardAed,
          uncappedRateLock: Boolean(item.uncappedRateLock),
        }))
      : dualTrack.trackBLeasing.map((item: TrackLeaderboardItem, idx: number) => ({
          id: item.id,
          name: item.name,
          rank: idx + 1,
          deals: item.unitsTransacted,
          revenue: item.gwcRevenue,
          satisfaction: 98,
          badge: item.tier,
          milestoneBadge: item.milestoneBadge,
        }));

  return (
    <Container>
      <Header>
        <Title>🏆 White Caves Apex Champions Leaderboard</Title>
        <PeriodBadge>{period}</PeriodBadge>
      </Header>

      <TabToggle>
        <ToggleButton $active={activeTrack === 'sales'} onClick={() => setActiveTrack('sales')}>
          🥇 Track A: Sales Elite (GWC Revenue)
        </ToggleButton>
        <ToggleButton $active={activeTrack === 'leasing'} onClick={() => setActiveTrack('leasing')}>
          🔑 Track B: Leasing Volume (Unit Density)
        </ToggleButton>
      </TabToggle>

      <AgentList role="list" aria-label="Agent leaderboard rankings">
        {currentList.map(agent => (
          <AgentRow
            key={agent.id}
            $isTop3={agent.rank <= 3}
            role="listitem"
            aria-label={`Rank ${agent.rank}: ${agent.name}, ${agent.deals} deals, ${agent.revenue} AED`}
          >
            <RankBadge aria-hidden="true">{MEDAL[agent.rank] ?? `#${agent.rank}`}</RankBadge>
            <AgentInfo>
              <AgentName>
                {agent.name}
                {agent.voucherRewardAed && (
                  <RewardPill $type="voucher">
                    AED {agent.voucherRewardAed.toLocaleString()} Voucher
                  </RewardPill>
                )}
                {agent.uncappedRateLock && (
                  <RewardPill $type="lock">
                    {(agent.uncappedRateLock * 100).toFixed(0)}% Chairman Lock
                  </RewardPill>
                )}
              </AgentName>
              <AgentBadge>
                {agent.badge} {agent.milestoneBadge ? `· ${agent.milestoneBadge}` : ''}
              </AgentBadge>
            </AgentInfo>
            <StatsBlock>
              <DealCount>{agent.deals} Units</DealCount>
              <RevenueText>AED {agent.revenue.toLocaleString()}</RevenueText>
            </StatsBlock>
          </AgentRow>
        ))}
      </AgentList>
    </Container>
  );
};

export default LeaderboardTab;
