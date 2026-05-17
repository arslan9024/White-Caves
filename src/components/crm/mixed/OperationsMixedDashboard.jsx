import React, { useState } from 'react';
import { Users, Building2, Network, UserPlus } from 'lucide-react';
import MixedDashboard, { DashboardSection } from './MixedDashboard';
import AnimatedStatsBar from './AnimatedStatsBar';
import LifecycleFlowchart from './LifecycleFlowchart';
import AIQuickActions from './AIQuickActions';
import LiveActivityFeed from './LiveActivityFeed';
import { DEPT_ASSISTANT_MAP } from '../../../data/departmentAssistantMap';

const OPERATIONS_STATS = [
  {
    id: 'employees',
    label: 'Total Employees',
    value: 103,
    change: 5,
    icon: <Users size={20} />,
    iconBg: 'rgba(59, 130, 246, 0.1)',
    highlight: true,
  },
  {
    id: 'departments',
    label: 'Departments',
    value: 10,
    icon: <Building2 size={20} />,
    iconBg: 'rgba(139, 92, 246, 0.1)',
  },
  {
    id: 'retention',
    label: 'Retention Rate',
    value: '94%',
    change: 2,
    icon: <Network size={20} />,
    iconBg: 'rgba(16, 185, 129, 0.1)',
  },
  {
    id: 'onboarding',
    label: 'Onboarding',
    value: 5,
    icon: <UserPlus size={20} />,
    iconBg: 'rgba(227, 30, 36, 0.1)',
  },
];

const OPERATIONS_LIFECYCLE = [
  'Recruitment',
  'Onboarding',
  'Training',
  'Active',
  'Review',
  'Offboarding',
];

const STAGE_DATA = {
  Recruitment: { count: 8 },
  Onboarding: { count: 5, alert: true },
  Training: { count: 12 },
  Active: { count: 98 },
  Review: { count: 15 },
  Offboarding: { count: 2 },
};

const QUICK_ACTIONS = [
  { id: 'hire', label: 'New Hire', icon: 'plus', variant: 'primary' },
  { id: 'schedule', label: 'Team Schedule', icon: 'file', badge: 'Marcus' },
  { id: 'review', label: 'Performance Reviews', icon: 'chart' },
  { id: 'org', label: 'Org Chart', icon: 'settings' },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    icon: 'success',
    actor: 'Marcus',
    action: 'completed onboarding for',
    target: 'Ahmed (Sales)',
    timestamp: '1 hour ago',
    type: 'success',
  },
  {
    id: 2,
    icon: 'ai',
    actor: 'Kevin',
    action: 'scheduled team meeting for',
    target: 'Marketing Dept',
    timestamp: '2 hours ago',
    type: 'default',
  },
  {
    id: 3,
    icon: 'user',
    actor: 'HR',
    action: 'approved leave request for',
    target: 'Sarah Thompson',
    timestamp: '3 hours ago',
    type: 'success',
  },
  {
    id: 4,
    icon: 'pending',
    actor: 'System',
    action: 'performance review due for',
    target: '15 employees',
    timestamp: 'Today',
    type: 'pending',
  },
];

export default function OperationsMixedDashboard({ _subItem = 'departments', selectedAssistant }) {
  const [currentStage, setCurrentStage] = useState(3);
  const deptConfig = DEPT_ASSISTANT_MAP.operations;

  const handleStageClick = (stage, index) => setCurrentStage(index);
  const handleAction = _action => {};

  return (
    <MixedDashboard
      departmentId="operations"
      departmentLabel={deptConfig.label}
      assistantId={selectedAssistant}
      assistantName={
        selectedAssistant
          ? selectedAssistant.charAt(0).toUpperCase() + selectedAssistant.slice(1)
          : 'Marcus'
      }
      statsComponent={<AnimatedStatsBar stats={OPERATIONS_STATS} />}
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
            Employee Lifecycle
          </h4>
          <LifecycleFlowchart
            stages={OPERATIONS_LIFECYCLE}
            currentStage={currentStage}
            stageData={STAGE_DATA}
            onStageClick={handleStageClick}
          />
        </div>
      }
      tableComponent={
        <DashboardSection title="Department Overview" icon={<Building2 size={18} />}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
            }}
          >
            {[
              { name: 'Sales', head: 'Liam M.', members: 18, color: '#3B82F6' },
              { name: 'Leasing', head: 'Nina K.', members: 12, color: '#10B981' },
              { name: 'Marketing', head: 'Ivy P.', members: 8, color: '#8B5CF6' },
              { name: 'Finance', head: 'Max T.', members: 6, color: '#F59E0B' },
              { name: 'Operations', head: 'Marcus R.', members: 15, color: '#EC4899' },
              { name: 'Compliance', head: 'Leo J.', members: 4, color: '#EF4444' },
            ].map((dept, i) => (
              <div
                key={i}
                style={{
                  padding: '14px',
                  background: 'var(--surface-secondary)',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${dept.color}`,
                }}
              >
                <h5 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 600 }}>
                  {dept.name}
                </h5>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Head: {dept.head}
                </p>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#B03737' }}>
                  {dept.members}
                </span>
                <span
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}
                >
                  members
                </span>
              </div>
            ))}
          </div>
        </DashboardSection>
      }
      activityComponent={
        <LiveActivityFeed activities={RECENT_ACTIVITIES} title="Operations Activity" />
      }
      quickActionsComponent={
        <AIQuickActions actions={QUICK_ACTIONS} onAction={handleAction} layout="horizontal" />
      }
    />
  );
}
