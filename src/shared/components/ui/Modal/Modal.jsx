import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as S from './Modal.styles';

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
    <S.ModalOverlay 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <S.ModalContainer $size={size} {...props}>
        {(title || showCloseButton) && (
          <S.ModalHeader>
            {title && <S.ModalTitle id="modal-title">{title}</S.ModalTitle>}
            {showCloseButton && (
              <S.ModalCloseButton
                type="button"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </S.ModalCloseButton>
            )}
          </S.ModalHeader>
        )}
        <S.ModalContent>
          {children}
        </S.ModalContent>
      </S.ModalContainer>
    </S.ModalOverlay>
  );

  return createPortal(modalContent, document.body);
});

const ModalFooter = React.memo(({ children, ...props }) => (
  <S.ModalFooter {...props}>
    {children}
  </S.ModalFooter>
));

Modal.displayName = 'Modal';
ModalFooter.displayName = 'ModalFooter';

Modal.Footer = ModalFooter;

export default Modal;
export { ModalFooter };
