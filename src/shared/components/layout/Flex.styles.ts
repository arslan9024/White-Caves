import styled from 'styled-components';

type GapSize = 'none' | 'small' | 'medium' | 'large';
type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

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
    default:
      return '1rem';
  }
};

export const StyledFlex = styled.div<{
  $direction?: FlexDirection;
  $wrap?: string;
  $justify?: string;
  $align?: string;
  $gap?: GapSize;
  $flex?: number | string;
  $grow?: number;
  $shrink?: number;
  $basis?: string;
  $inline?: boolean;
}>`
  display: ${(props) => (props.$inline ? 'inline-flex' : 'flex')};
  flex-direction: ${(props) => props.$direction || 'row'};
  flex-wrap: ${(props) => props.$wrap || 'nowrap'};
  justify-content: ${(props) => props.$justify || 'flex-start'};
  align-items: ${(props) => props.$align || 'stretch'};
  gap: ${(props) => getGapValue(props.$gap || 'medium')};
  ${(props) => props.$flex && `flex: ${props.$flex};`}
  ${(props) => props.$grow && `flex-grow: ${props.$grow};`}
  ${(props) => props.$shrink && `flex-shrink: ${props.$shrink};`}
  ${(props) => props.$basis && `flex-basis: ${props.$basis};`}
  width: 100%;

  /* Dark theme support */
  [data-theme='dark'] & {
    background-color: transparent;
  }
`;
