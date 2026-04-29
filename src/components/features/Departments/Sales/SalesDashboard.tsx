/**
 * Sales Department Dashboard
 * 
 * Displays sales metrics, pipeline, deals, and team performance
 * Features: Deal tracking, revenue metrics, sales pipeline visualization
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  HeaderTitle,
  HeaderSubtitle,
  MetricsGrid,
  MetricCard,
  MetricValue,
  MetricLabel,
  MetricChange,
  MainContent,
  LeftColumn,
  RightColumn,
  SectionCard,
  SectionTitle,
  TeamGrid,
  TeamMember,
  TeamMemberName,
  TeamMemberRole,
  TeamMemberStats,
  PipelineContainer,
  PipelineStage,
  PipelineStageName,
  PipelineCount,
  PipelineValue,
  ChartContainer,
  ListContainer,
  ListItem,
  Badge,
  BadgeSuccess,
  BadgeWarning,
  BadgeDanger,
  StatusIndicator,
} from './styled';

interface SalesDashboardProps {
  featureId?: string;
  context?: any;
}

interface Deal {
  id: string;
  client: string;
  property: string;
  value: number;
  stage: 'lead' | 'negotiation' | 'offer' | 'closing';
  probability: number;
  agent: string;
  createdAt: string;
}

interface SalesMetrics {
  totalRevenue: number;
  activeDeals: number;
  closedDeals: number;
  conversionRate: number;
  pipelineValue: number;
  avgDealSize: number;
}

const mockMetrics: SalesMetrics = {
  totalRevenue: 2450000,
  activeDeals: 23,
  closedDeals: 12,
  conversionRate: 52.2,
  pipelineValue: 4850000,
  avgDealSize: 202083,
};

const mockDeals: Deal[] = [
  {
    id: '1',
    client: 'Ahmed Al Mansouri',
    property: 'Damac Hills 2 - Villa',
    value: 850000,
    stage: 'negotiation',
    probability: 75,
    agent: 'Nina',
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    client: 'Fatima Al Zahra',
    property: 'Downtown Dubai - Apt',
    value: 650000,
    stage: 'offer',
    probability: 90,
    agent: 'Linda',
    createdAt: '2026-01-12',
  },
  {
    id: '3',
    client: 'Mohammed Al Qasimi',
    property: 'Emirates Hills - Penthouse',
    value: 1200000,
    stage: 'lead',
    probability: 35,
    agent: 'Nina',
    createdAt: '2026-01-18',
  },
  {
    id: '4',
    client: 'Layla Al Mansoori',
    property: 'Business Bay - Office',
    value: 450000,
    stage: 'closing',
    probability: 99,
    agent: 'Diana',
    createdAt: '2026-01-08',
  },
  {
    id: '5',
    client: 'Hassan Al Mazroui',
    property: 'Palm Jumeirah - Villa',
    value: 920000,
    stage: 'negotiation',
    probability: 68,
    agent: 'Clara',
    createdAt: '2026-01-14',
  },
];

const mockTeam = [
  {
    name: 'Nina',
    role: 'Lead Sales Agent',
    deals: 8,
    revenue: 620000,
    conversion: 65,
  },
  {
    name: 'Linda',
    role: 'Sales Agent',
    deals: 6,
    revenue: 480000,
    conversion: 54,
  },
  {
    name: 'Diana',
    role: 'Sales Agent',
    deals: 5,
    revenue: 390000,
    conversion: 48,
  },
  {
    name: 'Clara',
    role: 'Junior Sales Agent',
    deals: 3,
    revenue: 280000,
    conversion: 38,
  },
];

const pipelineStages = [
  { name: 'Lead', count: 12, value: 1800000 },
  { name: 'Negotiation', count: 7, value: 1450000 },
  { name: 'Offer', count: 3, value: 1150000 },
  { name: 'Closing', count: 1, value: 450000 },
];

const SalesDashboard: React.FC<SalesDashboardProps> = ({
  featureId = 'dept-sales',
  context,
}) => {
  const [metrics, setMetrics] = useState<SalesMetrics>(mockMetrics);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    // TODO: Fetch real data from API
    // const fetchMetrics = async () => {
    //   const res = await fetch('/api/sales/metrics');
    //   const data = await res.json();
    //   setMetrics(data);
    // };
    // fetchMetrics();
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead':
        return '#3B82F6'; // Blue
      case 'negotiation':
        return '#F59E0B'; // Amber
      case 'offer':
        return '#8B5CF6'; // Purple
      case 'closing':
        return '#10B981'; // Green
      default:
        return '#6B7280';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Container>
      <Header>
        <div>
          <HeaderTitle>💰 Sales Department</HeaderTitle>
          <HeaderSubtitle>Track deals, revenue, and team performance</HeaderSubtitle>
        </div>
        <StatusIndicator>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          Active
        </StatusIndicator>
      </Header>

      {/* Key Metrics */}
      <MetricsGrid>
        <MetricCard>
          <MetricLabel>Total Revenue (YTD)</MetricLabel>
          <MetricValue>{formatCurrency(metrics.totalRevenue)}</MetricValue>
          <MetricChange positive>↑ 12.5% from last month</MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Active Deals</MetricLabel>
          <MetricValue>{metrics.activeDeals}</MetricValue>
          <MetricChange positive>↑ 3 from last week</MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Conversion Rate</MetricLabel>
          <MetricValue>{metrics.conversionRate}%</MetricValue>
          <MetricChange>Target: 55%</MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricLabel>Pipeline Value</MetricLabel>
          <MetricValue>{formatCurrency(metrics.pipelineValue)}</MetricValue>
          <MetricChange positive>↑ 8.3% growth</MetricChange>
        </MetricCard>
      </MetricsGrid>

      {/* Main Content */}
      <MainContent>
        <LeftColumn>
          {/* Sales Pipeline */}
          <SectionCard>
            <SectionTitle>📊 Sales Pipeline</SectionTitle>
            <PipelineContainer>
              {pipelineStages.map((stage, idx) => (
                <PipelineStage key={idx} style={{ borderLeftColor: getStageColor(stage.name.toLowerCase()) }}>
                  <PipelineStageName>{stage.name}</PipelineStageName>
                  <PipelineCount>{stage.count} deals</PipelineCount>
                  <PipelineValue>{formatCurrency(stage.value)}</PipelineValue>
                </PipelineStage>
              ))}
            </PipelineContainer>
          </SectionCard>

          {/* Recent Deals */}
          <SectionCard>
            <SectionTitle>🤝 Recent Deals</SectionTitle>
            <ListContainer>
              {deals.slice(0, 5).map((deal) => (
                <ListItem
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal)}
                  style={{
                    borderLeft: `4px solid ${getStageColor(deal.stage)}`,
                  }}
                >
                  <div>
                    <strong>{deal.client}</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
                      {deal.property}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      {formatCurrency(deal.value)}
                    </div>
                    <Badge
                      style={{
                        backgroundColor:
                          deal.probability > 80
                            ? '#D1FAE5'
                            : deal.probability > 50
                              ? '#FEF3C7'
                              : '#FEE2E2',
                        color:
                          deal.probability > 80
                            ? '#065F46'
                            : deal.probability > 50
                              ? '#92400E'
                              : '#991B1B',
                      }}
                    >
                      {deal.probability}% chance
                    </Badge>
                  </div>
                </ListItem>
              ))}
            </ListContainer>
          </SectionCard>
        </LeftColumn>

        <RightColumn>
          {/* Team Performance */}
          <SectionCard>
            <SectionTitle>👥 Team Performance</SectionTitle>
            <TeamGrid>
              {mockTeam.map((member, idx) => (
                <TeamMember key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <TeamMemberName>{member.name}</TeamMemberName>
                      <TeamMemberRole>{member.role}</TeamMemberRole>
                    </div>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#3B82F6',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 700,
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <TeamMemberStats>
                    <div>
                      <span style={{ color: '#6B7280', fontSize: '12px' }}>Deals</span>
                      <div style={{ fontWeight: 600, fontSize: '18px' }}>{member.deals}</div>
                    </div>
                    <div>
                      <span style={{ color: '#6B7280', fontSize: '12px' }}>Revenue</span>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>
                        {formatCurrency(member.revenue)}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#6B7280', fontSize: '12px' }}>Conv Rate</span>
                      <div style={{ fontWeight: 600, fontSize: '18px' }}>{member.conversion}%</div>
                    </div>
                  </TeamMemberStats>
                </TeamMember>
              ))}
            </TeamGrid>
          </SectionCard>

          {/* Quick Stats */}
          <SectionCard>
            <SectionTitle>📈 Quick Stats</SectionTitle>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#F0F9FF',
                  borderRadius: '8px',
                  borderLeft: '4px solid #3B82F6',
                }}
              >
                <div style={{ color: '#6B7280', fontSize: '12px', marginBottom: '4px' }}>
                  Closed Deals This Month
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{metrics.closedDeals}</div>
              </div>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#F7FEE7',
                  borderRadius: '8px',
                  borderLeft: '4px solid #10B981',
                }}
              >
                <div style={{ color: '#6B7280', fontSize: '12px', marginBottom: '4px' }}>
                  Avg Deal Size
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>
                  {formatCurrency(metrics.avgDealSize)}
                </div>
              </div>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#FCE4E6',
                  borderRadius: '8px',
                  borderLeft: '4px solid #EF4444',
                }}
              >
                <div style={{ color: '#6B7280', fontSize: '12px', marginBottom: '4px' }}>
                  Win Probability Avg
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>62%</div>
              </div>
            </div>
          </SectionCard>
        </RightColumn>
      </MainContent>

      {/* Deal Detail Modal (if needed) */}
      {selectedDeal && (
        <SectionCard
          style={{
            marginTop: '24px',
            backgroundColor: '#F9FAFB',
            borderLeft: `4px solid ${getStageColor(selectedDeal.stage)}`,
          }}
        >
          <SectionTitle>Deal Details: {selectedDeal.client}</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Property</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0' }}>{selectedDeal.property}</p>
            </div>
            <div>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Deal Value</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0' }}>
                {formatCurrency(selectedDeal.value)}
              </p>
            </div>
            <div>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Current Stage</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0', textTransform: 'capitalize' }}>
                {selectedDeal.stage}
              </p>
            </div>
            <div>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Win Probability</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0' }}>{selectedDeal.probability}%</p>
            </div>
            <div>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Assigned Agent</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0' }}>{selectedDeal.agent}</p>
            </div>
            <div>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Created Date</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0' }}>{selectedDeal.createdAt}</p>
            </div>
          </div>
        </SectionCard>
      )}
    </Container>
  );
};

export default SalesDashboard;
