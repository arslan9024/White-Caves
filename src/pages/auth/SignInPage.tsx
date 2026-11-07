/**
 * SignInPage.tsx
 * Modular authentication orchestrator for White Caves Real Estate
 * Composes 7 single-purpose sub-modules under ./components/
 */

import React from 'react';
import Spinner from '../../components/Spinner';
import { BiometricLoginButton } from '../../features/auth/components/BiometricLogin';
import { AuthHeader } from './components/AuthHeader';
import { AuthMethodTabs } from './components/AuthMethodTabs';
import { AuthModeSwitch } from './components/AuthModeSwitch';
import { CategorySelectionCard } from './components/CategorySelectionCard';
import { EmailAuthForm } from './components/EmailAuthForm';
import { GmailTroubleshootingPanel } from './components/GmailTroubleshootingPanel';
import { PhoneAuthForm } from './components/PhoneAuthForm';
import { SocialAuthButtons } from './components/SocialAuthButtons';
import { SocialRecoveryPanel } from './components/SocialRecoveryPanel';
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

  if (isSignup && signupStep === 2) {
    return (
      <CategorySelectionCard
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onContinue={handleCategoryContinue}
      />
    );
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <AuthHeader isSignup={isSignup} />

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

        <AuthMethodTabs
          activeTab={activeTab}
          onChange={handleTabChange}
          emailLabel="Email"
          phoneLabel="Phone"
        />

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
          />
        )}

        <BiometricLoginButton onSuccess={handleBiometricSuccess} onError={() => {}} />

        <AuthModeSwitch
          mode={mode}
          onSwitch={switchMode}
          signInPromptText="Already have an account? Sign In"
          signUpPromptText="Don't have an account? Sign Up"
        />
      </div>
    </div>
  );
};

export default SignInPage;
