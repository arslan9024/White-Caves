import React, { forwardRef } from 'react';
import './Select.css';

const Select = forwardRef(({
  label,
  options = [],
  value,
  onChange,
  onBlur,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  size = 'medium',
  fullWidth = false,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const baseClass = 'wc-select';
  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  const wrapperClasses = [
    `${baseClass}-wrapper`,
    fullWidth && `${baseClass}-wrapper--full-width`,
    className
  ].filter(Boolean).join(' ');

  const selectClasses = [
    baseClass,
    `${baseClass}--${size}`,
    error && `${baseClass}--error`,
    disabled && `${baseClass}--disabled`
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={selectId} className={`${baseClass}__label`}>
          {label}
          {required && <span className={`${baseClass}__required`}>*</span>}
        </label>
      )}
      <div className={`${baseClass}__container`}>
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={selectClasses}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <span className={`${baseClass}__arrow`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      {(error || helperText) && (
        <span className={`${baseClass}__helper ${error ? `${baseClass}__helper--error` : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
