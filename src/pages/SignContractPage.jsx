import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { useTheme } from '../context/ThemeContext';
import './SignContractPage.css';

export default function SignContractPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const sigRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState(null);
  const [signerName, setSignerName] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    fetchContractData();
  }, [token]);

  const fetchContractData = async () => {
    try {
      const response = await fetch(`/api/signature/${token}`);
      const data = await response.json();
      
      if (!data.success) {
        setError(data.error);
        return;
      }
      
      setContract(data.contract);
      setRole(data.role);
      setSignerName(data.signerName || '');
    } catch (err) {
      setError('Failed to load contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearSignature = () => {
    sigRef.current?.clear();
  };

  const handleSign = async () => {
    if (sigRef.current?.isEmpty()) {
      alert('Please provide your signature before submitting.');
      return;
    }

    setIsSigning(true);
    
    try {
      const signature = sigRef.current.toDataURL('image/png');
      
      const response = await fetch(`/api/signature/${token}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature, signerName })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSigned(true);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to submit signature. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-AE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `AED ${Number(amount).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className={`sign-contract-page ${isDark ? 'dark' : ''}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading contract...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`sign-contract-page ${isDark ? 'dark' : ''}`}>
        <div className="error-container">
          <div className="error-icon">!</div>
          <h2>Unable to Load Contract</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="home-btn">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (signed) {
    return (
      <div className={`sign-contract-page ${isDark ? 'dark' : ''}`}>
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2>Contract Signed Successfully!</h2>
          <p>Thank you for signing the tenancy contract.</p>
          <p className="contract-ref">Contract Reference: {contract.contractNumber}</p>
          <p className="note">A copy of the signed contract will be sent to your email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`sign-contract-page ${isDark ? 'dark' : ''}`}>
      <div className="sign-contract-container">
        <header className="sign-header">
          <div className="logo">
            <h1>White Caves</h1>
            <span>Real Estate LLC</span>
          </div>
          <div className="contract-ref-header">
            Contract #{contract.contractNumber}
          </div>
        </header>

        <div className="sign-content">
          <div className="role-badge">
            You are signing as: <strong>{role === 'lessor' ? 'Landlord/Lessor' : 'Tenant'}</strong>
          </div>

          <h2>Ejari Unified Tenancy Contract</h2>
          <p className="subtitle">عقد الإيجار الموحد</p>

          <div className="contract-summary">
            <div className="summary-section">
              <h3>Property Details</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <label>Building</label>
                  <span>{contract.buildingName || '-'}</span>
                </div>
                <div className="summary-item">
                  <label>Property Type</label>
                  <span>{contract.propertyType || '-'}</span>
                </div>
                <div className="summary-item">
                  <label>Location</label>
                  <span>{contract.location || '-'}</span>
                </div>
                <div className="summary-item">
                  <label>Usage</label>
                  <span>{contract.propertyUsage || '-'}</span>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h3>Parties</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <label>Landlord/Lessor</label>
                  <span>{contract.lessorName || contract.ownerName || '-'}</span>
                </div>
                <div className="summary-item">
                  <label>Tenant</label>
                  <span>{contract.tenantName || '-'}</span>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h3>Lease Terms</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <label>Period</label>
                  <span>{formatDate(contract.contractPeriodFrom)} - {formatDate(contract.contractPeriodTo)}</span>
                </div>
                <div className="summary-item">
                  <label>Annual Rent</label>
                  <span>{formatCurrency(contract.annualRent)}</span>
                </div>
                <div className="summary-item">
                  <label>Security Deposit</label>
                  <span>{formatCurrency(contract.securityDeposit)}</span>
                </div>
                <div className="summary-item">
                  <label>Payment Mode</label>
                  <span>{contract.modeOfPayment || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="terms-acknowledgement">
            <h3>Terms Acknowledgement</h3>
            <p>By signing below, I acknowledge that:</p>
            <ul>
              <li>I have read and understood all terms and conditions of this tenancy contract</li>
              <li>I agree to comply with all obligations stated in the contract</li>
              <li>All information provided is accurate and complete</li>
              <li>This digital signature is legally binding</li>
            </ul>
          </div>

          <div className="signature-section">
            <h3>Your Signature</h3>
            <div className="signer-name-input">
              <label>Full Name (as it appears on Emirates ID)</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="signature-pad-wrapper">
              <SignatureCanvas
                ref={sigRef}
                canvasProps={{
                  className: 'signature-canvas',
                  width: 500,
                  height: 200
                }}
                backgroundColor="white"
              />
              <button type="button" onClick={clearSignature} className="clear-btn">
                Clear
              </button>
            </div>

            <div className="sign-actions">
              <button
                onClick={handleSign}
                disabled={isSigning}
                className="submit-signature-btn"
              >
                {isSigning ? 'Submitting...' : 'Sign Contract'}
              </button>
            </div>
          </div>
        </div>

        <footer className="sign-footer">
          <p>White Caves Real Estate LLC - Dubai, UAE</p>
          <p>admin@whitecaves.com</p>
        </footer>
      </div>
    </div>
  );
}
