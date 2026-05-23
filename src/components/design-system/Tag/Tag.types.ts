/**
 * Tag Component Types
 */

export type TagVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type TagSize = 'sm' | 'md';

export interface TagProps {
  label: string;
  removable?: boolean;
  onRemove?: () => void;
  variant?: TagVariant;
  size?: TagSize;
  className?: string;
}
