/**
 * Department Authorization Middleware
 * Enforces department-level access control and role-based permissions
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, asyncHandler } from './errorHandler.js';
import { prisma } from '../database.js';
import type { PrismaClient } from '@prisma/client';

const DEPARTMENT_NAMES: Record<string, string> = {
  SALES: 'Sales & Leasing',
  FINANCE: 'Finance',
  HR: 'Human Resources',
};

const getDepartmentAccessDelegate = (
  client: PrismaClient
): {
  findFirst: (args: {
    where: {
      userId: string;
      departmentCode: string;
      isActive: boolean;
      OR: Array<{ expiresAt: null } | { expiresAt: { gt: Date } }>;
    };
    select: { role: true; permissions: true };
  }) => Promise<{ role: string; permissions: string[] } | null>;
} => {
  return (client as any).departmentAccess;
};

declare module 'express-serve-static-core' {
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

/**
 * Middleware: Require department access for user
 * Extracts departmentCode from route params and verifies access
 */
export const requireDepartmentAccess = asyncHandler(
  async (req: Request, res: Response, next?: NextFunction) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    const departmentCodeParam =
      req.params.code || req.params.departmentCode || req.body.departmentCode;
    const departmentCode =
      typeof departmentCodeParam === 'string' ? departmentCodeParam.trim().toUpperCase() : '';

    if (!departmentCode) {
      throw new AppError('Department code required', 400);
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, role: true, department: true },
    });

    if (!userRecord) {
      throw new AppError('User not found', 404);
    }

    const isSuperUser =
      req.user.email?.toLowerCase().trim() === 'arslanmalikgoraha@gmail.com' ||
      ['owner', 'admin', 'lion', 'managing_director'].includes(req.user.role?.toLowerCase());

    if (isSuperUser) {
      req.department = {
        id: departmentCode,
        code: departmentCode,
        name: DEPARTMENT_NAMES[departmentCode] || departmentCode,
      };
      req.departmentRole = 'MANAGER';
      req.departmentPermissions = ['READ', 'WRITE', 'DELETE', 'APPROVE', 'ADMIN'];
      if (next) next();
      return;
    }

    const departmentAccess = getDepartmentAccessDelegate(prisma as unknown as PrismaClient);
    const accessRecord = await departmentAccess.findFirst({
      where: {
        userId: req.user.id,
        departmentCode,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: {
        role: true,
        permissions: true,
      },
    });

    if (!accessRecord) {
      throw new AppError(`Access denied for department '${departmentCode}'`, 403);
    }

    req.department = {
      id: departmentCode,
      code: departmentCode,
      name: DEPARTMENT_NAMES[departmentCode] || departmentCode,
    };
    req.departmentRole = accessRecord.role;
    req.departmentPermissions = accessRecord.permissions;

    if (next) next();
  }
);

/**
 * Middleware: Require specific permission within department
 */
export const requireDepartmentPermission = (permission: string) =>
  asyncHandler(async (req: Request, res: Response, next?: NextFunction) => {
    if (!req.departmentPermissions?.includes(permission)) {
      throw new AppError(`Permission '${permission}' denied in this department`, 403);
    }
    if (next) next();
  });

/**
 * Middleware: Require specific role within department
 */
export const requireDepartmentRole = (role: 'MANAGER' | 'ANALYST' | 'CONTRIBUTOR' | 'VIEWER') =>
  asyncHandler(async (req: Request, res: Response, next?: NextFunction) => {
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
      throw new AppError(`Role '${role}' required for this operation`, 403);
    }

    if (next) next();
  });

/**
 * Middleware: Require owner or admin access
 */
export const requireOwnerOrAdmin = asyncHandler(
  async (req: Request, res: Response, next?: NextFunction) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      throw new AppError('Owner or admin access required', 403);
    }

    if (next) next();
  }
);

export default {
  requireDepartmentAccess,
  requireDepartmentPermission,
  requireDepartmentRole,
  requireOwnerOrAdmin,
};
