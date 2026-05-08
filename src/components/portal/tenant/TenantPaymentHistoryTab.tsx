/**
 * TenantPaymentHistoryTab — Phase 2.9: Payment History
 *
 * List of payments with status indicators.
 *
 * @component
 */

import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

/** Late fee rate: 5% of monthly rent per overdue payment */
const LATE_FEE_RATE = 0.05;

const TenantPaymentHistoryTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const payments = useMemo(
    () => [
      {
        id: 'tp-001',
        month: 'January 2026',
        amount: 8000,
        paidDate: '2026-01-01',
        status: 'paid' as const,
      },
      {
        id: 'tp-002',
        month: 'February 2026',
        amount: 8000,
        paidDate: '2026-02-02',
        status: 'paid' as const,
      },
      {
        id: 'tp-003',
        month: 'March 2026',
        amount: 8000,
        paidDate: null,
        status: 'pending' as const,
      },
      {
        id: 'tp-004',
        month: 'April 2026',
        amount: 8000,
        paidDate: null,
        status: 'overdue' as const,
      },
    ],
    []
  );

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
    const totalPaid = payments
      .filter(payment => payment.status === 'paid')
      .reduce((s, p) => s + p.amount, 0);
    const outstanding = payments
      .filter(payment => payment.status === 'pending' || payment.status === 'overdue')
      .reduce((s, p) => s + p.amount, 0);
    // Overdue takes priority over pending as the most urgent item
    const nextPayment =
      payments.find(p => p.status === 'overdue') ??
      payments.find(p => p.status === 'pending') ??
      null;
    const overduePayments = payments.filter(p => p.status === 'overdue');
    const lateFees = overduePayments.reduce((sum, p) => sum + Math.round(p.amount * LATE_FEE_RATE), 0);
    return { totalPaid, outstanding, nextPayment, lateFees, overdueCount: overduePayments.length };
  }, [payments]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your payment history.</p>
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
