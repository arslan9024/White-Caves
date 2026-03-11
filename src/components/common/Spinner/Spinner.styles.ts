import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const bars = keyframes`
  0% {
    transform: scaleY(0.5);
    opacity: 0.8;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(0.5);
    opacity: 0.8;
  }
`;

export const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
`;

export const SpinnerWrapper = styled.div<{
  $size?: 'small' | 'medium' | 'large';
  $variant?: 'ring' | 'dots' | 'bars' | 'pulse';
  $color?: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${(props) => {
    if (props.$variant === 'pulse') {
      const sizeMap = {
        small: '20px',
        medium: '32px',
        large: '48px',
      };
      const size = sizeMap[props.$size || 'medium'];
      return `
        width: ${size};
        height: ${size};
        border-radius: 50%;
        background: ${props.$color || '#3b82f6'};
        animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      `;
    }
    return '';
  }};
`;

export const SpinnerRing = styled.div<{
  $size: 'small' | 'medium' | 'large';
  $variant: 'ring' | 'bars';
  $color?: string;
}>`
  display: inline-block;
  position: relative;

  ${(props) => {
    const sizeMap = {
      small: { size: '20px', border: '2px' },
      medium: { size: '32px', border: '3px' },
      large: { size: '48px', border: '4px' },
    };
    const config = sizeMap[props.$size];

    if (props.$variant === 'ring') {
      return `
        width: ${config.size};
        height: ${config.size};

        &::after {
          content: '';
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: ${config.border} solid ${props.$color || '#3b82f6'};
          border-color: ${props.$color || '#3b82f6'} transparent ${props.$color || '#3b82f6'} transparent;
          animation: ${spin} 1.2s linear infinite;
        }
      `;
    } else if (props.$variant === 'bars') {
      return `
        width: ${config.size};
        height: ${config.size};
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        gap: 2px;

        div {
          width: 12%;
          height: 100%;
          background: ${props.$color || '#3b82f6'};
          border-radius: 2px;
          animation: ${bars} 1s ease-in-out infinite;
          transform-origin: bottom;

          &:nth-child(1) { animation-delay: 0s; }
          &:nth-child(2) { animation-delay: 0.1s; }
          &:nth-child(3) { animation-delay: 0.2s; }
          &:nth-child(4) { animation-delay: 0.3s; }
          &:nth-child(5) { animation-delay: 0.4s; }
          &:nth-child(6) { animation-delay: 0.5s; }
          &:nth-child(7) { animation-delay: 0.4s; }
          &:nth-child(8) { animation-delay: 0.3s; }
          &:nth-child(9) { animation-delay: 0.2s; }
          &:nth-child(10) { animation-delay: 0.1s; }
          &:nth-child(11) { animation-delay: 0s; }
          &:nth-child(12) { animation-delay: 0.1s; }
        }
      `;
    }
    return '';
  }};
`;

export const SpinnerDots = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  display: inline-flex;
  gap: 4px;
  align-items: center;

  ${(props) => {
    const sizeMap = {
      small: '8px',
      medium: '12px',
      large: '16px',
    };
    return `& > div { width: ${sizeMap[props.$size]}; height: ${sizeMap[props.$size]}; }`;
  }};
`;

export const SpinnerDot = styled.div<{
  $color: string;
  $delay: string;
}>`
  border-radius: 50%;
  background: ${(props) => props.$color};
  animation: ${bounce} 1.4s infinite ease-in-out both;
  animation-delay: ${(props) => props.$delay};
`;

export const SpinnerText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);

  [data-theme='dark'] & {
    color: var(--text-secondary, #d1d5db);
  }
`;
