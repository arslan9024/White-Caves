import styled from 'styled-components';
import { X } from 'lucide-react';

export const AlertContainer = styled.div<{
  $severity: 'error' | 'warning' | 'info' | 'success';
  $variant: 'filled' | 'outlined' | 'standard';
}>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  position: relative;
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  ${(props) => {
    const colors = {
      error: { bg: '#fee2e2', border: '#fecaca', text: '#dc2626' },
      warning: { bg: '#fef3c7', border: '#fde68a', text: '#d97706' },
      info: { bg: '#dbeafe', border: '#bfdbfe', text: '#2563eb' },
      success: { bg: '#dcfce7', border: '#bbf7d0', text: '#16a34a' },
    };

    const color = colors[props.$severity];

    switch (props.$variant) {
      case 'filled':
        return `
          background: linear-gradient(135deg, ${color.bg} 0%, ${color.border} 100%);
          border: 1px solid ${color.border};
          color: ${color.text};
        `;
      case 'outlined':
        return `
          background: var(--bg-primary, #ffffff);
          border: 2px solid ${color.border};
          color: ${color.text};
        `;
      case 'standard':
      default:
        return `
          background: var(--bg-primary, #ffffff);
          border-left: 4px solid ${color.border};
          color: var(--text-primary, #1f2937);
        `;
    }
  }};

  [data-theme='dark'] & {
    background: var(--bg-secondary, #1f2937);
    border-color: rgba(255, 255, 255, 0.1);
    color: var(--text-primary, #f3f4f6);

    ${(props) => {
      if (props.$variant === 'filled') {
        const darkColors = {
          error: 'rgba(220, 38, 38, 0.2)',
          warning: 'rgba(217, 119, 6, 0.2)',
          info: 'rgba(37, 99, 235, 0.2)',
          success: 'rgba(22, 163, 74, 0.2)',
        };
        return `background: ${darkColors[props.$severity]};`;
      }
      return '';
    }};
  }

  @media (max-width: 640px) {
    padding: 12px;
    font-size: 13px;
  }
`;

export const AlertHeaderSection = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
`;

export const AlertIconWrapper = styled.div<{ $severity: 'error' | 'warning' | 'info' | 'success' }>`
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

  ${(props) => {
    const colors = {
      error: '#dc2626',
      warning: '#d97706',
      info: '#2563eb',
      success: '#16a34a',
    };
    return `color: ${colors[props.$severity]};`;
  }};
`;

export const AlertHeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const AlertTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary, #1f2937);

  [data-theme='dark'] & {
    color: var(--text-primary, #f3f4f6);
  }
`;

export const AlertDescription = styled.div`
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary, #6b7280);
  margin-top: 2px;

  [data-theme='dark'] & {
    color: var(--text-secondary, #d1d5db);
  }
`;

export const AlertContent = styled.div`
  flex: 1;
`;

export const AlertActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 100%;
    margin-top: 8px;
  }
`;

export const AlertCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary, #6b7280);
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: auto;

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
