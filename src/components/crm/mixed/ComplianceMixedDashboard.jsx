import React, { useState } from 'react';
import { Shield, CheckCircle, Lock, History, UserCheck, AlertTriangle, FileCheck } from 'lucide-react';
import MixedDashboard, { DashboardSection } from './MixedDashboard';
import AnimatedStatsBar from './AnimatedStatsBar';
import LifecycleFlowchart from './LifecycleFlowchart';
import AIQuickActions from './AIQuickActions';
import LiveActivityFeed from './LiveActivityFeed';
import { DEPT_ASSISTANT_MAP } from '../../../data/departmentAssistantMap';

const COMPLIANCE_STATS = [
  { id: 'pending', label: 'Pending KYC', value: 23, icon: <UserCheck size={20} />, iconBg: 'rgba(245, 158, 11, 0.1)', highlight: true },
  { id: 'approved', label: 'Approved (MTD)', value: 89, change: 15, icon: <CheckCircle size={20} />, iconBg: 'rgba(16, 185, 129, 0.1)' },
  { id: 'flagged', label: 'AML Flagged', value: 3, icon: <AlertTriangle size={20} />, iconBg: 'rgba(239, 68, 68, 0.1)' },
  { id: 'rate', label: 'Compliance Rate', value: '98.5%', change: 2, icon: <Shield size={20} />, iconBg: 'rgba(212, 175, 55, 0.1)' }
];

const COMPLIANCE_LIFECYCLE = ['Initiated', 'Documents', 'Verification', 'Approved', 'Flagged', 'Resolved'];

const STAGE_DATA = {
  'Initiated': { count: 12 },
  'Documents': { count: 8 },
  'Verification': { count: 3, alert: true },
  'Approved': { count: 89 },
  'Flagged': { count: 3, alert: true },
  'Resolved': { count: 2 }
};

const QUICK_ACTIONS = [
  { id: 'kyc', label: 'Start KYC', icon: 'plus', variant: 'primary' },
  { id: 'verify', label: 'Verify Documents', icon: 'search', badge: 'Leo' },
  { id: 'audit', label: 'View Audit Log', icon: 'file' },
  { id: 'report', label: 'RERA Report', icon: 'chart' }
];

const RECENT_ACTIVITIES = [
  { id: 1, icon: 'success', actor: 'Leo', action: 'approved KYC for', target: 'Mohammed Al Rashid', timestamp: '15 min ago', type: 'success' },
  { id: 2, icon: 'warning', actor: 'Jack', action: 'flagged AML concern for', target: 'Transaction #T892', timestamp: '1 hour ago', type: 'warning' },
  { id: 3, icon: 'ai', actor: 'Henry', action: 'verified RERA documents for', target: 'Palm Villa Listing', timestamp: '2 hours ago', type: 'default' },
  { id: 4, icon: 'document', actor: 'System', action: 'generated audit report for', target: 'Q4 2025', timestamp: '3 hours ago', type: 'default' }
];

export default function ComplianceMixedDashboard({ subItem = 'kyc-aml', selectedAssistant }) {
  const [currentStage, setCurrentStage] = useState(3);
  const deptConfig = DEPT_ASSISTANT_MAP.compliance;
  
  const handleStageClick = (stage, index) => setCurrentStage(index);
  const handleAction = (action) => 

  return (
    <MixedDashboard
      departmentId="compliance"
      departmentLabel={deptConfig.label}
      assistantId={selectedAssistant}
      assistantName={selectedAssistant ? selectedAssistant.charAt(0).toUpperCase() + selectedAssistant.slice(1) : 'Leo'}
      statsComponent={<AnimatedStatsBar stats={COMPLIANCE_STATS} />}
      flowchartComponent={
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            KYC/AML Verification Flow
          </h4>
          <LifecycleFlowchart 
            stages={COMPLIANCE_LIFECYCLE}
            currentStage={currentStage}
            stageData={STAGE_DATA}
            onStageClick={handleStageClick}
          />
        </div>
      }
      tableComponent={
        <DashboardSection title="Pending Verifications" icon={<UserCheck size={18} />}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Client</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Documents</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { client: 'Ahmed Hassan', type: 'Buyer', docs: 'Emirates ID, Passport', status: 'Verification' },
                { client: 'Elena Volkov', type: 'Seller', docs: 'Title Deed, NOC', status: 'Documents' },
                { client: 'Sarah Johnson', type: 'Tenant', docs: 'Visa, Salary Cert.', status: 'Initiated' },
                { client: 'James Wilson', type: 'Investor', docs: 'Bank Statement, POA', status: 'Flagged' }
              ].map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontSize: '0.85rem', fontWeight: 500 }}>{item.client}</td>
                  <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.type}</td>
                  <td style={{ padding: '12px', fontSize: '0.85rem' }}>{item.docs}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500,
                      background: item.status === 'Flagged' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: item.status === 'Flagged' ? '#EF4444' : '#F59E0B'
                    }}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardSection>
      }
      activityComponent={<LiveActivityFeed activities={RECENT_ACTIVITIES} title="Compliance Activity" />}
      quickActionsComponent={<AIQuickActions actions={QUICK_ACTIONS} onAction={handleAction} layout="horizontal" />}
    />
  );
}
