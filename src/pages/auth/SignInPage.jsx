import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { 
  signInWithGoogle, 
  signInWithFacebook, 
  signInWithApple,
  signInWithEmail,
  signUpWithEmail,
  signInWithPhone,
  createRecaptchaVerifier
} from '../../config/firebase';
import './AuthPages.css';

const USER_CATEGORIES = [
  { 
    id: 'client', 
    label: 'Client', 
    icon: '🏠', 
    desc: 'Looking to buy, sell, or rent property',
    color: '#10b981'
  },
  { 
    id: 'staff', 
    label: 'Staff Member', 
    icon: '💼', 
    desc: 'White Caves employee or agent',
    color: '#3b82f6'
  }
];

const CLIENT_ROLES = [
  { id: 'buyer', label: 'Buyer', icon: '🔍', desc: 'Looking to purchase property' },
  { id: 'seller', label: 'Seller', icon: '💰', desc: 'Want to sell your property' },
  { id: 'landlord', label: 'Landlord', icon: '🏢', desc: 'Renting out your property' },
  { id: 'tenant', label: 'Tenant', icon: '🔑', desc: 'Looking to rent a property' }
];

const STAFF_ROLES = [
  { id: 'leasing-agent', label: 'Leasing Agent', icon: '📋', desc: 'Property rental specialist' },
  { id: 'secondary-sales-agent', label: 'Sales Agent', icon: '📊', desc: 'Property sales specialist' },
  { id: 'team-leader', label: 'Team Leader', icon: '👥', desc: 'Managing agent teams' }
];

export default function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mode, setMode] = useState('signin');
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const [pendingUser, setPendingUser] = useState(null);

  const saveUserData = (category, role, status = 'active') => {
    localStorage.setItem('userRole', JSON.stringify({ 
      category, 
      role, 
      status,
      locked: true 
    }));
  };

  const handleSignInSuccess = (user) => {
    dispatch(setUser({
      id: user.uid,
      email: user.email,
      name: user.displayName,
      photo: user.photoURL
    }));
    
    const existingData = localStorage.getItem('userRole');
    if (existingData) {
      const parsed = JSON.parse(existingData);
      if (parsed.status === 'pending') {
        setSuccess('Your staff account is pending approval.');
        setTimeout(() => navigate('/pending-approval'), 1000);
      } else {
        setSuccess('Sign in successful!');
        setTimeout(() => navigate(`/${parsed.role}/dashboard`), 1000);
      }
    } else {
      setSuccess('Sign in successful!');
      setTimeout(() => navigate('/select-role'), 1000);
    }
  };

  const handleSignUpSuccess = (user) => {
    setPendingUser({
      id: user.uid,
      email: user.email,
      name: user.displayName || fullName,
      photo: user.photoURL
    });
    setStep(2);
  };

  const proceedToRoleSelection = () => {
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }
    setError('');
    setStep(3);
  };

  const completeSignUp = () => {
    if (!selectedRole) {
      setError('Please select a role to continue');
      return;
    }
    
    const status = selectedCategory === 'staff' ? 'pending' : 'active';
    
    dispatch(setUser(pendingUser));
    saveUserData(selectedCategory, selectedRole, status);
    
    if (selectedCategory === 'staff') {
      setSuccess('Registration submitted! Your account is pending approval.');
      setTimeout(() => navigate('/pending-approval'), 1500);
    } else {
      setSuccess('Account created successfully!');
      setTimeout(() => navigate(`/${selectedRole}/dashboard`), 1000);
    }
  };

  const handleSocialAuth = async (provider) => {
    setLoading(true);
    setError('');
    try {
      let result;
      switch (provider) {
        case 'google':
          result = await signInWithGoogle();
          break;
        case 'facebook':
          result = await signInWithFacebook();
          break;
        case 'apple':
          result = await signInWithApple();
          break;
        default:
          throw new Error('Invalid provider');
      }
      
      if (mode === 'signup') {
        handleSignUpSuccess(result.user);
      } else {
        handleSignInSuccess(result.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      let result;
      if (mode === 'signup') {
        result = await signUpWithEmail(email, password);
        handleSignUpSuccess(result.user);
      } else {
        result = await signInWithEmail(email, password);
        handleSignInSuccess(result.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const recaptchaVerifier = createRecaptchaVerifier('recaptcha-container');
      const result = await signInWithPhone(phone, recaptchaVerifier);
      setConfirmationResult(result);
      setShowOtpInput(true);
      setSuccess('OTP sent to your phone');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await confirmationResult.confirm(otp);
      if (mode === 'signup') {
        handleSignUpSuccess(result.user);
      } else {
        handleSignInSuccess(result.user);
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setStep(1);
    setSelectedCategory('');
    setSelectedRole('');
    setError('');
    setSuccess('');
  };

  const getRolesForCategory = () => {
    return selectedCategory === 'staff' ? STAFF_ROLES : CLIENT_ROLES;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <img src="/company-logo.jpg" alt="White Caves" />
          <span>White Caves</span>
        </Link>

        <div className="auth-card">
          {step === 1 && (
            <>
              <h1>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h1>
              <p className="auth-subtitle">
                {mode === 'signup' 
                  ? 'Join White Caves to explore luxury properties in Dubai' 
                  : 'Sign in to access your personalized dashboard'}
              </p>

              {error && <div className="auth-error">{error}</div>}
              {success && <div className="auth-success">{success}</div>}

              <div className="auth-tabs">
                <button 
                  className={`auth-tab ${activeTab === 'phone' ? 'active' : ''}`}
                  onClick={() => setActiveTab('phone')}
                >
                  Phone
                </button>
                <button 
                  className={`auth-tab ${activeTab === 'email' ? 'active' : ''}`}
                  onClick={() => setActiveTab('email')}
                >
                  Email
                </button>
                <button 
                  className={`auth-tab ${activeTab === 'social' ? 'active' : ''}`}
                  onClick={() => setActiveTab('social')}
                >
                  Social
                </button>
              </div>

              <div className="auth-content">
                {activeTab === 'phone' && (
                  <div className="auth-form">
                    {!showOtpInput ? (
                      <form onSubmit={handlePhoneSubmit}>
                        {mode === 'signup' && (
                          <div className="form-group">
                            <label>Full Name</label>
                            <input 
                              type="text" 
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                        )}
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+971 50 123 4567"
                            required
                          />
                          <span className="input-hint">Include country code (e.g., +971)</span>
                        </div>
                        <div id="recaptcha-container"></div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                          {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleOtpVerify}>
                        <div className="form-group">
                          <label>Enter OTP</label>
                          <input 
                            type="text" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            required
                          />
                          <span className="input-hint">Enter the code sent to {phone}</span>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-link"
                          onClick={() => {
                            setShowOtpInput(false);
                            setOtp('');
                          }}
                        >
                          Change Phone Number
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {activeTab === 'email' && (
                  <form onSubmit={handleEmailSubmit} className="auth-form">
                    {mode === 'signup' && (
                      <div className="form-group">
                        <label>Full Name</label>
                        <input 
                          type="text" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    {mode === 'signup' && (
                      <div className="form-group">
                        <label>Confirm Password</label>
                        <input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    )}
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                      {loading ? 'Please wait...' : (mode === 'signup' ? 'Continue' : 'Sign In')}
                    </button>
                  </form>
                )}

                {activeTab === 'social' && (
                  <div className="social-buttons">
                    <button 
                      className="social-btn google"
                      onClick={() => handleSocialAuth('google')}
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>
                    <button 
                      className="social-btn facebook"
                      onClick={() => handleSocialAuth('facebook')}
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Continue with Facebook
                    </button>
                    <button 
                      className="social-btn apple"
                      onClick={() => handleSocialAuth('apple')}
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                      </svg>
                      Continue with Apple
                    </button>
                  </div>
                )}
              </div>

              <div className="auth-switch">
                <button className="btn btn-link" onClick={switchMode}>
                  {mode === 'signup' 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1>I am a...</h1>
              <p className="auth-subtitle">
                Select your account type
              </p>

              {error && <div className="auth-error">{error}</div>}

              <div className="category-selection">
                {USER_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{ '--accent-color': cat.color }}
                  >
                    <span className="category-icon">{cat.icon}</span>
                    <div className="category-info">
                      <span className="category-label">{cat.label}</span>
                      <span className="category-desc">{cat.desc}</span>
                    </div>
                    {selectedCategory === cat.id && (
                      <span className="category-check">✓</span>
                    )}
                  </button>
                ))}
              </div>

              {selectedCategory === 'staff' && (
                <div className="staff-notice">
                  <span className="notice-icon">ℹ️</span>
                  <p>Staff accounts require admin approval. You'll receive access once verified.</p>
                </div>
              )}

              <button 
                className="btn btn-primary btn-full" 
                onClick={proceedToRoleSelection}
                disabled={!selectedCategory}
              >
                Continue
              </button>

              <button 
                className="btn btn-link"
                onClick={() => {
                  setStep(1);
                  setSelectedCategory('');
                }}
              >
                Go Back
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <h1>Select Your Role</h1>
              <p className="auth-subtitle">
                {selectedCategory === 'staff' 
                  ? 'Choose your position at White Caves'
                  : 'How will you be using White Caves?'}
              </p>

              {error && <div className="auth-error">{error}</div>}
              {success && <div className="auth-success">{success}</div>}

              <div className="role-selection-grid">
                {getRolesForCategory().map(role => (
                  <button
                    key={role.id}
                    className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <span className="role-icon">{role.icon}</span>
                    <span className="role-label">{role.label}</span>
                    <span className="role-desc">{role.desc}</span>
                  </button>
                ))}
              </div>

              {selectedCategory === 'staff' && (
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Employee ID (Optional)</label>
                  <input 
                    type="text" 
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="Enter your employee ID"
                  />
                </div>
              )}

              <button 
                className="btn btn-primary btn-full" 
                onClick={completeSignUp}
                disabled={!selectedRole || loading}
              >
                {selectedCategory === 'staff' ? 'Submit for Approval' : 'Complete Registration'}
              </button>

              <button 
                className="btn btn-link"
                onClick={() => {
                  setStep(2);
                  setSelectedRole('');
                }}
              >
                Go Back
              </button>
            </>
          )}
        </div>

        <p className="auth-footer">
          By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
