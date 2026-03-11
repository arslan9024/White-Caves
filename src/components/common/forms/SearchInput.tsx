import React, { useState, forwardRef } from 'react';
import * as S from './SearchInput.styles';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  clearable?: boolean;
  className?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    label,
    placeholder = 'Search...',
    value = '',
    onChange,
    onBlur,
    onFocus,
    onSearch,
    onClear,
    error,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    size = 'md',
    clearable = true,
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

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(value);
      }
    };

    const handleClear = () => {
      onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      onClear?.();
    };

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
          <S.SearchIcon aria-hidden="true">🔍</S.SearchIcon>

          <S.Input
            ref={ref}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            readOnly={readOnly}
            size={size}
            aria-label={label || 'Search'}
            aria-required={required}
            aria-invalid={isError}
            aria-describedby={helperText || error ? `${props.id}-helper` : undefined}
            {...props}
          />

          {clearable && value && !disabled && (
            <S.ClearButton
              onClick={handleClear}
              aria-label="Clear search"
            >
              ✕
            </S.ClearButton>
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

SearchInput.displayName = 'SearchInput';

export default SearchInput;
