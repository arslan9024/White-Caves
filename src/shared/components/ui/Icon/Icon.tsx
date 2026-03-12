import React from 'react';
import * as LucideIcons from 'lucide-react';
import './Icon.css';

export interface IconProps {
  /** Lucide icon name (PascalCase, e.g. "Home", "Settings", "ChevronDown") */
  name: string;
  /** Icon size in pixels */
  size?: number;
  /** Icon color */
  color?: string;
  /** SVG stroke width */
  strokeWidth?: number;
  /** Additional CSS class */
  className?: string;
}

/** Type-safe lookup map for Lucide icons */
type LucideIconMap = Record<string, React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}>>;

const Icon = React.memo<IconProps>(({
  name,
  size = 24,
  color,
  strokeWidth = 2,
  className = '',
  ...props
}) => {
  const IconComponent = (LucideIcons as unknown as LucideIconMap)[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={`wc-icon ${className}`}
      {...props}
    />
  );
});

Icon.displayName = 'Icon';

export default Icon;
