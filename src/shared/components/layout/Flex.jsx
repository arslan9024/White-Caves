import React from 'react';
import { StyledFlex } from './Flex.styles';

const Flex = React.memo(({
  children,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'flex-start',
  align = 'stretch',
  gap = 'medium',
  flex,
  grow,
  shrink,
  basis,
  inline = false,
  className = '',
  style = {},
  as: Component = 'div',
  ...props
}) => {
  return (
    <StyledFlex
      as={Component}
      $direction={direction}
      $wrap={wrap}
      $justify={justify}
      $align={align}
      $gap={gap}
      $flex={flex}
      $grow={grow}
      $shrink={shrink}
      $basis={basis}
      $inline={inline}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </StyledFlex>
  );
});

Flex.displayName = 'Flex';

export default Flex;
