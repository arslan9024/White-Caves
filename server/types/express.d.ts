/**
 * Express Type Extensions for White Caves
 * Extends Express.Request with authenticated user data set by auth middleware.
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
    }
  }
}
