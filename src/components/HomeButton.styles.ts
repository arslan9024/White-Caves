import styled from 'styled-components';

export const HomeButtonContainer = styled.button<{ variant?: 'default' | 'primary' | 'minimal' | 'icon-only' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: ${props => {
    switch (props.variant) {
      case 'icon-only': return '10px';
      case 'minimal': return '8px 12px';
      default: return '10px 20px';
    }
  }};
  background: ${props => {
    switch (props.variant) {
      case 'primary':
        return 'linear-gradient(135deg, #D4AF37, #B8860B)';
      case 'minimal':
        return 'transparent';
      case 'icon-only':
        return 'rgba(255, 255, 255, 0.1)';
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  border: ${props => {
    switch (props.variant) {
      case 'primary': return 'none';
      case 'minimal': return 'none';
      case 'icon-only': return '1px solid rgba(255, 255, 255, 0.2)';
      default: return '1px solid rgba(255, 255, 255, 0.2)';
    }
  }};
  border-radius: ${props => props.variant === 'icon-only' ? '50%' : '10px'};
  color: ${props => {
    switch (props.variant) {
      case 'primary': return '#0a0a0f';
      case 'minimal': return 'rgba(255, 255, 255, 0.7)';
      default: return 'white';
    }
  }};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    ${props => {
      switch (props.variant) {
        case 'primary':
          return `
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
            color: #0a0a0f;
          `;
        case 'minimal':
          return `
            background: rgba(255, 255, 255, 0.1);
            color: #D4AF37;
          `;
        default:
          return `
            background: rgba(212, 175, 55, 0.2);
            border-color: #D4AF37;
            color: #D4AF37;
          `;
      }
    }}
  }

  svg {
    flex-shrink: 0;
  }

  span {
    ${props => props.variant === 'icon-only' && 'display: none;'}
  }

  /* Light mode theme support */
  [data-theme='light'] & {
    background: ${props => {
      switch (props.variant) {
        case 'primary':
          return 'linear-gradient(135deg, #D4AF37, #B8860B)';
        case 'minimal':
          return 'transparent';
        case 'icon-only':
          return 'rgba(0, 0, 0, 0.05)';
        default:
          return 'rgba(0, 0, 0, 0.05)';
      }
    }};
    border-color: ${props => {
      switch (props.variant) {
        case 'primary': return 'none';
        case 'minimal': return 'none';
        case 'icon-only': return 'rgba(0, 0, 0, 0.1)';
        default: return 'rgba(0, 0, 0, 0.1)';
      }
    }};
    color: ${props => {
      switch (props.variant) {
        case 'primary': return '#0a0a0f';
        case 'minimal': return '#666';
        default: return '#333';
      }
    }};

    &:hover {
      ${props => {
        switch (props.variant) {
          case 'primary':
            return `
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
              color: #0a0a0f;
            `;
          case 'minimal':
            return `
              background: rgba(0, 0, 0, 0.05);
              color: #B8860B;
            `;
          default:
            return `
              background: rgba(212, 175, 55, 0.1);
              border-color: #B8860B;
              color: #B8860B;
            `;
        }
      }}
    }
  }

  @media (max-width: 768px) {
    padding: ${props => {
      switch (props.variant) {
        case 'icon-only': return '8px';
        case 'minimal': return '6px 10px';
        default: return '8px 16px';
      }
    }};
    font-size: 13px;
  }
`;

export const FloatingHomeButtonContainer = styled.button`
  position: fixed;
  bottom: 100px;
  left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D4AF37, #B8860B);
  border: none;
  color: #0a0a0f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
  z-index: 999;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(212, 175, 55, 0.5);
  }

  svg {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 768px) {
    bottom: 80px;
    left: 15px;
    width: 45px;
    height: 45px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;
