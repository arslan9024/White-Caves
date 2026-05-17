import React, { useState } from 'react';
import { Plug, BookOpen, Activity, Database, Server, Shield, Cpu } from 'lucide-react';
import MixedDashboard, { DashboardSection } from './MixedDashboard';
import AnimatedStatsBar from './AnimatedStatsBar';
import LifecycleFlowchart from './LifecycleFlowchart';
import AIQuickActions from './AIQuickActions';
import LiveActivityFeed from './LiveActivityFeed';
import { DEPT_ASSISTANT_MAP } from '../../../data/departmentAssistantMap';

const ADMIN_STATS = [
  {
    id: 'docs',
    label: 'Documents',
    value: 156,
    icon: <BookOpen size={20} />,
    iconBg: 'rgba(59, 130, 246, 0.1)',
    highlight: true,
  },
  {
    id: 'integrations',
    label: 'Integrations',
    value: 12,
    icon: <Plug size={20} />,
    iconBg: 'rgba(139, 92, 246, 0.1)',
  },
  {
    id: 'uptime',
    label: 'System Uptime',
    value: '99.9%',
    icon: <Activity size={20} />,
    iconBg: 'rgba(16, 185, 129, 0.1)',
  },
  {
    id: 'issues',
    label: 'Open Issues',
    value: 3,
    icon: <Shield size={20} />,
    iconBg: 'rgba(245, 158, 11, 0.1)',
  },
];

const ADMIN_LIFECYCLE = ['Draft', 'Review', 'Published', 'Archived'];

const STAGE_DATA = {
  Draft: { count: 8 },
  Review: { count: 5, alert: true },
  Published: { count: 156 },
  Archived: { count: 42 },
};

const QUICK_ACTIONS = [
  { id: 'doc', label: 'New Document', icon: 'plus', variant: 'primary' },
  { id: 'integrate', label: 'Add Integration', icon: 'settings', badge: 'Aurora' },
  { id: 'health', label: 'System Health', icon: 'zap' },
  { id: 'backup', label: 'Backup Now', icon: 'download' },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    icon: 'success',
    actor: 'Aurora',
    action: 'updated documentation for',
    target: 'API v2.5',
    timestamp: '1 hour ago',
    type: 'success',
  },
  {
    id: 2,
    icon: 'ai',
    actor: 'Stella',
    action: 'optimized database queries',
    timestamp: '2 hours ago',
    type: 'default',
  },
  {
    id: 3,
    icon: 'success',
    actor: 'Nova',
    action: 'deployed hotfix for',
    target: 'Auth Module',
    timestamp: '4 hours ago',
    type: 'success',
  },
  {
    id: 4,
    icon: 'ai',
    actor: 'Marina',
    action: 'generated system report',
    timestamp: '6 hours ago',
    type: 'default',
  },
];

const SYSTEM_STATUS = [
  { name: 'API Server', status: 'operational', uptime: '99.99%', icon: Server },
  { name: 'Database', status: 'operational', uptime: '99.95%', icon: Database },
  { name: 'Authentication', status: 'operational', uptime: '100%', icon: Shield },
  { name: 'AI Services', status: 'degraded', uptime: '98.5%', icon: Cpu },
];

export default function AdminMixedDashboard({ _subItem = 'settings', selectedAssistant }) {
  const [currentStage, setCurrentStage] = useState(2);
  const deptConfig = DEPT_ASSISTANT_MAP.admin;

  const handleStageClick = (stage, index) => setCurrentStage(index);
  const handleAction = _action => {};

  return (
    <MixedDashboard
      departmentId="admin"
      departmentLabel={deptConfig.label}
      assistantId={selectedAssistant}
      assistantName={
        selectedAssistant
          ? selectedAssistant.charAt(0).toUpperCase() + selectedAssistant.slice(1)
          : 'Aurora'
      }
      statsComponent={<AnimatedStatsBar stats={ADMIN_STATS} />}
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
            Documentation Lifecycle
          </h4>
          <LifecycleFlowchart
            stages={ADMIN_LIFECYCLE}
            currentStage={currentStage}
            stageData={STAGE_DATA}
            onStageClick={handleStageClick}
          />
        </div>
      }
      tableComponent={
        <DashboardSection title="System Status" icon={<Activity size={18} />}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            {SYSTEM_STATUS.map((system, i) => {
              const Icon = system.icon;
              return (
                <div
                  key={i}
                  style={{
                    padding: '16px',
                    background: 'var(--surface-secondary)',
                    borderRadius: '10px',
                    border: `1px solid ${system.status === 'operational' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                          system.status === 'operational'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                        color: system.status === 'operational' ? '#10B981' : '#F59E0B',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{system.name}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        background:
                          system.status === 'operational'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                        color: system.status === 'operational' ? '#10B981' : '#F59E0B',
                        textTransform: 'capitalize',
                      }}
                    >
                      {system.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {system.uptime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardSection>
      }
      activityComponent={
        <LiveActivityFeed activities={RECENT_ACTIVITIES} title="System Activity" />
      }
      quickActionsComponent={
        <AIQuickActions actions={QUICK_ACTIONS} onAction={handleAction} layout="horizontal" />
      }
    />
  );
}
