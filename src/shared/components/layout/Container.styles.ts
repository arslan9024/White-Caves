import styled from 'styled-components';

export const StyledContainer = styled.div<{
  $size?: 'small' | 'default' | 'large';
  $fluid?: boolean;
  $paddingX?: string;
  $paddingY?: string;
}>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${(props) => props.$paddingX || '1rem'};
  padding-right: ${(props) => props.$paddingX || '1rem'};
  padding-top: ${(props) => props.$paddingY || '0'};
  padding-bottom: ${(props) => props.$paddingY || '0'};

  /* Size variants */
  ${(props) => {
    if (props.$fluid) {
      return 'max-width: 100%;';
    }
    switch (props.$size) {
      case 'small':
        return 'max-width: 640px;';
      case 'large':
        return 'max-width: 1536px;';
      case 'default':
      default:
        return 'max-width: 1280px;';
    }
  }};

  /* Responsive padding */
  @media (min-width: 768px) {
    padding-left: ${(props) => props.$paddingX || '1.5rem'};
    padding-right: ${(props) => props.$paddingX || '1.5rem'};
  }

  @media (min-width: 1024px) {
    padding-left: ${(props) => props.$paddingX || '2rem'};
    padding-right: ${(props) => props.$paddingX || '2rem'};
  }

  /* Dark theme support */
  [data-theme='dark'] & {
    background-color: var(--bg-secondary-dark, #1a1a1a);
  }
`;
