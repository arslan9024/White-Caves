/**
 * SidebarCustomersList.tsx
 * White Caves Real Estate LLC - Customers Left Sidebar Drawer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Double-Layer Routing
 */

import React, { FC } from 'react';
import { Users, UserCheck, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { CANONICAL_CUSTOMERS } from '../../crm/CustomerManager/CustomerManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

export interface SidebarCustomersListProps {
  filterQuery?: string;
  selectedCustomerId?: string | null;
  onSelectCustomer?: (id: string, name: string) => void;
  onNavigateToView?: (route: string) => void;
}

export const SidebarCustomersList: FC<SidebarCustomersListProps> = ({
  filterQuery = '',
  selectedCustomerId,
  onSelectCustomer,
  onNavigateToView,
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
      {/* ── Level 1 Category Portals ─────────────────────────────────── */}
      <div style={{ marginBottom: '8px' }}>
        <div
          onClick={() => onNavigateToView?.('/dashboard/customers/leads')}
          style={{
            fontSize: '0.68rem',
            color: '#34D399',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '6px',
            marginBottom: '4px',
          }}
          data-testid="link-all-cust-leads"
        >
          📇 Open Clients Registry (CRUD) <ArrowRight size={11} />
        </div>
        <div
          onClick={() => onNavigateToView?.('/dashboard/customers/investors')}
          style={{
            fontSize: '0.68rem',
            color: '#F59E0B',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '6px',
            marginBottom: '8px',
          }}
          data-testid="link-cust-investors"
        >
          💎 UHNW Investors Desk <ArrowRight size={11} />
        </div>
      </div>

      {/* Header bar with Count */}
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

      {/* ── Level 2 Sub-Items: Customers with Turing IDs ─────────────── */}
      {visibleCustomers.map(cust => {
        const isSelected = selectedCustomerId === cust.id;
        return (
          <div
            key={cust.id}
            onClick={() => {
              onSelectCustomer?.(cust.id, cust.fullName);
              onNavigateToView?.(`/dashboard/customers/${cust.id}`);
            }}
            data-testid={`sidebar-customer-${cust.id}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(16, 185, 129, 0.15)' : '#070D18',
              border: isSelected ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.05)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'monospace',
                  color: '#34D399',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 700,
                }}
              >
                {cust.customerCode}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: cust.customerType.includes('UHNW') ? '#F59E0B' : '#38BDF8',
                }}
              >
                {cust.customerType}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC' }}>
              {cust.fullName}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.68rem',
                color: '#64748B',
              }}
            >
              <span>{cust.preferredCommunity}</span>
              <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={11} /> KYC OK
              </span>
            </div>
          </div>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarCustomersList;
