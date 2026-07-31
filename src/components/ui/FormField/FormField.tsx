/**
 * FormField — Theme-aware form input with label, error display, and password strength
 *
 * Uses design tokens from theme for consistent styling.
 * Follows White Caves UI patterns: FC + memo, transient styled props.
 */

import React, { FC, memo, useState, useId } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import type { PasswordStrength } from '@/utils/validation';
import { spacing } from '../../../styles/theme/spacing';

/* ═══════════════════════════════ Types ════════════════════════════ */

export interface FormFieldProps {
  /** Field name — must match schema key */
  name: string;
  /** Label text */
  label?: string;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'textarea' | 'select';
  /** The placeholder text for the input */
  placeholder?: string;
  /** Current value */
  value: string | number;
  /** Error message (from useFormValidation) */
  error?: string;
  /** Whether field has been touched (for showing errors) */
  touched?: boolean;
  /** Change handler (from useFormValidation) */
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  /** Blur handler (from useFormValidation) */
  onBlur: (e: { target: { name: string } }) => void;
  /** Is this field required? (shows indicator) */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Password strength result (for password fields) */
  passwordStrength?: { strength: PasswordStrength; score: number; feedback: string[] };
  /** Select options */
  options?: { value: string; label: string }[];
  /** Max length (shows counter) */
  maxLength?: number;
  /** Auto-focus */
  autoFocus?: boolean;
  /** Extra class name */
  className?: string;
  /** Hint text below input */
  hint?: string;
}

/* ═══════════════════════════════ Animations ═══════════════════════ */

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
`;

/* ═══════════════════════════════ Styled ═══════════════════════════ */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  width: 100%;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-family: ${p => p.theme.typography?.fontFamily?.primary || '"Inter", sans-serif'};
  font-size: ${p => p.theme.typography?.sizes?.sm || '14px'};
  font-weight: ${p => p.theme.typography?.weights?.medium || 500};
  color: ${p => p.theme.colors?.text?.primary || '#1a1a1a'};
  line-height: 1.4;
`;

const RequiredStar = styled.span`
  color: ${p => p.theme.colors?.error || '#B71C1C'};
  margin-left: 2px;
`;

const CharCount = styled.span<{ $over: boolean }>`
  font-size: 12px;
  color: ${p =>
    p.$over ? p.theme.colors?.error || '#B71C1C' : p.theme.colors?.text?.tertiary || '#999'};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const inputBaseStyles = css<{ $hasError: boolean; $isValid: boolean }>`
  width: 100%;
  padding: ${p => p.theme.spacing?.sm || '8px'} ${p => p.theme.spacing?.md || '16px'};
  font-family: ${p => p.theme.typography?.fontFamily?.primary || '"Inter", sans-serif'};
  font-size: ${p => p.theme.typography?.sizes?.base || '16px'};
  color: ${p => p.theme.colors?.text?.primary || '#1a1a1a'};
  background: ${p => p.theme.colors?.background?.primary || '#fff'};
  border: 1.5px solid
    ${p =>
      p.$hasError
        ? p.theme.colors?.error || '#B71C1C'
        : p.$isValid
          ? p.theme.colors?.success || '#2E7D32'
          : p.theme.colors?.border || '#d0d0d0'};
  border-radius: ${p => p.theme.radius?.input || '6px'};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  outline: none;

  &::placeholder {
    color: ${p => p.theme.colors?.text?.disabled || '#bbb'};
  }

  &:focus {
    border-color: ${p =>
      p.$hasError ? p.theme.colors?.error || '#EF4444' : p.theme.colors?.primary || '#C9A84C'};
    box-shadow: 0 0 0 3px
      ${p => (p.$hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(201, 168, 76, 0.2)')};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    background: ${p => p.theme.colors?.background?.secondary || '#f5f5f5'};
  }

  ${p =>
    p.$hasError &&
    css`
      animation: ${shake} 0.3s ease;
    `}
`;

const StyledInput = styled.input<{ $hasError: boolean; $isValid: boolean }>`
  ${inputBaseStyles}
`;

const StyledTextarea = styled.textarea<{ $hasError: boolean; $isValid: boolean }>`
  ${inputBaseStyles}
  min-height: 100px;
  resize: vertical;
`;

const StyledSelect = styled.select<{ $hasError: boolean; $isValid: boolean }>`
  ${inputBaseStyles}
  cursor: pointer;
`;

const TogglePasswordBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${p => p.theme.colors?.text?.tertiary || '#999'};
  padding: ${spacing.xs};
  display: flex;
  align-items: center;

  &:hover {
    color: ${p => p.theme.colors?.text?.primary || '#1a1a1a'};
  }
`;

const ErrorRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${p => p.theme.colors?.error || '#B71C1C'};
  font-size: 13px;
  min-height: 20px;
`;

const HintText = styled.span`
  font-size: 12px;
  color: ${p => p.theme.colors?.text?.tertiary || '#999'};
`;

const ValidIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${p => p.theme.colors?.success || '#2E7D32'};
  display: flex;
  align-items: center;
`;

/* ── Password Strength Meter ── */

const StrengthBar = styled.div`
  display: flex;
  gap: ${spacing.xs};
  margin-top: 4px;
`;

const StrengthSegment = styled.div<{ $active: boolean; $color: string }>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${p => (p.$active ? p.$color : p.theme.colors?.border || '#e0e0e0')};
  transition: background 0.3s ease;
`;

const StrengthLabel = styled.span<{ $color: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${p => p.$color};
  margin-top: 2px;
`;

/* ═══════════════════════════════ Helpers ══════════════════════════ */

const STRENGTH_CONFIG: Record<
  PasswordStrength,
  { color: string; segments: number; label: string }
> = {
  weak: { color: '#B71C1C', segments: 1, label: 'Weak' },
  fair: { color: '#E65100', segments: 2, label: 'Fair' },
  good: { color: '#F9A825', segments: 3, label: 'Good' },
  strong: { color: '#2E7D32', segments: 4, label: 'Strong' },
};

/* ═══════════════════════════════ Component ════════════════════════ */

const FormField: FC<FormFieldProps> = memo(function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  touched = false,
  onChange,
  onBlur,
  required: isRequired = false,
  disabled = false,
  passwordStrength,
  options,
  maxLength,
  autoFocus = false,
  className,
  hint,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const autoId = useId();
  const inputId = `field-${name}-${autoId}`;
  const errorId = `error-${name}-${autoId}`;

  const showError = touched && !!error;
  const isValid = touched && !error && String(value).length > 0;
  const currentLength = String(value).length;
  const isPasswordField = type === 'password';

  /* ── Render Input ── */
  const renderInput = () => {
    const commonProps = {
      id: inputId,
      name,
      value: value ?? '',
      onChange,
      onBlur,
      placeholder,
      disabled,
      autoFocus,
      $hasError: showError,
      $isValid: isValid,
      'aria-invalid': showError || undefined,
      'aria-describedby': showError ? errorId : undefined,
      'aria-required': isRequired || undefined,
    };

    if (type === 'textarea') {
      return <StyledTextarea {...commonProps} maxLength={maxLength} />;
    }

    if (type === 'select') {
      return (
        <StyledSelect {...commonProps}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </StyledSelect>
      );
    }

    return (
      <StyledInput
        {...commonProps}
        type={isPasswordField && showPassword ? 'text' : type}
        maxLength={maxLength}
      />
    );
  };

  /* ── Render ── */
  return (
    <Wrapper className={className}>
      {(label || maxLength) && (
        <LabelRow>
          {label && (
            <Label htmlFor={inputId}>
              {label}
              {isRequired && <RequiredStar aria-hidden="true">*</RequiredStar>}
            </Label>
          )}
          {maxLength && (
            <CharCount $over={currentLength > maxLength}>
              {currentLength}/{maxLength}
            </CharCount>
          )}
        </LabelRow>
      )}

      <InputWrapper>
        {renderInput()}
        {isPasswordField && (
          <TogglePasswordBtn
            type="button"
            onClick={() => setShowPassword(s => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </TogglePasswordBtn>
        )}
        {isValid && !isPasswordField && type !== 'textarea' && type !== 'select' && (
          <ValidIcon>
            <CheckCircle size={18} />
          </ValidIcon>
        )}
      </InputWrapper>

      {/* Password Strength Meter */}
      {isPasswordField && passwordStrength && String(value).length > 0 && (
        <>
          <StrengthBar
            role="progressbar"
            aria-valuenow={passwordStrength.score}
            aria-valuemin={0}
            aria-valuemax={4}
          >
            {[1, 2, 3, 4].map(seg => (
              <StrengthSegment
                key={seg}
                $active={seg <= STRENGTH_CONFIG[passwordStrength.strength].segments}
                $color={STRENGTH_CONFIG[passwordStrength.strength].color}
              />
            ))}
          </StrengthBar>
          <StrengthLabel $color={STRENGTH_CONFIG[passwordStrength.strength].color}>
            {STRENGTH_CONFIG[passwordStrength.strength].label}
          </StrengthLabel>
        </>
      )}

      {/* Error / Hint */}
      <ErrorRow role={showError ? 'alert' : undefined}>
        {showError ? (
          <>
            <AlertCircle size={14} />
            <span id={errorId}>{error}</span>
          </>
        ) : hint ? (
          <HintText>{hint}</HintText>
        ) : null}
      </ErrorRow>
    </Wrapper>
  );
});

export default FormField;
