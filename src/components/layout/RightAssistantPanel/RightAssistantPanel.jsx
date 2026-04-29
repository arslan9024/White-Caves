import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bot, ChevronLeft, ChevronRight, Search, Star, Bell,
  ChevronDown, ChevronUp, Zap, MessageSquare, Building2,
  Target, TrendingUp, Wallet, Megaphone, Shield, Server,
  Scale, Briefcase, Users, Eye, Activity, Clock, Command,
  Database, Palette, Home, Brain
} from 'lucide-react';
import {
  selectRightSidebar,
  selectAssistant,
  collapseRightSidebar,
  toggleRightSidebar,
  clearRightSelection
} from '../../../store/slices/workspaceSlice';
import { AI_ASSISTANTS, DEPARTMENTS } from '../../../config/assistantRegistry';
import './RightAssistantPanel.css';

const ICON_MAP = {
  MessageSquare, Building2, Target, Bot, Users, TrendingUp, Home,
  Wallet, Megaphone, Briefcase, Shield, Server, Palette, Database,
  Scale, Eye, Search, Zap, Activity, Clock, Command, Brain
};

export default function RightAssistantPanel() {
  const dispatch = useDispatch();
  const rightSidebar = useSelector(selectRightSidebar);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favoriteAssistants');
    return stored ? JSON.parse(stored) : [];
  });

  const { isOpen, isCollapsed, selectedAssistant } = rightSidebar;

  const assistantList = useMemo(() => Object.values(AI_ASSISTANTS), []);

  const assistantsByDept = useMemo(() => {
    const grouped = {};
    assistantList.forEach(assistant => {
      const dept = assistant.department;
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(assistant);
    });
    return grouped;
  }, [assistantList]);

  const filteredAssistants = useMemo(() => {
    let list = assistantList;
    if (searchTerm) {
      list = list.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (showFavoritesOnly) {
      list = list.filter(a => favorites.includes(a.id));
    }
    return list;
  }, [assistantList, searchTerm, showFavoritesOnly, favorites]);

  const handleAssistantClick = (assistant) => {
    dispatch(selectAssistant(assistant.id));
  };

  const toggleDepartment = (deptId) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [deptId]: !prev[deptId]
    }));
  };

  const toggleFavorite = (assistantId, e) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(assistantId)
      ? favorites.filter(id => id !== assistantId)
      : [...favorites, assistantId];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteAssistants', JSON.stringify(newFavorites));
  };

  const getIcon = (iconName) => {
    return ICON_MAP[iconName] || Bot;
  };

  const selectedAssistantData = selectedAssistant ? AI_ASSISTANTS[selectedAssistant] : null;

  if (!isOpen) {
    return (
      <div className="right-panel-collapsed">
        <button 
          className="panel-expand-btn"
          onClick={() => dispatch(toggleRightSidebar())}
          title="Open AI Command Center"
        >
          <Bot size={20} />
        </button>
      </div>
    );
  }

  return (
    <aside className={`right-assistant-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="panel-header">
        <div className="panel-title">
          <Brain size={20} className="title-icon" />
          {!isCollapsed && <span>AI Command Center</span>}
        </div>
        <div className="header-actions">
          <button 
            className="action-btn"
            onClick={() => dispatch(collapseRightSidebar(!isCollapsed))}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="panel-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search assistants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="panel-filters">
            <button 
              className={`filter-btn ${!showFavoritesOnly ? 'active' : ''}`}
              onClick={() => setShowFavoritesOnly(false)}
            >
              All ({assistantList.length})
            </button>
            <button 
              className={`filter-btn ${showFavoritesOnly ? 'active' : ''}`}
              onClick={() => setShowFavoritesOnly(true)}
            >
              <Star size={12} /> Favorites ({favorites.length})
            </button>
          </div>
        </>
      )}

      <nav className="panel-nav">
        {Object.entries(DEPARTMENTS).map(([deptId, dept]) => {
          const deptAssistants = assistantsByDept[deptId] || [];
          const filteredDeptAssistants = deptAssistants.filter(a => 
            filteredAssistants.some(fa => fa.id === a.id)
          );
          
          if (filteredDeptAssistants.length === 0) return null;
          
          const isExpanded = expandedDepartments[deptId] !== false;
          const DeptIcon = getIcon(dept.icon);
          const hasSelected = filteredDeptAssistants.some(a => a.id === selectedAssistant);

          return (
            <div key={deptId} className={`dept-section ${hasSelected ? 'has-selected' : ''}`}>
              <button 
                className="dept-header"
                onClick={() => toggleDepartment(deptId)}
                style={{ '--dept-color': dept.color }}
              >
                {isCollapsed ? (
                  <DeptIcon size={18} style={{ color: dept.color }} />
                ) : (
                  <>
                    <div className="dept-indicator" style={{ background: dept.color }} />
                    <span className="dept-name">{dept.label}</span>
                    <span className="dept-count">{filteredDeptAssistants.length}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </>
                )}
              </button>

              {isExpanded && !isCollapsed && (
                <div className="assistants-list">
                  {filteredDeptAssistants.map(assistant => {
                    const Icon = getIcon(assistant.icon);
                    const isActive = selectedAssistant === assistant.id;
                    const isFavorite = favorites.includes(assistant.id);

                    return (
                      <button
                        key={assistant.id}
                        className={`assistant-item ${isActive ? 'active' : ''}`}
                        onClick={() => handleAssistantClick(assistant)}
                        style={{ '--assistant-color': assistant.color }}
                      >
                        <div className="assistant-avatar" style={{ backgroundColor: `${assistant.color}20` }}>
                          <Icon size={16} style={{ color: assistant.color }} />
                        </div>
                        <div className="assistant-info">
                          <span className="assistant-name">{assistant.name}</span>
                          <span className="assistant-title">{assistant.title}</span>
                        </div>
                        <button 
                          className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
                          onClick={(e) => toggleFavorite(assistant.id, e)}
                        >
                          <Star size={12} fill={isFavorite ? '#F59E0B' : 'none'} />
                        </button>
                        {isActive && <div className="active-indicator" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {!isCollapsed && selectedAssistantData && (
        <div className="selected-assistant-preview">
          <div className="preview-header">
            <span className="preview-label">Selected</span>
            <button className="clear-btn" onClick={() => dispatch(clearRightSelection())}>
              Clear
            </button>
          </div>
          <div className="preview-content">
            <div className="preview-avatar" style={{ backgroundColor: `${selectedAssistantData.color}20` }}>
              {selectedAssistantData.avatar}
            </div>
            <div className="preview-info">
              <span className="preview-name">{selectedAssistantData.name}</span>
              <span className="preview-title">{selectedAssistantData.title}</span>
            </div>
          </div>
          <div className="preview-capabilities">
            <span className="cap-label">Capabilities</span>
            <div className="cap-tags">
              {selectedAssistantData.capabilities?.slice(0, 4).map((cap, i) => (
                <span key={i} className="cap-tag">{cap.replace(/_/g, ' ')}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
