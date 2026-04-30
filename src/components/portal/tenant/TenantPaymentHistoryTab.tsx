/**
 * TenantPaymentHistoryTab — Phase 2.9: Payment History
 *
 * List of payments with status indicators.
 *
 * @component
 */

import React, { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

interface PaymentRecord {
  id: string;
  month: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'paid' | 'upcoming' | 'pending' | 'overdue';
  propertyTitle?: string;
}

/** Late fee rate: 5% of monthly rent per overdue payment */
const LATE_FEE_RATE = 0.05;

const TenantPaymentHistoryTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const token = useSelector(
    (state: RootState) => (state.auth as { token?: string } | undefined)?.token
  );
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'paid' | 'pending' | 'overdue' | 'upcoming'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const load = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      try {
        const res = await fetch('/api/portal/tenant/payments', { headers });
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        const d = data.data ?? {};
        setPayments(
          (d.payments ?? []).map(
            (p: {
              id: string;
              month: string;
              amount: number;
              currency: string;
              dueDate: string;
              status: string;
              propertyTitle?: string;
            }) => ({
              id: p.id,
              month: p.month,
              amount: p.amount,
              currency: p.currency ?? 'AED',
              dueDate: p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '',
              status: (p.status as PaymentRecord['status']) ?? 'pending',
              propertyTitle: p.propertyTitle,
            })
          )
        );
      } catch (err) {
        setError((err as Error).message ?? 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser, token]);

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
    // Overdue takes priority over pending as the most urgent item
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
      <div className="empty-state" data-testid="loading-state">
        <p>Loading payment history…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state error-state" data-testid="error-state">
        <p>Unable to load payments: {error}</p>
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
          onChange={event =>
            setStatusFilter(
              event.target.value as 'all' | 'paid' | 'pending' | 'overdue' | 'upcoming'
            )
          }
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="upcoming">Upcoming</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="empty-state" data-testid="tenant-payment-empty-state">
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
                <p>{payment.id}</p>
                {payment.propertyTitle && <p className="property-label">{payment.propertyTitle}</p>}
              </div>
              <div>
                <p>
                  {payment.currency} {payment.amount.toLocaleString()}
                </p>
                <p>Due: {payment.dueDate}</p>
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
