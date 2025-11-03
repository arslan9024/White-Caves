import React from 'react';
import './FormField.css';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  error,
  touched,
  required = false,
  placeholder,
  onChange,
  onBlur,
  disabled = false,
  className = '',
  ...props
}) => {
  const hasError = touched && error;

  return (
    <div className={`form-field ${hasError ? 'form-field-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="form-input"
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className="form-input"
          {...props}
        >
          {props.children}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="form-input"
          {...props}
        />
      )}
      
      {hasError && (
        <span className="form-error-message">{error}</span>
      )}
    </div>
  );
};

export default FormField;
