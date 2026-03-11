import styled from 'styled-components';
import { theme } from '../../../styles/theme';

/* ===============================================
   UNIFIED PROFILE CONTAINER
   =============================================== */

export const UnifiedProfileContainer = styled.div<{ $variant?: 'navbar' | 'sidebar' | 'dashboard' }>`
  position: relative;
  
  ${props => {
    switch (props.$variant) {
      case 'navbar':
        return `display: flex; align-items: center;`;
      case 'sidebar':
        return `padding: 16px; border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));`;
      case 'dashboard':
        return `background: var(--color-surface, #1E293B); border-radius: 16px; padding: 24px; margin-bottom: 24px;`;
      default:
        return '';
    }
  }}
`;

/* ===============================================
   MAIN PROFILE CONTENT
   =============================================== */

export const UnifiedProfileMain = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

/* ===============================================
   PROFILE AVATAR
   =============================================== */

export const UnifiedProfileAvatar = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => {
    switch (props.$size) {
      case 'sm':
        return `width: 32px; height: 32px; font-size: 14px; border-radius: 10px;`;
      case 'md':
        return `width: 44px; height: 44px; font-size: 18px; border-radius: 12px;`;
      case 'lg':
        return `width: 64px; height: 64px; font-size: 24px; border-radius: 16px;`;
      default:
        return `width: 44px; height: 44px; font-size: 18px; border-radius: 12px;`;
    }
  }};
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  font-weight: 700;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #dc2626;
  border-radius: 9px;
  color: white;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ===============================================
   PROFILE INFO
   =============================================== */

export const UnifiedProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

export const UnifiedProfileName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UnifiedProfileEmail = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UnifiedProfileRole = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #ef4444;
  margin-top: 4px;
  width: fit-content;
`;

/* ===============================================
   PROFILE TRIGGER BUTTON (DROPDOWN)
   =============================================== */

export const UnifiedProfileTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const Chevron = styled.div<{ $open?: boolean }>`
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.2s ease;
  ${props => props.$open ? 'transform: rotate(180deg);' : ''}
`;

/* ===============================================
   PROFILE STATS
   =============================================== */

export const UnifiedProfileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

export const UnifiedProfileStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const StatValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
`;

export const StatLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;

/* ===============================================
   PROFILE ACTIONS
   =============================================== */

export const UnifiedProfileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

export const UnifiedProfileAction = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${props => (props.$danger ? '#ef4444' : 'rgba(255, 255, 255, 0.7)')};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background: ${props => (props.$danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)')};
    color: ${props => (props.$danger ? '#ef4444' : '#fff')};
  }
`;

/* ===============================================
   PROFILE DROPDOWN MENU
   =============================================== */

export const UnifiedProfileDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  z-index: 1000;
  animation: dropdownSlide 0.2s ease;

  @keyframes dropdownSlide {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
`;

export const DropdownInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
`;

export const DropdownMenu = styled.div`
  padding: 8px;
`;

export const DropdownItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${props => (props.$danger ? '#ef4444' : 'rgba(255, 255, 255, 0.7)')};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background: ${props => (props.$danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)')};
    color: ${props => (props.$danger ? '#ef4444' : '#fff')};
  }

  ${props => (props.$danger ? 'margin: 8px;' : '')}
`;

export const DropdownBadge = styled.span`
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #dc2626;
  border-radius: 10px;
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ===============================================
   LOADING STATE
   =============================================== */

export const UnifiedProfileSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SkeletonAvatar = styled.div`
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const SkeletonText = styled.div`
  width: 120px;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;
