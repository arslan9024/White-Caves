import styled from 'styled-components';
import { theme } from '../../../styles/theme';

/* ===============================================
   RIGHT PANEL CONTAINER
   =============================================== */

export const RightPanelRoot = styled.div<{
  $isMobile?: boolean;
  $isTablet?: boolean;
  $isOpen?: boolean;
}>`
  position: fixed;
  right: 0;
  top: 64px;
  width: ${props => props.$isTablet ? '300px' : '360px'};
  height: calc(100vh - 64px);
  background: ${theme.colors.background.primary};
  border-left: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  z-index: ${theme.zIndex.sidebar};
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  animation: slideInFromRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideInFromRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (prefers-color-scheme: dark) {
    background: #1e1e1e;
    border-left-color: #333333;
  }

  /* Mobile Drawer Layout */
  @media (max-width: 767px) {
    ${props => props.$isMobile && `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      top: auto;
      width: 100%;
      height: 70vh;
      max-height: 600px;
      border-left: none;
      border-top: 1px solid ${theme.colors.border};
      border-radius: 16px 16px 0 0;
      animation: slideInFromBottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `}

    ${props => !props.$isMobile && `
      display: none;
    `}
  }

  @keyframes slideInFromBottom {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

/* ===============================================
   PANEL HEADER
   =============================================== */

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: white;
  flex-shrink: 0;
`;

export const PanelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const PanelCloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

/* ===============================================
   SEARCH SECTION
   =============================================== */

export const PanelSearchSection = styled.div`
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.secondary};
  border-bottom: 1px solid ${theme.colors.border};
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    background: #2a2a2a;
  }
`;

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${theme.colors.background.primary};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 0 ${theme.spacing.sm};
  gap: ${theme.spacing.sm};
  transition: all 0.2s ease;

  @media (prefers-color-scheme: dark) {
    background: #333333;
    border-color: #444444;
  }

  &:focus-within {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primaryVeryLight};
  }
`;

export const SearchIcon = styled.div`
  color: ${theme.colors.text.secondary};
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: ${theme.spacing.sm} 0;
  font-size: 14px;
  color: ${theme.colors.text.primary};

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;

export const SearchClearButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  font-size: 18px;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

/* ===============================================
   PANEL CONTENT
   =============================================== */

export const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${theme.spacing.sm} 0;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.text.secondary};
  }
`;

/* ===============================================
   ASSISTANT GROUP
   =============================================== */

export const AssistantGroup = styled.div`
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const GroupHeaderButton = styled.button<{ $expanded?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${props => (props.$expanded ? theme.colors.primaryVeryLight : 'transparent')};
  border: none;
  border-top: 1px solid ${theme.colors.border};
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: ${props => (props.$expanded ? theme.colors.primary : theme.colors.text.secondary)};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  text-align: left;

  @media (prefers-color-scheme: dark) {
    ${props => props.$expanded && `background: rgba(211, 47, 47, 0.1);`}
  }

  &:hover {
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.primary};

    @media (prefers-color-scheme: dark) {
      background: #333333;
    }
  }
`;

export const ToggleIcon = styled.div<{ $rotated?: boolean }>`
  transition: transform 0.2s ease;
  ${props => props.$rotated && 'transform: rotate(90deg);'}
  display: flex;
  align-items: center;
`;

/* ===============================================
   ASSISTANTS LIST
   =============================================== */

export const GroupAssistants = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px ${theme.spacing.sm};
`;

export const AssistantItemButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${props => (props.$active ? theme.colors.primaryVeryLight : 'transparent')};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  position: relative;
  color: ${props => (props.$active ? theme.colors.primary : theme.colors.text.primary)};

  @media (prefers-color-scheme: dark) {
    ${props => props.$active && `background: rgba(211, 47, 47, 0.15);`}
  }

  &:hover {
    background: ${theme.colors.background.secondary};
    transform: translateX(4px);

    @media (prefers-color-scheme: dark) {
      background: #333333;
    }
  }

  &:active {
    transform: translateX(2px);
  }
`;

export const AssistantAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  @media (prefers-color-scheme: dark) {
    background: #333333;
  }

  ${AssistantItemButton}:hover & {
    background: ${theme.colors.primary};
    color: white;
    transform: scale(1.05);
  }
`;

export const AssistantInfo = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const AssistantName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AssistantRole = styled.div`
  font-size: 11px;
  color: ${theme.colors.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* ===============================================
   NOTIFICATION BADGE
   =============================================== */

export const NotificationBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: ${theme.colors.primary};
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
`;

/* ===============================================
   PANEL FOOTER
   =============================================== */

export const PanelFooter = styled.div`
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
  background: ${theme.colors.background.secondary};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (prefers-color-scheme: dark) {
    background: #2a2a2a;
  }
`;

export const FooterHint = styled.div`
  font-size: 11px;
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const KeyboardKey = styled.kbd`
  background: ${theme.colors.background.primary};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 2px 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 10px;
  font-weight: 600;

  @media (prefers-color-scheme: dark) {
    background: #333333;
    border-color: #444444;
  }
`;
