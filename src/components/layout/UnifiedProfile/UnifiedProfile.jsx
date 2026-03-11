import React, { useState } from 'react';
import { User, Settings, HelpCircle, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useProfile } from '../../../contexts/ProfileContext';
import {
  UnifiedProfileContainer,
  UnifiedProfileMain,
  UnifiedProfileAvatar,
  NotificationBadge,
  UnifiedProfileInfo,
  UnifiedProfileName,
  UnifiedProfileEmail,
  UnifiedProfileRole,
  UnifiedProfileTrigger,
  Chevron,
  UnifiedProfileStats,
  UnifiedProfileStat,
  StatValue,
  StatLabel,
  UnifiedProfileActions,
  UnifiedProfileAction,
  UnifiedProfileDropdown,
  DropdownHeader,
  DropdownInfo,
  DropdownDivider,
  DropdownMenu,
  DropdownItem,
  DropdownBadge,
  UnifiedProfileSkeleton,
  SkeletonAvatar,
  SkeletonText,
} from './styles';

const UnifiedProfile = ({ 
  variant = 'sidebar',
  onSettingsClick,
  onHelpClick,
  onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userProfile, notifications, loading } = useProfile();
  
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
  
  const variantConfig = {
    navbar: {
      showName: false,
      showEmail: false,
      showRole: false,
      showStats: false,
      expanded: false,
      dropdown: true,
      avatarSize: 'sm'
    },
    sidebar: {
      showName: true,
      showEmail: true,
      showRole: true,
      showStats: false,
      expanded: true,
      dropdown: false,
      avatarSize: 'md'
    },
    dashboard: {
      showName: true,
      showEmail: true,
      showRole: true,
      showStats: true,
      expanded: true,
      dropdown: false,
      avatarSize: 'lg'
    }
  };
  
  const config = variantConfig[variant] || variantConfig.sidebar;

  if (loading) {
    return (
      <UnifiedProfileContainer $variant={variant}>
        <UnifiedProfileSkeleton>
          <SkeletonAvatar />
          {config.showName && <SkeletonText />}
        </UnifiedProfileSkeleton>
      </UnifiedProfileContainer>
    );
  }

  const displayName = userProfile?.displayName || userProfile?.name || 'Owner';
  const email = userProfile?.email || 'admin@whitecaves.ae';
  const role = userProfile?.role || 'Owner';
  const photoURL = userProfile?.photoURL;

  return (
    <UnifiedProfileContainer $variant={variant}>
      <UnifiedProfileMain>
        <UnifiedProfileAvatar $size={config.avatarSize}>
          {photoURL ? (
            <img src={photoURL} alt={displayName} />
          ) : (
            <span>{displayName.charAt(0).toUpperCase()}</span>
          )}
          {unreadCount > 0 && variant === 'navbar' && (
            <NotificationBadge>{unreadCount}</NotificationBadge>
          )}
        </UnifiedProfileAvatar>
        
        {config.showName && (
          <UnifiedProfileInfo>
            <UnifiedProfileName>{displayName}</UnifiedProfileName>
            {config.showEmail && (
              <UnifiedProfileEmail>{email}</UnifiedProfileEmail>
            )}
            {config.showRole && (
              <UnifiedProfileRole>{role}</UnifiedProfileRole>
            )}
          </UnifiedProfileInfo>
        )}
        
        {config.dropdown && (
          <UnifiedProfileTrigger 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
          >
            <UnifiedProfileAvatar $size={config.avatarSize}>
              {photoURL ? (
                <img src={photoURL} alt={displayName} />
              ) : (
                <User size={16} />
              )}
            </UnifiedProfileAvatar>
            <Chevron $open={isMenuOpen}>
              <ChevronDown size={14} />
            </Chevron>
          </UnifiedProfileTrigger>
        )}
      </UnifiedProfileMain>
      
      {config.showStats && (
        <UnifiedProfileStats>
          <UnifiedProfileStat>
            <StatValue>12</StatValue>
            <StatLabel>Listings</StatLabel>
          </UnifiedProfileStat>
          <UnifiedProfileStat>
            <StatValue>8</StatValue>
            <StatLabel>Active</StatLabel>
          </UnifiedProfileStat>
          <UnifiedProfileStat>
            <StatValue>4</StatValue>
            <StatLabel>Pending</StatLabel>
          </UnifiedProfileStat>
        </UnifiedProfileStats>
      )}
      
      {config.expanded && (
        <UnifiedProfileActions>
          <UnifiedProfileAction onClick={onSettingsClick}>
            <Settings size={16} />
            <span>Settings</span>
          </UnifiedProfileAction>
          <UnifiedProfileAction onClick={onHelpClick}>
            <HelpCircle size={16} />
            <span>Help & Support</span>
          </UnifiedProfileAction>
          <UnifiedProfileAction $danger onClick={onLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </UnifiedProfileAction>
        </UnifiedProfileActions>
      )}
      
      {config.dropdown && isMenuOpen && (
        <UnifiedProfileDropdown>
          <DropdownHeader>
            <UnifiedProfileAvatar $size="md">
              {photoURL ? (
                <img src={photoURL} alt={displayName} />
              ) : (
                <span>{displayName.charAt(0).toUpperCase()}</span>
              )}
            </UnifiedProfileAvatar>
            <DropdownInfo>
              <UnifiedProfileName>{displayName}</UnifiedProfileName>
              <UnifiedProfileEmail>{email}</UnifiedProfileEmail>
            </DropdownInfo>
          </DropdownHeader>
          
          <DropdownDivider />
          
          <DropdownMenu>
            <DropdownItem onClick={onSettingsClick}>
              <Settings size={16} />
              <span>Account Settings</span>
            </DropdownItem>
            <DropdownItem>
              <Bell size={16} />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <DropdownBadge>{unreadCount}</DropdownBadge>
              )}
            </DropdownItem>
            <DropdownItem onClick={onHelpClick}>
              <HelpCircle size={16} />
              <span>Help & Support</span>
            </DropdownItem>
          </DropdownMenu>
          
          <DropdownDivider />
          
          <DropdownItem $danger onClick={onLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </DropdownItem>
        </UnifiedProfileDropdown>
      )}
    </UnifiedProfileContainer>
  );
};

export default UnifiedProfile;
