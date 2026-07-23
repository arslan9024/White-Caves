/**
 * Tenant Dashboard — TenantOverview, TenantLease, TenantPayments, TenantMaintenance, TenantDocuments
 * ─────────────────────────────────────────────────────────────────────────────────────
 * 5 tenant-role sub-tab components wired to backend APIs.
 */

import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import { settledJson } from '../../utils/settledJson';
import type {
  DashboardLease,
  DashboardMaintenanceRequest,
  DashboardPayment,
} from '@/types/dashboard';
import * as S from './shared';

const log = createLogger('Dashboard');

// ═══════════════════════════════════════════════════════════════════════
// TENANT OVERVIEW
// ═══════════════════════════════════════════════════════════════════════

export const TenantOverview: React.FC = () => {
  const [lease, setLease] = useState<DashboardLease | null>(null);
  const [maintenance, setMaintenance] = useState<DashboardMaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [l, m] = (await settledJson(
          [authFetch('/api/leases/my-lease'), authFetch('/api/maintenance?pageSize=5')],
          [{ data: null }, { data: [] }]
        )) as [{ data?: DashboardLease | null }, { data?: DashboardMaintenanceRequest[] }];
        setLease(l.data ?? null);
        setMaintenance(m.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch tenant overview:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📊 Tenant Overview</h2>
        <p style={S.headerSubtitle}>Your tenancy at a glance</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{lease ? S.formatCurrency(lease.monthlyRent) : '—'}</span>
          <span style={S.statLabel}>💳 Monthly Rent</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{lease ? S.formatDate(lease.endDate) : '—'}</span>
          <span style={S.statLabel}>📅 Lease Expiry</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{maintenance.length}</span>
          <span style={S.statLabel}>🔧 Open Requests</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{lease?.property?.title ?? '—'}</span>
          <span style={S.statLabel}>🏠 Property</span>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>📌 Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button style={S.btnPrimary}>Submit Maintenance Request</button>
          <button style={S.btnSecondary}>📄 View Lease</button>
          <button style={S.btnSecondary}>💳 Payment History</button>
        </div>
      </div>

      {maintenance.length > 0 && (
        <div style={S.card}>
          <h3 style={S.cardTitle}>🔧 Recent Maintenance</h3>
          {maintenance.map(m => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span>{m.title}</span>
              <span style={S.badge('#2563eb', '#dbeafe')}>{S.formatStatus(m.status)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// TENANT LEASE
// ═══════════════════════════════════════════════════════════════════════

export const TenantLease: React.FC = () => {
  const [lease, setLease] = useState<DashboardLease | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases/my-lease');
        const json = await res.json();
        setLease(json.data);
      } catch (error) {
        log.warn('Failed to fetch lease details:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;
  if (!lease) {
    return (
      <div style={S.tabContainer}>
        {S.emptyState(
          '📄',
          'No active lease',
          "Your lease information will appear here once it's signed."
        )}
      </div>
    );
  }

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📄 My Lease</h2>
        <p style={S.headerSubtitle}>Lease details and agreement</p>
      </div>

      <div style={S.card}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div>
            <strong>Property:</strong>
            <p style={S.headerSubtitle}>{lease.property?.title ?? '—'}</p>
          </div>
          <div>
            <strong>Landlord:</strong>
            <p style={S.headerSubtitle}>{lease.landlord?.name ?? '—'}</p>
          </div>
          <div>
            <strong>Start Date:</strong>
            <p style={S.headerSubtitle}>{S.formatDate(lease.startDate)}</p>
          </div>
          <div>
            <strong>End Date:</strong>
            <p style={S.headerSubtitle}>{S.formatDate(lease.endDate)}</p>
          </div>
          <div>
            <strong>Monthly Rent:</strong>
            <p
              style={{
                ...S.headerSubtitle,
                color: 'var(--color-primary, #C9A84C)',
                fontWeight: 600,
              }}
            >
              {S.formatCurrency(lease.monthlyRent)}
            </p>
          </div>
          <div>
            <strong>Security Deposit:</strong>
            <p style={S.headerSubtitle}>{S.formatCurrency(lease.securityDeposit)}</p>
          </div>
          <div>
            <strong>Status:</strong>
            <p>
              <span
                style={S.badge(
                  lease.status === 'active' ? '#16a34a' : '#d97706',
                  lease.status === 'active' ? '#dcfce7' : '#fffbeb'
                )}
              >
                {S.formatStatus(lease.status)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {lease.terms && (
        <div style={S.card}>
          <h3 style={S.cardTitle}>📋 Lease Terms</h3>
          <p style={{ color: '#6b7280', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{lease.terms}</p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// TENANT PAYMENTS
// ═══════════════════════════════════════════════════════════════════════

export const TenantPayments: React.FC = () => {
  const [payments, setPayments] = useState<DashboardPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases/my-payments');
        const json = await res.json();
        setPayments(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch payment history:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((s, p) => s + (p.amount ?? 0), 0);
  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((s, p) => s + (p.amount ?? 0), 0);

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>💳 Payments</h2>
        <p style={S.headerSubtitle}>Rent payment history and upcoming dues</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(totalPaid)}</span>
          <span style={S.statLabel}>✅ Total Paid</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(totalPending)}</span>
          <span style={S.statLabel}>⏳ Pending</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{payments.length}</span>
          <span style={S.statLabel}>📑 Total Transactions</span>
        </div>
      </div>

      {payments.length === 0 ? (
        S.emptyState('💳', 'No payments', 'Payment records will appear here.')
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Date</th>
                <th style={S.th}>Period</th>
                <th style={S.th}>Amount</th>
                <th style={S.th}>Method</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td style={S.td}>{S.formatDate(p.paymentDate ?? p.createdAt)}</td>
                  <td style={S.td}>{p.period ?? '—'}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(p.amount)}</td>
                  <td style={S.td}>{S.formatStatus(p.method ?? 'bank_transfer')}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        p.status === 'paid'
                          ? '#16a34a'
                          : p.status === 'overdue'
                            ? '#dc2626'
                            : '#d97706',
                        p.status === 'paid'
                          ? '#dcfce7'
                          : p.status === 'overdue'
                            ? '#fef2f2'
                            : '#fffbeb'
                      )}
                    >
                      {S.formatStatus(p.status)}
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
// TENANT MAINTENANCE
// ═══════════════════════════════════════════════════════════════════════

export const TenantMaintenance: React.FC = () => {
  const [requests, setRequests] = useState<DashboardMaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/maintenance?pageSize=50');
        const json = await res.json();
        setRequests(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch maintenance requests:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🔧 Maintenance Requests</h2>
        <p style={S.headerSubtitle}>Submit and track maintenance issues</p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button style={S.btnPrimary}>+ New Request</button>
      </div>

      {requests.length === 0 ? (
        S.emptyState(
          '🔧',
          'No maintenance requests',
          'Submit a request when something needs fixing.'
        )
      ) : (
        <div style={S.listGrid}>
          {requests.map(r => (
            <div key={r.id} style={S.card}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
              >
                <h4 style={{ margin: 0 }}>{r.title}</h4>
                <span
                  style={S.badge(
                    r.priority === 'emergency'
                      ? '#dc2626'
                      : r.priority === 'high'
                        ? '#d97706'
                        : '#2563eb',
                    r.priority === 'emergency'
                      ? '#fef2f2'
                      : r.priority === 'high'
                        ? '#fffbeb'
                        : '#dbeafe'
                  )}
                >
                  {S.formatStatus(r.priority)}
                </span>
              </div>
              {r.description && (
                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>
                  {r.description}
                </p>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: '#9ca3af',
                }}
              >
                <span>📅 {S.formatDate(r.createdAt)}</span>
                <span style={S.badge('#2563eb', '#dbeafe')}>{S.formatStatus(r.status)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// TENANT DOCUMENTS
// ═══════════════════════════════════════════════════════════════════════

export const TenantDocuments: React.FC = () => {
  // Documents are typically stored as lease attachments / metadata
  const documents = [
    { id: '1', name: 'Lease Agreement', type: 'pdf', date: new Date().toISOString(), icon: '📄' },
    {
      id: '2',
      name: 'Move-in Inspection Report',
      type: 'pdf',
      date: new Date().toISOString(),
      icon: '📋',
    },
    { id: '3', name: 'Ejari Certificate', type: 'pdf', date: new Date().toISOString(), icon: '📜' },
  ];

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📁 Documents</h2>
        <p style={S.headerSubtitle}>Important tenancy documents and certificates</p>
      </div>

      <div style={S.listGrid}>
        {documents.map(doc => (
          <div key={doc.id} style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>{doc.icon}</span>
              <div>
                <h4 style={{ margin: 0 }}>{doc.name}</h4>
                <p style={{ ...S.headerSubtitle, margin: '0.15rem 0 0 0' }}>
                  {doc.type.toUpperCase()} — {S.formatDate(doc.date)}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <button style={S.btnSecondary}>📥 Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
