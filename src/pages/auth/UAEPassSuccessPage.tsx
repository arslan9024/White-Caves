import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './AuthPages.css';

interface UAEPassSuccessPageProps {}

interface UserData {
  name: string;
  email: string;
  uaeId: string;
  emirate: string;
  phone?: string;
}

const UAEPassSuccessPage: FC<UAEPassSuccessPageProps> = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const user = useSelector((state: any) => state.user.currentUser);

  useEffect(() => {
    authenticateWithUAEPass();
  }, [searchParams]);

  const authenticateWithUAEPass = async (): Promise<void> => {
    try {
      setLoading(true);
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code) {
        setError('Authentication failed: No authorization code received');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/uae-pass/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state })
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        
        // Update redux store with user data
        dispatch({
          type: 'user/setCurrentUser',
          payload: data.user
        });

        // Wait a moment to show success message, then redirect
        setTimeout(() => {
          navigate('/modern-dashboard');
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Error authenticating with UAE Pass:', err);
      setError('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="uae-pass-success-page">
        <div className="success-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Authenticating with UAE Pass...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="uae-pass-success-page">
        <div className="success-container">
          <div className="error-box">
            <h2>❌ Authentication Failed</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/auth/login')} className="btn-retry">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="uae-pass-success-page">
      <div className="success-container">
        <div className="success-box">
          <div className="success-icon">✓</div>
          <h1>Welcome!</h1>
          
          {userData && (
            <div className="user-info">
              <p className="greeting">Welcome back, <strong>{userData.name}</strong></p>
              
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{userData.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">UAE ID:</span>
                  <span className="value">{userData.uaeId}</span>
                </div>
                <div className="info-item">
                  <span className="label">Emirate:</span>
                  <span className="value">{userData.emirate}</span>
                </div>
                {userData.phone && (
                  <div className="info-item">
                    <span className="label">Phone:</span>
                    <span className="value">{userData.phone}</span>
                  </div>
                )}
              </div>

              <p className="redirect-message">
                You will be redirected to your dashboard in a few seconds...
              </p>

              <button
                onClick={() => navigate('/modern-dashboard')}
                className="btn-continue"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>

        <div className="security-notice">
          <h3>🔒 Your Information is Secure</h3>
          <p>
            You've successfully authenticated using UAE Pass. Your personal information is encrypted and only used for account verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UAEPassSuccessPage;
