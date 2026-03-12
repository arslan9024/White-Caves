import React from 'react';
import { StyledFlex } from './Flex.styles';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements */
  children?: React.ReactNode;
  /** Flex direction */
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | string;
  /** Flex wrap */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | string;
  /** Justify content */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | string;
  /** Align items */
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | string;
  /** Gap size token */
  gap?: string;
  /** CSS flex shorthand */
  flex?: string | number;
  /** CSS flex-grow */
  grow?: number;
  /** CSS flex-shrink */
  shrink?: number;
  /** CSS flex-basis */
  basis?: string;
  /** Use inline-flex instead of flex */
  inline?: boolean;
  /** Polymorphic element type */
  as?: React.ElementType;
}

const Flex = React.memo<FlexProps>(({
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
