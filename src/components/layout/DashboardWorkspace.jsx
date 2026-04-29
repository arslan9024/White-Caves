import React, { Suspense, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, Building2, DollarSign, TrendingUp, Clock, 
  CheckCircle, AlertCircle, RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  selectActiveWorkspace,
  selectActiveAssistant,
  selectWorkspaceLayout,
  selectViewPreferences
} from '../../store/slices/dashboardViewSlice';
import { selectActiveRole } from '../../store/slices/accessControlSlice';
import { selectLayout } from '../../store/slices/navigationUISlice';
import { useDashboardSummary } from '../../hooks/useDashboardData';
import './DashboardWorkspace.css';

const KPICard = ({ title, value, change, changeType, icon: Icon, color, loading }) => {
  const isPositive = changeType === 'positive';
  
  return (
    <div className={`kpi-card ${loading ? 'loading' : ''}`} style={{ '--accent-color': color }}>
      <div className="kpi-icon">
        <Icon size={22} />
      </div>
      <div className="kpi-content">
        <span className="kpi-title">{title}</span>
        <div className="kpi-value-row">
          <span className="kpi-value">{loading ? '-' : value}</span>
          {change && (
            <span className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const WidgetContainer = ({ title, children, loading, onRefresh, lastUpdated }) => {
  return (
    <div className={`widget-container ${loading ? 'loading' : ''}`}>
      <div className="widget-header">
        <h3 className="widget-title">{title}</h3>
        <div className="widget-actions">
          {lastUpdated && (
            <span className="widget-timestamp">
              <Clock size={12} />
              {lastUpdated}
            </span>
          )}
          {onRefresh && (
            <button className="widget-refresh" onClick={onRefresh}>
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="widget-content">
        {loading ? (
          <div className="widget-skeleton">
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
          </div>
        ) : children}
      </div>
    </div>
  );
};

const ActivityItem = ({ type, title, description, time, status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success': return <CheckCircle size={14} className="status-success" />;
      case 'warning': return <AlertCircle size={14} className="status-warning" />;
      default: return <Clock size={14} className="status-pending" />;
    }
  };

  return (
    <div className="activity-item">
      <div className="activity-indicator">{getStatusIcon()}</div>
      <div className="activity-content">
        <span className="activity-title">{title}</span>
        <span className="activity-desc">{description}</span>
      </div>
      <span className="activity-time">{time}</span>
    </div>
  );
};

const DashboardWorkspace = () => {
  const dispatch = useDispatch();
  const activeWorkspace = useSelector(selectActiveWorkspace);
  const activeAssistant = useSelector(selectActiveAssistant);
  const workspaceLayout = useSelector(selectWorkspaceLayout);
  const viewPreferences = useSelector(selectViewPreferences);
  const layout = useSelector(selectLayout);
  const activeRole = useSelector(selectActiveRole);

  const { data: summaryData, loading: summaryLoading, refresh: refreshSummary } = useDashboardSummary();

  const gridColumns = useMemo(() => {
    if (layout.breakpoint === 'mobile') return 1;
    if (layout.breakpoint === 'tablet') return 2;
    return workspaceLayout?.gridColumns || 4;
  }, [layout.breakpoint, workspaceLayout]);

  const kpis = useMemo(() => {
    if (!summaryData) return [];
    return [
      { 
        id: 'properties', 
        title: 'Total Properties', 
        value: summaryData.totalProperties || 0, 
        change: '+12%', 
        changeType: 'positive',
        icon: Building2, 
        color: '#3B82F6' 
      },
      { 
        id: 'leads', 
        title: 'Active Leads', 
        value: summaryData.totalLeads || 0, 
        change: '+8%', 
        changeType: 'positive',
        icon: Users, 
        color: '#EC4899' 
      },
      { 
        id: 'revenue', 
        title: 'Monthly Revenue', 
        value: `AED ${((summaryData.closedDeals || 0) * 150000).toLocaleString()}`, 
        change: '+15%', 
        changeType: 'positive',
        icon: DollarSign, 
        color: '#10B981' 
      },
      { 
        id: 'conversion', 
        title: 'Conversion Rate', 
        value: `${summaryData.conversionRate || 0}%`, 
        change: '-2%', 
        changeType: 'negative',
        icon: TrendingUp, 
        color: '#F59E0B' 
      }
    ];
  }, [summaryData]);

  const recentActivity = [
    { type: 'lead', title: 'New lead assigned', description: 'Sarah Williams from Dubai Marina', time: '2m ago', status: 'success' },
    { type: 'property', title: 'Property viewed', description: 'DH-66534 received 5 views today', time: '15m ago', status: 'success' },
    { type: 'ai', title: 'Olivia updated featured', description: 'Top 10 properties refreshed', time: '1h ago', status: 'success' },
    { type: 'system', title: 'Daily report ready', description: 'Executive summary available', time: '3h ago', status: 'pending' }
  ];

  return (
    <div className="dashboard-workspace">
      <header className="workspace-header">
        <div className="workspace-title-section">
          <h1 className="workspace-title">{workspaceLayout?.name || 'Dashboard'}</h1>
          <span className="workspace-subtitle">
            Welcome back! Here's what's happening today.
          </span>
        </div>
        <div className="workspace-actions">
          <button className="workspace-refresh-btn" onClick={refreshSummary}>
            <RefreshCw size={16} className={summaryLoading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>
      </header>

      <section className="kpi-strip" style={{ '--grid-columns': Math.min(gridColumns, 4) }}>
        {kpis.map(kpi => (
          <KPICard 
            key={kpi.id} 
            {...kpi} 
            loading={summaryLoading}
          />
        ))}
      </section>

      <section className="workspace-grid" style={{ '--grid-columns': gridColumns }}>
        <WidgetContainer 
          title="Lead Pipeline" 
          loading={summaryLoading}
          onRefresh={refreshSummary}
          lastUpdated="2m ago"
        >
          <div className="pipeline-stats">
            <div className="pipeline-stat">
              <span className="stat-label">New</span>
              <span className="stat-value">{summaryData?.newLeads || 0}</span>
            </div>
            <div className="pipeline-stat">
              <span className="stat-label">Qualified</span>
              <span className="stat-value">{summaryData?.qualifiedLeads || 0}</span>
            </div>
            <div className="pipeline-stat">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{summaryData?.pendingContracts || 0}</span>
            </div>
            <div className="pipeline-stat highlight">
              <span className="stat-label">Closed</span>
              <span className="stat-value">{summaryData?.closedDeals || 0}</span>
            </div>
          </div>
        </WidgetContainer>

        <WidgetContainer 
          title="Property Overview" 
          loading={summaryLoading}
          onRefresh={refreshSummary}
          lastUpdated="5m ago"
        >
          <div className="property-stats">
            <div className="property-stat">
              <span className="stat-label">For Sale</span>
              <span className="stat-value">{summaryData?.propertiesForSale || 0}</span>
            </div>
            <div className="property-stat">
              <span className="stat-label">For Rent</span>
              <span className="stat-value">{summaryData?.propertiesForRent || 0}</span>
            </div>
            <div className="property-stat highlight">
              <span className="stat-label">Available</span>
              <span className="stat-value">{summaryData?.availableProperties || 0}</span>
            </div>
          </div>
        </WidgetContainer>

        <WidgetContainer 
          title="Recent Activity" 
          loading={false}
          lastUpdated="Just now"
        >
          <div className="activity-list">
            {recentActivity.map((activity, idx) => (
              <ActivityItem key={idx} {...activity} />
            ))}
          </div>
        </WidgetContainer>

        <WidgetContainer 
          title="AI Insights" 
          loading={false}
          lastUpdated="1h ago"
        >
          <div className="insights-list">
            <div className="insight-item">
              <span className="insight-badge">Olivia</span>
              <span className="insight-text">Featured properties updated at 3:00 AM</span>
            </div>
            <div className="insight-item">
              <span className="insight-badge">Clara</span>
              <span className="insight-text">12 hot leads require follow-up today</span>
            </div>
            <div className="insight-item">
              <span className="insight-badge">Sage</span>
              <span className="insight-text">Market trend: Dubai Marina prices up 3%</span>
            </div>
          </div>
        </WidgetContainer>
      </section>
    </div>
  );
};

export default DashboardWorkspace;
