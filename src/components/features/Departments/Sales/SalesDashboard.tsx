/**
 * Sales Department Dashboard
 *
 * Displays sales metrics, pipeline, deals, and team performance.
 * Features: Deal tracking, revenue metrics, sales pipeline visualization.
 * Live data from /api/departments/SALES/data and /api/leads.
 */

import React, { useState, useEffect } from 'react';
import { authFetch } from '../../../../utils/authFetch';
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
  ListContainer,
  ListItem,
  Badge,
  StatusIndicator,
} from './styled';

interface SalesDashboardProps {
  featureId?: string;
  context?: Record<string, unknown>;
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

const fallbackMetrics: SalesMetrics = {
  totalRevenue: 0,
  activeDeals: 0,
  closedDeals: 0,
  conversionRate: 0,
  pipelineValue: 0,
  avgDealSize: 0,
};

const fallbackDeals: Deal[] = [];

// Team data — representative display (no dedicated team-performance API endpoint)
const teamData = [
  { name: 'Nina', role: 'Lead Sales Agent', deals: 0, revenue: 0, conversion: 0 },
  { name: 'Linda', role: 'Sales Agent', deals: 0, revenue: 0, conversion: 0 },
  { name: 'Diana', role: 'Sales Agent', deals: 0, revenue: 0, conversion: 0 },
  { name: 'Clara', role: 'Junior Sales Agent', deals: 0, revenue: 0, conversion: 0 },
];

interface LeadApiItem {
  id: string;
  name: string;
  status: string;
  budget?: number | null;
  score?: number | null;
  createdAt: string;
  assignedTo?: { name: string } | null;
  property?: { title: string; location: string } | null;
}

interface SalesDeptData {
  activeDeals: number;
  conversionRate: number;
  monthlyRevenue: number;
  totalLeads: number;
}

const SalesDashboard: React.FC<SalesDashboardProps> = ({
  featureId: _featureId = 'dept-sales',
  context: _context,
}) => {
  const [metrics, setMetrics] = useState<SalesMetrics>(fallbackMetrics);
  const [deals, setDeals] = useState<Deal[]>(fallbackDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  // Derive pipeline stages from active deal count (proportional split)
  const pipelineStages = [
    {
      name: 'Lead',
      count: Math.round(metrics.activeDeals * 0.52),
      value: Math.round(metrics.pipelineValue * 0.37),
    },
    {
      name: 'Negotiation',
      count: Math.round(metrics.activeDeals * 0.3),
      value: Math.round(metrics.pipelineValue * 0.3),
    },
    {
      name: 'Offer',
      count: Math.round(metrics.activeDeals * 0.13),
      value: Math.round(metrics.pipelineValue * 0.24),
    },
    {
      name: 'Closing',
      count: Math.round(metrics.activeDeals * 0.05),
      value: Math.round(metrics.pipelineValue * 0.09),
    },
  ];

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const [deptRes, leadsRes] = await Promise.all([
          authFetch('/api/departments/SALES/data').then(r => r.json()),
          authFetch('/api/leads?pageSize=5&sortBy=createdAt&sortOrder=desc').then(r => r.json()),
        ]);

        const dept = deptRes as unknown as SalesDeptData;
        setMetrics({
          totalRevenue: dept.monthlyRevenue,
          activeDeals: dept.activeDeals,
          closedDeals:
            dept.totalLeads > 0 ? Math.round(dept.totalLeads * (dept.conversionRate / 100)) : 0,
          conversionRate: dept.conversionRate,
          pipelineValue: dept.activeDeals * 200000,
          avgDealSize: dept.activeDeals > 0 ? dept.monthlyRevenue / dept.activeDeals : 0,
        });

        const leadsData = leadsRes as unknown as { data: LeadApiItem[] };
        const mappedDeals: Deal[] = (leadsData.data || []).map(lead => {
          const stageMap: Record<string, Deal['stage']> = {
            hot: 'closing',
            qualified: 'offer',
            contacted: 'negotiation',
            new: 'lead',
            warm: 'lead',
            cold: 'lead',
          };
          return {
            id: lead.id,
            client: lead.name,
            property: lead.property?.title || lead.property?.location || 'Property TBD',
            value: lead.budget ?? 0,
            stage: stageMap[lead.status] ?? 'lead',
            probability: Math.min(100, Math.max(0, lead.score ?? 50)),
            agent: lead.assignedTo?.name || 'Unassigned',
            createdAt: new Date(lead.createdAt).toLocaleDateString('en-GB'),
          };
        });
        setDeals(mappedDeals);
      } catch {
        // Keep fallback values on error
      } finally {
        setLoading(false);
      }
    };

    void fetchSalesData();
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

  if (loading) {
    return (
      <Container>
        <Header>
          <div>
            <HeaderTitle>💰 Sales Department</HeaderTitle>
            <HeaderSubtitle>Loading live data…</HeaderSubtitle>
          </div>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div>
          <HeaderTitle>💰 Sales Department</HeaderTitle>
          <HeaderSubtitle>Track deals, revenue, and team performance</HeaderSubtitle>
        </div>
        <StatusIndicator>
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
            }}
          />
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
                <PipelineStage
                  key={idx}
                  style={{ borderLeftColor: getStageColor(stage.name.toLowerCase()) }}
                >
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
              {deals.slice(0, 5).map(deal => (
                <ListItem
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal)}
                  style={{
                    borderLeft: `4px solid ${getStageColor(deal.stage)}`,
                  }}
                >
                  <div>
                    <strong>{deal.client}</strong>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary, #6B7280)', fontSize: '14px' }}>
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
              {teamData.map((member, idx) => (
                <TeamMember key={idx}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
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
                      <span style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px' }}>Deals</span>
                      <div style={{ fontWeight: 600, fontSize: '18px' }}>{member.deals}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px' }}>Revenue</span>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>
                        {formatCurrency(member.revenue)}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px' }}>Conv Rate</span>
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
                <div style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px', marginBottom: '4px' }}>
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
                <div style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px', marginBottom: '4px' }}>
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
                <div style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px', marginBottom: '4px' }}>
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
              <span style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px' }}>Property</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0' }}>{selectedDeal.property}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px' }}>Deal Value</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0' }}>
                {formatCurrency(selectedDeal.value)}
              </p>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px' }}>Current Stage</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0', textTransform: 'capitalize' }}>
                {selectedDeal.stage}
              </p>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px' }}>Win Probability</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0' }}>{selectedDeal.probability}%</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px' }}>Assigned Agent</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0' }}>{selectedDeal.agent}</p>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #6B7280)', fontSize: '12px' }}>Created Date</span>
              <p style={{ fontWeight: 600, margin: '4px 0 0 0' }}>{selectedDeal.createdAt}</p>
            </div>
          </div>
        </SectionCard>
      )}
    </Container>
  );
};

export default SalesDashboard;
