/**
 * Assistant Plan Controller
 * Endpoints for querying personas and creating, reading, updating, and deleting markdown plans.
 */

import { Request, Response } from 'express';
import { readFile, writeFile, unlink, access } from 'fs/promises';
import type { AuthRequest } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { ASSISTANT_REGISTRY } from './assistantRegistry.data.js';
import {
  log,
  assertSafeId,
  planPath,
  assertNoHtml,
  assertSuperUser,
} from './assistantCommon.js';

export const listAssistants = async (_req: Request, res: Response): Promise<void> => {
  const assistants = Object.values(ASSISTANT_REGISTRY);
  res.json({ success: true, data: assistants, total: assistants.length });
};

export const getAssistantPlan = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  assertSafeId(id);

  if (!ASSISTANT_REGISTRY[id]) {
    throw new AppError(`Assistant '${id}' not found`, 404);
  }

  const filePath = planPath(id);

  try {
    await access(filePath);
  } catch {
    // Plan file doesn't exist yet — return an empty plan
    res.json({ success: true, data: { id, plan: null, exists: false } });
    return;
  }

  const content = await readFile(filePath, 'utf-8');
  res.json({ success: true, data: { id, plan: content, exists: true } });
};

export const createAssistantPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  assertSuperUser(req);

  const { id, plan } = req.body as { id?: string; plan?: string };

  if (!id || typeof id !== 'string') {
    throw new AppError('Field "id" is required', 400);
  }
  if (typeof plan !== 'string') {
    throw new AppError('Field "plan" must be a string', 400);
  }

  assertSafeId(id);
  if (!ASSISTANT_REGISTRY[id]) {
    throw new AppError(`Assistant '${id}' not found`, 404);
  }
  assertNoHtml(plan);
  const filePath = planPath(id);

  // Prevent overwriting without explicit PUT
  try {
    await access(filePath);
    throw new AppError(`Plan for '${id}' already exists. Use PUT to update.`, 409);
  } catch (err) {
    if (err instanceof AppError) throw err;
    // File does not exist — continue
  }

  await writeFile(filePath, plan, 'utf-8');
  log.info(`Plan created for assistant '${id}' by user ${req.user?.id}`);

  res.status(201).json({ success: true, data: { id, exists: true } });
};

export const updateAssistantPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  assertSuperUser(req);

  const { id } = req.params as Record<string, string>;
  assertSafeId(id);

  if (!ASSISTANT_REGISTRY[id]) {
    throw new AppError(`Assistant '${id}' not found`, 404);
  }

  const { plan } = req.body as { plan?: string };
  if (typeof plan !== 'string') {
    throw new AppError('Field "plan" must be a string', 400);
  }

  assertNoHtml(plan);
  const filePath = planPath(id);

  await writeFile(filePath, plan, 'utf-8');
  log.info(`Plan updated for assistant '${id}' by user ${req.user?.id}`);

  res.json({ success: true, data: { id, exists: true } });
};

export const deleteAssistantPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  assertSuperUser(req);

  const { id } = req.params as Record<string, string>;
  assertSafeId(id);

  if (!ASSISTANT_REGISTRY[id]) {
    throw new AppError(`Assistant '${id}' not found`, 404);
  }

  const filePath = planPath(id);

  try {
    await access(filePath);
  } catch {
    throw new AppError(`No plan found for assistant '${id}'`, 404);
  }

  await unlink(filePath);
  log.info(`Plan deleted for assistant '${id}' by user ${req.user?.id}`);

  res.json({ success: true, data: { id, deleted: true } });
};

