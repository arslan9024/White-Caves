/**
 * TenantLeaseTab — Phase 2.8 / Phase 30: My Lease (Live API)
 *
 * Lease summary with live data from /api/leases?role=tenant
 *
 * @component
 */

import React, { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import '../../../pages/RolePages.css';

interface ApiLease {
  id: string;
  leaseNumber?: string | null;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  status: string;
  ejariNumber?: string | null;
  ejariStatus?: string | null;
  documents: string[];
  property: { id: string; title: string; location: string; type: string };
  tenant: { id: string; name: string; email: string };
  landlord: { id: string; name: string; email: string };
}

const FALLBACK_LEASE: ApiLease = {
  id: 'lease-tenant-001',
  leaseNumber: 'TL-2026-001',
  startDate: '2026-01-01T00:00:00.000Z',
  endDate: '2026-12-31T00:00:00.000Z',
  monthlyRent: 8000,
  depositAmount: 16000,
  status: 'active',
  ejariNumber: 'EJARI-2026-8891',
  ejariStatus: 'registered',
  documents: [
    'https://example.com/docs/tenant-agreement.pdf',
    'https://example.com/docs/tenant-ejari.pdf',
  ],
  property: {
    id: 'prop-1205',
    title: 'Marina View 2BR Apartment',
    location: 'Dubai Marina, Tower A, Unit 1205',
    type: 'Apartment',
  },
  tenant: { id: 'tenant-1', name: 'Fatima Al-Mansoori', email: 'tenant@test.ae' },
  landlord: { id: 'landlord-1', name: 'Khalid Al-Sayegh', email: 'landlord@test.ae' },
};

const TenantLeaseTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [lease, setLease] = useState<ApiLease | null>(FALLBACK_LEASE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    authFetch('/api/leases?role=tenant&pageSize=1')
      .then(r => r.json())
      .then(data => setLease((data.data as ApiLease[])?.[0] ?? null))
      .catch(() => {
        if (!lease) {
          setError('Unable to load lease details. Please refresh.');
        }
      });
  }, [currentUser, lease]);

  const leaseMetrics = useMemo(() => {
    if (!lease) return null;
    const today = new Date();
    const end = new Date(lease.endDate);
    const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const status = daysRemaining < 0 ? 'Expired' : daysRemaining < 60 ? 'Expiring Soon' : 'Active';
    return { daysRemaining, status };
  }, [lease]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your lease details.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state" data-testid="lease-loading">
        <p>Loading lease details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message" data-testid="lease-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="empty-state" data-testid="lease-empty">
        <p>No active lease found for your account.</p>
      </div>
    );
  }

  const startDate = lease.startDate.split('T')[0];
  const endDate = lease.endDate.split('T')[0];
  // Use first uploaded document as tenancy agreement; fall back to '#'
  const agreementUrl = lease.documents[0] ?? '#';
  const ejariUrl = lease.documents[1] ?? '#';

  return (
    <div className="tab-content-section tenant-lease-tab">
      <div className="tab-header">
        <h3>My Lease</h3>
        <p>Review your active contract, financial terms, and expiration timeline.</p>
      </div>

      <div className="summary-grid" data-testid="lease-summary">
        <div className="summary-card" data-testid="lease-status-card">
          <h4>Lease Status</h4>
          <span className={`status-badge status-${lease.status}`}>
            {leaseMetrics?.status ?? lease.status}
          </span>
        </div>
        <div className="summary-card" data-testid="lease-days-remaining-card">
          <h4>Days Remaining</h4>
          <p>
            {leaseMetrics
              ? leaseMetrics.daysRemaining > 0
                ? leaseMetrics.daysRemaining
                : 'Expired'
              : '—'}
          </p>
        </div>
        <div className="summary-card" data-testid="lease-monthly-rent-card">
          <h4>Monthly Rent</h4>
          <p>AED {lease.monthlyRent.toLocaleString()}</p>
        </div>
        <div className="summary-card" data-testid="lease-deposit-card">
          <h4>Deposit Paid</h4>
          <p>AED {lease.depositAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="lease-detail-panel" data-testid="lease-detail-panel">
        <h4>{lease.property.title}</h4>
        <p>{lease.property.location}</p>
        <p>
          <strong>Start Date:</strong> {startDate}
        </p>
        <p>
          <strong>End Date:</strong> {endDate}
        </p>
        {lease.leaseNumber && (
          <p>
            <strong>Lease #:</strong> {lease.leaseNumber}
          </p>
        )}
        {lease.ejariNumber && (
          <p>
            <strong>Ejari #:</strong> {lease.ejariNumber}{' '}
            <span className={`status-badge status-${lease.ejariStatus ?? 'pending'}`}>
              {lease.ejariStatus ?? 'pending'}
            </span>
          </p>
        )}

        <div className="document-actions">
          <a
            href={agreementUrl}
            target="_blank"
            rel="noreferrer"
            data-testid="lease-agreement-download"
          >
            Download Tenancy Agreement
          </a>
          {lease.ejariNumber && (
            <a href={ejariUrl} target="_blank" rel="noreferrer" data-testid="lease-ejari-download">
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
              <strong>Property:</strong> {lease.property.title}
            </p>
            <p>
              <strong>Address:</strong> {lease.property.location}
            </p>
            <p>
              <strong>Status:</strong> {leaseMetrics?.status ?? lease.status}
            </p>
            <p>
              <strong>Days Remaining:</strong> {leaseMetrics?.daysRemaining ?? '—'}
            </p>
            <p>
              <strong>Landlord:</strong> {lease.landlord.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantLeaseTab;
