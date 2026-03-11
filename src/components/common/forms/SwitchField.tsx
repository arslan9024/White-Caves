import React, { forwardRef } from 'react';
import * as S from './SwitchField.styles';

interface SwitchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

const SwitchField = forwardRef<HTMLInputElement, SwitchFieldProps>(
  ({
    label,
    checked = false,
    onChange,
    helperText,
    disabled = false,
    className = '',
    ...props
  }, ref) => {
    return (
      <S.Container className={className}>
        <S.Wrapper>
          <S.HiddenCheckbox
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            aria-label={label}
            {...props}
          />
          <S.Switch checked={checked} disabled={disabled} />
          {label && (
            <S.Label disabled={disabled}>
              {label}
            </S.Label>
          )}
        </S.Wrapper>
        {helperText && (
          <S.HelperText>
            {helperText}
          </S.HelperText>
        )}
      </S.Container>
    );
  }
);

SwitchField.displayName = 'SwitchField';

export default SwitchField;
