/**
 * CRM Agent Performance Dashboard
 * Agent metrics, rankings, and performance tracking
 * Route: /owner/crm/agents
 */

import React, { FC, useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Badge } from '../../components/ui';
import type { AppDispatch } from '../../store/store';
import {
  selectAllAgents,
  selectAgentsLoading,
  selectAllLeads,
  selectAllCommissions,
  fetchAgentsFromAPI,
} from '../../store/crmDataSlice';

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
  [key: string]: any;
}

// ─── Mock Agents (extend Redux data if sparse) ─────────────────────────

const MOCK_AGENTS: Agent[] = [
  {
    id: 1, name: 'Ahmed Al Rashid', email: 'ahmed@whitecaves.ae', phone: '+971 50 123 4567',
    role: 'Senior Agent', department: 'Luxury Sales', status: 'online',
    performance: 94, deals_closed: 18, revenue_generated: 45000000, leads_assigned: 32,
    conversion_rate: 56,
  },
  {
    id: 2, name: 'Fatima Hassan', email: 'fatima@whitecaves.ae', phone: '+971 55 234 5678',
    role: 'Sales Agent', department: 'Residential', status: 'online',
    performance: 88, deals_closed: 14, revenue_generated: 28000000, leads_assigned: 28,
    conversion_rate: 50,
  },
  {
    id: 3, name: 'Omar Khalid', email: 'omar@whitecaves.ae', phone: '+971 52 345 6789',
    role: 'Senior Agent', department: 'Commercial', status: 'busy',
    performance: 91, deals_closed: 12, revenue_generated: 52000000, leads_assigned: 20,
    conversion_rate: 60,
  },
  {
    id: 4, name: 'Sara Al Mansouri', email: 'sara@whitecaves.ae', phone: '+971 54 456 7890',
    role: 'Junior Agent', department: 'Residential', status: 'offline',
    performance: 72, deals_closed: 6, revenue_generated: 8500000, leads_assigned: 18,
    conversion_rate: 33,
  },
  {
    id: 5, name: 'Khalid Ibrahim', email: 'khalid@whitecaves.ae', phone: '+971 56 567 8901',
    role: 'Sales Agent', department: 'Off-Plan', status: 'online',
    performance: 85, deals_closed: 10, revenue_generated: 22000000, leads_assigned: 24,
    conversion_rate: 42,
  },
];

// ─── Styled Components ──────────────────────────────────────────────────

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
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
  color: #1a1a2e;
  margin: 0;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #3B82F6;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0;
  &:hover { text-decoration: underline; }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ $color: string }>`
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.25rem;
  border-left: 4px solid ${props => props.$color};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a2e;
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
  background: white;
  border: 1px solid ${props => props.$rank === 1 ? '#F59E0B' : props.$rank === 2 ? '#94A3B8' : props.$rank === 3 ? '#CD7F32' : '#e8e8e8'};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  ${props => props.$rank && props.$rank <= 3 && `
    &::before {
      content: '${props.$rank === 1 ? '🥇' : props.$rank === 2 ? '🥈' : '🥉'}';
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      font-size: 1.5rem;
    }
  `}

  &:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
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
  color: #1a1a2e;
`;

const AgentRole = styled.div`
  font-size: 0.78rem;
  color: #888;
`;

const StatusDot = styled.span<{ $status: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.35rem;
  background: ${props =>
    props.$status === 'online' ? '#10B981' :
    props.$status === 'busy' ? '#F59E0B' : '#94A3B8'
  };
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const MetricItem = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
`;

const MetricValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a2e;
`;

const MetricLabel = styled.div`
  font-size: 0.7rem;
  color: #888;
  margin-top: 0.15rem;
`;

const PerformanceBar = styled.div`
  margin-top: 1rem;
`;

const BarTrack = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
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
  color: #888;
  margin-bottom: 0.35rem;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
`;

const LTh = styled.th`
  background: #fafafa;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e8e8e8;
`;

const LTd = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #333;
  border-bottom: 1px solid #f5f5f5;
  vertical-align: middle;
`;

const LTr = styled.tr`
  &:hover { background: #f8f9ff; }
  &:last-child td { border-bottom: none; }
`;

// ─── Helpers ────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316',
];

const getInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : name.slice(0, 2).toUpperCase();
};

const getPerformanceColor = (score: number) => {
  if (score >= 90) return '#10B981';
  if (score >= 75) return '#3B82F6';
  if (score >= 60) return '#F59E0B';
  return '#EF4444';
};

const formatCurrency = (amount: number) => `AED ${(amount / 1000000).toFixed(1)}M`;

// ─── Component ──────────────────────────────────────────────────────────

const AgentPerformancePage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const reduxAgents = useSelector(selectAllAgents) as Agent[];
  const reduxLeads = useSelector(selectAllLeads);
  const reduxCommissions = useSelector(selectAllCommissions);
  const loading = useSelector(selectAgentsLoading);

  // Fetch agents from API on mount
  useEffect(() => {
    dispatch(fetchAgentsFromAPI());
  }, [dispatch]);

  // Merge Redux data with mock data
  const agents = useMemo(() => {
    if (reduxAgents.length > 0) return reduxAgents;
    return MOCK_AGENTS;
  }, [reduxAgents]);

  // Sort by performance
  const rankedAgents = useMemo(() => {
    return [...agents].sort((a, b) => (b.performance || 0) - (a.performance || 0));
  }, [agents]);

  // Team stats
  const teamStats = useMemo(() => {
    const totalDeals = agents.reduce((sum, a) => sum + (a.deals_closed || 0), 0);
    const totalRevenue = agents.reduce((sum, a) => sum + (a.revenue_generated || 0), 0);
    const avgPerformance = agents.length
      ? Math.round(agents.reduce((sum, a) => sum + (a.performance || 0), 0) / agents.length)
      : 0;
    const avgConversion = agents.length
      ? Math.round(agents.reduce((sum, a) => sum + (a.conversion_rate || 0), 0) / agents.length)
      : 0;
    const onlineCount = agents.filter(a => a.status === 'online').length;

    return { totalDeals, totalRevenue, avgPerformance, avgConversion, onlineCount, total: agents.length };
  }, [agents]);

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
          <span style={{ fontSize: '0.85rem', color: '#555' }}>
            {teamStats.onlineCount}/{teamStats.total} Online
          </span>
        </div>
      </PageHeader>

      {/* Loading State */}
      {loading && (
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#1D4ED8' }}>
          ⏳ Loading agent data from server...
        </div>
      )}

      {/* Team Stats */}
      <StatsRow>
        <StatCard $color="#3B82F6">
          <StatValue>{teamStats.total}</StatValue>
          <StatLabel>Total Agents</StatLabel>
        </StatCard>
        <StatCard $color="#10B981">
          <StatValue>{teamStats.totalDeals}</StatValue>
          <StatLabel>Total Deals Closed</StatLabel>
        </StatCard>
        <StatCard $color="#8B5CF6">
          <StatValue>{formatCurrency(teamStats.totalRevenue)}</StatValue>
          <StatLabel>Total Revenue</StatLabel>
        </StatCard>
        <StatCard $color="#F59E0B">
          <StatValue>{teamStats.avgPerformance}%</StatValue>
          <StatLabel>Avg Performance</StatLabel>
        </StatCard>
        <StatCard $color="#EC4899">
          <StatValue>{teamStats.avgConversion}%</StatValue>
          <StatLabel>Avg Conversion Rate</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Agent Cards */}
      <SectionTitle>🏆 Agent Rankings</SectionTitle>
      <AgentGrid>
        {rankedAgents.map((agent, idx) => (
          <AgentCard key={agent.id} $rank={idx + 1}>
            <AgentHeader>
              <Avatar $color={AVATAR_COLORS[idx % AVATAR_COLORS.length]}>
                {getInitials(agent.name || 'NA')}
              </Avatar>
              <AgentInfo>
                <AgentName>{agent.name}</AgentName>
                <AgentRole>
                  {agent.role} • {agent.department}
                </AgentRole>
                <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                  <StatusDot $status={agent.status || 'offline'} />
                  {agent.status === 'online' ? 'Online' : agent.status === 'busy' ? 'Busy' : 'Offline'}
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
                <span style={{ fontWeight: 600, color: getPerformanceColor(agent.performance || 0) }}>
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
        ))}
      </AgentGrid>

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
            {rankedAgents.map((agent, idx) => (
              <LTr key={agent.id}>
                <LTd style={{ fontWeight: 600, color: idx < 3 ? '#F59E0B' : '#888' }}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                </LTd>
                <LTd>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Avatar $color={AVATAR_COLORS[idx % AVATAR_COLORS.length]} style={{ width: 32, height: 32, fontSize: '0.7rem', borderRadius: 8 }}>
                      {getInitials(agent.name || 'NA')}
                    </Avatar>
                    <div>
                      <div style={{ fontWeight: 500 }}>{agent.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#888' }}>{agent.email}</div>
                    </div>
                  </div>
                </LTd>
                <LTd>{agent.department}</LTd>
                <LTd>
                  <Badge
                    variant={agent.status === 'online' ? 'success' : agent.status === 'busy' ? 'warning' : 'secondary'}
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
                  <span style={{
                    fontWeight: 700,
                    color: getPerformanceColor(agent.performance || 0),
                  }}>
                    {agent.performance || 0}%
                  </span>
                </LTd>
              </LTr>
            ))}
          </tbody>
        </LeaderboardTable>
      </div>
    </PageContainer>
  );
};

export default AgentPerformancePage;
