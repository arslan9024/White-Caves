import styled from 'styled-components';
import { keyframes } from 'styled-components';
import { transitions } from '../../../styles/theme/transitions';
import { typography } from '../../../styles/theme/typography';
import { radius } from '../../../styles/theme/radius';

const badgePulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

export const PersistentSidebarContainer = styled.div<{ $collapsed?: boolean }>`
  position: fixed;
  right: 0;
  top: 60px;
  bottom: 0;
  width: ${props => props.$collapsed ? '72px' : '280px'};
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  z-index: var(--z-sidebar, 310);
  transition: width 0.3s ease;

  @media (prefers-color-scheme: dark) {
    background: rgba(10, 10, 15, 0.98);
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

export const CollapseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${transitions.hover};
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

export const SidebarTitle = styled.div`
  font-size: 0.875rem;
  font-weight: ${typography.weights.semibold};
  color: #fff;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

export const DepartmentGroup = styled.div`
  margin-bottom: 0.5rem;
`;

export const DepartmentHeader = styled.div<{ $departmentColor?: string }>`
  font-size: 0.625rem;
  font-weight: ${typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: ${radius.sm};
  margin-bottom: 0.25rem;
  opacity: 0.9;
  background: ${props => props.$departmentColor + '40' || 'rgba(255, 255, 255, 0.05)'};
`;

export const DepartmentAssistants = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const AssistantTileContainer = styled.button<{ $active?: boolean; $tileColor?: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  background: ${props => props.$active ? `rgba(${props.$tileColor}, 0.15)` : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.$active ? `#${props.$tileColor}` : 'transparent'};
  border-radius: ${radius.lg};
  cursor: pointer;
  transition: ${transitions.hover};
  width: 100%;
  text-align: left;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &.collapsed {
    justify-content: center;
    padding: 0.75rem;
  }
`;

export const TileAvatar = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const TileEmoji = styled.span`
  font-size: 1.25rem;
  line-height: 1;
`;

export const TileInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const TileName = styled.span`
  font-size: 0.8125rem;
  font-weight: ${typography.weights.semibold};
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TileTitle = styled.span`
  font-size: 0.6875rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TileAction = styled.button`
  width: 28px;
  height: 28px;
  border-radius: ${radius.md};
  background: transparent;
  border: none;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: ${transitions.hover};
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  ${AssistantTileContainer}:hover & {
    opacity: 1;
  }
`;

export const NotificationBadgeContainer = styled.div<{ 
  $size?: 'small' | 'medium' | 'large';
  $severity?: 'default' | 'info' | 'warning' | 'critical' | 'success';
  $pulse?: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.weights.bold};
  border-radius: ${radius.full};
  line-height: 1;
  
  ${props => {
    switch (props.$size) {
      case 'small':
        return `min-width: 16px; height: 16px; font-size: 0.625rem; padding: 0 4px;`;
      case 'large':
        return `min-width: 24px; height: 24px; font-size: 0.75rem; padding: 0 8px;`;
      default:
        return `min-width: 20px; height: 20px; font-size: 0.6875rem; padding: 0 6px;`;
    }
  }}

  ${props => {
    switch (props.$severity) {
      case 'info':
        return `background: #3B82F6; color: #fff;`;
      case 'warning':
        return `background: #F59E0B; color: #000;`;
      case 'critical':
        return `background: #EF4444; color: #fff;`;
      case 'success':
        return `background: #10B981; color: #fff;`;
      default:
        return `background: #475569; color: #fff;`;
    }
  }}

  ${props => props.$pulse && `
    animation: ${badgePulse} 2s ease-in-out infinite;
  `}
`;

export const SidebarFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
`;