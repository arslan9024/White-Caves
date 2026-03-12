import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setOnlineStatus,
  updateCurrentTime,
  toggleRoleMenu,
  closeRoleMenu,
  toggleWhatsappMenu,
  closeWhatsappMenu,
  closeAllMenus,
  setActiveRole,
  setTheme
} from '../../store/navigationSlice';
import UniversalProfile from './UniversalProfile';
import {
  TopNavBarHeader,
  NavLeft,
  NavLogo,
  NavLinks,
  NavLink,
  NavCenter,
  NavRight,
  RoleDropdown,
  RoleTrigger,
  RoleIcon,
  RoleLabel,
  DropdownArrow,
  DropdownMenuRole,
  DropdownItem,
  DropdownDivider,
  DropdownSectionLabel,
  WhatsappDropdown,
  WhatsappTrigger,
  WaIcon,
  DropdownMenuWhatsapp,
  ThemeToggle,
  OnlineIndicator,
  StatusDot,
  StatusText,
  DatetimeDisplay,
  DateDisplay,
  TimeDisplay,
} from './TopNavBar/styles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RoleMenuItem {
  path: string;
  label: string;
  icon: string;
}

interface BrowseAs {
  clients: RoleMenuItem[];
  employees: RoleMenuItem[];
}

interface RoleMenu {
  label: string;
  icon: string;
  color: string;
  items: RoleMenuItem[];
  whatsapp?: RoleMenuItem[];
  browseAs?: BrowseAs;
}

interface RoleMenus {
  [key: string]: RoleMenu;
}

interface NavigationState {
  isOnline: boolean;
  currentTime: string;
  roleMenuOpen: boolean;
  whatsappMenuOpen: boolean;
  activeRole: string | null;
  theme: string;
}

interface UserState {
  currentUser: {
    displayName?: string;
    email?: string;
    photoURL?: string;
  } | null;
}

interface RootState {
  user: UserState;
  navigation: NavigationState;
}

// ---------------------------------------------------------------------------
// Role Menus Data
// ---------------------------------------------------------------------------

const roleMenus: RoleMenus = {
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
  'tenant': {
    label: 'Tenant',
    icon: '🏡',
    color: '#06b6d4',
    items: [
      { path: '/tenant/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/tenant/my-rentals', label: 'My Rentals', icon: '🏠' },
      { path: '/tenant/payments', label: 'Payments', icon: '💳' },
      { path: '/tenant/maintenance', label: 'Maintenance', icon: '🔧' },
    ]
  },
  'leasing-agent': {
    label: 'Leasing Agent',
    icon: '📋',
    color: '#f59e0b',
    items: [
      { path: '/leasing-agent/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/leasing-agent/tenant-screening', label: 'Tenant Screening', icon: '👤' },
      { path: '/leasing-agent/contracts', label: 'Contracts', icon: '📜' },
      { path: '/leasing-agent/listings', label: 'My Listings', icon: '🏠' },
      { path: '/leasing-agent/leads', label: 'Leads', icon: '📞' },
      { path: '/leasing-agent/calendar', label: 'Calendar', icon: '📅' },
      { path: '/leasing-agent/commission', label: 'Commission', icon: '💰' },
    ]
  },
  'secondary-sales-agent': {
    label: 'Sales Agent',
    icon: '🏢',
    color: '#ef4444',
    items: [
      { path: '/secondary-sales-agent/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/secondary-sales-agent/sales-pipeline', label: 'Sales Pipeline', icon: '📈' },
      { path: '/secondary-sales-agent/listings', label: 'My Listings', icon: '🏠' },
      { path: '/secondary-sales-agent/leads', label: 'Leads', icon: '📞' },
      { path: '/secondary-sales-agent/calendar', label: 'Calendar', icon: '📅' },
      { path: '/secondary-sales-agent/commission', label: 'Commission', icon: '💰' },
    ]
  },
  'owner': {
    label: 'Owner',
    icon: '👑',
    color: '#ffd700',
    items: [
      { path: '/owner/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/owner/business-model', label: 'Business Model', icon: '📋' },
      { path: '/owner/client-services', label: 'Client Services', icon: '🏢' },
      { path: '/owner/system-health', label: 'System Health', icon: '🩺' },
      { path: '/owner/agents', label: 'Manage Agents', icon: '👥' },
      { path: '/owner/properties', label: 'All Properties', icon: '🏠' },
      { path: '/owner/reports', label: 'Reports', icon: '📈' },
      { path: '/owner/settings', label: 'Settings', icon: '⚙️' },
    ],
    whatsapp: [
      { path: '/owner/whatsapp', label: 'Messages', icon: '💬' },
      { path: '/owner/whatsapp/chatbot', label: 'Chatbot', icon: '🤖' },
      { path: '/owner/whatsapp/analytics', label: 'Analytics', icon: '📈' },
      { path: '/owner/whatsapp/settings', label: 'Settings', icon: '⚙️' },
    ],
    browseAs: {
      clients: [
        { path: '/buyer/dashboard', label: 'Buyer Portal', icon: '🏠' },
        { path: '/seller/dashboard', label: 'Seller Portal', icon: '💰' },
        { path: '/landlord/dashboard', label: 'Landlord Portal', icon: '🏢' },
        { path: '/tenant/dashboard', label: 'Tenant Portal', icon: '🔑' },
      ],
      employees: [
        { path: '/leasing-agent/dashboard', label: 'Leasing Agent', icon: '📋' },
        { path: '/secondary-sales-agent/dashboard', label: 'Sales Agent', icon: '💼' },
      ]
    }
  }
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TopNavBar(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const user = useSelector((state: RootState) => state.user.currentUser);
  const { 
    isOnline, 
    currentTime, 
    roleMenuOpen, 
    whatsappMenuOpen,
    activeRole,
    theme
  } = useSelector((state: RootState) => state.navigation);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const whatsappRef = useRef<HTMLDivElement>(null);

  const menu: RoleMenu | null = activeRole ? roleMenus[activeRole] : null;

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
    function handleClickOutside(event: MouseEvent): void {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        dispatch(closeRoleMenu());
      }
      if (whatsappRef.current && !whatsappRef.current.contains(event.target as Node)) {
        dispatch(closeWhatsappMenu());
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  const currentDateTime = new Date(currentTime);
  
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-AE', options);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-AE', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const toggleTheme = (): void => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };

  return (
    <TopNavBarHeader>
      <NavLeft>
        <NavLogo to="/">
          <img src="/company-logo.jpg" alt="White Caves" />
          <span className="logo-text">White Caves</span>
        </NavLogo>

        <NavLinks>
          <NavLink to="/" active={location.pathname === '/'}>
            Home
          </NavLink>
          <NavLink to="/properties" active={location.pathname === '/properties'}>
            Properties
          </NavLink>
          <NavLink to="/services" active={location.pathname === '/services'}>
            Services
          </NavLink>
          <NavLink to="/about" active={location.pathname === '/about'}>
            About
          </NavLink>
          <NavLink to="/contact" active={location.pathname === '/contact'}>
            Contact
          </NavLink>
        </NavLinks>
      </NavLeft>

      <NavCenter>
        {menu && (
          <RoleDropdown ref={menuRef}>
            <RoleTrigger 
              onClick={() => dispatch(toggleRoleMenu())}
              style={{ '--role-color': menu.color } as React.CSSProperties}
            >
              <RoleIcon>{menu.icon}</RoleIcon>
              <RoleLabel>{menu.label} Portal</RoleLabel>
              <DropdownArrow>{roleMenuOpen ? '▲' : '▼'}</DropdownArrow>
            </RoleTrigger>
            
            {roleMenuOpen && (
              <DropdownMenuRole>
                {menu.items.map((item) => (
                  <DropdownItem
                    key={item.path}
                    as={Link}
                    to={item.path}
                    active={location.pathname === item.path}
                    onClick={() => dispatch(closeRoleMenu())}
                  >
                    <span className="item-icon">{item.icon}</span>
                    {item.label}
                  </DropdownItem>
                ))}
                
                {menu.browseAs && (
                  <>
                    <DropdownDivider></DropdownDivider>
                    <DropdownSectionLabel>Browse as Client</DropdownSectionLabel>
                    {menu.browseAs.clients.map((item) => (
                      <DropdownItem
                        key={item.path}
                        as={Link}
                        to={item.path}
                        className="browse-item"
                        active={location.pathname === item.path}
                        onClick={() => dispatch(closeRoleMenu())}
                      >
                        <span className="item-icon">{item.icon}</span>
                        {item.label}
                      </DropdownItem>
                    ))}
                    <DropdownSectionLabel>Browse as Employee</DropdownSectionLabel>
                    {menu.browseAs.employees.map((item) => (
                      <DropdownItem
                        key={item.path}
                        as={Link}
                        to={item.path}
                        className="browse-item"
                        active={location.pathname === item.path}
                        onClick={() => dispatch(closeRoleMenu())}
                      >
                        <span className="item-icon">{item.icon}</span>
                        {item.label}
                      </DropdownItem>
                    ))}
                  </>
                )}
              </DropdownMenuRole>
            )}
          </RoleDropdown>
        )}

        {menu?.whatsapp && (
          <WhatsappDropdown ref={whatsappRef}>
            <WhatsappTrigger 
              onClick={() => dispatch(toggleWhatsappMenu())}
            >
              <WaIcon>💬</WaIcon>
              <span>WhatsApp</span>
              <DropdownArrow>{whatsappMenuOpen ? '▲' : '▼'}</DropdownArrow>
            </WhatsappTrigger>
            
            {whatsappMenuOpen && (
              <DropdownMenuWhatsapp>
                {menu.whatsapp.map((item) => (
                  <DropdownItem
                    key={item.path}
                    as={Link}
                    to={item.path}
                    active={location.pathname === item.path}
                    onClick={() => dispatch(closeWhatsappMenu())}
                  >
                    <span className="item-icon">{item.icon}</span>
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownMenuWhatsapp>
            )}
          </WhatsappDropdown>
        )}
      </NavCenter>

      <NavRight>
        <ThemeToggle 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </ThemeToggle>

        <OnlineIndicator>
          <StatusDot online={isOnline}></StatusDot>
          <StatusText>{isOnline ? 'Online' : 'Offline'}</StatusText>
        </OnlineIndicator>

        <DatetimeDisplay>
          <DateDisplay>{formatDate(currentDateTime)}</DateDisplay>
          <TimeDisplay>{formatTime(currentDateTime)}</TimeDisplay>
        </DatetimeDisplay>

        <UniversalProfile />
      </NavRight>
    </TopNavBarHeader>
  );
}
