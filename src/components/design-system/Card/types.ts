/**
 * Card Component Types
 */

import React from 'react';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card style variant */
  variant?: CardVariant;
  /** Optional header content */
  header?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Whether card is clickable/interactive */
  isClickable?: boolean;
  /** Custom padding */
  padding?: string;
  /** Card content/children */
  children: React.ReactNode;
}
