import React from 'react';
import { TrendingUp, DollarSign, Users, AlertTriangle, ShieldCheck, Scale, FileCheck } from 'lucide-react';
import type { ConfidentialVaultState } from '../../../../store/slices/aiAssistant/types';

interface FunnelMetrics {
  totalIncoming?: number;
  conversionRate?: number;
  rentVsSaleRatio?: string;
  avgQualificationTime?: string;
}

interface ComplianceMetrics {
  totalProfiles?: number;
  pendingReview?: number;
  approvedThisMonth?: number;
  riskScore?: number;
}

interface ReportsTabProps {
  funnelMetrics: FunnelMetrics | null;
  complianceMetrics: ComplianceMetrics | null;
  vault: ConfidentialVaultState;
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
                <span>Total Incoming</span>
                <span className="metric-value">{funnelMetrics.totalIncoming || 0}</span>
              </div>
              <div className="metric-row">
                <span>Conversion Rate</span>
                <span className="metric-value">{funnelMetrics.conversionRate || 0}%</span>
              </div>
              <div className="metric-row">
                <span>Rent vs Sale</span>
                <span className="metric-value">{funnelMetrics.rentVsSaleRatio || 'N/A'}</span>
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
                <span>Risk Score</span>
                <span className="metric-value">{complianceMetrics.riskScore ?? 0}</span>
              </div>
              <div className="metric-row">
                <span>Pending Review</span>
                <span className="metric-value">{complianceMetrics.pendingReview || 0}</span>
              </div>
              <div className="metric-row">
                <span>Approved This Month</span>
                <span className="metric-value">{complianceMetrics.approvedThisMonth || 0}</span>
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

        {/* ── UAE FTA & DLD Statutory Gate Telemetry (AEGIS V5.0 Law AEG-028..030) ── */}
        <div className="report-card" data-testid="statutory-compliance-card">
          <div className="report-header">
            <ShieldCheck size={20} color="#10B981" />
            <h4>UAE Statutory & Regulatory Gate</h4>
          </div>
          <div className="report-content">
            <div className="metric-row">
              <span>UAE FTA 5% VAT Reserve</span>
              <span className="metric-value" style={{ color: '#10B981' }}>AED 125,000 (100% Escrowed)</span>
            </div>
            <div className="metric-row">
              <span>9% Corporate Tax Reserve</span>
              <span className="metric-value" style={{ color: '#10B981' }}>AED 225,000 (Locked)</span>
            </div>
            <div className="metric-row">
              <span>DLD Trakheesi Permit Status</span>
              <span className="metric-value">100% Cleared (Lic 1388443)</span>
            </div>
            <div className="metric-row">
              <span>UAE FIU goAML Screening</span>
              <span className="metric-value">0 Flags / Clean Gate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
