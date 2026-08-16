// src/server/middleware/authMiddleware.js
// Handles JWT generation, verification, and RBAC role checks.
// Uses ES module syntax as the project is type: "module".

import jwt from 'jsonwebtoken';
import { resolveBackendRole } from '../../utils/permissions.js';
import { getRoleLevel } from '../../utils/roleHelpers.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  
}

/** Generate a JWT for a user object.
 *  Payload includes user id and role (canonical). */
export function generateJWT(user) {
  const payload = {
    id: user._id?.toString() ?? user.id,
    role: resolveBackendRole(user.role ?? 'user'),
  };
  // token valid for 1 day
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

/** Middleware to authenticate a request via Bearer token. */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach payload to request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

/** Middleware factory that ensures the user has at least the required role hierarchy level.
 *  Example usage: `requireRole('admin')` will only allow owners/managers/admins.
 */
export function requireRole(minRole) {
  const minLevel = getRoleLevel(minRole);
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    const userLevel = getRoleLevel(req.user.role);
    if (userLevel >= minLevel) {
      return next();
    }
    return res.status(403).json({ error: 'Insufficient permissions' });
  };
}

/** Middleware to restrict access to the primary Gmail user */
export function requireGmailUser(req, res, next) {
  if (!req.user || !req.user.email) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  if (req.user.email === 'arslanmalikgoraha@gmail.com') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied' });
}
