import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export interface NavItemProps {
  label: string;
  href?: string;
  icon?: ReactNode;
  isActive?: boolean;
  badge?: number;
  onClick?: () => void;
}

const Item = styled(motion.a)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: ${({ $isActive }) => $isActive ? '600' : '500'};
  color: ${({ $isActive }) => $isActive ? 'var(--wc-red-primary, #EF4444)' : '#64748B'};
  background: ${({ $isActive }) => $isActive ? 'rgba(239, 68, 68, 0.08)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: rgba(239, 68, 68, 0.06);
    color: var(--wc-red-primary, #EF4444);
  }
`;

const IconSlot = styled.span<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  font-size: 1.15rem;
  color: ${({ $isActive }) => $isActive ? 'var(--wc-red-primary, #EF4444)' : '#94A3B8'};
  transition: color 0.2s ease;

  ${Item}:hover & {
    color: var(--wc-red-primary, #EF4444);
  }
`;

const Badge = styled.span`
  background: var(--wc-red-primary, #EF4444);
  color: var(--wc-white, #FFFFFF);
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0 6px;
  margin-left: auto;
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--wc-red-primary, #EF4444);
  border-radius: 0 3px 3px 0;
`;

export const NavItem: FC<NavItemProps> = ({
  label,
  href = '#',
  icon,
  isActive = false,
  badge,
  onClick,
}) => {
  return (
    <Item
      href={href}
      $isActive={isActive}
      onClick={(e) => { if (onClick) { e.preventDefault(); onClick(); } }}
      whileTap={{ scale: 0.97 }}
      role="menuitem"
      aria-current={isActive ? 'page' : undefined}
    >
      {isActive && (
        <ActiveIndicator
          layoutId="nav-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      {icon && <IconSlot $isActive={isActive}>{icon}</IconSlot>}
      {label}
      {badge !== undefined && badge > 0 && <Badge>{badge > 99 ? '99+' : badge}</Badge>}
    </Item>
  );
};
