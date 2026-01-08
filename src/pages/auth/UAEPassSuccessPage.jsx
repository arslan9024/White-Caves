import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../../store/authSlice';
import AppLayout from '../../components/layout/AppLayout';
import './AuthPages.css';

const UAEPassSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setError('No authentication token received');
        return;
      }

      try {
        const response = await fetch('/api/auth/uaepass/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Token verification failed');
        }

        const userData = {
          uid: data.user.emiratesId,
          email: data.user.email,
          displayName: data.user.name,
          nameAR: data.user.nameAR,
          emiratesId: data.user.emiratesId,
          verified: data.user.verified,
          provider: 'uaepass',
        };

        dispatch(loginSuccess({
          user: userData,
          token,
          provider: 'uaepass',
        }));

        setStatus('success');
        
        setTimeout(() => {
          navigate('/role-selection', { replace: true });
        }, 1500);

      } catch (err) {
        console.error('UAE Pass verification error:', err);
        setStatus('error');
        setError(err.message);
        dispatch(loginFailure(err.message));
      }
    };

    verifyToken();
  }, [searchParams, dispatch, navigate]);

  return (
    <AppLayout>
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card uaepass-success-card">
            {status === 'verifying' && (
              <>
                <div className="uaepass-loading-icon">
                  <svg viewBox="0 0 50 50" width="60" height="60">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="#1B4D3E" strokeWidth="4" strokeDasharray="100" strokeLinecap="round">
                      <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                </div>
                <h2>Verifying UAE Pass</h2>
                <p>Please wait while we verify your identity...</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="uaepass-success-icon">
                  <svg viewBox="0 0 50 50" width="60" height="60">
                    <circle cx="25" cy="25" r="23" fill="#1B4D3E"/>
                    <path d="M20 25L23 28L30 21" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2>Identity Verified</h2>
                <p>Welcome! Redirecting you to role selection...</p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="uaepass-error-icon">
                  <svg viewBox="0 0 50 50" width="60" height="60">
                    <circle cx="25" cy="25" r="23" fill="#DC2626"/>
                    <path fill="#FFFFFF" d="M18 18L32 32M32 18L18 32" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2>Verification Failed</h2>
                <p>{error || 'An error occurred during verification'}</p>
                <button 
                  className="auth-btn primary-btn"
                  onClick={() => navigate('/auth/signin')}
                >
                  Back to Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UAEPassSuccessPage;
