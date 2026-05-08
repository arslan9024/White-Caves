/**
 * LandlordPaymentsTab — Phase 29: Live API integration
 *
 * Payment schedule derived from active leases.
 * Each lease = one payment entry per month (using nextPaymentDue).
 * Clicking a row fetches that lease''s PDC schedule.
 *
 * @component
 */

import React, { FC, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import '../../../pages/RolePages.css';

// ── API shapes ────────────────────────────────────────────────────────────────

interface ApiLease {
  id: string;
  propertyId: string;
  tenantId: string;
  monthlyRent: number;
  depositAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  nextPaymentDue?: string | null;
  tenant: { id: string; name: string; email: string } | null;
  property: { id: string; title: string; location: string } | null;
}

interface ApiPdc {
  id: string;
  chequeNumber?: string | null;
  amount: number;
  dueDate: string;
  status: string;
}

// ── Internal view model ───────────────────────────────────────────────────────

interface PaymentEntry {
  id: string; // leaseId
  property: string;
  tenant: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

function derivePaymentStatus(lease: ApiLease): 'paid' | 'pending' | 'overdue' {
  if (lease.status === 'terminated' || lease.status === 'expired') return 'paid';
  if (!lease.nextPaymentDue) return 'pending';
  const due = new Date(lease.nextPaymentDue);
  const today = new Date();
  return due < today ? 'overdue' : 'pending';
}

// ── PDC detail modal ──────────────────────────────────────────────────────────

interface PdcModalProps {
  leaseId: string;
  property: string;
  tenant: string;
  onClose: () => void;
}

const PdcModal: FC<PdcModalProps> = ({ leaseId, property, tenant, onClose }) => {
  const [pdcList, setPdcList] = useState<ApiPdc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    authFetch(`/api/leases/${leaseId}/pdc`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setPdcList(data.data ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [leaseId]);

  return (
    <div
      className="modal-overlay"
      data-testid="payment-detail-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close payment details"
        >
          ×
        </button>
        <h4>PDC Schedule — {property}</h4>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Tenant: {tenant}</p>

        {loading ? (
          <p>⏳ Loading cheque schedule…</p>
        ) : pdcList.length === 0 ? (
          <p>No PDC cheques recorded for this lease.</p>
        ) : (
          <div className="payments-list">
            {pdcList.map(p => (
              <div key={p.id} className="payment-row" data-testid={`pdc-row-${p.id}`}>
                <div>
                  <strong>
                    {new Date(p.dueDate).toLocaleDateString('en-AE', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </strong>
                  {p.chequeNumber && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      #{p.chequeNumber}
                    </p>
                  )}
                </div>
                <p>AED {p.amount.toLocaleString()}</p>
                <span className={`status-badge status-${p.status}`}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const LandlordPaymentsTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeaseId, setSelectedLeaseId] = useState<string | null>(null);
  const [leases, setLeases] = useState<ApiLease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    authFetch('/api/leases?role=landlord&pageSize=100')
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setLeases(data.data ?? []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError((err as Error).message || 'Failed to load payment data');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const payments: PaymentEntry[] = useMemo(
    () =>
      leases.map(lease => ({
        id: lease.id,
        property: lease.property?.title ?? 'Unknown Property',
        tenant: lease.tenant?.name ?? 'Unknown Tenant',
        dueDate: lease.nextPaymentDue
          ? new Date(lease.nextPaymentDue).toLocaleDateString('en-AE')
          : 'N/A',
        amount: lease.monthlyRent,
        status: derivePaymentStatus(lease),
      })),
    [leases]
  );

  const filteredPayments = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return payments.filter(payment => {
      const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
      const searchMatch =
        normalizedSearch.length === 0 ||
        payment.property.toLowerCase().includes(normalizedSearch) ||
        payment.tenant.toLowerCase().includes(normalizedSearch);
      return statusMatch && searchMatch;
    });
  }, [payments, searchQuery, statusFilter]);

  const summary = useMemo(
    () => ({
      totalMonthlyIncome: payments.reduce((sum, p) => sum + p.amount, 0),
      collectedThisMonth: payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0),
      outstandingBalance: payments
        .filter(p => p.status === 'pending' || p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0),
    }),
    [payments]
  );

  const selectedPayment = useMemo(
    () => payments.find(p => p.id === selectedLeaseId) ?? null,
    [payments, selectedLeaseId]
  );

  const formatCurrency = (amount: number) => `AED ${amount.toLocaleString()}`;

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your payment schedule.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-state" data-testid="payments-loading">
        <p>⏳ Loading payment data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state" data-testid="payments-error">
        <p>⚠️ {error}</p>
        <button className="btn-secondary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="tab-content-section landlord-payments-tab">
      <div className="tab-header">
        <h3>Rent Payments</h3>
        <p>Track rent collection, pending invoices, and overdue payments across your portfolio.</p>
      </div>

      <div className="summary-grid" data-testid="payments-summary">
        <div className="summary-card" data-testid="summary-total-monthly-income">
          <h4>Total Scheduled</h4>
          <p>{formatCurrency(summary.totalMonthlyIncome)}</p>
        </div>
        <div className="summary-card" data-testid="summary-collected-this-month">
          <h4>Collected</h4>
          <p>{formatCurrency(summary.collectedThisMonth)}</p>
        </div>
        <div className="summary-card" data-testid="summary-outstanding-balance">
          <h4>Outstanding</h4>
          <p>{formatCurrency(summary.outstandingBalance)}</p>
        </div>
      </div>

      <div className="tab-controls">
        <input
          data-testid="payment-search"
          type="text"
          placeholder="Search by property or tenant"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
        />

        <select
          data-testid="payment-status-filter"
          value={statusFilter}
          onChange={event =>
            setStatusFilter(event.target.value as 'all' | 'paid' | 'pending' | 'overdue')
          }
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="empty-state" data-testid="payments-empty-state">
          <p>No payments match your current filters.</p>
        </div>
      ) : (
        <div className="payments-list" data-testid="payments-list">
          {filteredPayments.map(payment => (
            <button
              type="button"
              key={payment.id}
              className="payment-row"
              data-testid={`payment-row-${payment.id}`}
              onClick={() => setSelectedLeaseId(payment.id)}
            >
              <div>
                <strong>{payment.property}</strong>
                <p>{payment.tenant}</p>
              </div>
              <div>
                <p>Due: {payment.dueDate}</p>
              </div>
              <div>
                <p>{formatCurrency(payment.amount)}/month</p>
                <span className={`status-badge status-${payment.status}`}>{payment.status}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedPayment && selectedLeaseId && (
        <PdcModal
          leaseId={selectedLeaseId}
          property={selectedPayment.property}
          tenant={selectedPayment.tenant}
          onClose={() => setSelectedLeaseId(null)}
        />
      )}
    </div>
  );
};

export default LandlordPaymentsTab;
