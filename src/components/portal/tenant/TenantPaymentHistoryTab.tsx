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

interface PaymentSummary {
  totalPaid: number;
  currency: string;
  nextPaymentDue: string | null;
  nextPaymentAmount: number;
  depositPaid: number;
}

const TenantPaymentHistoryTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const token = useSelector((state: RootState) => (state.auth as { token?: string } | undefined)?.token);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch('/api/portal/tenant/payments', { headers })
      .then(res => {
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        return res.json();
      })
      .then(data => {
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
        setSummary(d.summary ?? null);
      })
      .catch(err => setError((err as Error).message ?? 'Failed to load payments'))
      .finally(() => setLoading(false));
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

  const displaySummary = useMemo(() => {
    if (summary) {
      return {
        totalPaid: summary.totalPaid,
        currency: summary.currency,
        outstanding: 0,
        depositPaid: summary.depositPaid,
        nextPaymentDue: summary.nextPaymentDue,
        nextPaymentAmount: summary.nextPaymentAmount,
      };
    }
    const totalPaid = payments
      .filter(p => p.status === 'paid')
      .reduce((s, p) => s + p.amount, 0);
    const outstanding = payments
      .filter(p => p.status === 'pending' || p.status === 'overdue')
      .reduce((s, p) => s + p.amount, 0);
    return { totalPaid, outstanding, currency: 'AED', depositPaid: 0, nextPaymentDue: null, nextPaymentAmount: 0 };
  }, [summary, payments]);

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
          <p>{displaySummary.currency} {displaySummary.totalPaid.toLocaleString()}</p>
        </div>
        <div className="summary-card" data-testid="tenant-outstanding-card">
          <h4>Outstanding</h4>
          <p>{displaySummary.currency} {displaySummary.outstanding.toLocaleString()}</p>
        </div>
        {displaySummary.depositPaid > 0 && (
          <div className="summary-card" data-testid="tenant-deposit-card">
            <h4>Deposit Paid</h4>
            <p>{displaySummary.currency} {displaySummary.depositPaid.toLocaleString()}</p>
          </div>
        )}
        {displaySummary.nextPaymentDue && (
          <div className="summary-card" data-testid="tenant-next-payment-card">
            <h4>Next Payment Due</h4>
            <p>{new Date(displaySummary.nextPaymentDue).toLocaleDateString()}</p>
            <p>{displaySummary.currency} {displaySummary.nextPaymentAmount.toLocaleString()}</p>
          </div>
        )}
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
            setStatusFilter(event.target.value as 'all' | 'paid' | 'pending' | 'overdue' | 'upcoming')
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
                <p>{payment.currency} {payment.amount.toLocaleString()}</p>
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
