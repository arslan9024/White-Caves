import React, { useState, forwardRef } from 'react';
import * as S from './EmailInput.styles';

interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValidation?: boolean;
  className?: string;
}

const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({
    label,
    placeholder = 'user@example.com',
    value = '',
    onChange,
    onBlur,
    onFocus,
    error,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    size = 'md',
    showValidation = true,
    className = '',
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = value && emailRegex.test(value);
    const isError = !!error;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <S.Container className={className}>
        {label && (
          <S.Label required={required}>
            {label}
            {required && <S.Required>*</S.Required>}
          </S.Label>
        )}

        <S.Wrapper
          size={size}
          focused={isFocused}
          error={isError}
          success={showValidation && isValidEmail && !isError}
          disabled={disabled}
        >
          <S.Input
            ref={ref}
            type="email"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            size={size}
            aria-label={label || 'Email'}
            aria-required={required}
            aria-invalid={isError}
            aria-describedby={helperText || error ? `${props.id}-helper` : undefined}
            {...props}
          />

          {showValidation && value && (
            <S.ValidationIcon role="img" aria-label={isValidEmail ? 'Valid email' : 'Invalid email'}>
              {isValidEmail ? '✓' : '✕'}
            </S.ValidationIcon>
          )}
        </S.Wrapper>

        {(helperText || isError) && (
          <S.HelperText error={isError} id={`${props.id}-helper`}>
            {error && typeof error === 'string' ? error : helperText}
          </S.HelperText>
        )}
      </S.Container>
    );
  }
);

EmailInput.displayName = 'EmailInput';

export default EmailInput;
