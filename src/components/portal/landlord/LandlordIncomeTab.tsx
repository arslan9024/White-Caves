/**
 * LandlordIncomeTab — Income Summary: Monthly rent per property, commission deducted, net received
 *
 * Shows landlord a breakdown of:
 * - Income per property (monthly rent)
 * - Agent commission deducted
 * - Net amount received
 * - Overall MRR (Monthly Recurring Revenue)
 *
 * Phase 31: Wired to live API — GET /api/leases?role=landlord
 *
 * @component
 */

import React, { FC, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import '../../../pages/RolePages.css';

const log = createLogger('LandlordIncomeTab');

/** Default agent commission percentage when not set on the lease */
const DEFAULT_COMMISSION_PCT = 5;

interface ApiLease {
  id: string;
  monthlyRent: number;
  status: string;
  ejariNumber: string | null;
  endDate: string | null;
  property: {
    id: string;
    title: string;
    location: string;
  };
  tenant: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface PropertyIncome {
  id: string;
  propertyTitle: string;
  address: string;
  monthlyRent: number;
  agentCommissionPct: number;
  leaseStatus: 'active' | 'expiring' | 'vacant';
  tenantName: string;
  leaseEndDate: string;
  ejariNumber: string | null;
  currency: string;
}

const leaseToPropertyIncome = (l: ApiLease): PropertyIncome => {
  let leaseStatus: 'active' | 'expiring' | 'vacant' = 'vacant';
  if (l.status === 'active') {
    if (l.endDate) {
      const daysRemaining = Math.ceil(
        (new Date(l.endDate).getTime() - Date.now()) / 86_400_000,
      );
      leaseStatus = daysRemaining <= 60 ? 'expiring' : 'active';
    } else {
      leaseStatus = 'active';
    }
  }
  return {
    id: l.id,
    propertyTitle: l.property?.title ?? 'Unknown Property',
    address: l.property?.location ?? '—',
    monthlyRent: l.status === 'active' ? (l.monthlyRent ?? 0) : 0,
    agentCommissionPct: DEFAULT_COMMISSION_PCT,
    leaseStatus,
    tenantName: l.tenant?.name ?? '—',
    leaseEndDate: l.endDate
      ? new Date(l.endDate).toLocaleDateString('en-AE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '—',
    ejariNumber: l.ejariNumber ?? null,
    currency: 'AED',
  };
};

const LandlordIncomeTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [properties, setProperties] = useState<PropertyIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    authFetch('/api/leases?role=landlord&pageSize=100')
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          const leases: ApiLease[] = data.data ?? [];
          setProperties(leases.map(leaseToPropertyIncome));
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          log.error('Failed to load income data:', err);
          setError('Unable to load income data. Please refresh.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const summary = useMemo(() => {
    const activeProperties = properties.filter(p => p.leaseStatus === 'active' || p.leaseStatus === 'expiring');
    const totalMonthlyRent = activeProperties.reduce((s, p) => s + p.monthlyRent, 0);
    const totalCommission = activeProperties.reduce(
      (s, p) => s + (p.monthlyRent * p.agentCommissionPct) / 100,
      0
    );
    const netMonthlyIncome = totalMonthlyRent - totalCommission;
    return { totalMonthlyRent, totalCommission, netMonthlyIncome, activeCount: activeProperties.length };
  }, [properties]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view income details.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="tab-content-section">
        <p className="empty-state-text">⏳ Loading income data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content-section">
        <p className="empty-state-text" style={{ color: 'var(--error-red, #ef4444)' }}>
          {error}
        </p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="tab-content-section">
        <div className="empty-state" data-testid="no-income-state">
          <p>No leases found. Income summary will appear once your properties are leased.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content-section landlord-income-tab">
      <div className="tab-header">
        <h3>Income Summary</h3>
        <p>Monthly rental income per property, agent commissions, and net received amounts.</p>
      </div>

      <div className="summary-grid" data-testid="income-summary-grid">
        <div className="summary-card" data-testid="income-total-rent-card">
          <h4>Total Monthly Rent</h4>
          <p>AED {summary.totalMonthlyRent.toLocaleString()}</p>
        </div>
        <div className="summary-card" data-testid="income-commission-card">
          <h4>Agent Commission</h4>
          <p>AED {summary.totalCommission.toLocaleString()}</p>
        </div>
        <div className="summary-card" data-testid="income-net-card">
          <h4>Net Monthly Income</h4>
          <p>AED {summary.netMonthlyIncome.toLocaleString()}</p>
        </div>
        <div className="summary-card" data-testid="income-active-count-card">
          <h4>Active Leases</h4>
          <p>{summary.activeCount}</p>
        </div>
      </div>

      <div className="income-properties-list" data-testid="income-properties-list">
        <h4>Income per Property</h4>
        {properties.map(prop => {
          const commission = (prop.monthlyRent * prop.agentCommissionPct) / 100;
          const netIncome = prop.monthlyRent - commission;

          return (
            <div
              key={prop.id}
              className="payment-row income-row"
              data-testid={`income-property-${prop.id}`}
            >
              <div className="income-property-info">
                <strong>{prop.propertyTitle}</strong>
                <p>{prop.address}</p>
                <p>
                  Tenant: {prop.tenantName}
                  {prop.leaseEndDate !== '—' && ` · Lease ends: ${prop.leaseEndDate}`}
                </p>
                {prop.ejariNumber && (
                  <p>Ejari: {prop.ejariNumber}</p>
                )}
              </div>
              <div className="income-breakdown">
                {prop.leaseStatus === 'vacant' ? (
                  <span className="status-badge status-vacant">Vacant</span>
                ) : (
                  <>
                    <p>Rent: AED {prop.monthlyRent.toLocaleString()}</p>
                    <p>Commission ({prop.agentCommissionPct}%): − AED {commission.toLocaleString()}</p>
                    <p>
                      <strong>Net: AED {netIncome.toLocaleString()}</strong>
                    </p>
                  </>
                )}
              </div>
              <div>
                <span className={`status-badge status-${prop.leaseStatus}`}>
                  {prop.leaseStatus === 'active' ? 'Active' :
                    prop.leaseStatus === 'expiring' ? 'Expiring Soon' : 'Vacant'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="annual-projection" data-testid="annual-projection-section">
        <h4>Annual Projection</h4>
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Gross Annual Rent</h4>
            <p>AED {(summary.totalMonthlyRent * 12).toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h4>Annual Commission</h4>
            <p>AED {(summary.totalCommission * 12).toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h4>Net Annual Income</h4>
            <p>AED {(summary.netMonthlyIncome * 12).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordIncomeTab;
