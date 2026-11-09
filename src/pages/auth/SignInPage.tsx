/**
 * SignInPage.tsx
 * Modular authentication orchestrator for White Caves Real Estate
 * Composes single-purpose sub-modules under ./components/
 */

import React, { useState } from 'react';
import Spinner from '../../components/Spinner';
import { BiometricLoginButton } from '../../features/auth/components/BiometricLogin';
import { AuthHeader } from './components/AuthHeader';
import { AuthNavTabs } from './components/AuthNavTabs';
import { AuthMethodTabs } from './components/AuthMethodTabs';
import { AuthModeSwitch } from './components/AuthModeSwitch';
import { CategorySelectionCard } from './components/CategorySelectionCard';
import { EmailAuthForm } from './components/EmailAuthForm';
import { GmailTroubleshootingPanel } from './components/GmailTroubleshootingPanel';
import { PhoneAuthForm } from './components/PhoneAuthForm';
import { SocialAuthButtons } from './components/SocialAuthButtons';
import { SocialRecoveryPanel } from './components/SocialRecoveryPanel';
import { VerificationModalCard } from './components/VerificationModalCard';
import { useSignInController } from './components/useSignInController';
import './AuthPages.css';

const SignInPage: React.FC = () => {
  const {
    mode,
    activeTab,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    phone,
    setPhone,
    loading,
    error,
    successMsg,
    signupStep,
    selectedCategory,
    setSelectedCategory,
    rememberMe,
    setRememberMe,
    socialRecovery,
    showGmailTroubleshooting,
    setShowGmailTroubleshooting,
    isSignup,
    isFirebaseAuthConfigured,
    googleHelperText,
    switchMode,
    handleTabChange,
    handleEmailSubmit,
    handleCategoryContinue,
    handleFounderDevLogin,
    handleSocialAuth,
    handleSocialRetry,
    handleSocialRecoveryDismiss,
    handleBiometricSuccess,
  } = useSignInController();

  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  if (isSignup && signupStep === 2) {
    return (
      <CategorySelectionCard
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onContinue={handleCategoryContinue}
      />
    );
  }

  const handleSelectMode = (newMode: 'signin' | 'signup') => {
    if ((newMode === 'signup' && !isSignup) || (newMode === 'signin' && isSignup)) {
      switchMode();
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <AuthHeader isSignup={isSignup} />

        {/* Multi-layered flow toggle: Sign In vs Register */}
        <AuthNavTabs mode={mode} onSelectMode={handleSelectMode} disabled={loading} />

        {loading && <Spinner />}

        {/* Social Authentication Providers */}
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

        <GmailTroubleshootingPanel
          visible={showGmailTroubleshooting}
          isDev={Boolean(import.meta.env?.DEV)}
          loading={loading}
          onContinueWithEmail={() => {
            setShowGmailTroubleshooting(false);
            handleTabChange('email');
          }}
          onFounderDevLogin={handleFounderDevLogin}
        />

        <SocialRecoveryPanel
          socialRecovery={socialRecovery}
          onRetry={handleSocialRetry}
          onDismiss={handleSocialRecoveryDismiss}
        />

        {/* Credentials Channel Switcher (Email / Phone) */}
        <AuthMethodTabs
          activeTab={activeTab}
          onChange={handleTabChange}
          emailLabel="Email"
          phoneLabel="Phone"
        />

        {/* Clean, uncrowded input sections */}
        <div className="auth-form-wrapper">
          {activeTab === 'email' && (
            <EmailAuthForm
              email={email}
              onEmailChange={setEmail}
              password={password}
              onPasswordChange={setPassword}
              confirmPassword={confirmPassword}
              onConfirmPasswordChange={setConfirmPassword}
              rememberMe={rememberMe}
              onRememberMeChange={setRememberMe}
              isSignup={isSignup}
              loading={loading}
              error={error}
              successMsg={successMsg}
              onSubmit={handleEmailSubmit}
            />
          )}

          {activeTab === 'phone' && (
            <PhoneAuthForm
              phone={phone}
              onPhoneChange={setPhone}
              loading={loading}
              error={error}
              onRequestOtp={() => setIsVerificationOpen(true)}
            />
          )}
        </div>

        {/* Biometric Instant Login */}
        <BiometricLoginButton onSuccess={handleBiometricSuccess} onError={() => {}} />

        {/* Mode Switch Footnote */}
        <AuthModeSwitch
          mode={mode}
          onSwitch={switchMode}
          signInPromptText="Already have an account? Sign In"
          signUpPromptText="Don't have an account? Sign Up"
        />

        {/* Dedicated Non-crowded Security Verification Layer */}
        <VerificationModalCard
          isOpen={isVerificationOpen}
          onClose={() => setIsVerificationOpen(false)}
          targetIdentity={activeTab === 'phone' ? phone : email}
          targetType={activeTab}
        />
      </div>
    </div>
  );
};

export default SignInPage;
