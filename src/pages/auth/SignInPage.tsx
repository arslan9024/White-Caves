// @ts-ignore
/// <reference types="vite/client" />

import React from 'react';
import { useAuth } from './components/useAuth';
import AuthHeader from './components/AuthHeader';
import AuthMethodTabsWrapper from './components/AuthMethodTabsWrapper';
import EmailForm from './components/EmailForm';
import PhoneForm from './components/PhoneForm';
import CategorySelection from './components/CategorySelection';
import SocialAuthButtons from './components/SocialAuthButtons';
import Spinner from '../../components/Spinner';

const SignInPage: React.FC = () => {
  const {
    mode,
    setMode,
    activeTab,
    setActiveTab,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    phone,
    setPhone,
    loading,
    setLoading,
    error,
    setError,
    successMsg,
    setSuccessMsg,
    signupStep,
    setSignupStep,
    registeredUser,
    setRegisteredUser,
    selectedCategory,
    setSelectedCategory,
    rememberMe,
    setRememberMe,
    socialRecovery,
    setSocialRecovery,
    showGmailTroubleshooting,
    setShowGmailTroubleshooting,
    resetState,
    switchMode,
    handleEmailSubmit,
    handleFounderDevLogin,
    handleSocialAuth,
    handleSocialRetry,
    handleSocialRecoveryDismiss,
    handleBiometricSuccess,
    googleHelperText,
    isSignup,
    retriesLeft,
  } = useAuth();

  // Render steps
  if (isSignup && signupStep === 2) {
    return (
      <CategorySelection
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        onContinue={() => {
          if (selectedCategory) {
            // proceed to next step (role selection not implemented)
            // For now just reset to signin mode
            switchMode();
          }
        }}
        loading={loading}
      />
    );
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <AuthHeader isSignup={isSignup} />
        <AuthMethodTabsWrapper activeTab={activeTab} setActiveTab={setActiveTab} setError={setError} />
        {loading && <Spinner />}
        <SocialAuthButtons
          loading={loading}
          onSocialAuth={handleSocialAuth}
          label="Continue with"
          googleText="Google"
          facebookText="Facebook"
          appleText="Apple"
          googleDisabled={!isFirebaseAuthConfigured}
          helperText={googleHelperText}
        />
        {activeTab === 'email' && (
          <EmailForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isSignup={isSignup}
            loading={loading}
            error={error}
            successMsg={successMsg}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            handleSubmit={handleEmailSubmit}
          />
        )}
        {activeTab === 'phone' && (
          <PhoneForm phone={phone} setPhone={setPhone} loading={loading} handleSubmit={handleEmailSubmit} />
        )}
        {/* Social Recovery and other panels could be added here if needed */}
      </div>
    </div>
  );
};

export default SignInPage;
