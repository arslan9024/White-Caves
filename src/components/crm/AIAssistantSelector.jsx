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

import './AIAssistantSelector.css';

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

const ASSISTANT_ICONS = {
  mary: FileText,
  theodora: DollarSign,
  olivia: Megaphone,
  zoe: Briefcase,
  laila: Shield,
  linda: MessageSquare,
  sophia: Users,
  daisy: Home,
  clara: Target,
  nina: Bot,
  nancy: Users2,
  aurora: Server
};

const AIAssistantSelector = ({ onSelectAssistant, compact = false }) => {
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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dispatch(closeDropdown());
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(setSearchQuery(searchTerm));
  }, [searchTerm, dispatch]);
  
  const handleDepartmentChange = (deptId) => {
    dispatch(setDepartmentFilter(deptId));
  };
  
  const handleSelectAssistant = (assistantId) => {
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
  
  const handleToggleFavorite = (e, assistantId) => {
    e.stopPropagation();
    dispatch(toggleFavorite(assistantId));
  };
  
  const getAssistantIcon = (assistantId) => {
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
    <div className={`ai-assistant-selector ${compact ? 'compact' : ''}`} ref={dropdownRef}>
      <div 
        className="current-assistant-display"
        onClick={handleToggleDropdown}
      >
        <div className="assistant-avatar">
          <div 
            className="avatar-icon"
            style={{ backgroundColor: currentAssistant.colorScheme }}
          >
            {getAssistantIcon(currentAssistant.id)}
          </div>
          <div 
            className="avatar-status"
            style={{ 
              backgroundColor: currentAssistant.metrics.systemHealth === 'optimal' ? '#10B981' : 
                               currentAssistant.metrics.systemHealth === 'degraded' ? '#F59E0B' : '#EF4444'
            }}
          />
        </div>
        <div className="assistant-info">
          <div className="assistant-name">{currentAssistant.name}</div>
          <div className="assistant-title">{currentAssistant.title}</div>
        </div>
        <div className="dropdown-arrow">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {isOpen && (
        <div className="assistant-dropdown-menu">
          <div className="dropdown-search">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search AI assistants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              autoFocus
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className="department-filter">
            {DEPARTMENTS.map(dept => (
              <button
                key={dept.id}
                className={`dept-btn ${selectedDepartment === dept.id ? 'active' : ''}`}
                onClick={() => handleDepartmentChange(dept.id)}
              >
                {dept.label}
              </button>
            ))}
          </div>
          
          {favorites.length > 0 && !searchTerm && selectedDepartment === 'all' && (
            <div className="dropdown-section">
              <div className="section-header">
                <Star className="section-icon" size={14} />
                <span>Favorites</span>
              </div>
              {favoriteAssistants.map(assistant => (
                <AssistantItem
                  key={assistant.id}
                  assistant={assistant}
                  isFavorite={true}
                  isSelected={assistant.id === ui?.selectedAssistant}
                  onSelect={() => handleSelectAssistant(assistant.id)}
                  onToggleFavorite={(e) => handleToggleFavorite(e, assistant.id)}
                  getIcon={getAssistantIcon}
                />
              ))}
            </div>
          )}
          
          {recent.length > 0 && !searchTerm && selectedDepartment === 'all' && recentAssistants.length > 0 && (
            <div className="dropdown-section">
              <div className="section-header">
                <Activity className="section-icon" size={14} />
                <span>Recently Used</span>
              </div>
              {recentAssistants.slice(0, 3).map(assistant => (
                <AssistantItem
                  key={assistant.id}
                  assistant={assistant}
                  isFavorite={favorites.includes(assistant.id)}
                  isSelected={assistant.id === ui?.selectedAssistant}
                  onSelect={() => handleSelectAssistant(assistant.id)}
                  onToggleFavorite={(e) => handleToggleFavorite(e, assistant.id)}
                  getIcon={getAssistantIcon}
                />
              ))}
            </div>
          )}
          
          <div className="dropdown-section">
            <div className="section-header">
              <Users className="section-icon" size={14} />
              <span>{searchTerm ? 'Search Results' : 'All AI Assistants'}</span>
              <span className="count">({searchTerm ? filteredBySearch.length : otherAssistants.length})</span>
            </div>
            {(searchTerm ? filteredBySearch : otherAssistants).map(assistant => (
              <AssistantItem
                key={assistant.id}
                assistant={assistant}
                isFavorite={favorites.includes(assistant.id)}
                isSelected={assistant.id === ui?.selectedAssistant}
                onSelect={() => handleSelectAssistant(assistant.id)}
                onToggleFavorite={(e) => handleToggleFavorite(e, assistant.id)}
                getIcon={getAssistantIcon}
              />
            ))}
          </div>
          
          <div className="dropdown-footer">
            <div className="quick-stats">
              <div className="stat">
                <TrendingUp className="stat-icon" size={14} />
                <span>{allAssistants.length} Assistants</span>
              </div>
              <div className="stat">
                <Activity className="stat-icon" size={14} />
                <span>{allAssistants.filter(a => a.metrics.systemHealth === 'optimal').length} Active</span>
              </div>
              {performance?.criticalAlerts?.length > 0 && (
                <div className="stat alert">
                  <AlertCircle className="stat-icon" size={14} />
                  <span>{performance.criticalAlerts.length} Alerts</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AssistantItem = ({ assistant, isFavorite, isSelected, onSelect, onToggleFavorite, getIcon }) => {
  return (
    <div 
      className={`assistant-item ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="item-left">
        <div 
          className="item-avatar"
          style={{ backgroundColor: assistant.colorScheme }}
        >
          {getIcon(assistant.id)}
        </div>
        <div className="item-info">
          <div className="item-name">{assistant.name}</div>
          <div className="item-title">{assistant.title}</div>
          <div className="item-metrics">
            <span className="metric">
              <Activity size={10} />
              {assistant.metrics.activeUsers} users
            </span>
            <span className={`health-badge ${assistant.metrics.systemHealth}`}>
              {assistant.metrics.systemHealth}
            </span>
          </div>
        </div>
      </div>
      <div className="item-right">
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        {assistant.quickStats && (
          <div className="quick-stat">
            <div className="stat-value">{assistant.quickStats.today.value}</div>
            <div className="stat-label">{assistant.quickStats.today.label}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantSelector;
