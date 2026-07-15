/**
 * Agent Dashboard — LeasingPipeline, LeasingProperties, LeaseContracts, LeasingViewings,
 *                   TenantApplications, LeaseRenewals, SalesPipeline, SalesLeads, ActiveDeals, AgentPerformance
 * ─────────────────────────────────────────────────────────────────────────────────────
 * 10 agent sub-tab components (6 leasing-agent + 4 sales-agent), wired to backend APIs.
 */

import React, { useEffect, useState, useMemo, FC } from 'react';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import { useTranslation, Text } from '../../context/TranslationContext';
import { CurrencyViewer } from '../ui/CurrencyViewer';
import type {
  DashboardLease,
  DashboardProperty,
  DashboardViewing,
  DashboardApplication,
  DashboardOffer,
  DashboardLead,
  DashboardAgentStats,
} from '@/types/dashboard';
import * as S from './shared';

const log = createLogger('Dashboard');

// ═══════════════════════════════════════════════════════════════════════
// LEASING AGENT — PIPELINE
// ═══════════════════════════════════════════════════════════════════════

export interface LeasingPipelineProps {}

export const LeasingPipeline: FC<LeasingPipelineProps> = () => {
  const [leases, setLeases] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases?pageSize=100');
        const json = await res.json();
        setLeases(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch leases:', error);
      }
      setLoading(false);
    })();
  }, []);

  const grouped = useMemo(() => {
    const stages = ['inquiry', 'viewing', 'application', 'contract', 'signed', 'active'];
    return stages.map(s => ({
      stage: s,
      items: leases.filter(l => l.stage === s || l.status === s),
    }));
  }, [leases]);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>
          📊 <Text tid="agent.leasing.pipeline" />
        </h2>
        <p style={S.headerSubtitle}>
          {t('agent.leasing.active_transactions').replace('{count}', leases.length.toString())}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grouped.length}, minmax(200px, 1fr))`,
          gap: '0.75rem',
          overflowX: 'auto',
        }}
      >
        {grouped.map(g => (
          <div
            key={g.stage}
            style={{
              background: 'var(--bg-secondary, #f9fafb)',
              borderRadius: '12px',
              padding: '0.75rem',
              minHeight: '200px',
            }}
          >
            <h4
              style={{
                textTransform: 'capitalize',
                fontSize: '0.85rem',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary, #6b7280)',
              }}
            >
              <Text tid={`agent.leasing.${g.stage}`} /> ({g.items.length})
            </h4>
            {g.items.map(l => (
              <div key={l.id} style={{ ...S.card, marginBottom: '0.5rem', padding: '0.75rem' }}>
                <strong style={{ fontSize: '0.85rem' }}>
                  {l.property?.title ?? l.propertyId ?? '—'}
                </strong>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary, #6b7280)',
                    margin: '0.25rem 0 0 0',
                  }}
                >
                  {l.tenant?.name ?? <Text tid="agent.leasing.pending" />} —{' '}
                  <CurrencyViewer value={l.monthlyRent ?? 0} />
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// LEASING AGENT — PROPERTIES
// ═══════════════════════════════════════════════════════════════════════

export const LeasingProperties: React.FC = () => {
  const [properties, setProperties] = useState<DashboardProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/properties?type=rent&pageSize=50');
        const json = await res.json();
        setProperties(json.data ?? json.properties ?? []);
      } catch (error) {
        log.warn('Failed to fetch properties:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🏠 Leasing Properties</h2>
        <p style={S.headerSubtitle}>{properties.length} rental listings</p>
      </div>
      {properties.length === 0 ? (
        S.emptyState('🏠', 'No rental properties', 'Add rental properties to start leasing.')
      ) : (
        <div style={S.listGrid}>
          {properties.map(p => (
            <div key={p.id} style={S.card}>
              <h4 style={{ margin: '0 0 0.25rem 0' }}>{p.title}</h4>
              <p style={{ ...S.headerSubtitle, margin: 0 }}>📍 {p.location}</p>
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#6b7280',
                }}
              >
                <span>🛏️ {p.bedrooms ?? 0} BR</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary, #E31E24)' }}>
                  {S.formatCurrency(p.price)}/yr
                </span>
                <span
                  style={S.badge(
                    p.status === 'available' ? '#16a34a' : '#d97706',
                    p.status === 'available' ? '#dcfce7' : '#fffbeb'
                  )}
                >
                  {S.formatStatus(p.status ?? 'available')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// LEASING AGENT — CONTRACTS
// ═══════════════════════════════════════════════════════════════════════

export const LeaseContracts: React.FC = () => {
  const [leases, setLeases] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases?pageSize=50');
        const json = await res.json();
        setLeases(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch lease contracts:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📄 Lease Contracts</h2>
        <p style={S.headerSubtitle}>{leases.length} contracts</p>
      </div>
      {leases.length === 0 ? (
        S.emptyState('📄', 'No contracts', 'Contracts will appear when leases are created.')
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Property</th>
                <th style={S.th}>Tenant</th>
                <th style={S.th}>Start</th>
                <th style={S.th}>End</th>
                <th style={S.th}>Rent</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leases.map(l => (
                <tr key={l.id}>
                  <td style={S.td}>{l.property?.title ?? '—'}</td>
                  <td style={S.td}>{l.tenant?.name ?? '—'}</td>
                  <td style={S.td}>{S.formatDate(l.startDate)}</td>
                  <td style={S.td}>{S.formatDate(l.endDate)}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(l.monthlyRent)}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        l.status === 'active'
                          ? '#16a34a'
                          : l.status === 'expired'
                            ? '#dc2626'
                            : '#d97706',
                        l.status === 'active'
                          ? '#dcfce7'
                          : l.status === 'expired'
                            ? '#fef2f2'
                            : '#fffbeb'
                      )}
                    >
                      {S.formatStatus(l.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// LEASING AGENT — VIEWINGS
// ═══════════════════════════════════════════════════════════════════════

export const LeasingViewings: React.FC = () => {
  const [viewings, setViewings] = useState<DashboardViewing[]>([]);
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<DashboardViewing[]>([]);
  const [past, setPast] = useState<DashboardViewing[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/viewings?pageSize=50');
        const json = await res.json();
        setViewings(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch viewings:', error);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const compute = async () => {
      const now = Date.now();
      setUpcoming(
        viewings.filter(v => {
          const ts = v.scheduledDate ? Date.parse(String(v.scheduledDate)) : 0;
          return ts >= now;
        })
      );
      setPast(
        viewings.filter(v => {
          const ts = v.scheduledDate ? Date.parse(String(v.scheduledDate)) : 0;
          return ts < now;
        })
      );
    };
    compute();
  }, [viewings]);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>👁️ Property Viewings</h2>
        <p style={S.headerSubtitle}>
          {upcoming.length} upcoming, {past.length} completed
        </p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{upcoming.length}</span>
          <span style={S.statLabel}>📅 Upcoming</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{past.length}</span>
          <span style={S.statLabel}>✅ Completed</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{viewings.length}</span>
          <span style={S.statLabel}>📊 Total</span>
        </div>
      </div>

      {viewings.length === 0 ? (
        S.emptyState(
          '👁️',
          'No viewings scheduled',
          'Schedule viewings to show properties to prospective tenants.'
        )
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Property</th>
                <th style={S.th}>Client</th>
                <th style={S.th}>Date & Time</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {viewings.map(v => (
                <tr key={v.id}>
                  <td style={S.td}>{v.property?.title ?? '—'}</td>
                  <td style={S.td}>{v.lead?.name ?? v.user?.name ?? '—'}</td>
                  <td style={S.td}>{S.formatDate(v.scheduledDate)}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        v.status === 'confirmed'
                          ? '#16a34a'
                          : v.status === 'cancelled'
                            ? '#dc2626'
                            : '#d97706',
                        v.status === 'confirmed'
                          ? '#dcfce7'
                          : v.status === 'cancelled'
                            ? '#fef2f2'
                            : '#fffbeb'
                      )}
                    >
                      {S.formatStatus(v.status)}
                    </span>
                  </td>
                  <td style={S.td}>{v.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// LEASING AGENT — TENANT APPLICATIONS
// ═══════════════════════════════════════════════════════════════════════

export const TenantApplications: React.FC = () => {
  const [applications, setApplications] = useState<DashboardApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/job-applications?type=tenant&pageSize=50');
        const json = await res.json();
        setApplications(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch applications:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📋 Tenant Applications</h2>
        <p style={S.headerSubtitle}>{applications.length} applications to review</p>
      </div>
      {applications.length === 0 ? (
        S.emptyState(
          '📋',
          'No applications',
          'Tenant applications will appear when prospective tenants apply.'
        )
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Applicant</th>
                <th style={S.th}>Property</th>
                <th style={S.th}>Applied On</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(a => (
                <tr key={a.id}>
                  <td style={S.td}>
                    <strong>{a.applicantName ?? a.user?.name ?? '—'}</strong>
                  </td>
                  <td style={S.td}>{a.property?.title ?? '—'}</td>
                  <td style={S.td}>{S.formatDate(a.createdAt)}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        a.status === 'approved'
                          ? '#16a34a'
                          : a.status === 'rejected'
                            ? '#dc2626'
                            : '#d97706',
                        a.status === 'approved'
                          ? '#dcfce7'
                          : a.status === 'rejected'
                            ? '#fef2f2'
                            : '#fffbeb'
                      )}
                    >
                      {S.formatStatus(a.status)}
                    </span>
                  </td>
                  <td style={S.td}>{a.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// LEASING AGENT — LEASE RENEWALS
// ═══════════════════════════════════════════════════════════════════════

export const LeaseRenewals: React.FC = () => {
  const [expiring, setExpiring] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases/expiring?days=90');
        const json = await res.json();
        setExpiring(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch expiring leases:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🔄 Lease Renewals</h2>
        <p style={S.headerSubtitle}>{expiring.length} leases expiring within 90 days</p>
      </div>
      {expiring.length === 0 ? (
        S.emptyState(
          '🔄',
          'No upcoming renewals',
          'All leases are current. Renewals will appear as end dates approach.'
        )
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Property</th>
                <th style={S.th}>Tenant</th>
                <th style={S.th}>Expires</th>
                <th style={S.th}>Monthly Rent</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {expiring.map(l => (
                <tr key={l.id}>
                  <td style={S.td}>{l.property?.title ?? '—'}</td>
                  <td style={S.td}>{l.tenant?.name ?? '—'}</td>
                  <td style={{ ...S.td, color: '#d97706', fontWeight: 600 }}>
                    {S.formatDate(l.endDate)}
                  </td>
                  <td style={S.td}>{S.formatCurrency(l.monthlyRent)}</td>
                  <td style={S.td}>
                    <span style={S.badge('#d97706', '#fffbeb')}>Expiring</span>
                  </td>
                  <td style={S.td}>
                    <button style={S.btnPrimary}>Initiate Renewal</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SALES AGENT — PIPELINE
// ═══════════════════════════════════════════════════════════════════════

export const SalesPipeline: React.FC = () => {
  const [offers, setOffers] = useState<DashboardOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/offers?pageSize=100');
        const json = await res.json();
        setOffers(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch offers:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const stages = ['new', 'negotiation', 'accepted', 'closing', 'completed'];
  const grouped = stages.map(s => ({
    stage: s,
    items: offers.filter(o => o.status === s),
  }));
  const totalValue = offers.reduce((sum, o) => sum + (o.amount ?? 0), 0);

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📊 Sales Pipeline</h2>
        <p style={S.headerSubtitle}>
          {offers.length} deals — {S.formatCurrency(totalValue)} total value
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${stages.length}, minmax(200px, 1fr))`,
          gap: '0.75rem',
          overflowX: 'auto',
        }}
      >
        {grouped.map(g => (
          <div
            key={g.stage}
            style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '0.75rem',
              minHeight: '200px',
            }}
          >
            <h4
              style={{
                textTransform: 'capitalize',
                fontSize: '0.85rem',
                color: '#6b7280',
                marginBottom: '0.5rem',
              }}
            >
              {g.stage} ({g.items.length})
            </h4>
            {g.items.map(o => (
              <div key={o.id} style={{ ...S.card, marginBottom: '0.5rem', padding: '0.75rem' }}>
                <strong style={{ fontSize: '0.85rem' }}>{o.property?.title ?? '—'}</strong>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  {S.formatCurrency(o.amount)}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SALES AGENT — LEADS
// ═══════════════════════════════════════════════════════════════════════

export const SalesLeads: React.FC = () => {
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leads?pageSize=50');
        const json = await res.json();
        setLeads(json.data ?? json.leads ?? []);
      } catch (error) {
        log.warn('Failed to fetch leads:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🎯 Sales Leads</h2>
        <p style={S.headerSubtitle}>{leads.length} leads</p>
      </div>
      {leads.length === 0 ? (
        S.emptyState('🎯', 'No leads', 'Leads will appear when potential buyers express interest.')
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Name</th>
                <th style={S.th}>Source</th>
                <th style={S.th}>Property Interest</th>
                <th style={S.th}>Budget</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Last Contact</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id}>
                  <td style={S.td}>
                    <strong>{l.name}</strong>
                  </td>
                  <td style={S.td}>{S.formatStatus(l.source ?? 'direct')}</td>
                  <td style={S.td}>{l.propertyInterest ?? '—'}</td>
                  <td style={S.td}>{S.formatCurrency(l.budget)}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        l.status === 'hot'
                          ? '#dc2626'
                          : l.status === 'warm'
                            ? '#d97706'
                            : '#16a34a',
                        l.status === 'hot' ? '#fef2f2' : l.status === 'warm' ? '#fffbeb' : '#dcfce7'
                      )}
                    >
                      {S.formatStatus(l.status ?? 'new')}
                    </span>
                  </td>
                  <td style={S.td}>{S.formatDate(l.lastContactDate ?? l.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SALES AGENT — ACTIVE DEALS
// ═══════════════════════════════════════════════════════════════════════

export const ActiveDeals: React.FC = () => {
  const [offers, setOffers] = useState<DashboardOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/offers?status=accepted,negotiation,closing&pageSize=50');
        const json = await res.json();
        setOffers(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch active deals:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const totalValue = offers.reduce((sum, o) => sum + (o.amount ?? 0), 0);

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🤝 Active Deals</h2>
        <p style={S.headerSubtitle}>
          {offers.length} active — {S.formatCurrency(totalValue)}
        </p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{offers.length}</span>
          <span style={S.statLabel}>🤝 Active Deals</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(totalValue)}</span>
          <span style={S.statLabel}>💰 Pipeline Value</span>
        </div>
      </div>

      {offers.length === 0 ? (
        S.emptyState('🤝', 'No active deals', 'Active deals will appear as offers are accepted.')
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Property</th>
                <th style={S.th}>Buyer</th>
                <th style={S.th}>Offer Amount</th>
                <th style={S.th}>Stage</th>
                <th style={S.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(o => (
                <tr key={o.id}>
                  <td style={S.td}>{o.property?.title ?? '—'}</td>
                  <td style={S.td}>{o.buyer?.name ?? o.user?.name ?? '—'}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(o.amount)}</td>
                  <td style={S.td}>
                    <span style={S.badge('#2563eb', '#dbeafe')}>{S.formatStatus(o.status)}</span>
                  </td>
                  <td style={S.td}>{S.formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SALES AGENT — PERFORMANCE
// ═══════════════════════════════════════════════════════════════════════

export const AgentPerformance: React.FC = () => {
  const [stats, setStats] = useState<DashboardAgentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/offers/stats');
        const json = await res.json();
        setStats(json.data);
      } catch (error) {
        log.warn('Failed to fetch agent stats:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📈 Agent Performance</h2>
        <p style={S.headerSubtitle}>Your sales metrics and achievements</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.totalDeals ?? 0}</span>
          <span style={S.statLabel}>🤝 Total Deals</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(stats?.totalVolume ?? 0)}</span>
          <span style={S.statLabel}>💰 Total Volume</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.closedThisMonth ?? 0}</span>
          <span style={S.statLabel}>📅 Closed This Month</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.conversionRate ?? '—'}%</span>
          <span style={S.statLabel}>📊 Conversion Rate</span>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>🏆 Monthly Target</h3>
        <div
          style={{
            background: '#f3f4f6',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '24px',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(((stats?.closedThisMonth ?? 0) / (stats?.monthlyTarget ?? 10)) * 100, 100)}%`,
              background: 'linear-gradient(90deg, #E31E24, #B8860B)',
              borderRadius: '8px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
          {stats?.closedThisMonth ?? 0} / {stats?.monthlyTarget ?? 10} deals closed
        </p>
      </div>
    </div>
  );
};
