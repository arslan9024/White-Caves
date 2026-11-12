let bootstrapInFlight: Promise<string> | null = null;

export function readCsrfCookie(): string | null {
  if (typeof document === 'undefined') return null;

  for (const entry of document.cookie.split(';')) {
    const [key, ...valueParts] = entry.trim().split('=');
    if (key === 'csrf_token') return decodeURIComponent(valueParts.join('='));
  }
  return null;
}

export async function ensureCsrfToken(): Promise<string> {
  const existingToken = readCsrfCookie();
  if (existingToken) return existingToken;
  if (typeof document === 'undefined') {
    throw new Error('CSRF token is unavailable outside a browser session');
  }

  if (!bootstrapInFlight) {
    bootstrapInFlight = (async () => {
      const response = await fetch('/api/auth/csrf', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`CSRF token request failed with status ${response.status}`);
      }

      const token = readCsrfCookie();
      if (!token) {
        throw new Error('CSRF token endpoint did not set a readable cookie');
      }
      return token;
    })().finally(() => {
      bootstrapInFlight = null;
    });
  }

  return bootstrapInFlight;
}
