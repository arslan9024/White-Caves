import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useUserProfile } from '../../hooks/useUserProfile';
import { KPICard, ModuleCard } from '../../components/dashboard/DashboardComponents';
import { dubaiFinanceEngine } from '../../mocks/dubaiFinanceEngine';
import { colors, spacing, typography, borderRadius, shadows } from '../../design-tokens';
import { CRM_MODULE_REGISTRY } from '../../config/crmModuleRegistry';
import { useNavigate } from 'react-router-dom';
import LeaderboardTab from '../../components/owner/tabs/LeaderboardTab';

const CockpitLayout = styled.div`
  min-height: 100vh;
  background: #0f0f0f;
  color: #ffffff;
`;

const MainContent = styled.main`
  padding: ${spacing[6]};
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[6]};

  h1 {
    margin: 0;
    font-size: 2rem;
    color: #c9a84c;
  }
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${spacing[4]};
  margin-bottom: ${spacing[8]};

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GridSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${spacing[6]};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #0f0f0f;
  border: 1px solid #c9a84c;
  border-radius: ${borderRadius.lg};
  padding: ${spacing[6]};
  box-shadow: 0 4px 12px rgba(201, 168, 76, 0.15);
  color: #ffffff;

  h2 {
    margin-top: 0;
    margin-bottom: ${spacing[4]};
    font-size: 1.25rem;
    color: #c9a84c;
  }
`;

const AIChatArea = styled.div`
  height: 300px;
  background: #191919;
  border-radius: ${borderRadius.md};
  border: 1px solid #c9a84c;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${spacing[4]};
`;

const AIInput = styled.input`
  width: 100%;
  padding: ${spacing[3]};
  border: 1px solid #c9a84c;
  border-radius: ${borderRadius.md};
  margin-top: ${spacing[4]};
  background: #0f0f0f;
  color: #ffffff;
  &:focus {
    outline: none;
    border-color: #10b981;
  }
`;

export const UnifiedDashboardPage: FC = () => {
  useDocumentTitle('Founder Flight Deck | White Caves');
  const { user } = useUserProfile();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [telemetry, setTelemetry] = useState<any>(null);

  useEffect(() => {
    // Local calculation from Dubai Finance Engine mock
    setMetrics(dubaiFinanceEngine.getGlobalMetrics());
    setLeaderboard(dubaiFinanceEngine.getLeaderboard());
    setTelemetry(dubaiFinanceEngine.getAITelemetry());
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <CockpitLayout>
      <MainContent>
        <Header>
          <div>
            <h1>Welcome, {user?.name || 'Executive'}</h1>
            <p style={{ color: colors.text.secondary }}>
              {new Date().toLocaleDateString('en-AE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            style={{
              background: '#C9A84C',
              color: '#111',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
            }}
          >
            Generate Report
          </button>
        </Header>

        {metrics && (
          <KPIGrid>
            <KPICard
              id="rev"
              icon="💰"
              label="Global Revenue"
              value={formatCurrency(metrics.monthlyRevenue)}
              subtext="This Month"
              trend={metrics.dubaiMarketTrend}
              positive
            />
            <KPICard
              id="leads"
              icon="🎯"
              label="Active Pipeline"
              value={metrics.activeLeads}
              subtext={`${metrics.hotLeads} Hot Leads`}
              trend="High Volume"
              positive
            />
            <KPICard
              id="agents"
              icon="👥"
              label="Field Agents"
              value={metrics.agentsOnline}
              subtext="Online Now"
              trend="Optimized"
              positive
            />
            <KPICard
              id="contracts"
              icon="📋"
              label="Contracts Executing"
              value={metrics.contractsInExecution}
              subtext="Pending Signatures"
            />
            <KPICard
              id="compliance"
              icon="🛡️"
              label="Legal Compliance"
              value="Secure"
              subtext={metrics.complianceStatus}
              trend="Audit Passed"
              positive
            />
          </KPIGrid>
        )}

        <div style={{ marginBottom: spacing[8] }}>
          <h2 style={{ fontSize: '1.25rem', color: colors.text.primary, marginBottom: spacing[4] }}>
            Strategic Operations
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: spacing[4],
            }}
          >
            <ModuleCard
              id="form7"
              label="Form 7 (Buyer Agreement)"
              description="Manage exclusive buyer agency agreements and DLD verifications."
              icon="📄"
              isGold
              onClick={() => navigate('/crm/compliance/form7')}
            />
            <ModuleCard
              id="form12"
              label="Form 12 (Legal Notice)"
              description="Draft, sign, and issue eviction or early termination notices."
              icon="⚖️"
              isGold
              onClick={() => navigate('/crm/compliance/form12')}
            />
            <ModuleCard
              id="commission-matrix"
              label="Commission Matrix"
              description="Track broker splits, external agent payouts, and VAT deductions."
              icon="💰"
              isGold
              onClick={() => navigate('/crm/finance/commission')}
            />
          </div>
        </div>

        <GridSection>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LeaderboardTab
              data={{
                agents: leaderboard.map((broker, idx) => ({
                  id: broker.id,
                  name: broker.name,
                  rank: idx + 1,
                  deals: broker.deals,
                  revenue: broker.revenue,
                  satisfaction: 98 - idx * 2, // Mapped mock satisfaction values
                  badge: broker.tier,
                })),
                period: 'This Month',
              }}
            />
          </Card>

          <Card>
            <h2>AI Command Center</h2>
            <AIChatArea>
              <div>
                {telemetry && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: colors.text.secondary,
                      marginBottom: '10px',
                    }}
                  >
                    <strong>Telemetry:</strong> {telemetry.avgResponseTime} resp |{' '}
                    {telemetry.whatsappSla} SLA
                    <br />
                    <strong>Active:</strong> {telemetry.activeAgents.join(', ')}
                  </div>
                )}
                <div
                  style={{
                    background: '#0f0f0f',
                    color: '#ffffff',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #c9a84c',
                    marginTop: '10px',
                  }}
                >
                  <strong>Sentinel AI:</strong> System is secure. Market reports are ready for your
                  review.
                </div>
              </div>
              <AIInput placeholder="Command your AI agents..." />
            </AIChatArea>
          </Card>
        </GridSection>
      </MainContent>
    </CockpitLayout>
  );
};

export default UnifiedDashboardPage;
