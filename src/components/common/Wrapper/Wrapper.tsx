import React from 'react';
import { StyledWrapper } from './Wrapper.styles';

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: string;
  margin?: string;
  background?: string;
  border?: string;
  radius?: string;
  shadow?: boolean;
  fullWidth?: boolean;
  display?: string;
  as?: React.ElementType;
}

export const Wrapper = React.memo(({
  children,
  padding = '1rem',
  margin,
  background,
  border,
  radius = '0.5rem',
  shadow = false,
  fullWidth = true,
  display,
  as = 'div',
  className = '',
  ...props
}: WrapperProps) => {
  const Component = as as React.ElementType;

  return (
    <StyledWrapper
      as={Component}
      $padding={padding}
      $margin={margin}
      $background={background}
      $border={border}
      $radius={radius}
      $shadow={shadow}
      $fullWidth={fullWidth}
      $display={display}
      className={className}
      {...props}
    >
      {children}
    </StyledWrapper>
  );
});

Wrapper.displayName = 'Wrapper';

export default Wrapper;
