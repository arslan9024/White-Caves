import React, { useState, useMemo } from 'react';
import {
  X, Search, Filter, Bell, MessageSquare, Settings, Play, Pause,
  ChevronRight, ChevronDown, Building2, Users, Target, Bot, Zap,
  Activity, TrendingUp, Home, Wallet, Megaphone, Briefcase, Shield,
  Server, Palette, Database, Star, Command, Scale, Eye, Clock
} from 'lucide-react';
import { getAllAssistants } from '../../../config/assistantRegistry';
import {
  PanelContainer,
  PanelHeader,
  PanelTitle,
  PanelCloseButton,
  PanelSearchContainer,
  SearchInputWrapper,
  SearchIcon,
  SearchInput,
  SearchClearButton,
  PanelFilters,
  FilterButton,
  AssistantsList,
  NoResults,
  AssistantCard,
  AssistantMain,
  AssistantAvatar,
  AssistantDetails,
  AssistantNameRow,
  AssistantName,
  StatusBadge,
  AssistantTitle,
  AssistantDept,
  NotificationBadge,
  ExpandButton,
  AssistantExpanded,
  CapabilitiesList,
  CapabilityTag,
  QuickActions,
  ActionButton,
  PanelFooter,
  FooterStats,
  Stat,
  StatDot
} from './styles';

const ICON_MAP = {
  MessageSquare, Building2, Target, Bot, Users, TrendingUp, Home,
  Wallet, Megaphone, Briefcase, Shield, Server, Palette, Database,
  Scale, Eye, Search, Zap, Activity, Clock, Command, Star
};

const AI_ASSISTANTS = getAllAssistants();

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
    maven: Briefcase,
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
  return iconMap[assistantId] || Bot;
};

const AIAssistantsPanel = ({ 
  isOpen, 
  onClose, 
  onAssistantSelect,
  notifications = {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedAssistant, setExpandedAssistant] = useState(null);

  const filteredAssistants = useMemo(() => {
    return AI_ASSISTANTS.filter(assistant => {
      const matchesSearch = searchQuery === '' || 
        assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assistant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assistant.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || assistant.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const getNotificationCount = (assistantId) => {
    const assistantNotifs = notifications[assistantId] || [];
    return Array.isArray(assistantNotifs) ? assistantNotifs.filter(n => !n.isRead).length : 0;
  };

  const toggleExpand = (assistantId) => {
    setExpandedAssistant(expandedAssistant === assistantId ? null : assistantId);
  };

  const handleAssistantClick = (assistant) => {
    if (onAssistantSelect) {
      onAssistantSelect(assistant);
    }
  };

  if (!isOpen) return null;

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>
          <Command size={20} />
          <span>AI Assistants</span>
        </PanelTitle>
        <PanelCloseButton onClick={onClose}>
          <X size={18} />
        </PanelCloseButton>
      </PanelHeader>

      <PanelSearchContainer>
        <SearchInputWrapper>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search assistants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <SearchClearButton onClick={() => setSearchQuery('')}>
              <X size={14} />
            </SearchClearButton>
          )}
        </SearchInputWrapper>
      </PanelSearchContainer>

      <PanelFilters>
        <FilterButton 
          isActive={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
        >
          All ({AI_ASSISTANTS.length})
        </FilterButton>
        <FilterButton 
          isActive={statusFilter === 'active'}
          onClick={() => setStatusFilter('active')}
        >
          Active ({AI_ASSISTANTS.filter(a => a.status === 'active').length})
        </FilterButton>
        <FilterButton 
          isActive={statusFilter === 'idle'}
          onClick={() => setStatusFilter('idle')}
        >
          Idle ({AI_ASSISTANTS.filter(a => a.status === 'idle').length})
        </FilterButton>
      </PanelFilters>

      <AssistantsList>
        {filteredAssistants.length === 0 ? (
          <NoResults>
            <p>No assistants found</p>
          </NoResults>
        ) : (
          filteredAssistants.map(assistant => {
            const Icon = getAssistantIcon(assistant.id);
            const notifCount = getNotificationCount(assistant.id);
            const isExpanded = expandedAssistant === assistant.id;
            
            return (
              <AssistantCard 
                key={assistant.id}
                isExpanded={isExpanded}
              >
                <AssistantMain 
                  onClick={() => handleAssistantClick(assistant)}
                >
                  <AssistantAvatar 
                    style={{ background: assistant.color || '#D32F2F' }}
                  >
                    <Icon size={18} color="white" />
                  </AssistantAvatar>
                  <AssistantDetails>
                    <AssistantNameRow>
                      <AssistantName>{assistant.name}</AssistantName>
                      <StatusBadge status={assistant.status}>
                        {assistant.status}
                      </StatusBadge>
                    </AssistantNameRow>
                    <AssistantTitle>{assistant.title}</AssistantTitle>
                    <AssistantDept>{assistant.department}</AssistantDept>
                  </AssistantDetails>
                  {notifCount > 0 && (
                    <NotificationBadge>{notifCount}</NotificationBadge>
                  )}
                  <ExpandButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(assistant.id);
                    }}
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </ExpandButton>
                </AssistantMain>

                {isExpanded && (
                  <AssistantExpanded>
                    <CapabilitiesList>
                      {(assistant.capabilities || []).slice(0, 5).map((cap, idx) => (
                        <CapabilityTag key={idx}>{cap}</CapabilityTag>
                      ))}
                    </CapabilitiesList>
                    <QuickActions>
                      <ActionButton 
                        isPrimary
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssistantClick(assistant);
                        }}
                      >
                        <MessageSquare size={14} />
                        Open
                      </ActionButton>
                      <ActionButton>
                        <Bell size={14} />
                        Alerts
                      </ActionButton>
                      <ActionButton>
                        <Settings size={14} />
                      </ActionButton>
                    </QuickActions>
                  </AssistantExpanded>
                )}
              </AssistantCard>
            );
          })
        )}
      </AssistantsList>

      <PanelFooter>
        <FooterStats>
          <Stat>
            <StatDot status="online" />
            {AI_ASSISTANTS.filter(a => a.status === 'active').length} Online
          </Stat>
          <Stat>
            <StatDot status="idle" />
            {AI_ASSISTANTS.filter(a => a.status === 'idle').length} Idle
          </Stat>
        </FooterStats>
      </PanelFooter>
    </PanelContainer>
  );
};

export default AIAssistantsPanel;
