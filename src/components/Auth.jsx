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

export default function Auth({ onLogin }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('phone'); // 'social', 'email', 'phone' - Default to phone
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [pendingToken, setPendingToken] = useState(null);
  const [otpCountdown, setOtpCountdown] = useState(0);

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

      const dbUser = await createUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoUrl: firebaseUser.photoURL
      });

      dispatch(setUser(dbUser));
      toast.success('Successfully signed in with Google!');
      onLogin(dbUser);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error('Failed to sign in with Google');
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

      const dbUser = await createUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoUrl: firebaseUser.photoURL
      });

      dispatch(setUser(dbUser));
      toast.success('Successfully signed in with Facebook!');
      onLogin(dbUser);
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      toast.error('Failed to sign in with Facebook');
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

      const dbUser = await createUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'Apple User',
        photoUrl: firebaseUser.photoURL
      });

      dispatch(setUser(dbUser));
      toast.success('Successfully signed in with Apple!');
      onLogin(dbUser);
    } catch (error) {
      console.error("Error signing in with Apple:", error);
      toast.error('Failed to sign in with Apple. Make sure Apple sign-in is enabled.');
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
        toast.success('Account created successfully!');
      } else {
        const userCredential = await signInWithEmail(values.email, values.password);
        firebaseUser = userCredential.user;
        toast.success('Successfully signed in!');
      }

      const dbUser = await createUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: values.name || firebaseUser.email.split('@')[0],
        photoUrl: firebaseUser.photoURL
      });

      dispatch(setUser(dbUser));
      onLogin(dbUser);
    } catch (error) {
      console.error("Email auth error:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Try signing in instead.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else {
        toast.error('Authentication failed. Please try again.');
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
      
      const idToken = await firebaseUser.getIdToken();
      
      const response = await fetch('/api/auth/verify-firebase-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify token');
      }
      
      if (data.isNewUser || !data.user.profileComplete) {
        setPendingUser(data.user);
        setPendingToken(data.token);
        setShowProfileCompletion(true);
      } else {
        setAuthToken(data.token);
        setStoredUser(data.user);
        setCurrentUser(data.user);
        dispatch(setUser(data.user));
        toast.success('Successfully signed in!');
        onLogin(data.user);
      }
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
    <div className="auth-container">
      <div className="auth-tabs">
        <button 
          className={`auth-tab ${authMode === 'social' ? 'active' : ''}`}
          onClick={() => setAuthMode('social')}
        >
          Social Login
        </button>
        <button 
          className={`auth-tab ${authMode === 'email' ? 'active' : ''}`}
          onClick={() => setAuthMode('email')}
        >
          Email
        </button>
        <button 
          className={`auth-tab ${authMode === 'phone' ? 'active' : ''}`}
          onClick={() => setAuthMode('phone')}
        >
          Mobile
        </button>
      </div>

      {authMode === 'social' && (
        <div className="auth-methods">
          <button className="auth-btn google" onClick={handleGoogleSignIn} disabled={loading}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
            Sign in with Google
          </button>
          <button className="auth-btn facebook" onClick={handleFacebookSignIn} disabled={loading}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
            Sign in with Facebook
          </button>
          <button className="auth-btn apple" onClick={handleAppleSignIn} disabled={loading}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
            Sign in with Apple
          </button>
        </div>
      )}

      {authMode === 'email' && (
        <form className="auth-form" onSubmit={handleEmailAuth}>
          {isSignUp && (
            <FormField
              label="Full Name"
              name="name"
              type="text"
              value={values.name}
              error={errors.name}
              touched={touched.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              required
            />
          )}
          
          <FormField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            error={errors.email}
            touched={touched.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={values.password}
            error={errors.password}
            touched={touched.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your password"
            required
          />

          {isSignUp && (
            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              required
            />
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
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
              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                value={values.phone}
                error={errors.phone}
                touched={touched.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="+971501234567"
                required
              />
              <p className="auth-hint">Enter phone number with country code</p>
              
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <FormField
                label="Enter OTP"
                name="otp"
                type="text"
                value={values.otp}
                error={errors.otp}
                touched={touched.otp}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
              <p className="auth-hint">OTP sent to {values.phone}</p>
              
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <button 
                type="button" 
                onClick={() => setConfirmationResult(null)} 
                className="auth-back-btn"
              >
                Change Phone Number
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}