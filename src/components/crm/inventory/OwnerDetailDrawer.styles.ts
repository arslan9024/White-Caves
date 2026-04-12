import styled from 'styled-components';
import { X } from 'lucide-react';
import { transitions } from '../../../styles/theme/transitions';
import { typography } from '../../../styles/theme/typography';
import { radius } from '../../../styles/theme/radius';
import { spacing } from '../../../styles/theme/spacing';

export const OwnerDrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modalBackdrop, 400);
  display: flex;
  justify-content: flex-end;
`;

export const OwnerDrawer = styled.div`
  width: 400px;
  max-width: 100%;
  height: 100%;
  background: var(--bg-card);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  [data-theme='dark'] & {
    background: var(--bg-card, #2a2a3e);
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.4);
  }
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);

  [data-theme='dark'] & {
    background: var(--bg-secondary, #1e1e2e);
    border-color: var(--border-color, #3a3a5a);
  }
`;

export const OwnerAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;

  [data-theme='dark'] & {
    background: rgba(212, 175, 55, 0.15);
  }
`;

export const OwnerInfo = styled.div`
  flex: 1;

  h2 {
    margin: 0;
    font-size: ${typography.sizes.lg};
    font-weight: ${typography.weights.semibold};
    color: var(--text-primary);
  }

  [data-theme='dark'] & h2 {
    color: white;
  }
`;

export const OwnerID = styled.span`
  font-size: ${typography.sizes.xs};
  color: var(--text-secondary);
  display: block;
  margin-top: 4px;

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);
  }
`;

export const DrawerCloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: ${spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${transitions.hover};

  &:hover {
    color: var(--text-primary);
  }

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);

    &:hover {
      color: white;
    }
  }
`;

export const DrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;

    &:hover {
      background: var(--text-secondary);
    }
  }
`;

export const DrawerSection = styled.section`
  margin-bottom: 24px;

  h3 {
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    font-size: ${typography.sizes.base};
    font-weight: ${typography.weights.semibold};
    color: var(--text-primary);
    margin: 0 0 12px;

    [data-theme='dark'] & {
      color: white;
    }
  }
`;

export const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

export const ContactItem = styled.div<{ $isPrimary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border-radius: ${radius.lg};
  border: 1px solid var(--border-color);
  transition: ${transitions.hover};

  ${props =>
    props.$isPrimary &&
    `
    border-color: var(--primary);
    background: rgba(212, 175, 55, 0.05);

    [data-theme='dark'] & {
      background: rgba(212, 175, 55, 0.12);
    }
  `};

  [data-theme='dark'] & {
    background: var(--bg-secondary, #2a2a3e);
    border-color: var(--border-color, #3a3a5a);
  }
`;

export const ContactValue = styled.span`
  font-size: ${typography.sizes.base};
  color: var(--text-primary);

  [data-theme='dark'] & {
    color: white;
  }
`;

export const PrimaryBadge = styled.span`
  font-size: 10px;
  padding: 2px 8px;
  background: var(--primary);
  color: white;
  border-radius: 10px;
  font-weight: ${typography.weights.semibold};
`;

export const PropertiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

export const PropertyItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: ${radius.lg};
  cursor: pointer;
  transition: ${transitions.hover};
  text-align: left;
  width: 100%;

  &:hover {
    border-color: var(--primary);
    background: rgba(212, 175, 55, 0.05);
  }

  [data-theme='dark'] & {
    background: var(--bg-secondary, #2a2a3e);
    border-color: var(--border-color, #3a3a5a);

    &:hover {
      background: rgba(212, 175, 55, 0.12);
    }
  }
`;

export const PropertyItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

export const PropertyPNumber = styled.span`
  font-size: ${typography.sizes.base};
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);

  [data-theme='dark'] & {
    color: white;
  }
`;

export const PropertyProject = styled.span`
  font-size: ${typography.sizes.xs};
  color: var(--text-secondary);

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);
  }
`;

export const PropertyLocation = styled.span`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 11px;
  color: var(--text-muted);

  svg {
    width: 12px;
    height: 12px;
  }

  [data-theme='dark'] & {
    color: var(--text-muted, #808080);
  }
`;

export const PropertyItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

export const PropertyStatus = styled.span<{ $status?: string }>`
  font-size: 11px;
  padding: 3px 8px;
  border-radius: ${radius.md};
  font-weight: ${typography.weights.medium};
  text-transform: capitalize;

  ${props => {
    switch (props.$status?.toLowerCase()) {
      case 'rented':
        return `
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        `;
      case 'available':
        return `
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        `;
      default:
        return `
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        `;
    }
  }};

  [data-theme='dark'] & {
    ${props => {
      switch (props.$status?.toLowerCase()) {
        case 'rented':
          return `background: rgba(59, 130, 246, 0.2);`;
        case 'available':
          return `background: rgba(34, 197, 94, 0.2);`;
        default:
          return `background: rgba(107, 114, 128, 0.2);`;
      }
    }};
  }
`;

export const NoData = styled.p`
  font-size: ${typography.sizes.sm};
  color: var(--text-secondary);
  font-style: italic;
  padding: 10px;

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);
  }
`;