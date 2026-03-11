import styled from 'styled-components';

export const DividerContainer = styled.div<{
  $orientation: 'horizontal' | 'vertical';
  $variant: 'solid' | 'dashed' | 'dotted';
  $margin: string;
  $thickness: number;
  $color?: string;
  $flexItem?: boolean;
}>`
  flex-shrink: ${(props) => (props.$flexItem ? 0 : 1)};

  ${(props) => {
    const borderColor = props.$color || 'var(--border-color, #e5e7eb)';
    const borderStyle = {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
    }[props.$variant];

    if (props.$orientation === 'vertical') {
      return `
        width: ${props.$thickness}px;
        height: auto;
        min-height: 1px;
        border-right: ${props.$thickness}px ${borderStyle} ${borderColor};
        margin: 0 ${props.$margin};
      `;
    } else {
      return `
        width: 100%;
        height: ${props.$thickness}px;
        border-bottom: ${props.$thickness}px ${borderStyle} ${borderColor};
        margin: ${props.$margin} 0;
      `;
    }
  }};

  [data-theme='dark'] & {
    border-color: var(--border-color-dark, #374151);
  }
`;

export const DividerWrapper = styled.div<{
  $orientation: 'horizontal' | 'vertical';
  $margin: string;
  $thickness: number;
}>`
  display: flex;
  align-items: center;
  gap: 16px;

  ${(props) => {
    if (props.$orientation === 'vertical') {
      return `
        flex-direction: column;
        margin: 0 ${props.$margin};
        height: auto;
      `;
    } else {
      return `
        flex-direction: row;
        margin: ${props.$margin} 0;
        width: 100%;
      `;
    }
  }};

  @media (max-width: 640px) {
    gap: 12px;

    ${(props) => {
      if (props.$orientation === 'horizontal') {
        return `margin: 12px 0;`;
      }
      return `margin: 0 12px;`;
    }};
  }
`;

export const DividerLine = styled.div<{
  $variant: 'solid' | 'dashed' | 'dotted';
  $color?: string;
}>`
  flex: 1;
  height: 1px;
  background: ${(props) => props.$color || 'var(--border-color, #e5e7eb)'};
  border-top: 1px ${(props) => {
    const borderStyle = {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
    }[props.$variant];
    return borderStyle;
  }} ${(props) => props.$color || 'var(--border-color, #e5e7eb)'};

  [data-theme='dark'] & {
    border-top-color: var(--border-color-dark, #374151);
  }
`;

export const DividerText = styled.div`
  flex-shrink: 0;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
  white-space: nowrap;

  [data-theme='dark'] & {
    color: var(--text-secondary, #d1d5db);
  }

  @media (max-width: 640px) {
    padding: 0 12px;
    font-size: 13px;
  }
`;
