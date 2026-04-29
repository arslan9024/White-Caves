/**
 * Advanced UI Components - Type Definitions
 * =========================================
 * Complete type system for professional UI components including
 * Notifications, Badges, Alerts, Dropdowns, and Toast messages
 */

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface NotificationConfig {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // milliseconds (0 = persistent)
  position?: NotificationPosition;
  action?: {
    label: string;
    callback: () => void;
  };
  icon?: string; // Icon name from lucide-react
  dismissible?: boolean;
  closable?: boolean;
  timestamp: string;
}

export interface NotificationContextType {
  notifications: NotificationConfig[];
  addNotification: (config: Omit<NotificationConfig, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: (type?: NotificationType) => void;
  updateNotification: (id: string, config: Partial<NotificationConfig>) => void;
}

// ============================================================================
// BADGE COMPONENT
// ============================================================================

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'small' | 'medium' | 'large';
export type BadgeShape = 'rounded' | 'pill' | 'square';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  children: React.ReactNode;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  count?: number; // For badge counter display
  dotOnly?: boolean; // Show as dot indicator
  pulse?: boolean; // Animated pulse effect
  tooltip?: string;
}

export interface BadgeConfig {
  variant: BadgeVariant;
  size: BadgeSize;
  shape: BadgeShape;
  colors: {
    background: string;
    text: string;
    border: string;
  };
  padding: string;
  fontSize: string;
  borderRadius: string;
}

// ============================================================================
// ALERT COMPONENT
// ============================================================================

export type AlertType = 'info' | 'success' | 'warning' | 'error';
export type AlertPosition = 'top' | 'inline';

export interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  description?: string;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }[];
  className?: string;
  position?: AlertPosition;
  filled?: boolean; // Filled vs outlined style
}

export interface AlertConfig {
  type: AlertType;
  colors: {
    background: string;
    border: string;
    text: string;
    icon: string;
  };
  icon: React.ReactNode;
}

// ============================================================================
// DROPDOWN COMPONENT
// ============================================================================

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  divider?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  submenu?: DropdownItem[];
  badge?: {
    label: string;
    variant?: BadgeVariant;
  };
}

export type DropdownTriggerType = 'click' | 'hover';
export type DropdownAlignment = 'left' | 'center' | 'right';

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  triggerType?: DropdownTriggerType;
  alignment?: DropdownAlignment;
  maxHeight?: number; // pixels
  width?: number; // pixels
  className?: string;
  onItemSelect?: (item: DropdownItem) => void;
  onOpenChange?: (isOpen: boolean) => void;
  searchable?: boolean;
  filterable?: boolean;
  closeOnSelect?: boolean;
}

// ============================================================================
// TOAST NOTIFICATION
// ============================================================================

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToastConfig {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number; // milliseconds (0 = persistent)
  position?: ToastPosition;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  onClose?: () => void;
  timestamp: string;
}

export interface ToastContextType {
  toasts: ToastConfig[];
  addToast: (config: Omit<ToastConfig, 'id' | 'timestamp'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  addSuccess: (message: string, options?: Partial<ToastConfig>) => string;
  addError: (message: string, options?: Partial<ToastConfig>) => string;
  addWarning: (message: string, options?: Partial<ToastConfig>) => string;
  addInfo: (message: string, options?: Partial<ToastConfig>) => string;
}

// ============================================================================
// POPOVER COMPONENT
// ============================================================================

export type PopoverPlacement = 'top' | 'right' | 'bottom' | 'left' | 'auto';
export type PopoverTrigger = 'click' | 'hover' | 'focus';

export interface PopoverProps {
  content: React.ReactNode | string;
  children: React.ReactNode;
  placement?: PopoverPlacement;
  trigger?: PopoverTrigger;
  title?: string;
  closable?: boolean;
  maxWidth?: number;
  className?: string;
  onOpenChange?: (isOpen: boolean) => void;
  delay?: {
    open?: number;
    close?: number;
  };
}

// ============================================================================
// TOOLTIP COMPONENT
// ============================================================================

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';
export type TooltipTrigger = 'hover' | 'focus';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger;
  delay?: number;
  theme?: 'dark' | 'light';
  className?: string;
}

// ============================================================================
// MODAL/DIALOG OVERLAY
// ============================================================================

export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  centered?: boolean;
  closeButton?: boolean;
  backdrop?: boolean;
  onBackdropClick?: () => void;
  className?: string;
  footer?: React.ReactNode;
}

// ============================================================================
// PROGRESS COMPONENT
// ============================================================================

export type ProgressVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface ProgressProps {
  value: number; // 0-100
  variant?: ProgressVariant;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  striped?: boolean;
  animated?: boolean;
  className?: string;
  label?: string;
}

// ============================================================================
// SKELETON LOADER
// ============================================================================

export type SkeletonVariant = 'text' | 'circle' | 'rectangle' | 'card';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
  height?: number;
  width?: number | string;
  circle?: boolean;
  className?: string;
  animated?: boolean;
}

// ============================================================================
// TABS COMPONENT
// ============================================================================

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

export type TabsVariant = 'default' | 'pills' | 'underline';

export interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  variant?: TabsVariant;
  onChange?: (activeId: string) => void;
  className?: string;
}

// ============================================================================
// PAGINATION COMPONENT
// ============================================================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  showFirstLastButtons?: boolean;
  showPageJumper?: boolean;
  maxPages?: number; // Max page numbers to show
  className?: string;
}

// ============================================================================
// SPINNER/LOADING COMPONENT
// ============================================================================

export type SpinnerVariant = 'default' | 'dots' | 'bounce' | 'pulse';
export type SpinnerSize = 'small' | 'medium' | 'large';

export interface SpinnerProps {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  color?: string;
  label?: string;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const NOTIFICATION_DEFAULTS = {
  duration: 5000,
  position: 'top-right' as NotificationPosition,
  dismissible: true,
};

export const BADGE_VARIANTS: Record<BadgeVariant, BadgeConfig> = {
  primary: {
    variant: 'primary',
    size: 'medium',
    shape: 'rounded',
    colors: { background: '#0066cc', text: '#ffffff', border: '#0052a3' },
    padding: '4px 12px',
    fontSize: '12px',
    borderRadius: '4px',
  },
  secondary: {
    variant: 'secondary',
    size: 'medium',
    shape: 'rounded',
    colors: { background: '#e0e0e0', text: '#333333', border: '#b3b3b3' },
    padding: '4px 12px',
    fontSize: '12px',
    borderRadius: '4px',
  },
  success: {
    variant: 'success',
    size: 'medium',
    shape: 'rounded',
    colors: { background: '#4caf50', text: '#ffffff', border: '#388e3c' },
    padding: '4px 12px',
    fontSize: '12px',
    borderRadius: '4px',
  },
  warning: {
    variant: 'warning',
    size: 'medium',
    shape: 'rounded',
    colors: { background: '#ff9800', text: '#ffffff', border: '#f57c00' },
    padding: '4px 12px',
    fontSize: '12px',
    borderRadius: '4px',
  },
  error: {
    variant: 'error',
    size: 'medium',
    shape: 'rounded',
    colors: { background: '#f44336', text: '#ffffff', border: '#d32f2f' },
    padding: '4px 12px',
    fontSize: '12px',
    borderRadius: '4px',
  },
  info: {
    variant: 'info',
    size: 'medium',
    shape: 'rounded',
    colors: { background: '#2196f3', text: '#ffffff', border: '#1565c0' },
    padding: '4px 12px',
    fontSize: '12px',
    borderRadius: '4px',
  },
};

export const ALERT_ICONS: Record<AlertType, string> = {
  info: 'Info',
  success: 'CheckCircle',
  warning: 'AlertCircle',
  error: 'X',
};

export const TOAST_POSITIONS: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

export const MODAL_SIZES: Record<ModalSize, string> = {
  small: '400px',
  medium: '600px',
  large: '800px',
  fullscreen: '100%',
};
