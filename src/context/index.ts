/**
 * Global Context Quartet & Hooks - Central Export Point
 * ====================================================
 * 1. ThemeContext — Light / Dark / System luxury styling
 * 2. LanguageContext — English / Arabic / Spanish / Russian (LTR/RTL)
 * 3. CurrencyContext — AED / USD / EUR / GBP real-time FX
 * 4. UserRoleContext — Global User Profile, Role, Access Level & Sovereign Founder Bypass
 */

// 1. Theme Context
export { ThemeContext, ThemeProvider, useTheme } from './ThemeContext';
export type { ThemeMode, ThemeContextType } from './ThemeContext';

// 2. Language Context
export { LanguageContext, LanguageProvider, useLanguage, LANGUAGES } from './LanguageContext';
export type { LanguageType, LanguageContextType } from './LanguageContext';

// 3. Currency Context
export { CurrencyContext, CurrencyProvider, useGlobalCurrency, SUPPORTED_CURRENCIES } from './CurrencyContext';
export type { CurrencyCode, CurrencyItem, CurrencyContextType } from './CurrencyContext';

// 4. User Role & Auth Context
export { UserRoleContext, UserRoleProvider, useUserRole, ROLE_DEFAULT_LEVELS, ROLE_LABELS } from './UserRoleContext';
export type { UserRole, AccessLevel, UserProfile, UserRoleContextType } from './UserRoleContext';

// Toast Context & Hooks
export { ToastContext, ToastProvider } from './ToastContext';
export type { Toast, ToastContextType, ToastType, ToastPosition } from './ToastContext';

export {
  useToast,
  useSuccessToast,
  useErrorToast,
  useWarningToast,
  useInfoToast,
  useCustomToast,
} from './useToast';
