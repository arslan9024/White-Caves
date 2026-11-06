/**
 * White Caves Real Estate LLC - 18-Step Customer Pipeline Section
 * Standard: AEGIS Canonical 7-Category Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { CustomerItem } from './CustomerManager.types';
import { PIPELINE_18_STEPS } from './CustomerManager.workflow';

export interface Customer18StepPipelineSectionProps {
  customer: CustomerItem;
  onAdvanceStep: (customerId: string, nextStep: number, nextStepName: string) => void;
}

export const Customer18StepPipelineSection: FC<Customer18StepPipelineSectionProps> = ({
  customer,
  onAdvanceStep,
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
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
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
                background: isCurrent ? '#38BDF8' : isPassed ? '#10B981' : 'rgba(255,255,255,0.08)',
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
  );
};
