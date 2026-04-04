/**
 * TopBar — Single unified navigation bar (56px)
 *
 * Merges the previous UnifiedNavbar + MainNavBar into one clean bar:
 *   [Logo] | [Breadcrumbs: Home > Dept > Service] ─── [⌘K Search] [🔔] [👤]
 *
 * Features:
 * - Breadcrumb navigation reflecting current dept/service path
 * - Search icon → opens CommandPalette overlay (Cmd+K)
 * - Notification bell with unread count badge
 * - User avatar with dropdown (profile, settings, logout)
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, Settings, LogOut, Shield } from 'lucide-react';
import type { RootState } from '../../../store/store';
import {
  selectSelectedDepartment,
  selectSelectedService,
  toggleCommandPalette,
} from '../../../store/slices/sidebarSlice';
import {
  TopBarContainer,
  LogoSection,
  LogoMark,
  LogoName,
  VerticalDivider,
  BreadcrumbsSection,
  BreadcrumbItem,
  BreadcrumbSeparator,
  ActionsSection,
  SearchTrigger,
  SearchShortcut,
  IconButton,
  NotifBadge,
  UserButton,
  UserAvatar,
  UserName,
  DropdownOverlay,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  DropdownHeader,
  DropdownHeaderName,
  DropdownHeaderEmail,
  DropdownHeaderRole,
} from './styles';

// ─── Types ────────────────────────────────────────────────────────────────

interface TopBarProps {
  /** Notifications list for badge count */
  notifications?: Array<{ id: string; read: boolean }>;
  /** Callback when user clicks logout in the dropdown */
  onLogout?: () => void;
}

// ─── Breadcrumb builder ───────────────────────────────────────────────────

const DEPARTMENT_LABELS: Record<string, string> = {
  operations: 'Operations',
  finance: 'Finance',
  sales: 'Sales',
  marketing: 'Marketing',
  communications: 'Communications',
  executive: 'Executive',
  compliance: 'Compliance',
  technology: 'Technology',
  legal: 'Legal',
};

function useBreadcrumbs() {
  const location = useLocation();
  const department = useSelector(selectSelectedDepartment);
  const service = useSelector(selectSelectedService);

  const crumbs: Array<{ label: string; path?: string }> = [
    { label: 'Dashboard', path: '/dashboard' },
  ];

  // Add path-based breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  if (pathParts.length > 1 && pathParts[0] !== 'dashboard') {
    const rolePart = pathParts[0];
    crumbs[0] = { label: rolePart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), path: `/${rolePart}/dashboard` };
    for (let i = 1; i < pathParts.length; i++) {
      crumbs.push({
        label: pathParts[i].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: `/${pathParts.slice(0, i + 1).join('/')}`,
      });
    }
  }

  // If a department is selected in the sidebar, add it
  if (department && DEPARTMENT_LABELS[department]) {
    // Only add if not already in path crumbs
    const alreadyInPath = crumbs.some(c => c.label.toLowerCase() === department);
    if (!alreadyInPath) {
      crumbs.push({ label: DEPARTMENT_LABELS[department] });
    }
  }

  if (service) {
    crumbs.push({ label: service });
  }

  return crumbs;
}

// ─── Component ────────────────────────────────────────────────────────────

const TopBar: React.FC<TopBarProps> = React.memo(function TopBar({
  notifications = [],
  onLogout,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const crumbs = useBreadcrumbs();

  // User from Redux
  const user = useSelector((state: RootState) => state.auth?.user);
  const userRole = user?.role || 'user';
  const isSuperUser = userRole === 'lion';

  // Dropdown state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard shortcut: Cmd+K / Ctrl+K → open command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(toggleCommandPalette());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

  const handleSearchClick = useCallback(() => {
    dispatch(toggleCommandPalette());
  }, [dispatch]);

  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <TopBarContainer>
      {/* Logo */}
      <LogoSection onClick={() => navigate('/dashboard')} aria-label="Go to dashboard">
        <LogoMark>WC</LogoMark>
        <LogoName>White Caves</LogoName>
      </LogoSection>

      <VerticalDivider />

      {/* Breadcrumbs */}
      <BreadcrumbsSection aria-label="Breadcrumb">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
            <BreadcrumbItem
              $isLast={i === crumbs.length - 1}
              onClick={() => crumb.path && i < crumbs.length - 1 && navigate(crumb.path)}
              aria-current={i === crumbs.length - 1 ? 'page' : undefined}
            >
              {crumb.label}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbsSection>

      {/* Right actions */}
      <ActionsSection>
        {/* Search trigger → opens Command Palette */}
        <SearchTrigger onClick={handleSearchClick} aria-label="Open search (Ctrl+K)">
          <Search size={16} />
          <span>Search…</span>
          <SearchShortcut>⌘K</SearchShortcut>
        </SearchTrigger>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <IconButton
            onClick={() => setShowNotifMenu(p => !p)}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && <NotifBadge>{unreadCount > 9 ? '9+' : unreadCount}</NotifBadge>}
          </IconButton>
          {showNotifMenu && (
            <>
              <DropdownOverlay onClick={() => setShowNotifMenu(false)} />
              <DropdownMenu $align="right" ref={notifMenuRef}>
                <DropdownHeader>
                  <DropdownHeaderName>Notifications</DropdownHeaderName>
                </DropdownHeader>
                <DropdownDivider />
                {notifications.length === 0 ? (
                  <DropdownItem disabled style={{ color: '#9CA3AF', cursor: 'default' }}>
                    No new notifications
                  </DropdownItem>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <DropdownItem key={n.id}>
                      <Bell size={14} />
                      Notification {n.id}
                    </DropdownItem>
                  ))
                )}
              </DropdownMenu>
            </>
          )}
        </div>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <UserButton onClick={() => setShowUserMenu(p => !p)} aria-label="User menu">
            <UserAvatar>{getInitials(user?.name || user?.email)}</UserAvatar>
            <UserName>{user?.name || user?.email || 'User'}</UserName>
            <ChevronDown size={14} style={{ color: '#9CA3AF' }} />
          </UserButton>
          {showUserMenu && (
            <>
              <DropdownOverlay onClick={() => setShowUserMenu(false)} />
              <DropdownMenu $align="right">
                <DropdownHeader>
                  <DropdownHeaderName>{user?.name || 'User'}</DropdownHeaderName>
                  <DropdownHeaderEmail>{user?.email || ''}</DropdownHeaderEmail>
                  {userRole && <DropdownHeaderRole>{userRole}</DropdownHeaderRole>}
                </DropdownHeader>
                <DropdownDivider />
                <DropdownItem onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
                  <User size={16} /> Profile
                </DropdownItem>
                <DropdownItem onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                  <Settings size={16} /> Settings
                </DropdownItem>
                {isSuperUser && (
                  <DropdownItem onClick={() => { navigate('/lion/admin-dashboard'); setShowUserMenu(false); }}>
                    <Shield size={16} /> Admin Dashboard
                  </DropdownItem>
                )}
                <DropdownDivider />
                <DropdownItem $danger onClick={() => { onLogout?.(); setShowUserMenu(false); }}>
                  <LogOut size={16} /> Sign out
                </DropdownItem>
              </DropdownMenu>
            </>
          )}
        </div>
      </ActionsSection>
    </TopBarContainer>
  );
});

export default TopBar;
