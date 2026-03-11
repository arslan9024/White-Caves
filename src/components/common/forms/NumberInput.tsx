import React, { useState, forwardRef } from 'react';
import * as S from './NumberInput.styles';

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  min?: number;
  max?: number;
  step?: number;
  spinners?: boolean;
  className?: string;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({
    label,
    placeholder = '0',
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
    min,
    max,
    step = 1,
    spinners = false,
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

    const handleIncrement = () => {
      const currentValue = parseFloat(String(value)) || 0;
      const maxValue = max || Infinity;
      const newValue = Math.min(currentValue + step, maxValue);
      onChange({ target: { value: String(newValue) } } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleDecrement = () => {
      const currentValue = parseFloat(String(value)) || 0;
      const minValue = min || -Infinity;
      const newValue = Math.max(currentValue - step, minValue);
      onChange({ target: { value: String(newValue) } } as React.ChangeEvent<HTMLInputElement>);
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
          <S.Input
            ref={ref}
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            min={min}
            max={max}
            step={step}
            size={size}
            aria-label={label || placeholder}
            aria-required={required}
            aria-invalid={isError}
            aria-describedby={helperText || error ? `${props.id}-helper` : undefined}
            {...props}
          />

          {spinners && !disabled && !readOnly && (
            <>
              <S.SpinnerButton onClick={handleIncrement} aria-label="Increment">
                ▲
              </S.SpinnerButton>
              <S.SpinnerButton onClick={handleDecrement} aria-label="Decrement">
                ▼
              </S.SpinnerButton>
            </>
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

NumberInput.displayName = 'NumberInput';

export default NumberInput;
