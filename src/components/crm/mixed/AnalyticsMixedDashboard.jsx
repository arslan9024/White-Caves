import React, { useState } from 'react';
import { BarChart3, TrendingUp, FileBarChart, LineChart, Award, Database, Zap } from 'lucide-react';
import MixedDashboard, { DashboardSection } from './MixedDashboard';
import AnimatedStatsBar from './AnimatedStatsBar';
import LifecycleFlowchart from './LifecycleFlowchart';
import AIQuickActions from './AIQuickActions';
import LiveActivityFeed from './LiveActivityFeed';
import { DEPT_ASSISTANT_MAP } from '../../../data/departmentAssistantMap';

const ANALYTICS_STATS = [
  { id: 'reports', label: 'Reports Generated', value: 156, change: 25, icon: <FileBarChart size={20} />, iconBg: 'rgba(59, 130, 246, 0.1)', highlight: true },
  { id: 'insights', label: 'AI Insights', value: 342, change: 18, icon: <Zap size={20} />, iconBg: 'rgba(212, 175, 55, 0.1)' },
  { id: 'accuracy', label: 'Forecast Accuracy', value: '94%', change: 3, icon: <TrendingUp size={20} />, iconBg: 'rgba(16, 185, 129, 0.1)' },
  { id: 'actions', label: 'Actions Taken', value: 89, icon: <Award size={20} />, iconBg: 'rgba(139, 92, 246, 0.1)' }
];

const ANALYTICS_LIFECYCLE = ['Data Collection', 'Processing', 'Analysis', 'Insights', 'Report', 'Action'];

const STAGE_DATA = {
  'Data Collection': { count: 12 },
  'Processing': { count: 8 },
  'Analysis': { count: 15 },
  'Insights': { count: 45 },
  'Report': { count: 156 },
  'Action': { count: 89 }
};

const QUICK_ACTIONS = [
  { id: 'report', label: 'Generate Report', icon: 'chart', variant: 'primary' },
  { id: 'forecast', label: 'AI Forecast', icon: 'zap', badge: 'Coral' },
  { id: 'export', label: 'Export Data', icon: 'download' },
  { id: 'schedule', label: 'Schedule Report', icon: 'file' }
];

const RECENT_ACTIVITIES = [
  { id: 1, icon: 'success', actor: 'Coral', action: 'generated market analysis for', target: 'Palm Jumeirah', timestamp: '30 min ago', type: 'success' },
  { id: 2, icon: 'ai', actor: 'Celeste', action: 'predicted Q1 2026 trends', timestamp: '1 hour ago', type: 'default' },
  { id: 3, icon: 'ai', actor: 'Sage', action: 'identified pricing opportunity in', target: 'Downtown', timestamp: '2 hours ago', type: 'default' },
  { id: 4, icon: 'success', actor: 'System', action: 'completed weekly dashboard update', timestamp: '3 hours ago', type: 'success' }
];

export default function AnalyticsMixedDashboard({ subItem = 'market-dashboard', selectedAssistant }) {
  const [currentStage, setCurrentStage] = useState(4);
  const deptConfig = DEPT_ASSISTANT_MAP.analytics;
  
  const handleStageClick = (stage, index) => setCurrentStage(index);
  const handleAction = (action) => console.log('Analytics action:', action);

  return (
    <MixedDashboard
      departmentId="analytics"
      departmentLabel={deptConfig.label}
      assistantId={selectedAssistant}
      assistantName={selectedAssistant ? selectedAssistant.charAt(0).toUpperCase() + selectedAssistant.slice(1) : 'Coral'}
      statsComponent={<AnimatedStatsBar stats={ANALYTICS_STATS} />}
      flowchartComponent={
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Analytics Pipeline
          </h4>
          <LifecycleFlowchart 
            stages={ANALYTICS_LIFECYCLE}
            currentStage={currentStage}
            stageData={STAGE_DATA}
            onStageClick={handleStageClick}
          />
        </div>
      }
      tableComponent={
        <DashboardSection title="Recent Reports" icon={<FileBarChart size={18} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { name: 'Dubai Market Q4 2025', type: 'Market Analysis', date: 'Jan 10, 2026', status: 'Published' },
              { name: 'Sales Performance Dec', type: 'Performance', date: 'Jan 8, 2026', status: 'Published' },
              { name: 'Rental Yield Comparison', type: 'Investment', date: 'Jan 5, 2026', status: 'Published' },
              { name: 'Q1 2026 Forecast', type: 'Prediction', date: 'Jan 2, 2026', status: 'Draft' }
            ].map((report, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '14px', 
                background: 'var(--surface-secondary)', 
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <h5 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 600 }}>{report.name}</h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{report.type} • {report.date}</span>
                </div>
                <span style={{ 
                  padding: '4px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600,
                  background: report.status === 'Published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: report.status === 'Published' ? '#10B981' : '#F59E0B'
                }}>{report.status}</span>
              </div>
            ))}
          </div>
        </DashboardSection>
      }
      activityComponent={<LiveActivityFeed activities={RECENT_ACTIVITIES} title="Analytics Activity" />}
      quickActionsComponent={<AIQuickActions actions={QUICK_ACTIONS} onAction={handleAction} layout="horizontal" />}
    />
  );
}
