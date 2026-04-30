/**
 * Express Type Extensions for White Caves
 * Extends Express.Request with authenticated user data set by auth middleware
 * and the row-level ownership filter attached by scopeToOwn().
 */

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      /**
       * Set by scopeToOwn() in server/middleware/rbac.ts.
       * Empty object for supervisors (see all data); a single-key object for
       * agents/lower roles that restricts DB queries to their own records.
       * e.g. { assignedToId: 'abc' } or { userId: 'abc' }
       */
      ownershipFilter?: Record<string, unknown>;
    }
  }
}
