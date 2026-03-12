import React from 'react';
import { StyledStack } from './Stack.styles';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements */
  children?: React.ReactNode;
  /** Stack direction */
  direction?: 'vertical' | 'horizontal';
  /** Gap size token */
  gap?: string;
  /** Align items */
  align?: string;
  /** Justify content */
  justify?: string;
  /** Whether the stack takes full width */
  fullWidth?: boolean;
  /** Whether the stack takes full height */
  fullHeight?: boolean;
  /** Polymorphic element type */
  as?: React.ElementType;
}

const Stack = React.memo<StackProps>(({
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
