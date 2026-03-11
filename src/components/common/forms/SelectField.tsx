import React, { forwardRef } from 'react';
import * as S from './SelectField.styles';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  options: Option[];
  className?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({
    label,
    placeholder,
    value = '',
    onChange,
    onBlur,
    onFocus,
    error,
    helperText,
    required = false,
    disabled = false,
    size = 'md',
    options = [],
    className = '',
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      onBlur?.(e);
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
          <S.Select
            ref={ref}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            aria-label={label || 'Select'}
            aria-required={required}
            aria-invalid={isError}
            aria-describedby={helperText || error ? `${props.id}-helper` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(option => (
              <option
                key={`${option.value}`}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </S.Select>

          <S.ChevronIcon aria-hidden="true">▼</S.ChevronIcon>
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

SelectField.displayName = 'SelectField';

export default SelectField;
