/**
 * complianceCommon.ts
 * Shared constants, types, and utility functions for compliance controllers.
 */

import { AppError } from '../../middleware/errorHandler.js';

export const COMPLIANCE_MANAGER_ROLES = ['owner', 'manager', 'admin', 'finance'] as const;

export function ensureComplianceManagerRole(role: string | undefined, message: string): void {
  if (
    !COMPLIANCE_MANAGER_ROLES.includes((role || '') as (typeof COMPLIANCE_MANAGER_ROLES)[number])
  ) {
    throw new AppError(message, 403);
  }
}

export function normalizeMetadata(metadata: unknown): Record<string, unknown> {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    return metadata as Record<string, unknown>;
  }
  return {};
}
