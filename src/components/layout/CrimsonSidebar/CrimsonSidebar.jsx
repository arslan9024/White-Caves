import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  MessageSquare, Building2, Target, Bot, Users, TrendingUp,
  Home, Wallet, Megaphone, Briefcase, Shield, Server, Palette,
  Database, LayoutDashboard, Settings, FileText, BarChart3,
  Users2, Smartphone, CreditCard, Star, Command, Layers, Scale,
  Eye, Search, Zap, Activity, Clock, Filter, X
} from 'lucide-react';
import { 
  DEPARTMENTS, 
  getAllAssistants 
} from '../../../config/assistantRegistry';
import * as S from './CrimsonSidebar.styles';

const ICON_MAP = {
  MessageSquare, Building2, Target, Bot, Users, TrendingUp, Home,
  Wallet, Megaphone, Briefcase, Shield, Server, Palette, Database,
  Scale, Eye, Search, Users2, Settings, Zap, Activity, Clock,
  LayoutDashboard, Command, Layers
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

const AI_ASSISTANTS = getAllAssistants().map(a => ({
  id: a.id,
  name: a.name,
  desc: a.title.replace(' Manager', '').replace(' Engineer', '').replace(' & ', '/'),
  color: a.color,
  department: a.department
}));

const DEPARTMENT_CONFIG = Object.entries(DEPARTMENTS).reduce((acc, [key, dept]) => {
  acc[key] = { 
    label: dept.label, 
    color: dept.color, 
    icon: ICON_MAP[dept.icon] || Building2 
  };
  return acc;
}, {});

const CrimsonSidebar = ({ 
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
    finance: false,
    marketing: false,
    executive: true,
    compliance: false,
    legal: false,
    technology: false,
    intelligence: false
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
    return Array.isArray(assistantNotifs) ? assistantNotifs.filter(n => !n.isRead).length : 0;
  };

  const getTotalAlerts = () => {
    let total = 0;
    Object.values(notifications).forEach(notifs => {
      if (Array.isArray(notifs)) {
        total += notifs.filter(n => !n.isRead).length;
      }
    });
    return total;
  };

  const getAssistantIcon = (assistantId) => {
    const iconMap = {
      linda: MessageSquare,
      nina: Bot,
      mary: Building2,
      nancy: Users,
      daisy: Home,
      sentinel: Eye,
      vesta: Activity,
      juno: Zap,
      clara: Target,
      sophia: TrendingUp,
      hunter: Search,
      kairos: Star,
      theodora: Wallet,
      maven: BarChart3,
      olivia: Megaphone,
      zoe: Command,
      laila: Shield,
      evangeline: Scale,
      aurora: Server,
      hazel: Palette,
      willow: Database,
      henry: Clock,
      cipher: Eye,
      atlas: Building2
    };
    return iconMap[assistantId] || Building2;
  };

  const renderNavItem = (tab, showLabel = true) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    
    return (
      <S.NavItem
        key={tab.id}
        $active={isActive}
        $collapsed={collapsed}
        onClick={() => onTabChange(tab.id)}
        title={collapsed ? tab.label : undefined}
      >
        <S.NavIcon>
          <Icon size={20} />
        </S.NavIcon>
        {showLabel && !collapsed && <S.NavLabel>{tab.label}</S.NavLabel>}
      </S.NavItem>
    );
  };

  return (
    <S.SidebarContainer $collapsed={collapsed}>
      <S.SidebarHeader>
        <S.SidebarLogo>
          <S.LogoMark>
            <span>W</span>
          </S.LogoMark>
          {!collapsed && (
            <S.LogoText>
              <S.LogoTitle>White Caves</S.LogoTitle>
              <S.LogoTagline>Real Estate</S.LogoTagline>
            </S.LogoText>
          )}
        </S.SidebarLogo>
        <S.CollapseToggle
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </S.CollapseToggle>
      </S.SidebarHeader>

      <S.ZoeCommandHub
        $active={activeTab === 'zoe'}
        $collapsed={collapsed}
        onClick={() => onTabChange('zoe')}
      >
        <S.HubIcon $collapsed={collapsed}>
          <Command size={collapsed ? 20 : 24} />
        </S.HubIcon>
        {!collapsed && (
          <S.HubContent>
            <S.HubHeader>
              <S.HubTitle>AI COMMAND</S.HubTitle>
              <S.HubStatus $online>ONLINE</S.HubStatus>
            </S.HubHeader>
            <S.HubStats>
              <S.HubStat>
                <Activity size={12} />
                {getTotalAlerts()} alerts
              </S.HubStat>
              <S.HubStat>
                <Users size={12} />
                24 assistants
              </S.HubStat>
            </S.HubStats>
          </S.HubContent>
        )}
        {collapsed && getTotalAlerts() > 0 && (
          <S.CollapsedBadge>{getTotalAlerts()}</S.CollapsedBadge>
        )}
      </S.ZoeCommandHub>

      <S.SidebarNav>
        <S.NavSection>
          <S.SectionLabel $collapsed={collapsed}>Dashboard</S.SectionLabel>
          <S.NavList>
            {DASHBOARD_TABS.map(tab => renderNavItem(tab))}
          </S.NavList>
        </S.NavSection>

        <S.NavSection>
          <S.SectionLabel $collapsed={collapsed}>
            <span>AI Assistants</span>
            <S.SectionCount>{AI_ASSISTANTS.length}</S.SectionCount>
          </S.SectionLabel>
          <S.DepartmentsList>
            {Object.entries(assistantsByDepartment).map(([dept, assistants]) => {
              const deptConfig = DEPARTMENT_CONFIG[dept];
              if (!deptConfig) return null;
              
              const DeptIcon = deptConfig.icon;
              const isExpanded = expandedDepartments[dept];
              const hasActiveAssistant = assistants.some(a => activeTab === a.id);
              const deptNotifCount = assistants.reduce((sum, a) => sum + getNotificationCount(a.id), 0);

              return (
                <S.DepartmentGroup key={dept} $hasActive={hasActiveAssistant}>
                  <S.DepartmentHeader
                    $collapsed={collapsed}
                    onClick={() => !collapsed && toggleDepartment(dept)}
                    title={collapsed ? deptConfig.label : undefined}
                  >
                    <S.DeptIndicator $collapsed={collapsed} style={{ background: deptConfig.color }} />
                    {collapsed ? (
                      <DeptIcon size={18} style={{ color: deptConfig.color }} />
                    ) : (
                      <>
                        <S.DeptLabel $collapsed={collapsed}>{deptConfig.label}</S.DeptLabel>
                        <S.DeptMeta $collapsed={collapsed}>
                          {deptNotifCount > 0 && (
                            <S.DeptNotif>{deptNotifCount}</S.DeptNotif>
                          )}
                          <S.DeptCount>{assistants.length}</S.DeptCount>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </S.DeptMeta>
                      </>
                    )}
                  </S.DepartmentHeader>
                  
                  {!collapsed && isExpanded && (
                    <S.AssistantList>
                      {assistants.map(assistant => {
                        const Icon = getAssistantIcon(assistant.id);
                        const notifCount = getNotificationCount(assistant.id);
                        const isActive = activeTab === assistant.id;
                        
                        return (
                          <li key={assistant.id}>
                            <S.AssistantItem
                              $active={isActive}
                              onClick={() => onTabChange(assistant.id)}
                            >
                              <S.AssistantStatus>
                                <S.StatusDot $status="online" />
                              </S.AssistantStatus>
                              <S.AssistantIcon $active={isActive}>
                                <Icon size={16} />
                              </S.AssistantIcon>
                              <S.AssistantInfo>
                                <S.AssistantName>{assistant.name}</S.AssistantName>
                              </S.AssistantInfo>
                              {notifCount > 0 && (
                                <S.AssistantBadge>{notifCount}</S.AssistantBadge>
                              )}
                            </S.AssistantItem>
                          </li>
                        );
                      })}
                    </S.AssistantList>
                  )}
                </S.DepartmentGroup>
              );
            })}
          </S.DepartmentsList>
        </S.NavSection>

        <S.NavSection>
          <S.SectionLabel $collapsed={collapsed}>Management</S.SectionLabel>
          <S.NavList>
            {MANAGEMENT_TABS.map(tab => renderNavItem(tab))}
          </S.NavList>
        </S.NavSection>

        <S.NavSection>
          <S.SectionLabel $collapsed={collapsed}>Integrations</S.SectionLabel>
          <S.NavList>
            {INTEGRATION_TABS.map(tab => renderNavItem(tab))}
          </S.NavList>
        </S.NavSection>

        <S.NavSection>
          <S.SectionLabel $collapsed={collapsed}>System</S.SectionLabel>
          <S.NavList>
            {SYSTEM_TABS.map(tab => renderNavItem(tab))}
          </S.NavList>
        </S.NavSection>
      </S.SidebarNav>

      <S.SidebarFooter>
        {!collapsed && (
          <S.FooterContent>
            <S.Version>v2.0.0</S.Version>
            <S.FooterStatus>
              <S.StatusIndicator $online />
              All systems operational
            </S.FooterStatus>
          </S.FooterContent>
        )}
      </S.SidebarFooter>
    </S.SidebarContainer>
  );
};

export default CrimsonSidebar;
