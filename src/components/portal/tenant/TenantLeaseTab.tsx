/**
 * TenantLeaseTab — Phase 2.8: My Lease
 *
 * Lease summary: property address, start date, end date, monthly rent, deposit paid
 * Days remaining in lease (countdown)
 * Lease status badge: Active / Expiring Soon (< 60 days) / Expired
 * Download buttons for Tenancy Agreement and Ejari Certificate
 *
 * @component
 */

import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

const TenantLeaseTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [showDetails, setShowDetails] = useState(false);

  const lease = useMemo(
    () => ({
      property: 'Marina View 2BR Apartment',
      address: 'Dubai Marina, Tower A, Unit 1205',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      monthlyRent: 8000,
      depositPaid: 16000,
      agreementUrl: 'https://example.com/docs/tenant-agreement.pdf',
      ejariUrl: 'https://example.com/docs/tenant-ejari.pdf',
    }),
    []
  );

  const leaseMetrics = useMemo(() => {
    const today = new Date('2026-04-29');
    const end = new Date(lease.endDate);
    const diffMs = end.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const status = daysRemaining < 0 ? 'Expired' : daysRemaining < 60 ? 'Expiring Soon' : 'Active';

    return { daysRemaining, status };
  }, [lease.endDate]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your lease details.</p>
      </div>
    );
  }

  return (
    <div className="tab-content-section tenant-lease-tab">
      <div className="tab-header">
        <h3>My Lease</h3>
        <p>Review your active contract, financial terms, and expiration timeline.</p>
      </div>

      <div className="summary-grid" data-testid="lease-summary">
        <div className="summary-card" data-testid="lease-status-card">
          <h4>Lease Status</h4>
          <span className="status-badge">{leaseMetrics.status}</span>
        </div>
        <div className="summary-card" data-testid="lease-days-remaining-card">
          <h4>Days Remaining</h4>
          <p>{leaseMetrics.daysRemaining}</p>
        </div>
        <div className="summary-card" data-testid="lease-monthly-rent-card">
          <h4>Monthly Rent</h4>
          <p>AED {lease.monthlyRent.toLocaleString()}</p>
        </div>
        <div className="summary-card" data-testid="lease-deposit-card">
          <h4>Deposit Paid</h4>
          <p>AED {lease.depositPaid.toLocaleString()}</p>
        </div>
      </div>

      <div className="lease-detail-panel" data-testid="lease-detail-panel">
        <h4>{lease.property}</h4>
        <p>{lease.address}</p>
        <p>
          <strong>Start Date:</strong> {lease.startDate}
        </p>
        <p>
          <strong>End Date:</strong> {lease.endDate}
        </p>

        <div className="document-actions">
          <a
            href={lease.agreementUrl}
            target="_blank"
            rel="noreferrer"
            data-testid="lease-agreement-download"
          >
            Download Tenancy Agreement
          </a>
          <a
            href={lease.ejariUrl}
            target="_blank"
            rel="noreferrer"
            data-testid="lease-ejari-download"
          >
            Download Ejari Certificate
          </a>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowDetails(true)}
            data-testid="lease-view-details"
          >
            View Lease Breakdown
          </button>
        </div>
      </div>

      {showDetails && (
        <div
          className="modal-overlay"
          data-testid="lease-details-modal"
          onClick={() => setShowDetails(false)}
        >
          <div className="modal-content" onClick={event => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              aria-label="Close lease details"
              onClick={() => setShowDetails(false)}
            >
              ×
            </button>
            <h4>Lease Breakdown</h4>
            <p>
              <strong>Property:</strong> {lease.property}
            </p>
            <p>
              <strong>Address:</strong> {lease.address}
            </p>
            <p>
              <strong>Status:</strong> {leaseMetrics.status}
            </p>
            <p>
              <strong>Days Remaining:</strong> {leaseMetrics.daysRemaining}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantLeaseTab;
