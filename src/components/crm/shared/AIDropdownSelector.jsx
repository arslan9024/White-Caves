import React, { memo, useCallback, useMemo, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ChevronDown, Star, Clock, Search, X, 
  Users, Briefcase, MessageSquare, DollarSign, 
  Target, Shield, Server, Home, Megaphone
} from 'lucide-react';
import { 
  selectAllAssistantsArray,
  selectCurrentAssistant,
  selectFavorites,
  selectRecent,
  selectUI,
  selectAssistant,
  toggleFavorite,
  toggleDropdown,
  closeDropdown,
  setDepartmentFilter,
  setSearchQuery
} from '../../../store/slices/aiAssistantDashboardSlice';
import './AIDropdownSelector.css';

const DEPARTMENT_CONFIG = {
  all: { label: 'All', icon: null },
  operations: { label: 'Operations', icon: Briefcase },
  sales: { label: 'Sales', icon: Target },
  communications: { label: 'Communications', icon: MessageSquare },
  finance: { label: 'Finance', icon: DollarSign },
  marketing: { label: 'Marketing', icon: Megaphone },
  executive: { label: 'Executive', icon: Users },
  compliance: { label: 'Compliance', icon: Shield },
  technology: { label: 'Technology', icon: Server }
};

const AIDropdownSelector = memo(({ 
  onSelect,
  compact = false,
  showDepartmentFilters = true
}) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  
  const allAssistants = useSelector(selectAllAssistantsArray);
  const currentAssistant = useSelector(selectCurrentAssistant);
  const favorites = useSelector(selectFavorites);
  const recent = useSelector(selectRecent);
  const ui = useSelector(selectUI);
  
  const isOpen = ui?.dropdownOpen || false;
  const searchQuery = ui?.filters?.searchQuery || '';
  const departmentFilter = ui?.filters?.department || 'all';
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dispatch(closeDropdown());
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, dispatch]);
  
  const handleToggle = useCallback(() => {
    dispatch(toggleDropdown());
  }, [dispatch]);
  
  const handleSelect = useCallback((assistantId) => {
    dispatch(selectAssistant(assistantId));
    onSelect?.(assistantId);
  }, [dispatch, onSelect]);
  
  const handleToggleFavorite = useCallback((e, assistantId) => {
    e.stopPropagation();
    dispatch(toggleFavorite(assistantId));
  }, [dispatch]);
  
  const handleSearchChange = useCallback((e) => {
    dispatch(setSearchQuery(e.target.value));
  }, [dispatch]);
  
  const handleDepartmentChange = useCallback((dept) => {
    dispatch(setDepartmentFilter(dept));
  }, [dispatch]);
  
  const filteredAssistants = useMemo(() => {
    let result = allAssistants;
    
    if (departmentFilter !== 'all') {
      result = result.filter(a => a.department === departmentFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.title.toLowerCase().includes(query) ||
        a.department.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [allAssistants, departmentFilter, searchQuery]);
  
  const favoriteAssistants = useMemo(() => 
    allAssistants.filter(a => favorites.includes(a.id)),
    [allAssistants, favorites]
  );
  
  const recentAssistants = useMemo(() => 
    recent.slice(0, 3).map(id => allAssistants.find(a => a.id === id)).filter(Boolean),
    [allAssistants, recent]
  );
  
  const departmentCounts = useMemo(() => {
    const counts = { all: allAssistants.length };
    allAssistants.forEach(a => {
      counts[a.department] = (counts[a.department] || 0) + 1;
    });
    return counts;
  }, [allAssistants]);
  
  return (
    <div 
      className={`ai-dropdown-selector ${compact ? 'compact' : ''} ${isOpen ? 'open' : ''}`}
      ref={dropdownRef}
    >
      <button 
        className="dropdown-trigger"
        onClick={handleToggle}
        style={{ '--accent-color': currentAssistant?.colorScheme || '#0EA5E9' }}
      >
        {currentAssistant ? (
          <>
            <span className="selected-avatar">{currentAssistant.avatar}</span>
            {!compact && (
              <div className="selected-info">
                <span className="selected-name">{currentAssistant.name}</span>
                <span className="selected-title">{currentAssistant.title}</span>
              </div>
            )}
          </>
        ) : (
          <span className="placeholder">Select Assistant</span>
        )}
        <ChevronDown size={18} className={`chevron ${isOpen ? 'rotated' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="dropdown-panel">
          <div className="dropdown-header">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search assistants..."
                value={searchQuery}
                onChange={handleSearchChange}
                autoFocus
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => dispatch(setSearchQuery(''))}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          
          {showDepartmentFilters && (
            <div className="department-filters">
              {Object.entries(DEPARTMENT_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  className={`dept-filter ${departmentFilter === key ? 'active' : ''}`}
                  onClick={() => handleDepartmentChange(key)}
                >
                  {config.icon && <config.icon size={12} />}
                  <span>{config.label}</span>
                  <span className="count">{departmentCounts[key] || 0}</span>
                </button>
              ))}
            </div>
          )}
          
          <div className="dropdown-content">
            {favoriteAssistants.length > 0 && !searchQuery && departmentFilter === 'all' && (
              <div className="assistant-section">
                <div className="section-label">
                  <Star size={12} />
                  <span>Favorites</span>
                </div>
                {favoriteAssistants.map(assistant => (
                  <AssistantItem
                    key={assistant.id}
                    assistant={assistant}
                    isSelected={currentAssistant?.id === assistant.id}
                    isFavorite={true}
                    onSelect={handleSelect}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
            
            {recentAssistants.length > 0 && !searchQuery && departmentFilter === 'all' && (
              <div className="assistant-section">
                <div className="section-label">
                  <Clock size={12} />
                  <span>Recent</span>
                </div>
                {recentAssistants.map(assistant => (
                  <AssistantItem
                    key={assistant.id}
                    assistant={assistant}
                    isSelected={currentAssistant?.id === assistant.id}
                    isFavorite={favorites.includes(assistant.id)}
                    onSelect={handleSelect}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
            
            <div className="assistant-section">
              {(searchQuery || departmentFilter !== 'all') && (
                <div className="section-label">
                  <span>Results ({filteredAssistants.length})</span>
                </div>
              )}
              {(!searchQuery && departmentFilter === 'all') && (
                <div className="section-label">
                  <span>All Assistants</span>
                </div>
              )}
              {filteredAssistants.length === 0 ? (
                <div className="no-results">No assistants found</div>
              ) : (
                filteredAssistants.map(assistant => (
                  <AssistantItem
                    key={assistant.id}
                    assistant={assistant}
                    isSelected={currentAssistant?.id === assistant.id}
                    isFavorite={favorites.includes(assistant.id)}
                    onSelect={handleSelect}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))
              )}
            </div>
          </div>
          
          <div className="dropdown-footer">
            <span className="footer-stat">{allAssistants.length} assistants</span>
            <span className="footer-stat">{favorites.length} favorites</span>
          </div>
        </div>
      )}
    </div>
  );
});

const AssistantItem = memo(({ 
  assistant, 
  isSelected, 
  isFavorite, 
  onSelect, 
  onToggleFavorite 
}) => (
  <div
    className={`assistant-item ${isSelected ? 'selected' : ''}`}
    onClick={() => onSelect(assistant.id)}
    style={{ '--item-color': assistant.colorScheme }}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onSelect(assistant.id)}
  >
    <span className="item-avatar">{assistant.avatar}</span>
    <div className="item-info">
      <span className="item-name">{assistant.name}</span>
      <span className="item-title">{assistant.title}</span>
    </div>
    <span className="item-dept">{assistant.department}</span>
    <button
      className={`item-favorite ${isFavorite ? 'active' : ''}`}
      onClick={(e) => onToggleFavorite(e, assistant.id)}
    >
      <Star size={14} fill={isFavorite ? assistant.colorScheme : 'none'} />
    </button>
  </div>
));

AIDropdownSelector.displayName = 'AIDropdownSelector';
AssistantItem.displayName = 'AssistantItem';
export default AIDropdownSelector;
