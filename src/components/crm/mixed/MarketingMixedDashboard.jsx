import React, { useState } from 'react';
import { Megaphone, Rocket, MessageCircle, CalendarDays, Globe, Mail, Users, TrendingUp } from 'lucide-react';
import MixedDashboard, { DashboardSection } from './MixedDashboard';
import AnimatedStatsBar from './AnimatedStatsBar';
import LifecycleFlowchart from './LifecycleFlowchart';
import AIQuickActions from './AIQuickActions';
import LiveActivityFeed from './LiveActivityFeed';
import { DEPT_ASSISTANT_MAP } from '../../../data/departmentAssistantMap';

const MARKETING_STATS = [
  { id: 'campaigns', label: 'Active Campaigns', value: 12, change: 25, icon: <Rocket size={20} />, iconBg: 'rgba(139, 92, 246, 0.1)', highlight: true },
  { id: 'reach', label: 'Total Reach', value: 245000, change: 18, icon: <Users size={20} />, iconBg: 'rgba(59, 130, 246, 0.1)' },
  { id: 'engagement', label: 'Engagement Rate', value: '4.2%', change: 8, icon: <TrendingUp size={20} />, iconBg: 'rgba(16, 185, 129, 0.1)' },
  { id: 'leads', label: 'Leads Generated', value: 156, change: 32, icon: <MessageCircle size={20} />, iconBg: 'rgba(212, 175, 55, 0.1)' }
];

const MARKETING_LIFECYCLE = ['Planning', 'Content', 'Review', 'Scheduled', 'Live', 'Analysis'];

const STAGE_DATA = {
  'Planning': { count: 4 },
  'Content': { count: 6, alert: true },
  'Review': { count: 3 },
  'Scheduled': { count: 8 },
  'Live': { count: 12 },
  'Analysis': { count: 24 }
};

const QUICK_ACTIONS = [
  { id: 'campaign', label: 'New Campaign', icon: 'plus', variant: 'primary' },
  { id: 'whatsapp', label: 'WhatsApp Blast', icon: 'send', badge: 'Ivy' },
  { id: 'content', label: 'Content Calendar', icon: 'file' },
  { id: 'analytics', label: 'Analytics', icon: 'chart' }
];

const RECENT_ACTIVITIES = [
  { id: 1, icon: 'success', actor: 'Ivy', action: 'launched campaign', target: 'Palm Jumeirah Showcase', timestamp: '20 min ago', type: 'success' },
  { id: 2, icon: 'ai', actor: 'Walter', action: 'generated 15 posts for', target: 'Instagram', timestamp: '1 hour ago', type: 'default' },
  { id: 3, icon: 'message', actor: 'Iris', action: 'sent WhatsApp blast to', target: '2,500 contacts', timestamp: '2 hours ago', type: 'success' },
  { id: 4, icon: 'ai', actor: 'System', action: 'tracked 89 new leads from', target: 'Google Ads', timestamp: '3 hours ago', type: 'default' }
];

export default function MarketingMixedDashboard({ subItem = 'campaigns', selectedAssistant }) {
  const [currentStage, setCurrentStage] = useState(4);
  const deptConfig = DEPT_ASSISTANT_MAP.marketing;
  
  const handleStageClick = (stage, index) => setCurrentStage(index);
  const handleAction = (action) => {};

  return (
    <MixedDashboard
      departmentId="marketing"
      departmentLabel={deptConfig.label}
      assistantId={selectedAssistant}
      assistantName={selectedAssistant ? selectedAssistant.charAt(0).toUpperCase() + selectedAssistant.slice(1) : 'Ivy'}
      statsComponent={<AnimatedStatsBar stats={MARKETING_STATS} />}
      flowchartComponent={
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Campaign Lifecycle
          </h4>
          <LifecycleFlowchart 
            stages={MARKETING_LIFECYCLE}
            currentStage={currentStage}
            stageData={STAGE_DATA}
            onStageClick={handleStageClick}
          />
        </div>
      }
      tableComponent={
        <DashboardSection title="Active Campaigns" icon={<Rocket size={18} />}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { name: 'Palm Jumeirah Showcase', platform: 'Multi-channel', status: 'Live', leads: 45, budget: 'AED 25K' },
              { name: 'Downtown Launch', platform: 'Instagram + Google', status: 'Scheduled', leads: 0, budget: 'AED 15K' },
              { name: 'Marina Rentals', platform: 'WhatsApp', status: 'Live', leads: 28, budget: 'AED 5K' },
              { name: 'Off-Plan DAMAC', platform: 'Facebook + Email', status: 'Analysis', leads: 83, budget: 'AED 30K' }
            ].map((campaign, i) => (
              <div key={i} style={{ padding: '16px', background: 'var(--surface-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{campaign.name}</span>
                  <span style={{ 
                    padding: '3px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600,
                    background: campaign.status === 'Live' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: campaign.status === 'Live' ? '#10B981' : '#3B82F6'
                  }}>{campaign.status}</span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{campaign.platform}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span><strong style={{ color: '#B03737' }}>{campaign.leads}</strong> leads</span>
                  <span style={{ color: 'var(--text-muted)' }}>{campaign.budget}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>
      }
      activityComponent={<LiveActivityFeed activities={RECENT_ACTIVITIES} title="Marketing Activity" />}
      quickActionsComponent={<AIQuickActions actions={QUICK_ACTIONS} onAction={handleAction} layout="horizontal" />}
    />
  );
}
