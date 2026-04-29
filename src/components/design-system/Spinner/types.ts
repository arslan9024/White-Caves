/**
 * Spinner Component Types
 */

import React from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'primary' | 'secondary' | 'light';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spinner size */
  size?: SpinnerSize;
  /** Color variant */
  variant?: SpinnerVariant;
  /** Spinner label for accessibility */
  label?: string;
}
