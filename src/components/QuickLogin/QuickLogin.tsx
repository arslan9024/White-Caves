// QuickLogin component – uses WebAuthn (Face ID / Touch ID) for password‑less sign‑in
// This component is deliberately lightweight: it does not import heavy UI libs –
// just basic React + fetch. The UI can be styled later.
import React, { useState } from 'react';

export default function QuickLogin() {
  const [status, setStatus] = useState<string>('');

  const startQuickLogin = async () => {
    if (!window.PublicKeyCredential) {
      setStatus('WebAuthn not supported in this browser');
      return;
    }
    try {
      // 1️⃣ Ask backend for a challenge (no auth needed – anonymous flow)
      const optRes = await fetch('/api/webauthn/quick-login/options', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        // client may optionally pass a known userId if stored locally
        body: JSON.stringify({}),
      });
      const optJson = await optRes.json();
      if (!optJson.success) {
        setStatus('Failed to obtain login options');
        return;
      }
      const publicKey = {
        ...optJson.options,
        challenge: Uint8Array.from(atob(optJson.options.challenge), c => c.charCodeAt(0)),
      };

      // 2️⃣ Prompt the platform authenticator (Face ID / Touch ID)
      const assertion = (await navigator.credentials.get({ publicKey })) as any;

      // 3️⃣ Send the assertion back to the server for verification
      const verifyRes = await fetch('/api/webauthn/quick-login/verify', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: assertion, userId: undefined }),
      });
      const verifyJson = await verifyRes.json();
      if (verifyJson.success) {
        // Store JWT (or let server set HttpOnly cookie) – here we just reload
        setStatus('Login successful – reloading');
        window.location.reload();
      } else {
        setStatus('Login failed: ' + (verifyJson.message || 'unknown'));
      }
    } catch (e) {
      console.error(e);
      setStatus('Authentication error');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <button
        onClick={startQuickLogin}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          background: '#007aff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Sign in with Face ID / Touch ID
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
