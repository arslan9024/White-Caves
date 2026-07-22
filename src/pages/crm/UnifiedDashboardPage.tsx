import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useUserProfile } from '../../hooks/useUserProfile';
import { KPICard } from '../../components/dashboard/DashboardComponents';
import { dubaiFinanceEngine } from '../../mocks/dubaiFinanceEngine';
import { colors, spacing, typography, borderRadius, shadows } from '../../design-tokens';
import { CRM_MODULE_REGISTRY } from '../../config/crmModuleRegistry';
import { useNavigate } from 'react-router-dom';
import LeaderboardTab from '../../components/owner/tabs/LeaderboardTab';

const CockpitLayout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: ${colors.background.default};
`;

const Sidebar = styled.aside`
  background: linear-gradient(180deg, #18181e 0%, #111115 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  padding: ${spacing[4]};
  color: #fff;
  display: flex;
  flex-direction: column;
`;

const SidebarBrand = styled.div`
  padding: ${spacing[4]} 0;
  margin-bottom: ${spacing[6]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  h2 {
    margin: 0;
    color: #c9a84c;
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const NavItem = styled.li`
  button {
    width: 100%;
    text-align: left;
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    border: none;
    padding: ${spacing[3]} ${spacing[4]};
    border-radius: ${borderRadius.md};
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: ${spacing[3]};

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
  }
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
    color: ${colors.text.primary};
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
  background: ${colors.background.surface};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[6]};
  box-shadow: ${shadows.default};

  h2 {
    margin-top: 0;
    margin-bottom: ${spacing[4]};
    font-size: 1.25rem;
    color: ${colors.text.primary};
  }
`;

const AIChatArea = styled.div`
  height: 300px;
  background: #f8fafc;
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.border.default};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${spacing[4]};
`;

const AIInput = styled.input`
  width: 100%;
  padding: ${spacing[3]};
  border: 1px solid ${colors.border.dark};
  border-radius: ${borderRadius.md};
  margin-top: ${spacing[4]};
  &:focus {
    outline: none;
    border-color: #c9a84c;
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
      <Sidebar>
        <SidebarBrand>
          <h2>WHITE CAVES</h2>
          <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>EXECUTIVE COCKPIT</span>
        </SidebarBrand>
        <NavList>
          {Object.values(CRM_MODULE_REGISTRY)
            .slice(0, 10)
            .map((mod: any) => (
              <NavItem key={mod.label}>
                <button onClick={() => navigate(mod.path)}>
                  <span>{mod.icon || '⬡'}</span>
                  {mod.label}
                </button>
              </NavItem>
            ))}
        </NavList>
      </Sidebar>

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
                    background: '#fff',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #eee',
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
