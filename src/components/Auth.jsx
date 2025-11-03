import React, { useState, useEffect } from 'react';
import './Auth.css';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import Profile from './Profile';
import { createUser } from '../utils/db';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { useToast } from './Toast';
import { useFormValidation } from '../hooks/useFormValidation';
import FormField from './FormField';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let firebaseApp = null;
if (firebaseConfig.apiKey) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
  }
}

export default function Auth({ onLogin }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('social'); // 'social', 'email', 'phone'
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

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
      otp: { required: verificationId !== null, minLength: 6, maxLength: 6 }
    }
  );

  const handleGoogleSignIn = async () => {
    if (!firebaseApp) {
      toast.error("Firebase is not configured. Please add Firebase credentials.");
      return;
    }
    try {
      setLoading(true);
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
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
    if (!firebaseApp) {
      toast.error("Firebase is not configured. Please add Firebase credentials.");
      return;
    }
    try {
      setLoading(true);
      const auth = getAuth();
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
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

  const handleAppleSignIn = () => {
    toast.info('Apple sign-in will be available soon!');
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    if (!firebaseApp) {
      toast.error("Firebase is not configured.");
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      let firebaseUser;

      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        firebaseUser = userCredential.user;
        toast.success('Account created successfully!');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
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
      window.recaptchaVerifier = new RecaptchaVerifier(getAuth(), 'recaptcha-container', {
        size: 'invisible',
        callback: () => {}
      });
    }
  };

  const handlePhoneSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!firebaseApp) {
      toast.error("Firebase is not configured.");
      return;
    }

    try {
      setLoading(true);
      setupRecaptcha();
      const auth = getAuth();
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, values.phone, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      toast.success('OTP sent to your phone!');
    } catch (error) {
      console.error("Phone auth error:", error);
      toast.error('Failed to send OTP. Please check your phone number.');
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

    try {
      setLoading(true);
      const auth = getAuth();
      const credential = window.recaptchaVerifier.confirm(values.otp);
      const firebaseUser = credential.user;

      const dbUser = await createUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.phoneNumber,
        photoUrl: firebaseUser.photoURL
      });

      dispatch(setUser(dbUser));
      toast.success('Successfully signed in!');
      onLogin(dbUser);
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setCurrentUser(null);
      dispatch(setUser(null));
      toast.success('Logged out successfully');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error('Failed to log out');
    }
  };

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
        <form className="auth-form" onSubmit={verificationId ? handlePhoneVerifyOTP : handlePhoneSendOTP}>
          <div id="recaptcha-container"></div>
          
          {!verificationId ? (
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
                onClick={() => setVerificationId(null)} 
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