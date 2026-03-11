import React from 'react';
import { StyledStack } from './Stack.styles';

const Stack = React.memo(({
  children,
  direction = 'vertical',
  gap = 'medium',
  align,
  justify,
  fullWidth = true,
  fullHeight = false,
  as = 'div',
  className = '',
  ...props
}) => {
  const Component = as;

  return (
    <StyledStack
      as={Component}
      $direction={direction}
      $gap={gap}
      $align={align}
      $justify={justify}
      $fullWidth={fullWidth}
      $fullHeight={fullHeight}
      className={className}
      {...props}
    >
      {children}
    </StyledStack>
  );
});

Stack.displayName = 'Stack';

export default Stack;
