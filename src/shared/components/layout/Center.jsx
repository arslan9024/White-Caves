import React from 'react';
import { StyledCenter } from './Center.styles';

const Center = React.memo(({
  children,
  fullHeight = false,
  minHeight,
  inline = false,
  as = 'div',
  className = '',
  ...props
}) => {
  const Component = as;

  return (
    <StyledCenter
      as={Component}
      $fullHeight={fullHeight}
      $minHeight={minHeight}
      $inline={inline}
      className={className}
      {...props}
    >
      {children}
    </StyledCenter>
  );
});

Center.displayName = 'Center';

export default Center;
