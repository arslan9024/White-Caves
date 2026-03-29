import React from 'react';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface FinanceStats {
  totalRevenue: number;
  revenueTrend: number;
  pendingAmount: number;
  pendingCount: number;
  overdueAmount: number;
  overdueCount: number;
  totalExpenses: number;
  approvedExpenses: number;
  pendingExpenses: number;
}

interface OverviewTabProps {
  financeStats: FinanceStats;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ financeStats }) => {
  return (
    <div className="overview-view">
      <h3>Financial Overview</h3>
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED {(financeStats.totalRevenue / 1000000).toFixed(1)}M</span>
            <span className="stat-label">Revenue MTD</span>
          </div>
          <span className="stat-change positive">
            ↑ {financeStats.revenueTrend}%
          </span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED {(financeStats.pendingAmount / 1000).toFixed(0)}K</span>
            <span className="stat-label">Pending</span>
          </div>
          <span className="stat-change">{financeStats.pendingCount} invoices</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED {(financeStats.overdueAmount / 1000).toFixed(0)}K</span>
            <span className="stat-label">Overdue</span>
          </div>
          <span className="stat-change negative">{financeStats.overdueCount} invoices</span>
        </div>
      </div>
      
      <div className="overview-cards">
        <div className="overview-card">
          <h4>Total Expenses This Month</h4>
          <div className="metric">
            <span className="value">AED {(financeStats.totalExpenses / 1000).toFixed(1)}K</span>
            <span className="breakdown">
              <span>Approved: AED {(financeStats.approvedExpenses / 1000).toFixed(1)}K</span>
              <span>Pending: AED {(financeStats.pendingExpenses / 1000).toFixed(1)}K</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
