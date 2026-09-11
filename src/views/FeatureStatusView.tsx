import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { CheckCircle, Clock, LayoutDashboard, Settings, UserCircle, Shield, FileText, Bot, Share2, BarChart3 } from 'lucide-react';

const PageWrap = styled.div`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #1E293B;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  color: #64748B;
  margin: 0;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const MetricCard = styled.div`
  background: #FFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  border: 1px solid #E2E8F0;
`;

const MetricLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const MetricValue = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #0F172A;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const FeatureRow = styled.div<{ $status: 'Functional' | 'Pending' | 'In Progress' }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFF;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid ${p => p.$status === 'Functional' ? '#10B981' : p.$status === 'In Progress' ? '#F59E0B' : '#E2E8F0'};
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
`;

const FeatureInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrap = styled.div<{ $status: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$status === 'Functional' ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)'};
  color: ${p => p.$status === 'Functional' ? '#10B981' : '#64748B'};
`;

const FeatureName = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1E293B;
`;

const FeatureDesc = styled.div`
  font-size: 0.85rem;
  color: #64748B;
  margin-top: 4px;
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${p => p.$status === 'Functional' ? '#ECFDF5' : p.$status === 'In Progress' ? '#FFFBEB' : '#F1F5F9'};
  color: ${p => p.$status === 'Functional' ? '#059669' : p.$status === 'In Progress' ? '#D97706' : '#64748B'};
`;

interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'Functional' | 'Pending' | 'In Progress';
  icon: any;
}

const FEATURES: Feature[] = [
  { id: '1', name: 'Tenancy Contract Preparation', description: 'MD capability to instantly generate compliant Ejari tenancy contracts', status: 'Functional', icon: FileText },
  { id: '2', name: 'Auth Module', description: 'Secure enterprise login, JWT issuance, and RBAC permissions', status: 'Functional', icon: Shield },
  { id: '3', name: 'MD User Profile', description: 'Managing Director profile settings and delegation controls', status: 'Functional', icon: UserCircle },
  { id: '4', name: 'Agent Gamification Dashboard', description: 'KPI tracking, XP, and leaderboards for real estate agents', status: 'Functional', icon: BarChart3 },
  { id: '5', name: 'WhatsApp Bot Integration', description: 'Automated lead capture via WhatsApp APIs', status: 'In Progress', icon: Share2 },
  { id: '6', name: 'AI Market Intelligence', description: 'Automated predictive pricing models via @Oracle', status: 'Pending', icon: Bot },
  { id: '7', name: 'Off-Plan Portal', description: 'Project management for Emaar, Damac off-plan sales', status: 'Pending', icon: LayoutDashboard },
  { id: '8', name: 'Post-Dated Cheque (PDC) Tracking', description: 'Financial workflows for tracking bounced cheques', status: 'In Progress', icon: Settings },
];

const FeatureStatusView: FC = () => {
  const [filter, setFilter] = useState<'All' | 'Functional' | 'Pending'>('All');

  const filteredFeatures = FEATURES.filter(f => filter === 'All' || f.status === filter);
  
  const functionalCount = FEATURES.filter(f => f.status === 'Functional').length;
  const pendingCount = FEATURES.filter(f => f.status === 'Pending').length;
  const progressCount = FEATURES.filter(f => f.status === 'In Progress').length;

  return (
    <PageWrap data-testid="feature-status-page">
      <Header>
        <Title>CRM Feature Implementation Status</Title>
        <Subtitle>Managing Director Dashboard - Live System Health & Readiness</Subtitle>
      </Header>

      <MetricsGrid>
        <MetricCard>
          <MetricLabel>Total Capabilities</MetricLabel>
          <MetricValue>{FEATURES.length}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Functional (Working)</MetricLabel>
          <MetricValue style={{color: '#10B981'}}>{functionalCount}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>In Progress</MetricLabel>
          <MetricValue style={{color: '#F59E0B'}}>{progressCount}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Pending Deployment</MetricLabel>
          <MetricValue style={{color: '#64748B'}}>{pendingCount}</MetricValue>
        </MetricCard>
      </MetricsGrid>

      <FeatureGrid>
        {filteredFeatures.map(feat => {
          const Icon = feat.icon;
          return (
            <FeatureRow key={feat.id} $status={feat.status}>
              <FeatureInfo>
                <IconWrap $status={feat.status}>
                  <Icon size={24} />
                </IconWrap>
                <div>
                  <FeatureName>{feat.name}</FeatureName>
                  <FeatureDesc>{feat.description}</FeatureDesc>
                </div>
              </FeatureInfo>
              <StatusBadge $status={feat.status}>
                {feat.status === 'Functional' ? <CheckCircle size={16} /> : <Clock size={16} />}
                {feat.status}
              </StatusBadge>
            </FeatureRow>
          )
        })}
      </FeatureGrid>
    </PageWrap>
  );
};

export default FeatureStatusView;
