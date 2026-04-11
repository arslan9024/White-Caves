/**
 * Hooks — Central Barrel Export
 * ==============================
 * Single import point for all custom React hooks.
 *
 * Usage:
 *   import { useFormValidation, useMediaQuery, useDocumentTitle } from '@/hooks';
 */

// ── Core Hooks (named exports) ───────────────────────────────────────
export { useDebouncedValue } from './useDebouncedValue';
export { useFormValidation } from './useFormValidation';
export type { UseFormValidation } from './useFormValidation';
export {
  usePermissions,
  useCanAccess,
  useIsOwner,
  useIsAgent,
  PERMISSIONS,
  ROLES,
} from './usePermissions';
export { usePropertyBrowser } from './usePropertyBrowser';
export {
  useSignIn,
  USER_CATEGORIES,
  CLIENT_ROLES,
  STAFF_ROLES,
} from './useSignIn';
export type { UserRole } from './useSignIn';
export { useUnifiedDashboard } from './useUnifiedDashboard';
export type { DashboardData, CRMModuleProps } from './useUnifiedDashboard';
export { useUserProfile } from './useUserProfile';
export { useWhatsAppSettings } from './useWhatsAppSettings';

// ── Core Hooks (default exports) ─────────────────────────────────────
export { default as useActionHandler } from './useActionHandler';
export { default as useDocumentTitle } from './useDocumentTitle';
export { default as useFocusTrap } from './useFocusTrap';
export { default as useIntersectionObserver } from './useIntersectionObserver';
export { default as useMediaQuery } from './useMediaQuery';
export { default as usePrefetch } from './usePrefetch';
export { default as usePublicFavorites } from './usePublicFavorites';
export { default as useResizableSidebar } from './useResizableSidebar';

// ── CRM Domain Hooks ─────────────────────────────────────────────────
export { useAgentPerformance } from './crm/useAgentPerformance';
export type { TeamStats } from './crm/useAgentPerformance';
export { useCRMHubData } from './crm/useCRMHubData';
