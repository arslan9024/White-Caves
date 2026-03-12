import React from 'react';
import { StyledCenter } from './Center.styles';

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements */
  children?: React.ReactNode;
  /** Whether the center takes full viewport height */
  fullHeight?: boolean;
  /** Minimum height */
  minHeight?: string;
  /** Use inline-flex instead of flex */
  inline?: boolean;
  /** Polymorphic element type */
  as?: React.ElementType;
}

const Center = React.memo<CenterProps>(({
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
