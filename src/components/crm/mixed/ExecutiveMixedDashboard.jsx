import React from 'react';
import { Crown, TrendingUp, DollarSign, Users, Building, Target, BarChart3, Zap } from 'lucide-react';
import MixedDashboard, { DashboardSection } from './MixedDashboard';
import AnimatedStatsBar from './AnimatedStatsBar';
import LifecycleFlowchart from './LifecycleFlowchart';
import AIQuickActions, { AIActionPanel } from './AIQuickActions';
import LiveActivityFeed from './LiveActivityFeed';
import { DEPT_ASSISTANT_MAP } from '../../../data/departmentAssistantMap';

const EXECUTIVE_STATS = [
  { id: 'revenue', label: 'Monthly Revenue', value: 12500000, prefix: 'AED ', change: 18, icon: <DollarSign size={20} />, iconBg: 'rgba(16, 185, 129, 0.1)', highlight: true },
  { id: 'deals', label: 'Deals Closed', value: 42, change: 12, icon: <Target size={20} />, iconBg: 'rgba(212, 175, 55, 0.1)' },
  { id: 'properties', label: 'Active Properties', value: 847, change: 5, icon: <Building size={20} />, iconBg: 'rgba(59, 130, 246, 0.1)' },
  { id: 'team', label: 'Team Members', value: 103, icon: <Users size={20} />, iconBg: 'rgba(139, 92, 246, 0.1)' }
];

const COMPANY_LIFECYCLE = ['Planning', 'Review', 'Decision', 'Execution', 'Monitoring'];

const STAGE_DATA = {
  'Planning': { count: 8 },
  'Review': { count: 12 },
  'Decision': { count: 5, alert: true },
  'Execution': { count: 24 },
  'Monitoring': { count: 18 }
};

const QUICK_ACTIONS = [
  { id: 'report', label: 'Executive Report', icon: 'chart', variant: 'primary' },
  { id: 'kpis', label: 'View KPIs', icon: 'zap' },
  { id: 'announce', label: 'Announcement', icon: 'send' },
  { id: 'settings', label: 'Settings', icon: 'settings' }
];

const RECENT_ACTIVITIES = [
  { id: 1, icon: 'success', actor: 'Zoe', action: 'generated executive summary for', target: 'Q4 2025', timestamp: '10 min ago', type: 'success' },
  { id: 2, icon: 'ai', actor: 'System', action: 'revenue milestone reached:', target: 'AED 50M YTD', timestamp: '2 hours ago', type: 'success' },
  { id: 3, icon: 'user', actor: 'HR', action: 'onboarded 3 new team members to', target: 'Sales Dept', timestamp: '4 hours ago', type: 'default' },
  { id: 4, icon: 'success', actor: 'Ella', action: 'closed largest deal:', target: 'AED 25M Palm Villa', timestamp: 'Yesterday', type: 'success' },
  { id: 5, icon: 'ai', actor: 'Coral', action: 'published market analysis report', timestamp: 'Yesterday', type: 'default' }
];

const DEPARTMENT_PERFORMANCE = [
  { name: 'Sales', progress: 92, target: 'AED 15M', actual: 'AED 13.8M', color: '#10B981' },
  { name: 'Leasing', progress: 87, target: '350 contracts', actual: '305 contracts', color: '#3B82F6' },
  { name: 'Marketing', progress: 78, target: '500 leads', actual: '390 leads', color: '#F59E0B' },
  { name: 'Services', progress: 95, target: '200 requests', actual: '190 requests', color: '#8B5CF6' }
];

export default function ExecutiveMixedDashboard({ subItem = 'md-dashboard', selectedAssistant }) {
  const deptConfig = DEPT_ASSISTANT_MAP.executive;
  
  const handleAction = (action) => {
    
  };

  return (
    <MixedDashboard
      departmentId="executive"
      departmentLabel={deptConfig.label}
      assistantId={selectedAssistant}
      assistantName="Zoe"
      statsComponent={<AnimatedStatsBar stats={EXECUTIVE_STATS} />}
      flowchartComponent={
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Strategic Initiative Flow
          </h4>
          <LifecycleFlowchart 
            stages={COMPANY_LIFECYCLE}
            currentStage={3}
            stageData={STAGE_DATA}
          />
        </div>
      }
      tableComponent={
        <DashboardSection title="Department Performance" icon={<BarChart3 size={18} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {DEPARTMENT_PERFORMANCE.map((dept) => (
              <div key={dept.name} style={{ 
                padding: '16px',
                background: 'var(--surface-secondary)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{dept.name}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {dept.actual} / {dept.target}
                  </span>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: 'var(--border-color)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${dept.progress}%`, 
                    height: '100%', 
                    background: dept.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                <div style={{ 
                  marginTop: '6px', 
                  fontSize: '0.75rem', 
                  color: dept.progress >= 90 ? '#10B981' : dept.progress >= 75 ? '#F59E0B' : '#EF4444',
                  fontWeight: 600
                }}>
                  {dept.progress}% of target
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>
      }
      activityComponent={<LiveActivityFeed activities={RECENT_ACTIVITIES} title="Company Activity" />}
      quickActionsComponent={<AIQuickActions actions={QUICK_ACTIONS} onAction={handleAction} layout="horizontal" />}
    />
  );
}
