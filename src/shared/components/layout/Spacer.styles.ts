import styled from 'styled-components';

type SpacerAxis = 'horizontal' | 'vertical' | 'both';
type SpaceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const getSpaceValue = (size: SpaceSize): string => {
  switch (size) {
    case 'xs':
      return '0.25rem';
    case 'sm':
      return '0.5rem';
    case 'md':
      return '1rem';
    case 'lg':
      return '1.5rem';
    case 'xl':
      return '2rem';
    case 'xxl':
      return '3rem';
    default:
      return '1rem';
  }
};

export const StyledSpacer = styled.div<{
  $axis?: SpacerAxis;
  $size?: SpaceSize;
  $customSize?: string;
  $flexible?: boolean;
}>`
  ${(props) => {
    const size = props.$customSize || getSpaceValue(props.$size || 'md');
    switch (props.$axis) {
      case 'horizontal':
        return `
          width: ${props.$flexible ? 'auto' : size};
          height: auto;
          flex: ${props.$flexible ? '1' : '0 0 ' + size};
        `;
      case 'vertical':
        return `
          height: ${props.$flexible ? 'auto' : size};
          width: 100%;
          flex: ${props.$flexible ? '1' : '0 0 ' + size};
        `;
      case 'both':
      default:
        return `
          width: ${size};
          height: ${size};
        `;
    }
  }}
  flex-shrink: 0;

  /* Dark theme support */
  [data-theme='dark'] & {
    background-color: transparent;
  }
`;
