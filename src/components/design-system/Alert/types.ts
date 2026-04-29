/**
 * Alert Component Types
 */

import React from 'react';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alert type/variant */
  variant?: AlertVariant;
  /** Alert title */
  title?: string;
  /** Alert content/message */
  message?: React.ReactNode;
  /** Alert icon */
  icon?: React.ReactNode;
  /** Action button */
  action?: React.ReactNode;
  /** Whether alert is dismissible */
  isDismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Alert content */
  children?: React.ReactNode;
}
