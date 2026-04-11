/**
 * Centralized Status Configuration
 * ==================================
 * Single source of truth for ALL status → badge/color/label mappings.
 * Use these constants instead of inline status configs in components.
 *
 * Import example:
 *   import { LEAD_STATUS_CONFIG, PROPERTY_STATUS_CONFIG } from '@/config/statusConfig';
 */

import type { BadgeVariant } from '../components/design-system/Badge/types';
import { colors } from '../styles/theme/colors';

// ─── Shared Badge Config Type ─────────────────────────────────────────

export interface StatusConfig {
  label: string;
  color: string;
  badgeVariant: BadgeVariant;
}

// ─── Lead Status ──────────────────────────────────────────────────────

export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  VIEWING: 'viewing',
  OFFERED: 'offered',
  WON: 'won',
  LOST: 'lost',
} as const;

export type LeadStatusValue = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

export const LEAD_STATUS_CONFIG: Record<string, StatusConfig> = {
  [LEAD_STATUS.NEW]: { label: 'New', color: colors.badges.blue, badgeVariant: 'info' },
  [LEAD_STATUS.CONTACTED]: { label: 'Contacted', color: colors.badges.cyan, badgeVariant: 'info' },
  [LEAD_STATUS.QUALIFIED]: { label: 'Qualified', color: colors.badges.green, badgeVariant: 'success' },
  [LEAD_STATUS.VIEWING]: { label: 'Viewing', color: colors.badges.purple, badgeVariant: 'primary' },
  [LEAD_STATUS.OFFERED]: { label: 'Offered', color: colors.badges.amber, badgeVariant: 'warning' },
  [LEAD_STATUS.WON]: { label: 'Won', color: colors.badges.greenDark, badgeVariant: 'success' },
  [LEAD_STATUS.LOST]: { label: 'Lost', color: colors.badges.red, badgeVariant: 'error' },
};

// ─── Lead Priority ────────────────────────────────────────────────────

export const LEAD_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type LeadPriorityValue = (typeof LEAD_PRIORITY)[keyof typeof LEAD_PRIORITY];

export const LEAD_PRIORITY_CONFIG: Record<string, StatusConfig> = {
  [LEAD_PRIORITY.HIGH]: { label: 'High', color: colors.badges.red, badgeVariant: 'error' },
  [LEAD_PRIORITY.MEDIUM]: { label: 'Medium', color: colors.badges.amber, badgeVariant: 'warning' },
  [LEAD_PRIORITY.LOW]: { label: 'Low', color: colors.badges.blue, badgeVariant: 'info' },
};

// ─── Lead Source ──────────────────────────────────────────────────────

export const LEAD_SOURCE = {
  WHATSAPP: 'whatsapp',
  WEBSITE: 'website',
  CHATBOT: 'chatbot',
  REFERRAL: 'referral',
  PHONE: 'phone',
  MARKETING: 'marketing',
} as const;

export type LeadSourceValue = (typeof LEAD_SOURCE)[keyof typeof LEAD_SOURCE];

export const LEAD_SOURCE_CONFIG: Record<string, { label: string; icon: string }> = {
  [LEAD_SOURCE.WHATSAPP]: { label: 'WhatsApp', icon: '💬' },
  [LEAD_SOURCE.WEBSITE]: { label: 'Website', icon: '🌐' },
  [LEAD_SOURCE.CHATBOT]: { label: 'Chatbot', icon: '🤖' },
  [LEAD_SOURCE.REFERRAL]: { label: 'Referral', icon: '👥' },
  [LEAD_SOURCE.PHONE]: { label: 'Phone', icon: '📞' },
  [LEAD_SOURCE.MARKETING]: { label: 'Marketing', icon: '📢' },
};

// ─── Property Status ──────────────────────────────────────────────────

export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  UNDER_CONTRACT: 'under_contract',
  SOLD: 'sold',
  RENTED: 'rented',
  OFF_MARKET: 'off_market',
  ARCHIVED: 'archived',
} as const;

export type PropertyStatusValue = (typeof PROPERTY_STATUS)[keyof typeof PROPERTY_STATUS];

export const PROPERTY_STATUS_CONFIG: Record<string, StatusConfig> = {
  [PROPERTY_STATUS.AVAILABLE]: { label: 'Available', color: colors.badges.green, badgeVariant: 'success' },
  [PROPERTY_STATUS.RESERVED]: { label: 'Reserved', color: colors.badges.amber, badgeVariant: 'warning' },
  [PROPERTY_STATUS.UNDER_CONTRACT]: { label: 'Under Contract', color: colors.badges.purple, badgeVariant: 'info' },
  [PROPERTY_STATUS.SOLD]: { label: 'Sold', color: colors.badges.red, badgeVariant: 'error' },
  [PROPERTY_STATUS.RENTED]: { label: 'Rented', color: colors.badges.cyan, badgeVariant: 'info' },
  [PROPERTY_STATUS.OFF_MARKET]: { label: 'Off Market', color: colors.badges.gray, badgeVariant: 'secondary' },
  [PROPERTY_STATUS.ARCHIVED]: { label: 'Archived', color: colors.badges.grayLight, badgeVariant: 'secondary' },
};

// ─── Contract Status ──────────────────────────────────────────────────

export const CONTRACT_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
} as const;

export type ContractStatusValue = (typeof CONTRACT_STATUS)[keyof typeof CONTRACT_STATUS];

export const CONTRACT_STATUS_CONFIG: Record<string, StatusConfig> = {
  [CONTRACT_STATUS.ACTIVE]: { label: 'Active', color: colors.badges.green, badgeVariant: 'success' },
  [CONTRACT_STATUS.PENDING]: { label: 'Pending', color: colors.badges.amber, badgeVariant: 'warning' },
  [CONTRACT_STATUS.COMPLETED]: { label: 'Completed', color: colors.badges.blue, badgeVariant: 'info' },
  [CONTRACT_STATUS.EXPIRED]: { label: 'Expired', color: colors.badges.red, badgeVariant: 'error' },
  [CONTRACT_STATUS.CANCELLED]: { label: 'Cancelled', color: colors.badges.gray, badgeVariant: 'secondary' },
};

// ─── Ejari Status ─────────────────────────────────────────────────────

export const EJARI_STATUS = {
  REGISTERED: 'registered',
  PENDING: 'pending',
} as const;

export type EjariStatusValue = (typeof EJARI_STATUS)[keyof typeof EJARI_STATUS];

export const EJARI_STATUS_CONFIG: Record<string, StatusConfig> = {
  [EJARI_STATUS.REGISTERED]: { label: '✓ Registered', color: colors.badges.green, badgeVariant: 'success' },
  [EJARI_STATUS.PENDING]: { label: '⏳ Pending', color: colors.badges.red, badgeVariant: 'warning' },
};

// ─── User Status ──────────────────────────────────────────────────────

export const USER_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  INACTIVE: 'inactive',
} as const;

export type UserStatusValue = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const USER_STATUS_CONFIG: Record<string, StatusConfig> = {
  [USER_STATUS.ACTIVE]: { label: 'Active', color: colors.badges.green, badgeVariant: 'success' },
  [USER_STATUS.PENDING]: { label: 'Pending', color: colors.badges.amber, badgeVariant: 'warning' },
  [USER_STATUS.INACTIVE]: { label: 'Inactive', color: colors.badges.red, badgeVariant: 'error' },
};

// ─── UAE Pass Verification ────────────────────────────────────────────

export const UAE_PASS_STATUS = {
  VERIFIED: 'verified',
  PENDING: 'pending',
  REJECTED: 'rejected',
} as const;

export type UAEPassStatusValue = (typeof UAE_PASS_STATUS)[keyof typeof UAE_PASS_STATUS];

export const UAE_PASS_STATUS_CONFIG: Record<string, StatusConfig> = {
  [UAE_PASS_STATUS.VERIFIED]: { label: '✓ Verified', color: colors.badges.green, badgeVariant: 'success' },
  [UAE_PASS_STATUS.PENDING]: { label: '⏳ Pending', color: colors.badges.amber, badgeVariant: 'warning' },
  [UAE_PASS_STATUS.REJECTED]: { label: '✕ Rejected', color: colors.badges.red, badgeVariant: 'error' },
};

// ─── UAE Pass Roles ───────────────────────────────────────────────────

export const UAE_PASS_ROLE = {
  BUYER: 'buyer',
  SELLER: 'seller',
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  AGENT: 'agent',
} as const;

export type UAEPassRoleValue = (typeof UAE_PASS_ROLE)[keyof typeof UAE_PASS_ROLE];

export const UAE_PASS_ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  [UAE_PASS_ROLE.BUYER]: { label: 'Buyer', color: colors.badges.blue },
  [UAE_PASS_ROLE.SELLER]: { label: 'Seller', color: colors.badges.purple },
  [UAE_PASS_ROLE.LANDLORD]: { label: 'Landlord', color: colors.badges.amber },
  [UAE_PASS_ROLE.TENANT]: { label: 'Tenant', color: colors.badges.green },
  [UAE_PASS_ROLE.AGENT]: { label: 'Agent', color: colors.departments.marketing },
};

// ─── System / Service Health ──────────────────────────────────────────

export const SYSTEM_STATUS = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  DOWN: 'down',
} as const;

export type SystemStatusValue = (typeof SYSTEM_STATUS)[keyof typeof SYSTEM_STATUS];

export const SYSTEM_STATUS_CONFIG: Record<string, StatusConfig> = {
  [SYSTEM_STATUS.HEALTHY]: { label: 'Healthy', color: colors.badges.green, badgeVariant: 'success' },
  [SYSTEM_STATUS.DEGRADED]: { label: 'Degraded', color: colors.badges.amber, badgeVariant: 'warning' },
  [SYSTEM_STATUS.DOWN]: { label: 'Down', color: colors.badges.red, badgeVariant: 'error' },
};

// ─── Integration Status ───────────────────────────────────────────────

export const INTEGRATION_STATUS = {
  CONNECTED: 'connected',
  PENDING: 'pending',
  DISCONNECTED: 'disconnected',
} as const;

export type IntegrationStatusValue = (typeof INTEGRATION_STATUS)[keyof typeof INTEGRATION_STATUS];

export const INTEGRATION_STATUS_CONFIG: Record<string, StatusConfig> = {
  [INTEGRATION_STATUS.CONNECTED]: { label: '● Connected', color: colors.badges.green, badgeVariant: 'success' },
  [INTEGRATION_STATUS.PENDING]: { label: '○ Pending', color: colors.badges.amber, badgeVariant: 'warning' },
  [INTEGRATION_STATUS.DISCONNECTED]: { label: '✕ Disconnected', color: colors.badges.red, badgeVariant: 'error' },
};

// ─── Utility: Get Status Config ───────────────────────────────────────

/**
 * Generic helper to get status config from a map.
 * Returns fallback if status not found.
 */
export function getStatusConfig(
  configMap: Record<string, StatusConfig>,
  status: string,
  fallback: StatusConfig = { label: status, color: colors.badges.gray, badgeVariant: 'secondary' }
): StatusConfig {
  return configMap[status] || fallback;
}
