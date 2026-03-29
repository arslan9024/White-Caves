import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as S from './Modal.styles';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Global counter: only restore body scroll when ALL modals are closed
let openModalCount = 0;

/* ── Modal ────────────────────────────────────────────── */

export interface ModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Callback fired when the modal should close */
  onClose?: () => void;
  /** Modal content */
  children?: React.ReactNode;
  /** Modal title displayed in the header */
  title?: string;
  /** Modal size preset */
  size?: 'small' | 'medium' | 'large' | 'fullscreen' | 'full';
  /** Whether to show the close button in the header */
  showCloseButton?: boolean;
  /** Whether clicking the overlay closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Additional CSS class */
  className?: string;
}

const ModalBase = React.memo<ModalProps>(({
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
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape && onClose) {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  // Focus trap: keep Tab cycling within the modal
  const handleTabTrap = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !containerRef.current) return;
    const focusable = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick && onClose) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Save previously focused element to restore on close
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabTrap);
      openModalCount++;
      document.body.style.overflow = 'hidden';
      // Auto-focus first focusable element inside modal
      requestAnimationFrame(() => {
        const el = containerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        el?.focus();
      });
    } else {
      // Modal just closed — restore focus to the element that opened it
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabTrap);
      if (isOpen) {
        openModalCount = Math.max(0, openModalCount - 1);
      }
      if (openModalCount === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, handleEscape, handleTabTrap]);

  if (!isOpen) return null;

  const modalContent = (
    <S.ModalOverlay
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <S.ModalContainer ref={containerRef} $size={size === 'fullscreen' ? 'full' : size} {...props}>
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

/* ── ModalFooter ──────────────────────────────────────── */

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const ModalFooter = React.memo<ModalFooterProps>(({ children, ...props }) => (
  <S.ModalFooter {...props}>
    {children}
  </S.ModalFooter>
));

/* ── Display names ────────────────────────────────────── */

ModalBase.displayName = 'Modal';
ModalFooter.displayName = 'ModalFooter';

/* ── Compound component ───────────────────────────────── */

const Modal = Object.assign(ModalBase, {
  Footer: ModalFooter,
});

export default Modal;
export { ModalFooter };
