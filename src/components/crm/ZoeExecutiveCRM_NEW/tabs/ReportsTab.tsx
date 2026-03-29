import React from 'react';
import { TrendingUp, DollarSign, Users, AlertTriangle } from 'lucide-react';

interface FunnelMetrics {
  totalLeads?: number;
  conversionRate?: string | number;
  pipelineValue?: string | number;
}

interface ComplianceMetrics {
  score?: string | number;
  activeReviews?: number;
  issuesFound?: number;
}

interface Vault {
  [key: string]: unknown;
}

interface ReportsTabProps {
  funnelMetrics: FunnelMetrics | null;
  complianceMetrics: ComplianceMetrics | null;
  vault: Vault;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ funnelMetrics, complianceMetrics, vault }) => {
  return (
    <div className="reports-view">
      <h3>Intelligence Reports</h3>
      
      <div className="reports-grid">
        {funnelMetrics && (
          <div className="report-card">
            <div className="report-header">
              <TrendingUp size={20} />
              <h4>Lead Funnel Metrics</h4>
            </div>
            <div className="report-content">
              <div className="metric-row">
                <span>Total Leads</span>
                <span className="metric-value">{funnelMetrics.totalLeads || 0}</span>
              </div>
              <div className="metric-row">
                <span>Conversion Rate</span>
                <span className="metric-value">{funnelMetrics.conversionRate || '0'}%</span>
              </div>
              <div className="metric-row">
                <span>Pipeline Value</span>
                <span className="metric-value">AED {funnelMetrics.pipelineValue || 0}</span>
              </div>
            </div>
          </div>
        )}

        {complianceMetrics && (
          <div className="report-card">
            <div className="report-header">
              <AlertTriangle size={20} />
              <h4>Compliance Status</h4>
            </div>
            <div className="report-content">
              <div className="metric-row">
                <span>Compliance Score</span>
                <span className="metric-value">{complianceMetrics.score || '0'}%</span>
              </div>
              <div className="metric-row">
                <span>Active Reviews</span>
                <span className="metric-value">{complianceMetrics.activeReviews || 0}</span>
              </div>
              <div className="metric-row">
                <span>Issues Found</span>
                <span className="metric-value">{complianceMetrics.issuesFound || 0}</span>
              </div>
            </div>
          </div>
        )}

        <div className="report-card">
          <div className="report-header">
            <DollarSign size={20} />
            <h4>Financial Summary</h4>
          </div>
          <div className="report-content">
            <div className="metric-row">
              <span>Q1 Revenue</span>
              <span className="metric-value">AED 2.5M</span>
            </div>
            <div className="metric-row">
              <span>Pipeline</span>
              <span className="metric-value">AED 8.2M</span>
            </div>
            <div className="metric-row">
              <span>Expenses</span>
              <span className="metric-value">AED 450K</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="report-header">
            <Users size={20} />
            <h4>Team Overview</h4>
          </div>
          <div className="report-content">
            <div className="metric-row">
              <span>Total Staff</span>
              <span className="metric-value">48</span>
            </div>
            <div className="metric-row">
              <span>Active Agents</span>
              <span className="metric-value">32</span>
            </div>
            <div className="metric-row">
              <span>Performance Score</span>
              <span className="metric-value">92%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
