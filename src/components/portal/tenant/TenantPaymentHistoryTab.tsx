/**
 * TenantPaymentHistoryTab — Phase 2.9: Payment History
 *
 * List of payments with status indicators + PDC Schedule section.
 *
 * @component
 */

import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

interface PDCEntry {
  id: string;
  chequeNumber: string;
  bankName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'presented' | 'cleared' | 'bounced';
}

const TenantPaymentHistoryTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'invoices' | 'pdc'>('invoices');

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

  const pdcSchedule = useMemo<PDCEntry[]>(
    () => [
      { id: 'pdc-001', chequeNumber: 'CHQ-001', bankName: 'Emirates NBD', amount: 8000, dueDate: '2026-01-01', status: 'cleared' },
      { id: 'pdc-002', chequeNumber: 'CHQ-002', bankName: 'Emirates NBD', amount: 8000, dueDate: '2026-02-01', status: 'cleared' },
      { id: 'pdc-003', chequeNumber: 'CHQ-003', bankName: 'Emirates NBD', amount: 8000, dueDate: '2026-03-01', status: 'presented' },
      { id: 'pdc-004', chequeNumber: 'CHQ-004', bankName: 'Emirates NBD', amount: 8000, dueDate: '2026-04-01', status: 'pending' },
      { id: 'pdc-005', chequeNumber: 'CHQ-005', bankName: 'Emirates NBD', amount: 8000, dueDate: '2026-05-01', status: 'pending' },
      { id: 'pdc-006', chequeNumber: 'CHQ-006', bankName: 'Emirates NBD', amount: 8000, dueDate: '2026-06-01', status: 'pending' },
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
    const nextPaymentDue = payments.find(p => p.status === 'pending' || p.status === 'overdue');
    return { totalPaid, outstanding, nextPaymentDue };
  }, [payments]);

  const pdcSummary = useMemo(() => {
    const cleared = pdcSchedule.filter(p => p.status === 'cleared').length;
    const pending = pdcSchedule.filter(p => p.status === 'pending').length;
    const bounced = pdcSchedule.filter(p => p.status === 'bounced').length;
    return { cleared, pending, bounced, total: pdcSchedule.length };
  }, [pdcSchedule]);

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
        <p>Review monthly rent payments, outstanding balances, and your PDC cheque schedule.</p>
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
        <div className="summary-card" data-testid="tenant-next-payment-card">
          <h4>Next Payment Due</h4>
          <p>{summary.nextPaymentDue ? summary.nextPaymentDue.month : 'None'}</p>
        </div>
        <div className="summary-card" data-testid="tenant-pdc-cleared-card">
          <h4>PDC Cleared</h4>
          <p>{pdcSummary.cleared} / {pdcSummary.total} cheques</p>
        </div>
      </div>

      {/* Section Toggle */}
      <div className="tab-controls" data-testid="payment-section-toggle">
        <button
          type="button"
          className={activeSection === 'invoices' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveSection('invoices')}
          data-testid="invoices-section-btn"
        >
          📄 Invoice History
        </button>
        <button
          type="button"
          className={activeSection === 'pdc' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveSection('pdc')}
          data-testid="pdc-section-btn"
        >
          🏦 PDC Schedule
        </button>
      </div>

      {activeSection === 'invoices' && (
        <>
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
        </>
      )}

      {activeSection === 'pdc' && (
        <div className="pdc-schedule-section" data-testid="pdc-schedule-section">
          <h4>Post-Dated Cheque Schedule</h4>
          <p className="section-hint">
            PDC cheques are the standard payment method in Dubai. Your landlord holds these cheques
            and presents them on each due date.
          </p>
          <div className="pdc-summary-row" data-testid="pdc-summary">
            <span>✅ Cleared: {pdcSummary.cleared}</span>
            <span>🕐 Pending: {pdcSummary.pending}</span>
            {pdcSummary.bounced > 0 && <span>⚠️ Bounced: {pdcSummary.bounced}</span>}
          </div>
          <div className="payments-list" data-testid="pdc-cheques-list">
            {pdcSchedule.map(entry => (
              <div
                key={entry.id}
                className="payment-row"
                data-testid={`pdc-row-${entry.id}`}
              >
                <div>
                  <strong>Cheque {entry.chequeNumber}</strong>
                  <p>{entry.bankName}</p>
                </div>
                <div>
                  <p>AED {entry.amount.toLocaleString()}</p>
                  <p>Due: {entry.dueDate}</p>
                </div>
                <div>
                  <span className={`status-badge status-${entry.status}`}>{entry.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantPaymentHistoryTab;


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
    return { totalPaid, outstanding };
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
