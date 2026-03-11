import styled from 'styled-components';

// ============================================================================
// CONTAINER STYLES (with slide animation for enhanced version)
// ============================================================================

export const SidebarContainer = styled.aside<{ $collapsed?: boolean; $hidden?: boolean }>`
  position: fixed;
  left: 0;
  top: 64px;
  height: calc(100vh - 64px);
  width: 280px;
  background: #FFFFFF;
  border-right: 1px solid #E0E0E0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  transform: translateX(${props => props.$hidden ? '-100%' : '0'});

  ${props =>
    props.$collapsed &&
    `
    width: 72px;
  `}

  /* Dark theme */
  [data-theme='dark'] & {
    background: #1A1A2E;
    border-right-color: rgba(255, 255, 255, 0.1);
  }

  /* Tablet and below */
  @media (max-width: 1024px) {
    ${props => !props.$hidden && 'transform: translateX(0);'}
    ${props => props.$hidden && 'transform: translateX(-100%);'}
  }
`;

// ============================================================================
// HEADER STYLES
// ============================================================================

export const SidebarHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #E8E8E8;
  min-height: 64px;
  gap: 12px;

  [data-theme='dark'] & {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
`;

export const SidebarLogo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  overflow: hidden;
`;

export const LogoMark = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  & span {
    font-size: 20px;
    font-weight: 800;
    color: white;
    font-family: 'Montserrat', sans-serif;
  }
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  white-space: nowrap;
`;

export const LogoTitle = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #212121;
  line-height: 1.2;

  [data-theme='dark'] & {
    color: #FFFFFF;
  }
`;

export const LogoTagline = styled.span`
  font-size: 11px;
  color: #757575;
  font-weight: 500;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const CollapseToggle = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  background: #FFFFFF;
  color: #757575;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;

  &:hover {
    background: #F5F5F5;
    border-color: #BDBDBD;
    color: #212121;
  }

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
    }
  }
`;

// ============================================================================
// ZOE COMMAND HUB STYLES
// ============================================================================

export const ZoeCommandHub = styled.div<{ $active?: boolean; $collapsed?: boolean }>`
  margin: ${props => props.$collapsed ? '12px 8px' : '16px 12px'};
  padding: ${props => props.$collapsed ? '12px' : '14px'};
  background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  position: relative;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.25);
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(211, 47, 47, 0.3);
  }

  ${props =>
    props.$active &&
    `
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.3), 0 4px 12px rgba(211, 47, 47, 0.25);
  `}
`;

export const HubIcon = styled.div<{ $collapsed?: boolean }>`
  width: ${props => props.$collapsed ? '36px' : '40px'};
  height: ${props => props.$collapsed ? '36px' : '40px'};
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

export const HubContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const HubHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

export const HubTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
`;

export const HubStatus = styled.span<{ $online?: boolean }>`
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${props => props.$online ? 'rgba(46, 125, 50, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const HubStats = styled.div`
  display: flex;
  gap: 12px;
`;

export const HubStat = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
`;

export const CollapsedBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #FFFFFF;
  color: #D32F2F;
  font-size: 10px;
  font-weight: 700;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// ============================================================================
// SEARCH BAR STYLES (Enhanced Feature)
// ============================================================================

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #F8F9FA;
  border-bottom: 1px solid #E8E8E8;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
`;

export const SearchInputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 0 10px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #D32F2F;
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);

    &:focus-within {
      border-color: #EF5350;
      box-shadow: 0 0 0 3px rgba(239, 83, 80, 0.1);
    }
  }
`;

export const SearchIcon = styled.div`
  color: #9E9E9E;
  flex-shrink: 0;
  display: flex;
  align-items: center;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px;
  font-size: 13px;
  color: #212121;
  outline: none;

  &::placeholder {
    color: #9E9E9E;
  }

  [data-theme='dark'] & {
    color: #FFFFFF;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const SearchClear = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #9E9E9E;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.15s ease;

  &:hover {
    background: #F5F5F5;
    color: #616161;
  }

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.5);

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);
    }
  }
`;

export const FilterToggle = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  background: ${props => props.$active ? '#D32F2F' : '#FFFFFF'};
  color: ${props => props.$active ? 'white' : '#757575'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;

  &:hover {
    background: ${props => props.$active ? '#C62828' : '#F5F5F5'};
    border-color: ${props => props.$active ? '#C62828' : '#BDBDBD'};
  }

  [data-theme='dark'] & {
    background: ${props => props.$active ? '#EF5350' : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${props => props.$active ? '#EF5350' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.7)'};

    &:hover {
      background: ${props => props.$active ? '#E53935' : 'rgba(255, 255, 255, 0.1)'};
    }
  }
`;

// ============================================================================
// FILTER DROPDOWN STYLES
// ============================================================================

export const FilterDropdown = styled.div`
  background: #FFFFFF;
  border-bottom: 1px solid #E8E8E8;
  padding: 12px;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  [data-theme='dark'] & {
    background: #1A1A2E;
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
`;

export const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #616161;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const ClearFiltersButton = styled.button`
  background: none;
  border: none;
  color: #D32F2F;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-transform: none;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }

  [data-theme='dark'] & {
    color: #EF5350;
  }
`;

export const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

export const FilterOption = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  background: ${props => props.$active ? '#FFEBEE' : 'transparent'};
  border: none;
  color: ${props => props.$active ? '#D32F2F' : '#616161'};
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  transition: all 0.15s ease;

  &:hover {
    background: #F5F5F5;
  }

  [data-theme='dark'] & {
    color: ${props => props.$active ? '#EF5350' : 'rgba(255, 255, 255, 0.7)'};
    background: ${props => props.$active ? 'rgba(211, 47, 47, 0.15)' : 'transparent'};

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }
`;

export const DeptColorDot = styled.span<{ $color?: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: ${props => props.$color || '#9E9E9E'};
`;

export const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px;
  background: #F8F9FA;
  border-bottom: 1px solid #E8E8E8;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
`;

export const FilterTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  font-size: 11px;
  color: #616161;

  [data-theme='dark'] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
  }

  & button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #9E9E9E;
    display: flex;
    align-items: center;

    &:hover {
      color: #D32F2F;
    }

    [data-theme='dark'] & {
      color: rgba(255, 255, 255, 0.5);

      &:hover {
        color: #EF5350;
      }
    }
  }
`;

export const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: #9E9E9E;
  font-size: 13px;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.5);
  }
`;

// ============================================================================
// NAVIGATION STYLES
// ============================================================================

export const SidebarNav = styled.nav`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #E0E0E0;
    border-radius: 2px;

    &:hover {
      background: #BDBDBD;
    }
  }

  [data-theme='dark'] & {
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
`;

export const NavSection = styled.div`
  margin-bottom: 20px;
  padding: 0 12px;
`;

export const SectionLabel = styled.div<{ $collapsed?: boolean }>`
  display: ${props => props.$collapsed ? 'none' : 'flex'};
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #9E9E9E;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const SectionCount = styled.span`
  background: #FFEBEE;
  color: #D32F2F;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;

  [data-theme='dark'] & {
    background: rgba(211, 47, 47, 0.2);
  }
`;

export const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const NavItem = styled.button<{ $active?: boolean; $collapsed?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${props => props.$collapsed ? '10px' : '10px 12px'};
  border-radius: 8px;
  background: ${props =>
    props.$active ? '#FFEBEE' : 'transparent'};
  border: none;
  color: ${props => props.$active ? '#D32F2F' : '#616161'};
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};

  &:hover {
    background: #F5F5F5;
    color: #212121;
  }

  [data-theme='dark'] & {
    color: ${props => props.$active ? '#EF5350' : 'rgba(255, 255, 255, 0.7)'};
    background: ${props => props.$active ? 'rgba(211, 47, 47, 0.15)' : 'transparent'};

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
    }
  }
`;

export const NavIcon = styled.span`
  flex-shrink: 0;
`;

export const NavLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// ============================================================================
// DEPARTMENT STYLES
// ============================================================================

export const DepartmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DepartmentGroup = styled.div<{ $hasActive?: boolean }>`
  border-radius: 8px;
  overflow: hidden;
  background: ${props => props.$hasActive ? '#FAFAFA' : 'transparent'};

  [data-theme='dark'] & {
    background: ${props => props.$hasActive ? 'rgba(255, 255, 255, 0.03)' : 'transparent'};
  }
`;

export const DepartmentHeader = styled.button<{ $collapsed?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${props => props.$collapsed ? '10px' : '8px 10px'};
  border-radius: 8px;
  background: transparent;
  border: none;
  color: #616161;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};

  &:hover {
    background: #F5F5F5;
    color: #212121;
  }

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
    }
  }
`;

export const DeptIndicator = styled.div<{ $collapsed?: boolean }>`
  width: 4px;
  height: 20px;
  border-radius: 2px;
  flex-shrink: 0;
  display: ${props => props.$collapsed ? 'none' : 'block'};
`;

export const DeptLabel = styled.span<{ $collapsed?: boolean }>`
  flex: 1;
  white-space: nowrap;
  display: ${props => props.$collapsed ? 'none' : 'block'};
`;

export const DeptMeta = styled.div<{ $collapsed?: boolean }>`
  display: ${props => props.$collapsed ? 'none' : 'flex'};
  align-items: center;
  gap: 6px;
`;

export const DeptNotif = styled.span`
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #D32F2F;
  color: white;
  font-size: 9px;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DeptCount = styled.span`
  font-size: 11px;
  color: #9E9E9E;
  font-weight: 500;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.5);
  }
`;

// ============================================================================
// ASSISTANT STYLES
// ============================================================================

export const AssistantList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 0 14px;
  border-left: 1px solid #E8E8E8;

  [data-theme='dark'] & {
    border-left-color: rgba(255, 255, 255, 0.1);
  }
`;

export const AssistantItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  margin-left: -1px;
  border-left: 2px solid transparent;
  border-left-color: ${props => props.$active ? '#D32F2F' : 'transparent'};
  background: ${props => props.$active ? '#FFEBEE' : 'transparent'};
  border-top: none;
  border-right: none;
  border-bottom: none;
  color: ${props => props.$active ? '#D32F2F' : '#757575'};
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  font-size: 13px;

  &:hover {
    background: #F5F5F5;
    color: #212121;
    border-left-color: #E0E0E0;
  }

  [data-theme='dark'] & {
    color: ${props => props.$active ? '#EF5350' : 'rgba(255, 255, 255, 0.7)'};
    background: ${props => props.$active ? 'rgba(211, 47, 47, 0.15)' : 'transparent'};
    border-left-color: ${props => props.$active ? '#EF5350' : 'transparent'};

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
      border-left-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

export const AssistantStatus = styled.div`
  flex-shrink: 0;
`;

export const StatusDot = styled.span<{ $status?: 'online' | 'idle' | 'error' }>`
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => {
    switch (props.$status) {
      case 'online':
        return '#2E7D32';
      case 'idle':
        return '#F57C00';
      case 'error':
        return '#C62828';
      default:
        return '#9E9E9E';
    }
  }};
`;

export const AssistantIcon = styled.div<{ $active?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${props =>
    props.$active ? 'rgba(211, 47, 47, 0.1)' : '#F5F5F5'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$active ? '#D32F2F' : '#757575'};
  flex-shrink: 0;
  transition: all 0.15s ease;

  [data-theme='dark'] & {
    background: ${props =>
      props.$active ? 'rgba(211, 47, 47, 0.2)' : 'rgba(255, 255, 255, 0.08)'};
    color: ${props => props.$active ? '#EF5350' : 'rgba(255, 255, 255, 0.7)'};
  }
`;

export const AssistantInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AssistantName = styled.span`
  display: block;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AssistantDesc = styled.span`
  display: block;
  font-size: 11px;
  color: #9E9E9E;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const AssistantBadge = styled.span`
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #D32F2F;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// ============================================================================
// FOOTER STYLES
// ============================================================================

export const SidebarFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #E8E8E8;

  [data-theme='dark'] & {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
`;

export const FooterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Version = styled.span`
  font-size: 11px;
  color: #9E9E9E;
  font-weight: 500;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.4);
  }
`;

export const FooterStatus = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #757575;

  [data-theme='dark'] & {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const StatusIndicator = styled.span<{ $online?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.$online ? '#2E7D32' : '#9E9E9E'};
`;
