/**
 * Advanced UI Components - Central Export Point
 * ============================================
 * Complete UI component library with all core components,
 * types, and utilities for building professional interfaces.
 *
 * NOTE: Spinner and Tooltip are now canonical in design-system/
 * and re-exported here for backward compatibility.
 */

// Core Components (Package 4)
export { default as Badge } from './Badge';
export { default as Alert } from './Alert';
export { default as Dropdown } from './Dropdown';
export { default as Toast } from './Toast';

// Re-export from design-system (canonical source — duplicates removed)
export { Spinner } from '../design-system';
export { Tooltip } from '../design-system';

// Form Components
export { FormField } from './FormField';
export type { FormFieldProps } from './FormField';

// Additional Components
export { default as Popover } from './Popover';
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
} from './advancedUI.types';

// Spinner & Tooltip types from design-system (canonical)
export type { SpinnerProps, SpinnerSize, SpinnerVariant } from '../design-system';
export type { TooltipProps } from '../design-system';

// Types - Additional Components
export type {
  PopoverPlacement,
  PopoverTrigger,
  PopoverProps,
} from './Popover';

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
