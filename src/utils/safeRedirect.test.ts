/**
 * safeRedirect.test.ts — Comprehensive tests for the Safe Redirect utility
 * ────────────────────────────────────────────────────────────────────────
 * SECURITY-CRITICAL: This utility prevents open-redirect attacks.
 *
 * Coverage targets:
 *   ✓ safeRedirect: internal paths (/, /signin, /dashboard/leads)
 *   ✓ safeRedirect: blocks protocol-relative URLs (//evil.com)
 *   ✓ safeRedirect: blocks absolute URLs (https://evil.com)
 *   ✓ safeRedirect: custom fallback path
 *   ✓ safeExternalRedirect: trusted OAuth domains (Google, LinkedIn, UAE Pass)
 *   ✓ safeExternalRedirect: blocks untrusted domains
 *   ✓ safeExternalRedirect: blocks HTTP (non-HTTPS)
 *   ✓ safeExternalRedirect: blocks malformed URLs
 *   ✓ safeExternalRedirect: extra trusted domains parameter
 *   ✓ safeExternalRedirect: custom fallback
 *   ✓ Edge cases: empty strings, special characters, encoded URLs
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { safeRedirect, safeExternalRedirect } from './safeRedirect';

// ─── Mock logger ─────────────────────────────────────────────────────────
vi.mock('./logger', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

// ─── Track window.location.href assignments ─────────────────────────────
let locationHref = '';

describe('safeRedirect utilities', () => {
  beforeEach(() => {
    locationHref = '';
    // Use Object.defineProperty to intercept location.href assignments
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        get href() { return locationHref; },
        set href(val: string) { locationHref = val; },
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ========================================================================
  // 1. safeRedirect — INTERNAL PATHS
  // ========================================================================
  describe('safeRedirect', () => {
    describe('valid internal paths', () => {
      it('should redirect to /', () => {
        safeRedirect('/');
        expect(locationHref).toBe('/');
      });

      it('should redirect to /signin', () => {
        safeRedirect('/signin');
        expect(locationHref).toBe('/signin');
      });

      it('should redirect to /dashboard/leads', () => {
        safeRedirect('/dashboard/leads');
        expect(locationHref).toBe('/dashboard/leads');
      });

      it('should redirect to paths with query strings', () => {
        safeRedirect('/search?q=villa&page=2');
        expect(locationHref).toBe('/search?q=villa&page=2');
      });

      it('should redirect to paths with hash fragments', () => {
        safeRedirect('/properties#luxury');
        expect(locationHref).toBe('/properties#luxury');
      });
    });

    describe('blocked unsafe paths', () => {
      it('should block protocol-relative URL //evil.com', () => {
        safeRedirect('//evil.com');
        expect(locationHref).toBe('/');
      });

      it('should block absolute URL https://evil.com', () => {
        safeRedirect('https://evil.com');
        expect(locationHref).toBe('/');
      });

      it('should block absolute URL http://evil.com', () => {
        safeRedirect('http://evil.com');
        expect(locationHref).toBe('/');
      });

      it('should block javascript: protocol', () => {
        safeRedirect('javascript:alert(1)');
        expect(locationHref).toBe('/');
      });

      it('should block data: protocol', () => {
        safeRedirect('data:text/html,<h1>evil</h1>');
        expect(locationHref).toBe('/');
      });

      it('should block empty string', () => {
        safeRedirect('');
        expect(locationHref).toBe('/');
      });

      it('should block relative path without leading slash', () => {
        safeRedirect('evil.com/steal');
        expect(locationHref).toBe('/');
      });
    });

    describe('custom fallback', () => {
      it('should use custom fallback when path is unsafe', () => {
        safeRedirect('https://evil.com', '/error');
        expect(locationHref).toBe('/error');
      });

      it('should use custom fallback for protocol-relative URLs', () => {
        safeRedirect('//evil.com', '/signin');
        expect(locationHref).toBe('/signin');
      });
    });
  });

  // ========================================================================
  // 2. safeExternalRedirect — TRUSTED DOMAINS
  // ========================================================================
  describe('safeExternalRedirect', () => {
    describe('trusted OAuth domains', () => {
      it('should allow Google OAuth', () => {
        safeExternalRedirect('https://accounts.google.com/o/oauth2/auth?client_id=123');
        expect(locationHref).toBe('https://accounts.google.com/o/oauth2/auth?client_id=123');
      });

      it('should allow LinkedIn', () => {
        safeExternalRedirect('https://www.linkedin.com/oauth/v2/authorization');
        expect(locationHref).toBe('https://www.linkedin.com/oauth/v2/authorization');
      });

      it('should allow LinkedIn without www', () => {
        safeExternalRedirect('https://linkedin.com/oauth/v2/authorization');
        expect(locationHref).toBe('https://linkedin.com/oauth/v2/authorization');
      });

      it('should allow UAE Pass production', () => {
        safeExternalRedirect('https://id.uaepass.ae/idshub/authorize');
        expect(locationHref).toBe('https://id.uaepass.ae/idshub/authorize');
      });

      it('should allow UAE Pass staging', () => {
        safeExternalRedirect('https://stg-id.uaepass.ae/idshub/authorize');
        expect(locationHref).toBe('https://stg-id.uaepass.ae/idshub/authorize');
      });

      it('should allow Microsoft / Azure AD', () => {
        safeExternalRedirect('https://login.microsoftonline.com/common/oauth2');
        expect(locationHref).toBe('https://login.microsoftonline.com/common/oauth2');
      });
    });

    describe('blocked untrusted domains', () => {
      it('should block untrusted domain', () => {
        safeExternalRedirect('https://evil-phishing.com/fake-login');
        expect(locationHref).toBe('/');
      });

      it('should block subdomain spoofing (accounts.google.com.evil.com)', () => {
        safeExternalRedirect('https://accounts.google.com.evil.com/login');
        expect(locationHref).toBe('/');
      });

      it('should block similar domain names', () => {
        safeExternalRedirect('https://accounts-google.com/login');
        expect(locationHref).toBe('/');
      });
    });

    describe('protocol enforcement', () => {
      it('should block HTTP URLs even for trusted domains', () => {
        safeExternalRedirect('http://accounts.google.com/login');
        expect(locationHref).toBe('/');
      });

      it('should block FTP protocol', () => {
        safeExternalRedirect('ftp://accounts.google.com/file');
        expect(locationHref).toBe('/');
      });
    });

    describe('malformed URLs', () => {
      it('should block malformed URLs', () => {
        safeExternalRedirect('not-a-valid-url');
        expect(locationHref).toBe('/');
      });

      it('should block empty string', () => {
        safeExternalRedirect('');
        expect(locationHref).toBe('/');
      });

      it('should block javascript: protocol', () => {
        safeExternalRedirect('javascript:alert(document.cookie)');
        expect(locationHref).toBe('/');
      });
    });

    describe('extra trusted domains', () => {
      it('should allow URLs from extra trusted domains', () => {
        const extra = new Set(['custom-sso.whitecaves.com']);
        safeExternalRedirect('https://custom-sso.whitecaves.com/auth', extra);
        expect(locationHref).toBe('https://custom-sso.whitecaves.com/auth');
      });

      it('should still allow built-in trusted domains with extra set', () => {
        const extra = new Set(['custom.com']);
        safeExternalRedirect('https://accounts.google.com/login', extra);
        expect(locationHref).toBe('https://accounts.google.com/login');
      });

      it('should block domains not in either set', () => {
        const extra = new Set(['custom.com']);
        safeExternalRedirect('https://evil.com/steal', extra);
        expect(locationHref).toBe('/');
      });
    });

    describe('custom fallback', () => {
      it('should use custom fallback for blocked URLs', () => {
        safeExternalRedirect('https://evil.com', undefined, '/blocked');
        expect(locationHref).toBe('/blocked');
      });

      it('should use default fallback (/) when not specified', () => {
        safeExternalRedirect('https://evil.com');
        expect(locationHref).toBe('/');
      });
    });
  });

  // ========================================================================
  // 3. EDGE CASES
  // ========================================================================
  describe('edge cases', () => {
    it('safeRedirect should handle URL-encoded paths', () => {
      safeRedirect('/search?q=luxury%20villa');
      expect(locationHref).toBe('/search?q=luxury%20villa');
    });

    it('safeExternalRedirect should handle URLs with ports', () => {
      // Untrusted domain with port should still be blocked
      safeExternalRedirect('https://evil.com:8443/auth');
      expect(locationHref).toBe('/');
    });

    it('safeExternalRedirect should handle URLs with authentication info', () => {
      // URLs with user:pass should be blocked (not a trusted domain)
      safeExternalRedirect('https://user:pass@evil.com/login');
      expect(locationHref).toBe('/');
    });

    it('safeRedirect should handle paths with double slashes in the middle', () => {
      // /valid//path is still a valid internal path (starts with / not //)
      safeRedirect('/valid//path');
      expect(locationHref).toBe('/valid//path');
    });
  });
});
