import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const MegaNavHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-navbar, 300);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  [data-theme='dark'] & {
    background: rgba(0, 0, 0, 0.6);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
`;

export const MegaNav = styled.nav`
  width: 100%;
`;

export const MegaNavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  gap: 1rem;
  
  @media (max-width: 1024px) {
    height: 68px;
    padding: 0 1rem;
  }
  
  @media (max-width: 768px) {
    height: 64px;
    padding: 0 1rem;
  }
`;

export const MegaNavLogo = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

export const LogoImage = styled.img`
  height: 50px;
  width: auto;
  object-fit: contain;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  [data-theme='dark'] & {
    filter: brightness(1.1);
  }
  
  ${MegaNavLogo}:hover & {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    height: 40px;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

export const HamburgerIcon = styled.span<{ $open?: boolean }>`
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  span {
    display: block;
    width: 100%;
    height: 2px;
    background: #333;
    border-radius: 2px;
    transition: all 0.3s ease;
    
    [data-theme='dark'] & {
      background: #fff;
    }
  }
  
  ${({ $open }) => $open && `
    span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    span:nth-child(2) {
      opacity: 0;
    }
    
    span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  `}
`;

export const MegaNavMenu = styled.div<{ $mobileOpen?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    align-items: stretch;
    background: #fff;
    padding: 1rem;
    transform: translateX(${({ $mobileOpen }) => ($mobileOpen ? 0 : 100)}%);
    transition: transform 0.3s ease;
    overflow-y: auto;
    z-index: var(--z-navbar, 300);
    
    [data-theme='dark'] & {
      background: #1a1a2e;
    }
  }
`;

export const MegaNavList = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.25rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    width: 100%;
  }
`;

export const MegaNavItem = styled.li<{ $isSimple?: boolean }>`
  position: relative;
  
  @media (max-width: 768px) {
    border-bottom: 1px solid #e0e0e0;
    
    [data-theme='dark'] & {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const MegaNavTrigger = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  
  [data-theme='dark'] & {
    color: #fff;
  }
  
  &:hover {
    background: #f5f5f5;
    color: #c41835;
    
    [data-theme='dark'] & {
      background: rgba(255, 255, 255, 0.08);
      color: #ff6b6b;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    padding: 1rem;
  }
`;

export const MegaNavLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  
  [data-theme='dark'] & {
    color: #fff;
  }
  
  &:hover {
    background: #f5f5f5;
    color: #c41835;
    
    [data-theme='dark'] & {
      background: rgba(255, 255, 255, 0.08);
      color: #ff6b6b;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    padding: 1rem;
  }
`;

export const DropdownArrow = styled.svg`
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
`;

export const MegaDropdown = styled.div<{ $active?: boolean }>`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(${({ $active }) => ($active ? 0 : 10)}px);
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  visibility: ${({ $active }) => ($active ? 'visible' : 'hidden')};
  pointer-events: ${({ $active }) => ($active ? 'auto' : 'none')};
  transition: all 0.25s ease;
  padding-top: 0.75rem;
  z-index: var(--z-dropdown, 100);
  
  @media (max-width: 1024px) {
    min-width: 500px;
  }
  
  @media (max-width: 768px) {
    position: static;
    transform: none;
    padding: 0;
    max-height: ${({ $active }) => ($active ? 1000 : 0)}px;
    overflow: hidden;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition: max-height 0.3s ease;
  }
`;

export const MegaDropdownContent = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #e0e0e0;
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr) 1fr;
  min-width: 800px;
  overflow: hidden;
  
  [data-theme='dark'] & {
    background: #2a2a3e;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    min-width: 500px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    min-width: 100%;
    box-shadow: none;
    border: none;
    border-radius: 0;
  }
`;

export const MegaCol = styled.div`
  padding: 1.5rem;
  
  h4 {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #999;
    margin-bottom: 1rem;
    margin-top: 0;
    
    [data-theme='dark'] & {
      color: rgba(255, 255, 255, 0.6);
    }
  }
`;

export const MegaFeatured = styled(MegaCol)`
  background: #f9f9f9;
  border-right: 1px solid #e0e0e0;
  
  [data-theme='dark'] & {
    background: #3a3a4e;
    border-right-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    
    [data-theme='dark'] & {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const FeaturedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FeaturedItem = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: #fff;
    
    [data-theme='dark'] & {
      background: #2a2a3e;
    }
  }
`;

export const FeaturedIcon = styled.span`
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  flex-shrink: 0;
  
  [data-theme='dark'] & {
    background: #2a2a3e;
  }
`;

export const FeaturedText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const FeaturedTitle = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #333;
  
  [data-theme='dark'] & {
    color: #fff;
  }
`;

export const FeaturedDesc = styled.span`
  font-size: 0.8125rem;
  color: #999;
  
  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const MegaLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 0.25rem;
    
    a {
      display: block;
      padding: 0.5rem 0.75rem;
      font-size: 0.9375rem;
      color: #666;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s ease;
      
      [data-theme='dark'] & {
        color: rgba(255, 255, 255, 0.7);
      }
      
      &:hover {
        background: #f5f5f5;
        color: #c41835;
        padding-left: 1rem;
        
        [data-theme='dark'] & {
          background: rgba(255, 255, 255, 0.08);
          color: #ff6b6b;
        }
      }
    }
  }
`;

export const MegaCTA = styled.div`
  background: linear-gradient(135deg, #c41835 0%, #8b0d2e 100%);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
    display: none;
  }
`;

export const MegaCTAContent = styled.div`
  text-align: center;
  
  h4 {
    color: white;
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
    font-weight: 600;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
    margin: 0 0 1rem 0;
  }
  
  a {
    background: white;
    color: #c41835;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9375rem;
    display: inline-block;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    
    &:hover {
      background: #f5f5f5;
      transform: translateY(-2px);
    }
  }
`;

export const MegaNavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 1rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    margin: 1rem 0 0;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
    justify-content: center;
    width: 100%;
    
    [data-theme='dark'] & {
      border-top-color: rgba(255, 255, 255, 0.1);
    }
  }
`;
