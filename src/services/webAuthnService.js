const isWebAuthnSupported = () => {
  return !!(
    window.PublicKeyCredential &&
    typeof window.PublicKeyCredential === 'function'
  );
};

const isPlatformAuthenticatorAvailable = async () => {
  if (!isWebAuthnSupported()) return false;
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
};

const bufferToBase64url = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const base64urlToBuffer = (base64url) => {
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

const getStoredCredentials = () => {
  try {
    const stored = localStorage.getItem(CREDENTIAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCredentialLocally = (credential, userId) => {
  const credentials = getStoredCredentials();
  credentials.push({
    id: credential.id,
    rawId: credential.rawId,
    userId,
    createdAt: new Date().toISOString(),
    lastUsed: null,
  });
  localStorage.setItem(CREDENTIAL_STORAGE_KEY, JSON.stringify(credentials));
};

const removeCredential = async (credentialId, userId) => {
  const credentials = getStoredCredentials().filter(c => c.id !== credentialId);
  localStorage.setItem(CREDENTIAL_STORAGE_KEY, JSON.stringify(credentials));
  
  try {
    await fetch(`/api/auth/webauthn/credentials/${encodeURIComponent(userId)}/${encodeURIComponent(credentialId)}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to remove credential from server:', error);
  }
};

const registerBiometric = async (userId, userName, displayName) => {
  if (!await isPlatformAuthenticatorAvailable()) {
    throw new Error('Biometric authentication is not available on this device');
  }

  const optionsResponse = await fetch('/api/auth/webauthn/register/options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, userName, displayName }),
  });

  const optionsData = await optionsResponse.json();
  
  if (!optionsData.success) {
    throw new Error(optionsData.message || 'Failed to get registration options');
  }

  const options = optionsData.options;
  
  const publicKeyCredentialCreationOptions = {
    ...options,
    challenge: base64urlToBuffer(options.challenge),
    user: {
      ...options.user,
      id: base64urlToBuffer(options.user.id),
    },
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    const credentialForServer = {
      id: credential.id,
      rawId: bufferToBase64url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: bufferToBase64url(credential.response.clientDataJSON),
        attestationObject: bufferToBase64url(credential.response.attestationObject),
      },
    };

    const verifyResponse = await fetch('/api/auth/webauthn/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, credential: credentialForServer }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      throw new Error(verifyData.message || 'Failed to verify registration');
    }

    saveCredentialLocally(credentialForServer, userId);

    return {
      success: true,
      credentialId: credential.id,
      message: 'Biometric authentication registered successfully',
    };
  } catch (error) {
    console.error('WebAuthn registration error:', error);
    if (error.name === 'NotAllowedError') {
      throw new Error('Biometric registration was cancelled');
    }
    throw new Error(error.message || 'Failed to register biometric authentication');
  }
};

const authenticateWithBiometric = async (userId = null) => {
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

  const optionsData = await optionsResponse.json();
  
  if (!optionsData.success) {
    throw new Error(optionsData.message || 'Failed to get authentication options');
  }

  const options = optionsData.options;

  const publicKeyCredentialRequestOptions = {
    ...options,
    challenge: base64urlToBuffer(options.challenge),
    allowCredentials: storedCredentials.map(cred => ({
      id: base64urlToBuffer(cred.rawId),
      type: 'public-key',
      transports: ['internal'],
    })),
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    const assertionForServer = {
      id: assertion.id,
      rawId: bufferToBase64url(assertion.rawId),
      type: assertion.type,
      response: {
        clientDataJSON: bufferToBase64url(assertion.response.clientDataJSON),
        authenticatorData: bufferToBase64url(assertion.response.authenticatorData),
        signature: bufferToBase64url(assertion.response.signature),
        userHandle: assertion.response.userHandle 
          ? bufferToBase64url(assertion.response.userHandle) 
          : null,
      },
    };

    const verifyResponse = await fetch('/api/auth/webauthn/authenticate/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: assertionForServer }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      throw new Error(verifyData.message || 'Biometric authentication failed');
    }

    const matchedCredential = storedCredentials.find(c => c.id === assertion.id);
    if (matchedCredential) {
      matchedCredential.lastUsed = new Date().toISOString();
      localStorage.setItem(CREDENTIAL_STORAGE_KEY, JSON.stringify(
        storedCredentials.map(c => c.id === matchedCredential.id ? matchedCredential : c)
      ));
    }

    return {
      success: true,
      userId: verifyData.userId,
      credentialId: assertion.id,
    };
  } catch (error) {
    console.error('WebAuthn authentication error:', error);
    if (error.name === 'NotAllowedError') {
      throw new Error('Authentication cancelled or not allowed');
    }
    throw new Error(error.message || 'Biometric authentication failed');
  }
};

const hasBiometricCredentials = () => {
  return getStoredCredentials().length > 0;
};

const getBiometricCredentials = () => {
  return getStoredCredentials();
};

const saveBiometricSession = (userData, token) => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
    user: userData,
    token,
    savedAt: new Date().toISOString(),
  }));
};

const getBiometricSession = () => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const clearBiometricSession = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
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
