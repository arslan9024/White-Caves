import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, X, Search, Bell, Moon, Sun, User, Settings, LogOut,
  LayoutDashboard, Building2, Users, Briefcase, Bot, ChevronDown,
  Home, FileText, MessageSquare, BarChart3, Shield, Sparkles, ChevronRight
} from 'lucide-react';
import { SUPER_ADMIN, isMDAuthorized } from '../../config/superAdmin';
import {
  setActiveCategory,
  setActiveObjectId,
  setActiveAssistant,
  toggleSidebar,
  toggleAiPanel,
  setSelectedAssistantForChat,
  navigateToBreadcrumb,
  selectActiveCategory,
  selectSidebarOpen,
  selectAiPanelOpen,
  selectAllAiAssistants,
  selectBreadcrumbs,
  selectSelectedAssistantForChat
} from '../../store/slices/crmViewSlice';
import '../../styles/crm-layout.css';

const CRM_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'departments', label: 'Departments', icon: Building2, badge: '10' },
  { id: 'employees', label: 'Employees', icon: Users, badge: '103' },
  { id: 'services', label: 'Services', icon: Briefcase, badge: '40' },
  { id: 'assistants', label: 'AI Assistants', icon: Bot, badge: '32' },
  { id: 'properties', label: 'Properties', icon: Home },
  { id: 'leads', label: 'Leads', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'compliance', label: 'Compliance', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function CRMShell({ children, activeTab, onTabChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user?.currentUser);
  
  const sidebarOpen = useSelector(selectSidebarOpen);
  const aiPanelOpen = useSelector(selectAiPanelOpen);
  const activeCategory = useSelector(selectActiveCategory);
  const aiAssistants = useSelector(selectAllAiAssistants);
  const breadcrumbs = useSelector(selectBreadcrumbs);
  const selectedAssistantForChat = useSelector(selectSelectedAssistantForChat);
  
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const handleNavClick = (navId) => {
    dispatch(setActiveCategory(navId));
    dispatch(setActiveObjectId(navId));
    if (onTabChange) {
      onTabChange(navId);
    }
  };

  const handleBreadcrumbClick = (crumbId) => {
    dispatch(navigateToBreadcrumb(crumbId));
    if (onTabChange) {
      onTabChange(crumbId);
    }
  };

  const handleAssistantClick = (assistantId) => {
    dispatch(setActiveAssistant(assistantId));
    dispatch(setSelectedAssistantForChat(assistantId));
    dispatch(setActiveObjectId(assistantId));
    if (onTabChange) {
      onTabChange(assistantId);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const currentTab = activeTab || activeCategory;
  
  const shellClasses = [
    'crm-shell',
    sidebarOpen ? 'sidebar-open' : '',
    aiPanelOpen ? 'ai-panel-open' : ''
  ].filter(Boolean).join(' ');

  const groupedAssistants = aiAssistants.reduce((acc, assistant) => {
    const dept = assistant.dept;
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(assistant);
    return acc;
  }, {});

  const departmentLabels = {
    executive: 'Executive',
    operations: 'Operations',
    sales: 'Sales',
    communications: 'Communications',
    technology: 'Technology',
    finance: 'Finance',
    legal: 'Legal',
    compliance: 'Compliance',
    intelligence: 'Intelligence',
    hr: 'Human Resources',
    marketing: 'Marketing'
  };

  return (
    <div className={shellClasses}>
      <header className="crm-topnav">
        <div className="crm-topnav-left">
          <button 
            className={`crm-toggle-btn ${sidebarOpen ? 'active' : ''}`}
            onClick={() => dispatch(toggleSidebar())}
            title="Toggle CRM Menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/" className="crm-brand">
            <div className="crm-brand-logo">W</div>
            <span>White Caves</span>
          </Link>

          {breadcrumbs.length > 0 && (
            <div className="crm-breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.id}>
                  {index > 0 && <ChevronRight size={14} className="breadcrumb-sep" />}
                  <button 
                    className="breadcrumb-item"
                    onClick={() => handleBreadcrumbClick(crumb.id)}
                  >
                    {crumb.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="crm-topnav-center">
          <div className="crm-search">
            <Search size={18} className="crm-search-icon" />
            <input
              type="text"
              className="crm-search-input"
              placeholder="Search properties, leads, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="crm-topnav-right">
          <button 
            className="crm-toggle-btn"
            onClick={toggleTheme}
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button className="crm-toggle-btn" title="Notifications">
            <Bell size={18} />
          </button>

          <button 
            className={`crm-toggle-btn ai-toggle ${aiPanelOpen ? 'active' : ''}`}
            onClick={() => dispatch(toggleAiPanel())}
            title="AI Assistants"
          >
            <Sparkles size={18} />
          </button>

          <div className="user-menu-container" style={{ position: 'relative' }}>
            <button 
              className="crm-toggle-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ 
                width: 'auto', 
                padding: '6px 12px', 
                gap: '8px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'var(--crm-navy)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {user?.displayName?.charAt(0) || 'A'}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                {user?.displayName || SUPER_ADMIN.name.split(' ')[0]}
              </span>
              <ChevronDown size={16} />
            </button>

            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--surface-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '8px',
                minWidth: '180px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                zIndex: 200
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user?.displayName || SUPER_ADMIN.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email || SUPER_ADMIN.email}</div>
                  <div style={{ 
                    marginTop: '6px',
                    fontSize: '0.625rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '3px 8px',
                    background: 'var(--crm-gold)',
                    color: 'var(--crm-navy)',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    Managing Director
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/settings')}
                  className="crm-nav-item"
                  style={{ width: '100%', margin: 0 }}
                >
                  <Settings size={16} /> Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="crm-nav-item"
                  style={{ width: '100%', margin: 0, color: '#EF4444' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <aside className="crm-sidebar">
        <div className="crm-sidebar-header">
          <div className="crm-sidebar-title">CRM Management</div>
        </div>
        <nav className="crm-sidebar-nav">
          {CRM_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`crm-nav-item ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <item.icon size={18} className="icon" />
              <span>{item.label}</span>
              {item.badge && <span className="crm-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="crm-main">
        {children}
      </main>

      <aside className="crm-ai-panel">
        <div className="crm-ai-panel-header">
          <div className="crm-ai-panel-title">
            <span className="ai-icon"><Sparkles size={14} /></span>
            AI Assistants
          </div>
          <button 
            className="crm-toggle-btn"
            onClick={() => dispatch(toggleAiPanel())}
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="crm-ai-panel-content">
          <div className="ai-assistant-groups">
            {Object.entries(groupedAssistants).map(([dept, assistants]) => (
              <div key={dept} className="ai-assistant-group">
                <div className="ai-group-header">
                  {departmentLabels[dept] || dept}
                </div>
                <div className="ai-assistant-list">
                  {assistants.map((assistant) => (
                    <div
                      key={assistant.id}
                      className={`ai-assistant-item ${selectedAssistantForChat === assistant.id ? 'active' : ''}`}
                      onClick={() => handleAssistantClick(assistant.id)}
                    >
                      <div 
                        className="ai-assistant-avatar"
                        style={{ background: assistant.color }}
                      >
                        {assistant.name.charAt(0)}
                      </div>
                      <div className="ai-assistant-info">
                        <div className="ai-assistant-name">{assistant.name}</div>
                        <div className="ai-assistant-role">{assistant.role}</div>
                      </div>
                      <div className={`ai-assistant-status ${assistant.status}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {selectedAssistantForChat && (
            <div className="ai-chat-preview">
              <div className="ai-chat-preview-header">
                Selected: {aiAssistants.find(a => a.id === selectedAssistantForChat)?.name}
              </div>
              <p className="ai-chat-preview-desc">
                Ready to assist with {aiAssistants.find(a => a.id === selectedAssistantForChat)?.role.toLowerCase()} tasks.
              </p>
              <button className="crm-btn crm-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <MessageSquare size={16} /> Start Chat
              </button>
            </div>
          )}
        </div>
      </aside>

      {showUserMenu && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 100 }}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
}
