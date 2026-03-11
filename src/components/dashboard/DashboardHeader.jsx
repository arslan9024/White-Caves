import React, { useState } from 'react';
import { 
  Search, Bell, User, Moon, Sun, Menu, LogOut, 
  Settings, HelpCircle, ChevronDown
} from 'lucide-react';
import RoleSelectorDropdown from '../../shared/components/ui/RoleSelectorDropdown';
import * as S from './DashboardHeader.styles';

const DashboardHeader = ({ 
  title = 'Executive Dashboard',
  subtitle = 'White Caves Real Estate LLC',
  currentRole,
  onRoleChange,
  onMenuToggle,
  theme = 'dark',
  onThemeToggle,
  notifications = [],
  user = null
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <S.HeaderContainer>
      <S.HeaderLeft>
        <S.MobileMenuBtn onClick={onMenuToggle}>
          <Menu size={20} />
        </S.MobileMenuBtn>
        <S.TitleGroup>
          <S.Title>{title}</S.Title>
          <S.Subtitle>{subtitle}</S.Subtitle>
        </S.TitleGroup>
      </S.HeaderLeft>

      <S.HeaderCenter>
        <S.SearchWrapper>
          <S.SearchIcon>
            <Search size={18} />
          </S.SearchIcon>
          <S.SearchInput
            type="text"
            placeholder="Search assistants, features, data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <S.SearchShortcut>
            <S.ShortcutKey>⌘</S.ShortcutKey>
            <S.ShortcutKey>K</S.ShortcutKey>
          </S.SearchShortcut>
        </S.SearchWrapper>
      </S.HeaderCenter>

      <S.HeaderRight>
        <S.IconButton 
          onClick={onThemeToggle}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </S.IconButton>

        <S.NotificationsWrapper>
          <S.IconButton 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <S.NotificationIndicator>{unreadCount}</S.NotificationIndicator>
            )}
          </S.IconButton>
          
          {showNotifications && (
            <S.NotificationsDropdown>
              <S.DropdownHeader>
                <span>Notifications</span>
                <S.MarkAllReadBtn>Mark all read</S.MarkAllReadBtn>
              </S.DropdownHeader>
              <S.NotificationsList>
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notif, index) => (
                    <S.NotificationItem key={index} unread={!notif.isRead}>
                      <S.NotifContent>
                        <S.NotifMessage>{notif.message}</S.NotifMessage>
                        <S.NotifTime>{notif.timestamp}</S.NotifTime>
                      </S.NotifContent>
                    </S.NotificationItem>
                  ))
                ) : (
                  <S.EmptyNotifications>
                    <Bell size={24} />
                    <p>No new notifications</p>
                  </S.EmptyNotifications>
                )}
              </S.NotificationsList>
            </S.NotificationsDropdown>
          )}
        </S.NotificationsWrapper>

        <S.RoleSelectorWrapper>
          <RoleSelectorDropdown 
            currentRole={currentRole}
            onRoleChange={onRoleChange}
          />
        </S.RoleSelectorWrapper>

        <S.UserMenuWrapper>
          <S.UserMenuBtn 
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <S.UserAvatar>
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
              ) : (
                <User size={18} />
              )}
            </S.UserAvatar>
            <ChevronDown size={14} />
          </S.UserMenuBtn>

          {showUserMenu && (
            <S.UserDropdown>
              <S.UserDropdownItem style={{ padding: '16px', justifyContent: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <S.UserAvatar>
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                  ) : (
                    <User size={24} />
                  )}
                </S.UserAvatar>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>{user?.displayName || 'Owner'}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>{user?.email || 'admin@whitecaves.ae'}</span>
                </div>
              </S.UserDropdownItem>
              <S.UserDropdownItem>
                <Settings size={16} />
                <span>Settings</span>
              </S.UserDropdownItem>
              <S.UserDropdownItem>
                <HelpCircle size={16} />
                <span>Help & Support</span>
              </S.UserDropdownItem>
              <S.UserDropdownItem style={{ color: '#ef4444' }}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </S.UserDropdownItem>
            </S.UserDropdown>
          )}
        </S.UserMenuWrapper>
      </S.HeaderRight>
    </S.HeaderContainer>
  );
};

export default DashboardHeader;
