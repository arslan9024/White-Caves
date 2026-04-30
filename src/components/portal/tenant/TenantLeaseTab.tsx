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

import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

interface LeaseData {
  id: string;
  property: string;
  address: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositPaid: number;
  currency: string;
  leaseStatus: string;
  daysRemaining: number;
  ejariNumber?: string;
  ejariStatus?: string;
  agreementUrl?: string;
  ejariUrl?: string;
}

const TenantLeaseTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const token = useSelector((state: RootState) => (state.auth as { token?: string } | undefined)?.token);
  const [showDetails, setShowDetails] = useState(false);
  const [lease, setLease] = useState<LeaseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch('/api/portal/tenant/lease', { headers })
      .then(res => {
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        return res.json();
      })
      .then(data => {
        const d = data.data;
        if (!d) { setLease(null); return; }
        setLease({
          id: d.id,
          property: d.property ?? '',
          address: d.address ?? '',
          startDate: d.startDate ? new Date(d.startDate).toLocaleDateString() : '',
          endDate: d.endDate ? new Date(d.endDate).toLocaleDateString() : '',
          monthlyRent: d.monthlyRent ?? 0,
          depositPaid: d.depositPaid ?? 0,
          currency: d.currency ?? 'AED',
          leaseStatus: d.leaseStatus ?? 'Active',
          daysRemaining: d.daysRemaining ?? 0,
          ejariNumber: d.ejariNumber ?? undefined,
          ejariStatus: d.ejariStatus ?? undefined,
          agreementUrl: undefined,
          ejariUrl: undefined,
        });
      })
      .catch(err => setError((err as Error).message ?? 'Failed to load lease'))
      .finally(() => setLoading(false));
  }, [currentUser, token]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your lease details.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-state" data-testid="loading-state">
        <p>Loading your lease…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state error-state" data-testid="error-state">
        <p>Unable to load lease: {error}</p>
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="empty-state" data-testid="no-lease-state">
        <p>No active lease found. Please contact your property manager.</p>
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
          <span className="status-badge">{lease.leaseStatus}</span>
        </div>
        <div className="summary-card" data-testid="lease-days-remaining-card">
          <h4>Days Remaining</h4>
          <p>{lease.daysRemaining}</p>
        </div>
        <div className="summary-card" data-testid="lease-monthly-rent-card">
          <h4>Monthly Rent</h4>
          <p>{lease.currency} {lease.monthlyRent.toLocaleString()}</p>
        </div>
        <div className="summary-card" data-testid="lease-deposit-card">
          <h4>Deposit Paid</h4>
          <p>{lease.currency} {lease.depositPaid.toLocaleString()}</p>
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
        {lease.ejariNumber && (
          <p>
            <strong>Ejari Number:</strong> {lease.ejariNumber}
          </p>
        )}

        <div className="document-actions">
          {lease.agreementUrl && (
            <a
              href={lease.agreementUrl}
              target="_blank"
              rel="noreferrer"
              data-testid="lease-agreement-download"
            >
              Download Tenancy Agreement
            </a>
          )}
          {lease.ejariUrl && (
            <a
              href={lease.ejariUrl}
              target="_blank"
              rel="noreferrer"
              data-testid="lease-ejari-download"
            >
              Download Ejari Certificate
            </a>
          )}
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
              <strong>Status:</strong> {lease.leaseStatus}
            </p>
            <p>
              <strong>Days Remaining:</strong> {lease.daysRemaining}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantLeaseTab;
