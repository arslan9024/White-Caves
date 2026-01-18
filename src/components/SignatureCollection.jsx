import React, { useState, useEffect } from 'react';
import SignaturePad from './SignaturePad';
import './SignatureCollection.css';

/**
 * SignatureCollection Modal Component
 * Manages the complete signature collection workflow
 * - Display contract info
 * - Collect signature from user
 * - Send signed contract for other parties
 * - Track signature status
 */
const SignatureCollection = ({
  contractId,
  signatureId,
  signerName,
  signerRole,
  signerEmail,
  contractDetails = {},
  onSignatureComplete,
  onCancel,
  isOpen = true
}) => {
  const [step, setStep] = useState('review'); // review, sign, confirm
  const [signatureData, setSignatureData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle signature capture
   */
  const handleSignatureCapture = (capturedSignature) => {
    setSignatureData(capturedSignature);
    setStep('confirm');
  };

  /**
   * Submit signature to backend
   */
  const handleSubmitSignature = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare device info
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      };

      // Submit signature
      const response = await fetch(`/api/signatures/${signatureId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageData: signatureData.imageData,
          mimeType: signatureData.mimeType,
          method: 'canvas',
          deviceInfo,
          coordinates: signatureData.coordinates
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit signature');
      }

      const data = await response.json();

      // Show success
      setStep('complete');

      // Callback
      if (onSignatureComplete) {
        onSignatureComplete({
          signatureId: data.data.signatureId,
          status: data.data.status,
          signedAt: data.data.signedAt
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit signature');
      setStep('sign');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  /**
   * Back to previous step
   */
  const handleBack = () => {
    if (step === 'confirm') {
      setStep('sign');
      setSignatureData(null);
    } else if (step === 'sign') {
      setStep('review');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="signature-collection-overlay">
      <div className="signature-collection-modal">
        {/* Header */}
        <div className="signature-collection-header">
          <h2>Sign Contract</h2>
          <button
            className="signature-collection-close"
            onClick={handleCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Progress indicator */}
        <div className="signature-progress">
          <div className={`progress-step ${step === 'review' ? 'active' : step === 'sign' || step === 'confirm' ? 'completed' : ''}`}>
            <span className="progress-number">1</span>
            <span className="progress-label">Review</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'sign' || step === 'confirm' ? 'active' : ''} ${step === 'complete' ? 'completed' : ''}`}>
            <span className="progress-number">2</span>
            <span className="progress-label">Sign</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'confirm' ? 'active' : ''} ${step === 'complete' ? 'completed' : ''}`}>
            <span className="progress-number">3</span>
            <span className="progress-label">Confirm</span>
          </div>
        </div>

        {/* Content */}
        <div className="signature-collection-content">
          {/* Step 1: Review Contract */}
          {step === 'review' && (
            <div className="signature-step review-step">
              <h3>Contract Details</h3>
              <div className="contract-info">
                <div className="contract-info-row">
                  <label>Contract Number:</label>
                  <span>{contractDetails.contractNumber || 'N/A'}</span>
                </div>
                <div className="contract-info-row">
                  <label>Contract Type:</label>
                  <span>{contractDetails.contractType || 'Tenancy'}</span>
                </div>
                <div className="contract-info-row">
                  <label>Status:</label>
                  <span className="status-badge">{contractDetails.status || 'pending'}</span>
                </div>
              </div>

              <div className="signer-info">
                <h4>Signing As:</h4>
                <div className="signer-details">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{signerName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Role:</span>
                    <span className="detail-value">{signerRole}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{signerEmail}</span>
                  </div>
                </div>
              </div>

              <div className="contract-preview">
                <h4>Contract Preview:</h4>
                <div className="preview-content">
                  <p>
                    By clicking "Continue", you will be asked to sign this contract digitally.
                    Your signature will be recorded along with timestamp and device information
                    for audit and verification purposes.
                  </p>
                </div>
              </div>

              {error && (
                <div className="error-alert">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Sign */}
          {step === 'sign' && (
            <div className="signature-step sign-step">
              <SignaturePad
                onSignatureCapture={handleSignatureCapture}
                onCancel={handleCancel}
                signerName={signerName}
                signerRole={signerRole}
                width={700}
                height={300}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && signatureData && (
            <div className="signature-step confirm-step">
              <h3>Confirm Your Signature</h3>
              <p className="confirm-subtitle">Please review your signature below</p>

              <div className="signature-preview">
                <img
                  src={signatureData.imageData}
                  alt="Your signature"
                  className="signature-image"
                />
              </div>

              <div className="confirmation-checklist">
                <label className="checkbox-item">
                  <input type="checkbox" required />
                  <span>I confirm this is my legal signature</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" required />
                  <span>I agree to the terms of this contract</span>
                </label>
              </div>

              {error && (
                <div className="error-alert">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <div className="signature-step complete-step">
              <div className="success-icon">✓</div>
              <h3>Signature Submitted Successfully!</h3>
              <p className="success-message">
                Your signature has been recorded and the contract has been updated.
              </p>
              <div className="completion-details">
                <p>
                  A confirmation email will be sent to <strong>{signerEmail}</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="signature-collection-footer">
          {step === 'review' && (
            <>
              <button
                className="btn btn-outline"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setStep('sign')}
              >
                Continue to Sign
              </button>
            </>
          )}

          {step === 'sign' && (
            <>
              <button
                className="btn btn-outline"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setStep('review')}
              >
                Back
              </button>
            </>
          )}

          {step === 'confirm' && (
            <>
              <button
                className="btn btn-outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitSignature}
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Signature'}
              </button>
            </>
          )}

          {step === 'complete' && (
            <button
              className="btn btn-primary"
              onClick={handleCancel}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignatureCollection;
