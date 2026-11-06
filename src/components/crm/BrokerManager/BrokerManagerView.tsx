// FILE: src/components/crm/BrokerManager/BrokerManagerView.tsx
/**
 * White Caves Real Estate LLC - Broker Manager Presentational Layer
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import {
  Briefcase,
  DollarSign,
  Users,
  Award,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useBrokerManager } from './BrokerManager.logic';
import { BrokerManagerFallback } from './BrokerManager.fallback';
import { BrokerCommissionWidget } from './BrokerCommissionWidget';
import { BrokerLeadsWidget } from './BrokerLeadsWidget';
import {
  Container,
  Header,
  MetricsGrid,
  MetricCard,
  TabsNav,
  TabBtn,
  SectionCard,
  StatusPill,
} from './BrokerManager.styles';

export const BrokerManagerView: FC = () => {
  const {
    activeTab,
    setActiveTab,
    deals,
    leads,
    reraProfile,
    metrics,
    error,
    setError,
    requestPayout,
    contactLead,
  } = useBrokerManager();

  if (error) {
    return <BrokerManagerFallback error={error} onRetry={() => setError(null)} />;
  }

  return (
    <Container data-testid="broker-manager-view">
      <Header>
        <div className="title-area">
          <h1>
            <Briefcase size={26} color="#ef4444" />
            <span>Sovereign Licensed Broker Hub</span>
          </h1>
          <p>
            Broker {reraProfile.brokerName} | RERA BRN #{reraProfile.brnNumber} | ORN #
            {reraProfile.officeOrn}
          </p>
        </div>
        <div className="badge-area">
          <StatusPill $variant={reraProfile.reraStatus}>
            <ShieldCheck size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            RERA Certified Broker L2
          </StatusPill>
        </div>
      </Header>

      {/* Top 5 Metrics */}
      <MetricsGrid>
        <MetricCard $accent="rgba(34, 197, 94, 0.4)">
          <div className="label">
            <span>Closed Volume</span>
            <TrendingUp size={15} color="#4ade80" />
          </div>
          <div className="value">AED {(metrics.totalClosedVolumeAed / 1000000).toFixed(1)}M</div>
          <div className="sub">Lifetime Gross Sales</div>
        </MetricCard>

        <MetricCard $accent="rgba(59, 130, 246, 0.4)">
          <div className="label">
            <span>YTD Net Commission</span>
            <DollarSign size={15} color="#60a5fa" />
          </div>
          <div className="value">AED {metrics.ytdCommissionAed.toLocaleString()}</div>
          <div className="sub">50% Standard Agent Split</div>
        </MetricCard>

        <MetricCard $accent="rgba(245, 158, 11, 0.4)">
          <div className="label">
            <span>Pending Payouts</span>
            <Clock size={15} color="#fbbf24" />
          </div>
          <div className="value">AED {metrics.pendingPayoutsAed.toLocaleString()}</div>
          <div className="sub">In DLD Escrow Processing</div>
        </MetricCard>

        <MetricCard $accent="rgba(239, 68, 68, 0.4)">
          <div className="label">
            <span>Assigned Leads</span>
            <Users size={15} color="#f87171" />
          </div>
          <div className="value">{metrics.activeLeadsCount} Active</div>
          <div className="sub">15-min SLA Active</div>
        </MetricCard>

        <MetricCard $accent="rgba(168, 85, 247, 0.4)">
          <div className="label">
            <span>RERA Card Expiry</span>
            <Award size={15} color="#c084fc" />
          </div>
          <div className="value">{metrics.reraDaysToExpiry} Days</div>
          <div className="sub">Expires {reraProfile.reraCardExpiry}</div>
        </MetricCard>
      </MetricsGrid>

      {/* Navigation Tabs */}
      <TabsNav>
        <TabBtn
          $active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          data-testid="tab-broker-overview"
        >
          <Briefcase size={15} /> Overview
        </TabBtn>
        <TabBtn
          $active={activeTab === 'commissions'}
          onClick={() => setActiveTab('commissions')}
          data-testid="tab-broker-commissions"
        >
          <DollarSign size={15} /> Commission Schedule
        </TabBtn>
        <TabBtn
          $active={activeTab === 'leads'}
          onClick={() => setActiveTab('leads')}
          data-testid="tab-broker-leads"
        >
          <Users size={15} /> Client Leads (SLA)
        </TabBtn>
        <TabBtn
          $active={activeTab === 'compliance'}
          onClick={() => setActiveTab('compliance')}
          data-testid="tab-broker-compliance"
        >
          <Award size={15} /> RERA Compliance & Permits
        </TabBtn>
      </TabsNav>

      {/* Commission Widget */}
      {(activeTab === 'overview' || activeTab === 'commissions') && (
        <BrokerCommissionWidget deals={deals} onRequestPayout={requestPayout} />
      )}

      {/* Leads Widget */}
      {(activeTab === 'overview' || activeTab === 'leads') && (
        <BrokerLeadsWidget leads={leads} onContactLead={contactLead} />
      )}

      {/* Compliance Section */}
      {(activeTab === 'overview' || activeTab === 'compliance') && (
        <SectionCard data-testid="broker-compliance-widget">
          <h2 className="section-title">
            <Award size={18} color="#ef4444" />
            <span>Dubai Land Department RERA Broker Compliance Credentials</span>
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            <div style={{ background: '#1e293b', padding: 16, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Broker Registration Number (BRN)</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
                {reraProfile.brnNumber}
              </div>
              <div style={{ fontSize: 11, color: '#4ade80', marginTop: 4 }}>
                <CheckCircle size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Active RERA Card
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: 16, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Authorized Trakheesi Permits</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
                {reraProfile.trakheesiPermitsActive} Active Listings
              </div>
              <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>
                Verified Advertising Permits
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: 16, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                Continuing Professional Development (CPD)
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
                {reraProfile.cpdHoursCompleted} / {reraProfile.cpdHoursRequired} Hours
              </div>
              <div style={{ fontSize: 11, color: '#4ade80', marginTop: 4 }}>
                Compliance Requirement Fulfilled
              </div>
            </div>
          </div>
        </SectionCard>
      )}
    </Container>
  );
};

export default BrokerManagerView;
