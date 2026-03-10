/**
 * Modal Component
 * Dialog/modal overlay for focused user interactions
 */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import { Button } from '../Button';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  children: React.ReactNode;
};

const getModalSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
  const sizes = {
    sm: '400px',
    md: '600px',
    lg: '900px',
    xl: '1200px',
  };
  return sizes[size] || sizes.md;
};

const Backdrop = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${theme.zIndex.overlay};
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div<{ $size?: 'sm' | 'md' | 'lg' | 'xl' }>`
  background-color: ${theme.colors.background.secondary};
  border-radius: ${theme.spacing.md};
  box-shadow: ${theme.shadows.xl};
  width: ${(props) => getModalSize(props.$size || 'md')};
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  z-index: ${theme.zIndex.modal};
  animation: slideInUp 0.3s ease-out;

  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media ${theme.mediaQueries.mobile} {
    width: 95vw;
  }
`;

const ModalHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.text.tertiary};
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing.lg};
  overflow-y: auto;
  flex: 1;
`;

const ModalFooter = styled.div`
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;

  @media ${theme.mediaQueries.mobile} {
    flex-direction: column-reverse;
  }
`;

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      size = 'md',
      children,
      footer,
      onConfirm,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      isDanger = false,
    },
    ref
  ) => {
    // Close on Escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <Backdrop $isOpen={isOpen} onClick={handleBackdropClick} role="presentation">
        <ModalContent ref={ref} $size={size} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          {title || onClose ? (
            <ModalHeader>
              {title && <ModalTitle id="modal-title">{title}</ModalTitle>}
              {onClose && (
                <CloseButton onClick={onClose} aria-label="Close modal">
                  ✕
                </CloseButton>
              )}
            </ModalHeader>
          ) : null}

          <ModalBody>{children}</ModalBody>

          {(footer || onConfirm) && (
            <ModalFooter>
              {footer || (
                <>
                  <Button variant="outline" onClick={onClose}>
                    {cancelText}
                  </Button>
                  <Button variant={isDanger ? 'danger' : 'primary'} onClick={onConfirm}>
                    {confirmText}
                  </Button>
                </>
              )}
            </ModalFooter>
          )}
        </ModalContent>
      </Backdrop>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
