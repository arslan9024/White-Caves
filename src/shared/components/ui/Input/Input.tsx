import React, { forwardRef, useId } from 'react';
import './Input.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text above the input */
  label?: string;
  /** Input type */
  type?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Controlled value */
  value?: string | number | readonly string[];
  /** Change handler */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Blur handler */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Error message (also sets error styling) */
  error?: string;
  /** Helper text below the input */
  helperText?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is required */
  required?: boolean;
  /** Icon element */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Input size */
  size?: 'small' | 'medium' | 'large';
  /** Whether the input takes full width */
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  size = 'medium',
  fullWidth = false,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const baseClass = 'wc-input';
  const generatedId = useId();
  const inputId = id || name || `${generatedId}-input`;

  const wrapperClasses = [
    `${baseClass}-wrapper`,
    fullWidth && `${baseClass}-wrapper--full-width`,
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    baseClass,
    `${baseClass}--${size}`,
    error && `${baseClass}--error`,
    disabled && `${baseClass}--disabled`,
    icon && `${baseClass}--with-icon`,
    icon && `${baseClass}--icon-${iconPosition}`
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className={`${baseClass}__label`}>
          {label}
          {required && <span className={`${baseClass}__required`}>*</span>}
        </label>
      )}
      <div className={`${baseClass}__container`}>
        {icon && iconPosition === 'left' && (
          <span className={`${baseClass}__icon ${baseClass}__icon--left`}>{icon}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className={`${baseClass}__icon ${baseClass}__icon--right`}>{icon}</span>
        )}
      </div>
      {(error || helperText) && (
        <span
          id={`${inputId}-helper`}
          className={`${baseClass}__helper ${error ? `${baseClass}__helper--error` : ''}`}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
