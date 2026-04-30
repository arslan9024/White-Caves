import React, { useState } from 'react';
import { Key, RefreshCw, Building2, CalendarClock } from 'lucide-react';
import MixedDashboard, { DashboardSection } from './MixedDashboard';
import AnimatedStatsBar from './AnimatedStatsBar';
import LifecycleFlowchart from './LifecycleFlowchart';
import AIQuickActions from './AIQuickActions';
import LiveActivityFeed from './LiveActivityFeed';
import { DEPT_ASSISTANT_MAP } from '../../../data/departmentAssistantMap';

const LEASING_STATS = [
  {
    id: 'active',
    label: 'Active Leases',
    value: 342,
    change: 8,
    icon: <Key size={20} />,
    iconBg: 'rgba(16, 185, 129, 0.1)',
    highlight: true,
  },
  {
    id: 'renewals',
    label: 'Renewals Due',
    value: 28,
    icon: <CalendarClock size={20} />,
    iconBg: 'rgba(245, 158, 11, 0.1)',
  },
  {
    id: 'occupancy',
    label: 'Occupancy Rate',
    value: '94%',
    change: 2,
    icon: <Building2 size={20} />,
    iconBg: 'rgba(59, 130, 246, 0.1)',
  },
  {
    id: 'collected',
    label: 'Rent Collected',
    value: 4850000,
    prefix: 'AED ',
    change: 5,
    icon: <RefreshCw size={20} />,
    iconBg: 'rgba(227, 30, 36, 0.1)',
  },
];

const LEASING_LIFECYCLE = [
  'Inquiry',
  'Viewing',
  'Application',
  'Approved',
  'Ejari',
  'Active',
  'Renewal',
  'Ended',
];

const STAGE_DATA = {
  Inquiry: { count: 45 },
  Viewing: { count: 23 },
  Application: { count: 12, alert: true },
  Approved: { count: 8 },
  Ejari: { count: 5 },
  Active: { count: 342 },
  Renewal: { count: 28 },
  Ended: { count: 89 },
};

const QUICK_ACTIONS = [
  { id: 'new', label: 'New Lease', icon: 'plus', variant: 'primary' },
  { id: 'ejari', label: 'Create Ejari', icon: 'file', badge: 'Nina' },
  { id: 'renewal', label: 'Process Renewals', icon: 'refresh', badge: '28' },
  { id: 'report', label: 'Landlord Report', icon: 'chart' },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    icon: 'success',
    actor: 'Nina',
    action: 'registered Ejari for',
    target: 'Marina Apt #1204',
    timestamp: '8 min ago',
    type: 'success',
  },
  {
    id: 2,
    icon: 'document',
    actor: 'Grace',
    action: 'sent renewal notice to',
    target: '12 tenants',
    timestamp: '25 min ago',
    type: 'default',
  },
  {
    id: 3,
    icon: 'ai',
    actor: 'Amber',
    action: 'processed application for',
    target: 'Downtown Unit',
    timestamp: '1 hour ago',
    type: 'default',
  },
  {
    id: 4,
    icon: 'payment',
    actor: 'Luna',
    action: 'collected rent from',
    target: 'Palm Residences',
    timestamp: '2 hours ago',
    type: 'success',
  },
  {
    id: 5,
    icon: 'user',
    actor: 'System',
    action: 'scheduled viewing for',
    target: 'JBR Apartment',
    timestamp: '3 hours ago',
    type: 'pending',
  },
];

const PENDING_RENEWALS = [
  {
    id: 1,
    tenant: 'Mohammed Ali',
    property: 'Marina View 1BR',
    expires: '15 Jan 2026',
    rent: 'AED 85,000',
    status: 'Pending',
  },
  {
    id: 2,
    tenant: 'Sarah Johnson',
    property: 'Downtown 2BR',
    expires: '18 Jan 2026',
    rent: 'AED 120,000',
    status: 'Sent',
  },
  {
    id: 3,
    tenant: 'Ahmed Hassan',
    property: 'JBR Studio',
    expires: '22 Jan 2026',
    rent: 'AED 65,000',
    status: 'Pending',
  },
  {
    id: 4,
    tenant: 'Elena Volkov',
    property: 'DIFC 3BR',
    expires: '25 Jan 2026',
    rent: 'AED 180,000',
    status: 'Negotiating',
  },
];

export default function LeasingMixedDashboard({ _subItem = 'ejari-system', selectedAssistant }) {
  const [currentStage, setCurrentStage] = useState(5);
  const deptConfig = DEPT_ASSISTANT_MAP.leasing;

  const handleStageClick = (stage, index) => {
    setCurrentStage(index);
  };

  const handleAction = _action => {};

  return (
    <MixedDashboard
      departmentId="leasing"
      departmentLabel={deptConfig.label}
      assistantId={selectedAssistant}
      assistantName={
        selectedAssistant
          ? selectedAssistant.charAt(0).toUpperCase() + selectedAssistant.slice(1)
          : 'Nina'
      }
      statsComponent={<AnimatedStatsBar stats={LEASING_STATS} />}
      flowchartComponent={
        <div>
          <h4
            style={{
              margin: '0 0 16px 0',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            Tenancy Lifecycle (Ejari Flow)
          </h4>
          <LifecycleFlowchart
            stages={LEASING_LIFECYCLE}
            currentStage={currentStage}
            stageData={STAGE_DATA}
            onStageClick={handleStageClick}
            compact
          />
        </div>
      }
      tableComponent={
        <DashboardSection title="Pending Renewals" icon={<CalendarClock size={18} />}>
          <div className="renewals-table">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    Tenant
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    Property
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    Expires
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    Annual Rent
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {PENDING_RENEWALS.map(renewal => (
                  <tr key={renewal.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontSize: '0.85rem', fontWeight: 500 }}>
                      {renewal.tenant}
                    </td>
                    <td
                      style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}
                    >
                      {renewal.property}
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.85rem' }}>{renewal.expires}</td>
                    <td
                      style={{
                        padding: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#B03737',
                      }}
                    >
                      {renewal.rent}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          background:
                            renewal.status === 'Sent'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : renewal.status === 'Negotiating'
                                ? 'rgba(139, 92, 246, 0.1)'
                                : 'rgba(245, 158, 11, 0.1)',
                          color:
                            renewal.status === 'Sent'
                              ? '#10B981'
                              : renewal.status === 'Negotiating'
                                ? '#8B5CF6'
                                : '#F59E0B',
                        }}
                      >
                        {renewal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardSection>
      }
      activityComponent={
        <LiveActivityFeed activities={RECENT_ACTIVITIES} title="Leasing Activity" />
      }
      quickActionsComponent={
        <AIQuickActions actions={QUICK_ACTIONS} onAction={handleAction} layout="horizontal" />
      }
    />
  );
}
