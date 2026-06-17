/**
 * Department Authorization Middleware
 * Enforces department-level access control and role-based permissions
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, asyncHandler } from './errorHandler';
import prisma from '../lib/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      department?: {
        id: string;
        code: string;
        name: string;
      };
      departmentRole?: string;
      departmentPermissions?: string[];
    }
  }
}

/**
 * Middleware: Require department access for user
 * Extracts departmentCode from route params and verifies access
 */
export const requireDepartmentAccess = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const departmentCode = req.params.departmentCode || req.body.departmentCode;
    if (!departmentCode) {
      throw new AppError('Department code required', 400);
    }

    // Check if user has access to this department
    // For now, allow access if user exists (can be enhanced with DepartmentAccess model)
    const userExists = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, role: true, department: true },
    });

    if (!userExists) {
      throw new AppError('User not found', 404);
    }

    // Attach department info to request
    req.department = {
      id: departmentCode, // Use code as ID for now
      code: departmentCode,
      name: departmentCode, // Can be enhanced to look up full name
    };
    req.departmentRole = req.user.role;
    req.departmentPermissions = ['READ', 'WRITE', 'DELETE']; // Default permissions, can be customized

    next();
  }
);

/**
 * Middleware: Require specific permission within department
 */
export const requireDepartmentPermission = (permission: string) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.departmentPermissions?.includes(permission)) {
      throw new AppError(
        `Permission '${permission}' denied in this department`,
        403
      );
    }
    next();
  });

/**
 * Middleware: Require specific role within department
 */
export const requireDepartmentRole = (role: 'MANAGER' | 'ANALYST' | 'CONTRIBUTOR' | 'VIEWER') =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const roleHierarchy: Record<string, number> = {
      VIEWER: 1,
      CONTRIBUTOR: 2,
      ANALYST: 3,
      MANAGER: 4,
      owner: 5,
    };

    const userRoleLevel = roleHierarchy[req.departmentRole || ''] || 0;
    const requiredLevel = roleHierarchy[role];

    if (userRoleLevel < requiredLevel) {
      throw new AppError(
        `Role '${role}' required for this operation`,
        403
      );
    }

    next();
  });

/**
 * Middleware: Require owner or admin access
 */
export const requireOwnerOrAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      throw new AppError(
        'Owner or admin access required',
        403
      );
    }

    next();
  }
);

export default {
  requireDepartmentAccess,
  requireDepartmentPermission,
  requireDepartmentRole,
  requireOwnerOrAdmin,
};
