/**
 * BottomNav.tsx — View layer for mobile bottom navigation (W23-009 / REQ-MOB-010)
 *
 * Rendered on mobile screens <= 768px. Zero inline state logic.
 */

import React from 'react';
import './BottomNav.css';
import { useBottomNavLogic } from './BottomNav.logic';

interface BottomNavProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPath = '/', onNavigate }) => {
  const { tabs, isActive } = useBottomNavLogic(currentPath);

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation bar">
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        return (
          <button
            key={tab.id}
            id={`bottom-nav-${tab.id}`}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
            onClick={() => onNavigate ? onNavigate(tab.path) : (window.location.href = tab.path)}
            aria-current={active ? 'page' : undefined}
          >
            <span className="bottom-nav-icon">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge != null && tab.badge > 0 && (
              <span className="bottom-nav-badge">{tab.badge}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
