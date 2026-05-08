/**
 * TenantPaymentHistoryTab — Phase 2.9 / Phase 30: Payment History (Live API)
 *
 * Fetches the tenant's active lease then loads the PDC schedule from
 * GET /api/leases/:id/pdc.  PDC records are mapped to payment rows.
 *
 * @component
 */

import React, { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import '../../../pages/RolePages.css';

/** Late fee rate: 5% of monthly rent per bounced PDC */
const LATE_FEE_RATE = 0.05;

interface ApiLease {
  id: string;
  monthlyRent: number;
}

interface ApiPdc {
  id: string;
  chequeNumber: string;
  bankName: string;
  amount: number;
  dueDate: string;
  status: string; // pending | presented | cleared | bounced
  notes?: string | null;
}

type PaymentStatus = 'paid' | 'pending' | 'overdue';

interface PaymentRow {
  id: string;
  month: string;
  amount: number;
  paidDate: string | null;
  status: PaymentStatus;
  bankName: string;
  chequeNumber: string;
}

function pdcToPaymentRow(pdc: ApiPdc): PaymentRow {
  const due = new Date(pdc.dueDate);
  const month = due.toLocaleDateString('en-AE', { month: 'long', year: 'numeric' });
  const status: PaymentStatus =
    pdc.status === 'cleared' ? 'paid' :
    pdc.status === 'bounced' ? 'overdue' :
    'pending';
  const paidDate = pdc.status === 'cleared' ? pdc.dueDate.split('T')[0] : null;
  return { id: pdc.id, month, amount: pdc.amount, paidDate, status, bankName: pdc.bankName, chequeNumber: pdc.chequeNumber };
}

const TenantPaymentHistoryTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    authFetch('/api/leases?role=tenant&pageSize=1')
      .then(r => r.json())
      .then(async (leasesData) => {
        const lease = (leasesData.data as ApiLease[])?.[0] ?? null;
        if (!lease) return;
        setMonthlyRent(lease.monthlyRent);
        const pdcData = await authFetch(`/api/leases/${lease.id}/pdc`).then(r => r.json());
        const rows = ((pdcData.data ?? []) as ApiPdc[]).map(pdcToPaymentRow);
        setPayments(rows);
      })
      .catch(() => setError('Unable to load payment history. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredPayments = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return payments.filter(payment => {
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        payment.month.toLowerCase().includes(normalizedSearch) ||
        payment.id.toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [payments, searchQuery, statusFilter]);

  const summary = useMemo(() => {
    const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const outstanding = payments
      .filter(p => p.status === 'pending' || p.status === 'overdue')
      .reduce((s, p) => s + p.amount, 0);
    const nextPayment =
      payments.find(p => p.status === 'overdue') ??
      payments.find(p => p.status === 'pending') ??
      null;
    const overduePayments = payments.filter(p => p.status === 'overdue');
    const lateFees = overduePayments.reduce(
      (sum, p) => sum + Math.round(p.amount * LATE_FEE_RATE),
      0
    );
    return { totalPaid, outstanding, nextPayment, lateFees, overdueCount: overduePayments.length };
  }, [payments]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your payment history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state" data-testid="payment-loading">
        <p>Loading payment history…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message" data-testid="payment-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="tab-content-section tenant-payment-history-tab">
      <div className="tab-header">
        <h3>Payment History</h3>
        <p>Review monthly rent payments and outstanding balances.</p>
      </div>

      <div className="summary-grid" data-testid="tenant-payment-summary">
        <div className="summary-card" data-testid="tenant-total-paid-card">
          <h4>Total Paid</h4>
          <p>AED {summary.totalPaid.toLocaleString()}</p>
        </div>
        <div className="summary-card" data-testid="tenant-outstanding-card">
          <h4>Outstanding</h4>
          <p>AED {summary.outstanding.toLocaleString()}</p>
        </div>
        <div className="summary-card next-payment-card" data-testid="tenant-next-payment-card">
          <h4>Next Payment Due</h4>
          {summary.nextPayment ? (
            <>
              <p data-testid="tenant-next-payment-month">{summary.nextPayment.month}</p>
              <p className="next-payment-amount">
                AED {summary.nextPayment.amount.toLocaleString()}
              </p>
              {summary.nextPayment.status === 'overdue' && (
                <span className="status-badge status-overdue" data-testid="tenant-overdue-badge">
                  Overdue
                </span>
              )}
              {summary.lateFees > 0 && (
                <p
                  className="late-fee-notice"
                  data-testid="tenant-late-fee"
                  aria-label={`Late fee of AED ${summary.lateFees.toLocaleString()} applied`}
                >
                  + AED {summary.lateFees.toLocaleString()} late fee
                </p>
              )}
            </>
          ) : (
            <p data-testid="tenant-no-payment-due">No upcoming payments</p>
          )}
          <div className="pay-now-wrapper">
            <button
              type="button"
              className="btn-primary btn-disabled"
              disabled
              aria-disabled="true"
              title="Online payments coming in Phase 5"
              data-testid="tenant-pay-now-btn"
            >
              Pay Now
            </button>
            <span className="pay-now-tooltip">Online payments coming in Phase 5</span>
          </div>
        </div>
      </div>

      <div className="tab-controls">
        <input
          type="text"
          data-testid="tenant-payment-search"
          placeholder="Search by month or payment ID"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
        />
        <select
          data-testid="tenant-payment-status-filter"
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value as 'all' | PaymentStatus)}
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {payments.length === 0 ? (
        <div className="empty-state" data-testid="tenant-payment-empty-state">
          <p>
            {monthlyRent > 0
              ? 'No PDC cheques recorded yet for your lease.'
              : 'No active lease or payment records found.'}
          </p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="empty-state" data-testid="tenant-payment-filter-empty">
          <p>No payment records match your filters.</p>
        </div>
      ) : (
        <div className="payments-list" data-testid="tenant-payments-list">
          {filteredPayments.map(payment => (
            <div
              key={payment.id}
              className="payment-row"
              data-testid={`tenant-payment-row-${payment.id}`}
            >
              <div>
                <strong>{payment.month}</strong>
                <p>{payment.chequeNumber} · {payment.bankName}</p>
              </div>
              <div>
                <p>AED {payment.amount.toLocaleString()}</p>
                <p>Paid: {payment.paidDate ?? 'Not paid yet'}</p>
              </div>
              <div>
                <span className={`status-badge status-${payment.status}`}>{payment.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantPaymentHistoryTab;
