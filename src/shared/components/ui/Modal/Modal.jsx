import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

const Modal = React.memo(({
  isOpen,
  onClose,
  children,
  title,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  ...props
}) => {
  const baseClass = 'wc-modal';

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape && onClose) {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick && onClose) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className={`${baseClass}__overlay`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className={`${baseClass}__container ${baseClass}__container--${size} ${className}`} {...props}>
        {(title || showCloseButton) && (
          <div className={`${baseClass}__header`}>
            {title && <h2 id="modal-title" className={`${baseClass}__title`}>{title}</h2>}
            {showCloseButton && (
              <button
                type="button"
                className={`${baseClass}__close`}
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className={`${baseClass}__content`}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
});

const ModalFooter = React.memo(({ children, className = '', ...props }) => (
  <div className={`wc-modal__footer ${className}`} {...props}>
    {children}
  </div>
));

Modal.displayName = 'Modal';
ModalFooter.displayName = 'ModalFooter';

Modal.Footer = ModalFooter;

export default Modal;
export { ModalFooter };
