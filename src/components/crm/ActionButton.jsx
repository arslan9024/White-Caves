import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import './ActionButton.css';

const ActionButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  showSuccess = false,
  successDuration = 2000,
  fullWidth = false,
  className = ''
}) => {
  const [showSuccessState, setShowSuccessState] = useState(false);

  const handleClick = async (e) => {
    if (loading || disabled || showSuccessState) return;
    
    if (onClick) {
      const result = onClick(e);
      
      if (showSuccess && result !== false) {
        setShowSuccessState(true);
        setTimeout(() => setShowSuccessState(false), successDuration);
      }
    }
  };

  const buttonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="action-btn-spinner" size={size === 'sm' ? 14 : 16} />
          <span>Processing...</span>
        </>
      );
    }
    
    if (showSuccessState) {
      return (
        <>
          <Check size={size === 'sm' ? 14 : 16} />
          <span>Done!</span>
        </>
      );
    }
    
    return (
      <>
        {icon && <span className="action-btn-icon">{icon}</span>}
        {children}
      </>
    );
  };

  return (
    <button
      className={`action-btn action-btn--${variant} action-btn--${size} ${fullWidth ? 'action-btn--full' : ''} ${showSuccessState ? 'action-btn--success' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {buttonContent()}
    </button>
  );
};

export default ActionButton;
