import React from 'react';
import { StyledSpacer } from './Spacer.styles';

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which axis to apply spacing on */
  axis?: 'horizontal' | 'vertical' | 'both';
  /** Spacing size token */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
  /** Custom size value (overrides size token) */
  customSize?: string;
  /** Whether the spacer is flexible (uses flex-grow) */
  flexible?: boolean;
}

const Spacer = React.memo<SpacerProps>(({
  axis = 'both',
  size = 'md',
  customSize,
  flexible = false,
  className = '',
  ...props
}) => {
  return (
    <StyledSpacer
      $axis={axis}
      $size={size}
      $customSize={customSize}
      $flexible={flexible}
      className={className}
      {...props}
    />
  );
});

Spacer.displayName = 'Spacer';

export default Spacer;
