/**
 * Landlord Dashboard — LandlordProperties, TenantManagement, MaintenanceRequests, FinancialSummary, LeaseManagement
 * ─────────────────────────────────────────────────────────────────────────────────────
 * 5 landlord-role sub-tab components wired to backend APIs.
 */

import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import { settledJson } from '../../utils/settledJson';
import type {
  DashboardProperty,
  DashboardLease,
  DashboardMaintenanceRequest,
  DashboardMaintenanceStats,
} from '@/types/dashboard';
import * as S from './shared';

const log = createLogger('Dashboard');

// ═══════════════════════════════════════════════════════════════════════
// LANDLORD PROPERTIES
// ═══════════════════════════════════════════════════════════════════════

export const LandlordProperties: React.FC = () => {
  const [properties, setProperties] = useState<DashboardProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/properties?role=landlord&pageSize=50');
        const json = await res.json();
        setProperties(json.data ?? json.properties ?? []);
      } catch (error) { log.warn('Failed to fetch properties:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🏘️ My Properties</h2>
        <p style={S.headerSubtitle}>{properties.length} rental {properties.length === 1 ? 'property' : 'properties'}</p>
      </div>
      {properties.length === 0
        ? S.emptyState('🏘️', 'No properties', 'Add your rental properties to manage tenants and leases.')
        : (
          <div style={S.listGrid}>
            {properties.map((p) => (
              <div key={p.id} style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{p.title}</h4>
                    <p style={S.headerSubtitle}>📍 {p.location}</p>
                  </div>
                  <span style={S.badge(
                    p.status === 'active' ? '#16a34a' : '#d97706',
                    p.status === 'active' ? '#dcfce7' : '#fffbeb',
                  )}>
                    {S.formatStatus(p.status)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                  <span>🛏️ {p.bedrooms ?? 0} BR</span>
                  <span>📐 {p.sqft ?? '—'} sqft</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary, #D4AF37)' }}>{S.formatCurrency(p.price)}/yr</span>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// TENANT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════

export const TenantManagement: React.FC = () => {
  const [leases, setLeases] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases?role=landlord&pageSize=50');
        const json = await res.json();
        setLeases(json.data ?? []);
      } catch (error) { log.warn('Failed to fetch tenant leases:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>👥 Tenant Management</h2>
        <p style={S.headerSubtitle}>Active tenants and lease status</p>
      </div>
      {leases.length === 0
        ? S.emptyState('👥', 'No tenants yet', 'Tenants will appear here when leases are signed.')
        : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Tenant</th>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Rent</th>
                  <th style={S.th}>Lease End</th>
                  <th style={S.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {leases.map((l) => (
                  <tr key={l.id}>
                    <td style={S.td}>{l.tenant?.name ?? l.tenantId ?? '—'}</td>
                    <td style={S.td}>{l.property?.title ?? l.propertyId ?? '—'}</td>
                    <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(l.monthlyRent)}</td>
                    <td style={S.td}>{S.formatDate(l.endDate)}</td>
                    <td style={S.td}>
                      <span style={S.badge(
                        l.status === 'active' ? '#16a34a' : l.status === 'expiring_soon' ? '#d97706' : '#6b7280',
                        l.status === 'active' ? '#dcfce7' : l.status === 'expiring_soon' ? '#fffbeb' : '#f3f4f6',
                      )}>
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
// MAINTENANCE REQUESTS
// ═══════════════════════════════════════════════════════════════════════

export const MaintenanceRequests: React.FC = () => {
  const [requests, setRequests] = useState<DashboardMaintenanceRequest[]>([]);
  const [stats, setStats] = useState<DashboardMaintenanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [reqs, st] = await settledJson(
          [authFetch('/api/maintenance?pageSize=50'), authFetch('/api/maintenance/stats')],
          [{ data: [] }, { data: null }],
        ) as [
          { data?: DashboardMaintenanceRequest[] },
          { data?: DashboardMaintenanceStats | null },
        ];
        setRequests(reqs.data ?? []);
        setStats(st.data ?? null);
      } catch (error) { log.warn('Failed to fetch maintenance data:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const priorityColor = (p: string) => {
    if (p === 'emergency') return { c: '#dc2626', bg: '#fef2f2' };
    if (p === 'high') return { c: '#d97706', bg: '#fffbeb' };
    if (p === 'medium') return { c: '#2563eb', bg: '#dbeafe' };
    return { c: '#6b7280', bg: '#f3f4f6' };
  };

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🔧 Maintenance Requests</h2>
        <p style={S.headerSubtitle}>Track and manage property maintenance</p>
      </div>

      {stats && (
        <div style={S.statsGrid}>
          <div style={S.statCard}>
            <span style={S.statValue}>{stats.total ?? 0}</span>
            <span style={S.statLabel}>Total Requests</span>
          </div>
          <div style={S.statCard}>
            <span style={S.statValue}>{stats.open ?? 0}</span>
            <span style={S.statLabel}>🟡 Open</span>
          </div>
          <div style={S.statCard}>
            <span style={S.statValue}>{stats.inProgress ?? 0}</span>
            <span style={S.statLabel}>🔵 In Progress</span>
          </div>
          <div style={S.statCard}>
            <span style={S.statValue}>{stats.completed ?? 0}</span>
            <span style={S.statLabel}>✅ Completed</span>
          </div>
        </div>
      )}

      {requests.length === 0
        ? S.emptyState('🔧', 'No maintenance requests', 'Tenant maintenance requests will appear here.')
        : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Title</th>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Priority</th>
                  <th style={S.th}>Category</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Cost</th>
                  <th style={S.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => {
                  const pc = priorityColor(r.priority ?? '');
                  return (
                    <tr key={r.id}>
                      <td style={S.td}><strong>{r.title}</strong></td>
                      <td style={S.td}>{r.property?.title ?? '—'}</td>
                      <td style={S.td}>
                        <span style={S.badge(pc.c, pc.bg)}>{S.formatStatus(r.priority)}</span>
                      </td>
                      <td style={S.td}>{S.formatStatus(r.category ?? '—')}</td>
                      <td style={S.td}>
                        <span style={S.badge('#2563eb', '#dbeafe')}>{S.formatStatus(r.status)}</span>
                      </td>
                      <td style={S.td}>{r.cost ? S.formatCurrency(r.cost) : '—'}</td>
                      <td style={S.td}>{S.formatDate(r.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// FINANCIAL SUMMARY
// ═══════════════════════════════════════════════════════════════════════

export const FinancialSummary: React.FC = () => {
  const [leases, setLeases] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases?role=landlord&pageSize=100');
        const json = await res.json();
        setLeases(json.data ?? []);
      } catch (error) { log.warn('Failed to fetch financial data:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const activeLeases = leases.filter((l) => l.status === 'active');
  const totalMonthlyRent = activeLeases.reduce((sum, l) => sum + (l.monthlyRent ?? 0), 0);
  const totalAnnualRent = totalMonthlyRent * 12;
  const maintenanceCost = leases.reduce((sum, l) => sum + (l.maintenanceCost ?? 0), 0);

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>💰 Financial Summary</h2>
        <p style={S.headerSubtitle}>Revenue and expense overview</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(totalMonthlyRent)}</span>
          <span style={S.statLabel}>📅 Monthly Rental Income</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(totalAnnualRent)}</span>
          <span style={S.statLabel}>📆 Annual Rental Income</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{activeLeases.length}</span>
          <span style={S.statLabel}>✅ Active Leases</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(maintenanceCost)}</span>
          <span style={S.statLabel}>🔧 Maintenance Costs</span>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>📊 Income by Property</h3>
        {activeLeases.length === 0 ? (
          <p style={S.headerSubtitle}>No active leases to display.</p>
        ) : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Tenant</th>
                  <th style={S.th}>Monthly Rent</th>
                  <th style={S.th}>Lease End</th>
                </tr>
              </thead>
              <tbody>
                {activeLeases.map((l) => (
                  <tr key={l.id}>
                    <td style={S.td}>{l.property?.title ?? '—'}</td>
                    <td style={S.td}>{l.tenant?.name ?? '—'}</td>
                    <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(l.monthlyRent)}</td>
                    <td style={S.td}>{S.formatDate(l.endDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// LEASE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════

export const LeaseManagement: React.FC = () => {
  const [leases, setLeases] = useState<DashboardLease[]>([]);
  const [expiring, setExpiring] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [all, exp] = await settledJson(
          [authFetch('/api/leases?role=landlord&pageSize=50'), authFetch('/api/leases/expiring?days=60')],
          [{ data: [] }, { data: [] }],
        ) as [
          { data?: DashboardLease[] },
          { data?: DashboardLease[] },
        ];
        setLeases(all.data ?? []);
        setExpiring(exp.data ?? []);
      } catch (error) { log.warn('Failed to fetch lease data:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📝 Lease Management</h2>
        <p style={S.headerSubtitle}>{leases.length} {leases.length === 1 ? 'lease' : 'leases'} total</p>
      </div>

      {expiring.length > 0 && (
        <div style={{ ...S.card, borderColor: '#fbbf24', background: '#fffbeb' }}>
          <h3 style={S.cardTitle}>⚠️ Expiring Soon ({expiring.length})</h3>
          {expiring.map((l) => (
            <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #fde68a' }}>
              <span>{l.property?.title ?? '—'} — {l.tenant?.name ?? '—'}</span>
              <span style={{ fontWeight: 600, color: '#d97706' }}>Expires {S.formatDate(l.endDate)}</span>
            </div>
          ))}
        </div>
      )}

      {leases.length === 0
        ? S.emptyState('📝', 'No leases', 'Create leases to track tenancy agreements.')
        : (
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
                {leases.map((l) => (
                  <tr key={l.id}>
                    <td style={S.td}>{l.property?.title ?? '—'}</td>
                    <td style={S.td}>{l.tenant?.name ?? '—'}</td>
                    <td style={S.td}>{S.formatDate(l.startDate)}</td>
                    <td style={S.td}>{S.formatDate(l.endDate)}</td>
                    <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(l.monthlyRent)}</td>
                    <td style={S.td}>
                      <span style={S.badge(
                        l.status === 'active' ? '#16a34a' : l.status === 'expired' ? '#dc2626' : '#d97706',
                        l.status === 'active' ? '#dcfce7' : l.status === 'expired' ? '#fef2f2' : '#fffbeb',
                      )}>
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
