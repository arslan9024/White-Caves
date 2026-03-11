import React, { forwardRef } from 'react';
import * as S from './RangeSlider.styles';

interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  unit?: string;
  error?: string | boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  ({
    label,
    value = 50,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    showValue = true,
    unit = '',
    error,
    helperText,
    disabled = false,
    required = false,
    className = '',
    ...props
  }, ref) => {
    const isError = !!error;

    return (
      <S.Container className={className}>
        {label && (
          <S.Label required={required}>
            {label}
            {required && <S.Required>*</S.Required>}
          </S.Label>
        )}

        <S.SliderWrapper>
          <S.Slider
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            disabled={disabled}
            aria-label={label}
            aria-required={required}
            aria-invalid={isError}
            aria-describedby={helperText || error ? `${props.id}-helper` : undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            {...props}
          />

          {showValue && (
            <S.ValueDisplay>
              <span>
                {min} {unit}
              </span>
              <S.CurrentValue>
                {value} {unit}
              </S.CurrentValue>
              <span>
                {max} {unit}
              </span>
            </S.ValueDisplay>
          )}
        </S.SliderWrapper>

        {(helperText || isError) && (
          <S.HelperText error={isError} id={`${props.id}-helper`}>
            {error && typeof error === 'string' ? error : helperText}
          </S.HelperText>
        )}
      </S.Container>
    );
  }
);

RangeSlider.displayName = 'RangeSlider';

export default RangeSlider;
