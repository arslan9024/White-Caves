import React, { useState } from 'react';
import { Home, Building, Image, Video, PlusCircle, Grid3X3, ListPlus, Workflow } from 'lucide-react';
import MixedDashboard, { DashboardSection } from './MixedDashboard';
import AnimatedStatsBar from './AnimatedStatsBar';
import LifecycleFlowchart from './LifecycleFlowchart';
import AIQuickActions from './AIQuickActions';
import LiveActivityFeed from './LiveActivityFeed';
import { DEPT_ASSISTANT_MAP } from '../../../data/departmentAssistantMap';

const PROPERTY_STATS = [
  { id: 'total', label: 'Total Properties', value: 847, change: 5, icon: <Building size={20} />, iconBg: 'rgba(10, 26, 58, 0.1)', highlight: true },
  { id: 'active', label: 'Active Listings', value: 234, change: 12, icon: <ListPlus size={20} />, iconBg: 'rgba(16, 185, 129, 0.1)' },
  { id: 'pending', label: 'Pending Review', value: 18, icon: <Grid3X3 size={20} />, iconBg: 'rgba(245, 158, 11, 0.1)' },
  { id: 'offplan', label: 'Off-Plan Projects', value: 45, change: 8, icon: <Workflow size={20} />, iconBg: 'rgba(139, 92, 246, 0.1)' }
];

const PROPERTY_LIFECYCLE = ['Draft', 'Review', 'Listed', 'Under Offer', 'Sold/Rented', 'Archived'];

const STAGE_DATA = {
  'Draft': { count: 23 },
  'Review': { count: 18, alert: true },
  'Listed': { count: 234 },
  'Under Offer': { count: 42 },
  'Sold/Rented': { count: 156 },
  'Archived': { count: 374 }
};

const QUICK_ACTIONS = [
  { id: 'add', label: 'Add Property', icon: 'plus', variant: 'primary' },
  { id: 'import', label: 'Bulk Import', icon: 'upload' },
  { id: 'damac', label: 'DAMAC Fetch', icon: 'download', badge: 'Mary' },
  { id: 'quality', label: 'Quality Check', icon: 'search' }
];

const RECENT_ACTIVITIES = [
  { id: 1, icon: 'success', actor: 'Mary', action: 'added 12 properties from', target: 'DAMAC Hills', timestamp: '5 min ago', type: 'success' },
  { id: 2, icon: 'ai', actor: 'Henry', action: 'verified documents for', target: 'Palm Jumeirah Villa', timestamp: '12 min ago', type: 'default' },
  { id: 3, icon: 'property', actor: 'Olivia', action: 'updated pricing for', target: '8 Marina listings', timestamp: '30 min ago', type: 'default' },
  { id: 4, icon: 'success', actor: 'Mason', action: 'approved listing', target: 'Downtown 3BR Apt', timestamp: '1 hour ago', type: 'success' },
  { id: 5, icon: 'ai', actor: 'Sam', action: 'generated virtual tour for', target: 'JBR Penthouse', timestamp: '2 hours ago', type: 'default' }
];

const FEATURED_PROPERTIES = [
  { id: 1, title: 'Palm Jumeirah Villa', type: 'Villa', beds: 5, price: 'AED 25M', status: 'Listed', image: '/placeholder-villa.jpg' },
  { id: 2, title: 'Downtown Penthouse', type: 'Penthouse', beds: 4, price: 'AED 18M', status: 'Under Offer', image: '/placeholder-apt.jpg' },
  { id: 3, title: 'Marina 3BR Apt', type: 'Apartment', beds: 3, price: 'AED 4.2M', status: 'Listed', image: '/placeholder-marina.jpg' },
  { id: 4, title: 'DIFC Office Space', type: 'Commercial', beds: null, price: 'AED 8.5M', status: 'Review', image: '/placeholder-office.jpg' }
];

export default function PropertiesMixedDashboard({ subItem = 'portfolio', selectedAssistant }) {
  const [currentStage, setCurrentStage] = useState(2);
  const deptConfig = DEPT_ASSISTANT_MAP.properties;
  
  const handleStageClick = (stage, index) => {
    setCurrentStage(index);
  };

  const handleAction = (action) => {
    
  };

  return (
    <MixedDashboard
      departmentId="properties"
      departmentLabel={deptConfig.label}
      assistantId={selectedAssistant}
      assistantName={selectedAssistant ? selectedAssistant.charAt(0).toUpperCase() + selectedAssistant.slice(1) : 'Mary'}
      statsComponent={<AnimatedStatsBar stats={PROPERTY_STATS} />}
      flowchartComponent={
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Property Listing Lifecycle
          </h4>
          <LifecycleFlowchart 
            stages={PROPERTY_LIFECYCLE}
            currentStage={currentStage}
            stageData={STAGE_DATA}
            onStageClick={handleStageClick}
          />
        </div>
      }
      tableComponent={
        <DashboardSection title="Featured Properties" icon={<Home size={18} />}>
          <div className="property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {FEATURED_PROPERTIES.map((property) => (
              <div key={property.id} style={{
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'var(--surface-secondary)'
              }}>
                <div style={{
                  height: '120px',
                  background: 'linear-gradient(135deg, #1A1A1A 0%, #1a2d52 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B03737'
                }}>
                  <Home size={40} />
                </div>
                <div style={{ padding: '14px' }}>
                  <h5 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: 600 }}>{property.title}</h5>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {property.type} {property.beds && `• ${property.beds} Beds`}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#B03737' }}>{property.price}</span>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '10px',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      background: property.status === 'Listed' ? 'rgba(16, 185, 129, 0.1)' : 
                                 property.status === 'Under Offer' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: property.status === 'Listed' ? '#10B981' : 
                             property.status === 'Under Offer' ? '#F59E0B' : '#3B82F6'
                    }}>
                      {property.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>
      }
      activityComponent={<LiveActivityFeed activities={RECENT_ACTIVITIES} title="Inventory Activity" />}
      quickActionsComponent={<AIQuickActions actions={QUICK_ACTIONS} onAction={handleAction} layout="horizontal" />}
    />
  );
}
