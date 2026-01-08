import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ChevronLeft, ChevronRight, MessageSquare, Building2, Target,
  Bot, Users, TrendingUp, Home, Wallet, Megaphone, Briefcase,
  Shield, Server, Palette, Database, LayoutDashboard, Settings,
  FileText, BarChart3, Users2, Smartphone, CreditCard, Star,
  Command, ChevronDown, ChevronUp, Layers
} from 'lucide-react';
import './AssistantNavSidebar.css';

const DEPARTMENT_CONFIG = {
  communications: { label: 'Communications', color: '#25D366', icon: MessageSquare },
  operations: { label: 'Operations', color: '#3B82F6', icon: Building2 },
  sales: { label: 'Sales', color: '#8B5CF6', icon: TrendingUp },
  finance: { label: 'Finance', color: '#EC4899', icon: Wallet },
  marketing: { label: 'Marketing', color: '#4FACFE', icon: Megaphone },
  executive: { label: 'Executive', color: '#43E97B', icon: Briefcase },
  compliance: { label: 'Compliance', color: '#6366F1', icon: Shield },
  technology: { label: 'Technology', color: '#0EA5E9', icon: Server }
};

const ASSISTANT_ICONS = {
  linda: MessageSquare,
  mary: Building2,
  clara: Target,
  nina: Bot,
  nancy: Users,
  sophia: TrendingUp,
  daisy: Home,
  theodora: Wallet,
  olivia: Megaphone,
  zoe: Briefcase,
  laila: Shield,
  aurora: Server,
  hazel: Palette,
  willow: Database
};

const DASHBOARD_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'ai-command', label: 'AI Command', icon: Command },
  { id: 'ai-hub', label: 'AI Hub', icon: Layers }
];

const MANAGEMENT_TABS = [
  { id: 'users', label: 'Users', icon: Users2 },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'agents', label: 'Agents', icon: Users },
  { id: 'leads', label: 'Leads', icon: Target },
  { id: 'contracts', label: 'Contracts', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
];

const INTEGRATION_TABS = [
  { id: 'chatbot', label: 'AI Settings', icon: Bot },
  { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone },
  { id: 'uaepass', label: 'UAE Pass', icon: CreditCard }
];

const SYSTEM_TABS = [
  { id: 'features', label: 'Features', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const AI_ASSISTANTS = [
  { id: 'linda', name: 'Linda', desc: 'WhatsApp CRM', color: '#25D366', department: 'communications' },
  { id: 'mary', name: 'Mary', desc: 'Inventory CRM', color: '#3B82F6', department: 'operations' },
  { id: 'clara', name: 'Clara', desc: 'Leads CRM', color: '#EF4444', department: 'sales' },
  { id: 'nina', name: 'Nina', desc: 'Bot Developer', color: '#06B6D4', department: 'communications' },
  { id: 'nancy', name: 'Nancy', desc: 'HR Manager', color: '#F97316', department: 'operations' },
  { id: 'sophia', name: 'Sophia', desc: 'Sales Pipeline', color: '#8B5CF6', department: 'sales' },
  { id: 'daisy', name: 'Daisy', desc: 'Leasing', color: '#14B8A6', department: 'operations' },
  { id: 'theodora', name: 'Theodora', desc: 'Finance', color: '#EC4899', department: 'finance' },
  { id: 'olivia', name: 'Olivia', desc: 'Marketing', color: '#4FACFE', department: 'marketing' },
  { id: 'zoe', name: 'Zoe', desc: 'Executive', color: '#43E97B', department: 'executive' },
  { id: 'laila', name: 'Laila', desc: 'Compliance', color: '#6366F1', department: 'compliance' },
  { id: 'aurora', name: 'Aurora', desc: 'CTO', color: '#0EA5E9', department: 'technology' },
  { id: 'hazel', name: 'Hazel', desc: 'Frontend', color: '#F472B6', department: 'technology' },
  { id: 'willow', name: 'Willow', desc: 'Backend', color: '#22C55E', department: 'technology' }
];

const AssistantNavSidebar = ({ 
  activeTab, 
  onTabChange, 
  collapsed = false, 
  onToggleCollapse,
  notifications = {}
}) => {
  const [expandedDepartments, setExpandedDepartments] = useState({
    communications: true,
    operations: true,
    sales: true,
    finance: true,
    marketing: true,
    executive: true,
    compliance: true,
    technology: true
  });

  const assistantsByDepartment = useMemo(() => {
    const grouped = {};
    AI_ASSISTANTS.forEach(assistant => {
      if (!grouped[assistant.department]) {
        grouped[assistant.department] = [];
      }
      grouped[assistant.department].push(assistant);
    });
    return grouped;
  }, []);

  const toggleDepartment = (dept) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  };

  const getNotificationCount = (assistantId) => {
    const assistantNotifs = notifications[assistantId] || [];
    return assistantNotifs.filter(n => !n.isRead).length;
  };

  const isAssistantTab = (tabId) => {
    return AI_ASSISTANTS.some(a => a.id === tabId);
  };

  return (
    <aside className={`assistant-nav-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <span className="logo-letter">W</span>
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-title">White Caves</span>
              <span className="logo-subtitle">AI Command Center</span>
            </div>
          )}
        </div>
        <button className="collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {!collapsed && <div className="section-label">Dashboard</div>}
          <ul className="nav-list">
            {DASHBOARD_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                    title={collapsed ? tab.label : undefined}
                  >
                    <Icon size={20} className="nav-icon" />
                    {!collapsed && <span className="nav-label">{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section ai-section">
          {!collapsed && (
            <div className="section-label">
              <span>AI Assistants</span>
              <span className="assistant-count">{AI_ASSISTANTS.length}</span>
            </div>
          )}
          
          <div className="departments-list">
            {Object.entries(assistantsByDepartment).map(([dept, assistants]) => {
              const deptConfig = DEPARTMENT_CONFIG[dept];
              const DeptIcon = deptConfig.icon;
              const isExpanded = expandedDepartments[dept];
              const hasActiveAssistant = assistants.some(a => a.id === activeTab);
              
              return (
                <div key={dept} className={`department-group ${hasActiveAssistant ? 'has-active' : ''}`}>
                  <button
                    className="department-header"
                    onClick={() => !collapsed && toggleDepartment(dept)}
                    style={{ '--dept-color': deptConfig.color }}
                    title={collapsed ? deptConfig.label : undefined}
                  >
                    <div className="dept-indicator" style={{ background: deptConfig.color }} />
                    {!collapsed && (
                      <>
                        <span className="dept-label">{deptConfig.label}</span>
                        <span className="dept-count">{assistants.length}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </>
                    )}
                    {collapsed && <DeptIcon size={18} style={{ color: deptConfig.color }} />}
                  </button>
                  
                  {!collapsed && isExpanded && (
                    <ul className="assistant-list">
                      {assistants.map(assistant => {
                        const Icon = ASSISTANT_ICONS[assistant.id];
                        const notifCount = getNotificationCount(assistant.id);
                        
                        return (
                          <li key={assistant.id}>
                            <button
                              className={`nav-item assistant-item ${activeTab === assistant.id ? 'active' : ''}`}
                              onClick={() => onTabChange(assistant.id)}
                              style={{ '--assistant-color': assistant.color }}
                            >
                              <div className="assistant-icon-wrapper">
                                <Icon size={16} />
                              </div>
                              <div className="assistant-info">
                                <span className="assistant-name">{assistant.name}</span>
                                <span className="assistant-desc">{assistant.desc}</span>
                              </div>
                              {notifCount > 0 && (
                                <span className="notification-badge">{notifCount}</span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="nav-section">
          {!collapsed && <div className="section-label">Management</div>}
          <ul className="nav-list">
            {MANAGEMENT_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                    title={collapsed ? tab.label : undefined}
                  >
                    <Icon size={20} className="nav-icon" />
                    {!collapsed && <span className="nav-label">{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section">
          {!collapsed && <div className="section-label">Integrations</div>}
          <ul className="nav-list">
            {INTEGRATION_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                    title={collapsed ? tab.label : undefined}
                  >
                    <Icon size={20} className="nav-icon" />
                    {!collapsed && <span className="nav-label">{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section">
          {!collapsed && <div className="section-label">System</div>}
          <ul className="nav-list">
            {SYSTEM_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                    title={collapsed ? tab.label : undefined}
                  >
                    <Icon size={20} className="nav-icon" />
                    {!collapsed && <span className="nav-label">{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="footer-info">
            <span className="version">v2.0.0</span>
            <span className="status-dot online" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default AssistantNavSidebar;
