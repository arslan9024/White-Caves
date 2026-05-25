import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createLogger } from '../../utils/logger';
import { authFetch } from '../../utils/authFetch';
import { finalizeAuthenticatedSession, navigateToPostLoginDestination } from '../../utils/authSession';
import './AuthPages.css';

const log = createLogger('UAEPassSuccess');

interface UserData {
  name: string;
  email: string;
  uaeId: string;
  emirate: string;
  phone?: string;
}

const UAEPassSuccessPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isMountedRef = useRef(true);

  // Memoize search params to prevent useEffect re-runs on every render
  const code = useMemo(() => searchParams.get('code'), [searchParams]);
  const state = useMemo(() => searchParams.get('state'), [searchParams]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      clearTimeout(navTimerRef.current);
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (code) {
      authenticateWithUAEPass(code, state, controller.signal);
    } else {
      setError('Authentication failed: No authorization code received');
      setLoading(false);
    }
    return () => { controller.abort(); };
  }, [code, state]);

  const authenticateWithUAEPass = async (code: string, state: string | null, signal: AbortSignal): Promise<void> => {
    try {
      if (!isMountedRef.current) return;
      setLoading(true);

      const response = await authFetch('/api/auth/uae-pass/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state }),
        signal,
      });

      if (signal.aborted || !isMountedRef.current) return;

      if (response.ok) {
        const data = await response.json();
        if (!data?.user) {
          if (isMountedRef.current) setError('Invalid response: missing user data');
          return;
        }
        if (!isMountedRef.current) return;
        setUserData(data.user);

        const destination = finalizeAuthenticatedSession({
          dispatch,
          user: {
            id: data.user.uaeId || data.user.id || data.user.email || '',
            email: data.user.email || '',
            name: data.user.name,
            phone: data.user.phone,
            role: data.user.role,
            status: data.user.status,
          },
          token: data?.token || data?.data?.token || null,
          provider: 'uae-pass',
        });

        // Wait a moment to show success message, then redirect
        navTimerRef.current = setTimeout(() => {
          navigateToPostLoginDestination(navigate, destination);
        }, 3000);
      } else {
        const errorData = await response.json().catch(e => {
          log.debug('Non-JSON error response:', e);
          return { message: 'Authentication failed' };
        });
        if (isMountedRef.current) setError(errorData.message || 'Authentication failed');
      }
    } catch (err: unknown) {
      log.error('Error authenticating with UAE Pass:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred during authentication');
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
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
                onClick={() => navigate('/dashboard')}
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
