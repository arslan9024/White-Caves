import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import SignatureCanvas from 'react-signature-canvas';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/Toast';
import { formatCurrency, formatDate } from '../utils';
import { authFetch } from '../utils/authFetch';
import './SignContractPage.css';

interface ContractData {
  id: string;
  parties: string[];
  amount: number;
  date: string;
}

const SignContractPage: FC = () => {
  useDocumentTitle('Sign Contract');
  const { token } = useParams<{token: string}>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const toast = useToast();
  const sigRef = useRef<SignatureCanvas | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<ContractData | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [signerName, setSignerName] = useState<string>('');
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [signed, setSigned] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!token) return;
    // Validate token format to prevent path traversal and injection
    if (!/^[a-zA-Z0-9_-]{8,256}$/.test(token)) {
      setError('Invalid contract link. Please check the URL and try again.');
      setLoading(false);
      return;
    }
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    fetchContractData(controller.signal);
    return () => { controller.abort(); };
  }, [token]);

  const fetchContractData = useCallback(async (signal?: AbortSignal): Promise<void> => {
    try {
      const response = await authFetch(`/api/signature/${token}`, { signal });
      if (!response.ok) {
        throw new Error(`Failed to load contract (HTTP ${response.status})`);
      }
      const data = await response.json();
      
      if (!data.success) {
        setError(data.error);
        return;
      }
      
      setContract(data.contract);
      setRole(data.role);
      setSignerName(data.signerName || '');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Failed to load contract. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const clearSignature = (): void => {
    sigRef.current?.clear();
  };

  const handleSign = async (): Promise<void> => {
    if (!signerName.trim()) {
      toast.warning('Please enter your full name before signing.');
      return;
    }

    const sigCanvas = sigRef.current;
    if (!sigCanvas || sigCanvas.isEmpty()) {
      toast.warning('Please provide your signature before submitting.');
      return;
    }

    // Capture signature data synchronously BEFORE any async state updates
    const signature = sigCanvas.toDataURL('image/png');
    setIsSigning(true);
    
    try {
      
      const response = await authFetch(`/api/signature/${token}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature, signerName: signerName.trim() })
      });
      
      if (!response.ok) {
        throw new Error(`Signature submission failed (HTTP ${response.status})`);
      }
      
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
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <div className="error-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn-clear"
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  abortControllerRef.current?.abort();
                  const controller = new AbortController();
                  abortControllerRef.current = controller;
                  fetchContractData(controller.signal);
                }}
              >
                Retry
              </button>
              <button className="btn-clear" onClick={() => navigate('/')}>
                Go Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignContractPage;
