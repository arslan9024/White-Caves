import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { authFetch } from '../utils/authFetch';
import { createLogger } from '../utils/logger';
import { safeStorage } from '../utils/safeStorage';

const log = createLogger('WebAuthn');
const CREDENTIAL_STORAGE_KEY = 'webauthn_credentials';
const SESSION_STORAGE_KEY = 'biometric_session';

export const isWebAuthnSupported = (): boolean =>
  typeof window !== 'undefined' &&
  Boolean(window.PublicKeyCredential && typeof window.PublicKeyCredential === 'function');

export const isPlatformAuthenticatorAvailable = async (): Promise<boolean> => {
  if (!isWebAuthnSupported()) return false;
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
};

/** Locally stored display metadata only; all credential decisions are server-side. */
export interface StoredCredential {
  id: string;
  rawId: string;
  userId: string;
  createdAt: string;
  lastUsed: string | null;
}

interface BiometricSession {
  user: { id: string; email?: string; name?: string; [key: string]: unknown };
  token: string;
  savedAt: string;
}

const getStoredCredentials = (): StoredCredential[] =>
  safeStorage.getJSON<StoredCredential[]>(CREDENTIAL_STORAGE_KEY, []) ?? [];

const saveCredentialLocally = (
  credential: Pick<RegistrationResponseJSON, 'id' | 'rawId'>,
  userId: string
): void => {
  const credentials = getStoredCredentials().filter(existing => existing.id !== credential.id);
  credentials.push({
    id: credential.id,
    rawId: credential.rawId,
    userId,
    createdAt: new Date().toISOString(),
    lastUsed: null,
  });
  safeStorage.setJSON(CREDENTIAL_STORAGE_KEY, credentials);
};

const parseOptionsResponse = async <TOptions>(
  response: Response,
  ceremony: 'registration' | 'authentication'
): Promise<{ options: TOptions; challengeId: string }> => {
  if (!response.ok) {
    throw new Error(`Passkey ${ceremony} could not start (HTTP ${response.status})`);
  }

  let data: { success?: boolean; message?: string; options?: TOptions; challengeId?: string };
  try {
    data = await response.json();
  } catch {
    throw new Error('The server returned an invalid passkey challenge. Please try again.');
  }

  if (!data.success || !data.options || !data.challengeId) {
    throw new Error(data.message || 'The server returned an incomplete passkey challenge.');
  }

  return { options: data.options, challengeId: data.challengeId };
};

const removeCredential = async (credentialId: string): Promise<void> => {
  const response = await authFetch(
    `/api/auth/webauthn/credentials/${encodeURIComponent(credentialId)}`,
    { method: 'DELETE' }
  );
  if (!response.ok) {
    throw new Error(`Passkey removal failed (HTTP ${response.status})`);
  }

  const credentials = getStoredCredentials().filter(credential => credential.id !== credentialId);
  safeStorage.setJSON(CREDENTIAL_STORAGE_KEY, credentials);
};

const registerBiometric = async (userId: string) => {
  if (!(await isPlatformAuthenticatorAvailable())) {
    throw new Error('Passkey authentication is not available on this device.');
  }

  const optionsResponse = await authFetch('/api/auth/webauthn/register/options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const { options, challengeId } =
    await parseOptionsResponse<PublicKeyCredentialCreationOptionsJSON>(
      optionsResponse,
      'registration'
    );

  try {
    const credential = await startRegistration({ optionsJSON: options });
    const verifyResponse = await authFetch('/api/auth/webauthn/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId, credential }),
    });

    if (!verifyResponse.ok) {
      throw new Error(`Passkey registration could not be verified (HTTP ${verifyResponse.status})`);
    }

    let verifyData: { success?: boolean; message?: string };
    try {
      verifyData = await verifyResponse.json();
    } catch {
      throw new Error('The server returned an invalid passkey registration response.');
    }
    if (!verifyData.success) {
      throw new Error(verifyData.message || 'Passkey registration could not be verified.');
    }

    saveCredentialLocally(credential, userId);
    return {
      success: true,
      credentialId: credential.id,
      message: 'Passkey registered successfully.',
    };
  } catch (error: unknown) {
    const authError = error instanceof Error ? error : new Error('Passkey registration failed.');
    log.warn('Passkey registration failed', { errorName: authError.name });
    if (authError.name === 'NotAllowedError') {
      throw new Error('Passkey registration was cancelled.');
    }
    throw authError;
  }
};

const authenticateWithBiometric = async () => {
  if (!(await isPlatformAuthenticatorAvailable())) {
    throw new Error('Passkey authentication is not available on this device.');
  }

  const optionsResponse = await authFetch('/api/auth/webauthn/authenticate/options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const { options, challengeId } =
    await parseOptionsResponse<PublicKeyCredentialRequestOptionsJSON>(
      optionsResponse,
      'authentication'
    );

  try {
    const credential: AuthenticationResponseJSON = await startAuthentication({
      optionsJSON: options,
    });
    const verifyResponse = await authFetch('/api/auth/webauthn/authenticate/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId, credential }),
    });
    if (!verifyResponse.ok) {
      throw new Error(`Passkey verification failed (HTTP ${verifyResponse.status})`);
    }

    let verifyData: {
      success?: boolean;
      message?: string;
      userId?: string;
      token?: string;
      user?: Record<string, unknown>;
    };
    try {
      verifyData = await verifyResponse.json();
    } catch {
      throw new Error('The server returned an invalid passkey verification response.');
    }
    if (!verifyData.success || !verifyData.user || !verifyData.token) {
      throw new Error(verifyData.message || 'Passkey sign-in could not be verified.');
    }

    const matchedCredential = getStoredCredentials().find(item => item.id === credential.id);
    if (matchedCredential) {
      matchedCredential.lastUsed = new Date().toISOString();
      safeStorage.setJSON(
        CREDENTIAL_STORAGE_KEY,
        getStoredCredentials().map(item => (item.id === credential.id ? matchedCredential : item))
      );
    }

    return {
      success: true,
      userId: verifyData.userId,
      credentialId: credential.id,
      token: verifyData.token,
      user: verifyData.user,
    };
  } catch (error: unknown) {
    const authError = error instanceof Error ? error : new Error('Passkey authentication failed.');
    log.warn('Passkey authentication failed', { errorName: authError.name });
    if (authError.name === 'NotAllowedError') {
      throw new Error('Passkey authentication was cancelled.');
    }
    throw authError;
  }
};

const hasBiometricCredentials = (): boolean => getStoredCredentials().length > 0;
const getBiometricCredentials = (): StoredCredential[] => getStoredCredentials();

const saveBiometricSession = (userData: BiometricSession['user'], token: string): void => {
  safeStorage.setJSON(SESSION_STORAGE_KEY, {
    user: userData,
    token,
    savedAt: new Date().toISOString(),
  });
};

const getBiometricSession = (): BiometricSession | null =>
  safeStorage.getJSON<BiometricSession>(SESSION_STORAGE_KEY) ?? null;

const clearBiometricSession = (): void => {
  safeStorage.remove(SESSION_STORAGE_KEY);
};

export {
  registerBiometric,
  authenticateWithBiometric,
  hasBiometricCredentials,
  getBiometricCredentials,
  removeCredential,
  saveBiometricSession,
  getBiometricSession,
  clearBiometricSession,
};
