import React from 'react';
import * as LucideIcons from 'lucide-react';
import './Icon.css';

const Icon = React.memo(({
  name,
  size = 24,
  color,
  strokeWidth = 2,
  className = '',
  ...props
}) => {
  const IconComponent = LucideIcons[name];
  
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
