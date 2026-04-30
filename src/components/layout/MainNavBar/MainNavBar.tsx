import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Shield,
  CreditCard,
  Activity,
  Users,
  Home,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react';
import ThemeToggle from '../../ThemeToggle';
import {
  NavBarContainer,
  NavLeftSection,
  LogoButton,
  LogoIcon,
  LogoLetter,
  LogoText,
  LogoTitle,
  LogoSubtitle,
  NavCenterSection,
  QuickStatsBar,
  StatItem,
  StatLabel,
  StatValue,
  SearchContainer,
  SearchIcon,
  SearchInput,
  SearchShortcut,
  ShortcutKey,
  NavRightSection,
  NavIconButton,
  NotificationBadge,
  DropdownContainer,
  DropdownMenu,
  DropdownHeader,
  MarkAllReadButton,
  DropdownContent,
  EmptyState,
  NotificationItem,
  NotifIcon,
  NotifContent,
  NotifTitle,
  NotifTime,
  ProfileTrigger,
  UserAvatar,
  SuperUserBadge,
  UserInfo,
  UserName,
  UserRole,
  ChevronIcon,
  DropdownDivider,
  DropdownItem,
  ProfileHeader,
  ProfileAvatar,
  ProfileInfo,
  ProfileName,
  ProfileEmail,
  DropdownFooter,
  SidebarToggleButton,
} from './styles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserProp {
  displayName?: string;
  email?: string;
  photoURL?: string;
}

interface NotificationItem_T {
  id?: string | number;
  isRead: boolean;
  title: string;
  time?: string;
  color?: string;
  icon?: React.ReactNode;
  [key: string]: unknown;
}

interface QuickStats {
  properties?: number;
  users?: number;
  leads?: number;
  systemHealth?: string;
}

interface MainNavBarProps {
  theme?: string;
  onThemeToggle?: () => void;
  user?: UserProp | null;
  notifications?: NotificationItem_T[];
  onLogout?: () => void;
  isSuperUser?: boolean;
  quickStats?: QuickStats | null;
  leftSidebarCollapsed?: boolean;
  onToggleLeftSidebar?: () => void;
}

type ProfileAction = 'admin' | 'profile' | 'settings' | 'billing' | 'help' | 'logout';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const MainNavBar: React.FC<MainNavBarProps> = ({
  theme: _theme = 'light',
  onThemeToggle: _onThemeToggle,
  user = null,
  notifications = [],
  onLogout,
  isSuperUser = false,
  quickStats = null,
  leftSidebarCollapsed = false,
  onToggleLeftSidebar = () => {},
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [_showCommandPalette, setShowCommandPalette] = useState<boolean>(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Get user role from Redux or props
  const _userRole = useSelector((state: RootState) => state.auth?.user?.role || 'user');
  const isSuperUserRole = useSelector((state: RootState) => state.auth?.user?.role === 'lion');

  const effectiveIsSuperUser = isSuperUser || isSuperUserRole;
  const unreadCount = notifications.filter((n: NotificationItem_T) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getUserInitials = (): string => {
    if (!user) return 'WC';
    if (user.displayName && user.displayName.length > 0) {
      return (
        user.displayName
          .split(' ')
          .filter((n: string) => n.length > 0)
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'WC'
      );
    }
    if (user.email && user.email.length > 0) {
      return user.email[0].toUpperCase();
    }
    return 'WC';
  };

  const handleProfileAction = (action: ProfileAction): void => {
    setShowProfileMenu(false);
    switch (action) {
      case 'admin':
        navigate('/lion/admin-dashboard');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'billing':
        navigate('/billing');
        break;
      case 'help':
        window.open('https://help.whitecaves.ae', '_blank', 'noopener,noreferrer');
        break;
      case 'logout':
        onLogout?.();
        break;
      default:
        break;
    }
  };

  return (
    <NavBarContainer>
      <NavLeftSection>
        <LogoButton onClick={() => navigate('/')}>
          <LogoIcon>
            <LogoLetter>W</LogoLetter>
          </LogoIcon>
          <LogoText>
            <LogoTitle>White Caves</LogoTitle>
            <LogoSubtitle>AI Command Center</LogoSubtitle>
          </LogoText>
        </LogoButton>

        {/* Left Sidebar Toggle Button */}
        <SidebarToggleButton
          onClick={onToggleLeftSidebar}
          title={leftSidebarCollapsed ? 'Open left sidebar' : 'Close left sidebar'}
        >
          {leftSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </SidebarToggleButton>
      </NavLeftSection>

      <NavCenterSection>
        {effectiveIsSuperUser && quickStats && (
          <QuickStatsBar>
            <StatItem>
              <Home size={16} />
              <StatLabel>Props</StatLabel>
              <StatValue>{quickStats.properties || 0}</StatValue>
            </StatItem>
            <StatItem>
              <Users size={16} />
              <StatLabel>Users</StatLabel>
              <StatValue>{quickStats.users || 0}</StatValue>
            </StatItem>
            <StatItem>
              <TrendingUp size={16} />
              <StatLabel>Leads</StatLabel>
              <StatValue>{quickStats.leads || 0}</StatValue>
            </StatItem>
            <StatItem>
              <Activity size={16} />
              <StatLabel>Health</StatLabel>
              <StatValue
                $status={
                  quickStats.systemHealth === 'good'
                    ? 'good'
                    : quickStats.systemHealth === 'warning'
                      ? 'warning'
                      : 'critical'
                }
              >
                {quickStats.systemHealth?.toUpperCase() || 'OK'}
              </StatValue>
            </StatItem>
          </QuickStatsBar>
        )}

        <SearchContainer $focused={searchFocused}>
          <SearchIcon>
            <Search size={18} />
          </SearchIcon>
          <SearchInput
            ref={searchRef}
            type="text"
            placeholder="Search assistants, properties, leads..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <SearchShortcut>
            <ShortcutKey>⌘</ShortcutKey>
            <ShortcutKey>K</ShortcutKey>
          </SearchShortcut>
        </SearchContainer>
      </NavCenterSection>

      <NavRightSection>
        <ThemeToggle />

        <DropdownContainer ref={notifRef}>
          <NavIconButton
            $hasUnread={unreadCount > 0}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <NotificationBadge>{unreadCount > 9 ? '9+' : unreadCount}</NotificationBadge>
            )}
          </NavIconButton>

          {showNotifications && (
            <DropdownMenu>
              <DropdownHeader>
                <h4>Notifications</h4>
                <MarkAllReadButton>Mark all read</MarkAllReadButton>
              </DropdownHeader>
              <DropdownContent>
                {notifications.length === 0 ? (
                  <EmptyState>
                    <Bell size={32} strokeWidth={1.5} />
                    <p>No notifications</p>
                  </EmptyState>
                ) : (
                  notifications.slice(0, 5).map((notif: NotificationItem_T, idx: number) => (
                    <NotificationItem
                      key={notif.id ?? `${notif.title}-${idx}`}
                      $unread={!notif.isRead}
                    >
                      <NotifIcon $color={notif.color || '#E31E24'}>
                        {notif.icon || <Bell size={14} />}
                      </NotifIcon>
                      <NotifContent>
                        <NotifTitle>{notif.title}</NotifTitle>
                        <NotifTime>{notif.time || 'Just now'}</NotifTime>
                      </NotifContent>
                    </NotificationItem>
                  ))
                )}
              </DropdownContent>
              {notifications.length > 0 && (
                <DropdownFooter>
                  <button onClick={() => navigate('/notifications')}>View all notifications</button>
                </DropdownFooter>
              )}
            </DropdownMenu>
          )}
        </DropdownContainer>

        <DropdownContainer ref={profileRef}>
          <ProfileTrigger onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <UserAvatar>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  loading="lazy"
                  width={40}
                  height={40}
                />
              ) : (
                <span>{getUserInitials()}</span>
              )}
              {effectiveIsSuperUser && <SuperUserBadge title="Super User" />}
            </UserAvatar>
            <UserInfo>
              <UserName>{user?.displayName || 'Company Owner'}</UserName>
              <UserRole $isSuperUser={effectiveIsSuperUser}>
                {effectiveIsSuperUser ? '👑 Super User' : 'Owner'}
              </UserRole>
            </UserInfo>
            <ChevronIcon $open={showProfileMenu}>
              <ChevronDown size={16} />
            </ChevronIcon>
          </ProfileTrigger>

          {showProfileMenu && (
            <DropdownMenu>
              <ProfileHeader>
                <ProfileAvatar>
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      loading="lazy"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </ProfileAvatar>
                <ProfileInfo>
                  <ProfileName>{user?.displayName || 'Company Owner'}</ProfileName>
                  <ProfileEmail>{user?.email || 'owner@whitecaves.ae'}</ProfileEmail>
                </ProfileInfo>
              </ProfileHeader>
              <DropdownDivider />
              <DropdownContent>
                {effectiveIsSuperUser && (
                  <>
                    <DropdownItem $isAdmin={true} onClick={() => handleProfileAction('admin')}>
                      <Shield size={18} />
                      <span>Admin Dashboard</span>
                    </DropdownItem>
                    <DropdownDivider />
                  </>
                )}
                <DropdownItem onClick={() => handleProfileAction('profile')}>
                  <User size={18} />
                  <span>My Profile</span>
                </DropdownItem>
                <DropdownItem onClick={() => handleProfileAction('settings')}>
                  <Settings size={18} />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem onClick={() => handleProfileAction('billing')}>
                  <CreditCard size={18} />
                  <span>Billing</span>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={() => handleProfileAction('help')}>
                  <HelpCircle size={18} />
                  <span>Help Center</span>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem $isLogout={true} onClick={() => handleProfileAction('logout')}>
                  <LogOut size={18} />
                  <span>Log Out</span>
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          )}
        </DropdownContainer>
      </NavRightSection>
    </NavBarContainer>
  );
};

export default MainNavBar;
