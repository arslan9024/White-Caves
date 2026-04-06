/**
 * Input Component
 * Text input field with optional icons, labels, and error states
 */

import React, { ForwardedRef, forwardRef, useId, memo } from 'react';
import { InputProps } from './types';
import {
  InputWrapper,
  Label,
  InputContainer,
  StyledInput,
  IconWrapper,
  HelperText,
} from './Input.styles';

export const Input = memo(forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      size = 'md',
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      isRequired = false,
      isFilled = false,
      id: providedId,
      disabled,
      className = '',
      ...rest
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    return (
      <InputWrapper className={className}>
        {label && (
          <Label htmlFor={inputId} $required={isRequired}>
            {label}
          </Label>
        )}

        <InputContainer>
          {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}

          <StyledInput
            ref={ref}
            id={inputId}
            type={type}
            $size={size}
            $hasError={hasError}
            $hasLeftIcon={Boolean(leftIcon)}
            $hasRightIcon={Boolean(rightIcon)}
            disabled={disabled || isFilled}
            aria-invalid={hasError}
            aria-describedby={errorMessage ? `${inputId}-error` : undefined}
            {...rest}
          />

          {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
        </InputContainer>

        {(helperText || errorMessage) && (
          <HelperText id={`${inputId}-error`} $error={hasError}>
            {errorMessage || helperText}
          </HelperText>
        )}
      </InputWrapper>
    );
  }
));

Input.displayName = 'Input';

export default Input;
