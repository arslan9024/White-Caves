import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../../config/firebase';
import { loginSuccess, loginStart, loginFailure } from '../../../../store/authSlice';
import { createLogger } from '../../../../utils/logger';

const log = createLogger('EmailAuth');
import './EmailLogin.css';

interface EmailLoginFormProps {
  mode?: 'login' | 'signup';
  onSuccess?: (user: Record<string, unknown>) => void;
  onError?: (error: unknown) => void;
  onModeChange?: (mode: 'login' | 'signup') => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface FirebaseAuthError extends Error {
  code?: string;
}

const EmailLoginForm: React.FC<EmailLoginFormProps> = ({ mode = 'login', onSuccess, onError, onModeChange }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (mode === 'signup' && (!/[a-zA-Z]/.test(formData.password) || !/[0-9]/.test(formData.password))) {
      newErrors.password = 'Password must contain at least one letter and one number';
    }
    
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    dispatch(loginStart());
    
    try {
      if (!auth) throw new Error('Authentication not initialized');
      let result;
      
      if (mode === 'signup') {
        result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await sendEmailVerification(result.user);
      } else {
        result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
      
      const user = result.user;
      const userData = {
      id: user.uid,
        email: user.email || '',
        displayName: user.displayName || undefined,
        photoURL: user.photoURL || undefined,
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
      const authError = error as FirebaseAuthError;
      log.error('Email auth error:', authError);
      let errorMessage = 'Authentication failed';
      
      switch (authError.code) {
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
          errorMessage = authError.message || 'Authentication failed';
      }
      
      dispatch(loginFailure(errorMessage));
      onError?.(authError);
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
