import styled from 'styled-components';

type StackDirection = 'vertical' | 'horizontal';
type GapSize = 'none' | 'small' | 'medium' | 'large' | 'xlarge';

const getGapValue = (gap: GapSize): string => {
  switch (gap) {
    case 'none':
      return '0';
    case 'small':
      return '0.5rem';
    case 'medium':
      return '1rem';
    case 'large':
      return '1.5rem';
    case 'xlarge':
      return '2rem';
    default:
      return '1rem';
  }
};

export const StyledStack = styled.div<{
  $direction?: StackDirection;
  $gap?: GapSize;
  $align?: string;
  $justify?: string;
  $fullWidth?: boolean;
  $fullHeight?: boolean;
}>`
  display: flex;
  flex-direction: ${(props) => (props.$direction === 'horizontal' ? 'row' : 'column')};
  gap: ${(props) => getGapValue(props.$gap || 'medium')};
  align-items: ${(props) => props.$align || 'stretch'};
  justify-content: ${(props) => props.$justify || 'flex-start'};
  ${(props) => props.$fullWidth && 'width: 100%;'}
  ${(props) => props.$fullHeight && 'height: 100%;'}
  
  /* Responsive behavior */
  @media (max-width: 768px) {
    flex-direction: column;
  }

  /* Dark theme support */
  [data-theme='dark'] & {
    color: var(--text-primary-dark, #ffffff);
  }
`;
