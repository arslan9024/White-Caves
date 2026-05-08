/**
 * LandlordIncomeTab — Income Summary: Monthly rent per property, commission deducted, net received
 *
 * Shows landlord a breakdown of:
 * - Income per property (monthly rent)
 * - Agent commission deducted
 * - Net amount received
 * - Overall MRR (Monthly Recurring Revenue)
 *
 * @component
 */

import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

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

const LandlordIncomeTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const properties = useMemo<PropertyIncome[]>(
    () => [
      {
        id: 'prop-001',
        propertyTitle: 'Marina View 2BR Apartment',
        address: 'Dubai Marina, Tower A, Unit 1205',
        monthlyRent: 8000,
        agentCommissionPct: 5,
        leaseStatus: 'active',
        tenantName: 'Ahmed Al Rashid',
        leaseEndDate: '2026-12-31',
        ejariNumber: 'EJARI-2026-001234',
        currency: 'AED',
      },
      {
        id: 'prop-002',
        propertyTitle: 'Downtown Studio',
        address: 'Downtown Dubai, Burj Views, Unit 604',
        monthlyRent: 5500,
        agentCommissionPct: 5,
        leaseStatus: 'expiring',
        tenantName: 'Sarah Johnson',
        leaseEndDate: '2026-05-31',
        ejariNumber: 'EJARI-2026-002345',
        currency: 'AED',
      },
      {
        id: 'prop-003',
        propertyTitle: 'JBR 3BR Villa',
        address: 'Jumeirah Beach Residence, Gate 3',
        monthlyRent: 0,
        agentCommissionPct: 5,
        leaseStatus: 'vacant',
        tenantName: '—',
        leaseEndDate: '—',
        ejariNumber: null,
        currency: 'AED',
      },
    ],
    []
  );

  const summary = useMemo(() => {
    const activeProperties = properties.filter(
      p => p.leaseStatus === 'active' || p.leaseStatus === 'expiring'
    );
    const totalMonthlyRent = activeProperties.reduce((s, p) => s + p.monthlyRent, 0);
    const totalCommission = activeProperties.reduce(
      (s, p) => s + (p.monthlyRent * p.agentCommissionPct) / 100,
      0
    );
    const netMonthlyIncome = totalMonthlyRent - totalCommission;
    return {
      totalMonthlyRent,
      totalCommission,
      netMonthlyIncome,
      activeCount: activeProperties.length,
    };
  }, [properties]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view income details.</p>
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
                {prop.ejariNumber && <p>Ejari: {prop.ejariNumber}</p>}
              </div>
              <div className="income-breakdown">
                {prop.leaseStatus === 'vacant' ? (
                  <span className="status-badge status-vacant">Vacant</span>
                ) : (
                  <>
                    <p>Rent: AED {prop.monthlyRent.toLocaleString()}</p>
                    <p>
                      Commission ({prop.agentCommissionPct}%): − AED {commission.toLocaleString()}
                    </p>
                    <p>
                      <strong>Net: AED {netIncome.toLocaleString()}</strong>
                    </p>
                  </>
                )}
              </div>
              <div>
                <span className={`status-badge status-${prop.leaseStatus}`}>
                  {prop.leaseStatus === 'active'
                    ? 'Active'
                    : prop.leaseStatus === 'expiring'
                      ? 'Expiring Soon'
                      : 'Vacant'}
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
