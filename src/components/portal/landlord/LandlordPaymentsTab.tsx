/**
 * LandlordPaymentsTab — Phase 2.4: Rent Payments
 *
 * Payment schedule for all properties (monthly breakdown).
 * Shows: property name, due date, amount, paid date, status (paid/pending/overdue)
 * Summary card: total monthly income, collected this month, outstanding balance
 * Filter by property and date range
 *
 * @component
 */

import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

const LandlordPaymentsTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const mockPayments = useMemo(
    () => [
      {
        id: 'pay-001',
        property: 'Marina View 2BR Apartment',
        tenant: 'Ahmed Al-Rashid',
        dueDate: '2026-04-01',
        paidDate: '2026-03-30',
        amount: 8000,
        status: 'paid' as const,
      },
      {
        id: 'pay-002',
        property: 'Downtown Studio',
        tenant: 'Sarah Johnson',
        dueDate: '2026-04-05',
        paidDate: null,
        amount: 5000,
        status: 'pending' as const,
      },
      {
        id: 'pay-003',
        property: 'JBR 3BR Villa',
        tenant: 'Mohammed Hassan',
        dueDate: '2026-03-01',
        paidDate: null,
        amount: 12000,
        status: 'overdue' as const,
      },
      {
        id: 'pay-004',
        property: 'Marina View 2BR Apartment',
        tenant: 'Fatima Al-Mansoori',
        dueDate: '2026-05-01',
        paidDate: null,
        amount: 7500,
        status: 'pending' as const,
      },
    ],
    []
  );

  const filteredPayments = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return mockPayments.filter(payment => {
      const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
      const searchMatch =
        normalizedSearch.length === 0 ||
        payment.property.toLowerCase().includes(normalizedSearch) ||
        payment.tenant.toLowerCase().includes(normalizedSearch) ||
        payment.id.toLowerCase().includes(normalizedSearch);

      return statusMatch && searchMatch;
    });
  }, [mockPayments, searchQuery, statusFilter]);

  const summary = useMemo(() => {
    const totalMonthlyIncome = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const collectedThisMonth = mockPayments
      .filter(payment => payment.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const outstandingBalance = mockPayments
      .filter(payment => payment.status === 'pending' || payment.status === 'overdue')
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      totalMonthlyIncome,
      collectedThisMonth,
      outstandingBalance,
    };
  }, [mockPayments]);

  const selectedPayment = useMemo(
    () => mockPayments.find(payment => payment.id === selectedPaymentId) ?? null,
    [mockPayments, selectedPaymentId]
  );

  const formatCurrency = (amount: number) => `AED ${amount.toLocaleString()}`;

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your payment schedule.</p>
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
          placeholder="Search by property, tenant, or payment ID"
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
              onClick={() => setSelectedPaymentId(payment.id)}
            >
              <div>
                <strong>{payment.property}</strong>
                <p>{payment.tenant}</p>
              </div>
              <div>
                <p>Due: {payment.dueDate}</p>
                <p>Paid: {payment.paidDate ?? 'Not paid yet'}</p>
              </div>
              <div>
                <p>{formatCurrency(payment.amount)}</p>
                <span className={`status-badge status-${payment.status}`}>{payment.status}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedPayment && (
        <div
          className="modal-overlay"
          data-testid="payment-detail-modal"
          onClick={() => setSelectedPaymentId(null)}
        >
          <div className="modal-content" onClick={event => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedPaymentId(null)}
              aria-label="Close payment details"
            >
              ×
            </button>
            <h4>Payment Details</h4>
            <p>
              <strong>ID:</strong> {selectedPayment.id}
            </p>
            <p>
              <strong>Property:</strong> {selectedPayment.property}
            </p>
            <p>
              <strong>Tenant:</strong> {selectedPayment.tenant}
            </p>
            <p>
              <strong>Amount:</strong> {formatCurrency(selectedPayment.amount)}
            </p>
            <p>
              <strong>Due Date:</strong> {selectedPayment.dueDate}
            </p>
            <p>
              <strong>Paid Date:</strong> {selectedPayment.paidDate ?? 'Not paid yet'}
            </p>
            <p>
              <strong>Status:</strong> {selectedPayment.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordPaymentsTab;
