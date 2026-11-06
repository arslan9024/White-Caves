/**
 * White Caves Real Estate LLC - Customer Manager View
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Users, Search, Plus, UserCheck, ShieldCheck, TrendingUp } from 'lucide-react';
import { CustomerType } from './CustomerManager.types';
import { useCustomerManager } from './CustomerManager.logic';
import { CustomerCard } from './CustomerCard';
import { CustomerDetailModal } from './CustomerDetailModal';
import { CustomerRegistrationDrawer } from './CustomerRegistrationDrawer';
import {
  CustomerContainer,
  CustomerHeader,
  MetricsGrid,
  MetricCard,
  CustomerFilterBar,
  CustomersGrid,
} from './CustomerManager.styles';

export interface CustomerManagerViewProps {
  selectedCustomerId?: string | null;
  onSelectCustomer?: (id: string) => void;
  onNavigateBack?: () => void;
}

export const CustomerManagerView: FC<CustomerManagerViewProps> = ({
  selectedCustomerId,
  onSelectCustomer,
  onNavigateBack,
}) => {
  const {
    filteredCustomers,
    metrics,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    selectedCustomerForModal,
    isDrawerOpen,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleOpenCreateDrawer,
    handleCloseCreateDrawer,
    handleAdvanceStep,
    handleVerifyCustomerKyc,
    handleAddInteraction,
    handleCreateCustomer,
  } = useCustomerManager({
    selectedCustomerId,
    onSelectCustomer,
    onNavigateBack,
  });

  return (
    <CustomerContainer data-testid="customer-manager-view">
      {selectedCustomerId && selectedCustomerForModal ? (
        <CustomerDetailModal
          customer={selectedCustomerForModal}
          onClose={() => {
            handleCloseDetailModal();
            onNavigateBack?.();
          }}
          onAdvanceStep={handleAdvanceStep}
          onVerifyKyc={handleVerifyCustomerKyc}
          onAddInteraction={handleAddInteraction}
          isInline={true}
        />
      ) : (
        <>
          {/* Header */}
          <CustomerHeader>
            <div className="title-group">
              <h1>
                <Users size={24} color="#34D399" />
                Customer & Lead Management System
              </h1>
              <p>
                Central Nervous System tracking 18-step transactions from lead acquisition to FTA 5%
                VAT filing
              </p>
            </div>
            <div className="actions">
              <button
                onClick={handleOpenCreateDrawer}
                data-testid="onboard-client-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                <Plus size={16} />
                <span>Onboard Client</span>
              </button>
            </div>
          </CustomerHeader>

          {/* Metrics Row */}
          <MetricsGrid>
            <MetricCard $accentColor="#38BDF8">
              <div className="label">Total Managed Clients</div>
              <div className="value" data-testid="metric-total-customers">
                {metrics.totalCustomers}
                <span className="sub">Accounts</span>
              </div>
            </MetricCard>

            <MetricCard $accentColor="#F59E0B">
              <div className="label">Active Inbound Leads</div>
              <div className="value" data-testid="metric-qualified-leads">
                {metrics.qualifiedLeads}
                <span className="sub">Prospects</span>
              </div>
            </MetricCard>

            <MetricCard $accentColor="#10B981">
              <div className="label">Tenants & Buyers</div>
              <div className="value" data-testid="metric-active-buyers">
                {metrics.activeTenantsAndBuyers}
                <span className="sub">Transacting</span>
              </div>
            </MetricCard>

            <MetricCard $accentColor="#8B5CF6">
              <div className="label">KYC Verified Ratio</div>
              <div className="value" data-testid="metric-kyc-rate">
                {metrics.kycVerifiedRatePercent}%<span className="sub">Compliance</span>
              </div>
            </MetricCard>
          </MetricsGrid>

          {/* Search & Filter Bar */}
          <CustomerFilterBar>
            <div className="search-input">
              <Search size={16} color="#94A3B8" />
              <input
                type="text"
                data-testid="customer-search-input"
                placeholder="Search by client name, code, email, community, or consultant..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              {(['ALL', 'LEAD', 'BUYER', 'TENANT', 'LANDLORD', 'INVESTOR'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  data-testid={`filter-${type.toLowerCase()}`}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: typeFilter === type ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                    background:
                      typeFilter === type ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                    color: typeFilter === type ? '#34D399' : '#94A3B8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </CustomerFilterBar>

          {/* Customer Cards Grid */}
          <CustomersGrid>
            {filteredCustomers.map(customer => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onSelect={target => {
                  if (onSelectCustomer) {
                    onSelectCustomer(target.id);
                  } else {
                    handleOpenDetailModal(target);
                  }
                }}
              />
            ))}
          </CustomersGrid>

          {/* Detail Modal (only when not on deep route) */}
          {selectedCustomerForModal && !selectedCustomerId && (
            <CustomerDetailModal
              customer={selectedCustomerForModal}
              onClose={handleCloseDetailModal}
              onAdvanceStep={handleAdvanceStep}
              onVerifyKyc={handleVerifyCustomerKyc}
              onAddInteraction={handleAddInteraction}
            />
          )}
        </>
      )}

      {/* Registration Drawer */}
      <CustomerRegistrationDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseCreateDrawer}
        onSubmit={handleCreateCustomer}
      />
    </CustomerContainer>
  );
};
