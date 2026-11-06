// FILE: src/components/crm/TenantManager/TenantManagerView.tsx
/**
 * White Caves Real Estate LLC - Tenant Manager Presentational Layer
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import {
  Home,
  FileCheck,
  CreditCard,
  Wrench,
  ClipboardCheck,
  ShieldCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { useTenantManager } from './TenantManager.logic';
import { TenantManagerFallback } from './TenantManager.fallback';
import { TenantLeaseWidget } from './TenantLeaseWidget';
import { TenantInspectionWidget } from './TenantInspectionWidget';
import {
  Container,
  Header,
  MetricsGrid,
  MetricCard,
  TabsNav,
  TabBtn,
  SectionCard,
  DataTable,
  StatusPill,
} from './TenantManager.styles';

export const TenantManagerView: FC = () => {
  const {
    activeTab,
    setActiveTab,
    lease,
    payments,
    inspections,
    tickets,
    metrics,
    error,
    setError,
    signLease,
    resolveSnag,
  } = useTenantManager();

  if (error) {
    return <TenantManagerFallback error={error} onRetry={() => setError(null)} />;
  }

  return (
    <Container data-testid="tenant-manager-view">
      <Header>
        <div className="title-area">
          <h1>
            <Home size={26} color="#ef4444" />
            <span>Sovereign Tenant Portal</span>
          </h1>
          <p>
            {lease.propertyTitle} — {lease.unitNumber} ({lease.community})
          </p>
        </div>
        <div className="badge-area">
          <StatusPill $variant="paid">
            <ShieldCheck size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Active Ejari Verified
          </StatusPill>
        </div>
      </Header>

      {/* 5 Metric Cards */}
      <MetricsGrid>
        <MetricCard $accent="rgba(59, 130, 246, 0.4)">
          <div className="label">
            <span>Annual Rent</span>
            <Home size={15} color="#60a5fa" />
          </div>
          <div className="value">AED {metrics.annualRentAed.toLocaleString()}</div>
          <div className="sub">{lease.paymentFrequency}</div>
        </MetricCard>

        <MetricCard $accent="rgba(34, 197, 94, 0.4)">
          <div className="label">
            <span>Paid to Date</span>
            <CreditCard size={15} color="#4ade80" />
          </div>
          <div className="value">AED {metrics.totalPaidAed.toLocaleString()}</div>
          <div className="sub">2 of 4 Installments Cleared</div>
        </MetricCard>

        <MetricCard $accent="rgba(245, 158, 11, 0.4)">
          <div className="label">
            <span>Next Installment Due</span>
            <Calendar size={15} color="#fbbf24" />
          </div>
          <div className="value">AED {metrics.upcomingPaymentAmountAed.toLocaleString()}</div>
          <div className="sub">Due Date: {metrics.nextPaymentDueDate}</div>
        </MetricCard>

        <MetricCard $accent="rgba(239, 68, 68, 0.4)">
          <div className="label">
            <span>Maintenance Orders</span>
            <Wrench size={15} color="#f87171" />
          </div>
          <div className="value">{metrics.openTicketsCount} Active</div>
          <div className="sub">Scheduled Tech Visits</div>
        </MetricCard>

        <MetricCard $accent="rgba(168, 85, 247, 0.4)">
          <div className="label">
            <span>Lease Countdown</span>
            <Calendar size={15} color="#c084fc" />
          </div>
          <div className="value">{metrics.leaseDaysRemaining} Days</div>
          <div className="sub">Expires {lease.endDate}</div>
        </MetricCard>
      </MetricsGrid>

      {/* Navigation Tabs */}
      <TabsNav>
        <TabBtn
          $active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          data-testid="tab-tenant-overview"
        >
          <Home size={15} /> Overview
        </TabBtn>
        <TabBtn
          $active={activeTab === 'lease'}
          onClick={() => setActiveTab('lease')}
          data-testid="tab-tenant-lease"
        >
          <FileCheck size={15} /> Ejari Lease
        </TabBtn>
        <TabBtn
          $active={activeTab === 'payments'}
          onClick={() => setActiveTab('payments')}
          data-testid="tab-tenant-payments"
        >
          <CreditCard size={15} /> Rent Payments & Receipts
        </TabBtn>
        <TabBtn
          $active={activeTab === 'maintenance'}
          onClick={() => setActiveTab('maintenance')}
          data-testid="tab-tenant-maintenance"
        >
          <Wrench size={15} /> Maintenance Requests
        </TabBtn>
        <TabBtn
          $active={activeTab === 'inspection'}
          onClick={() => setActiveTab('inspection')}
          data-testid="tab-tenant-inspection"
        >
          <ClipboardCheck size={15} /> Snag Checklist
        </TabBtn>
      </TabsNav>

      {/* Lease & Ejari Widget */}
      {(activeTab === 'overview' || activeTab === 'lease') && (
        <TenantLeaseWidget lease={lease} onSignLease={signLease} />
      )}

      {/* Payment Schedule Table */}
      {(activeTab === 'overview' || activeTab === 'payments') && (
        <SectionCard>
          <h2 className="section-title">
            <CreditCard size={18} color="#ef4444" />
            <span>Rental Payment Schedule & Official Receipts</span>
          </h2>
          <DataTable>
            <thead>
              <tr>
                <th>Installment</th>
                <th>Cheque / Ref No.</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Official Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.installmentLabel}</strong>
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>{p.chequeOrRefNumber}</td>
                  <td>{p.dueDate}</td>
                  <td>
                    <strong>AED {p.amountAed.toLocaleString()}</strong>
                  </td>
                  <td>{p.paymentMethod}</td>
                  <td>
                    <StatusPill $variant={p.status}>{p.status}</StatusPill>
                  </td>
                  <td>
                    {p.receiptNumber ? (
                      <span style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: 11 }}>
                        {p.receiptNumber}
                      </span>
                    ) : (
                      <span style={{ color: '#64748b' }}>Pending Maturity</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </SectionCard>
      )}

      {/* Maintenance Requests */}
      {(activeTab === 'overview' || activeTab === 'maintenance') && (
        <SectionCard>
          <h2 className="section-title">
            <Wrench size={18} color="#ef4444" />
            <span>Active Maintenance Tickets & Repair Requests</span>
          </h2>
          <DataTable>
            <thead>
              <tr>
                <th>Ticket No.</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Scheduled Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'monospace' }}>{t.ticketNumber}</td>
                  <td>{t.title}</td>
                  <td style={{ textTransform: 'capitalize' }}>{t.category.replace('_', ' ')}</td>
                  <td>
                    <StatusPill $variant={t.priority}>{t.priority}</StatusPill>
                  </td>
                  <td>
                    <StatusPill $variant={t.status}>{t.status.replace('_', ' ')}</StatusPill>
                  </td>
                  <td>{t.scheduledDate || 'TBD'}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </SectionCard>
      )}

      {/* Inspection Snag Checklist */}
      {activeTab === 'inspection' && (
        <TenantInspectionWidget items={inspections} onResolveItem={resolveSnag} />
      )}
    </Container>
  );
};

export default TenantManagerView;
