/**
 * White Caves Real Estate LLC - Customer Detail Modal Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Modal)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { X, CheckCircle, ArrowRight } from 'lucide-react';
import { CustomerItem } from './CustomerManager.types';
import { PIPELINE_18_STEPS } from './CustomerManager.workflow';
import { CustomerInteractionsSection } from './CustomerInteractionsSection';

interface CustomerDetailModalProps {
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
}

export const CustomerDetailModal: FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
  onAdvanceStep,
  onVerifyKyc,
  onAddInteraction,
}) => {
  const currentStepIndex = customer.currentStep;
  const canAdvance = currentStepIndex < 18;
  const nextStepDef = canAdvance ? PIPELINE_18_STEPS[currentStepIndex] : null;

  const handleAdvance = () => {
    if (nextStepDef) {
      onAdvanceStep(customer.id, nextStepDef.step, nextStepDef.name);
    }
  };

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
      <div
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          backgroundColor: '#070D18',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
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
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 18-Step Pipeline Stepper Bar */}
          <div
            style={{
              padding: '16px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                  }}
                >
                  18-Step Transaction Workflow Engine
                </span>
                <div
                  style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}
                >
                  Step {customer.currentStep}: {customer.stepName.replace(/_/g, ' ')}
                </div>
              </div>

              {canAdvance ? (
                <button
                  onClick={handleAdvance}
                  data-testid="advance-step-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  <span>Advance to Step {nextStepDef?.step}</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <span
                  style={{
                    color: '#34D399',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle size={16} /> 100% FTA Tax Filed
                </span>
              )}
            </div>

            {/* Stepper bubbles */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '6px 0' }}>
              {PIPELINE_18_STEPS.map(s => {
                const isPassed = s.step <= customer.currentStep;
                const isCurrent = s.step === customer.currentStep;
                return (
                  <div
                    key={s.step}
                    title={`${s.step}. ${s.name}`}
                    style={{
                      flex: 1,
                      minWidth: '28px',
                      height: '24px',
                      borderRadius: '4px',
                      background: isCurrent
                        ? '#38BDF8'
                        : isPassed
                          ? '#10B981'
                          : 'rgba(255,255,255,0.08)',
                      color: isPassed ? '#070D18' : '#64748B',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {s.step}
                  </div>
                );
              })}
            </div>
          </div>

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
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
