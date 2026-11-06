// FILE: src/components/crm/LandlordManager/LandlordManagerView.tsx
/**
 * White Caves Real Estate LLC - Landlord Manager Presentational Layer
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Building2, FileCheck, CreditCard, Wrench, TrendingUp, ShieldCheck } from 'lucide-react';
import { useLandlordManager } from './LandlordManager.logic';
import { LandlordManagerFallback } from './LandlordManager.fallback';
import { LandlordTenanciesWidget } from './LandlordTenanciesWidget';
import { LandlordPdcWidget } from './LandlordPdcWidget';
import {
  Container,
  Header,
  MetricsGrid,
  MetricCard,
  TabsNav,
  TabButton,
  SectionCard,
  DataTable,
  StatusPill,
  ActionButton,
} from './LandlordManager.styles';

export const LandlordManagerView: FC = () => {
  const {
    activeTab,
    setActiveTab,
    properties,
    cheques,
    tickets,
    metrics,
    error,
    setError,
    updateChequeStatus,
    updateTicketStatus,
  } = useLandlordManager();

  if (error) {
    return <LandlordManagerFallback error={error} onRetry={() => setError(null)} />;
  }

  return (
    <Container data-testid="landlord-manager-view">
      <Header>
        <div className="title-area">
          <h1>
            <Building2 size={26} color="#ef4444" />
            <span>Sovereign Landlord Asset Hub</span>
          </h1>
          <p>
            Portfolio management, PDC clearing schedules, active Ejari tenancies, and yield
            analytics
          </p>
        </div>
        <div className="actions-area">
          <StatusPill $variant="cleared">
            <ShieldCheck size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            DLD Asset Clearance L2
          </StatusPill>
        </div>
      </Header>

      {/* Top 5 Metric Cards */}
      <MetricsGrid>
        <MetricCard $accentColor="rgba(59, 130, 246, 0.4)">
          <div className="metric-header">
            <span>Portfolio Properties</span>
            <Building2 size={16} color="#60a5fa" />
          </div>
          <div className="metric-value">{metrics.totalProperties} Units</div>
          <div className="metric-sub">{metrics.occupancyRate}% Occupancy Rate</div>
        </MetricCard>

        <MetricCard $accentColor="rgba(34, 197, 94, 0.4)">
          <div className="metric-header">
            <span>Annual Gross Rent</span>
            <TrendingUp size={16} color="#4ade80" />
          </div>
          <div className="metric-value">AED {metrics.totalAnnualRentAed.toLocaleString()}</div>
          <div className="metric-sub">Contracted Lease Value</div>
        </MetricCard>

        <MetricCard $accentColor="rgba(245, 158, 11, 0.4)">
          <div className="metric-header">
            <span>Pending PDC Inflow</span>
            <CreditCard size={16} color="#fbbf24" />
          </div>
          <div className="metric-value">AED {metrics.pendingPdcAed.toLocaleString()}</div>
          <div className="metric-sub">Holding in Bank Escrow</div>
        </MetricCard>

        <MetricCard $accentColor="rgba(239, 68, 68, 0.4)">
          <div className="metric-header">
            <span>Maintenance Orders</span>
            <Wrench size={16} color="#f87171" />
          </div>
          <div className="metric-value">{metrics.activeMaintenanceTickets} Active</div>
          <div className="metric-sub">Urgent & Scheduled Repairs</div>
        </MetricCard>

        <MetricCard $accentColor="rgba(168, 85, 247, 0.4)">
          <div className="metric-header">
            <span>Net Portfolio ROI</span>
            <TrendingUp size={16} color="#c084fc" />
          </div>
          <div className="metric-value">{metrics.netRentalYieldPercent}%</div>
          <div className="metric-sub">After Service Charges</div>
        </MetricCard>
      </MetricsGrid>

      {/* Navigation Tabs */}
      <TabsNav>
        <TabButton
          $isActive={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          data-testid="tab-overview"
        >
          <Building2 size={15} /> Overview & Units
        </TabButton>
        <TabButton
          $isActive={activeTab === 'pdc'}
          onClick={() => setActiveTab('pdc')}
          data-testid="tab-pdc"
        >
          <CreditCard size={15} /> PDC Cheque Registry
        </TabButton>
        <TabButton
          $isActive={activeTab === 'tenancies'}
          onClick={() => setActiveTab('tenancies')}
          data-testid="tab-tenancies"
        >
          <FileCheck size={15} /> Leases & Ejari
        </TabButton>
        <TabButton
          $isActive={activeTab === 'maintenance'}
          onClick={() => setActiveTab('maintenance')}
          data-testid="tab-maintenance"
        >
          <Wrench size={15} /> Maintenance Requests
        </TabButton>
        <TabButton
          $isActive={activeTab === 'yield'}
          onClick={() => setActiveTab('yield')}
          data-testid="tab-yield"
        >
          <TrendingUp size={15} /> Yield & Net Cash Flow
        </TabButton>
      </TabsNav>

      {/* Tab: Overview / Units */}
      {(activeTab === 'overview' || activeTab === 'tenancies') && (
        <LandlordTenanciesWidget properties={properties} />
      )}

      {/* Tab: PDC Cheques */}
      {(activeTab === 'overview' || activeTab === 'pdc') && (
        <LandlordPdcWidget cheques={cheques} onUpdateChequeStatus={updateChequeStatus} />
      )}

      {/* Tab: Maintenance Requests */}
      {(activeTab === 'overview' || activeTab === 'maintenance') && (
        <SectionCard>
          <h2 className="section-title">
            <Wrench size={18} color="#ef4444" />
            <span>Tenant Maintenance Requests & Work Orders</span>
          </h2>
          <DataTable>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Unit</th>
                <th>Category</th>
                <th>Issue Description</th>
                <th>Priority</th>
                <th>Estimate</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'monospace' }}>{t.ticketCode}</td>
                  <td>{t.unitNumber}</td>
                  <td style={{ textTransform: 'capitalize' }}>{t.category}</td>
                  <td>{t.description}</td>
                  <td>
                    <StatusPill $variant={t.priority}>{t.priority}</StatusPill>
                  </td>
                  <td>AED {t.estimatedCostAed.toLocaleString()}</td>
                  <td>
                    <StatusPill $variant={t.status}>{t.status.replace('_', ' ')}</StatusPill>
                  </td>
                  <td>
                    {t.status === 'submitted' && (
                      <ActionButton
                        onClick={() => updateTicketStatus(t.id, 'assigned')}
                        data-testid={`btn-approve-tkt-${t.id}`}
                      >
                        Approve Order
                      </ActionButton>
                    )}
                    {t.status === 'in_progress' && (
                      <ActionButton
                        onClick={() => updateTicketStatus(t.id, 'completed')}
                        style={{ color: '#4ade80', borderColor: 'rgba(34, 197, 94, 0.4)' }}
                      >
                        Verify Complete
                      </ActionButton>
                    )}
                    {t.status === 'completed' && (
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </SectionCard>
      )}

      {/* Tab: Yield & ROI */}
      {activeTab === 'yield' && (
        <SectionCard>
          <h2 className="section-title">
            <TrendingUp size={18} color="#ef4444" />
            <span>Dubai Property Yield & Net Rental Cash Flow Analytics</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#1e293b', padding: 20, borderRadius: 10 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#f87171' }}>
                Annual Cash Flow Waterfall
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Gross Contracted Rent:</span>
                  <strong>AED {metrics.totalAnnualRentAed.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>
                    Estimated Community Service Charges (14%):
                  </span>
                  <span style={{ color: '#f87171' }}>
                    - AED {(metrics.totalAnnualRentAed * 0.14).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Maintenance & Sinking Reserve (3%):</span>
                  <span style={{ color: '#f87171' }}>
                    - AED {(metrics.totalAnnualRentAed * 0.03).toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>
                    Estimated Net Cash Inflow:
                  </span>
                  <strong style={{ color: '#4ade80' }}>
                    AED {(metrics.totalAnnualRentAed * 0.83).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: 20, borderRadius: 10 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#60a5fa' }}>
                DLD Rental Index Comparison
              </h3>
              <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
                Based on Dubai Land Department Decree No. 43 of 2013, your average portfolio return
                of <strong>{metrics.netRentalYieldPercent}%</strong> outperforms the Dubai Marina /
                Downtown benchmark by +1.4%.
              </p>
              <div style={{ marginTop: 12, fontSize: 11, color: '#94a3b8' }}>
                Next RERA Rental Calculator Assessment Window: <strong>Q1 2027</strong>
              </div>
            </div>
          </div>
        </SectionCard>
      )}
    </Container>
  );
};

export default LandlordManagerView;
