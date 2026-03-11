import React, { forwardRef } from 'react';
import * as S from './CheckboxField.styles';

interface CheckboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  options?: CheckboxOption[];
  className?: string;
}

const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({
    label,
    checked = false,
    onChange,
    error,
    helperText,
    disabled = false,
    required = false,
    options,
    className = '',
    ...props
  }, ref) => {
    const isError = !!error;

    // Single checkbox mode
    if (!options) {
      return (
        <S.Container className={className}>
          <S.Wrapper>
            <S.HiddenCheckbox
              ref={ref}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              aria-required={required}
              aria-invalid={isError}
              aria-describedby={`${props.id}-helper`}
              {...props}
            />
            <S.CheckboxBox checked={checked} disabled={disabled} error={isError} />
            {label && (
              <S.Label disabled={disabled}>
                {label}
                {required && <span style={{ color: '#C62828' }}>*</span>}
              </S.Label>
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

    // Group mode
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
              <S.HiddenCheckbox
                type="checkbox"
                value={option.value}
                onChange={onChange}
                disabled={disabled || option.disabled}
                aria-required={required}
                aria-invalid={isError}
                {...props}
              />
              <S.CheckboxBox
                checked={Array.isArray(props.value) && props.value.includes(option.value)}
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

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;
