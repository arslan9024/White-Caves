import React, { Suspense, lazy, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronLeft, ChevronRight, Search, Moon, Sun, Bell, User, LogOut, Settings, Home, ChevronDown, Bot } from 'lucide-react';
import { selectCurrentAssistant, selectUI } from '../../store/slices/aiAssistantDashboardSlice';
import { selectSelectedFeature } from '../../store/slices/dashboardViewSlice';
import { setTheme } from '../../store/navigationSlice';
import CommandSidebar from './CommandSidebar';
import './DashboardShell.css';

const LindaWhatsAppCRM = lazy(() => import('../crm/LindaWhatsAppCRM'));
const MaryInventoryCRM = lazy(() => import('../crm/MaryInventoryCRM'));
const ClaraLeadsCRM = lazy(() => import('../crm/ClaraLeadsCRM'));
const NinaWhatsAppBotCRM = lazy(() => import('../crm/NinaWhatsAppBotCRM'));
const NancyHRCRM = lazy(() => import('../crm/NancyHRCRM'));
const SophiaSalesCRM = lazy(() => import('../crm/SophiaSalesCRM'));
const DaisyLeasingCRM = lazy(() => import('../crm/DaisyLeasingCRM'));
const TheodoraFinanceCRM = lazy(() => import('../crm/TheodoraFinanceCRM'));
const OliviaMarketingCRM = lazy(() => import('../crm/OliviaMarketingCRM'));
const ZoeExecutiveCRM = lazy(() => import('../crm/ZoeExecutiveCRM'));
const LailaComplianceCRM = lazy(() => import('../crm/LailaComplianceCRM'));
const AuroraCTODashboard = lazy(() => import('../crm/AuroraCTODashboard'));
const HazelFrontendCRM = lazy(() => import('../crm/HazelFrontendCRM'));
const WillowBackendCRM = lazy(() => import('../crm/WillowBackendCRM'));
const EvangelineLegalCRM = lazy(() => import('../crm/EvangelineLegalCRM'));
const SentinelPropertyCRM = lazy(() => import('../crm/SentinelPropertyCRM'));
const HunterProspectingCRM = lazy(() => import('../crm/HunterProspectingCRM'));
const HenryAuditCRM = lazy(() => import('../crm/HenryAuditCRM'));
const CipherMarketCRM = lazy(() => import('../crm/CipherMarketCRM'));
const AtlasProjectsCRM = lazy(() => import('../crm/AtlasProjectsCRM'));
const VestaHandoverCRM = lazy(() => import('../crm/VestaHandoverCRM'));
const JunoCommunity = lazy(() => import('../crm/JunoCommunity'));
const KairosLuxuryCRM = lazy(() => import('../crm/KairosLuxuryCRM'));
const MavenInvestmentCRM = lazy(() => import('../crm/MavenInvestmentCRM'));

const ASSISTANT_COMPONENTS = {
  linda: LindaWhatsAppCRM,
  mary: MaryInventoryCRM,
  clara: ClaraLeadsCRM,
  nina: NinaWhatsAppBotCRM,
  nancy: NancyHRCRM,
  sophia: SophiaSalesCRM,
  daisy: DaisyLeasingCRM,
  theodora: TheodoraFinanceCRM,
  olivia: OliviaMarketingCRM,
  zoe: ZoeExecutiveCRM,
  laila: LailaComplianceCRM,
  aurora: AuroraCTODashboard,
  hazel: HazelFrontendCRM,
  willow: WillowBackendCRM,
  evangeline: EvangelineLegalCRM,
  sentinel: SentinelPropertyCRM,
  hunter: HunterProspectingCRM,
  henry: HenryAuditCRM,
  cipher: CipherMarketCRM,
  atlas: AtlasProjectsCRM,
  vesta: VestaHandoverCRM,
  juno: JunoCommunity,
  kairos: KairosLuxuryCRM,
  maven: MavenInvestmentCRM
};

const ROLE_OPTIONS = [
  { id: 'md', label: 'Managing Director', path: '/md/dashboard' },
  { id: 'agent', label: 'Agent View', path: '/agent/dashboard' },
  { id: 'admin', label: 'Admin View', path: '/admin/dashboard' },
  { id: 'buyer', label: 'Buyer View', path: '/buyer/dashboard' },
  { id: 'tenant', label: 'Tenant View', path: '/tenant/dashboard' }
];

const LoadingFallback = () => (
  <div className="dashboard-loading">
    <div className="loading-spinner"></div>
    <span>Loading...</span>
  </div>
);

const WelcomeScreen = () => (
  <div className="dashboard-welcome">
    <div className="welcome-content">
      <div className="welcome-icon">
        <Bot size={48} />
      </div>
      <h1>AI Command Center</h1>
      <p>Select an AI assistant and feature from the sidebar to view their dashboard</p>
      <div className="welcome-stats">
        <div className="stat">
          <span className="stat-number">24</span>
          <span className="stat-label">AI Assistants</span>
        </div>
        <div className="stat">
          <span className="stat-number">10</span>
          <span className="stat-label">Departments</span>
        </div>
        <div className="stat">
          <span className="stat-number">9,378+</span>
          <span className="stat-label">Properties</span>
        </div>
      </div>
    </div>
  </div>
);

const DashboardShell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentAssistant = useSelector(selectCurrentAssistant);
  const selectedFeature = useSelector(selectSelectedFeature);
  const theme = useSelector(state => state.navigation?.theme || 'light');
  const user = useSelector(state => state.user?.currentUser);
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [currentRole, setCurrentRole] = useState('md');
  
  const DashboardComponent = useMemo(() => {
    if (!currentAssistant) return null;
    return ASSISTANT_COMPONENTS[currentAssistant.id] || null;
  }, [currentAssistant]);

  const assistantColor = currentAssistant?.colorScheme || '#0EA5E9';

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  const handleRoleSwitch = (role) => {
    setCurrentRole(role.id);
    setShowRoleMenu(false);
    navigate(role.path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  const getUserInitials = () => {
    if (!user) return 'AM';
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'AM';
  };

  const currentRoleLabel = ROLE_OPTIONS.find(r => r.id === currentRole)?.label || 'Managing Director';

  return (
    <div className={`dashboard-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{ '--assistant-color': assistantColor }}>
      <header className="shell-topnav">
        <div className="topnav-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          
          <div className="topnav-brand" onClick={() => navigate('/')}>
            <div className="brand-icon">W</div>
            <span className="brand-text">White Caves</span>
          </div>
          
          <button className="nav-home-btn" onClick={() => navigate('/')}>
            <Home size={18} />
            <span>Home</span>
          </button>
        </div>

        <div className="topnav-center">
          <form className="universal-search" onSubmit={handleSearch}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search properties, leads, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="topnav-right">
          <div className="role-switcher">
            <button 
              className="role-btn"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
            >
              <User size={16} />
              <span>{currentRoleLabel}</span>
              <ChevronDown size={14} className={showRoleMenu ? 'rotated' : ''} />
            </button>
            {showRoleMenu && (
              <div className="role-dropdown">
                {ROLE_OPTIONS.map(role => (
                  <button 
                    key={role.id}
                    className={`role-option ${currentRole === role.id ? 'active' : ''}`}
                    onClick={() => handleRoleSwitch(role)}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="icon-btn" onClick={handleThemeToggle} title="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="icon-btn notification-btn" title="Notifications">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>

          <div className="user-profile">
            <button 
              className="profile-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="avatar">{getUserInitials()}</div>
            </button>
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="avatar-lg">{getUserInitials()}</div>
                  <div className="user-details">
                    <span className="user-name">{user?.displayName || 'Arslan Malik'}</span>
                    <span className="user-email">{user?.email || 'arslanmalikgoraha@gmail.com'}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => navigate('/profile')}>
                  <User size={16} /> Profile
                </button>
                <button className="dropdown-item" onClick={() => navigate('/settings')}>
                  <Settings size={16} /> Settings
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={() => navigate('/signin')}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="shell-body">
        <CommandSidebar collapsed={sidebarCollapsed} />
        
        <main className="dashboard-content">
          {currentAssistant && DashboardComponent ? (
            <div className="content-wrapper">
              <header className="content-header">
                <div className="header-info">
                  <h1 className="assistant-title">{currentAssistant.name}</h1>
                  <span className="assistant-role">{currentAssistant.title}</span>
                </div>
                {selectedFeature && selectedFeature !== 'dashboard' && (
                  <div className="feature-badge">
                    {selectedFeature.replace(/_/g, ' ')}
                  </div>
                )}
              </header>
              
              <div className="content-body">
                <Suspense fallback={<LoadingFallback />}>
                  <DashboardComponent activeFeature={selectedFeature} />
                </Suspense>
              </div>
            </div>
          ) : (
            <WelcomeScreen />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
