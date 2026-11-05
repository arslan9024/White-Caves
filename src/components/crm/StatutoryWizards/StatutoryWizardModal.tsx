/**
 * White Caves Real Estate LLC - Statutory Wizard Modal View
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { X, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StatutoryWizardModalProps } from './StatutoryWizards.types';
import { useStatutoryWizardLogic } from './StatutoryWizards.logic';
import {
  WizardBackdrop,
  WizardModalContainer,
  WizardHeader,
  StepProgressBar,
  StepPill,
  WizardBody,
  FieldGroup,
  WizardFooter,
} from './StatutoryWizards.styles';

export const StatutoryWizardModal: FC<StatutoryWizardModalProps> = ({
  isOpen,
  onClose,
  flowType,
  targetId,
  targetTitle,
  onComplete,
}) => {
  const {
    flowDef,
    currentStepIndex,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    formData,
    handleFieldChange,
    handleNextStep,
    handlePreviousStep,
  } = useStatutoryWizardLogic({ flowType, onComplete, onClose });

  if (!isOpen || !flowDef || !currentStep) return null;

  return (
    <WizardBackdrop
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid="statutory-wizard-backdrop"
    >
      <WizardModalContainer data-testid="statutory-wizard-modal">
        {/* ── Header ── */}
        <WizardHeader>
          <div className="header-left">
            <span className="code-badge">
              <ShieldCheck size={14} color={flowDef.authorityColor} />
              {flowDef.authorityBadge} · {flowDef.code}
            </span>
            <h2>{flowDef.title}</h2>
            {targetTitle && (
              <p>
                Target Context: {targetTitle} {targetId ? `(${targetId})` : ''}
              </p>
            )}
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            data-testid="close-statutory-wizard"
          >
            <X size={18} />
          </button>
        </WizardHeader>

        {/* ── Multi-Step Progress Tracker ── */}
        <StepProgressBar>
          {flowDef.steps.map((step, idx) => (
            <StepPill
              key={step.stepNumber}
              $active={idx === currentStepIndex}
              $completed={idx < currentStepIndex}
              title={`Step ${step.stepNumber}: ${step.title}`}
            />
          ))}
        </StepProgressBar>

        {/* ── Active Step Body ── */}
        <WizardBody>
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
                fontSize: '0.75rem',
                fontWeight: 800,
                color: flowDef.authorityColor,
                textTransform: 'uppercase',
              }}
            >
              Step {currentStep.stepNumber} of {totalSteps}: {currentStep.title}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#CBD5E1',
                fontWeight: 700,
              }}
            >
              {currentStep.authority} Attested
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 12px 0' }}>
            {currentStep.description}
          </p>

          {/* Render Step Input Fields */}
          {currentStep.fields.map(field => (
            <FieldGroup key={field.key}>
              <label>{field.label}</label>
              <input
                type="text"
                data-testid={`statutory-input-${field.key}`}
                value={formData[field.key] ?? ''}
                onChange={e => handleFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            </FieldGroup>
          ))}
        </WizardBody>

        {/* ── Footer Navigation ── */}
        <WizardFooter>
          <button
            type="button"
            onClick={handlePreviousStep}
            disabled={isFirstStep}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: isFirstStep ? '#475569' : '#CBD5E1',
              cursor: isFirstStep ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            data-testid="statutory-next-btn"
            style={{
              background: isLastStep
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'linear-gradient(135deg, #EF4444, #DC2626)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 20px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            {isLastStep ? (
              <>
                <CheckCircle2 size={14} /> Attest & Issue Deliverable
              </>
            ) : (
              <>
                Continue to Step {currentStep.stepNumber + 1} <ArrowRight size={14} />
              </>
            )}
          </button>
        </WizardFooter>
      </WizardModalContainer>
    </WizardBackdrop>
  );
};

export default StatutoryWizardModal;
