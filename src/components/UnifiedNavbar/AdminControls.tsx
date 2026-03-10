/**
 * Admin Controls Component
 * Admin-only controls in navbar (conditional rendering)
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export type AdminControlsProps = {
  visible?: boolean;
  onUserManagement?: () => void;
  onSettings?: () => void;
  systemStatus?: 'online' | 'offline' | 'warning';
  className?: string;
};

const AdminContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const StatusIndicator = styled.div<{ $status: 'online' | 'offline' | 'warning' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => {
    switch (props.$status) {
      case 'online':
        return theme.colors.success;
      case 'offline':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      default:
        return theme.colors.border;
    }
  }};
  animation: ${(props) =>
    props.$status === 'online'
      ? `pulse 2s infinite`
      : 'none'};
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const AdminButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.primary};
  font-size: 18px;
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: 50%;
  transition: ${theme.transitions.create('all', theme.transitions.durations.standard)};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.primary};
  }

  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${theme.spacing.sm};
  background: ${theme.colors.background.primary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.lg};
  min-width: 240px;
  z-index: ${theme.zIndex.dropdown};
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  padding: ${theme.spacing.md};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  font-size: ${theme.typography.sizes.sm};
  text-align: left;
  width: 100%;
  transition: ${theme.transitions.create('all', theme.transitions.durations.standard)};
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.primary};
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${theme.zIndex.dropdown - 1};
`;

export const AdminControls: React.FC<AdminControlsProps> = ({
  visible = false,
  onUserManagement,
  onSettings,
  systemStatus = 'online',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!visible) {
    return null;
  }

  const handleUserManagement = () => {
    setIsOpen(false);
    onUserManagement?.();
  };

  const handleSettings = () => {
    setIsOpen(false);
    onSettings?.();
  };

  return (
    <AdminContainer className={className}>
      <StatusIndicator $status={systemStatus} title={`System ${systemStatus}`} />

      <div style={{ position: 'relative' }}>
        <AdminButton
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Admin controls"
          aria-expanded={isOpen}
          title="Admin controls"
        >
          ⚙️
        </AdminButton>

        <Dropdown $isOpen={isOpen}>
          <MenuItem onClick={handleUserManagement}>User Management</MenuItem>
          <MenuItem onClick={handleSettings}>Admin Settings</MenuItem>
        </Dropdown>

        {isOpen && (
          <Backdrop
            onClick={() => setIsOpen(false)}
            role="presentation"
          />
        )}
      </div>
    </AdminContainer>
  );
};

AdminControls.displayName = 'AdminControls';

export default AdminControls;
