/**
 * recruitment.access.js — RBAC middleware for recruitment routes
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import {
  RECRUITMENT_READ_ROLES,
  RECRUITMENT_WRITE_ROLES,
  RECRUITMENT_MANAGER_REVIEW_ROLES,
} from './recruitment.context.js';

export function requireRecruitmentAccess(level = 'read') {
  return (req, res, next) => {
    // Keep backward compatibility in environments where auth is not wired yet.
    if (process.env.RECRUITMENT_AUTH_MODE !== 'enforced') {
      return next();
    }

    const headerRole = req.headers['x-user-role'];
    const userRole = (headerRole || req.user?.role || '').toString().trim().toLowerCase();

    if (!userRole) {
      return res.status(401).json({
        error: 'Authentication required for recruitment routes',
      });
    }

    const allowedRoles = level === 'write' ? RECRUITMENT_WRITE_ROLES : RECRUITMENT_READ_ROLES;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: `Recruitment ${level} access denied for role: ${userRole}`,
      });
    }

    req.recruitmentAccess = { role: userRole, level };
    return next();
  };
}

export function requireManagerReviewAccess() {
  return (req, res, next) => {
    if (process.env.RECRUITMENT_AUTH_MODE !== 'enforced') {
      return next();
    }

    const headerRole = req.headers['x-user-role'];
    const userRole = (headerRole || req.user?.role || '').toString().trim().toLowerCase();

    if (!userRole) {
      return res.status(401).json({
        error: 'Authentication required for manager review routes',
      });
    }

    if (!RECRUITMENT_MANAGER_REVIEW_ROLES.includes(userRole)) {
      return res.status(403).json({
        error: `Manager review access denied for role: ${userRole}`,
      });
    }

    req.recruitmentAccess = { role: userRole, level: 'manager_review' };
    return next();
  };
}
