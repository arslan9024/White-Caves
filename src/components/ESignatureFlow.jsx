import React, { useState } from 'react';
import SignaturePad from './SignaturePad';
import ContractPreview from './ContractPreview';
import './ESignatureFlow.css';

/**
 * ESignatureFlow Component
 * Manages the complete e-signature workflow
 * Steps: Preview -> Acknowledge -> Sign -> Confirm
 */
const ESignatureFlow = ({
  contract,
  signerInfo = {},
  onComplete,
  onCancel,
  loading = false,
  error = null
}) => {
  const [step, setStep] = useState('preview'); // preview, acknowledge, sign, confirm
  const [signature, setSignature] = useState(null);
  const [agreementConfirmed, setAgreementConfirmed] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignatureChange = (signatureData) => {
    setSignature(signatureData);
    setErrors(prev => prev.filter(e => e !== 'signature'));
  };

  const validateStep = (stepName) => {
    const newErrors = [];

    switch (stepName) {
      case 'acknowledge':
        if (!agreementConfirmed) {
          newErrors.push('agreement');
        }
        break;
      case 'sign':
        if (!signature) {
          newErrors.push('signature');
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleProceedToAcknowledge = () => {
    setStep('acknowledge');
    window.scrollTo(0, 0);
  };

  const handleProceedToSign = () => {
    if (validateStep('acknowledge')) {
      setStep('sign');
      window.scrollTo(0, 0);
    }
  };

  const handleProceedToConfirm = () => {
    if (validateStep('sign')) {
      setStep('confirm');
      window.scrollTo(0, 0);
    }
  };

  const handleCompleteSignature = async () => {
    if (!signature) {
      setErrors(['signature']);
      return;
    }

    // Call the completion handler
    if (onComplete) {
      try {
        await onComplete({
          contractId: contract._id,
          signature,
          signerName: signerInfo.name || 'Signer',
          signerEmail: signerInfo.email,
          signerRole: signerInfo.role || 'Party',
          timestamp: new Date().toISOString(),
          ipAddress: await getClientIP(),
          userAgent: navigator.userAgent
        });
        setSuccessMessage('Contract signed successfully!');
        setStep('confirm');
      } catch (err) {
        setErrors(['failed-to-sign']);
      }
    }
  };

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (err) {
      return 'unknown';
    }
  };

  const handleBackToPreview = () => {
    setStep('preview');
    setSignature(null);
    setAgreementConfirmed(false);
    setErrors([]);
    window.scrollTo(0, 0);
  };

  return (
    <div className="esignature-flow">
      {/* Progress Indicator */}
      <div className="flow-progress">
        <div className={`progress-step ${step === 'preview' ? 'active' : ''} ${['acknowledge', 'sign', 'confirm'].includes(step) ? 'completed' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Review</span>
        </div>
        <div className="progress-line"></div>

        <div className={`progress-step ${step === 'acknowledge' ? 'active' : ''} ${['sign', 'confirm'].includes(step) ? 'completed' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Acknowledge</span>
        </div>
        <div className="progress-line"></div>

        <div className={`progress-step ${step === 'sign' ? 'active' : ''} ${step === 'confirm' ? 'completed' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Sign</span>
        </div>
        <div className="progress-line"></div>

        <div className={`progress-step ${step === 'confirm' ? 'active' : ''}`}>
          <span className="step-number">4</span>
          <span className="step-label">Confirm</span>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="alerts">
          {errors.includes('agreement') && (
            <div className="alert alert-error">
              Please confirm that you have read and agree to the terms.
            </div>
          )}
          {errors.includes('signature') && (
            <div className="alert alert-error">
              Please provide your signature to proceed.
            </div>
          )}
          {errors.includes('failed-to-sign') && (
            <div className="alert alert-error">
              Failed to complete the signing process. Please try again.
            </div>
          )}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {/* Step Content */}
      <div className="flow-content">
        {/* Step 1: Preview */}
        {step === 'preview' && (
          <div className="step-container">
            <ContractPreview
              contract={contract}
              onSign={handleProceedToAcknowledge}
              onEdit={onCancel}
              onCancel={onCancel}
              loading={loading}
              error={error}
            />
          </div>
        )}

        {/* Step 2: Acknowledge */}
        {step === 'acknowledge' && (
          <div className="step-container">
            <div className="acknowledge-section">
              <h2>Acknowledge & Agree</h2>
              <p className="section-subtitle">
                Please read and acknowledge the contract terms
              </p>

              <div className="terms-review">
                <h3>Contract Terms Summary</h3>
                <div className="terms-box">
                  <div className="term-item">
                    <span className="term-icon">📄</span>
                    <div>
                      <strong>Document Type:</strong>
                      <p>{contract.templateType} Contract</p>
                    </div>
                  </div>

                  <div className="term-item">
                    <span className="term-icon">🏠</span>
                    <div>
                      <strong>Property:</strong>
                      <p>{contract.propertyTitle} - {contract.propertyLocation}</p>
                    </div>
                  </div>

                  {contract.totalPrice && (
                    <div className="term-item">
                      <span className="term-icon">💰</span>
                      <div>
                        <strong>Amount:</strong>
                        <p>{new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'AED'
                        }).format(contract.totalPrice)}</p>
                      </div>
                    </div>
                  )}

                  {contract.startDate && (
                    <div className="term-item">
                      <span className="term-icon">📅</span>
                      <div>
                        <strong>Effective Date:</strong>
                        <p>{new Date(contract.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="acknowledgment-box">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreementConfirmed}
                    onChange={(e) => {
                      setAgreementConfirmed(e.target.checked);
                      if (e.target.checked) {
                        setErrors(prev => prev.filter(e => e !== 'agreement'));
                      }
                    }}
                  />
                  <span>I have read and understood the contract terms and conditions. I agree to enter into this contract.</span>
                </label>
              </div>

              <div className="flow-actions">
                <button
                  onClick={handleBackToPreview}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Back to Review
                </button>
                <button
                  onClick={handleProceedToSign}
                  className="btn-primary"
                  disabled={!agreementConfirmed || loading}
                >
                  Continue to Sign
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Sign */}
        {step === 'sign' && (
          <div className="step-container">
            <div className="sign-section">
              <h2>Digital Signature</h2>
              <p className="section-subtitle">
                Draw your signature below to sign the contract
              </p>

              <div className="signer-info">
                <p><strong>Signing as:</strong> {signerInfo.name || 'Signer'}</p>
                {signerInfo.email && <p><strong>Email:</strong> {signerInfo.email}</p>}
              </div>

              <SignaturePad
                onSignatureChange={handleSignatureChange}
                disabled={loading}
              />

              <div className="flow-actions">
                <button
                  onClick={() => setStep('acknowledge')}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToConfirm}
                  className="btn-primary"
                  disabled={!signature || loading}
                >
                  {loading ? 'Processing...' : 'Review & Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 'confirm' && (
          <div className="step-container">
            <div className="confirm-section">
              <h2>Confirm Signature</h2>
              <p className="section-subtitle">
                Please review your signature before submitting
              </p>

              <div className="signature-review">
                <h3>Your Signature</h3>
                {signature && (
                  <div className="signature-display">
                    <img src={signature} alt="Your signature" />
                    <p className="signer-confirmation">
                      Signed by: {signerInfo.name || 'Signer'} on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="legal-notice">
                <h3>Legal Notice</h3>
                <p>
                  By clicking "Sign Contract" below, you are legally signing this document with the same effect as your handwritten signature. This signature is legally binding and confirms your agreement to all terms and conditions stated herein.
                </p>
              </div>

              <div className="flow-actions">
                <button
                  onClick={() => setStep('sign')}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Back to Sign
                </button>
                <button
                  onClick={handleCompleteSignature}
                  className="btn-create"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Sign Contract'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* General Actions */}
      {step !== 'confirm' && !error && (
        <div className="general-actions">
          <button
            onClick={onCancel}
            className="btn-cancel"
            disabled={loading}
          >
            Cancel Process
          </button>
        </div>
      )}
    </div>
  );
};

export default ESignatureFlow;
