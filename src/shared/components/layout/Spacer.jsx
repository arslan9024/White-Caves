import React from 'react';
import { StyledSpacer } from './Spacer.styles';

const Spacer = React.memo(({
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
