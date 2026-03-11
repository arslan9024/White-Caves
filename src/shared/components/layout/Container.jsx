import React from 'react';
import { StyledContainer } from './Container.styles';

const Container = React.memo(({
  children,
  size = 'default',
  fluid = false,
  paddingX,
  paddingY,
  className = '',
  ...props
}) => {
  return (
    <StyledContainer
      $size={fluid ? 'default' : size}
      $fluid={fluid}
      $paddingX={paddingX}
      $paddingY={paddingY}
      className={className}
      {...props}
    >
      {children}
    </StyledContainer>
  );
});

Container.displayName = 'Container';

export default Container;
