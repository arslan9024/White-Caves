import React, { useState } from 'react';
import { Briefcase, ClipboardCheck, Truck, Wrench, Book, CheckCircle2 } from 'lucide-react';
import MixedDashboard, { DashboardSection } from './MixedDashboard';
import AnimatedStatsBar from './AnimatedStatsBar';
import LifecycleFlowchart from './LifecycleFlowchart';
import AIQuickActions from './AIQuickActions';
import LiveActivityFeed from './LiveActivityFeed';
import { DEPT_ASSISTANT_MAP } from '../../../data/departmentAssistantMap';

const SERVICES_STATS = [
  { id: 'requests', label: 'Active Requests', value: 87, change: 15, icon: <ClipboardCheck size={20} />, iconBg: 'rgba(59, 130, 246, 0.1)', highlight: true },
  { id: 'inprogress', label: 'In Progress', value: 34, icon: <Wrench size={20} />, iconBg: 'rgba(245, 158, 11, 0.1)' },
  { id: 'completed', label: 'Completed (MTD)', value: 156, change: 22, icon: <CheckCircle2 size={20} />, iconBg: 'rgba(16, 185, 129, 0.1)' },
  { id: 'satisfaction', label: 'Satisfaction', value: '4.8', suffix: '/5', change: 3, icon: <Book size={20} />, iconBg: 'rgba(212, 175, 55, 0.1)' }
];

const SERVICE_LIFECYCLE = ['Requested', 'Assigned', 'In Progress', 'Review', 'Completed', 'Invoiced'];

const STAGE_DATA = {
  'Requested': { count: 23 },
  'Assigned': { count: 18 },
  'In Progress': { count: 34, alert: true },
  'Review': { count: 12 },
  'Completed': { count: 156 },
  'Invoiced': { count: 142 }
};

const QUICK_ACTIONS = [
  { id: 'new', label: 'New Request', icon: 'plus', variant: 'primary' },
  { id: 'assign', label: 'Auto-Assign', icon: 'bot', badge: 'Sophia' },
  { id: 'vendors', label: 'Manage Vendors', icon: 'settings' },
  { id: 'report', label: 'Service Report', icon: 'chart' }
];

const RECENT_ACTIVITIES = [
  { id: 1, icon: 'success', actor: 'Sophia', action: 'completed service', target: 'Move-in Inspection', timestamp: '15 min ago', type: 'success' },
  { id: 2, icon: 'ai', actor: 'Ethan', action: 'assigned vendor for', target: 'AC Maintenance', timestamp: '30 min ago', type: 'default' },
  { id: 3, icon: 'pending', actor: 'System', action: 'scheduled', target: 'Deep Cleaning x5', timestamp: '1 hour ago', type: 'pending' },
  { id: 4, icon: 'success', actor: 'Vendor', action: 'completed', target: 'Painting Service', timestamp: '2 hours ago', type: 'success' }
];

export default function ServicesMixedDashboard({ subItem = 'service-catalog', selectedAssistant }) {
  const [currentStage, setCurrentStage] = useState(2);
  const deptConfig = DEPT_ASSISTANT_MAP.services;
  
  const handleStageClick = (stage, index) => setCurrentStage(index);
  const handleAction = (action) => {};

  return (
    <MixedDashboard
      departmentId="services"
      departmentLabel={deptConfig.label}
      assistantId={selectedAssistant}
      assistantName={selectedAssistant ? selectedAssistant.charAt(0).toUpperCase() + selectedAssistant.slice(1) : 'Sophia'}
      statsComponent={<AnimatedStatsBar stats={SERVICES_STATS} />}
      flowchartComponent={
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Service Request Lifecycle
          </h4>
          <LifecycleFlowchart 
            stages={SERVICE_LIFECYCLE}
            currentStage={currentStage}
            stageData={STAGE_DATA}
            onStageClick={handleStageClick}
          />
        </div>
      }
      tableComponent={
        <DashboardSection title="Active Service Requests" icon={<Briefcase size={18} />}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Service</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Property</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Vendor</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { service: 'Deep Cleaning', property: 'Marina 2BR', vendor: 'CleanPro', status: 'In Progress' },
                { service: 'AC Maintenance', property: 'Downtown 3BR', vendor: 'CoolAir', status: 'Assigned' },
                { service: 'Move-out Inspection', property: 'JBR Studio', vendor: 'Internal', status: 'Requested' },
                { service: 'Painting', property: 'Palm Villa', vendor: 'PaintMasters', status: 'Review' }
              ].map((req, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontSize: '0.85rem', fontWeight: 500 }}>{req.service}</td>
                  <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.property}</td>
                  <td style={{ padding: '12px', fontSize: '0.85rem' }}>{req.vendor}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500,
                      background: req.status === 'In Progress' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: req.status === 'In Progress' ? '#F59E0B' : '#3B82F6'
                    }}>{req.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardSection>
      }
      activityComponent={<LiveActivityFeed activities={RECENT_ACTIVITIES} title="Service Activity" />}
      quickActionsComponent={<AIQuickActions actions={QUICK_ACTIONS} onAction={handleAction} layout="horizontal" />}
    />
  );
}
