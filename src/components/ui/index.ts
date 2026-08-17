/**
 * Advanced UI Components - Central Export Point
 * ============================================
 * Complete UI component library with all core components,
 * types, and utilities for building professional interfaces.
 */

// Core Components (Package 4)
export { default as Badge } from './Badge';
export { default as Alert } from './Alert';
export { default as Dropdown } from './Dropdown';
export { default as Toast } from './Toast';
export { default as Spinner } from './Spinner';
export { default as EmptyState } from './EmptyState';
export { default as ErrorBoundary } from './ErrorBoundary';

// Form Components
export { FormField } from './FormField';
export type { FormFieldProps } from './FormField';

// Additional Components
export { default as Popover } from './Popover';
export { default as Tooltip } from './Tooltip';
export { default as Tabs } from './Tabs';
export { default as Pagination } from './Pagination';
export { default as ProgressBar } from './ProgressBar';
export { ToastContainer } from './ToastContainer';

// Types - Core Components
export type {
  NotificationType,
  NotificationPosition,
  NotificationConfig,
  NotificationContextType,
  BadgeVariant,
  BadgeSize,
  BadgeShape,
  BadgeProps,
  BadgeConfig,
  AlertType,
  AlertPosition,
  AlertProps,
  AlertConfig,
  DropdownItem,
  DropdownTriggerType,
  DropdownAlignment,
  DropdownProps,
  SpinnerVariant,
  SpinnerSize,
  SpinnerProps,
} from './advancedUI.types';

// Types - Additional Components
export type {
  PopoverPlacement,
  PopoverTrigger,
  PopoverProps,
} from './Popover';

export type {
  TooltipPlacement,
  TooltipTrigger,
  TooltipProps,
} from './Tooltip';

export type {
  TabItem,
  TabsVariant,
  TabsProps,
} from './Tabs';

export type {
  PaginationProps,
} from './Pagination';

export type {
  ProgressVariant,
  ProgressBarProps,
} from './ProgressBar';

// Types - Toast System
export type {
  Toast as ToastData,
  ToastContextType,
  ToastType,
  ToastPosition,
} from '../../context/ToastContext';

// Constants
export {
  NOTIFICATION_DEFAULTS,
  BADGE_VARIANTS,
  ALERT_ICONS,
  TOAST_POSITIONS,
  MODAL_SIZES,
} from './advancedUI.types';

// ==========================================
// Epic 2: "400x Overdrive" UI/UX Variants
// ==========================================
export const OVERDRIVE_VARIANTS = {
  containerStagger: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  },
  slideUpSpring: {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  },
  scalePop: {
    hidden: { scale: 0.95, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
  }
};
