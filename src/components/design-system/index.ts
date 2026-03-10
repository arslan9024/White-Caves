/**
 * Design System Component Library
 * Central export point for all UI components
 *
 * Usage:
 * import { Button, Card, Input } from '@/components/design-system';
 */

// Basic Components
export { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from './Button';
export { Card, type CardProps, type CardVariant } from './Card';
export { Input, type InputProps, type InputSize, type InputType } from './Input';
export { Alert, type AlertProps, type AlertVariant } from './Alert';
export { Badge, type BadgeProps, type BadgeSize, type BadgeVariant } from './Badge';
export { Spinner, type SpinnerProps, type SpinnerSize, type SpinnerVariant } from './Spinner';

// Placeholder exports for components to be implemented
// Uncomment when components are created

// Advanced Components (Phase 2b)
// export { Checkbox, type CheckboxProps } from './Checkbox';
// export { Radio, type RadioProps } from './Radio';
// export { Switch, type SwitchProps } from './Switch';
// export { Select, type SelectProps } from './Select';
// export { Modal, type ModalProps } from './Modal';
// export { Table, type TableProps } from './Table';
// export { Tabs, type TabsProps } from './Tabs';

// Navigation Components (Phase 2c)
export { Avatar, type AvatarProps } from './Avatar';
export { Breadcrumb, type BreadcrumbProps } from './Breadcrumb';
export { Pagination, type PaginationProps } from './Pagination';
// export { Menu, type MenuProps } from './Menu';
export { Tooltip, type TooltipProps } from './Tooltip';
export { Tag, type TagProps } from './Tag';
