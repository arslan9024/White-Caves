/**
 * Content Security Policy (CSP) Middleware — Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import {
  cspMiddleware,
  createCspMiddleware,
  isCspReportOnly,
  getCspDirectives,
  cspReportHandler,
} from './csp.js';
import logger from '../utils/logger.js';

describe('CSP Middleware', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('isCspReportOnly', () => {
    it('defaults to true when CSP_REPORT_ONLY is unset', () => {
      delete process.env.CSP_REPORT_ONLY;
      delete process.env.CSP_ENFORCE;
      expect(isCspReportOnly()).toBe(true);
    });

    it('returns true when CSP_REPORT_ONLY is "true"', () => {
      process.env.CSP_REPORT_ONLY = 'true';
      delete process.env.CSP_ENFORCE;
      expect(isCspReportOnly()).toBe(true);
    });

    it('returns false when CSP_REPORT_ONLY is "false"', () => {
      process.env.CSP_REPORT_ONLY = 'false';
      delete process.env.CSP_ENFORCE;
      expect(isCspReportOnly()).toBe(false);
    });

    it('returns false when CSP_ENFORCE is "true"', () => {
      process.env.CSP_REPORT_ONLY = 'true';
      process.env.CSP_ENFORCE = 'true';
      expect(isCspReportOnly()).toBe(false);
    });
  });

  describe('getCspDirectives', () => {
    it('contains all essential directives for Dubai luxury portal', () => {
      const directives = getCspDirectives();

      expect(directives.defaultSrc).toEqual(["'self'"]);
      expect(directives.scriptSrc).toContain("'self'");
      expect(directives.scriptSrc).toContain('https://js.stripe.com');
      expect(directives.scriptSrc).toContain('https://maps.googleapis.com');
      expect(directives.scriptSrc).toContain('https://va.vercel-scripts.com');
      expect(directives.imgSrc).toContain('https://*.unsplash.com');
      expect(directives.imgSrc).toContain('https://*.tile.openstreetmap.org');
      expect(directives.connectSrc).toContain('https://api.stripe.com');
      expect(directives.connectSrc).toContain('https://*.firebaseio.com');
      expect(directives.frameSrc).toContain('https://js.stripe.com');
      expect(directives.objectSrc).toEqual(["'none'"]);
      expect(directives.baseUri).toEqual(["'self'"]);
      expect(directives.formAction).toEqual(["'self'"]);
      expect(directives.reportUri).toEqual(['/api/security/csp-report']);
    });

    it('custom reportUri is honored', () => {
      const customUri = '/custom/csp-report-endpoint';
      const directives = getCspDirectives(customUri);
      expect(directives.reportUri).toEqual([customUri]);
    });
  });

  describe('cspMiddleware & createCspMiddleware', () => {
    it('sets Content-Security-Policy-Report-Only header in report-only mode', () => {
      const middleware = createCspMiddleware({ reportOnly: true });

      const headers: Record<string, string> = {};
      const req = {
        headers: {},
      } as unknown as Request;

      const res = {
        setHeader: vi.fn((key: string, value: string) => {
          headers[key.toLowerCase()] = value;
        }),
        getHeader: vi.fn((key: string) => headers[key.toLowerCase()]),
        removeHeader: vi.fn((key: string) => {
          delete headers[key.toLowerCase()];
        }),
      } as unknown as Response;

      const next: NextFunction = vi.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(headers).toHaveProperty('content-security-policy-report-only');
      expect(headers['content-security-policy-report-only']).toContain("default-src 'self'");
    });

    it('sets Content-Security-Policy header in enforced mode', () => {
      const middleware = createCspMiddleware({ reportOnly: false });

      const headers: Record<string, string> = {};
      const req = {
        headers: {},
      } as unknown as Request;

      const res = {
        setHeader: vi.fn((key: string, value: string) => {
          headers[key.toLowerCase()] = value;
        }),
        getHeader: vi.fn((key: string) => headers[key.toLowerCase()]),
        removeHeader: vi.fn((key: string) => {
          delete headers[key.toLowerCase()];
        }),
      } as unknown as Response;

      const next: NextFunction = vi.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(headers).toHaveProperty('content-security-policy');
      expect(headers['content-security-policy']).toContain("default-src 'self'");
    });

    it('default cspMiddleware executes next() successfully', () => {
      const headers: Record<string, string> = {};
      const req = { headers: {} } as unknown as Request;
      const res = {
        setHeader: vi.fn((key: string, value: string) => {
          headers[key.toLowerCase()] = value;
        }),
        getHeader: vi.fn((key: string) => headers[key.toLowerCase()]),
        removeHeader: vi.fn(),
      } as unknown as Response;
      const next: NextFunction = vi.fn();

      cspMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('cspReportHandler', () => {
    it('logs CSP violation and returns 204 No Content', () => {
      const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => logger);

      const req = {
        body: {
          'csp-report': {
            'document-uri': 'https://whitecaves.ae/properties',
            'blocked-uri': 'http://malicious.com/evil.js',
            'violated-directive': 'script-src',
            'effective-directive': 'script-src',
            'source-file': 'https://whitecaves.ae/properties',
            'line-number': 42,
          },
        },
        get: vi.fn((header: string) => {
          if (header === 'referrer') return 'https://google.com';
          if (header === 'user-agent') return 'Mozilla/5.0 TestBrowser';
          return undefined;
        }),
      } as unknown as Request;

      const statusMock = vi.fn().mockReturnThis();
      const endMock = vi.fn();
      const res = {
        status: statusMock,
        end: endMock,
      } as unknown as Response;

      cspReportHandler(req, res, () => {});

      expect(warnSpy).toHaveBeenCalledWith(
        'CSP Violation detected:',
        expect.objectContaining({
          documentUri: 'https://whitecaves.ae/properties',
          blockedUri: 'http://malicious.com/evil.js',
          violatedDirective: 'script-src',
        })
      );
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(endMock).toHaveBeenCalled();
    });

    it('handles empty violation body gracefully without throwing', () => {
      const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => logger);

      const req = {
        body: {},
        ip: '127.0.0.1',
        get: vi.fn(() => 'TestAgent'),
      } as unknown as Request;

      const statusMock = vi.fn().mockReturnThis();
      const endMock = vi.fn();
      const res = {
        status: statusMock,
        end: endMock,
      } as unknown as Response;

      cspReportHandler(req, res, () => {});

      expect(warnSpy).toHaveBeenCalledWith(
        'CSP Violation report received with empty body',
        expect.anything()
      );
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(endMock).toHaveBeenCalled();
    });
  });
});
