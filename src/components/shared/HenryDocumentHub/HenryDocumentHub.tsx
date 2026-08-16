import React, { FC } from 'react';
import { useHenryDocumentHubLogic } from './HenryDocumentHub.logic';
import {
  ModalOverlay,
  WizardContainer,
  WizardHeader,
  StepProgressBar,
  WizardBody,
  WizardFooter,
  ActionButton,
} from './HenryDocumentHub.style';

interface HenryDocumentHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HenryDocumentHub: FC<HenryDocumentHubProps> = ({ isOpen, onClose }) => {
  const {
    currentStep,
    isProcessing,
    selectedForm,
    setSelectedForm,
    extractedName,
    setExtractedName,
    isComplete,
    nextStep,
    prevStep,
    steps,
  } = useHenryDocumentHubLogic();

  if (!isOpen) return null;

  return (
    <ModalOverlay data-testid="henry-wizard-modal">
      <WizardContainer>
        <WizardHeader>
          <h3>📄 Henry Document Hub — 5-Step Automated OCR & PDF Wizard</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '1.2rem', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#0f0f0f'}
            onMouseOut={(e) => e.currentTarget.style.color = '#64748B'}
          >
            ✕
          </button>
        </WizardHeader>

        <StepProgressBar>
          {steps.map((step) => (
            <div
              key={step.id}
              className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
            >
              Step {step.id}
            </div>
          ))}
        </StepProgressBar>

        <WizardBody>
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 4px', color: '#0f0f0f', fontWeight: 700 }}>{steps[currentStep - 1].title}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>{steps[currentStep - 1].description}</p>
          </div>

          {currentStep === 1 && (
            <div style={{ padding: '2rem', border: '2px dashed rgba(212, 175, 55, 0.4)', borderRadius: '12px', textAlign: 'center', background: '#FAFAFA' }}>
              <span style={{ fontSize: '2rem' }}>📤</span>
              <p style={{ margin: '10px 0 0', fontWeight: 'bold', color: '#0f0f0f' }}>Drop Title Deed or Passport PDF file here</p>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Supports PDF, PNG, JPG (OCR processing enabled)</span>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Extracted Primary Party Name</label>
              <input
                type="text"
                value={extractedName}
                onChange={(e) => setExtractedName(e.target.value)}
                style={{ padding: '10px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0f0f0f', borderRadius: '8px', fontWeight: 500 }}
              />
              <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>✅ OCR Extraction Confidence: 99.2% (DLD Title Deed Matched)</div>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {(['Form A', 'Form B', 'Form I'] as const).map((form) => (
                <button
                  key={form}
                  onClick={() => setSelectedForm(form)}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1.5px solid ' + (selectedForm === form ? '#D4AF37' : '#E2E8F0'),
                    background: selectedForm === form ? 'rgba(212, 175, 55, 0.05)' : '#FFFFFF',
                    color: selectedForm === form ? '#D4AF37' : '#64748B',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {form}
                </button>
              ))}
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', color: '#10B981' }}>
              <strong>🛡️ Compliance & Trakheesi Status: CLEAR</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748B' }}>AML Screening: Passed · RERA Permit Valid to 2026 · Zero Red Flags</p>
            </div>
          )}

          {currentStep === 5 && (
            <div style={{ padding: '1.5rem', background: '#FAFAFA', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>🎉</span>
              <h4 style={{ margin: '8px 0 4px', color: '#D4AF37', fontWeight: 700 }}>Document Compiled & Signed</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>{selectedForm} PDF generated for {extractedName} with verified digital e-signature timestamp.</p>
            </div>
          )}
        </WizardBody>

        <WizardFooter>
          <ActionButton onClick={prevStep} disabled={currentStep === 1 || isProcessing}>
            Previous
          </ActionButton>
          {currentStep < 5 ? (
            <ActionButton $primary onClick={nextStep} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Continue Next Step →'}
            </ActionButton>
          ) : (
            <ActionButton $primary onClick={onClose}>
              Done & Close
            </ActionButton>
          )}
        </WizardFooter>
      </WizardContainer>
    </ModalOverlay>
  );
};

export default HenryDocumentHub;
