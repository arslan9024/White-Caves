import styled from 'styled-components';

export const SidebarContainer = styled.div<{ collapsed: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${props => props.collapsed ? '72px' : '280px'};
  background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 72px;
`;

export const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  flex: 1;
`;

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const LogoLetter = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: white;
  font-family: 'Montserrat', sans-serif;
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  min-width: 0;
`;

export const LogoTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LogoSubtitle = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CollapseBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const SidebarNav = styled.nav`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
`;

export const NavSection = styled.div`
  margin-bottom: 24px;
  padding: 0 12px;
`;

export const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255, 255, 255, 0.4);
`;

export const AssistantCount = styled.span`
  background: rgba(220, 38, 38, 0.2);
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const NavItem = styled.button<{ active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${props => props.active ? 'linear-gradient(90deg, rgba(220, 38, 38, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)' : 'transparent'};
  border: ${props => props.active ? '1px solid transparent' : 'none'};
  border-left: ${props => props.active ? '3px solid #dc2626' : 'none'};
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  margin-left: ${props => props.active ? '-3px' : '0'};

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }

  svg {
    flex-shrink: 0;
    opacity: ${props => props.active ? '1' : '0.8'};
    color: ${props => props.active ? '#dc2626' : 'inherit'};
  }
`;

export const NavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const NavLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DepartmentsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const DepartmentGroup = styled.li`
  width: 100%;
`;

export const Department = styled.div`
  padding: 0;
`;

export const DepartmentToggle = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }

  svg {
    flex-shrink: 0;
    opacity: 0.8;
  }
`;

export const DepartmentLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AssistantsList = styled.ul`
  list-style: none;
  padding: 0 0 0 12px;
  margin: 4px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const AssistantItem = styled.button<{ active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: ${props => props.active ? '#dc2626' : 'rgba(255, 255, 255, 0.6)'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 13px;
  font-weight: 400;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }

  svg {
    flex-shrink: 0;
    opacity: 0.7;
  }
`;

export const SidebarFooter = styled.div`
  padding: 16px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FooterButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }

  svg {
    flex-shrink: 0;
    opacity: 0.8;
  }
`;
