import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../../store/store';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

export type DashboardView =
  | 'company'
  | 'department'
  | 'sales'
  | 'property'
  | 'commission'
  | 'leads'
  | 'office'
  | 'agent'
  | 'financial'
  | 'performance'
  | 'inventory'
  | 'client';

interface DashboardConfig {
  id: DashboardView;
  label: string;
  icon: string;
  description: string;
  roles: string[];
  metrics: string[];
  features: string[];
}

const DASHBOARD_CONFIGS: Record<DashboardView, DashboardConfig> = {
  company: {
    id: 'company',
    label: 'Company Overview',
    icon: '🏢',
    description: 'Company-wide metrics and KPIs',
    roles: ['admin', 'ceo', 'coo'],
    metrics: ['total_revenue', 'total_agents', 'total_clients', 'market_position'],
    features: ['company_metrics', 'team_overview', 'financial_summary'],
  },
  department: {
    id: 'department',
    label: 'Department',
    icon: '📊',
    description: 'Department-specific performance',
    roles: ['manager', 'admin'],
    metrics: ['dept_revenue', 'dept_agents', 'dept_performance', 'dept_kpis'],
    features: ['dept_analytics', 'team_metrics', 'agent_rankings'],
  },
  sales: {
    id: 'sales',
    label: 'Sales Pipeline',
    icon: '📈',
    description: 'Sales opportunities and pipeline',
    roles: ['agent', 'manager', 'admin'],
    metrics: ['pipeline_value', 'deals_in_progress', 'conversion_rate', 'avg_deal_size'],
    features: ['pipeline_view', 'deal_tracker', 'sales_forecast'],
  },
  property: {
    id: 'property',
    label: 'Property Inventory',
    icon: '🏠',
    description: 'Property listings and inventory',
    roles: ['agent', 'manager', 'admin', 'operations'],
    metrics: ['total_properties', 'available', 'leased', 'sold'],
    features: ['property_list', 'availability_tracking', 'listing_status'],
  },
  commission: {
    id: 'commission',
    label: 'Commission Tracking',
    icon: '💰',
    description: 'Commission calculations and history',
    roles: ['agent', 'manager', 'finance', 'admin'],
    metrics: ['total_commission', 'pending', 'approved', 'paid_amount'],
    features: ['commission_summary', 'payment_tracking', 'dispute_management'],
  },
  leads: {
    id: 'leads',
    label: 'Leads Management',
    icon: '👥',
    description: 'Lead tracking and qualification',
    roles: ['agent', 'manager', 'admin'],
    metrics: ['total_leads', 'qualified', 'conversion_rate', 'lead_quality'],
    features: ['lead_pipeline', 'scoring', 'qualification_tracking'],
  },
  office: {
    id: 'office',
    label: 'Office Management',
    icon: '🏛️',
    description: 'Office operations and administration',
    roles: ['manager', 'operations', 'admin'],
    metrics: ['office_efficiency', 'operations_cost', 'staff_count', 'utilization'],
    features: ['operations_dashboard', 'resource_planning', 'schedule_management'],
  },
  agent: {
    id: 'agent',
    label: 'Agent Performance',
    icon: '⭐',
    description: 'Individual agent metrics and performance',
    roles: ['agent', 'manager', 'admin'],
    metrics: ['deals_closed', 'total_commission', 'client_count', 'satisfaction'],
    features: ['personal_kpis', 'performance_chart', 'goals_tracking'],
  },
  financial: {
    id: 'financial',
    label: 'Financial Dashboard',
    icon: '💵',
    description: 'Financial metrics and reporting',
    roles: ['finance', 'manager', 'admin'],
    metrics: ['total_revenue', 'operating_costs', 'net_profit', 'cash_flow'],
    features: ['revenue_tracking', 'expense_analysis', 'profit_projection'],
  },
  performance: {
    id: 'performance',
    label: 'Performance KPIs',
    icon: '📉',
    description: 'Key performance indicators and trends',
    roles: ['manager', 'admin', 'agent'],
    metrics: ['kpi_summary', 'trend_analysis', 'benchmarking', 'goals_progress'],
    features: ['kpi_dashboard', 'trend_charts', 'goal_tracking'],
  },
  inventory: {
    id: 'inventory',
    label: 'Inventory Management',
    icon: '📦',
    description: 'Property and resource inventory',
    roles: ['operations', 'manager', 'admin'],
    metrics: ['total_items', 'in_stock', 'reserved', 'low_stock'],
    features: ['inventory_list', 'stock_tracking', 'alerts'],
  },
  client: {
    id: 'client',
    label: 'Client Profiles',
    icon: '👤',
    description: 'Client information and relationship management',
    roles: ['agent', 'manager', 'admin'],
    metrics: ['total_clients', 'active_clients', 'lifetime_value', 'satisfaction'],
    features: ['client_list', 'interaction_history', 'preferences'],
  },
};

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const StyledContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px;
`;

const Header = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
    gap: 6px;

    strong {
      font-weight: 600;
      color: #1976d2;
    }
  }
`;

const ViewSelectorContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  max-width: 100%;
  overflow-x: auto;

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const ViewButton = styled.button<{ $isActive: boolean; $isDisabled: boolean }>`
  padding: 10px 14px;
  border: 2px solid ${(props) => (props.$isActive ? '#1976d2' : '#ddd')};
  background: ${(props) => (props.$isActive ? '#1976d2' : 'white')};
  color: ${(props) => (props.$isActive ? 'white' : '#333')};
  border-radius: 6px;
  cursor: ${(props) => (props.$isDisabled ? 'not-allowed' : 'pointer')};
  font-weight: 500;
  font-size: 13px;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    border-color: #1976d2;
    background: ${(props) => (props.$isActive ? '#1565c0' : '#f0f8ff')};
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ContentArea = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }
`;

const MetricCard = styled(Card)`
  text-align: center;

  .metric-value {
    font-size: 28px;
    font-weight: 700;
    color: #1976d2;
    margin: 12px 0;
  }

  .metric-label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;

  li {
    padding: 8px 0;
    font-size: 14px;
    color: #555;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 8px;

    &:last-child {
      border-bottom: none;
    }

    &:before {
      content: '✓';
      color: #4caf50;
      font-weight: bold;
    }
  }
`;

const RoleIndicator = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;

  .role-badge {
    background: #f0f0f0;
    color: #666;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 16px;
  color: #666;

  &:after {
    content: '';
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 4px solid #f0f0f0;
    border-top: 4px solid #1976d2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================

export interface UnifiedCRMProps {
  defaultView?: DashboardView;
  onViewChange?: (view: DashboardView) => void;
}

const UnifiedCRM: React.FC<UnifiedCRMProps> = ({ defaultView = 'company', onViewChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentView, setCurrentView] = useState<DashboardView>(defaultView);
  const [loading, setLoading] = useState(false);

  // Get user role from Redux state
  const userRole = useSelector((state: RootState) => state.auth?.user?.role || 'agent');

  // Get available dashboards based on user role
  const availableDashboards = useMemo(() => {
    return Object.values(DASHBOARD_CONFIGS).filter((config) =>
      config.roles.includes(userRole)
    );
  }, [userRole]);

  // Get current dashboard configuration
  const currentConfig = useMemo(() => {
    return DASHBOARD_CONFIGS[currentView];
  }, [currentView]);

  // Handle view change
  const viewTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(viewTimerRef.current);
  }, []);

  const handleViewChange = useCallback(
    (view: DashboardView) => {
      setLoading(true);
      setCurrentView(view);
      onViewChange?.(view);

      // Simulate loading delay
      clearTimeout(viewTimerRef.current);
      viewTimerRef.current = setTimeout(() => {
        setLoading(false);
      }, 500);
    },
    [onViewChange]
  );

  // Check if user has access to view
  const hasAccess = useMemo(() => {
    return currentConfig.roles.includes(userRole);
  }, [currentConfig, userRole]);

  if (!hasAccess && !loading) {
    return (
      <StyledContainer>
        <Header>
          <HeaderContent>
            <Title>Access Denied</Title>
            <Subtitle>
              <span>
                You don't have permission to access this dashboard. Contact your administrator.
              </span>
            </Subtitle>
          </HeaderContent>
        </Header>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <Title>
            {currentConfig.icon} {currentConfig.label}
          </Title>
          <Subtitle>
            <span>{currentConfig.description}</span>
            <span>
              <strong>Role:</strong> {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </Subtitle>
        </HeaderContent>
        <ViewSelectorContainer>
          {availableDashboards.map((config) => (
            <ViewButton
              key={config.id}
              $isActive={currentView === config.id}
              $isDisabled={loading}
              onClick={() => handleViewChange(config.id)}
              title={config.description}
            >
              {config.icon} {config.label}
            </ViewButton>
          ))}
        </ViewSelectorContainer>
      </Header>

      {/* Content Area */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ContentArea>
          {/* Metrics Section */}
          {currentConfig.metrics.map((metric) => (
            <MetricCard key={metric}>
              <div className="metric-label">{metric.replace(/_/g, ' ').toUpperCase()}</div>
              <div className="metric-value">
                {metric.includes('revenue') || metric.includes('commission') ? '$' : ''}
                {(metric.includes('revenue') ? 250000 : metric.includes('commission') ? 45000 : 1250).toLocaleString()}
              </div>
            </MetricCard>
          ))}

          {/* Features Section */}
          <Card>
            <h3 style={{ marginTop: 0, marginBottom: 12, color: '#333' }}>Available Features</h3>
            <FeatureList>
              {currentConfig.features.map((feature) => (
                <li key={feature}>{feature.replace(/_/g, ' ').toUpperCase()}</li>
              ))}
            </FeatureList>
            <RoleIndicator>
              <strong style={{ marginRight: 'auto' }}>Accessible by:</strong>
              {currentConfig.roles.map((role) => (
                <div key={role} className="role-badge">
                  {role.toUpperCase()}
                </div>
              ))}
            </RoleIndicator>
          </Card>
        </ContentArea>
      )}
    </StyledContainer>
  );
};

export default UnifiedCRM;
