import React from 'react';
import { StyledContainer } from './Container.styles';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Child elements */
  children?: React.ReactNode;
  /** Container size preset */
  size?: 'small' | 'default' | 'large' | 'xlarge';
  /** Whether the container is full-width (fluid) */
  fluid?: boolean;
  /** Horizontal padding override */
  paddingX?: string;
  /** Vertical padding override */
  paddingY?: string;
}

const Container = React.memo<ContainerProps>(({
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
      $size={fluid ? 'default' : (size as 'small' | 'default' | 'large')}
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
