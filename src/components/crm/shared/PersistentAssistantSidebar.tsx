import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ChevronLeft, ChevronRight, Settings, Bell
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
import {
  PersistentSidebarContainer,
  SidebarHeader,
  CollapseButton,
  SidebarTitle,
  SidebarContent,
  DepartmentGroup,
  DepartmentHeader,
  DepartmentAssistants,
  AssistantTileContainer,
  TileAvatar,
  TileEmoji,
  TileInfo,
  TileName,
  TileTitle,
  TileAction,
  NotificationBadgeContainer,
  SidebarFooter
} from './PersistentAssistantSidebar.styles';

const ASSISTANT_ICONS = {
  nadia: 'MessageSquare',
  mary: 'FileText',
  clara: 'Target',
  nina: 'Bot',
  nancy: 'Users2',
  theodora: 'DollarSign',
  olivia: 'Megaphone',
  zoe: 'Briefcase',
  laila: 'Shield',
  sophia: 'Users',
  daisy: 'Home',
  aurora: 'Server'
};

interface AssistantData {
  id: string;
  name: string;
  title: string;
  avatar: string;
  colorScheme?: string;
  department: string;
  metrics?: { systemHealth?: string };
  capabilities?: string[];
}

const getAssistantStatus = (assistant: AssistantData | null): 'active' | 'idle' | 'busy' | 'offline' => {
  if (!assistant) return 'offline';
  if (assistant.metrics?.systemHealth === 'optimal') return 'active';
  if (assistant.metrics?.systemHealth === 'degraded') return 'busy';
  return 'idle';
};

interface AssistantTileProps {
  assistant: AssistantData;
  notificationCount: number;
  isActive: boolean;
  onClick: (id: string) => void;
  collapsed: boolean;
}

const AssistantTile = memo(({ 
  assistant, 
  notificationCount, 
  isActive, 
  onClick,
  collapsed
}: AssistantTileProps) => {
  const status = getAssistantStatus(assistant);
  
  const hasCritical = notificationCount > 0;
  
  return (
    <AssistantTileContainer
      $active={isActive}
      $tileColor={assistant.colorScheme || '#3B82F6'}
      onClick={() => onClick(assistant.id)}
      title={collapsed ? `${assistant.name} - ${assistant.title}` : undefined}
      className={collapsed ? 'collapsed' : ''}
    >
      <TileAvatar>
        <TileEmoji>{assistant.avatar}</TileEmoji>
        <StatusIndicator status={status} size="small" />
      </TileAvatar>
      
      {!collapsed && (
        <TileInfo>
          <TileName>{assistant.name}</TileName>
          <TileTitle>{assistant.title}</TileTitle>
        </TileInfo>
      )}
      
      {notificationCount > 0 && (
        <NotificationBadgeContainer 
          $size={collapsed ? 'small' : 'medium'}
          $severity={hasCritical ? 'warning' : 'info'}
          $pulse={hasCritical}
        >
          {notificationCount}
        </NotificationBadgeContainer>
      )}
      
      {!collapsed && (
        <TileAction title="Quick action">
          <Bell size={14} />
        </TileAction>
      )}
    </AssistantTileContainer>
  );
});

AssistantTile.displayName = 'AssistantTile';

interface PersistentAssistantSidebarProps {
  onSelectAssistant?: (assistantId: string) => void;
  activeAssistantId?: string;
}

const PersistentAssistantSidebar = memo(({ 
  onSelectAssistant,
  activeAssistantId 
}: PersistentAssistantSidebarProps) => {
  const dispatch = useDispatch();
  const assistants = useSelector(selectAllAssistantsArray);
  const sidebar = useSelector(selectSidebar);
  const unreadCounts = useSelector(selectAllUnreadCounts);
  
  const isCollapsed = sidebar?.isCollapsed ?? false;
  const isOpen = sidebar?.isOpen ?? true;
  
  const handleToggleCollapse = useCallback(() => {
    dispatch(collapseSidebar(!isCollapsed));
  }, [dispatch, isCollapsed]);
  
  const handleSelectAssistant = useCallback((assistantId: string) => {
    dispatch(selectAssistant(assistantId));
    if (onSelectAssistant) {
      onSelectAssistant(assistantId);
    }
  }, [dispatch, onSelectAssistant]);
  
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
  
  const groupedAssistants = assistants.reduce<Record<string, AssistantData[]>>((acc, assistant) => {
    const dept = assistant.department;
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(assistant as AssistantData);
    return acc;
  }, {});
  
  const departmentOrder = ['communications', 'sales', 'operations', 'finance', 'marketing', 'executive', 'compliance', 'technology'];
  
  if (!isOpen) return null;
  
  return (
    <PersistentSidebarContainer $collapsed={isCollapsed}>
      <SidebarHeader>
        <CollapseButton
          onClick={handleToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </CollapseButton>
        
        {!isCollapsed && (
          <>
            <SidebarTitle>AI Assistants</SidebarTitle>
            {totalUnread > 0 && (
              <NotificationBadgeContainer 
                $size="small"
                $severity="warning"
              >
                {totalUnread}
              </NotificationBadgeContainer>
            )}
          </>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        {departmentOrder.map(dept => {
          const deptAssistants = groupedAssistants[dept];
          if (!deptAssistants || deptAssistants.length === 0) return null;
          
          return (
            <DepartmentGroup key={dept}>
              {!isCollapsed && (
                <DepartmentHeader $departmentColor={DEPARTMENT_COLORS[dept]}>
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </DepartmentHeader>
              )}
              
              <DepartmentAssistants>
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
              </DepartmentAssistants>
            </DepartmentGroup>
          );
        })}
      </SidebarContent>
      
      {!isCollapsed && (
        <SidebarFooter>
          <TileAction title="Settings">
            <Settings size={18} />
          </TileAction>
        </SidebarFooter>
      )}
    </PersistentSidebarContainer>
  );
});

PersistentAssistantSidebar.displayName = 'PersistentAssistantSidebar';
export default PersistentAssistantSidebar;
