import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SignatureCollection from './SignatureCollection';
import './ContractSigningPage.css';

/**
 * ContractSigningPage Component
 * Page for signing contracts via email link
 * Handles token verification and signature collection
 */
const ContractSigningPage = () => {
  const { contractId, token } = useParams();
  const [contract, setContract] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [signatureComplete, setSignatureComplete] = useState(false);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/signatures/${contractId}/${token}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to verify token');
        }

        const data = await response.json();
        setTokenData(data.data.tokenData);
        setContract(data.data.contract);
        setError(null);
      } catch (err) {
        setError(err.message || 'An error occurred');
        setTokenData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (contractId && token) {
      verifyToken();
    }
  }, [contractId, token]);

  /**
   * Handle signature completion
   */
  const handleSignatureComplete = (result) => {
    setSignatureComplete(true);
    console.log('Signature submitted successfully:', result);

    // Redirect after a delay
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    window.location.href = '/';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="signing-page-container">
        <div className="signing-page-loading">
          <div className="spinner"></div>
          <p>Loading contract...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !tokenData) {
    return (
      <div className="signing-page-container">
        <div className="signing-page-error">
          <div className="error-icon">⚠</div>
          <h2>Unable to Sign Contract</h2>
          <p>{error || 'Invalid signature token'}</p>
          <p className="error-hint">
            The signing link may be invalid, expired, or has already been used.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = '/')}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (signatureComplete) {
    return (
      <div className="signing-page-container">
        <div className="signing-page-success">
          <div className="success-icon">✓</div>
          <h2>Signature Received</h2>
          <p>Your signature has been recorded successfully.</p>
          <p className="success-hint">You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  // Signing page
  return (
    <div className="signing-page-container">
      <div className="signing-page-background">
        <div className="background-decoration"></div>
      </div>

      <div className="signing-page-content">
        <SignatureCollection
          contractId={contractId}
          signatureId={tokenData.signatureId}
          signerName={tokenData.signerName}
          signerRole={tokenData.signerRole}
          signerEmail={tokenData.signerEmail}
          contractDetails={contract || {}}
          onSignatureComplete={handleSignatureComplete}
          onCancel={handleCancel}
          isOpen={true}
        />
      </div>
    </div>
  );
};

export default ContractSigningPage;
