import { useEffect, useCallback } from 'react';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  signOut as signOutFirebase,
  handleRedirectResult,
} from '../../config/firebase';
import { isFirebaseAuthConfigured } from '../../auth/firebaseInit';
import { syncFirebaseUser } from '../../services/authService';
import { MAX_SOCIAL_RETRY_ATTEMPTS } from './useSignIn.rules';
import { isSuperuserEmail } from './useSignIn.rules';
import { normalizeSocialAuthErrorMessage } from './useSignIn.rules';
import { isSupportedSocialProvider } from './useSignIn.rules';
import { shouldClearFirebaseSessionAfterSyncFailure } from './useSignIn.rules';
import { useSignInState } from './useSignIn.state';
import { useSignInSession } from './useSignIn.session';
export function useSignInSocial(
  state: ReturnType<typeof useSignInState>,
  session: ReturnType<typeof useSignInSession>
) {
  const {
    mode,
    setLoading,
    setError,
    email,
    socialSyncRecovery,
    setSocialSyncRecovery,
    socialRetryAttempts,
    setSocialRetryAttempts,
    googleAuthUnavailableMessage,
  } = state;
  const { handleSignInSuccess, handleSignUpSuccess } = session;
  useEffect(() => {
    const processRedirect = async () => {
      try {
        const result = await handleRedirectResult();
        if (result && result.user) {
          setLoading(true);
          const backendResponse = await syncFirebaseUser(result.user);
          if (!backendResponse?.data?.user) {
            throw new Error('Invalid backend response: missing user data');
          }
          const backendUser = backendResponse.data.user;
          setSocialSyncRecovery(null);
          setSocialRetryAttempts(0);
          setError('');

          handleSignInSuccess(
            isSuperuserEmail(backendUser.email)
              ? {
                  ...backendUser,
                  role: 'managing_director',
                  status: 'active',
                  photoUrl: backendUser.photoUrl || result.user.photoURL,
                  displayName: backendUser.name || result.user.displayName,
                }
              : {
                  ...backendUser,
                  photoUrl: backendUser.photoUrl || result.user.photoURL,
                  displayName: backendUser.name || result.user.displayName,
                }
          );
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Redirect auth failed';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    void processRedirect();
  }, [handleSignInSuccess]);
  const handleSocialAuth = useCallback(
    async (provider: string, options?: { isRetry?: boolean }): Promise<void> => {
      if (provider === 'google' && !isFirebaseAuthConfigured && !import.meta.env.DEV) {
        setError(googleAuthUnavailableMessage);
        return;
      }
      setLoading(true);
      setError('');
      try {
        if (!isSupportedSocialProvider(provider)) {
          throw new Error('Invalid provider');
        }

        let firebaseResult: {
          user?: {
            uid: string;
            email: string | null;
            displayName: string | null;
            photoURL: string | null;
            getIdToken?: (forceRefresh?: boolean) => Promise<string>;
          };
        } | null | void = null;

        switch (provider) {
          case 'google':
            firebaseResult = await signInWithGoogle();
            break;
          case 'facebook':
            firebaseResult = await signInWithFacebook();
            break;
          case 'apple':
            firebaseResult = await signInWithApple();
            break;
          default:
            throw new Error('Invalid provider');
        }

        const fbUser = firebaseResult?.user;
        if (!fbUser) {
          return;
        }

        try {
          const backendResponse = await syncFirebaseUser(fbUser as any);
          if (!backendResponse?.data?.user) {
            throw new Error('Invalid backend response: missing user data');
          }

          const backendUser = backendResponse.data.user;
          setSocialSyncRecovery(null);
          setSocialRetryAttempts(0);
          setError('');

          if (mode === 'signup') {
            if (isSuperuserEmail(backendUser.email)) {
              handleSignInSuccess({
                ...backendUser,
                role: 'managing_director',
                status: 'active',
                photoUrl: backendUser.photoUrl || fbUser.photoURL,
                displayName: backendUser.name || fbUser.displayName,
              });
            } else {
              handleSignUpSuccess(backendUser, { fromSocialProvider: provider });
            }
          } else {
            handleSignInSuccess(
              isSuperuserEmail(backendUser.email)
                ? {
                    ...backendUser,
                    role: 'managing_director',
                    status: 'active',
                    photoUrl: backendUser.photoUrl || fbUser.photoURL,
                    displayName: backendUser.name || fbUser.displayName,
                  }
                : {
                    ...backendUser,
                    photoUrl: backendUser.photoUrl || fbUser.photoURL,
                    displayName: backendUser.name || fbUser.displayName,
                  }
            );
          }
        } catch (syncError: unknown) {
          const syncMessage =
            syncError instanceof Error && syncError.message.trim()
              ? syncError.message.trim()
              : 'Backend unreachable';

          setSocialSyncRecovery({ provider: provider as any, reason: syncMessage });

          if (shouldClearFirebaseSessionAfterSyncFailure(syncMessage)) {
            await signOutFirebase().catch(() => {
              // noop
            });
          }

          setError(
            `Google authentication is active, but backend session setup failed: ${syncMessage}. Please retry or use email login temporarily.`
          );
        }
      } catch (err: unknown) {
        setError(normalizeSocialAuthErrorMessage(err, provider));
      } finally {
        setLoading(false);
      }
    },
    [googleAuthUnavailableMessage, handleSignInSuccess, handleSignUpSuccess, mode]
  );
  const retrySocialAuth = useCallback(async (): Promise<void> => {
    if (!socialSyncRecovery) {
      return;
    }

    if (socialRetryAttempts >= MAX_SOCIAL_RETRY_ATTEMPTS) {
      setError('Retry limit reached. Please switch to email login or try again later.');
      return;
    }

    setSocialRetryAttempts(prev => prev + 1);
    await handleSocialAuth(socialSyncRecovery.provider, { isRetry: true });
  }, [handleSocialAuth, socialSyncRecovery, socialRetryAttempts]);
  const clearSocialRecovery = useCallback((): void => {
    setSocialSyncRecovery(null);
    setSocialRetryAttempts(0);
    setError('');
  }, []);
  const remainingSocialRetries = Math.max(0, MAX_SOCIAL_RETRY_ATTEMPTS - socialRetryAttempts);
  return { handleSocialAuth, retrySocialAuth, clearSocialRecovery, remainingSocialRetries };
}
