import React from 'react';
import { CheckCircle2, Clock, Lock, CreditCard } from 'lucide-react';

export type CommissionState = 'AGENT_SUBMITTED' | 'MANAGER_APPROVED' | 'FINANCE_LOCKED' | 'PAYMENT_RELEASED';

interface CommissionWorkflowProps {
  dealId: string;
  propertyTitle: string;
  brokerName: string;
  dealAmountAED: number;
  brokerSplitAED: number;
  currentState: CommissionState;
}

export const CommissionApprovalWorkflow: React.FC<CommissionWorkflowProps> = ({
  dealId = 'DEAL-9942',
  propertyTitle = 'Luxury Villa 5BR — DAMAC Hills 2',
  brokerName = 'Sarah Al Maktoum',
  dealAmountAED = 8500000,
  brokerSplitAED = 11900,
  currentState = 'MANAGER_APPROVED',
}) => {
  const steps: { state: CommissionState; title: string; desc: string; icon: React.ReactNode }[] = [
    { state: 'AGENT_SUBMITTED', title: '1. Agent Submitted', desc: 'Deal sheet & Ejari signed', icon: <Clock size={16} /> },
    { state: 'MANAGER_APPROVED', title: '2. Manager Approved', desc: 'RERA Form B verified', icon: <CheckCircle2 size={16} /> },
    { state: 'FINANCE_LOCKED', title: '3. Finance Locked', desc: 'Escrow deposit cleared', icon: <Lock size={16} /> },
    { state: 'PAYMENT_RELEASED', title: '4. Payment Released', desc: 'Bank transfer executed', icon: <CreditCard size={16} /> },
  ];

  const getStateIndex = (state: CommissionState) => {
    switch (state) {
      case 'AGENT_SUBMITTED': return 0;
      case 'MANAGER_APPROVED': return 1;
      case 'FINANCE_LOCKED': return 2;
      case 'PAYMENT_RELEASED': return 3;
    }
  };

  const activeIdx = getStateIndex(currentState);

  return (
    <div style={{ backgroundColor: 'var(--wc-surface-canvas, #FFFFFF)', border: '1px solid var(--wc-border-light, #E2E8F0)', borderRadius: '12px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--wc-border-light, #E2E8F0)' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)', fontWeight: 'bold' }}>DEAL RECORD: {dealId}</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--wc-text-primary, #1E293B)', marginTop: '2px' }}>{propertyTitle}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)' }}>Broker Payout (70%)</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--wc-red-primary, #EF4444)' }}>
            AED {brokerSplitAED.toLocaleString('en-US')}
          </div>
        </div>
      </div>

      {/* Stepper Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {steps.map((step, idx) => {
          const isDone = idx <= activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={step.state}
              style={{
                padding: '14px',
                borderRadius: '8px',
                backgroundColor: isCurrent ? 'var(--wc-red-light, #FFF5F5)' : isDone ? 'var(--wc-surface-card, #F8FAFC)' : 'var(--wc-surface-canvas, #FFFFFF)',
                border: isCurrent ? '2px solid var(--wc-red-primary, #EF4444)' : isDone ? '1px solid var(--wc-border-light, #CBD5E1)' : '1px dashed var(--wc-border-light, #E2E8F0)',
                opacity: idx > activeIdx ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: isDone ? 'var(--wc-red-primary, #EF4444)' : 'var(--wc-text-secondary, #64748B)' }}>
                {step.icon}
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: isDone ? 'var(--wc-text-primary, #1E293B)' : 'var(--wc-text-secondary, #64748B)' }}>{step.title}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--wc-text-secondary, #64748B)' }}>{step.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommissionApprovalWorkflow;
