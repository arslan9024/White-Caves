import React from 'react';
import { 
  LayoutDashboard, TrendingUp, Users, FileText, Settings, 
  BarChart3, PieChart, Activity, Clock, CheckCircle2, AlertCircle,
  Plus, Download, RefreshCw, Filter, Search
} from 'lucide-react';
import FeatureCard, { FeatureCardGrid } from './FeatureCard';
import FeatureSection from './FeatureSection';
import './GenericFeatureView.css';

const GenericFeatureView = ({
  assistant,
  feature,
  color = '#0EA5E9',
  stats = [],
  actions = [],
  recentItems = [],
  chartData = null,
  loading = false
}) => {
  const defaultStats = [
    { title: 'Total Records', value: Math.floor(Math.random() * 1000) + 100, icon: LayoutDashboard, trend: 'up', trendValue: '+12%' },
    { title: 'Active Items', value: Math.floor(Math.random() * 500) + 50, icon: Activity, trend: 'up', trendValue: '+8%' },
    { title: 'Pending', value: Math.floor(Math.random() * 50) + 5, icon: Clock, trend: 'neutral' },
    { title: 'Completed', value: Math.floor(Math.random() * 200) + 20, icon: CheckCircle2, trend: 'up', trendValue: '+15%' }
  ];

  const defaultActions = [
    { label: 'Add New', icon: Plus, variant: 'primary' },
    { label: 'Export', icon: Download, variant: 'secondary' },
    { label: 'Refresh', icon: RefreshCw, variant: 'ghost' }
  ];

  const defaultRecentItems = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: `${feature.label} Item ${i + 1}`,
    subtitle: `Created ${Math.floor(Math.random() * 24) + 1} hours ago`,
    status: ['active', 'pending', 'completed'][Math.floor(Math.random() * 3)]
  }));

  const displayStats = stats.length > 0 ? stats : defaultStats;
  const displayActions = actions.length > 0 ? actions : defaultActions;
  const displayItems = recentItems.length > 0 ? recentItems : defaultRecentItems;

  if (loading) {
    return (
      <div className="generic-feature-view loading">
        <div className="loading-spinner" />
        <span>Loading {feature.label}...</span>
      </div>
    );
  }

  return (
    <div className="generic-feature-view" style={{ '--feature-color': color }}>
      <div className="feature-toolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder={`Search ${feature.label}...`} />
          </div>
          <button className="filter-btn">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>
        <div className="toolbar-right">
          {displayActions.map((action, idx) => (
            <button
              key={idx}
              className={`action-btn ${action.variant || 'secondary'}`}
              onClick={action.onClick}
            >
              {action.icon && <action.icon size={16} />}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <FeatureCardGrid columns={4} className="stats-grid">
        {displayStats.map((stat, idx) => (
          <FeatureCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
            color={color}
          />
        ))}
      </FeatureCardGrid>

      <div className="feature-main-content">
        <FeatureSection
          title={`Recent ${feature.label}`}
          subtitle={`Last updated: ${new Date().toLocaleTimeString()}`}
          icon={Clock}
          actionLabel="View All"
          action={() => {}}
        >
          <div className="items-list">
            {displayItems.map(item => (
              <div key={item.id} className="list-item">
                <div className="item-info">
                  <span className="item-title">{item.title}</span>
                  <span className="item-subtitle">{item.subtitle}</span>
                </div>
                <span className={`item-status ${item.status}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </FeatureSection>

        <div className="side-panels">
          <FeatureSection
            title="Quick Actions"
            icon={Settings}
          >
            <div className="quick-actions-grid">
              <button className="quick-action">
                <Plus size={20} />
                <span>Create New</span>
              </button>
              <button className="quick-action">
                <FileText size={20} />
                <span>Generate Report</span>
              </button>
              <button className="quick-action">
                <Download size={20} />
                <span>Export Data</span>
              </button>
              <button className="quick-action">
                <BarChart3 size={20} />
                <span>View Analytics</span>
              </button>
            </div>
          </FeatureSection>

          <FeatureSection
            title="Performance Overview"
            icon={TrendingUp}
          >
            <div className="chart-placeholder">
              <PieChart size={48} />
              <span>Chart visualization</span>
            </div>
          </FeatureSection>
        </div>
      </div>
    </div>
  );
};

export default GenericFeatureView;
