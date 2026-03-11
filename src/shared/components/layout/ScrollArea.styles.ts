import styled from 'styled-components';

export const StyledScrollArea = styled.div<{
  $height?: string;
  $width?: string;
  $direction?: 'horizontal' | 'vertical' | 'both';
}>`
  position: relative;
  overflow: hidden;
  ${(props) => props.$width && `width: ${props.$width};`}
  ${(props) => props.$height && `height: ${props.$height};`}
  background-color: var(--bg-primary, #ffffff);
  border-radius: 0.5rem;

  [data-theme='dark'] & {
    background-color: var(--bg-primary-dark, #1a1a1a);
  }
`;

export const ScrollAreaViewport = styled.div<{
  $direction?: 'horizontal' | 'vertical' | 'both';
}>`
  width: 100%;
  height: 100%;
  overflow: ${(props) => {
    switch (props.$direction) {
      case 'horizontal':
        return 'auto hidden';
      case 'vertical':
        return 'hidden auto';
      case 'both':
      default:
        return 'auto';
    }
  }};

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--bg-secondary, #f9fafb);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color, #d1d5db);
    border-radius: 4px;

    &:hover {
      background: var(--border-color-hover, #9ca3af);
    }
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: var(--border-color, #d1d5db) var(--bg-secondary, #f9fafb);

  /* Dark theme support */
  [data-theme='dark'] & {
    &::-webkit-scrollbar-track {
      background: var(--bg-secondary-dark, #2a2a2a);
    }

    &::-webkit-scrollbar-thumb {
      background: var(--border-color-dark, #4b5563);

      &:hover {
        background: var(--border-color-hover-dark, #6b7280);
      }
    }

    scrollbar-color: var(--border-color-dark, #4b5563) var(--bg-secondary-dark, #2a2a2a);
  }
`;

export const ScrollAreaContent = styled.div`
  width: 100%;
  height: 100%;
`;
