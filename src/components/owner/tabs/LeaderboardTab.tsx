import React from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, typography, media } from '@/design-tokens';

interface Agent {
  id: string;
  name: string;
  rank: number;
  deals: number;
  revenue: number;
  satisfaction: number;
  badge?: string;
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing[8]};
  color: ${colors.text.disabled};
  background: ${colors.background.surface};
  border-radius: ${borderRadius.lg};
  border: 1px dashed ${colors.border.default};
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

const SatisfactionPill = styled.div`
  min-width: 50px;
  text-align: center;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border-radius: ${borderRadius.md};
  padding: 4px 8px;
  ${typography.presets.bodySmall};
  font-weight: 600;
`;

// ─── Component ───────────────────────────────────────────────────

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ data }) => {
  const agents = data?.agents ?? [];
  const period = data?.period ?? 'This Month';

  return (
    <Container>
      <Header>
        <Title>🏆 Agent Leaderboard</Title>
        <PeriodBadge>{period}</PeriodBadge>
      </Header>

      {agents.length === 0 ? (
        <EmptyState>
          <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>🏆</p>
          <p>No leaderboard data available yet</p>
        </EmptyState>
      ) : (
        <AgentList role="list" aria-label="Agent leaderboard rankings">
          {agents
            .sort((a, b) => a.rank - b.rank)
            .map(agent => (
              <AgentRow
                key={agent.id}
                $isTop3={agent.rank <= 3}
                role="listitem"
                aria-label={`Rank ${agent.rank}: ${agent.name}, ${agent.deals} deals, ${agent.satisfaction}% satisfaction`}
              >
                <RankBadge aria-hidden="true">{MEDAL[agent.rank] ?? `#${agent.rank}`}</RankBadge>
                <AgentInfo>
                  <AgentName>{agent.name}</AgentName>
                  {agent.badge && <AgentBadge>{agent.badge}</AgentBadge>}
                </AgentInfo>
                <StatsBlock>
                  <DealCount>{agent.deals} Deals</DealCount>
                  <RevenueText>AED {agent.revenue.toLocaleString()}</RevenueText>
                </StatsBlock>
                <SatisfactionPill>{agent.satisfaction}%</SatisfactionPill>
              </AgentRow>
            ))}
        </AgentList>
      )}
    </Container>
  );
};

export default LeaderboardTab;
