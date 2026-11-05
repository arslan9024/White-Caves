/**
 * White Caves Real Estate LLC - Customer Card Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Component)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { UserCheck, ShieldCheck, Building, Phone, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { CustomerItem } from './CustomerManager.types';

interface CustomerCardProps {
  customer: CustomerItem;
  onInspect?: (cust: CustomerItem) => void;
  onSelect?: (cust: CustomerItem) => void;
}

export const CustomerCard: FC<CustomerCardProps> = ({ customer, onInspect, onSelect }) => {
  const handleInspect = () => {
    (onInspect || onSelect)?.(customer);
  };
  const typeColorMap: Record<string, { bg: string; text: string; border: string }> = {
    LEAD: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' },
    TENANT: { bg: 'rgba(168, 85, 247, 0.15)', text: '#C084FC', border: 'rgba(168, 85, 247, 0.3)' },
    BUYER: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38BDF8', border: 'rgba(56, 189, 248, 0.3)' },
    LANDLORD: {
      bg: 'rgba(16, 185, 129, 0.15)',
      text: '#34D399',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    INVESTOR: {
      bg: 'rgba(236, 72, 153, 0.15)',
      text: '#F472B6',
      border: 'rgba(236, 72, 153, 0.3)',
    },
  };

  const typeStyle = typeColorMap[customer.customerType] || typeColorMap.LEAD;

  return (
    <div
      data-testid={`customer-card-${customer.id}`}
      onClick={handleInspect}
      style={{
        cursor: 'pointer',
        background: 'rgba(15, 23, 42, 0.75)',
        border: `1px solid ${customer.kycVerified ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              background: typeStyle.bg,
              color: typeStyle.text,
              border: `1px solid ${typeStyle.border}`,
            }}
          >
            {customer.customerType}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8' }}>
            {customer.id} · {customer.customerCode}
          </span>
        </div>

        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '4px',
            background: customer.kycVerified
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(100, 116, 139, 0.15)',
            color: customer.kycVerified ? '#34D399' : '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ShieldCheck size={12} />
          {customer.kycVerified ? 'KYC VERIFIED' : 'KYC PENDING'}
        </span>
      </div>

      {/* Name & Contact */}
      <div>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 4px 0',
            lineHeight: 1.3,
          }}
        >
          {customer.fullName}
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            fontSize: '0.75rem',
            color: '#94A3B8',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={11} color="#60A5FA" />
            {customer.email}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={11} color="#34D399" />
            {customer.phone}
          </span>
        </div>
      </div>

      {/* 18-Step Progress Bar */}
      <div
        style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
          }}
        >
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#38BDF8',
              textTransform: 'uppercase',
            }}
          >
            Pipeline Progress
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FFFFFF' }}>
            Step {customer.currentStep}/18
          </span>
        </div>

        {/* Progress meter */}
        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(customer.currentStep / 18) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #38BDF8, #10B981)',
              borderRadius: '999px',
            }}
          />
        </div>

        <div style={{ fontSize: '0.7rem', color: '#CBD5E1', marginTop: '6px', fontWeight: 600 }}>
          {customer.stepName.replace(/_/g, ' ')}
        </div>
      </div>

      {/* Preferences & Agent */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '12px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Budget & Preferred Community</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
            AED {(customer.budgetAED / 1000).toLocaleString()}k · {customer.preferredCommunity}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: '#60A5FA',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '2px',
            }}
          >
            <UserCheck size={12} />
            Agent: {customer.assignedAgentName}
          </div>
        </div>

        <button
          onClick={e => {
            e.stopPropagation();
            handleInspect();
          }}
          data-testid={`inspect-cust-${customer.id}`}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34D399',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Inspect Profile
        </button>
      </div>
    </div>
  );
};
