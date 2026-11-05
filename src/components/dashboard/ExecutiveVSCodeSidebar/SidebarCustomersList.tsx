/**
 * White Caves Real Estate LLC - Sovereign Customers Sidebar List
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Users, UserCheck, ShieldCheck } from 'lucide-react';
import { CANONICAL_CUSTOMERS } from '../../crm/CustomerManager/CustomerManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

interface SidebarCustomersListProps {
  filterQuery?: string;
  selectedCustomerId?: string | null;
  onSelectCustomer?: (id: string, name: string) => void;
}

export const SidebarCustomersList: FC<SidebarCustomersListProps> = ({
  filterQuery = '',
  selectedCustomerId,
  onSelectCustomer,
}) => {
  const query = filterQuery.trim().toLowerCase();

  const visibleCustomers = CANONICAL_CUSTOMERS.filter(cust => {
    if (!query) return true;
    return (
      cust.id.toLowerCase().includes(query) ||
      cust.customerCode.toLowerCase().includes(query) ||
      cust.fullName.toLowerCase().includes(query) ||
      cust.email.toLowerCase().includes(query) ||
      cust.customerType.toLowerCase().includes(query) ||
      cust.preferredCommunity.toLowerCase().includes(query)
    );
  });

  return (
    <SidebarListWrapper data-testid="sidebar-customers-list">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px 10px 8px',
        }}
      >
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#10B981',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Clients & Leads ({visibleCustomers.length})
        </span>
      </div>

      {visibleCustomers.map(cust => {
        const isSelected = selectedCustomerId === cust.id;

        return (
          <div
            key={cust.id}
            onClick={() => onSelectCustomer?.(cust.id, cust.fullName)}
            data-testid={`sidebar-customer-${cust.id}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(16, 185, 129, 0.15)' : '#070D18',
              border: `1px solid ${isSelected ? '#10B981' : 'rgba(255, 255, 255, 0.05)'}`,
              marginBottom: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#34D399',
                  background: 'rgba(16, 185, 129, 0.2)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}
              >
                {cust.customerCode}
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: cust.kycVerified ? '#34D399' : '#FBBF24',
                }}
              >
                {cust.kycVerified ? 'KYC PASS' : 'KYC PENDING'}
              </span>
            </div>

            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: isSelected ? '#FFFFFF' : '#CBD5E1',
                lineHeight: '1.2',
                marginBottom: '4px',
              }}
            >
              {cust.fullName}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: '#94A3B8',
              }}
            >
              <span>{cust.customerType}</span>
              <span style={{ color: '#38BDF8', fontWeight: 600 }}>Step {cust.currentStep}/18</span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};
