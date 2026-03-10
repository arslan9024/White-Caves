/**
 * Button Component Types
 * Type definitions and interfaces for the Button component
 */

import React from 'react';

/**
 * Button size variants
 * - sm: Small button (padding: 4px 16px, font-size: 13px)
 * - md: Medium button - default (padding: 8px 24px, font-size: 14px)
 * - lg: Large button (padding: 12px 32px, font-size: 16px)
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button style variants
 * - primary: Primary action button (red background, white text)
 * - secondary: Secondary action button (blue background)
 * - danger: Destructive action button (dark red, warning style)
 * - outline: Outlined button (border only, no fill)
 * - ghost: Ghost button (transparent, text only)
 * - success: Success action button (green background)
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success';

/**
 * Button component props interface
 * Extends native HTML button attributes for full compatibility
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Style variant - determines color scheme and appearance
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Size variant - determines padding and font size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Whether the button is in a loading state
   * Shows spinner and disables interaction
   * @default false
   */
  isLoading?: boolean;

  /**
   * Whether the button is disabled
   * Prevents interaction and shows disabled styling
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether button should take full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Optional icon element to display in button
   * Can be left or right of text based on iconPosition
   */
  icon?: React.ReactNode;

  /**
   * Position of icon relative to text
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Button content/children
   */
  children: React.ReactNode;

  /**
   * Optional additional CSS class name
   */
  className?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}
