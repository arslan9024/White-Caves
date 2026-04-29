/**
 * Safe Redirect Utility
 *
 * Prevents open redirect attacks by validating URLs before navigation.
 * Only allows:
 *   1. Internal (relative) paths like /signin, /dashboard
 *   2. URLs from a configurable allowlist of trusted domains
 *
 * Usage:
 *   import { safeRedirect, safeExternalRedirect } from '../utils/safeRedirect';
 *   safeRedirect('/signin');                          // OK — internal
 *   safeExternalRedirect(authUrl, TRUSTED_DOMAINS);   // OK if domain is trusted
 */

import { createLogger } from './logger';

const log = createLogger('safeRedirect');

/** Domains we trust for OAuth and external redirects */
const TRUSTED_OAUTH_DOMAINS: ReadonlySet<string> = new Set([
  // UAE Pass (production + staging)
  'id.uaepass.ae',
  'stg-id.uaepass.ae',
  // LinkedIn OAuth
  'www.linkedin.com',
  'linkedin.com',
  // Google OAuth
  'accounts.google.com',
  // Microsoft / Azure AD
  'login.microsoftonline.com',
  // Firebase Auth
  'accounts.google.com',
  // Add more trusted providers as needed
]);

/**
 * Check if a URL is a safe internal path (starts with / but not //).
 * Rejects protocol-relative URLs like //evil.com.
 */
function isInternalPath(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//');
}

/**
 * Check if a URL points to a trusted OAuth provider domain.
 */
function isTrustedExternalUrl(
  url: string,
  extraDomains?: ReadonlySet<string>
): boolean {
  try {
    const parsed = new URL(url);

    // Only allow HTTPS for external redirects
    if (parsed.protocol !== 'https:') {
      log.warn('Blocked non-HTTPS redirect:', url);
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check primary allowlist
    if (TRUSTED_OAUTH_DOMAINS.has(hostname)) {
      return true;
    }

    // Check extra domains if provided
    if (extraDomains && extraDomains.has(hostname)) {
      return true;
    }

    return false;
  } catch {
    // Malformed URL
    log.warn('Blocked malformed URL redirect:', url);
    return false;
  }
}

/**
 * Navigate to an internal path safely.
 * Rejects any non-internal URL and falls back to the home page.
 *
 * @param path  — The internal path to navigate to (e.g. '/signin')
 * @param fallback — Where to go if the path is invalid (default: '/')
 */
export function safeRedirect(path: string, fallback = '/'): void {
  if (isInternalPath(path)) {
    window.location.href = path;
  } else {
    log.warn(`Blocked unsafe internal redirect to "${path}", falling back to "${fallback}"`);
    window.location.href = fallback;
  }
}

/**
 * Navigate to an external OAuth URL safely.
 * Only allows HTTPS URLs on trusted domains.
 *
 * @param url   — The external URL (e.g. from an OAuth /init endpoint)
 * @param extra — Optional extra trusted domains (Set<string>)
 * @param fallback — Where to go if the URL is rejected (default: '/')
 */
export function safeExternalRedirect(
  url: string,
  extra?: ReadonlySet<string>,
  fallback = '/'
): void {
  if (isTrustedExternalUrl(url, extra)) {
    window.location.href = url;
  } else {
    log.warn(`Blocked untrusted external redirect to "${url}", falling back to "${fallback}"`);
    window.location.href = fallback;
  }
}
