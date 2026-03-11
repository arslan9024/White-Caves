import styled from 'styled-components';
import { X } from 'lucide-react';

export const NotificationContainer = styled.div<{ $type: 'success' | 'error' | 'info' | 'warning' }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: var(--bg-primary, #ffffff);
  border-left: 4px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  animation: slideInDown 0.3s ease-out forwards;
  position: relative;

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${(props) => {
    switch (props.$type) {
      case 'success':
        return `
          border-left-color: #10b981;
          & > div:first-child {
            color: #10b981;
          }
        `;
      case 'error':
        return `
          border-left-color: #ef4444;
          & > div:first-child {
            color: #ef4444;
          }
        `;
      case 'warning':
        return `
          border-left-color: #f59e0b;
          & > div:first-child {
            color: #f59e0b;
          }
        `;
      case 'info':
        return `
          border-left-color: #3b82f6;
          & > div:first-child {
            color: #3b82f6;
          }
        `;
      default:
        return '';
    }
  }};

  [data-theme='dark'] & {
    background: var(--bg-secondary, #1f2937);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    color: var(--text-primary, #f3f4f6);
  }

  @media (max-width: 640px) {
    padding: 12px;
    font-size: 14px;
  }
`;

export const NotificationContent = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex: 1;
`;

export const NotificationIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-top: 2px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const NotificationBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const NotificationTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary, #1f2937);

  [data-theme='dark'] & {
    color: var(--text-primary, #f3f4f6);
  }
`;

export const NotificationMessage = styled.div`
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.4;

  [data-theme='dark'] & {
    color: var(--text-secondary, #d1d5db);
  }
`;

export const NotificationClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin: -4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary, #6b7280);
  transition: color 0.2s ease;
  flex-shrink: 0;

  &:hover {
    color: var(--text-primary, #1f2937);
  }

  [data-theme='dark'] & {
    color: var(--text-secondary, #d1d5db);

    &:hover {
      color: var(--text-primary, #f3f4f6);
    }
  }
`;

export const NotificationDismiss = styled(X)`
  width: 16px;
  height: 16px;
`;
