/**
 * Tooltip Component Types
 */

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
}
