import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const BottomNavContainer = styled.nav`
  display: none; /* Hidden by default (desktop/tablet) */

  @media (max-width: 767px) {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: var(--surface-primary, #ffffff);
    border-top: 1px solid var(--border-subtle, #e0e0e0);
    z-index: 50;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: var(--text-secondary, #666666);
  text-decoration: none;
  font-size: 10px;
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;

  svg {
    width: 20px;
    height: 20px;
    margin-bottom: 4px;
    fill: currentColor;
  }

  &.active {
    color: var(--brand-primary, #1e3a8a);
  }

  /* Badge styling */
  .badge {
    position: absolute;
    top: 6px;
    right: calc(50% - 16px);
    background: var(--color-error, #ef4444);
    color: white;
    font-size: 8px;
    font-weight: bold;
    padding: 2px 4px;
    border-radius: 8px;
    min-width: 14px;
    text-align: center;
    line-height: 1;
  }
`;

const HomeIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const LeadsIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const PropertiesIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M4 4h16v2H4zm0 4h16v2H4zm0 4h16v2H4zm0 4h16v2H4z" />
  </svg>
);

const ViewingsIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
);

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <BottomNavContainer aria-label="Mobile Navigation">
      <NavItem to="/crm" className={location.pathname === '/crm' ? 'active' : ''}>
        <HomeIcon />
        <span>Home</span>
      </NavItem>

      <NavItem to="/crm/leads">
        <LeadsIcon />
        <span>Leads</span>
        <span className="badge">3</span>
      </NavItem>

      <NavItem to="/crm/properties">
        <PropertiesIcon />
        <span>Properties</span>
      </NavItem>

      <NavItem to="/crm/viewings">
        <ViewingsIcon />
        <span>Viewings</span>
      </NavItem>

      <NavItem to="/profile">
        <MoreIcon />
        <span>Menu</span>
      </NavItem>
    </BottomNavContainer>
  );
};
