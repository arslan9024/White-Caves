/**
 * Card Component
 * Container component for grouping related content
 */

import React, { ForwardedRef, forwardRef } from 'react';
import { CardProps } from './types';
import { StyledCard, CardHeader, CardBody, CardFooter } from './Card.styles';

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      header,
      footer,
      isClickable = false,
      padding,
      children,
      className = '',
      ...rest
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <StyledCard
        ref={ref}
        $variant={variant}
        $isClickable={isClickable}
        $padding={padding}
        className={className}
        role={isClickable ? 'button' : 'region'}
        tabIndex={isClickable ? 0 : undefined}
        {...rest}
      >
        {header && <CardHeader>{header}</CardHeader>}
        <CardBody>{children}</CardBody>
        {footer && <CardFooter>{footer}</CardFooter>}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';

export default Card;
