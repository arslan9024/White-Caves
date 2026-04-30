import React, { useState } from 'react';
import { CreditCard, Receipt, Percent, DollarSign, AlertCircle } from 'lucide-react';
import MixedDashboard, { DashboardSection } from './MixedDashboard';
import AnimatedStatsBar from './AnimatedStatsBar';
import LifecycleFlowchart from './LifecycleFlowchart';
import AIQuickActions from './AIQuickActions';
import LiveActivityFeed from './LiveActivityFeed';
import { DEPT_ASSISTANT_MAP } from '../../../data/departmentAssistantMap';

const FINANCE_STATS = [
  {
    id: 'revenue',
    label: 'MTD Revenue',
    value: 8500000,
    prefix: 'AED ',
    change: 12,
    icon: <DollarSign size={20} />,
    iconBg: 'rgba(16, 185, 129, 0.1)',
    highlight: true,
  },
  {
    id: 'outstanding',
    label: 'Outstanding',
    value: 1250000,
    prefix: 'AED ',
    icon: <AlertCircle size={20} />,
    iconBg: 'rgba(239, 68, 68, 0.1)',
  },
  {
    id: 'collected',
    label: 'Collected',
    value: 7250000,
    prefix: 'AED ',
    change: 8,
    icon: <CreditCard size={20} />,
    iconBg: 'rgba(59, 130, 246, 0.1)',
  },
  {
    id: 'commissions',
    label: 'Commissions Due',
    value: 425000,
    prefix: 'AED ',
    icon: <Percent size={20} />,
    iconBg: 'rgba(227, 30, 36, 0.1)',
  },
];

const FINANCE_LIFECYCLE = ['Invoice', 'Sent', 'Reminder', 'Paid', 'Overdue', 'Written Off'];

const STAGE_DATA = {
  Invoice: { count: 12 },
  Sent: { count: 34 },
  Reminder: { count: 8, alert: true },
  Paid: { count: 156 },
  Overdue: { count: 5, alert: true },
  'Written Off': { count: 2 },
};

const QUICK_ACTIONS = [
  { id: 'invoice', label: 'New Invoice', icon: 'plus', variant: 'primary' },
  { id: 'collect', label: 'Send Reminders', icon: 'send', badge: '8' },
  { id: 'commissions', label: 'Process Commissions', icon: 'zap', badge: 'Max' },
  { id: 'report', label: 'Financial Report', icon: 'chart' },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    icon: 'success',
    actor: 'Max',
    action: 'processed commission for',
    target: 'Liam - AED 85K',
    timestamp: '30 min ago',
    type: 'success',
  },
  {
    id: 2,
    icon: 'payment',
    actor: 'System',
    action: 'received payment',
    target: 'AED 2.5M',
    timestamp: '1 hour ago',
    type: 'success',
  },
  {
    id: 3,
    icon: 'ai',
    actor: 'Theodora',
    action: 'generated monthly report for',
    target: 'December 2025',
    timestamp: '2 hours ago',
    type: 'default',
  },
  {
    id: 4,
    icon: 'warning',
    actor: 'System',
    action: 'flagged overdue invoice',
    target: 'INV-2025-0892',
    timestamp: '3 hours ago',
    type: 'warning',
  },
];

export default function FinanceMixedDashboard({ _subItem = 'payments', selectedAssistant }) {
  const [currentStage, setCurrentStage] = useState(3);
  const deptConfig = DEPT_ASSISTANT_MAP.finance;

  const handleStageClick = (stage, index) => setCurrentStage(index);
  const handleAction = _action => {};

  return (
    <MixedDashboard
      departmentId="finance"
      departmentLabel={deptConfig.label}
      assistantId={selectedAssistant}
      assistantName={
        selectedAssistant
          ? selectedAssistant.charAt(0).toUpperCase() + selectedAssistant.slice(1)
          : 'Max'
      }
      statsComponent={<AnimatedStatsBar stats={FINANCE_STATS} />}
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
            Payment Collection Flow
          </h4>
          <LifecycleFlowchart
            stages={FINANCE_LIFECYCLE}
            currentStage={currentStage}
            stageData={STAGE_DATA}
            onStageClick={handleStageClick}
          />
        </div>
      }
      tableComponent={
        <DashboardSection title="Recent Transactions" icon={<Receipt size={18} />}>
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
                  Invoice
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
                  Client
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
                  Amount
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
              {[
                {
                  invoice: 'INV-2025-0912',
                  client: 'Mohammed Al Rashid',
                  amount: 'AED 625,000',
                  status: 'Paid',
                },
                {
                  invoice: 'INV-2025-0908',
                  client: 'Sarah Thompson',
                  amount: 'AED 410,000',
                  status: 'Sent',
                },
                {
                  invoice: 'INV-2025-0892',
                  client: 'Ahmed Kazim',
                  amount: 'AED 95,000',
                  status: 'Overdue',
                },
                {
                  invoice: 'INV-2025-0885',
                  client: 'Elena Petrova',
                  amount: 'AED 255,000',
                  status: 'Paid',
                },
              ].map((tx, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontSize: '0.85rem', fontWeight: 500 }}>
                    {tx.invoice}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {tx.client}
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#B03737',
                    }}
                  >
                    {tx.amount}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        background:
                          tx.status === 'Paid'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : tx.status === 'Overdue'
                              ? 'rgba(239, 68, 68, 0.1)'
                              : 'rgba(59, 130, 246, 0.1)',
                        color:
                          tx.status === 'Paid'
                            ? '#10B981'
                            : tx.status === 'Overdue'
                              ? '#EF4444'
                              : '#3B82F6',
                      }}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardSection>
      }
      activityComponent={
        <LiveActivityFeed activities={RECENT_ACTIVITIES} title="Finance Activity" />
      }
      quickActionsComponent={
        <AIQuickActions actions={QUICK_ACTIONS} onAction={handleAction} layout="horizontal" />
      }
    />
  );
}
