import styled from 'styled-components';

export const MobileNavOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, ${({ $isOpen }) => ($isOpen ? 0.6 : 0)});
  backdrop-filter: blur(${({ $isOpen }) => ($isOpen ? 4 : 0)}px);
  -webkit-backdrop-filter: blur(${({ $isOpen }) => ($isOpen ? 4 : 0)}px);
  z-index: var(--z-modalBackdrop, 400);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
`;

export const MobileNavContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  max-width: 85vw;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  z-index: var(--z-overlay, 600);
  transform: translateX(${({ $isOpen }) => ($isOpen ? 0 : 100)}%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(212, 175, 55, 0.2);
  
  /* Dark theme support */
  [data-theme='dark'] & {
    background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

export const MobileNavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const MobileNavLogo = styled.img`
  height: 40px;
  border-radius: 8px;
  object-fit: contain;
  
  @media (max-width: 768px) {
    height: 36px;
  }
`;

export const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-weight: 300;
  line-height: 1;
  
  &:hover {
    background: rgba(255, 100, 100, 0.3);
    border-color: #ff6464;
    transform: rotate(90deg);
  }
  
  &:active {
    transform: rotate(90deg) scale(0.95);
  }
  
  /* Dark theme support */
  [data-theme='dark'] & {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.08);
    
    &:hover {
      background: rgba(255, 100, 100, 0.25);
    }
  }
`;

export const MobileNavContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(212, 175, 55, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(212, 175, 55, 0.5);
    }
  }
  
  [data-theme='dark'] & {
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.03);
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(212, 175, 55, 0.25);
    }
  }
`;

export const MobileHomeButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(184, 134, 11, 0.2));
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  color: #D4AF37;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  text-align: left;
  
  span {
    font-size: 18px;
    flex-shrink: 0;
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(184, 134, 11, 0.3));
    transform: translateX(4px);
  }
  
  &:active {
    transform: translateX(2px) scale(0.98);
  }
  
  /* Dark theme support */
  [data-theme='dark'] & {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(184, 134, 11, 0.15));
    border-color: rgba(212, 175, 55, 0.25);
    
    &:hover {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(184, 134, 11, 0.25));
    }
  }
`;

export const MobileNavSection = styled.div`
  margin-bottom: 8px;
`;

export const SectionToggle = styled.button<{ $expanded?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover,
  &[aria-expanded='true'] {
    background: rgba(255, 255, 255, 0.1);
  }
  
  /* Dark theme support */
  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.04);
    
    &:hover,
    &[aria-expanded='true'] {
      background: rgba(255, 255, 255, 0.08);
    }
  }
`;

export const ToggleIcon = styled.span`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  
  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.4);
  }
`;

export const SectionLinks = styled.div`
  padding: 8px 0 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: slideDown 0.3s ease-out;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
      overflow: hidden;
    }
    to {
      opacity: 1;
      max-height: 1000px;
      overflow: visible;
    }
  }`;

export const SectionLink = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  width: 100%;
  
  span:first-child {
    font-size: 16px;
    flex-shrink: 0;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
    padding-left: 20px;
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.12);
  }
  
  /* Dark theme support */
  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.75);
    
    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: white;
    }
  }
`;

export const MobileNavFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
  
  [data-theme='dark'] & {
    border-top-color: rgba(255, 255, 255, 0.08);
  }
`;

export const FooterButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(184, 134, 11, 0.2));
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  color: #D4AF37;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(184, 134, 11, 0.3));
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  [data-theme='dark'] & {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(184, 134, 11, 0.15));
    border-color: rgba(212, 175, 55, 0.25);
  }
`;
