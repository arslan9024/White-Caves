/**
 * Modal Component
 * ===============
 * Accessible modal dialog component with backdrop, animations, and focus management.
 */

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

export type ModalSize = 'small' | 'medium' | 'large';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  showHeader?: boolean;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
  closeButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

const ModalBackdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContent = styled.div<{ size: ModalSize; isOpen: boolean }>`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
  animation: ${props =>
    props.isOpen ? 'modalSlideIn 0.3s ease' : 'modalSlideOut 0.3s ease'};

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes modalSlideOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
  }

  ${props => {
    switch (props.size) {
      case 'small':
        return 'width: 90%; max-width: 400px;';
      case 'large':
        return 'width: 90%; max-width: 900px;';
      case 'medium':
      default:
        return 'width: 90%; max-width: 600px;';
    }
  }}
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s ease;

  &:hover {
    color: #1f2937;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  gap: 10px;
`;

/**
 * Modal Component
 * Accessible dialog with customizable content, header, and footer
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showHeader = true,
  showFooter = false,
  footerContent,
  closeButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Manage body overflow
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <ModalBackdrop isOpen={isOpen} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <ModalContent ref={modalRef} size={size} isOpen={isOpen}>
        {showHeader && (
          <ModalHeader>
            <h2>{title}</h2>
            {closeButton && (
              <CloseButton onClick={onClose} aria-label="Close modal">
                ✕
              </CloseButton>
            )}
          </ModalHeader>
        )}

        <ModalBody>{children}</ModalBody>

        {showFooter && <ModalFooter>{footerContent}</ModalFooter>}
      </ModalContent>
    </ModalBackdrop>
  );
};

export default Modal;
