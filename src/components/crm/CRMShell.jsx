import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, X, Search, Bell, Moon, Sun, User, Settings, LogOut,
  LayoutDashboard, Building2, Users, Briefcase, Bot, ChevronDown, ChevronUp,
  Home, FileText, MessageSquare, BarChart3, Shield, Sparkles, ChevronRight,
  Crown, Settings2, Target, Key, Megaphone, Wallet, Activity,
  TrendingUp, Building, Network, Calendar, UserPlus, UserSearch, Handshake,
  Route, FileSignature, Grid3x3, ListPlus, PlusCircle, Workflow, Image, Video,
  Book, ClipboardCheck, Wrench, Truck, FileCheck, RefreshCw, CalendarClock,
  Users2, Rocket, MessageCircle, CalendarDays, Globe, Mail, CreditCard,
  Receipt, Percent, PieChart, CheckCircle, Lock, UserCheck, History,
  FileBarChart, LineChart, Award, Plug, BookOpen
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
  toggleNavGroup,
  setActiveSubItem,
  selectActiveCategory,
  selectSidebarOpen,
  selectAiPanelOpen,
  selectAllAiAssistants,
  selectBreadcrumbs,
  selectSelectedAssistantForChat,
  selectNavTree,
  selectExpandedGroups,
  selectActiveSubItem
} from '../../store/slices/crmViewSlice';
import '../../styles/crm-layout.css';

const ICON_MAP = {
  Crown, LayoutDashboard, TrendingUp, Megaphone, Building, Settings2,
  Building2, Users, Network, Calendar, UserPlus, Target, UserSearch,
  Handshake, Route, FileSignature, MessageSquare, Home, Grid3x3, ListPlus,
  PlusCircle, Workflow, Image, Video, Briefcase, Book, ClipboardCheck,
  Wrench, Truck, Key, FileCheck, RefreshCw, CalendarClock, Users2,
  Rocket, MessageCircle, CalendarDays, Globe, Mail, Wallet, CreditCard,
  Receipt, Percent, PieChart, Shield, CheckCircle, Lock, UserCheck,
  History, BarChart3, FileBarChart, LineChart, Award, Settings, Plug,
  BookOpen, Activity
};

export default function CRMShell({ children, activeTab, onTabChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user?.currentUser);
  
  const sidebarOpen = useSelector(selectSidebarOpen);
  const aiPanelOpen = useSelector(selectAiPanelOpen);
  const activeCategory = useSelector(selectActiveCategory);
  const activeSubItem = useSelector(selectActiveSubItem);
  const aiAssistants = useSelector(selectAllAiAssistants);
  const breadcrumbs = useSelector(selectBreadcrumbs);
  const selectedAssistantForChat = useSelector(selectSelectedAssistantForChat);
  const navTree = useSelector(selectNavTree);
  const expandedGroups = useSelector(selectExpandedGroups);
  
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

  const handleGroupToggle = (groupId) => {
    dispatch(toggleNavGroup(groupId));
  };

  const handleSubItemClick = (group, item) => {
    dispatch(setActiveSubItem({
      categoryId: group.id,
      subItemId: item.id,
      categoryLabel: group.label,
      subItemLabel: item.label
    }));
    if (onTabChange) {
      onTabChange(item.id);
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

  const getIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName];
    return IconComponent || LayoutDashboard;
  };
  
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
            title="AI Command Center"
          >
            <Sparkles size={18} />
            <span className="ai-toggle-label">AI</span>
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
          <div className="crm-sidebar-title">CRM Navigation</div>
        </div>
        <nav className="crm-sidebar-nav">
          {navTree.map((group) => {
            const GroupIcon = getIcon(group.icon);
            const isExpanded = expandedGroups.includes(group.id);
            const isActiveGroup = activeCategory === group.id;
            
            return (
              <div key={group.id} className={`nav-group ${isExpanded ? 'expanded' : ''} ${isActiveGroup ? 'active-group' : ''}`}>
                <button
                  className="nav-group-header"
                  onClick={() => handleGroupToggle(group.id)}
                >
                  <GroupIcon size={18} className="nav-group-icon" />
                  <span className="nav-group-label">{group.label}</span>
                  {group.badge && <span className="nav-group-badge">{group.badge}</span>}
                  <span className="nav-group-chevron">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="nav-group-items">
                    {group.items.map((item) => {
                      const ItemIcon = getIcon(item.icon);
                      const isActive = activeSubItem === item.id;
                      
                      return (
                        <button
                          key={item.id}
                          className={`nav-sub-item ${isActive ? 'active' : ''}`}
                          onClick={() => handleSubItemClick(group, item)}
                        >
                          <ItemIcon size={16} className="nav-sub-icon" />
                          <span>{item.label}</span>
                          {item.badge && <span className="nav-sub-badge">{item.badge}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="crm-main">
        <div className="crm-main-content">
          {children}
        </div>
      </main>

      <aside className="crm-ai-panel">
        <div className="crm-ai-panel-header">
          <div className="crm-ai-panel-title">
            <span className="ai-icon"><Sparkles size={14} /></span>
            AI Command Center
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
          <div className="ai-panel-stats">
            <div className="ai-stat">
              <div className="ai-stat-value">{aiAssistants.length}</div>
              <div className="ai-stat-label">Assistants</div>
            </div>
            <div className="ai-stat">
              <div className="ai-stat-value">{aiAssistants.filter(a => a.status === 'online').length}</div>
              <div className="ai-stat-label">Online</div>
            </div>
            <div className="ai-stat">
              <div className="ai-stat-value">{Object.keys(groupedAssistants).length}</div>
              <div className="ai-stat-label">Departments</div>
            </div>
          </div>

          <div className="ai-assistant-groups">
            {Object.entries(groupedAssistants).map(([dept, assistants]) => (
              <div key={dept} className="ai-assistant-group">
                <div className="ai-group-header">
                  {departmentLabels[dept] || dept}
                </div>
                <div className="ai-assistant-list">
                  {assistants.filter(a => !a.reportsTo).map((assistant) => (
                    <div key={assistant.id}>
                      <div
                        className={`ai-assistant-item ${selectedAssistantForChat === assistant.id ? 'active' : ''} ${assistant.isTeamLead ? 'team-lead' : ''}`}
                        onClick={() => handleAssistantClick(assistant.id)}
                      >
                        <div 
                          className="ai-assistant-avatar"
                          style={{ background: assistant.color }}
                        >
                          {assistant.name.charAt(0)}
                        </div>
                        <div className="ai-assistant-info">
                          <div className="ai-assistant-name">
                            {assistant.name}
                            {assistant.isTeamLead && <span className="team-lead-badge">Lead</span>}
                          </div>
                          <div className="ai-assistant-role">{assistant.role}</div>
                        </div>
                        <div className={`ai-assistant-status ${assistant.status}`} />
                      </div>
                      {assistant.isTeamLead && (
                        <div className="ai-team-members">
                          <div className="ai-team-label">{assistant.teamName}</div>
                          {aiAssistants.filter(m => m.reportsTo === assistant.id).map((member) => (
                            <div
                              key={member.id}
                              className={`ai-assistant-item team-member ${selectedAssistantForChat === member.id ? 'active' : ''}`}
                              onClick={() => handleAssistantClick(member.id)}
                            >
                              <div 
                                className="ai-assistant-avatar"
                                style={{ background: member.color }}
                              >
                                {member.name.charAt(0)}
                              </div>
                              <div className="ai-assistant-info">
                                <div className="ai-assistant-name">{member.name}</div>
                                <div className="ai-assistant-role">{member.specialty || member.role}</div>
                              </div>
                              <div className={`ai-assistant-status ${member.status}`} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {selectedAssistantForChat && (
            <div className="ai-chat-preview">
              <div className="ai-chat-preview-header">
                <div 
                  className="ai-assistant-avatar"
                  style={{ 
                    background: aiAssistants.find(a => a.id === selectedAssistantForChat)?.color,
                    width: '36px',
                    height: '36px',
                    fontSize: '0.875rem'
                  }}
                >
                  {aiAssistants.find(a => a.id === selectedAssistantForChat)?.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>{aiAssistants.find(a => a.id === selectedAssistantForChat)?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {aiAssistants.find(a => a.id === selectedAssistantForChat)?.role}
                  </div>
                </div>
              </div>
              <div className="ai-quick-actions">
                <button className="ai-quick-action">
                  <MessageSquare size={14} /> Chat
                </button>
                <button className="ai-quick-action">
                  <FileText size={14} /> Report
                </button>
                <button className="ai-quick-action">
                  <Settings size={14} /> Config
                </button>
              </div>
              <button className="crm-btn crm-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <MessageSquare size={16} /> Start Conversation
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
