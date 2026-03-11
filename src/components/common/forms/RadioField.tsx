import React, { forwardRef } from 'react';
import * as S from './RadioField.styles';

interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface RadioFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  options: RadioOption[];
  className?: string;
}

const RadioField = forwardRef<HTMLInputElement, RadioFieldProps>(
  ({
    label,
    value = '',
    onChange,
    error,
    helperText,
    disabled = false,
    required = false,
    options = [],
    className = '',
    ...props
  }, ref) => {
    const isError = !!error;

    return (
      <S.Container className={className}>
        {label && (
          <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
            {label}
            {required && <span style={{ color: '#C62828', marginLeft: '4px' }}>*</span>}
          </label>
        )}
        <S.Group>
          {options.map((option) => (
            <S.Wrapper key={`${option.value}`}>
              <S.HiddenRadio
                ref={option.value === value ? ref : undefined}
                type="radio"
                name={props.name || label}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={disabled || option.disabled}
                aria-required={required}
                aria-invalid={isError}
                {...props}
              />
              <S.RadioCircle
                checked={value === option.value}
                disabled={disabled || option.disabled}
                error={isError}
              />
              <S.Label disabled={disabled || option.disabled}>
                {option.label}
              </S.Label>
            </S.Wrapper>
          ))}
        </S.Group>
        {(helperText || isError) && (
          <S.HelperText error={isError} id={`${props.id}-helper`}>
            {error && typeof error === 'string' ? error : helperText}
          </S.HelperText>
        )}
      </S.Container>
    );
  }
);

RadioField.displayName = 'RadioField';

export default RadioField;
