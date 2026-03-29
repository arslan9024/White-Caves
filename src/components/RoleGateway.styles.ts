import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${props => props.theme?.colors?.bgSecondary || '#f5f5f5'} 0%,
    ${props => props.theme?.colors?.bgPrimary || '#ffffff'} 100%
  );
  padding: ${props => props.theme?.spacing?.xl || '3rem'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ContainerContent = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme?.spacing?.xl || '3rem'};

  h1 {
    font-family: ${props => props.theme?.fonts?.heading || "'Montserrat', sans-serif"};
    font-size: 2.5rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textPrimary || '#212121'};
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 1.875rem;
    }
  }

  p {
    font-size: 1rem;
    color: ${props => props.theme?.colors?.textMuted || '#757575'};
    max-width: 600px;
    margin: 0 auto 1rem;
    line-height: 1.6;
  }
`;

export const Warning = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.danger || '#d32f2f'};
  font-weight: 500;
  background: ${props => `rgba(211, 47, 47, 0.08)`};
  padding: 0.75rem 1.25rem;
  border-radius: ${props => props.theme?.radius?.lg || '0.75rem'};
  display: inline-block;
  margin-bottom: 1rem;
`;

export const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${props => props.theme?.spacing?.md || '1.5rem'};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const RoleCard = styled.button<{ $selected?: boolean }>`
  background: ${props => props.$selected 
    ? (props.theme?.colors?.primaryLight || 'rgba(211, 47, 47, 0.04)')
    : (props.theme?.colors?.bgPrimary || '#ffffff')
  };
  border: 2px solid ${props => props.$selected
    ? (props.theme?.colors?.danger || '#E31E24')
    : (props.theme?.colors?.borderColor || '#e0e0e0')
  };
  border-radius: ${props => props.theme?.radius?.xl || '1rem'};
  padding: ${props => props.theme?.spacing?.lg || '2rem'};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background-clip: padding-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.theme?.colors?.danger || '#E31E24'};
    transform: ${props => props.$selected ? 'scaleX(1)' : 'scaleX(0)'};
    transition: transform 0.3s ease;
  }

  &:hover {
    border-color: ${props => props.theme?.colors?.danger || '#E31E24'};
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  }

  &:hover::before {
    transform: scaleX(1);
  }

  ${props => props.$selected && `
    box-shadow: 0 0 0 3px ${props.theme?.colors?.dangerLight || 'rgba(211, 47, 47, 0.15)'};
  `}
`;

export const RoleIcon = styled.span`
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
`;

export const RoleTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textPrimary || '#212121'};
  margin; 0 0 0.5rem;
`;

export const RoleDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.textSecondary || '#666666'};
  margin: 0;
  line-height: 1.5;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme?.colors?.borderColor || '#e0e0e0'};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.$variant === 'primary' ? `
    background: ${props.theme?.colors?.primary || '#0066cc'};
    color: white;

    &:hover {
      background: ${props.theme?.colors?.primaryDark || '#0052a3'};
      transform: translateY(-2px);
    }
  ` : `
    background: ${props.theme?.colors?.surfaceAlt || '#f5f5f5'};
    color: ${props.theme?.colors?.text || '#333333'};
    border: 1px solid ${props.theme?.colors?.borderColor || '#e0e0e0'};

    &:hover {
      background: ${props.theme?.colors?.hover || '#eeeeee'};
    }
  `}
`;
