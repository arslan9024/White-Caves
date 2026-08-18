/**
 * MobileCRMBottomNav.tsx — View Layer (4-Way Component Architecture)
 * Fixed bottom navigation bar for the White Caves mobile CRM experience.
 */

import React, { FC } from 'react';
import { LayoutDashboard, Users, Building2, Calendar, User } from 'lucide-react';
import { useMobileCRMBottomNavLogic } from './logic/MobileCRMBottomNav.logic';
import { NavBar, NavItem, NavLabel } from './styles/MobileCRMBottomNav.style';

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={22} />,
  Users: <Users size={22} />,
  Building2: <Building2 size={22} />,
  Calendar: <Calendar size={22} />,
  User: <User size={22} />,
};

export const MobileCRMBottomNav: FC = () => {
  const { tabs, activeTabId, navigate } = useMobileCRMBottomNavLogic();

  return (
    <NavBar data-testid="mobile-crm-bottom-nav">
      {tabs.map(tab => {
        const active = tab.id === activeTabId;
        return (
          <NavItem
            key={tab.id}
            $active={active}
            aria-label={tab.label}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(tab.path)}
          >
            {ICON_MAP[tab.icon]}
            <NavLabel $active={active}>{tab.label}</NavLabel>
          </NavItem>
        );
      })}
    </NavBar>
  );
};

export default MobileCRMBottomNav;
