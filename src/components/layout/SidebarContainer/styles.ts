import styled from 'styled-components';
import { theme } from '../../../styles/theme';

/* ===============================================
   SIDEBAR CONTAINER STYLES
   =============================================== */

export const SidebarContainerWrapper = styled.aside<{ $collapsed?: boolean }>`
  position: fixed;
  left: 0;
  top: 64px;
  width: ${props => (props.$collapsed ? '72px' : '280px')};
  height: calc(100vh - 64px);
  background: ${theme.colors.background.secondary};
  border-right: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  z-index: ${theme.zIndex.sidebar};
  transition: width 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;

  @media (prefers-color-scheme: dark) {
    background: #1e1e1e;
    border-right-color: #333333;
  }

  @media (max-width: 1024px) {
    position: fixed;
    left: ${props => (props.$collapsed ? '0' : '-280px')};
    z-index: calc(${theme.zIndex.sidebar} + 10);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    display: ${props => (props.$collapsed ? 'flex' : 'none')};
    width: 100%;
    height: calc(100vh - 64px);
    left: 0;
    border-right: none;
    border-bottom: 1px solid ${theme.colors.border};
  }

  @media print {
    display: none;
  }

  /* Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${theme.colors.text.secondary};
    }
  }
`;

/* ===============================================
   SIDEBAR HEADER (LOGO SECTION)
   =============================================== */

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md};
  border-bottom: 2px solid #d4af37;
  min-height: 80px;
  background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
  color: white;
  flex-shrink: 0;
`;

export const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

export const LogoBadge = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);

  span {
    font-size: 20px;
    font-weight: 800;
    color: white;
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 1px;
  }
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  animation: slideInFromLeft 0.4s ease 0.1s both;

  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export const LogoTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: white;
  line-height: 1.2;
  letter-spacing: 0.5px;
`;

export const LogoSubtitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.3px;
`;

/* ===============================================
   NAVIGATION AREA
   =============================================== */

export const SidebarNav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing.md} 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const NavGroup = styled.div`
  padding: 0 ${theme.spacing.sm};

  &.departments-group {
    border-top: 2px solid ${theme.colors.border};
    margin-top: ${theme.spacing.md};
    padding-top: ${theme.spacing.md};

    @media (prefers-color-scheme: dark) {
      border-top-color: #333333;
    }
  }
`;

/* ===============================================
   GROUP HEADER
   =============================================== */

export const GroupHeader = styled.button<{ $expanded?: boolean; $isDepartments?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${props =>
    props.$isDepartments
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'transparent'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: ${props =>
    props.$isDepartments ? 'white' : props.$expanded ? '#d4af37' : theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background: ${props =>
      props.$isDepartments
        ? 'linear-gradient(135deg, #5568d3 0%, #6a3f95 100%)'
        : theme.colors.background.tertiary};
    color: ${props => (props.$isDepartments ? 'white' : '#d4af37')};
    ${props => props.$isDepartments && 'transform: translateY(-1px);'}
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background: ${props =>
        !props.$isDepartments
          ? '#333333'
          : 'linear-gradient(135deg, #5568d3 0%, #6a3f95 100%)'};
    }
  }
`;

export const GroupToggle = styled.div<{ $rotated?: boolean }>`
  transition: transform 0.2s ease;
  transform: ${props => (props.$rotated ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

/* ===============================================
   GROUP ITEMS (EXPANDED)
   =============================================== */

export const GroupItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
`;

export const GroupItemsCollapsed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
`;

/* ===============================================
   NAVIGATION ITEM (EXPANDED MODE)
   =============================================== */

export const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => (props.$active ? '#d4af37' : theme.colors.text.primary)};
  transition: all 0.2s ease;
  user-select: none;
  text-align: left;
  position: relative;
  border-left: ${props => (props.$active ? '3px solid #d4af37' : '3px solid transparent')};
  padding-left: ${props => (props.$active ? 'calc(16px - 3px)' : '16px')};
  background: ${props => (props.$active ? '#ffebee' : 'transparent')};
  font-weight: ${props => (props.$active ? '600' : 'normal')};

  &:hover {
    background: ${props => (props.$active ? '#ffebee' : theme.colors.background.tertiary)};
    color: #d4af37;
    transform: translateX(4px);
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background: ${props => (props.$active ? 'rgba(212, 175, 55, 0.15)' : '#333333')};
    }

    background: ${props => (props.$active ? 'rgba(212, 175, 55, 0.15)' : 'transparent')};
  }
`;

export const NavIcon = styled.div`
  flex-shrink: 0;
  color: currentColor;
  transition: transform 0.2s ease;

  ${NavItem}:hover & {
    transform: scale(1.1);
  }
`;

export const NavLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
`;

/* ===============================================
   NAVIGATION ITEM (COLLAPSED/ICON MODE)
   =============================================== */

export const NavItemIcon = styled.button<{ $active?: boolean }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => (props.$active ? '#ffebee' : 'transparent')};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: ${props => (props.$active ? '#d4af37' : theme.colors.text.secondary)};
  transition: all 0.2s ease;
  user-select: none;
  position: relative;

  &:hover {
    background: theme.colors.background.tertiary;
    color: #d4af37;
    transform: scale(1.05);
  }

  @media (prefers-color-scheme: dark) {
    background: ${props => (props.$active ? 'rgba(212, 175, 55, 0.15)' : 'transparent')};

    &:hover {
      background: #333333;
    }
  }
`;

export const NavIconLarge = styled.div`
  flex-shrink: 0;
  color: currentColor;
`;

export const NavTooltip = styled.span`
  position: absolute;
  left: 72px;
  background: ${theme.colors.text.primary};
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  z-index: var(--z-tooltip, 700);
  transition: opacity 0.2s ease;

  ${NavItemIcon}:hover & {
    opacity: 1;
  }

  @media (prefers-color-scheme: dark) {
    background: #333333;
  }
`;

/* ===============================================
   DEPARTMENTS STYLE
   =============================================== */

export const DepartmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
`;

export const DepartmentItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DepartmentHeader = styled.button<{ $selected?: boolean; $deptColor?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px ${theme.spacing.md};
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  color: ${props => (props.$selected ? props.$deptColor : theme.colors.text.primary)};
  font-size: 13px;
  font-weight: ${props => (props.$selected ? '600' : '500')};
  transition: all 0.2s ease;
  user-select: none;
  position: relative;
  border-left: ${props => (props.$selected ? `3px solid ${props.$deptColor}` : '3px solid transparent')};
  padding-left: ${props => (props.$selected ? 'calc(16px - 3px)' : '16px')};
  background: ${props =>
    props.$selected ? `rgba(102, 126, 234, 0.1)` : 'transparent'};

  &:hover {
    background: ${theme.colors.background.tertiary};
    border-color: ${props => props.$deptColor || '#667eea'};
    color: ${props => props.$deptColor || '#667eea'};
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background: rgba(102, 126, 234, 0.1);
    }
  }
`;

export const DeptIcon = styled.div<{ $deptColor?: string }>`
  flex-shrink: 0;
  color: ${props => props.$deptColor || '#667eea'};
`;

export const DeptLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DeptToggle = styled.div<{ $rotated?: boolean; $deptColor?: string }>`
  flex-shrink: 0;
  transition: transform 0.2s ease;
  color: ${props => props.$deptColor || '#667eea'};
  transform: ${props => (props.$rotated ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

/* ===============================================
   DEPARTMENT SERVICES
   =============================================== */

export const DepartmentServices = styled.div<{ $deptColor?: string }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-left: 12px;
  margin-top: 4px;
  padding-left: 12px;
  border-left: 2px solid ${props => props.$deptColor || '#667eea'};
`;

export const ServiceItem = styled.button<{ $active?: boolean; $deptColor?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  background: ${props =>
    props.$active ? 'rgba(102, 126, 234, 0.15)' : 'transparent'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: ${props => (props.$active ? props.$deptColor || '#667eea' : theme.colors.text.primary)};
  font-size: 12px;
  font-weight: ${props => (props.$active ? '500' : '400')};
  transition: all 0.2s ease;
  user-select: none;
  text-align: left;

  &:hover {
    background: rgba(102, 126, 234, 0.08);
    color: ${props => props.$deptColor || '#667eea'};
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background: rgba(102, 126, 234, 0.15);
    }

    background: ${props =>
      props.$active ? 'rgba(102, 126, 234, 0.2)' : 'transparent'};
  }
`;

export const ServiceDot = styled.span<{ $color?: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: ${props => props.$color || '#667eea'};
`;

export const ServiceLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* ===============================================
   DEPARTMENTS COLLAPSED (ICON MODE)
   =============================================== */

export const DepartmentsCollapsed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
  padding: 8px 0;
  border-top: 1px solid ${theme.colors.border};

  @media (prefers-color-scheme: dark) {
    border-top-color: #333333;
  }
`;

export const DeptIconBtn = styled.button<{ $active?: boolean; $deptColor?: string }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.$active ? 'rgba(102, 126, 234, 0.15)' : 'transparent'};
  border: 2px solid ${props => (props.$active ? props.$deptColor || '#667eea' : 'transparent')};
  border-radius: 10px;
  cursor: pointer;
  color: ${props => props.$deptColor || '#667eea'};
  transition: all 0.2s ease;
  user-select: none;
  position: relative;
  box-shadow: ${props =>
    props.$active ? 'rgba(102, 126, 234, 0.2) 0 0 0 2px' : 'none'};

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: ${props => props.$deptColor || '#667eea'};
    transform: scale(1.08);
  }

  @media (prefers-color-scheme: dark) {
    background: ${props =>
      props.$active ? 'rgba(102, 126, 234, 0.25)' : 'transparent'};

    &:hover {
      background: rgba(102, 126, 234, 0.2);
    }

    box-shadow: ${props =>
      props.$active
        ? 'rgba(102, 126, 234, 0.3) 0 0 0 2px'
        : 'none'};
  }
`;

/* Admin Section (Last Group) */
export const AdminGroupHeader = styled(GroupHeader)`
  background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
  color: white;
  margin: 8px 0;

  &:hover {
    background: linear-gradient(135deg, #b8860b 0%, #9A7209 100%);
    transform: translateY(-1px);
  }
`;

export const AdminNavItem = styled(NavItem)`
  border-left: 3px solid transparent;
  color: #d4af37;

  &:hover {
    background: #ffebee;
    border-left-color: #d4af37;
  }

  &.active {
    background: #ffcccc;
    color: #b8860b;
    border-left-color: #b8860b;
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background: rgba(212, 175, 55, 0.15);
    }

    &.active {
      background: rgba(212, 175, 55, 0.25);
      color: #f0d060;
    }
  }
`;
