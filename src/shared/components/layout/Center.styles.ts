import styled from 'styled-components';

export const StyledCenter = styled.div<{
  $fullHeight?: boolean;
  $minHeight?: string;
  $inline?: boolean;
}>`
  display: ${(props) => (props.$inline ? 'inline-flex' : 'flex')};
  align-items: center;
  justify-content: center;
  width: 100%;
  ${(props) => props.$minHeight && `min-height: ${props.$minHeight};`}
  ${(props) => props.$fullHeight && 'height: 100%;'}
  flex-wrap: wrap;
  gap: 1rem;

  /* Dark theme support */
  [data-theme='dark'] & {
    background-color: transparent;
    color: var(--text-primary-dark, #ffffff);
  }
`;
