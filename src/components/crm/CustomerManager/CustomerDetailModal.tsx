/**
 * White Caves Real Estate LLC - Customer Detail Modal / Inline View Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Modal / In-Page View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { CustomerItem } from './CustomerManager.types';
import { CustomerInteractionsSection } from './CustomerInteractionsSection';
import { Customer18StepPipelineSection } from './Customer18StepPipelineSection';

export interface CustomerDetailModalProps {
  customer: CustomerItem;
  onClose: () => void;
  onAdvanceStep: (customerId: string, nextStep: number, nextStepName: string) => void;
  onVerifyKyc: (customerId: string) => void;
  onAddInteraction: (
    customerId: string,
    interaction: {
      date: string;
      channel: 'WHATSAPP' | 'CALL' | 'EMAIL' | 'MEETING';
      notes: string;
      agentName: string;
    }
  ) => void;
  isInline?: boolean;
}

export const CustomerDetailModal: FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
  onAdvanceStep,
  onVerifyKyc,
  onAddInteraction,
  isInline = false,
}) => {
  const cardContent = (
    <>
      {/* Top Inline Back Navigation Banner */}
      {isInline && (
        <div
          style={{
            padding: '14px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            data-testid="customer-back-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#38BDF8',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            <span>← Back to Client Directory</span>
          </button>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>
            Active Profile · {customer.id}
          </span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.02)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34D399',
                border: '1px solid #10B981',
              }}
            >
              {customer.customerType}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38BDF8' }}>
              {customer.id} · {customer.customerCode}
            </span>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            {customer.fullName}
          </h2>
        </div>

        {!isInline && (
          <button
            onClick={onClose}
            data-testid="close-customer-modal"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: '#94A3B8',
              padding: '6px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Modal / Inline Body */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 18-Step Pipeline Stepper Bar */}
        <Customer18StepPipelineSection customer={customer} onAdvanceStep={onAdvanceStep} />

        {/* Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              style={{
                fontSize: '0.65rem',
                color: '#64748B',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Contact & Source
            </div>
            <div style={{ fontSize: '0.82rem', color: '#CBD5E1', marginTop: '4px' }}>
              {customer.email} <br />
              {customer.phone}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#38BDF8', marginTop: '4px' }}>
              Acquired via: {customer.source}
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              style={{
                fontSize: '0.65rem',
                color: '#64748B',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Preferences & Budget
            </div>
            <div
              style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}
            >
              AED {customer.budgetAED.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              {customer.preferredCommunity}
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              style={{
                fontSize: '0.65rem',
                color: '#64748B',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              KYC Status
            </div>
            <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: customer.kycVerified
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(245, 158, 11, 0.2)',
                  color: customer.kycVerified ? '#34D399' : '#FBBF24',
                }}
              >
                {customer.kycVerified ? 'VERIFIED' : 'PENDING'}
              </span>
              {!customer.kycVerified && (
                <button
                  onClick={() => onVerifyKyc(customer.id)}
                  data-testid="verify-kyc-btn"
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: '#10B981',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Verify
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Interactions History */}
        <CustomerInteractionsSection
          customerId={customer.id}
          interactions={customer.interactions}
          agentName={customer.assignedAgentName}
          onAddInteraction={onAddInteraction}
        />
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: '8px 20px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          {isInline ? 'Close Profile & Return' : 'Close Profile'}
        </button>
      </div>
    </>
  );

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: isInline ? '100%' : '840px',
    maxHeight: isInline ? 'none' : '90vh',
    backgroundColor: '#070D18',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    overflowY: isInline ? 'visible' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: isInline ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  };

  if (isInline) {
    return (
      <div data-testid="customer-detail-main-view" style={{ width: '100%', padding: '0 0 24px 0' }}>
        <div data-testid="customer-detail-modal" style={cardStyle}>
          {cardContent}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      data-testid="customer-detail-modal"
    >
      <div data-testid="customer-detail-card" style={cardStyle}>
        {cardContent}
      </div>
    </div>
  );
};
