/**
 * CRM Agent Performance Dashboard
 * Agent metrics, rankings, and performance tracking
 * Route: /owner/crm/agents
 */

import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { formatCurrencyAbbreviated } from '../../utils';
import { Badge } from '../../components/ui';
import { useAgentPerformance } from '../../hooks/crm/useAgentPerformance';

// ─── Types ──────────────────────────────────────────────────────────────

interface Agent {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  status?: string;
  performance?: number;
  avatar?: string;
  deals_closed?: number;
  revenue_generated?: number;
  leads_assigned?: number;
  conversion_rate?: number;
  [key: string]: unknown;
}

// Mock data removed — all agent data is fetched from the API via Redux

// ─── Styled Components ──────────────────────────────────────────────────

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background: #0f0f0f;
  color: #ffffff;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #c9a84c;
  margin: 0;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #10b981;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0;
  &:hover {
    text-decoration: underline;
    color: #34d399;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ $color: string }>`
  background: #0f0f0f;
  border: 1px solid #c9a84c;
  border-radius: 12px;
  padding: 1.25rem;
  border-left: 4px solid ${props => props.$color};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #c9a84c;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AgentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
`;

const AgentCard = styled.div<{ $rank?: number }>`
  background: #0f0f0f;
  border: 1px solid
    ${props =>
      props.$rank === 1
        ? '#c9a84c'
        : props.$rank === 2
          ? '#94A3B8'
          : props.$rank === 3
            ? '#CD7F32'
            : 'rgba(201, 168, 76, 0.3)'};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  ${props =>
    props.$rank &&
    props.$rank <= 3 &&
    `
    &::before {
      content: '${props.$rank === 1 ? '🥇' : props.$rank === 2 ? '🥈' : '🥉'}';
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      font-size: 1.5rem;
    }
  `}

  &:hover {
    box-shadow: 0 4px 20px rgba(201, 168, 76, 0.15);
    transform: translateY(-2px);
  }
`;

const AgentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div<{ $color: string }>`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
`;

const AgentInfo = styled.div`
  flex: 1;
`;

const AgentName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
`;

const AgentRole = styled.div`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
`;

const StatusDot = styled.span<{ $status: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.35rem;
  background: ${props =>
    props.$status === 'online' ? '#10B981' : props.$status === 'busy' ? '#F59E0B' : '#94A3B8'};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const MetricItem = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
`;

const MetricValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
`;

const MetricLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.15rem;
`;

const PerformanceBar = styled.div`
  margin-top: 1rem;
`;

const BarTrack = styled.div`
  width: 100%;
  height: 8px;
  background: #2c2c2c;
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${props => props.$width}%;
  background: ${props => props.$color};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const BarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.35rem;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #0f0f0f;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #c9a84c;
`;

const LTh = styled.th`
  background: #1a1a1a;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 600;
  color: #c9a84c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(201, 168, 76, 0.3);
`;

const LTd = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid #2c2c2c;
  vertical-align: middle;
`;

const LTr = styled.tr`
  &:hover {
    background: rgba(201, 168, 76, 0.08);
  }
  &:last-child td {
    border-bottom: none;
  }
`;

// ─── Helpers ────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#c9a84c',
  '#10B981',
  '#c9a84c',
  '#10B981',
  '#c9a84c',
  '#10B981',
  '#c9a84c',
  '#10B981',
];

const getInitials = (name: string) => {
  const parts = name
    .trim()
    .split(' ')
    .filter(p => p.length > 0);
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : name.trim().slice(0, 2).toUpperCase() || '?';
};

const getPerformanceColor = (score: number) => {
  if (score >= 90) return '#10B981';
  if (score >= 75) return '#c9a84c';
  if (score >= 60) return '#e4b75e';
  return '#ef4444';
};

const formatCurrency = (amount: number) => formatCurrencyAbbreviated(amount);

// ─── Component ──────────────────────────────────────────────────────────

const AgentPerformancePage: FC = () => {
  const navigate = useNavigate();

  // All data fetching, ranking, stats & pagination handled by the hook
  const {
    agents,
    loading,
    teamStats,
    rankedAgents,
    paginatedAgents,
    currentPage,
    setCurrentPage,
    totalPages,
    agentsPerPage,
  } = useAgentPerformance();

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader>
        <div>
          <BackLink onClick={() => navigate('/owner/crm')}>← Back to CRM Hub</BackLink>
          <PageTitle>👥 Agent Performance Dashboard</PageTitle>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StatusDot $status="online" />
          <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            {teamStats.onlineCount}/{teamStats.total} Online
          </span>
        </div>
      </PageHeader>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 8,
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            color: '#10b981',
          }}
        >
          ⏳ Loading agent data from server...
        </div>
      )}

      {/* Team Stats */}
      <StatsRow>
        <StatCard $color="#c9a84c">
          <StatValue>{teamStats.total}</StatValue>
          <StatLabel>Total Agents</StatLabel>
        </StatCard>
        <StatCard $color="#10B981">
          <StatValue>{teamStats.totalDeals}</StatValue>
          <StatLabel>Total Deals Closed</StatLabel>
        </StatCard>
        <StatCard $color="#c9a84c">
          <StatValue>{formatCurrency(teamStats.totalRevenue)}</StatValue>
          <StatLabel>Total Revenue</StatLabel>
        </StatCard>
        <StatCard $color="#F59E0B">
          <StatValue>{teamStats.avgPerformance}%</StatValue>
          <StatLabel>Avg Performance</StatLabel>
        </StatCard>
        <StatCard $color="#10b981">
          <StatValue>{teamStats.avgConversion}%</StatValue>
          <StatLabel>Avg Conversion Rate</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Empty State */}
      {!loading && agents.length === 0 && (
        <div
          style={{
            background: 'rgba(201, 168, 76, 0.1)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            borderRadius: 12,
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
          <div style={{ fontWeight: 600, color: '#c9a84c', marginBottom: '0.25rem' }}>
            No Agents Found
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Agent data will appear here once agents are added to the system.
          </div>
        </div>
      )}

      {/* Agent Cards */}
      {agents.length > 0 && (
        <SectionTitle>
          🏆 Agent Rankings (Page {currentPage} of {totalPages})
        </SectionTitle>
      )}
      <AgentGrid>
        {paginatedAgents.map((agent, idx) => {
          const globalIdx = (currentPage - 1) * agentsPerPage + idx;
          return (
            <AgentCard key={agent.id} $rank={globalIdx + 1}>
              <AgentHeader>
                <Avatar $color={AVATAR_COLORS[globalIdx % AVATAR_COLORS.length]}>
                  {getInitials(agent.name || 'NA')}
                </Avatar>
                <AgentInfo>
                  <AgentName>{agent.name}</AgentName>
                  <AgentRole>
                    {agent.role} • {agent.department}
                  </AgentRole>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                    <StatusDot $status={agent.status || 'offline'} />
                    {agent.status === 'online'
                      ? 'Online'
                      : agent.status === 'busy'
                        ? 'Busy'
                        : 'Offline'}
                  </div>
                </AgentInfo>
              </AgentHeader>

              <MetricsGrid>
                <MetricItem>
                  <MetricValue>{agent.deals_closed || 0}</MetricValue>
                  <MetricLabel>Deals Closed</MetricLabel>
                </MetricItem>
                <MetricItem>
                  <MetricValue>{formatCurrency(agent.revenue_generated || 0)}</MetricValue>
                  <MetricLabel>Revenue</MetricLabel>
                </MetricItem>
                <MetricItem>
                  <MetricValue>{agent.leads_assigned || 0}</MetricValue>
                  <MetricLabel>Leads Assigned</MetricLabel>
                </MetricItem>
                <MetricItem>
                  <MetricValue>{agent.conversion_rate || 0}%</MetricValue>
                  <MetricLabel>Conversion</MetricLabel>
                </MetricItem>
              </MetricsGrid>

              <PerformanceBar>
                <BarLabel>
                  <span>Performance Score</span>
                  <span
                    style={{ fontWeight: 600, color: getPerformanceColor(agent.performance || 0) }}
                  >
                    {agent.performance || 0}%
                  </span>
                </BarLabel>
                <BarTrack>
                  <BarFill
                    $width={agent.performance || 0}
                    $color={getPerformanceColor(agent.performance || 0)}
                  />
                </BarTrack>
              </PerformanceBar>
            </AgentCard>
          );
        })}
      </AgentGrid>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            margin: '1.5rem 0',
          }}
        >
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: '1px solid #c9a84c',
              background: currentPage === 1 ? '#1a1a1a' : '#0f0f0f',
              color: currentPage === 1 ? 'rgba(255,255,255,0.3)' : '#c9a84c',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
            }}
          >
            ← Previous
          </button>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Page {currentPage} of {totalPages} ({rankedAgents.length} agents)
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: '1px solid #c9a84c',
              background: currentPage === totalPages ? '#1a1a1a' : '#0f0f0f',
              color: currentPage === totalPages ? 'rgba(255,255,255,0.3)' : '#c9a84c',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Leaderboard Table */}
      <SectionTitle>📊 Detailed Leaderboard</SectionTitle>
      <div style={{ overflowX: 'auto' }}>
        <LeaderboardTable>
          <thead>
            <tr>
              <LTh>#</LTh>
              <LTh>Agent</LTh>
              <LTh>Department</LTh>
              <LTh>Status</LTh>
              <LTh>Deals</LTh>
              <LTh>Revenue</LTh>
              <LTh>Leads</LTh>
              <LTh>Conversion</LTh>
              <LTh>Score</LTh>
            </tr>
          </thead>
          <tbody>
            {paginatedAgents.map((agent, idx) => {
              const globalIdx = (currentPage - 1) * agentsPerPage + idx;
              return (
                <LTr key={agent.id}>
                  <LTd
                    style={{
                      fontWeight: 600,
                      color: globalIdx < 3 ? '#c9a84c' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {globalIdx === 0
                      ? '🥇'
                      : globalIdx === 1
                        ? '🥈'
                        : globalIdx === 2
                          ? '🥉'
                          : `#${globalIdx + 1}`}
                  </LTd>
                  <LTd>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Avatar
                        $color={AVATAR_COLORS[globalIdx % AVATAR_COLORS.length]}
                        style={{ width: 32, height: 32, fontSize: '0.7rem', borderRadius: 8 }}
                      >
                        {getInitials(agent.name || 'NA')}
                      </Avatar>
                      <div>
                        <div style={{ fontWeight: 500 }}>{agent.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                          {agent.email}
                        </div>
                      </div>
                    </div>
                  </LTd>
                  <LTd>{agent.department}</LTd>
                  <LTd>
                    <Badge
                      variant={
                        agent.status === 'online'
                          ? 'success'
                          : agent.status === 'busy'
                            ? 'warning'
                            : 'secondary'
                      }
                      size="small"
                    >
                      {agent.status}
                    </Badge>
                  </LTd>
                  <LTd style={{ fontWeight: 600 }}>{agent.deals_closed || 0}</LTd>
                  <LTd>{formatCurrency(agent.revenue_generated || 0)}</LTd>
                  <LTd>{agent.leads_assigned || 0}</LTd>
                  <LTd>{agent.conversion_rate || 0}%</LTd>
                  <LTd>
                    <span
                      style={{
                        fontWeight: 700,
                        color: getPerformanceColor(agent.performance || 0),
                      }}
                    >
                      {agent.performance || 0}%
                    </span>
                  </LTd>
                </LTr>
              );
            })}
          </tbody>
        </LeaderboardTable>
      </div>
    </PageContainer>
  );
};

export default AgentPerformancePage;
