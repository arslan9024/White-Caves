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
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Shield,
  Menu,
  Plus,
} from 'lucide-react';
import type { RootState } from '../../../store/store';
import {
  selectSelectedDepartment,
  selectSelectedService,
  selectSelectedAssistant,
  toggleCommandPalette,
  clearSelectedAssistant,
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
  QuickActionButton,
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
  HamburgerButton,
} from './styles';

// ─── Types ────────────────────────────────────────────────────────────────

interface TopBarProps {
  /** Notifications list for badge count */
  notifications?: Array<{ id: string; read: boolean }>;
  /** Callback when user clicks logout in the dropdown */
  onLogout?: () => void;
  /** Callback when user clicks hamburger (mobile) — opens MobileMenuDrawer */
  onMenuOpen?: () => void;
}

// ─── Breadcrumb builder ───────────────────────────────────────────────────

/** All 12 CRM departments */
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
  intelligence: 'Intelligence',
  customer_experience: 'Customer Experience',
  data_and_ai: 'Data & AI',
};

/** Assistant display names (from registry — resolved at runtime) */
const ASSISTANT_LABELS: Record<string, string> = {
  nadia: 'Nadia',
  mary: 'Mary',
  clara: 'Clara',
  nina: 'Nina',
  nancy: 'Nancy',
  sophia: 'Sophia',
  daisy: 'Daisy',
  theodora: 'Theodora',
  olivia: 'Olivia',
  zoe: 'Zoe',
  laila: 'Laila',
  aurora: 'Aurora',
  hazel: 'Hazel',
  willow: 'Willow',
  evangeline: 'Evangeline',
  sentinel: 'Sentinel',
  hunter: 'Hunter',
  henry: 'Henry',
  cipher: 'Cipher',
  atlas: 'Atlas',
};

function useBreadcrumbs() {
  const dispatch = useDispatch();
  const location = useLocation();
  const department = useSelector(selectSelectedDepartment);
  const service = useSelector(selectSelectedService);
  const assistant = useSelector(selectSelectedAssistant);

  const crumbs: Array<{ label: string; path?: string; action?: () => void }> = [
    { label: 'Dashboard', path: '/dashboard' },
  ];

  // Add path-based breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  const [rolePart, ...remainingParts] = pathParts;
  if (pathParts.length > 1 && rolePart && rolePart !== 'dashboard') {
    crumbs[0] = {
      label: rolePart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path: `/${rolePart}/dashboard`,
    };
    for (const [idx, part] of remainingParts.entries()) {
      crumbs.push({
        label: part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: `/${pathParts.slice(0, idx + 2).join('/')}`,
      });
    }
  }

  // Department level
  if (department && Object.prototype.hasOwnProperty.call(DEPARTMENT_LABELS, department)) {
    const alreadyInPath = crumbs.some(c => c.label.toLowerCase() === department);
    if (!alreadyInPath) {
      crumbs.push({
        // eslint-disable-next-line security/detect-object-injection
        label: DEPARTMENT_LABELS[department],
        action: () => {
          dispatch(clearSelectedAssistant());
        },
      });
    }
  }

  // Service level
  if (service) {
    crumbs.push({
      label: service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      action: () => {
        dispatch(clearSelectedAssistant());
      },
    });
  }

  // Assistant level (deepest)
  if (assistant) {
    const label =
      // eslint-disable-next-line security/detect-object-injection
      ASSISTANT_LABELS[assistant] ??
      assistant.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    crumbs.push({ label });
  }

  return crumbs;
}

// ─── Component ────────────────────────────────────────────────────────────

const TopBar: React.FC<TopBarProps> = React.memo(function TopBar({
  notifications = [],
  onLogout,
  onMenuOpen,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const crumbs = useBreadcrumbs();

  // User from Redux (auth slice is canonical, user slice kept as backward-compatible fallback)
  const authUser = useSelector((state: RootState) => state.auth?.user);
  const currentUser = useSelector((state: RootState) => state.user?.currentUser);
  const user = authUser ?? currentUser;
  const userRole = (user?.role || 'user').toLowerCase();
  const isSuperUser = ['lion', 'owner', 'admin', 'managing_director'].includes(userRole);

  // Dropdown state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard shortcut: Cmd+K / Ctrl+K → open command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(toggleCommandPalette());
      }

      if (e.key === 'Escape') {
        setShowUserMenu(false);
        setShowNotifMenu(false);
        setShowQuickActions(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

  // Click outside to close open dropdowns
  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;

      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }

      if (showNotifMenu && notifMenuRef.current && !notifMenuRef.current.contains(target)) {
        setShowNotifMenu(false);
      }

      if (
        showQuickActions &&
        quickActionsRef.current &&
        !quickActionsRef.current.contains(target)
      ) {
        setShowQuickActions(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [showUserMenu, showNotifMenu, showQuickActions]);

  const handleSearchClick = useCallback(() => {
    dispatch(toggleCommandPalette());
  }, [dispatch]);

  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TopBarContainer>
      {/* Hamburger — visible on mobile/tablet only */}
      <HamburgerButton onClick={onMenuOpen} aria-label="Open navigation menu">
        <Menu size={20} />
      </HamburgerButton>

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
              onClick={() => {
                if (i < crumbs.length - 1) {
                  if (crumb.action) {
                    crumb.action();
                  } else if (crumb.path) {
                    navigate(crumb.path);
                  }
                }
              }}
              aria-current={i === crumbs.length - 1 ? 'page' : undefined}
            >
              {crumb.label}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbsSection>

      {/* Right actions */}
      <ActionsSection>
        {/* Quick actions */}
        <div style={{ position: 'relative' }} ref={quickActionsRef}>
          <QuickActionButton
            onClick={() => {
              setShowQuickActions(p => !p);
              setShowNotifMenu(false);
              setShowUserMenu(false);
            }}
            aria-label="Quick actions"
            data-testid="quick-actions-btn"
          >
            <Plus size={16} />
            <span>Quick Actions</span>
          </QuickActionButton>
          {showQuickActions && (
            <>
              <DropdownOverlay onClick={() => setShowQuickActions(false)} />
              <DropdownMenu $align="right" data-testid="quick-actions-menu">
                <DropdownHeader>
                  <DropdownHeaderName>Quick Actions</DropdownHeaderName>
                </DropdownHeader>
                <DropdownDivider />
                <DropdownItem
                  onClick={() => {
                    navigate('/leads/new');
                    setShowQuickActions(false);
                  }}
                >
                  Create Lead
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    navigate('/properties/new');
                    setShowQuickActions(false);
                  }}
                >
                  Add Property
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    navigate('/transactions/new');
                    setShowQuickActions(false);
                  }}
                >
                  New Transaction
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    dispatch(toggleCommandPalette());
                    setShowQuickActions(false);
                  }}
                >
                  Global Search
                </DropdownItem>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Search trigger → opens Command Palette */}
        <SearchTrigger onClick={handleSearchClick} aria-label="Open search (Ctrl+K)">
          <Search size={16} />
          <span>Search…</span>
          <SearchShortcut>⌘K</SearchShortcut>
        </SearchTrigger>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <IconButton
            onClick={() => {
              setShowNotifMenu(p => !p);
              setShowUserMenu(false);
              setShowQuickActions(false);
            }}
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
          <UserButton
            onClick={() => {
              setShowUserMenu(p => !p);
              setShowNotifMenu(false);
              setShowQuickActions(false);
            }}
            aria-label="User menu"
          >
            <UserAvatar>{getInitials(user?.name || user?.email)}</UserAvatar>
            <UserName>{user?.name || user?.email || 'User'}</UserName>
            <ChevronDown size={14} style={{ color: '#9CA3AF' }} />
          </UserButton>
          {showUserMenu && (
            <>
              <DropdownOverlay onClick={() => setShowUserMenu(false)} />
              <DropdownMenu $align="right" ref={userMenuRef}>
                <DropdownHeader>
                  <DropdownHeaderName>{user?.name || 'User'}</DropdownHeaderName>
                  <DropdownHeaderEmail>{user?.email || ''}</DropdownHeaderEmail>
                  {userRole && <DropdownHeaderRole>{userRole}</DropdownHeaderRole>}
                </DropdownHeader>
                <DropdownDivider />
                <DropdownItem
                  onClick={() => {
                    navigate('/profile');
                    setShowUserMenu(false);
                  }}
                >
                  <User size={16} /> Profile
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                >
                  <Settings size={16} /> Settings
                </DropdownItem>
                {isSuperUser && (
                  <DropdownItem
                    onClick={() => {
                      navigate('/lion/admin-dashboard');
                      setShowUserMenu(false);
                    }}
                  >
                    <Shield size={16} /> Admin Dashboard
                  </DropdownItem>
                )}
                <DropdownDivider />
                <DropdownItem
                  $danger
                  onClick={() => {
                    onLogout?.();
                    setShowUserMenu(false);
                  }}
                >
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
