import { createLogger } from '../utils/logger';

const log = createLogger('WebAuthn');

const isWebAuthnSupported = (): boolean => {
  return !!(
    window.PublicKeyCredential &&
    typeof window.PublicKeyCredential === 'function'
  );
};

const isPlatformAuthenticatorAvailable = async (): Promise<boolean> => {
  if (!isWebAuthnSupported()) return false;
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
};

const bufferToBase64url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const base64urlToBuffer = (base64url: string): ArrayBuffer => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const paddedBase64 = base64 + '=='.slice(0, (4 - base64.length % 4) % 4);
  const binary = atob(paddedBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const CREDENTIAL_STORAGE_KEY = 'webauthn_credentials';
const SESSION_STORAGE_KEY = 'biometric_session';

import { safeStorage } from '../utils/safeStorage';

/** Locally-stored WebAuthn credential metadata */
interface StoredCredential {
  id: string;
  rawId: string;
  userId: string;
  createdAt: string;
  lastUsed: string | null;
}

/** Biometric session persisted to storage */
interface BiometricSession {
  user: { id: string; email?: string; name?: string; [key: string]: unknown };
  token: string;
  savedAt: string;
}

/** Shape of a credential sent to the server after registration */
interface CredentialForServer {
  id: string;
  rawId: string;
  type: string;
  response: {
    clientDataJSON: string;
    attestationObject?: string;
    authenticatorData?: string;
    signature?: string;
    userHandle?: string | null;
  };
}

const getStoredCredentials = (): StoredCredential[] => {
  return safeStorage.getJSON<StoredCredential[]>(CREDENTIAL_STORAGE_KEY, []) ?? [];
};

const saveCredentialLocally = (credential: CredentialForServer, userId: string): void => {
  const credentials = getStoredCredentials();
  credentials.push({
    id: credential.id,
    rawId: credential.rawId,
    userId,
    createdAt: new Date().toISOString(),
    lastUsed: null,
  });
  safeStorage.setJSON(CREDENTIAL_STORAGE_KEY, credentials);
};

const removeCredential = async (credentialId: string, userId: string): Promise<void> => {
  const credentials = getStoredCredentials().filter(c => c.id !== credentialId);
  safeStorage.setJSON(CREDENTIAL_STORAGE_KEY, credentials);
  
  try {
    await fetch(`/api/auth/webauthn/credentials/${encodeURIComponent(userId)}/${encodeURIComponent(credentialId)}`, {
      method: 'DELETE',
    });
  } catch (error) {
    log.error('Failed to remove credential from server:', error);
  }
};

const registerBiometric = async (userId: string, userName: string, displayName: string) => {
  if (!await isPlatformAuthenticatorAvailable()) {
    throw new Error('Biometric authentication is not available on this device');
  }

  const optionsResponse = await fetch('/api/auth/webauthn/register/options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, userName, displayName }),
  });

  if (!optionsResponse.ok) {
    throw new Error(`Registration options request failed (HTTP ${optionsResponse.status})`);
  }

  let optionsData: { success: boolean; message?: string; options?: Record<string, unknown> };
  try {
    optionsData = await optionsResponse.json();
  } catch {
    throw new Error('Server returned invalid JSON for registration options');
  }
  
  if (!optionsData.success) {
    throw new Error(optionsData.message || 'Failed to get registration options');
  }

  const options = optionsData.options;
  if (!options) {
    throw new Error('Server returned no registration options');
  }
  
  const userObj = options.user as Record<string, unknown> | undefined;
  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    ...(options as unknown as PublicKeyCredentialCreationOptions),
    challenge: base64urlToBuffer(options.challenge as string),
    user: {
      ...(userObj as unknown as PublicKeyCredentialUserEntity),
      id: base64urlToBuffer((userObj?.id ?? '') as string),
    },
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    if (!credential) {
      throw new Error('No credential returned from navigator.credentials.create');
    }

    const pubKeyCred = credential as PublicKeyCredential;
    const attestationResponse = pubKeyCred.response as AuthenticatorAttestationResponse;

    const credentialForServer: CredentialForServer = {
      id: pubKeyCred.id,
      rawId: bufferToBase64url(pubKeyCred.rawId),
      type: pubKeyCred.type,
      response: {
        clientDataJSON: bufferToBase64url(attestationResponse.clientDataJSON),
        attestationObject: bufferToBase64url(attestationResponse.attestationObject),
      },
    };

    const verifyResponse = await fetch('/api/auth/webauthn/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, credential: credentialForServer }),
    });

    if (!verifyResponse.ok) {
      throw new Error(`Registration verification failed (HTTP ${verifyResponse.status})`);
    }

    let verifyData: { success: boolean; message?: string };
    try {
      verifyData = await verifyResponse.json();
    } catch {
      throw new Error('Server returned invalid JSON for registration verification');
    }

    if (!verifyData.success) {
      throw new Error(verifyData.message || 'Failed to verify registration');
    }

    saveCredentialLocally(credentialForServer, userId);

    return {
      success: true,
      credentialId: credential.id,
      message: 'Biometric authentication registered successfully',
    };
  } catch (error: unknown) {
    log.error('WebAuthn registration error:', error);
    const err = error instanceof Error ? error : new Error('Failed to register biometric authentication');
    if (err.name === 'NotAllowedError') {
      throw new Error('Biometric registration was cancelled');
    }
    throw new Error(err.message || 'Failed to register biometric authentication');
  }
};

const authenticateWithBiometric = async (userId: string | null = null) => {
  if (!await isPlatformAuthenticatorAvailable()) {
    throw new Error('Biometric authentication is not available on this device');
  }

  const storedCredentials = getStoredCredentials();
  
  if (storedCredentials.length === 0) {
    throw new Error('No biometric credentials registered. Please set up biometric login first.');
  }

  const optionsResponse = await fetch('/api/auth/webauthn/authenticate/options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!optionsResponse.ok) {
    throw new Error(`Authentication options request failed (HTTP ${optionsResponse.status})`);
  }

  let optionsData: { success: boolean; message?: string; options?: Record<string, unknown> };
  try {
    optionsData = await optionsResponse.json();
  } catch {
    throw new Error('Server returned invalid JSON for authentication options');
  }
  
  if (!optionsData.success) {
    throw new Error(optionsData.message || 'Failed to get authentication options');
  }

  const options = optionsData.options;
  if (!options) {
    throw new Error('Server returned no authentication options');
  }

  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    ...(options as unknown as PublicKeyCredentialRequestOptions),
    challenge: base64urlToBuffer(options.challenge as string),
    allowCredentials: storedCredentials.map(cred => ({
      id: base64urlToBuffer(cred.rawId),
      type: 'public-key' as const,
      transports: ['internal' as AuthenticatorTransport],
    })),
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    if (!assertion) {
      throw new Error('No assertion returned from navigator.credentials.get');
    }

    const pubKeyAssertion = assertion as PublicKeyCredential;
    const assertionResponse = pubKeyAssertion.response as AuthenticatorAssertionResponse;

    const assertionForServer = {
      id: pubKeyAssertion.id,
      rawId: bufferToBase64url(pubKeyAssertion.rawId),
      type: pubKeyAssertion.type,
      response: {
        clientDataJSON: bufferToBase64url(assertionResponse.clientDataJSON),
        authenticatorData: bufferToBase64url(assertionResponse.authenticatorData),
        signature: bufferToBase64url(assertionResponse.signature),
        userHandle: assertionResponse.userHandle 
          ? bufferToBase64url(assertionResponse.userHandle) 
          : null,
      },
    };

    const verifyResponse = await fetch('/api/auth/webauthn/authenticate/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: assertionForServer }),
    });

    if (!verifyResponse.ok) {
      throw new Error(`Authentication verification failed (HTTP ${verifyResponse.status})`);
    }

    let verifyData: { success: boolean; message?: string; userId?: string };
    try {
      verifyData = await verifyResponse.json();
    } catch {
      throw new Error('Server returned invalid JSON for authentication verification');
    }

    if (!verifyData.success) {
      throw new Error(verifyData.message || 'Biometric authentication failed');
    }

    const matchedCredential = storedCredentials.find(c => c.id === pubKeyAssertion.id);
    if (matchedCredential) {
      matchedCredential.lastUsed = new Date().toISOString();
      safeStorage.setJSON(CREDENTIAL_STORAGE_KEY,
        storedCredentials.map(c => c.id === matchedCredential.id ? matchedCredential : c)
      );
    }

    return {
      success: true,
      userId: verifyData.userId,
      credentialId: pubKeyAssertion.id,
    };
  } catch (error: unknown) {
    log.error('WebAuthn authentication error:', error);
    const err = error instanceof Error ? error : new Error('Biometric authentication failed');
    if (err.name === 'NotAllowedError') {
      throw new Error('Authentication cancelled or not allowed');
    }
    throw new Error(err.message || 'Biometric authentication failed');
  }
};

const hasBiometricCredentials = (): boolean => {
  return getStoredCredentials().length > 0;
};

const getBiometricCredentials = (): StoredCredential[] => {
  return getStoredCredentials();
};

const saveBiometricSession = (userData: BiometricSession['user'], token: string): void => {
  safeStorage.setJSON(SESSION_STORAGE_KEY, {
    user: userData,
    token,
    savedAt: new Date().toISOString(),
  });
};

const getBiometricSession = (): BiometricSession | null => {
  return safeStorage.getJSON<BiometricSession>(SESSION_STORAGE_KEY) ?? null;
};

const clearBiometricSession = (): void => {
  safeStorage.remove(SESSION_STORAGE_KEY);
};

export {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  registerBiometric,
  authenticateWithBiometric,
  hasBiometricCredentials,
  getBiometricCredentials,
  removeCredential,
  saveBiometricSession,
  getBiometricSession,
  clearBiometricSession,
};
