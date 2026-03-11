import styled from 'styled-components';

export const StyledWrapper = styled.div<{
  $padding?: string;
  $margin?: string;
  $background?: string;
  $border?: string;
  $radius?: string;
  $shadow?: boolean;
  $fullWidth?: boolean;
  $display?: string;
}>`
  ${(props) => props.$padding && `padding: ${props.$padding};`}
  ${(props) => props.$margin && `margin: ${props.$margin};`}
  ${(props) => props.$background && `background: ${props.$background};`}
  ${(props) => props.$border && `border: ${props.$border};`}
  ${(props) => props.$radius && `border-radius: ${props.$radius};`}
  ${(props) =>
    props.$shadow &&
    `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);`}
  ${(props) => props.$fullWidth && 'width: 100%;'}
  ${(props) => props.$display && `display: ${props.$display};`}
  transition: all 0.3s ease;

  /* Dark theme support */
  [data-theme='dark'] & {
    ${(props) =>
      props.$background === 'var(--bg-primary, #FFFFFF)' &&
      'background: var(--bg-primary-dark, #1a1a1a);'}
    ${(props) =>
      props.$background === 'var(--bg-secondary, #F9FAFB)' &&
      'background: var(--bg-secondary-dark, #2a2a2a);'}
    color: var(--text-primary-dark, #ffffff);
    border-color: var(--border-color-dark, #374151);
  }
`;
