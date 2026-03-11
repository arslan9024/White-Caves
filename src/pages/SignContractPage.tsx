import React, { FC, useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { useTheme } from '../context/ThemeContext';
import './SignContractPage.css';

interface ContractData {
  id: string;
  parties: string[];
  amount: number;
  date: string;
}

interface SignContractPageProps {}

const SignContractPage: FC<SignContractPageProps> = () => {
  const { token } = useParams<{token: string}>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const sigRef = useRef<any>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<ContractData | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [signerName, setSignerName] = useState<string>('');
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [signed, setSigned] = useState<boolean>(false);

  useEffect(() => {
    fetchContractData();
  }, [token]);

  const fetchContractData = async (): Promise<void> => {
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

  const clearSignature = (): void => {
    sigRef.current?.clear();
  };

  const handleSign = async (): Promise<void> => {
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

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-AE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number | null | undefined): string => {
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

  return (
    <div className={`sign-contract-page ${isDark ? 'dark' : ''}`}>
      <div className="contract-container">
        <h1>E-Signature</h1>
        {contract && (
          <div className="contract-details">
            <h2>Contract Details</h2>
            <p><strong>Amount:</strong> {formatCurrency(contract.amount)}</p>
            <p><strong>Date:</strong> {formatDate(contract.date)}</p>
          </div>
        )}
        
        {!signed && (
          <div className="signature-section">
            <h3>Sign Here</h3>
            <input
              type="text"
              placeholder="Enter your full name"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              className="signer-name-input"
            />
            <SignatureCanvas
              ref={sigRef}
              canvasProps={{ className: 'signature-canvas' }}
            />
            <div className="signature-actions">
              <button onClick={clearSignature} className="btn-clear">Clear</button>
              <button onClick={handleSign} disabled={isSigning} className="btn-sign">
                {isSigning ? 'Signing...' : 'Sign Contract'}
              </button>
            </div>
          </div>
        )}
        
        {signed && (
          <div className="success-message">
            <h2>✓ Contract Signed Successfully</h2>
            <p>Your signature has been recorded and the contract is now complete.</p>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default SignContractPage;
