/**
 * Button Component
 * Reusable button component with multiple variants and sizes
 *
 * @example
 * // Basic button
 * <Button>Click me</Button>
 *
 * @example
 * // With variant and size
 * <Button variant="primary" size="lg">Large Button</Button>
 *
 * @example
 * // With icon and loading
 * <Button icon={<PlusIcon />} isLoading={isLoading}>
 *   Add Item
 * </Button>
 */

import React, { ForwardedRef, forwardRef } from 'react';
import { ButtonProps } from './types';
import { StyledButton, IconWrapper, LoadingSpinner } from './Button.styles';

/**
 * Button Component
 * Flexible button component supporting various styles, sizes, and states
 *
 * @param {ButtonProps} props - Component props
 * @param {ButtonSize} [props.size='md'] - Button size variant
 * @param {ButtonVariant} [props.variant='primary'] - Button style variant
 * @param {boolean} [props.isLoading=false] - Loading state
 * @param {boolean} [props.isDisabled=false] - Disabled state
 * @param {boolean} [props.fullWidth=false] - Full width option
 * @param {React.ReactNode} [props.icon] - Optional icon element
 * @param {'left' | 'right'} [props.iconPosition='left'] - Icon position
 * @param {React.ReactNode} props.children - Button content
 * @param {React.Ref} ref - Forwarded ref to button element
 *
 * @returns {React.ReactElement} Button element
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      children,
      className = '',
      'aria-label': ariaLabel,
      onClick,
      disabled,
      ...rest
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    // Combine isDisabled and disabled prop for full compatibility
    const isButtonDisabled = isDisabled || disabled || isLoading;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent click when loading or disabled
      if (isLoading || isButtonDisabled) {
        event.preventDefault();
        return;
      }

      onClick?.(event);
    };

    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        disabled={isButtonDisabled}
        aria-busy={isLoading}
        aria-label={ariaLabel}
        className={className}
        onClick={handleClick}
        {...rest}
      >
        {/* Show loading spinner when loading */}
        {isLoading && <LoadingSpinner aria-hidden="true" />}

        {/* Show icon if provided */}
        {icon && !isLoading && (
          <IconWrapper $position={iconPosition} aria-hidden="true">
            {icon}
          </IconWrapper>
        )}

        {/* Content */}
        <span>{children}</span>
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
