import styled from 'styled-components';

type GapSize = 'none' | 'small' | 'medium' | 'large';

const getGapValue = (gap: GapSize): string => {
  switch (gap) {
    case 'none':
      return '0';
    case 'small':
      return '0.75rem';
    case 'medium':
      return '1.25rem';
    case 'large':
      return '2rem';
    default:
      return '1.25rem';
  }
};

export const StyledGrid = styled.div<{
  $gap?: GapSize;
  $alignItems?: string;
  $justifyItems?: string;
  $colsMobile?: number;
  $colsTablet?: number;
  $colsDesktop?: number;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => props.$colsMobile || 1},
    minmax(0, 1fr)
  );
  gap: ${(props) => getGapValue(props.$gap || 'medium')};
  align-items: ${(props) => props.$alignItems || 'stretch'};
  justify-items: ${(props) => props.$justifyItems || 'stretch'};
  width: 100%;

  /* Responsive columns */
  @media (min-width: 768px) {
    grid-template-columns: repeat(
      ${(props) => props.$colsTablet || 2},
      minmax(0, 1fr)
    );
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(
      ${(props) => props.$colsDesktop || 3},
      minmax(0, 1fr)
    );
  }

  /* Dark theme support */
  [data-theme='dark'] & {
    background-color: transparent;
  }
`;
