import styled from 'styled-components';

export const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const TooltipPortal = styled.div<{
  $placement: string;
  $position: { top: number; left: number };
}>`
  position: fixed;
  top: ${(props) => `${props.$position.top}px`};
  left: ${(props) => `${props.$position.left}px`};
  background: var(--bg-secondary, #1f2937);
  color: var(--text-primary, #f3f4f6);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  white-space: nowrap;
  z-index: var(--z-tooltip, 800);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  animation: tooltipFadeIn 0.2s ease-in;

  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  [data-theme='light'] & {
    background: var(--bg-primary, #ffffff);
    color: var(--text-primary, #1f2937);
    border: 1px solid var(--border-color, #e5e7eb);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 640px) {
    font-size: 12px;
    padding: 6px 10px;
    white-space: normal;
    max-width: 200px;
  }

  ${(props) => {
    switch (props.$placement) {
      case 'top':
        return `
          transform: translate(-50%, 0);
          margin-top: -8px;
        `;
      case 'bottom':
        return `
          transform: translate(-50%, 0);
          margin-top: 8px;
        `;
      case 'left':
        return `
          transform: translate(0, -50%);
          margin-left: -8px;
        `;
      case 'right':
        return `
          transform: translate(0, -50%);
          margin-left: 8px;
        `;
      default:
        return `transform: translate(-50%, 0);`;
    }
  }};
`;

export const TooltipContent = styled.div`
  word-break: break-word;
`;

export const TooltipArrow = styled.div<{ $placement: string }>`
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--bg-secondary, #1f2937);
  transform: rotate(45deg);
  z-index: -1;

  [data-theme='light'] & {
    background: var(--bg-primary, #ffffff);
    border-top: 1px solid var(--border-color, #e5e7eb);
    border-left: 1px solid var(--border-color, #e5e7eb);
  }

  ${(props) => {
    switch (props.$placement) {
      case 'top':
        return `
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
        `;
      case 'bottom':
        return `
          top: -3px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
        `;
      case 'left':
        return `
          right: -3px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        `;
      case 'right':
        return `
          left: -3px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        `;
      default:
        return '';
    }
  }};
`;
