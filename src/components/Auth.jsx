import React, { useState, useEffect } from 'react';
import './Auth.css';
import { 
  auth,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  signInWithEmail,
  signUpWithEmail,
  signInWithPhone,
  createRecaptchaVerifier,
  signOut as firebaseSignOut
} from '../config/firebase';
import Profile from './Profile';
import ProfileCompletion from './ProfileCompletion';
import { createUser } from '../utils/db';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { useToast } from './Toast';
import { useFormValidation } from '../hooks/useFormValidation';
import FormField from './FormField';

const AUTH_TOKEN_KEY = 'whitecaves_auth_token';
const AUTH_USER_KEY = 'whitecaves_user';

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const setAuthToken = (token) => localStorage.setItem(AUTH_TOKEN_KEY, token);
export const removeAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY));
  } catch {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem(AUTH_USER_KEY);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

export default function Auth({ onLogin }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('phone');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [pendingToken, setPendingToken] = useState(null);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getAuthToken();
    if (storedUser && storedToken) {
      setCurrentUser(storedUser);
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const { values, errors, touched, handleChange, handleBlur, validateForm, setFieldValue } = useFormValidation(
    {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      otp: ''
    },
    {
      email: { required: true, email: true },
      password: { required: true, minLength: 6 },
      confirmPassword: { 
        custom: (value, allValues) => {
          if (isSignUp && value !== allValues.password) {
            return 'Passwords do not match';
          }
          return null;
        }
      },
      name: { required: isSignUp },
      phone: { 
        required: authMode === 'phone',
        pattern: /^\+?[1-9]\d{1,14}$/,
        patternMessage: 'Please enter a valid phone number with country code (e.g., +971501234567)'
      },
      otp: { required: confirmationResult !== null, minLength: 6, maxLength: 6 }
    }
  );

  const handleGoogleSignIn = async () => {
    if (!auth) {
      toast.error("Firebase is not configured. Please add Firebase credentials.");
      return;
    }
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      const firebaseUser = result.user;
      
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        photoUrl: firebaseUser.photoURL,
        provider: 'google'
      };
      
      setAuthToken(await firebaseUser.getIdToken());
      setStoredUser(userData);
      setCurrentUser(userData);
      dispatch(setUser(userData));
      toast.success('Successfully signed in with Google!');
      onLogin(userData);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized. Please add it to Firebase Console.');
      } else {
        toast.error(error.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    if (!auth) {
      toast.error("Firebase is not configured. Please add Firebase credentials.");
      return;
    }
    try {
      setLoading(true);
      const result = await signInWithFacebook();
      const firebaseUser = result.user;
      
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'Facebook User',
        photoUrl: firebaseUser.photoURL,
        provider: 'facebook'
      };
      
      setAuthToken(await firebaseUser.getIdToken());
      setStoredUser(userData);
      setCurrentUser(userData);
      dispatch(setUser(userData));
      toast.success('Successfully signed in with Facebook!');
      onLogin(userData);
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error('An account already exists with this email using a different sign-in method.');
      } else {
        toast.error(error.message || 'Failed to sign in with Facebook');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (!auth) {
      toast.error("Firebase is not configured. Please add Firebase credentials.");
      return;
    }
    try {
      setLoading(true);
      const result = await signInWithApple();
      const firebaseUser = result.user;
      
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'Apple User',
        photoUrl: firebaseUser.photoURL,
        provider: 'apple'
      };
      
      setAuthToken(await firebaseUser.getIdToken());
      setStoredUser(userData);
      setCurrentUser(userData);
      dispatch(setUser(userData));
      toast.success('Successfully signed in with Apple!');
      onLogin(userData);
    } catch (error) {
      console.error("Error signing in with Apple:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else {
        toast.error(error.message || 'Failed to sign in with Apple');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    if (!auth) {
      toast.error("Firebase is not configured.");
      return;
    }
    try {
      setLoading(true);
      let firebaseUser;
      if (isSignUp) {
        const userCredential = await signUpWithEmail(values.email, values.password);
        firebaseUser = userCredential.user;
      } else {
        const userCredential = await signInWithEmail(values.email, values.password);
        firebaseUser = userCredential.user;
      }
      
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: values.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
        photoUrl: firebaseUser.photoURL,
        provider: 'email'
      };
      
      setAuthToken(await firebaseUser.getIdToken());
      setStoredUser(userData);
      setCurrentUser(userData);
      dispatch(setUser(userData));
      toast.success(isSignUp ? 'Account created successfully!' : 'Successfully signed in!');
      onLogin(userData);
    } catch (error) {
      console.error("Email auth error:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Switch to "Sign In" mode.');
        setIsSignUp(false);
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        if (isSignUp) {
          toast.error('Could not create account. Try signing in instead.');
          setIsSignUp(false);
        } else {
          toast.error('Incorrect email or password. Check your credentials or sign up for a new account.');
        }
      } else if (error.code === 'auth/user-not-found') {
        toast.error('No account found. Switch to "Sign Up" to create one.');
        setIsSignUp(true);
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password must be at least 6 characters');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Email sign-in is not enabled. Please enable it in Firebase Console.');
      } else {
        toast.error(error.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = createRecaptchaVerifier('recaptcha-container');
    }
  };

  const handlePhoneSendOTP = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (!auth) {
      toast.error("Firebase is not configured.");
      return;
    }
    try {
      setLoading(true);
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhone(values.phone, appVerifier);
      setConfirmationResult(result);
      setOtpCountdown(60);
      toast.success('OTP sent to your phone!');
    } catch (error) {
      console.error("Phone auth error:", error);
      if (error.code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please try again later.');
      } else if (error.code === 'auth/invalid-phone-number') {
        toast.error('Invalid phone number. Please include country code.');
      } else {
        toast.error('Failed to send OTP. Please check your phone number.');
      }
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerifyOTP = async (e) => {
    e.preventDefault();
    if (!values.otp || values.otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    if (!confirmationResult) {
      toast.error('Please send OTP first');
      return;
    }
    try {
      setLoading(true);
      const credential = await confirmationResult.confirm(values.otp);
      const firebaseUser = credential.user;
      
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        phone: firebaseUser.phoneNumber,
        name: firebaseUser.displayName || 'User',
        photoUrl: firebaseUser.photoURL,
        provider: 'phone'
      };
      
      setAuthToken(await firebaseUser.getIdToken());
      setStoredUser(userData);
      setCurrentUser(userData);
      dispatch(setUser(userData));
      toast.success('Successfully signed in!');
      onLogin(userData);
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error.code === 'auth/invalid-verification-code') {
        toast.error('Invalid OTP. Please check and try again.');
      } else {
        toast.error('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = (user, token) => {
    setAuthToken(token);
    setStoredUser(user);
    setCurrentUser(user);
    dispatch(setUser(user));
    setShowProfileCompletion(false);
    setPendingUser(null);
    setPendingToken(null);
    onLogin(user);
  };

  const handleProfileSkip = () => {
    if (pendingUser && pendingToken) {
      setAuthToken(pendingToken);
      setStoredUser(pendingUser);
      setCurrentUser(pendingUser);
      dispatch(setUser(pendingUser));
      onLogin(pendingUser);
    }
    setShowProfileCompletion(false);
    setPendingUser(null);
    setPendingToken(null);
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut();
      removeAuthToken();
      removeStoredUser();
      setCurrentUser(null);
      dispatch(setUser(null));
      setConfirmationResult(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error('Failed to log out');
    }
  };

  if (showProfileCompletion && pendingUser && pendingToken) {
    return (
      <ProfileCompletion 
        user={pendingUser} 
        token={pendingToken}
        onComplete={handleProfileComplete}
        onSkip={handleProfileSkip}
      />
    );
  }

  return currentUser ? (
    <Profile user={currentUser} onLogout={handleLogout} />
  ) : (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">WC</div>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to access your account</p>
        </div>

        <div className="auth-method-selector">
          <button 
            className={`method-btn ${authMode === 'phone' ? 'active' : ''}`}
            onClick={() => setAuthMode('phone')}
          >
            <PhoneIcon />
            <span>Phone</span>
          </button>
          <button 
            className={`method-btn ${authMode === 'email' ? 'active' : ''}`}
            onClick={() => setAuthMode('email')}
          >
            <EmailIcon />
            <span>Email</span>
          </button>
        </div>

        <div className="auth-content">
          {authMode === 'email' && (
            <form className="auth-form" onSubmit={handleEmailAuth}>
              {isSignUp && (
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><UserIcon /></span>
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your full name"
                      className={`auth-input ${errors.name && touched.name ? 'error' : ''}`}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <span className="input-error">{errors.name}</span>
                  )}
                </div>
              )}
              
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon"><EmailIcon /></span>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your email"
                    className={`auth-input ${errors.email && touched.email ? 'error' : ''}`}
                  />
                </div>
                {errors.email && touched.email && (
                  <span className="input-error">{errors.email}</span>
                )}
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><LockIcon /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    className={`auth-input ${errors.password && touched.password ? 'error' : ''}`}
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <span className="input-error">{errors.password}</span>
                )}
              </div>

              {isSignUp && (
                <div className="input-group">
                  <label className="input-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><LockIcon /></span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirm your password"
                      className={`auth-input ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <span className="input-error">{errors.confirmPassword}</span>
                  )}
                </div>
              )}

              {!isSignUp && (
                <div className="forgot-password">
                  <button type="button" className="forgot-btn">Forgot password?</button>
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    Please wait...
                  </span>
                ) : isSignUp ? 'Create Account' : 'Sign In'}
              </button>

              <p className="auth-toggle">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="auth-toggle-btn">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </form>
          )}

          {authMode === 'phone' && (
            <form className="auth-form" onSubmit={confirmationResult ? handlePhoneVerifyOTP : handlePhoneSendOTP}>
              <div id="recaptcha-container"></div>
              
              {!confirmationResult ? (
                <>
                  <div className="input-group">
                    <label className="input-label">Phone Number</label>
                    <div className="input-wrapper">
                      <span className="input-icon"><PhoneIcon /></span>
                      <input
                        type="tel"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="+971 50 123 4567"
                        className={`auth-input ${errors.phone && touched.phone ? 'error' : ''}`}
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <span className="input-error">{errors.phone}</span>
                    )}
                    <span className="input-hint">Include country code (e.g., +971 for UAE)</span>
                  </div>
                  
                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? (
                      <span className="btn-loading">
                        <span className="spinner"></span>
                        Sending...
                      </span>
                    ) : 'Send Verification Code'}
                  </button>
                </>
              ) : (
                <>
                  <div className="otp-header">
                    <button 
                      type="button" 
                      className="back-btn"
                      onClick={() => setConfirmationResult(null)}
                    >
                      <ArrowLeftIcon />
                    </button>
                    <div className="otp-info">
                      <h3>Verify Your Phone</h3>
                      <p>Enter the 6-digit code sent to <strong>{values.phone}</strong></p>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Verification Code</label>
                    <div className="otp-input-container">
                      <input
                        type="text"
                        name="otp"
                        value={values.otp}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          handleChange({ target: { name: 'otp', value: val } });
                        }}
                        onBlur={handleBlur}
                        placeholder="000000"
                        className={`otp-input ${errors.otp && touched.otp ? 'error' : ''}`}
                        maxLength={6}
                        autoComplete="one-time-code"
                      />
                    </div>
                    {errors.otp && touched.otp && (
                      <span className="input-error">{errors.otp}</span>
                    )}
                  </div>

                  {otpCountdown > 0 ? (
                    <p className="resend-timer">Resend code in {otpCountdown}s</p>
                  ) : (
                    <button 
                      type="button" 
                      className="resend-btn"
                      onClick={() => {
                        setConfirmationResult(null);
                        setFieldValue('otp', '');
                      }}
                    >
                      Didn't receive code? Send again
                    </button>
                  )}
                  
                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? (
                      <span className="btn-loading">
                        <span className="spinner"></span>
                        Verifying...
                      </span>
                    ) : 'Verify & Continue'}
                  </button>
                </>
              )}
            </form>
          )}

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <button className="social-btn google" onClick={handleGoogleSignIn} disabled={loading}>
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button className="social-btn apple" onClick={handleAppleSignIn} disabled={loading}>
              <AppleIcon />
              <span>Apple</span>
            </button>
            <button className="social-btn facebook" onClick={handleFacebookSignIn} disabled={loading}>
              <FacebookIcon />
              <span>Facebook</span>
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
        </div>
      </div>
    </div>
  );
}
