import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../../config/firebase';
import { loginSuccess, loginStart, loginFailure } from '../../../../store/authSlice';
import './EmailLogin.css';

const EmailLoginForm = ({ mode = 'login', onSuccess, onError, onModeChange }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    dispatch(loginStart());
    
    try {
      let result;
      
      if (mode === 'signup') {
        result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await sendEmailVerification(result.user);
      } else {
        result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
      
      const user = result.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        provider: 'email',
      };
      
      const token = await user.getIdToken();
      dispatch(loginSuccess({
        user: userData,
        token,
        provider: 'email',
      }));
      
      onSuccess?.(userData);
    } catch (error) {
      console.error('Email auth error:', error);
      let errorMessage = 'Authentication failed';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'An account already exists with this email';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = error.message;
      }
      
      dispatch(loginFailure(errorMessage));
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="email-login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={loading}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          disabled={loading}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>
      
      {mode === 'signup' && (
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            autoComplete="new-password"
            disabled={loading}
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
      )}
      
      <button
        type="submit"
        className="email-submit-btn"
        disabled={loading}
      >
        {loading ? 'Please wait...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
      </button>
      
      <div className="auth-switch">
        {mode === 'login' ? (
          <p>
            Don't have an account?{' '}
            <button type="button" onClick={() => onModeChange?.('signup')}>
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button type="button" onClick={() => onModeChange?.('login')}>
              Sign in
            </button>
          </p>
        )}
      </div>
    </form>
  );
};

export default EmailLoginForm;
