import styled from 'styled-components';
import { transitions } from '../../../styles/theme/transitions';
import { typography } from '../../../styles/theme/typography';
import { radius } from '../../../styles/theme/radius';

export const SelectorContainer = styled.div<{ $compact?: boolean }>`
  position: relative;
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: ${(props) => (props.$compact ? '300px' : '100%')};
`;

export const CurrentAssistantDisplay = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: ${transitions.all};
  border-radius: 15px;
  gap: 12px;

  &:hover {
    background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  }
`;

export const AssistantAvatar = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const AvatarIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${radius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const AvatarStatus = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid var(--card-bg);
`;

export const AssistantInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AssistantName = styled.div`
  font-size: 16px;
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);
`;

export const AssistantTitle = styled.div`
  font-size: ${typography.sizes.xs};
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DropdownArrow = styled.div`
  color: var(--text-secondary);
  flex-shrink: 0;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--card-bg);
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  z-index: var(--z-dropdown, 100);
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
`;

export const DropdownSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  gap: 8px;
  position: sticky;
  top: 0;
  background: var(--card-bg);
  z-index: 1;
`;

export const SearchIcon = styled.div`
  color: var(--text-secondary);
  flex-shrink: 0;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: ${typography.sizes.base};
  color: var(--text-primary);
  outline: none;

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

export const ClearSearchBtn = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.sm};
  transition: ${transitions.hover};

  &:hover {
    background: var(--hover-bg);
  }
`;

export const DepartmentFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-color);
`;

export const DeptBtn = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  background: ${(props) =>
    props.$active ? 'var(--primary-color)' : 'transparent'};
  border-color: ${(props) =>
    props.$active ? 'var(--primary-color)' : 'var(--border-color)'};
  color: ${(props) =>
    props.$active ? 'white' : 'var(--text-secondary)'};
  border-radius: 20px;
  font-size: 11px;
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    background: var(--hover-bg);
    border-color: var(--primary-color);
    color: var(--text-primary);
  }
`;

export const DropdownSection = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);

  &:last-of-type {
    border-bottom: none;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 11px;
  font-weight: ${typography.weights.semibold};
  text-transform: uppercase;
  color: var(--text-tertiary);
  letter-spacing: 0.5px;
`;

export const SectionCount = styled.span`
  margin-left: auto;
  font-weight: 400;
`;

export const SectionIcon = styled.span`
  opacity: 0.7;
`;

export const AssistantItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: ${transitions.hover};
  gap: 12px;
  background: ${(props) =>
    props.$selected
      ? 'var(--primary-light, rgba(59, 130, 246, 0.1))'
      : 'transparent'};

  &:hover {
    background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  }
`;

export const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

export const ItemAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

export const ItemInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

export const ItemName = styled.div`
  font-size: ${typography.sizes.base};
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);
`;

export const ItemTitle = styled.div`
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemMetrics = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const Metric = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--text-tertiary);
`;

export const HealthBadge = styled.span<{ $status?: string }>`
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 9px;
  font-weight: ${typography.weights.semibold};
  text-transform: capitalize;
  background: ${(props) => {
    switch (props.$status) {
      case 'optimal':
        return 'rgba(16, 185, 129, 0.1)';
      case 'degraded':
        return 'rgba(245, 158, 11, 0.1)';
      case 'offline':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'optimal':
        return '#10B981';
      case 'degraded':
        return '#F59E0B';
      case 'offline':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  }};
`;

export const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

export const FavoriteBtn = styled.button`
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${radius.md};
  transition: ${transitions.hover};

  &:hover {
    color: var(--primary-color);
    background: rgba(212, 175, 55, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;