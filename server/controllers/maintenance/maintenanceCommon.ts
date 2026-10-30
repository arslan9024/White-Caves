/**
 * Maintenance Common Constants & Validation Sets
 */

export const VALID_MAINTENANCE_CATEGORIES = [
  'plumbing',
  'electrical',
  'hvac',
  'appliance',
  'structural',
  'general',
] as const;
export type ValidMaintenanceCategory = (typeof VALID_MAINTENANCE_CATEGORIES)[number];

export const VALID_MAINTENANCE_PRIORITIES = ['low', 'medium', 'high', 'emergency'] as const;
export type ValidMaintenancePriority = (typeof VALID_MAINTENANCE_PRIORITIES)[number];

export const VALID_MAINTENANCE_STATUSES = [
  'open',
  'in_progress',
  'scheduled',
  'completed',
  'cancelled',
] as const;
export type ValidMaintenanceStatus = (typeof VALID_MAINTENANCE_STATUSES)[number];

