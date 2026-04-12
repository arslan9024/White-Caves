import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors, shadows, transitions, radius, spacing } = theme;

export const AssistantSidebarContainer = styled.div<{ $collapsed?: boolean; $sidebarAccent?: string }>`
  --sidebar-accent: ${props => props.$sidebarAccent || colors.info};
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-secondary);
  border-radius: ${radius.xl};
  overflow: hidden;
  transition: all ${transitions.durations.standard} ${transitions.easing.easeOut};

  @media (prefers-color-scheme: dark) {
    background: ${colors.background.dark};
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);

  @media (prefers-color-scheme: dark) {
    border-color: ${colors.background.darkSecondary};
  }
`;

export const AssistantAvatar = styled.div<{ $background?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: ${props => props.$background || 'rgba(14, 165, 233, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;
  line-height: 1;
`;

export const AssistantInfo = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (prefers-color-scheme: dark) {
    h3 {
      color: #e2e8f0;
    }
  }
`;

export const AssistantTitle = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (prefers-color-scheme: dark) {
    color: #a0aec0;
  }
`;

export const FavoriteButton = styled.button<{ $isFavorite?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${radius.lg};
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${transitions.hover};
  flex-shrink: 0;

  &:hover {
    background: rgba(14, 165, 233, 0.1);
    border-color: var(--primary);
    color: var(--primary);
  }

  ${props => props.$isFavorite && `
    background: rgba(14, 165, 233, 0.15);
    border-color: var(--primary);
    color: var(--primary);
  `}

  @media (prefers-color-scheme: dark) {
    border-color: #333333;
    color: #a0aec0;

    &:hover {
      background: rgba(59, 130, 246, 0.15);
      border-color: #3b82f6;
      color: #3b82f6;
    }

    ${props => props.$isFavorite && `
      background: rgba(59, 130, 246, 0.2);
      border-color: #3b82f6;
      color: #3b82f6;
    `}
  }
`;

export const SidebarNav = styled.nav`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(107, 114, 128, 0.3);
    border-radius: 2px;

    &:hover {
      background: rgba(107, 114, 128, 0.5);
    }
  }
`;

export const SidebarDivider = styled.div`
  height: 1px;
  background: var(--border-color);
  margin: 8px 0;

  @media (prefers-color-scheme: dark) {
    background: #333333;
  }
`;

export const SidebarSection = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  padding: 0 16px 8px;
  margin-top: 8px;

  @media (prefers-color-scheme: dark) {
    color: #64748b;
  }
`;

export const SidebarItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: ${props => props.$active ? 'rgba(14, 165, 233, 0.1)' : 'transparent'};
  border: none;
  color: ${props => props.$active ? 'var(--primary)' : 'var(--text-secondary)'};
  cursor: pointer;
  transition: ${transitions.hover};
  text-align: left;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: rgba(14, 165, 233, 0.05);
    color: var(--text-primary);
  }

  svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
  }

  @media (prefers-color-scheme: dark) {
    background: ${props => props.$active ? 'rgba(59, 130, 246, 0.15)' : 'transparent'};
    color: ${props => props.$active ? '#3b82f6' : '#a0aec0'};

    &:hover {
      background: rgba(59, 130, 246, 0.1);
      color: #e2e8f0;
    }
  }
`;

export const ItemLabel = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemBadge = styled.span`
  background: rgba(212, 175, 55, 0.15);
  color: ${colors.primary};
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
  }
`;

export const ItemArrow = styled.span`
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.5;
`;

export const SidebarFooter = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-primary);

  @media (prefers-color-scheme: dark) {
    background: ${colors.background.dark};
    border-color: ${colors.background.darkSecondary};
  }
`;

export const QuickActionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${radius.lg};
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${transitions.hover};
  flex: 1;

  &:hover {
    background: rgba(14, 165, 233, 0.1);
    border-color: var(--primary);
    color: var(--primary);
  }

  @media (prefers-color-scheme: dark) {
    border-color: #333333;
    color: #a0aec0;

    &:hover {
      background: rgba(59, 130, 246, 0.15);
      border-color: #3b82f6;
      color: #3b82f6;
    }
  }
`;
