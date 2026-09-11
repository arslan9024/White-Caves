import React, { memo } from 'react';
import { LayoutDashboard, Bot, BarChart3, FileText, RefreshCw } from 'lucide-react';
import DynamicAssistantCRM from '../../crm/DynamicAssistantCRM';
import './MainGridView.css';

const LoadingSpinner = memo(() => (
  <div className="main-grid-loading">
    <RefreshCw size={32} className="spinner" />
    <span>Loading dashboard...</span>
  </div>
));

const MainGridView = ({ content, activeAssistant, children }) => {
  const [dashboardData, setDashboardData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!activeAssistant) {
      setLoading(true);
      fetch('/api/dashboard/summary')
        .then(res => res.json())
        .then(data => {
          setDashboardData(data.summary || data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [activeAssistant]);

  if (!activeAssistant) {
    if (loading) return <LoadingSpinner />;
    return (
      <div className="main-grid-view">
        <div className="main-grid-placeholder">
          <div className="placeholder-icon">
            <Bot size={64} strokeWidth={1} />
          </div>
          <h2>Welcome to AI Command Center</h2>
          <p>Select an AI assistant from the sidebar to get started</p>
          <div className="quick-stats">
            <div className="stat-card">
              <LayoutDashboard size={24} />
              <span className="stat-value">{dashboardData?.totalLeads || 0}</span>
              <span className="stat-label">Total Leads</span>
            </div>
            <div className="stat-card">
              <BarChart3 size={24} />
              <span className="stat-value">{dashboardData?.totalProperties || 0}</span>
              <span className="stat-label">Properties</span>
            </div>
            <div className="stat-card">
              <FileText size={24} />
              <span className="stat-value">{dashboardData?.totalTransactions || 0}</span>
              <span className="stat-label">Transactions</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (children) {
    return (
      <div className="main-grid-view">
        <div className="main-grid-content">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="main-grid-view">
      <DynamicAssistantCRM 
        activeAssistant={activeAssistant} 
        content={content} 
      />
    </div>
  );
};

export default MainGridView;
