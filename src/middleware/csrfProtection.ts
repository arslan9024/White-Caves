import { Request, Response, NextFunction } from 'express';
import csurf from 'csurf';

// CSRF protection middleware – applies to all non-GET requests.
// Uses double submit cookie strategy (cookie: true) which works with
// client‑side frameworks that read the token from a cookie or via
// `/csrf-token` endpoint.
export const csrfProtection = csurf({ cookie: true });

type CsrfRequest = Request & { csrfToken: () => string };

// Helper endpoint to expose a fresh CSRF token for SPA clients.
export function csrfTokenHandler(req: Request, res: Response) {
  res.json({ csrfToken: (req as CsrfRequest).csrfToken() });
}

// Middleware that ensures a CSRF token cookie exists on GET requests.
export function setCsrfCookie(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET') {
    // Generate token and set as cookie for subsequent POST/PUT DELETE.
    const token = (req as CsrfRequest).csrfToken();
    res.cookie('csrf_token', token, { httpOnly: true, sameSite: 'strict' });
  }
  next();
}
