import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  background: ${props => props.theme?.colors?.bgPrimary || '#ffffff'};
  border-right: 1px solid ${props => props.theme?.colors?.borderColor || '#e0e0e0'};
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
    border-right: none;
  }
`;

export const NavHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const NavLogo = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;

  img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
  }

  span {
    font-size: 1.125rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textPrimary || '#333333'};
  }
`;

export const MobileMenuToggle = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${props => props.theme?.colors?.textPrimary || '#333333'};
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const RoleBadge = styled.div<{ roleColor?: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme?.colors?.bgTertiary || '#f5f5f5'};
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.roleColor || '#c41835'};

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const RoleIcon = styled.span`
  font-size: 1.5rem;
`;

export const RoleLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textPrimary || '#333333'};
`;

export const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

export const NavItem = styled.a<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: ${props => props.isActive 
    ? (props.theme?.colors?.primary || '#0066cc')
    : (props.theme?.colors?.textSecondary || '#666666')
  };
  transition: all 0.2s ease;
  background: ${props => props.isActive 
    ? (props.theme?.colors?.primaryLight || '#e6f2ff')
    : 'transparent'
  };
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: ${props => props.isActive ? '600' : '500'};

  &:hover {
    background: ${props => props.theme?.colors?.hover || '#f5f5f5'};
    color: ${props => props.theme?.colors?.primary || '#0066cc'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const NavFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme?.colors?.borderColor || '#e0e0e0'};
`;
