/**
 * CspSecurityHeaderMiddleware — Wave 55 GOAL-096
 * Content Security Policy (CSP) & Zero-Trust CORS enterprise security header middleware
 * White Caves Real Estate LLC — Security Suite
 */
import { Request, Response, NextFunction } from 'express';

export interface SecurityPolicyConfig {
  enableHsts: boolean;
  enableCsp: boolean;
  allowedOrigins: string[];
  reportUri?: string;
}

export const defaultSecurityConfig: SecurityPolicyConfig = {
  enableHsts: true,
  enableCsp: true,
  allowedOrigins: [
    'https://whitecaves.ae',
    'https://crm.whitecaves.ae',
    'https://portal.whitecaves.ae',
    'http://localhost:5173',
  ],
  reportUri: '/api/v1/security/csp-report',
};

/**
 * Express middleware enforcing strict Content Security Policy, HSTS, X-Frame-Options,
 * and Anti-Clickjacking headers compliant with Dubai Electronic Security Center (DESC) standards.
 */
export function cspSecurityHeaderMiddleware(config: SecurityPolicyConfig = defaultSecurityConfig) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin as string;

    // 1. Strict CORS Validation
    if (origin && config.allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-GodMode-Token');
    }

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    // 2. Strict HTTP Strict Transport Security (HSTS)
    if (config.enableHsts) {
      res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    }

    // 3. Content Security Policy (CSP Level 3)
    if (config.enableCsp) {
      const cspDirectives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://api.mapbox.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://api.whitecaves.ae https://maps.googleapis.com https://api.mapbox.com wss://api.whitecaves.ae",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        config.reportUri ? `report-uri ${config.reportUri}` : '',
      ].filter(Boolean).join('; ');

      res.setHeader('Content-Security-Policy', cspDirectives);
    }

    // 4. Anti-Clickjacking & MIME Protection
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=(self), payment=(self)');

    next();
  };
}

export default cspSecurityHeaderMiddleware;
