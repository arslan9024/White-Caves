import styled from 'styled-components';

export const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: var(--z-toast, 400);
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  max-width: 400px;
`;

export const ToastWrapper = styled.div<{ $type: 'success' | 'error' | 'warning' | 'info' }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid #3b82f6;
  animation: slideInRight 0.3s ease-out forwards;
  pointer-events: auto;
  cursor: default;

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  [data-theme='dark'] & {
    background: #2a2a2a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    color: #e5e7eb;
  }

  ${(props) => {
    switch (props.$type) {
      case 'success':
        return `border-left-color: #10b981;`;
      case 'error':
        return `border-left-color: #ef4444;`;
      case 'warning':
        return `border-left-color: #f59e0b;`;
      case 'info':
      default:
        return `border-left-color: #3b82f6;`;
    }
  }}
`;

export const ToastIcon = styled.div<{ $type: 'success' | 'error' | 'warning' | 'info' }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2px;

  svg {
    width: 20px;
    height: 20px;
  }

  ${(props) => {
    switch (props.$type) {
      case 'success':
        return `color: #10b981;`;
      case 'error':
        return `color: #ef4444;`;
      case 'warning':
        return `color: #f59e0b;`;
      case 'info':
      default:
        return `color: #3b82f6;`;
    }
  }}
`;

export const ToastContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ToastTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);

  [data-theme='dark'] & {
    color: #f3f4f6;
  }
`;

export const ToastMessage = styled.div`
  font-weight: 400;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;

  [data-theme='dark'] & {
    color: #d1d5db;
  }
`;

export const ToastClose = styled.button`
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  transition: all var(--transition-fast);
  opacity: 0.7;

  [data-theme='dark'] & {
    color: #9ca3af;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    opacity: 1;

    [data-theme='dark'] & {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  &:focus {
    outline: 2px solid var(--primary-red);
    outline-offset: 2px;
  }
`;
