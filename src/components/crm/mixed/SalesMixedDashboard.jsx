import React, { useState } from 'react';
import { Target, Users, DollarSign, TrendingUp, UserPlus, Handshake, ArrowRight } from 'lucide-react';
import MixedDashboard, { DashboardSection } from './MixedDashboard';
import AnimatedStatsBar from './AnimatedStatsBar';
import LifecycleFlowchart from './LifecycleFlowchart';
import AIQuickActions from './AIQuickActions';
import LiveActivityFeed from './LiveActivityFeed';
import { DEPT_ASSISTANT_MAP } from '../../../data/departmentAssistantMap';

const SALES_STATS = [
  { id: 'leads', label: 'Active Leads', value: 156, change: 12, icon: <Users size={20} />, iconBg: 'rgba(59, 130, 246, 0.1)', highlight: true },
  { id: 'deals', label: 'Open Deals', value: 42, change: 8, icon: <Handshake size={20} />, iconBg: 'rgba(16, 185, 129, 0.1)' },
  { id: 'pipeline', label: 'Pipeline Value', value: 24500000, prefix: 'AED ', suffix: '', change: 15, icon: <DollarSign size={20} />, iconBg: 'rgba(212, 175, 55, 0.1)' },
  { id: 'conversion', label: 'Conversion Rate', value: '18%', change: 3, icon: <TrendingUp size={20} />, iconBg: 'rgba(139, 92, 246, 0.1)' }
];

const SALES_LIFECYCLE = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const STAGE_DATA = {
  'Lead': { count: 89 },
  'Qualified': { count: 34 },
  'Proposal': { count: 18 },
  'Negotiation': { count: 12, alert: true },
  'Closed Won': { count: 28 },
  'Closed Lost': { count: 8 }
};

const QUICK_ACTIONS = [
  { id: 'new-lead', label: 'Add Lead', icon: 'plus', variant: 'primary' },
  { id: 'import', label: 'Import Leads', icon: 'upload' },
  { id: 'assign', label: 'Auto-Assign', icon: 'bot', badge: '12' },
  { id: 'report', label: 'Generate Report', icon: 'chart' }
];

const RECENT_ACTIVITIES = [
  { id: 1, icon: 'success', actor: 'Clara', action: 'qualified lead', target: 'Ahmed Al Maktoum', timestamp: '2 min ago', type: 'success' },
  { id: 2, icon: 'pending', actor: 'Liam', action: 'sent proposal to', target: 'Dubai Holdings', timestamp: '15 min ago', type: 'pending' },
  { id: 3, icon: 'ai', actor: 'Ella', action: 'auto-scored 12 new leads', timestamp: '1 hour ago', type: 'default' },
  { id: 4, icon: 'success', actor: 'Phoebe', action: 'closed deal worth', target: 'AED 2.5M', timestamp: '2 hours ago', type: 'success' },
  { id: 5, icon: 'message', actor: 'System', action: 'scheduled follow-up for', target: '8 leads', timestamp: '3 hours ago', type: 'default' }
];

export default function SalesMixedDashboard({ subItem = 'leads', selectedAssistant }) {
  const [currentStage, setCurrentStage] = useState(2);
  const deptConfig = DEPT_ASSISTANT_MAP.sales;
  
  const handleStageClick = (stage, index) => {
    setCurrentStage(index);
  };

  const handleAction = (action) => {
    console.log('Sales action:', action);
  };

  return (
    <MixedDashboard
      departmentId="sales"
      departmentLabel={deptConfig.label}
      assistantId={selectedAssistant}
      assistantName={selectedAssistant ? selectedAssistant.charAt(0).toUpperCase() + selectedAssistant.slice(1) : 'Ella'}
      statsComponent={<AnimatedStatsBar stats={SALES_STATS} />}
      flowchartComponent={
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Sales Pipeline Flow
          </h4>
          <LifecycleFlowchart 
            stages={SALES_LIFECYCLE}
            currentStage={currentStage}
            stageData={STAGE_DATA}
            onStageClick={handleStageClick}
          />
        </div>
      }
      tableComponent={
        <DashboardSection title="Active Deals" icon={<Handshake size={18} />}>
          <div className="deals-table">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Client</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Property</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Value</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Stage</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Agent</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { client: 'Mohammed Al Rashid', property: 'Palm Jumeirah Villa', value: 'AED 12.5M', stage: 'Negotiation', agent: 'Liam' },
                  { client: 'Sarah Thompson', property: 'DIFC Penthouse', value: 'AED 8.2M', stage: 'Proposal', agent: 'Phoebe' },
                  { client: 'Ahmed Kazim', property: 'Marina Apt 3BR', value: 'AED 3.8M', stage: 'Qualified', agent: 'Ella' },
                  { client: 'Elena Petrova', property: 'Downtown Tower', value: 'AED 5.1M', stage: 'Negotiation', agent: 'Liam' }
                ].map((deal, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontSize: '0.85rem', fontWeight: 500 }}>{deal.client}</td>
                    <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{deal.property}</td>
                    <td style={{ padding: '12px', fontSize: '0.85rem', fontWeight: 600, color: '#D4AF37' }}>{deal.value}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        background: deal.stage === 'Negotiation' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: deal.stage === 'Negotiation' ? '#F59E0B' : '#3B82F6'
                      }}>
                        {deal.stage}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.85rem' }}>{deal.agent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardSection>
      }
      activityComponent={<LiveActivityFeed activities={RECENT_ACTIVITIES} title="Sales Activity" />}
      quickActionsComponent={<AIQuickActions actions={QUICK_ACTIONS} onAction={handleAction} layout="horizontal" />}
    />
  );
}
