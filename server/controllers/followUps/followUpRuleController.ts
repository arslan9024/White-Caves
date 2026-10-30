/**
 * Follow-Up Dynamic Cadence Rule Controller
 * Handlers for CRUD operations on dynamic cadence automation rules.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { CadenceRulePayload, normalizeRulePayload } from './followUpCommon.js';

export const getCadenceRules = async (_req: Request, res: Response): Promise<void> => {
  const rules = await prisma.cadenceRule.findMany({
    orderBy: [{ isActive: 'desc' }, { priority: 'desc' }, { createdAt: 'desc' }],
  });

  res.status(200).json({
    success: true,
    data: rules,
    count: rules.length,
  });
};

export const createCadenceRule = async (req: Request, res: Response): Promise<void> => {
  const payload = normalizeRulePayload(req.body as CadenceRulePayload);
  const rule = await prisma.cadenceRule.create({
    data: {
      ...payload,
      createdById: req.user?.id || null,
    },
  });

  res.status(201).json({
    success: true,
    data: rule,
    message: 'Cadence rule created',
  });
};

export const updateCadenceRule = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  const payload = normalizeRulePayload(req.body as CadenceRulePayload);
  const rule = await prisma.cadenceRule.update({
    where: { id },
    data: payload,
  });

  res.status(200).json({
    success: true,
    data: rule,
    message: 'Cadence rule updated',
  });
};

export const deleteCadenceRule = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  await prisma.cadenceRule.update({
    where: { id },
    data: { isActive: false },
  });

  res.status(200).json({
    success: true,
    message: 'Cadence rule deactivated',
  });
};

