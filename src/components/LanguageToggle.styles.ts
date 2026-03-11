import styled from 'styled-components';

export const StyledLanguageToggleButton = styled.button<{ variant?: 'default' | 'minimal' | 'pill' | 'dark' | 'white' | 'floating' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${props => {
    switch (props.variant) {
      case 'minimal':
      case 'dark':
        return '6px 10px';
      case 'pill':
        return '6px 16px';
      case 'floating':
        return '8px 12px';
      default:
        return '8px 12px';
    }
  }};
  background: ${props => {
    switch (props.variant) {
      case 'dark':
        return 'rgba(0, 0, 0, 0.3)';
      case 'white':
        return '#ffffff';
      case 'minimal':
        return 'transparent';
      case 'floating':
        return '#ffffff';
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'dark':
        return 'rgba(0, 0, 0, 0.2)';
      case 'white':
        return '#e5e5e5';
      case 'minimal':
        return 'none';
      case 'floating':
        return '#e5e5e5';
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  border-radius: ${props => props.variant === 'pill' ? '50px' : '8px'};
  color: ${props => {
    switch (props.variant) {
      case 'dark':
      case 'white':
      case 'floating':
        return '#1a1a1a';
      default:
        return '#ffffff';
    }
  }};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: ${props => props.variant !== 'white' && props.variant !== 'dark' && props.variant !== 'floating' && props.variant !== 'minimal' ? 'blur(10px)' : 'none'};
  ${props => props.variant === 'floating' ? `position: fixed;
    bottom: 100px;
    right: 20px;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);` : ''}

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 13px;
  }

  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'dark':
          return 'rgba(0, 0, 0, 0.4)';
        case 'white':
          return '#f5f5f5';
        case 'minimal':
          return 'rgba(255, 255, 255, 0.1)';
        case 'floating':
          return '#f5f5f5';
        default:
          return 'rgba(255, 255, 255, 0.2)';
      }
    }};
    border-color: ${props => {
      switch (props.variant) {
        case 'dark':
          return 'rgba(0, 0, 0, 0.3)';
        case 'white':
          return '#d5d5d5';
        case 'floating':
          return '#d5d5d5';
        default:
          return 'rgba(255, 255, 255, 0.3)';
      }
    }};
    ${props => props.variant === 'floating' ? 'box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);' : ''}
    transform: ${props => props.variant !== 'floating' ? 'translateY(-1px)' : 'none'};
  }

  &:active {
    transform: translateY(0);
  }

  [dir='rtl'] & {
    flex-direction: row-reverse;
    ${props => props.variant === 'floating' ? `right: auto;
      left: 20px;

      @media (max-width: 768px) {
        left: 15px;
      }` : ''}
  }
`;

export const StyledLanguageIcon = styled.svg`
  flex-shrink: 0;
  transition: transform 0.3s ease;

  ${StyledLanguageToggleButton}:hover & {
    transform: rotate(20deg);
  }
`;

export const StyledLanguageLabel = styled.span`
  font-family: 'Cairo', 'Noto Sans Arabic', 'Montserrat', sans-serif;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const StyledLanguageIndicator = styled.span`
  background: #dc2626;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;
