import React, { FC, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setOnlineStatus,
  updateCurrentTime,
  toggleRoleMenu,
  closeRoleMenu
} from '../../store/navigationSlice';
import UniversalProfile from '../layout/UniversalProfile';
import {
  UniversalNavHeader,
  NavContainer,
  NavLeft,
  NavLogo,
  LogoText,
  MobileMenuButton,
  NavCenter,
  NavLinks,
  NavLink,
  NavIcon,
  RoleDropdownContainer,
  RoleTrigger,
  RoleIconSpan,
  RoleLabel,
  DropdownArrow,
  DropdownMenu,
  DropdownItem,
  ItemIcon,
  NavRight,
  OnlineIndicator,
  StatusDot,
  StatusText,
  DateTimeDisplay,
  DateSpan,
  TimeSpan,
} from './UniversalNav.styles';

interface NavLinkItem {
  path: string;
  label: string;
  icon?: string;
}

interface RoleMenuItem {
  path: string;
  label: string;
  icon: string;
}

interface RoleMenu {
  label: string;
  icon: string;
  color: string;
  items: RoleMenuItem[];
  isOwnerExclusive?: boolean;
  whatsapp?: RoleMenuItem[];
}

interface UniversalNavProps {
  variant?: 'default' | string;
  navLinks?: NavLinkItem[];
  showDateTime?: boolean;
  showOnlineStatus?: boolean;
  logoPath?: string;
  logoText?: string;
  className?: string;
}

const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { path: '/', label: 'Home' },
  { path: '/properties', label: 'Properties' },
  { path: '/services', label: 'Services' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const PUBLIC_ROLE_MENUS: Record<string, RoleMenu> = {
  'buyer': {
    label: 'Buyer',
    icon: '🏠',
    color: '#3b82f6',
    items: [
      { path: '/buyer/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/buyer/mortgage-calculator', label: 'Mortgage Calculator', icon: '🧮' },
      { path: '/buyer/dld-fees', label: 'DLD Fees', icon: '🏛️' },
      { path: '/buyer/title-deed-registration', label: 'Title Deed', icon: '📜' },
      { path: '/buyer/saved-properties', label: 'Saved Properties', icon: '❤️' },
      { path: '/buyer/viewings', label: 'My Viewings', icon: '📅' },
    ]
  },
  'seller': {
    label: 'Seller',
    icon: '💰',
    color: '#10b981',
    items: [
      { path: '/seller/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/seller/pricing-tools', label: 'Pricing Tools', icon: '💰' },
      { path: '/seller/listings', label: 'My Listings', icon: '🏠' },
      { path: '/seller/inquiries', label: 'Buyer Inquiries', icon: '💬' },
      { path: '/seller/documents', label: 'Documents', icon: '📋' },
    ]
  },
  'landlord': {
    label: 'Landlord',
    icon: '🔑',
    color: '#8b5cf6',
    items: [
      { path: '/landlord/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/landlord/rental-management', label: 'Rental Management', icon: '🏠' },
      { path: '/landlord/tenants', label: 'My Tenants', icon: '👥' },
      { path: '/landlord/finances', label: 'Finances', icon: '💰' },
      { path: '/landlord/maintenance', label: 'Maintenance', icon: '🔧' },
    ]
  },
};

const OWNER_MENU: RoleMenu = {
  label: 'Owner Panel',
  icon: '👑',
  color: '#ffd700',
  isOwnerExclusive: true,
  items: [
    { path: '/owner/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/owner/business-model', label: 'Business Model', icon: '📋' },
    { path: '/owner/system-health', label: 'System Health', icon: '🩺' },
    { path: '/owner/agents', label: 'Manage Agents', icon: '👥' },
    { path: '/owner/reports', label: 'Reports', icon: '📈' },
    { path: '/owner/settings', label: 'Settings', icon: '⚙️' },
  ],
};

const ROLE_MENUS: Record<string, RoleMenu> = {
  ...PUBLIC_ROLE_MENUS,
  'owner': OWNER_MENU
};

const UniversalNav: FC<UniversalNavProps> = ({
  variant = 'default',
  navLinks = DEFAULT_NAV_LINKS,
  showDateTime = false,
  showOnlineStatus = false,
  logoPath = '/company-logo.jpg',
  logoText = 'White Caves',
  className = ''
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const navigationState = useSelector((state: any) => state.navigation);
  const { isOnline, currentTime, roleMenuOpen, activeRole } = navigationState || {
    isOnline: true,
    currentTime: new Date().toISOString(),
    roleMenuOpen: false,
    activeRole: null
  };
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menu = activeRole ? ROLE_MENUS[activeRole] : null;

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(updateCurrentTime(new Date().toISOString()));
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        dispatch(closeRoleMenu());
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const currentDateTime = new Date(currentTime);
  
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-AE', options);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-AE', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <UniversalNavHeader>
      <NavContainer>
        <NavLeft>
          <NavLogo to="/">
            <img src={logoPath} alt={logoText} />
            <LogoText>{logoText}</LogoText>
          </NavLogo>

          <MobileMenuButton 
            $isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </MobileMenuButton>
        </NavLeft>

        <NavCenter $mobileOpen={mobileMenuOpen}>
          <NavLinks>
            {navLinks.map((link) => (
              <NavLink 
                key={link.path}
                to={link.path}
                $isActive={location.pathname === link.path}
              >
                {link.icon && <NavIcon>{link.icon}</NavIcon>}
                {link.label}
              </NavLink>
            ))}
          </NavLinks>

          {menu && !menu.isOwnerExclusive && (
            <RoleDropdownContainer ref={menuRef}>
              <RoleTrigger 
                onClick={() => dispatch(toggleRoleMenu())}
              >
                <RoleIconSpan>{menu.icon}</RoleIconSpan>
                <RoleLabel>{menu.label}</RoleLabel>
                <DropdownArrow>{roleMenuOpen ? '▲' : '▼'}</DropdownArrow>
              </RoleTrigger>
              
              {roleMenuOpen && (
                <DropdownMenu>
                  {menu.items.map((item) => (
                    <DropdownItem
                      key={item.path}
                      to={item.path}
                      $isActive={location.pathname === item.path}
                      onClick={() => dispatch(closeRoleMenu())}
                    >
                      <ItemIcon>{item.icon}</ItemIcon>
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </RoleDropdownContainer>
          )}
        </NavCenter>

        <NavRight>
          {showOnlineStatus && (
            <OnlineIndicator>
              <StatusDot $isOnline={isOnline}></StatusDot>
              <StatusText>{isOnline ? 'Online' : 'Offline'}</StatusText>
            </OnlineIndicator>
          )}

          {showDateTime && (
            <DateTimeDisplay>
              <DateSpan>{formatDate(currentDateTime)}</DateSpan>
              <TimeSpan>{formatTime(currentDateTime)}</TimeSpan>
            </DateTimeDisplay>
          )}

          <UniversalProfile />
        </NavRight>
      </NavContainer>
    </UniversalNavHeader>
  );
};

export default UniversalNav;
