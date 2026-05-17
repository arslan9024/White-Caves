import React from 'react';
import { BarChart3, LineChart, FileBarChart, Award, TrendingUp, Bot } from 'lucide-react';

const MARKET_METRICS = [
  { label: 'Avg. Price/sqft', value: 'AED 1,850', change: '+5%' },
  { label: 'Days on Market', value: '32', change: '-8%' },
  { label: 'Listing Volume', value: '1,245', change: '+12%' },
  { label: 'Transaction Volume', value: 'AED 2.8B', change: '+15%' },
];

const TOP_PERFORMERS = [
  { name: 'Sarah Ahmed', sales: 12, revenue: 'AED 8.5M', rank: 1 },
  { name: 'Mohammed Ali', sales: 10, revenue: 'AED 7.2M', rank: 2 },
  { name: 'Fatima Khan', sales: 9, revenue: 'AED 6.8M', rank: 3 },
];

const AI_INSIGHTS = [
  { id: 1, type: 'trend', message: 'Palm Jumeirah showing 15% price increase trend', assistant: 'Mary' },
  { id: 2, type: 'opportunity', message: 'High-value lead cluster identified in Business Bay', assistant: 'Zoe' },
  { id: 3, type: 'risk', message: '3 contracts approaching renewal deadline', assistant: 'Nina' },
];

export default function AnalyticsView({ activeSubItem, subItemConfig, assistantContext }) {
  const renderMarketAnalytics = () => (
    <div className="market-analytics-view">
      <h2 className="view-title">Market Analytics</h2>
      <p className="view-subtitle">Dubai real estate market trends</p>
      
      <div className="market-metrics">
        {MARKET_METRICS.map(metric => (
          <div key={metric.label} className="metric-card">
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className={`metric-change ${metric.change.startsWith('+') ? 'up' : 'down'}`}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      <div className="chart-placeholder">
        <LineChart size={48} color="var(--crm-gold)" />
        <p>Market trend visualization</p>
      </div>
    </div>
  );

  const renderPerformanceDashboard = () => (
    <div className="performance-view">
      <h2 className="view-title">Performance Dashboard</h2>
      <p className="view-subtitle">Team and individual performance metrics</p>
      
      <div className="performers-list">
        <h3><Award size={20} color="var(--crm-gold)" /> Top Performers</h3>
        {TOP_PERFORMERS.map(performer => (
          <div key={performer.name} className="performer-card">
            <div className="performer-rank">#{performer.rank}</div>
            <div className="performer-avatar">
              {performer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="performer-info">
              <h4>{performer.name}</h4>
              <span>{performer.sales} sales • {performer.revenue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="ai-insights-view">
      <h2 className="view-title">AI Insights</h2>
      <p className="view-subtitle">AI-powered analytics and recommendations</p>
      
      <div className="insights-list">
        {AI_INSIGHTS.map(insight => (
          <div key={insight.id} className={`insight-card ${insight.type}`}>
            <Bot size={20} color="var(--crm-gold)" />
            <div className="insight-content">
              <p>{insight.message}</p>
              <span className="insight-source">from {insight.assistant}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomReports = () => (
    <div className="reports-view">
      <h2 className="view-title">Custom Reports</h2>
      <p className="view-subtitle">Build and export custom reports</p>
      <div className="reports-actions">
        <button className="crm-btn crm-btn-primary">
          <FileBarChart size={16} /> Create New Report
        </button>
        <button className="crm-btn crm-btn-secondary">
          View Saved Reports
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubItem) {
      case 'market-dashboard':
        return renderMarketAnalytics();
      case 'performance-reports':
        return renderPerformanceDashboard();
      case 'forecasting':
        return renderAIInsights();
      case 'agent-performance':
        return renderCustomReports();
      default:
        return renderMarketAnalytics();
    }
  };

  return (
    <div className="view-container analytics-view">
      {renderContent()}
    </div>
  );
}
