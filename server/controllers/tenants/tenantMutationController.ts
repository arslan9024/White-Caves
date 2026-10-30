/**
 * Tenant Mutation Controller
 * Handles tenant record creation, profile and lease status updates, and deletion.
 */

import { Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { validateIdParam } from '../../utils/validate.js';
import { RouteRequest, VALID_TENANT_STATUSES } from './tenantCommon.js';

export const createTenant = async (req: RouteRequest, res: Response): Promise<void> => {
  // AUTHORIZATION: Only admins or property managers can create tenant records
  const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
  if (!isAdmin) {
    throw new AppError('Only admins or property managers can create tenant records', 403);
  }

  const {
    name,
    email,
    phone,
    nationality,
    emiratesId,
    propertyId,
    monthlyRent,
    deposit,
    moveInDate,
    notes,
  } = req.body;

  if (!name?.trim()) throw new AppError('Tenant name is required', 400);

  const sanitizedName = sanitizeString(name.trim());
  if (sanitizedName.length > 150) throw new AppError('Name must be 150 characters or less', 400);
  if (notes && notes.length > 5000)
    throw new AppError('Notes must be 5000 characters or less', 400);

  // Validate property exists if provided
  if (propertyId) {
    if (typeof propertyId !== 'string' || !/^[a-fA-F0-9]{24}$/.test(propertyId)) {
      throw new AppError('Property ID must be a valid 24-character hex string', 400);
    }
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });
    if (!property) throw new AppError('Referenced property not found', 400);
  }

  const tenant = await prisma.tenant.create({
    data: {
      name: sanitizedName,
      email: email?.trim()?.toLowerCase() || null,
      phone: sanitizeString(phone?.trim() || '') || null,
      nationality: sanitizeString(nationality || '') || null,
      emiratesId: sanitizeString(emiratesId || '') || null,
      propertyId: propertyId || null,
      monthlyRent: monthlyRent
        ? (() => {
            const v = parseFloat(monthlyRent);
            return Number.isFinite(v) && v >= 0 ? v : null;
          })()
        : null,
      deposit: deposit
        ? (() => {
            const v = parseFloat(deposit);
            return Number.isFinite(v) && v >= 0 ? v : null;
          })()
        : null,
      moveInDate: moveInDate
        ? (() => {
            const d = new Date(moveInDate);
            return !isNaN(d.getTime()) ? d : null;
          })()
        : null,
      notes: sanitizeString(notes || '') || null,
      status: 'active',
    },
  });

  await prisma.activity.create({
    data: {
      type: 'client',
      action: 'created',
      description: `New tenant added: ${tenant.name}`,
      userId: req.user?.id || null,
    },
  });

  res.status(201).json({ success: true, data: tenant });
};

export const updateTenant = async (req: RouteRequest, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Tenant ID');
  const {
    name,
    email,
    phone,
    nationality,
    emiratesId,
    propertyId,
    monthlyRent,
    deposit,
    moveInDate,
    moveOutDate,
    notes,
    status,
  } = req.body;

  const existing = await prisma.tenant.findUnique({ where: { id } });
  if (!existing) throw new AppError('Tenant not found', 404);

  // AUTHORIZATION: Only admins or property managers can update tenant records
  const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
  if (!isAdmin) {
    throw new AppError('Only admins or property managers can update tenant records', 403);
  }

  const data: Record<string, unknown> = {};
  if (name !== undefined) {
    const s = sanitizeString(name.trim());
    if (s.length > 150) throw new AppError('Name must be 150 characters or less', 400);
    data.name = s;
  }
  if (email !== undefined) data.email = email?.trim()?.toLowerCase() || null;
  if (phone !== undefined) data.phone = sanitizeString(phone?.trim() || '') || null;
  if (nationality !== undefined) data.nationality = sanitizeString(nationality || '') || null;
  if (emiratesId !== undefined) data.emiratesId = sanitizeString(emiratesId || '') || null;
  if (propertyId !== undefined) {
    if (propertyId && (typeof propertyId !== 'string' || !/^[a-fA-F0-9]{24}$/.test(propertyId))) {
      throw new AppError('Property ID must be a valid 24-character hex string', 400);
    }
    // Validate property exists if provided
    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true },
      });
      if (!property) throw new AppError('Referenced property not found', 400);
    }
    data.propertyId = propertyId || null;
  }
  if (monthlyRent !== undefined)
    data.monthlyRent = monthlyRent
      ? (() => {
          const v = parseFloat(monthlyRent);
          return Number.isFinite(v) && v >= 0 ? v : null;
        })()
      : null;
  if (deposit !== undefined)
    data.deposit = deposit
      ? (() => {
          const v = parseFloat(deposit);
          return Number.isFinite(v) && v >= 0 ? v : null;
        })()
      : null;
  if (moveInDate !== undefined)
    data.moveInDate = moveInDate
      ? (() => {
          const d = new Date(moveInDate);
          return !isNaN(d.getTime()) ? d : null;
        })()
      : null;
  if (moveOutDate !== undefined)
    data.moveOutDate = moveOutDate
      ? (() => {
          const d = new Date(moveOutDate);
          return !isNaN(d.getTime()) ? d : null;
        })()
      : null;
  if (notes !== undefined) {
    if (notes && notes.length > 5000)
      throw new AppError('Notes must be 5000 characters or less', 400);
    data.notes = sanitizeString(notes || '') || null;
  }
  if (status !== undefined) {
    if (!VALID_TENANT_STATUSES.includes(status)) {
      throw new AppError(`Invalid tenant status. Allowed: ${VALID_TENANT_STATUSES.join(', ')}`, 400);
    }
    data.status = status;
  }

  const tenant = await prisma.tenant.update({ where: { id }, data });

  res.status(200).json({ success: true, data: tenant });
};

export const deleteTenant = async (req: RouteRequest, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Tenant ID');
  const existing = await prisma.tenant.findUnique({ where: { id } });
  if (!existing) throw new AppError('Tenant not found', 404);

  // AUTHORIZATION: Only admins or property managers can delete tenant records
  const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
  if (!isAdmin) {
    throw new AppError('Only admins or property managers can delete tenant records', 403);
  }

  await prisma.$transaction(async tx => {
    await tx.tenant.delete({ where: { id } });

    await tx.activity.create({
      data: {
        type: 'client',
        action: 'deleted',
        description: `Tenant deleted: ${existing.name} (by ${req.user?.email})`,
        userId: req.user?.id || null,
      },
    });
  });

  res.status(200).json({ success: true, message: `Tenant "${existing.name}" deleted` });
};

