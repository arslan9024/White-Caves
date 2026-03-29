import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search, Star, Activity, TrendingUp, Users, AlertCircle,
  Shield, DollarSign, Megaphone, MessageSquare, Briefcase,
  FileText, Home, Target, Bot, Users2, ChevronDown, ChevronUp, X,
  Server
} from 'lucide-react';
import {
  selectAssistant,
  toggleFavorite,
  selectAllAssistantsArray,
  selectUI,
  selectFavorites,
  selectRecent,
  selectPerformance,
  selectFilteredAssistants,
  setSearchQuery,
  setDepartmentFilter,
  closeDropdown,
  toggleDropdown
} from '../../store/slices/aiAssistantDashboardSlice';

import type { AIAssistant } from '../../store/slices/aiAssistant/types';
import type { LucideIcon } from 'lucide-react';

import {
  SelectorContainer,
  CurrentAssistantDisplay,
  AssistantAvatar,
  AvatarIcon,
  AvatarStatus,
  AssistantInfo,
  AssistantName,
  AssistantTitle,
  DropdownArrow,
  DropdownMenu,
  DropdownSearch,
  SearchIcon,
  SearchInput,
  ClearSearchBtn,
  DepartmentFilter,
  DeptBtn,
  DropdownSection,
  SectionHeader,
  SectionCount,
  SectionIcon,
  AssistantItem,
  ItemLeft,
  ItemAvatar,
  ItemInfo,
  ItemName,
  ItemTitle,
  ItemMetrics,
  Metric,
  HealthBadge,
  ItemRight,
  FavoriteBtn
} from './AIAssistantSelector.styles';

const DEPARTMENTS = [
  { id: 'all', label: 'All Departments' },
  { id: 'operations', label: 'Operations' },
  { id: 'sales', label: 'Sales' },
  { id: 'communications', label: 'Communications' },
  { id: 'finance', label: 'Finance' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'executive', label: 'Executive' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'technology', label: 'Technology' }
];

const ASSISTANT_ICONS: Record<string, LucideIcon> = {
  mary: FileText,
  theodora: DollarSign,
  olivia: Megaphone,
  zoe: Briefcase,
  laila: Shield,
  nadia: MessageSquare,
  sophia: Users,
  daisy: Home,
  clara: Target,
  nina: Bot,
  nancy: Users2,
  aurora: Server
};

interface AIAssistantSelectorProps {
  onSelectAssistant?: (assistantId: string) => void;
  compact?: boolean;
}

const AIAssistantSelector = ({ onSelectAssistant, compact = false }: AIAssistantSelectorProps) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  
  const allAssistants = useSelector(selectAllAssistantsArray);
  const ui = useSelector(selectUI);
  const favorites = useSelector(selectFavorites);
  const recent = useSelector(selectRecent);
  const performance = useSelector(selectPerformance);
  const filteredAssistants = useSelector(selectFilteredAssistants);
  
  const isOpen = ui?.dropdownOpen || false;
  const [searchTerm, setSearchTerm] = useState('');
  const selectedDepartment = ui?.filters?.department || 'all';
  
  const currentAssistant = allAssistants.find(a => a.id === ui?.selectedAssistant);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
        dispatch(closeDropdown());
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(setSearchQuery(searchTerm));
  }, [searchTerm, dispatch]);
  
  const handleDepartmentChange = (deptId: string) => {
    dispatch(setDepartmentFilter(deptId));
  };
  
  const handleSelectAssistant = (assistantId: string) => {
    dispatch(selectAssistant(assistantId));
    dispatch(closeDropdown());
    setSearchTerm('');
    if (onSelectAssistant) {
      onSelectAssistant(assistantId);
    }
  };
  
  const handleToggleDropdown = () => {
    dispatch(toggleDropdown());
  };
  
  const handleToggleFavorite = (e: React.MouseEvent, assistantId: string) => {
    e.stopPropagation();
    dispatch(toggleFavorite(assistantId));
  };
  
  const getAssistantIcon = (assistantId: string): React.ReactNode => {
    const IconComponent = ASSISTANT_ICONS[assistantId] || Users;
    return <IconComponent size={20} />;
  };
  
  const filteredBySearch = filteredAssistants.filter(assistant => {
    if (!searchTerm) return true;
    return assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           assistant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           assistant.department.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const favoriteAssistants = allAssistants.filter(a => favorites.includes(a.id));
  const recentAssistants = allAssistants.filter(a => recent.includes(a.id) && !favorites.includes(a.id));
  const otherAssistants = filteredBySearch.filter(a => !favorites.includes(a.id) && !recent.includes(a.id));
  
  if (!currentAssistant) return null;
  
  return (
    <SelectorContainer $compact={compact} ref={dropdownRef}>
      <CurrentAssistantDisplay onClick={handleToggleDropdown}>
        <AssistantAvatar>
          <AvatarIcon style={{ backgroundColor: currentAssistant.colorScheme }}>
            {getAssistantIcon(currentAssistant.id)}
          </AvatarIcon>
          <AvatarStatus
            style={{ 
              backgroundColor: currentAssistant.metrics.systemHealth === 'optimal' ? '#10B981' : 
                               currentAssistant.metrics.systemHealth === 'degraded' ? '#F59E0B' : '#EF4444'
            }}
          />
        </AssistantAvatar>
        <AssistantInfo>
          <AssistantName>{currentAssistant.name}</AssistantName>
          <AssistantTitle>{currentAssistant.title}</AssistantTitle>
        </AssistantInfo>
        <DropdownArrow>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </DropdownArrow>
      </CurrentAssistantDisplay>
      
      {isOpen && (
        <DropdownMenu>
          <DropdownSearch>
            <SearchIcon><Search size={16} /></SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search AI assistants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <ClearSearchBtn onClick={() => setSearchTerm('')}>
                <X size={14} />
              </ClearSearchBtn>
            )}
          </DropdownSearch>
          
          <DepartmentFilter>
            {DEPARTMENTS.map(dept => (
              <DeptBtn
                key={dept.id}
                $active={selectedDepartment === dept.id}
                onClick={() => handleDepartmentChange(dept.id)}
              >
                {dept.label}
              </DeptBtn>
            ))}
          </DepartmentFilter>
          
          {favorites.length > 0 && !searchTerm && selectedDepartment === 'all' && (
            <DropdownSection>
              <SectionHeader>
                <SectionIcon><Star size={14} /></SectionIcon>
                <span>Favorites</span>
              </SectionHeader>
              {favoriteAssistants.map(assistant => (
                <AssistantItemRenderer
                  key={assistant.id}
                  assistant={assistant}
                  isFavorite={true}
                  isSelected={assistant.id === ui?.selectedAssistant}
                  onSelect={() => handleSelectAssistant(assistant.id)}
                  onToggleFavorite={(e) => handleToggleFavorite(e, assistant.id)}
                  getIcon={getAssistantIcon}
                />
              ))}
            </DropdownSection>
          )}
          
          {recent.length > 0 && !searchTerm && selectedDepartment === 'all' && recentAssistants.length > 0 && (
            <DropdownSection>
              <SectionHeader>
                <SectionIcon><Activity size={14} /></SectionIcon>
                <span>Recently Used</span>
              </SectionHeader>
              {recentAssistants.slice(0, 3).map(assistant => (
                <AssistantItemRenderer
                  key={assistant.id}
                  assistant={assistant}
                  isFavorite={favorites.includes(assistant.id)}
                  isSelected={assistant.id === ui?.selectedAssistant}
                  onSelect={() => handleSelectAssistant(assistant.id)}
                  onToggleFavorite={(e) => handleToggleFavorite(e, assistant.id)}
                  getIcon={getAssistantIcon}
                />
              ))}
            </DropdownSection>
          )}
          
          <DropdownSection>
            <SectionHeader>
              <SectionIcon><Users size={14} /></SectionIcon>
              <span>{searchTerm ? 'Search Results' : 'All AI Assistants'}</span>
              <SectionCount>({searchTerm ? filteredBySearch.length : otherAssistants.length})</SectionCount>
            </SectionHeader>
            {(searchTerm ? filteredBySearch : otherAssistants).map(assistant => (
              <AssistantItemRenderer
                key={assistant.id}
                assistant={assistant}
                isFavorite={favorites.includes(assistant.id)}
                isSelected={assistant.id === ui?.selectedAssistant}
                onSelect={() => handleSelectAssistant(assistant.id)}
                onToggleFavorite={(e) => handleToggleFavorite(e, assistant.id)}
                getIcon={getAssistantIcon}
              />
            ))}
          </DropdownSection>
        </DropdownMenu>
      )}
    </SelectorContainer>
  );
};

interface AssistantItemRendererProps {
  assistant: AIAssistant;
  isFavorite: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  getIcon: (assistantId: string) => React.ReactNode;
}

const AssistantItemRenderer = ({ assistant, isFavorite, isSelected, onSelect, onToggleFavorite, getIcon }: AssistantItemRendererProps) => {
  return (
    <AssistantItem $selected={isSelected} onClick={onSelect}>
      <ItemLeft>
        <ItemAvatar style={{ backgroundColor: assistant.colorScheme }}>
          {getIcon(assistant.id)}
        </ItemAvatar>
        <ItemInfo>
          <ItemName>{assistant.name}</ItemName>
          <ItemTitle>{assistant.title}</ItemTitle>
          <ItemMetrics>
            <Metric>
              <Activity size={10} />
              {assistant.metrics.activeUsers} users
            </Metric>
            <HealthBadge $status={assistant.metrics.systemHealth}>
              {assistant.metrics.systemHealth}
            </HealthBadge>
          </ItemMetrics>
        </ItemInfo>
      </ItemLeft>
      <ItemRight>
        <FavoriteBtn 
          onClick={onToggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
        </FavoriteBtn>
        {assistant.quickStats && (
          <div style={{ fontSize: '11px' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{String((assistant.quickStats as any).today?.value ?? assistant.quickStats.value ?? '')}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>{String((assistant.quickStats as any).today?.label ?? assistant.quickStats.label ?? '')}</div>
          </div>
        )}
      </ItemRight>
    </AssistantItem>
  );
};

export default AIAssistantSelector;
