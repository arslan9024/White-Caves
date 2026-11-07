/**
 * useSignInSocial.ts
 * Extracted social authentication, redirect handling, and MD Founder dev login logic (< 350 lines).
 */

import { useCallback, useEffect } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import type { AppDispatch } from '../../../store/store';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  signOut,
  handleRedirectResult,
} from '../../../auth/firebaseInit';
import { syncFirebaseUser } from '../../../services/authService';
import {
  finalizeAuthenticatedSession,
  navigateToPostLoginDestination,
} from '../../../utils/authSession';
import {
  MAX_SOCIAL_RETRIES,
  type SocialProvider,
  type FirebaseUserPayload,
  type SocialRecoveryState,
} from './authTypes';

export interface UseSignInSocialParams {
  dispatch: AppDispatch;
  navigate: NavigateFunction;
  rememberMe: boolean;
  returnTo: string | null;
  socialRecovery: SocialRecoveryState;
  setSocialRecovery: React.Dispatch<React.SetStateAction<SocialRecoveryState>>;
  setLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
  setSuccessMsg: (msg: string | null) => void;
  setShowGmailTroubleshooting: (show: boolean) => void;
}

export async function invokeProviderSignIn(
  provider: SocialProvider
): Promise<{ user: FirebaseUserPayload } | null> {
  if (provider === 'google') return (await signInWithGoogle()) as { user: FirebaseUserPayload } | null;
  if (provider === 'facebook') return (await signInWithFacebook()) as { user: FirebaseUserPayload } | null;
  return (await signInWithApple()) as { user: FirebaseUserPayload } | null;
}

export function useSignInSocial({
  dispatch,
  navigate,
  rememberMe,
  returnTo,
  socialRecovery,
  setSocialRecovery,
  setLoading,
  setError,
  setSuccessMsg,
  setShowGmailTroubleshooting,
}: UseSignInSocialParams) {
  useEffect(() => {
    const processRedirect = async () => {
      try {
        const result = await handleRedirectResult();
        if (result?.user) {
          const backendResponse = await syncFirebaseUser({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            getIdToken: (forceRefresh?: boolean) => result.user.getIdToken(forceRefresh),
          });
          const user = backendResponse?.data?.user ?? null;
          if (user) {
            const destination = finalizeAuthenticatedSession({
              dispatch,
              user: user as never,
              token: backendResponse.data?.token || 'session-token',
              provider: 'google' as never,
              rememberMe,
              returnTo,
            });
            setSuccessMsg('Sign in successful!');
            setTimeout(() => {
              navigateToPostLoginDestination(navigate, destination);
            }, 1500);
          }
        }
      } catch {
        setError('Error processing sign-in redirect. Please try again.');
      }
    };
    processRedirect();
  }, [dispatch, navigate, rememberMe, returnTo, setError, setSuccessMsg]);

  const handleFounderDevLogin = useCallback(async () => {
    setError(null);
    setLoading(true);
    setShowGmailTroubleshooting(false);
    try {
      const founderEmail = 'arslanmalikgoraha@gmail.com';
      const backendResponse = await syncFirebaseUser({
        uid: `dev-google-${btoa(founderEmail).replace(/=/g, '')}`,
        email: founderEmail,
        displayName: 'Arslan Malik Bashir Ahmad',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        getIdToken: async () => `dev-google-token-${Date.now()}`,
      });
      const user = backendResponse?.data?.user ?? null;
      if (user && backendResponse.data?.token) {
        const destination = finalizeAuthenticatedSession({
          dispatch,
          user: user as never,
          token: backendResponse.data.token,
          provider: 'google' as never,
          rememberMe,
          returnTo,
        });
        setSuccessMsg('Signed in as Managing Director!');
        setTimeout(() => navigateToPostLoginDestination(navigate, destination), 1000);
      } else {
        throw new Error('Backend authentication sync returned no user');
      }
    } catch {
      const localFounderUser = {
        id: 'dev-founder-arslan',
        email: 'arslanmalikgoraha@gmail.com',
        name: 'Arslan Malik Bashir Ahmad',
        role: 'lion',
        status: 'active',
        department: 'executive',
        profileCompleted: true,
      };
      const destination = finalizeAuthenticatedSession({
        dispatch,
        user: localFounderUser as never,
        token: `dev-founder-local-token-${Date.now()}`,
        provider: 'google' as never,
        rememberMe: true,
        returnTo,
      });
      setSuccessMsg('Signed in as Managing Director (Local Sovereign Mode)!');
      setTimeout(() => navigateToPostLoginDestination(navigate, destination), 500);
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate, rememberMe, returnTo, setError, setLoading, setShowGmailTroubleshooting, setSuccessMsg]);

  const handleSocialAuth = useCallback(
    async (provider: SocialProvider) => {
      setError(null);
      setShowGmailTroubleshooting(false);
      setLoading(true);
      try {
        const firebaseResult = await invokeProviderSignIn(provider);
        if (!firebaseResult?.user) {
          setLoading(false);
          return;
        }
        const fbUser = firebaseResult.user;
        try {
          const backendResponse = await syncFirebaseUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            getIdToken: ((forceRefresh?: boolean) => fbUser.getIdToken?.(forceRefresh)) as never,
          });
          const user = backendResponse?.data?.user ?? null;
          if (user) {
            const destination = finalizeAuthenticatedSession({
              dispatch,
              user: user as never,
              token: backendResponse.data?.token || 'session-token',
              provider,
              rememberMe,
              returnTo,
            });
            setSuccessMsg('Sign in successful!');
            setTimeout(() => navigateToPostLoginDestination(navigate, destination), 1500);
          } else {
            throw new Error('Invalid response from backend');
          }
        } catch (syncErr: unknown) {
          await signOut().catch(() => {});
          setSocialRecovery({
            visible: true,
            provider,
            firebaseUser: fbUser,
            reason: syncErr instanceof Error ? syncErr.message : 'Backend session setup failed',
            retryCount: MAX_SOCIAL_RETRIES,
            isRetrying: false,
            maxRetries: MAX_SOCIAL_RETRIES,
          });
        }
      } catch (authErr: unknown) {
        const errMsg = authErr instanceof Error ? authErr.message : 'Authentication error';
        const errCode = (authErr as { code?: string })?.code || '';
        if (
          provider === 'google' &&
          (errMsg.includes('popup') ||
            errCode.includes('popup') ||
            errCode === 'auth/unauthorized-domain' ||
            errMsg.includes('blocked') ||
            errMsg.includes('closed'))
        ) {
          setShowGmailTroubleshooting(true);
        } else {
          setError(errMsg);
        }
      } finally {
        setLoading(false);
      }
    },
    [dispatch, navigate, rememberMe, returnTo, setError, setLoading, setShowGmailTroubleshooting, setSocialRecovery, setSuccessMsg]
  );

  const handleSocialRetry = useCallback(async () => {
    if (!socialRecovery.firebaseUser || socialRecovery.retryCount <= 0 || !socialRecovery.provider) {
      return;
    }
    setSocialRecovery(prev => ({ ...prev, isRetrying: true }));
    try {
      const firebaseResult = await invokeProviderSignIn(socialRecovery.provider);
      const fbUser = firebaseResult?.user ?? socialRecovery.firebaseUser;
      const backendResponse = await syncFirebaseUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        getIdToken: ((forceRefresh?: boolean) => fbUser.getIdToken?.(forceRefresh)) as never,
      });
      const user = backendResponse?.data?.user ?? null;
      if (user) {
        const destination = finalizeAuthenticatedSession({
          dispatch,
          user: user as never,
          token: backendResponse.data?.token || 'session-token',
          provider: socialRecovery.provider as never,
          rememberMe,
          returnTo,
        });
        setSocialRecovery(prev => ({ ...prev, visible: false, isRetrying: false }));
        setSuccessMsg('Sign in successful!');
        setTimeout(() => navigateToPostLoginDestination(navigate, destination), 1500);
      } else {
        throw new Error('Invalid response from backend');
      }
    } catch (retryErr: unknown) {
      setSocialRecovery(prev => ({
        ...prev,
        isRetrying: false,
        reason: retryErr instanceof Error ? retryErr.message : 'Retry failed',
        retryCount: prev.retryCount - 1,
      }));
    }
  }, [dispatch, navigate, rememberMe, returnTo, setSocialRecovery, setSuccessMsg, socialRecovery]);

  return {
    handleFounderDevLogin,
    handleSocialAuth,
    handleSocialRetry,
  };
}
