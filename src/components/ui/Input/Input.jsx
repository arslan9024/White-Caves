import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, X, AlertCircle, Check } from 'lucide-react';
import * as S from './Input.styles';

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
    'corner-sm',
    'transition-smooth',
    className
  ].filter(Boolean).join(' ');

  return (
    <S.Container className={className}>
      {label && (
        <S.Label>
          {label}
          {required && <S.Required>*</S.Required>}
        </S.Label>
      )}
      
      <S.Wrapper
        size={size}
        focused={isFocused}
        error={!!error}
        success={!!success}
        disabled={disabled}
        iconLeft={icon && iconPosition === 'left'}
        iconRight={icon && iconPosition === 'right'}
      >
        {icon && iconPosition === 'left' && (
          <S.Icon position="left">{icon}</S.Icon>
        )}
        
        <S.Input
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
          {...props}
        />
        
        <S.Actions>
          {clearable && value && !disabled && (
            <S.Action type="button" onClick={handleClear}>
              <X size={16} />
            </S.Action>
          )}
          
          {isPassword && (
            <S.Action 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </S.Action>
          )}
          
          {error && <S.StatusIcon type="error"><AlertCircle size={16} /></S.StatusIcon>}
          {success && !error && <S.StatusIcon type="success"><Check size={16} /></S.StatusIcon>}
        </S.Actions>
        
        {icon && iconPosition === 'right' && !clearable && !isPassword && (
          <S.Icon position="right">{icon}</S.Icon>
        )}
      </S.Wrapper>
      
      <S.Footer>
        {(error || helperText) && (
          <S.HelperText type={error ? 'error' : undefined}>
            {error || helperText}
          </S.HelperText>
        )}
        
        {showCount && maxLength && (
          <S.CharCount>
            {(value?.length || 0)}/{maxLength}
          </S.CharCount>
        )}
      </S.Footer>
    </S.Container>
  );
});

Input.displayName = 'Input';

export default Input;
