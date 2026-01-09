import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, X, AlertCircle, Check } from 'lucide-react';
import './Input.css';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  size = 'md',
  icon = null,
  iconPosition = 'left',
  clearable = false,
  maxLength,
  showCount = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const handleClear = () => {
    onChange?.({ target: { value: '' } });
  };
  
  const wrapperClasses = [
    'wc-input-wrapper',
    `wc-input-wrapper--${size}`,
    isFocused && 'wc-input-wrapper--focused',
    error && 'wc-input-wrapper--error',
    success && 'wc-input-wrapper--success',
    disabled && 'wc-input-wrapper--disabled',
    icon && iconPosition === 'left' && 'wc-input-wrapper--icon-left',
    icon && iconPosition === 'right' && 'wc-input-wrapper--icon-right',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="wc-input-container">
      {label && (
        <label className="wc-input-label">
          {label}
          {required && <span className="wc-input-required">*</span>}
        </label>
      )}
      
      <div className={wrapperClasses}>
        {icon && iconPosition === 'left' && (
          <span className="wc-input-icon wc-input-icon--left">{icon}</span>
        )}
        
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          className="wc-input"
          {...props}
        />
        
        <div className="wc-input-actions">
          {clearable && value && !disabled && (
            <button type="button" className="wc-input-action" onClick={handleClear}>
              <X size={16} />
            </button>
          )}
          
          {isPassword && (
            <button 
              type="button" 
              className="wc-input-action"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          
          {error && <AlertCircle size={16} className="wc-input-status-icon wc-input-status-icon--error" />}
          {success && !error && <Check size={16} className="wc-input-status-icon wc-input-status-icon--success" />}
        </div>
        
        {icon && iconPosition === 'right' && !clearable && !isPassword && (
          <span className="wc-input-icon wc-input-icon--right">{icon}</span>
        )}
      </div>
      
      <div className="wc-input-footer">
        {(error || helperText) && (
          <span className={`wc-input-helper ${error ? 'wc-input-helper--error' : ''}`}>
            {error || helperText}
          </span>
        )}
        
        {showCount && maxLength && (
          <span className="wc-input-count">
            {(value?.length || 0)}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
