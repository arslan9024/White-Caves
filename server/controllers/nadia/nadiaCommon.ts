/**
 * nadiaCommon.ts
 * Shared helpers, constants, and permission checks for Nadia WhatsApp CRM controllers.
 */

import { Request } from 'express';
import { resolveBackendRole, roleHasPermission } from '../../middleware/rbac.js';
import type { AuthRequest } from '../../middleware/auth.js';

export const DEFAULT_NADIA_ESCALATION_CONFIDENCE_THRESHOLD = 0.6;

export const getNadiaEscalationConfidenceThreshold = (): number => {
  const raw = Number(process.env.NADIA_ESCALATION_CONFIDENCE_THRESHOLD ?? '');
  if (Number.isNaN(raw)) {
    return DEFAULT_NADIA_ESCALATION_CONFIDENCE_THRESHOLD;
  }
  return Math.min(0.95, Math.max(0.2, raw));
};

export const ALLOWED_CONVERSATION_STATUSES = [
  'active',
  'assigned_to_agent',
  'in_bot_flow',
  'closed',
];

export const canPerform = (req: Request, permission: string): boolean => {
  const role = (req as AuthRequest).user?.role;
  if (!role) return false;
  return roleHasPermission(resolveBackendRole(role), permission);
};

