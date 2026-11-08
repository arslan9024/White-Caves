/**
 * White Caves Real Estate LLC - Customer Card Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Component)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ShieldCheck, Building, Phone, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { CustomerItem } from './CustomerManager.types';

interface CustomerCardProps {
  customer: CustomerItem;
  onInspect?: (cust: CustomerItem) => void;
  onSelect?: (cust: CustomerItem) => void;
}

export const CustomerCard: FC<CustomerCardProps> = ({ customer, onInspect, onSelect }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const handleInspect = () => {
    (onInspect || onSelect)?.(customer);
  };
  const typeColorMap: Record<string, { bg: string; text: string; border: string }> = {
    LEAD: {
      bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
      text: isDark ? '#FBBF24' : '#D97706',
      border: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
    },
    TENANT: {
      bg: isDark ? 'rgba(168, 85, 247, 0.15)' : '#FAF5FF',
      text: isDark ? '#C084FC' : '#9333EA',
      border: isDark ? 'rgba(168, 85, 247, 0.3)' : '#E9D5FF',
    },
    BUYER: {
      bg: isDark ? 'rgba(56, 189, 248, 0.15)' : '#E0F2FE',
      text: isDark ? '#38BDF8' : '#0284C7',
      border: isDark ? 'rgba(56, 189, 248, 0.3)' : '#BAE6FD',
    },
    LANDLORD: {
      bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
      text: isDark ? '#34D399' : '#059669',
      border: isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
    },
    INVESTOR: {
      bg: isDark ? 'rgba(236, 72, 153, 0.15)' : '#FDF2F8',
      text: isDark ? '#F472B6' : '#DB2777',
      border: isDark ? 'rgba(236, 72, 153, 0.3)' : '#FBCFE8',
    },
  };

  const typeStyle = typeColorMap[customer.customerType] || typeColorMap.LEAD;

  return (
    <div
      data-testid={`customer-card-${customer.id}`}
      onClick={handleInspect}
      style={{
        cursor: 'pointer',
        background: isDark ? 'rgba(15, 23, 42, 0.75)' : '#FFFFFF',
        border: `1px solid ${
          customer.kycVerified
            ? isDark
              ? 'rgba(16, 185, 129, 0.35)'
              : '#10B981'
            : isDark
            ? 'rgba(255, 255, 255, 0.08)'
            : '#E2E8F0'
        }`,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 10px rgba(0,0,0,0.04)',
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
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isDark ? '#94A3B8' : '#64748B' }}>
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
              ? isDark
                ? 'rgba(16, 185, 129, 0.15)'
                : '#ECFDF5'
              : isDark
              ? 'rgba(100, 116, 139, 0.15)'
              : '#F1F5F9',
            color: customer.kycVerified
              ? isDark
                ? '#34D399'
                : '#059669'
              : isDark
              ? '#94A3B8'
              : '#64748B',
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
            color: isDark ? '#FFFFFF' : '#0F172A',
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
            color: isDark ? '#94A3B8' : '#64748B',
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
          background: isDark ? 'rgba(0,0,0,0.3)' : '#F8FAFC',
          padding: '10px 12px',
          borderRadius: '8px',
          border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0',
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
              color: isDark ? '#38BDF8' : '#0284C7',
              textTransform: 'uppercase',
            }}
          >
            Pipeline Progress
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
            Step {customer.currentStep}/18
          </span>
        </div>

        {/* Progress meter */}
        <div
          style={{
            width: '100%',
            height: '6px',
            background: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
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

        <div style={{ fontSize: '0.7rem', color: isDark ? '#CBD5E1' : '#475569', marginTop: '6px', fontWeight: 600 }}>
          {customer.stepName.replace(/_/g, ' ')}
        </div>
      </div>

      {/* Preferences & Agent */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
          paddingTop: '12px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.68rem', color: isDark ? '#94A3B8' : '#64748B' }}>Budget & Preferred Community</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '2px' }}>
            AED {(customer.budgetAED / 1000).toLocaleString()}k · {customer.preferredCommunity}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: isDark ? '#60A5FA' : '#2563EB',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '2px',
            }}
          >
            <UserCheck size={12} />
            <span>Agent: </span>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                navigate(`/dashboard/employees/${customer.assignedAgentId || 'EMP-001'}`);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: isDark ? '#60A5FA' : '#2563EB',
                fontWeight: 700,
                textDecoration: 'underline',
              }}
              title={`View employee dossier for ${customer.assignedAgentName}`}
            >
              {customer.assignedAgentName}
            </button>
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
            background: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
            border: isDark ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #10B981',
            color: isDark ? '#34D399' : '#059669',
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
