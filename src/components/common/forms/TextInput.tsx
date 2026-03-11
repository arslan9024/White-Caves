import React, { useState, forwardRef } from 'react';
import * as S from './TextInput.styles';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
  maxLength?: number;
  showCount?: boolean;
  clearable?: boolean;
  className?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({
    label,
    placeholder = '',
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
    maxLength,
    showCount = false,
    clearable = false,
    className = '',
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleClear = () => {
      onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    };

    const charCount = value?.length || 0;
    const isError = !!error;

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
          disabled={disabled}
        >
          <S.Input
            ref={ref}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            size={size}
            aria-label={label || placeholder}
            aria-required={required}
            aria-invalid={isError}
            aria-describedby={helperText || error ? `${props.id}-helper` : undefined}
            {...props}
          />

          {showCount && maxLength && (
            <S.CharCount>
              {charCount}/{maxLength}
            </S.CharCount>
          )}

          {clearable && charCount > 0 && !disabled && (
            <button
              onClick={handleClear}
              aria-label="Clear input"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginLeft: '8px',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              ✕
            </button>
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

TextInput.displayName = 'TextInput';

export default TextInput;
