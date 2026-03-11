import styled from 'styled-components';

export const StatusNotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  max-width: 400px;
  width: calc(100% - 40px);
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StatusNotificationItem = styled.div<{ $type: 'success' | 'error' | 'warning' | 'info' }>`
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--bg-primary, #ffffff);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  pointer-events: auto;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  transition: all 0.15s ease-out;

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

  animation: slideInRight 0.3s ease-out forwards;

  [data-theme='dark'] & {
    background: var(--bg-secondary, #1f2937);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  ${(props) => {
    switch (props.$type) {
      case 'success':
        return `border-left: 4px solid #10b981;`;
      case 'error':
        return `border-left: 4px solid #ef4444;`;
      case 'warning':
        return `border-left: 4px solid #f59e0b;`;
      case 'info':
      default:
        return `border-left: 4px solid #3b82f6;`;
    }
  }}
`;

export const StatusIcon = styled.div<{ $type: 'success' | 'error' | 'warning' | 'info' }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }

  ${(props) => {
    switch (props.$type) {
      case 'success':
        return `
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        `;
      case 'error':
        return `
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        `;
      case 'warning':
        return `
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        `;
      case 'info':
      default:
        return `
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        `;
    }
  }}
`;

export const StatusContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const StatusTitle = styled.strong`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
  line-height: 1.3;

  [data-theme='dark'] & {
    color: #f3f4f6;
  }
`;

export const StatusMessage = styled.span`
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.4;
  word-wrap: break-word;

  [data-theme='dark'] & {
    color: #d1d5db;
  }
`;

export const StatusDismiss = styled.button`
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-muted, #9ca3af);
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-out;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: var(--bg-tertiary, #f3f4f6);
    color: var(--text-primary, #1f2937);
  }

  [data-theme='dark'] &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const StatusProgress = styled.div<{ $type: 'success' | 'error' | 'warning' | 'info'; $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  opacity: 0.3;
  animation: progressShrink linear forwards;
  animation-duration: ${(props) => props.$duration}ms;
  width: 100%;

  @keyframes progressShrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }

  ${(props) => {
    switch (props.$type) {
      case 'success':
        return `background: #10b981;`;
      case 'error':
        return `background: #ef4444;`;
      case 'warning':
        return `background: #f59e0b;`;
      case 'info':
      default:
        return `background: #3b82f6;`;
    }
  }}
`;
