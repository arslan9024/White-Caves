import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ChevronLeft, ChevronRight, Bell, Settings, 
  MessageSquare, FileText, Target, Bot, Users2,
  DollarSign, Megaphone, Briefcase, Shield, Users, Home, Server
} from 'lucide-react';
import NotificationBadge from './NotificationBadge';
import StatusIndicator from './StatusIndicator';
import { 
  selectAllAssistantsArray,
  selectSidebar,
  selectAllUnreadCounts,
  selectAssistant,
  toggleSidebar,
  collapseSidebar,
  DEPARTMENT_COLORS
} from '../../../store/slices/aiAssistantDashboardSlice';
import './PersistentAssistantSidebar.css';

const ASSISTANT_ICONS = {
  linda: MessageSquare,
  mary: FileText,
  clara: Target,
  nina: Bot,
  nancy: Users2,
  theodora: DollarSign,
  olivia: Megaphone,
  zoe: Briefcase,
  laila: Shield,
  sophia: Users,
  daisy: Home,
  aurora: Server
};

const getAssistantStatus = (assistant) => {
  if (!assistant) return 'offline';
  if (assistant.metrics?.systemHealth === 'optimal') return 'active';
  if (assistant.metrics?.systemHealth === 'degraded') return 'busy';
  return 'idle';
};

const AssistantTile = memo(({ 
  assistant, 
  notificationCount, 
  isActive, 
  onClick,
  collapsed
}) => {
  const IconComponent = ASSISTANT_ICONS[assistant.id] || FileText;
  const status = getAssistantStatus(assistant);
  
  const hasCritical = notificationCount > 0;
  
  return (
    <button
      className={`assistant-tile ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
      onClick={() => onClick(assistant.id)}
      style={{ '--tile-color': assistant.colorScheme }}
      title={collapsed ? `${assistant.name} - ${assistant.title}` : undefined}
    >
      <div className="tile-avatar">
        <span className="tile-emoji">{assistant.avatar}</span>
        <StatusIndicator status={status} size="small" />
      </div>
      
      {!collapsed && (
        <div className="tile-info">
          <span className="tile-name">{assistant.name}</span>
          <span className="tile-title">{assistant.title}</span>
        </div>
      )}
      
      {notificationCount > 0 && (
        <NotificationBadge 
          count={notificationCount} 
          severity={hasCritical ? 'warning' : 'info'}
          size={collapsed ? 'small' : 'medium'}
          pulse={hasCritical}
        />
      )}
      
      {!collapsed && (
        <button className="tile-action" title="Quick action">
          <Bell size={14} />
        </button>
      )}
    </button>
  );
});

AssistantTile.displayName = 'AssistantTile';

const PersistentAssistantSidebar = memo(({ 
  onSelectAssistant,
  activeAssistantId 
}) => {
  const dispatch = useDispatch();
  const assistants = useSelector(selectAllAssistantsArray);
  const sidebar = useSelector(selectSidebar);
  const unreadCounts = useSelector(selectAllUnreadCounts);
  
  const isCollapsed = sidebar?.isCollapsed ?? false;
  const isOpen = sidebar?.isOpen ?? true;
  
  const handleToggleCollapse = useCallback(() => {
    dispatch(collapseSidebar(!isCollapsed));
  }, [dispatch, isCollapsed]);
  
  const handleSelectAssistant = useCallback((assistantId) => {
    dispatch(selectAssistant(assistantId));
    if (onSelectAssistant) {
      onSelectAssistant(assistantId);
    }
  }, [dispatch, onSelectAssistant]);
  
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
  
  const groupedAssistants = assistants.reduce((acc, assistant) => {
    const dept = assistant.department;
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(assistant);
    return acc;
  }, {});
  
  const departmentOrder = ['communications', 'sales', 'operations', 'finance', 'marketing', 'executive', 'compliance', 'technology'];
  
  if (!isOpen) return null;
  
  return (
    <aside className={`persistent-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="collapse-btn"
          onClick={handleToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
        
        {!isCollapsed && (
          <>
            <h3 className="sidebar-title">AI Assistants</h3>
            {totalUnread > 0 && (
              <NotificationBadge count={totalUnread} severity="warning" size="small" />
            )}
          </>
        )}
      </div>
      
      <div className="sidebar-content">
        {departmentOrder.map(dept => {
          const deptAssistants = groupedAssistants[dept];
          if (!deptAssistants || deptAssistants.length === 0) return null;
          
          return (
            <div key={dept} className="department-group">
              {!isCollapsed && (
                <div 
                  className="department-header"
                  style={{ background: DEPARTMENT_COLORS[dept] }}
                >
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </div>
              )}
              
              <div className="department-assistants">
                {deptAssistants.map(assistant => (
                  <AssistantTile
                    key={assistant.id}
                    assistant={assistant}
                    notificationCount={unreadCounts[assistant.id] || 0}
                    isActive={activeAssistantId === assistant.id}
                    onClick={handleSelectAssistant}
                    collapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {!isCollapsed && (
        <div className="sidebar-footer">
          <button className="footer-action" title="Settings">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </aside>
  );
});

PersistentAssistantSidebar.displayName = 'PersistentAssistantSidebar';
export default PersistentAssistantSidebar;
