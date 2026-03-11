import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const ring = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
`;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'success':
      return '#10b981';
    case 'error':
      return '#ef4444';
    case 'warning':
    case 'pending':
      return '#f59e0b';
    case 'inactive':
    default:
      return '#9ca3af';
  }
};

export const StatusIndicatorWrapper = styled.div<{
  $size: 'small' | 'medium' | 'large';
  $variant: 'dot' | 'ring' | 'pulse';
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px;

  ${(props) => {
    switch (props.$size) {
      case 'small':
        return 'gap: 6px;';
      case 'large':
        return 'gap: 10px;';
      default:
        return 'gap: 8px;';
    }
  }};
`;

export const StatusIndicatorDot = styled.div<{
  $status: string;
  $size: 'small' | 'medium' | 'large';
  $variant: 'dot' | 'ring' | 'pulse';
}>`
  border-radius: 50%;
  flex-shrink: 0;
  background-color: ${(props) => getStatusColor(props.$status)};

  ${(props) => {
    switch (props.$size) {
      case 'small':
        return 'width: 8px; height: 8px;';
      case 'large':
        return 'width: 16px; height: 16px;';
      default:
        return 'width: 12px; height: 12px;';
    }
  }};

  ${(props) => {
    if (props.$variant === 'pulse') {
      return `animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;`;
    }
    return '';
  }};

  transition: background-color 0.2s ease;
`;

export const StatusRing = styled.div<{
  $status: string;
  $size: 'small' | 'medium' | 'large';
}>`
  position: relative;
  flex-shrink: 0;

  ${(props) => {
    switch (props.$size) {
      case 'small':
        return `width: 16px; height: 16px; animation: ${ring} 1.5s infinite;`;
      case 'large':
        return `width: 28px; height: 28px; animation: ${ring} 1.5s infinite;`;
      default:
        return `width: 20px; height: 20px; animation: ${ring} 1.5s infinite;`;
    }
  }};

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StatusIndicatorLabel = styled.span<{
  $size: 'small' | 'medium' | 'large';
}>`
  font-weight: 500;
  color: var(--text-primary, #1f2937);
  white-space: nowrap;

  ${(props) => {
    switch (props.$size) {
      case 'small':
        return 'font-size: 12px;';
      case 'large':
        return 'font-size: 15px; font-weight: 600;';
      default:
        return 'font-size: 13px;';
    }
  }};

  [data-theme='dark'] & {
    color: var(--text-primary, #f3f4f6);
  }
`;

export const StatusIndicatorContainer = styled.div<{
  $status: string;
}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 6px;
  background: rgba(${(props) => {
    const color = getStatusColor(props.$status);
    // Convert hex to rgb
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (rgb) {
      return `${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)}, ${parseInt(rgb[3], 16)}`;
    }
    return '156, 163, 175';
  }}, 0.1);
  border: 1px solid rgba(${(props) => {
    const color = getStatusColor(props.$status);
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (rgb) {
      return `${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)}, ${parseInt(rgb[3], 16)}`;
    }
    return '156, 163, 175';
  }}, 0.2);
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => getStatusColor(props.$status)};

  [data-theme='dark'] & {
    background: rgba(${(props) => {
      const color = getStatusColor(props.$status);
      const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      if (rgb) {
        return `${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)}, ${parseInt(rgb[3], 16)}`;
      }
      return '156, 163, 175';
    }}, 0.15);
    border-color: rgba(${(props) => {
      const color = getStatusColor(props.$status);
      const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      if (rgb) {
        return `${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)}, ${parseInt(rgb[3], 16)}`;
      }
      return '156, 163, 175';
    }}, 0.3);
  }
`;
