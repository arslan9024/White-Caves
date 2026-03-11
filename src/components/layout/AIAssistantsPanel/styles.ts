import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const PanelContainer = styled.div`
  position: fixed;
  right: 0;
  top: 64px;
  height: calc(100vh - 64px);
  width: 360px;
  background: #FFFFFF;
  border-left: 1px solid #E0E0E0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);

  [data-theme="dark"] & {
    background: #1A1A2E;
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 1200px) {
    width: 320px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #E8E8E8;
  background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%);
  color: white;
`;

export const PanelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
`;

export const PanelCloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const PanelSearchContainer = styled.div`
  padding: 12px;
  background: #F8F9FA;
  border-bottom: 1px solid #E8E8E8;

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const SearchInputWrapper = styled.div`
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

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);

    &:focus-within {
      border-color: #D32F2F;
      box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
    }
  }
`;

export const SearchIcon = styled.div`
  color: #9E9E9E;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 8px;
  font-size: 14px;
  color: #212121;
  outline: none;

  &::placeholder {
    color: #9E9E9E;
  }

  [data-theme="dark"] & {
    color: #FFFFFF;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const SearchClearButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #9E9E9E;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #F5F5F5;
    color: #616161;
  }

  [data-theme="dark"] & {
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

export const PanelFilters = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #F8F9FA;
  border-bottom: 1px solid #E8E8E8;

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const FilterButton = styled.button<{ isActive: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid #E0E0E0;
  background: #FFFFFF;
  color: #616161;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #BDBDBD;
    background: #F5F5F5;
  }

  ${props => props.isActive && `
    background: #D32F2F;
    border-color: #D32F2F;
    color: white;
  `}

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    ${props => props.isActive && `
      background: #D32F2F;
      border-color: #D32F2F;
      color: white;
    `}
  }
`;

export const AssistantsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

export const NoResults = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #9E9E9E;
`;

export const AssistantCard = styled.div<{ isExpanded: boolean }>`
  margin-bottom: 8px;
  border-radius: 10px;
  background: #FFFFFF;
  border: 1px solid #E8E8E8;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: #D32F2F;
    box-shadow: 0 2px 8px rgba(211, 47, 47, 0.1);
  }

  ${props => props.isExpanded && `
    border-color: #D32F2F;
  `}

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.1);

    &:hover {
      border-color: #D32F2F;
    }
  }
`;

export const AssistantMain = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
`;

export const AssistantAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const AssistantDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AssistantNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
`;

export const AssistantName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #212121;

  [data-theme="dark"] & {
    color: #FFFFFF;
  }
`;

export const StatusBadge = styled.span<{ status: string }>`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;

  ${props => {
    if (props.status === 'active') {
      return `
        background: #E8F5E9;
        color: #2E7D32;
      `;
    }
    if (props.status === 'idle') {
      return `
        background: #FFF3E0;
        color: #F57C00;
      `;
    }
    return '';
  }}
`;

export const AssistantTitle = styled.span`
  display: block;
  font-size: 12px;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  [data-theme="dark"] & {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const AssistantDept = styled.span`
  display: block;
  font-size: 11px;
  color: #9E9E9E;

  [data-theme="dark"] & {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const NotificationBadge = styled.span`
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #D32F2F;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ExpandButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #9E9E9E;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #F5F5F5;
    color: #616161;
  }

  [data-theme="dark"] & {
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

export const AssistantExpanded = styled.div`
  padding: 0 12px 12px;
  border-top: 1px solid #F0F0F0;
  animation: ${slideDown} 0.2s ease;

  [data-theme="dark"] & {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
`;

export const CapabilitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0;
`;

export const CapabilityTag = styled.span`
  padding: 4px 8px;
  background: #F5F5F5;
  border-radius: 4px;
  font-size: 11px;
  color: #616161;

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button<{ isPrimary?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #E0E0E0;
  background: #FFFFFF;
  color: #616161;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #F5F5F5;
    border-color: #D32F2F;
    color: #D32F2F;
  }

  ${props => props.isPrimary && `
    background: #D32F2F;
    border-color: #D32F2F;
    color: white;

    &:hover {
      background: #B71C1C;
    }
  `}

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    ${props => props.isPrimary && `
      background: #D32F2F;
      border-color: #D32F2F;
      color: white;

      &:hover {
        background: #B71C1C;
      }
    `}
  }
`;

export const PanelFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #E8E8E8;
  background: #F8F9FA;

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const FooterStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #757575;

  [data-theme="dark"] & {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const StatDot = styled.span<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props =>
    props.status === 'online' ? '#2E7D32' :
    props.status === 'idle' ? '#F57C00' :
    '#9E9E9E'};
`;
