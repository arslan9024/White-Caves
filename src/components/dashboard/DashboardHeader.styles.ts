import styled, { css } from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 72px;
  min-height: 72px;
  max-height: 72px;
  background: rgba(15, 15, 26, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 90;
  contain: layout style;
  content-visibility: auto;
  contain-intrinsic-size: auto 72px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const MobileMenuBtn = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Subtitle = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const HeaderCenter = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    max-width: 300px;
    margin: 0 16px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 100px 0 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(220, 38, 38, 0.5);
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

export const SearchShortcut = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 4px;
  pointer-events: none;
`;

export const ShortcutKey = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  font-family: inherit;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconButton = styled.button<{ theme?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const NotificationIndicator = styled.span`
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

export const NotificationsWrapper = styled.div`
  position: relative;
`;

export const NotificationsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation: dropdownFade 0.2s ease;
  z-index: 1000;

  @keyframes dropdownFade {
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
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-weight: 600;
  color: #fff;
  font-size: 14px;
`;

export const MarkAllReadBtn = styled.button`
  font-size: 12px;
  color: #dc2626;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
  }
`;

export const NotificationsList = styled.div`
  max-height: 320px;
  overflow-y: auto;

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

export const NotificationItem = styled.div<{ unread?: boolean }>`
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s ease;
  background: ${props => props.unread ? 'rgba(220, 38, 38, 0.05)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const NotifContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const NotifMessage = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.4;
`;

export const NotifTime = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
`;

export const EmptyNotifications = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  svg {
    opacity: 0.5;
    margin-bottom: 8px;
  }

  p {
    margin: 0;
    font-size: 13px;
  }
`;

export const UserMenuWrapper = styled.div`
  position: relative;
`;

export const UserMenuBtn = styled.button`
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

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
`;

export const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation: dropdownFade 0.2s ease;
  z-index: 1000;

  @keyframes dropdownFade {
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

export const UserDropdownItem = styled.button`
  width: 100%;
  padding: 14px 16px;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    opacity: 0.6;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;

    svg {
      opacity: 1;
    }
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const RoleSelectorWrapper = styled.div`
  margin: 0 4px;
`;
