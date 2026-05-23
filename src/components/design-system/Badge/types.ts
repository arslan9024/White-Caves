/**
 * Badge Component Types
 */

import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge variant/color */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Badge content */
  children: React.ReactNode;
}
