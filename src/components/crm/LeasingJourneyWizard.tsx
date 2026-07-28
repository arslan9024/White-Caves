import React, { useState, useEffect } from 'react';
import { LeasingTransaction, Property } from '../../mocks/dubaiRealEstateMocks';

interface LeasingJourneyWizardProps {
  transaction: LeasingTransaction;
  property?: Property;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (transactionId: string) => void;
}

export const LeasingJourneyWizard: React.FC<LeasingJourneyWizardProps> = ({ transaction, property, isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signature, setSignature] = useState(false);
  const [kycUploaded, setKycUploaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSignature(false);
      setKycUploaded(false);
    }
  }, [isOpen, transaction.id]);

  if (!isOpen) return null;

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleComplete = () => {
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
      onComplete(transaction.id);
    }, 1200);
  };

  const RED = '#EF4444';
  const SLATE = '#1E293B';
  const WHITE = '#FFFFFF';
  const CARD_BG = '#F8FAFC';
  const BORDER_COLOR = 'rgba(239, 68, 68, 0.2)';

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: WHITE, borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        {/* Header */}
        <div style={{ background: SLATE, color: WHITE, padding: '20px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Leasing Process: {property?.title || transaction.propertyId}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: WHITE, cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Progress Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} style={{ flex: 1, height: '6px', background: s <= step ? RED : '#E2E8F0', borderRadius: '3px' }} />
            ))}
          </div>

          {/* Step 1: Offer Review */}
          {step === 1 && (
            <div>
              <h3 style={{ color: RED, marginTop: 0 }}>Step 1: Offer Review</h3>
              <p style={{ color: SLATE, fontSize: '0.9rem' }}>Review the proposed terms for the property lease.</p>
              <div style={{ background: CARD_BG, padding: '16px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}`, marginBottom: '20px' }}>
                <div style={{ marginBottom: '8px' }}><strong>Property:</strong> {property?.title}</div>
                <div style={{ marginBottom: '8px' }}><strong>Community:</strong> {property?.community}</div>
                <div style={{ marginBottom: '8px' }}><strong>Agent Assigned:</strong> {transaction.agentAssigned}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: RED, marginTop: '16px' }}>Annual Rent: {property?.priceAED?.toLocaleString() || 'N/A'} AED</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={nextStep} style={{ background: RED, color: WHITE, border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Accept & Continue</button>
              </div>
            </div>
          )}

          {/* Step 2: KYC */}
          {step === 2 && (
            <div>
              <h3 style={{ color: RED, marginTop: 0 }}>Step 2: KYC & Document Upload</h3>
              <p style={{ color: SLATE, fontSize: '0.9rem' }}>Please provide your Emirates ID and Passport copy.</p>
              <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `2px dashed ${kycUploaded ? 'green' : BORDER_COLOR}`, textAlign: 'center', marginBottom: '20px', cursor: 'pointer' }} onClick={() => setKycUploaded(true)}>
                {kycUploaded ? (
                  <div style={{ color: 'green', fontWeight: 'bold' }}>✅ Documents Uploaded Successfully</div>
                ) : (
                  <div style={{ color: SLATE }}>Click to browse or drag and drop files here<br/><span style={{ fontSize: '0.75rem' }}>EID & Passport (PDF, JPEG)</span></div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={prevStep} style={{ background: '#E2E8F0', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>Back</button>
                <button onClick={nextStep} disabled={!kycUploaded} style={{ background: kycUploaded ? RED : '#ccc', color: WHITE, border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: kycUploaded ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>Continue to Signature</button>
              </div>
            </div>
          )}

          {/* Step 3: Signature */}
          {step === 3 && (
            <div>
              <h3 style={{ color: RED, marginTop: 0 }}>Step 3: Digital Signature</h3>
              <p style={{ color: SLATE, fontSize: '0.9rem' }}>Sign the preliminary Form 7 Tenancy Agreement.</p>
              <div style={{ background: CARD_BG, padding: '16px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}`, height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
                  <input type="checkbox" checked={signature} onChange={(e) => setSignature(e.target.checked)} style={{ transform: 'scale(1.5)' }} />
                  I legally sign and agree to the tenancy terms.
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={prevStep} style={{ background: '#E2E8F0', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>Back</button>
                <button onClick={handleComplete} disabled={!signature || isSubmitting} style={{ background: signature ? RED : '#ccc', color: WHITE, border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: signature ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>
                  {isSubmitting ? 'Submitting...' : 'Complete & Send to Agent'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
              <h3 style={{ color: SLATE, marginTop: 0 }}>Application Submitted!</h3>
              <p style={{ color: SLATE, fontSize: '0.9rem', marginBottom: '24px' }}>Your agent <strong>{transaction.agentAssigned}</strong> has been notified and is preparing the final Ejari and PDC schedule.</p>
              <button onClick={onClose} style={{ background: RED, color: WHITE, border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Close Window</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
