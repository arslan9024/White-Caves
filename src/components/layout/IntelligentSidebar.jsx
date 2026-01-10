import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, Search, Star, Pin,
  LayoutDashboard, Users, Building2, UserCog, DollarSign,
  Bot, BarChart3, Settings, Workflow, MessageSquare,
  TrendingUp, Shield, Briefcase, Database, Zap, FileText
} from 'lucide-react';
import {
  selectSidebar,
  selectLayout,
  setActiveSection,
  setActiveDepartment,
  setSidebarSearch,
  togglePinnedItem
} from '../../store/slices/navigationUISlice';
import { selectActiveRole, selectPermissions } from '../../store/slices/accessControlSlice';
import { setActiveWorkspace, setActiveAssistant } from '../../store/slices/dashboardViewSlice';
import { DEPARTMENTS, AI_ASSISTANTS, MAIN_NAVIGATION, getNavigationByRole, getAssistantsByDepartment } from '../../config/navigationMap';
import './IntelligentSidebar.css';

const DEPARTMENT_ICONS = {
  operations: Workflow,
  sales: TrendingUp,
  communications: MessageSquare,
  finance: DollarSign,
  marketing: Zap,
  executive: Briefcase,
  compliance: Shield,
  technology: Database,
  intelligence: BarChart3,
  legal: FileText
};

const IntelligentSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebar = useSelector(selectSidebar);
  const layout = useSelector(selectLayout);
  const activeRole = useSelector(selectActiveRole);
  const permissions = useSelector(selectPermissions);

  const [expandedSections, setExpandedSections] = useState(['navigation']);
  const [expandedDepartments, setExpandedDepartments] = useState([]);

  const isCollapsed = sidebar.isCollapsed;
  const isMobile = layout.breakpoint === 'mobile';
  const isOpen = isMobile ? layout.isMobileMenuOpen : true;

  const filteredNavigation = useMemo(() => {
    return getNavigationByRole(activeRole);
  }, [activeRole]);

  const filteredAssistants = useMemo(() => {
    if (!sidebar.searchQuery) return AI_ASSISTANTS;
    const query = sidebar.searchQuery.toLowerCase();
    return Object.fromEntries(
      Object.entries(AI_ASSISTANTS).filter(([_, a]) =>
        a.name.toLowerCase().includes(query) ||
        a.role.toLowerCase().includes(query) ||
        a.department.toLowerCase().includes(query)
      )
    );
  }, [sidebar.searchQuery]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleDepartment = (deptId) => {
    setExpandedDepartments(prev =>
      prev.includes(deptId)
        ? prev.filter(d => d !== deptId)
        : [...prev, deptId]
    );
  };

  const handleNavClick = (item) => {
    if (item.workspace) {
      dispatch(setActiveWorkspace(item.workspace));
    }
    navigate(item.path);
    dispatch(setActiveSection(item.id));
  };

  const handleAssistantClick = (assistant) => {
    dispatch(setActiveAssistant(assistant.id));
    dispatch(setActiveWorkspace('ai-command'));
    navigate('/owner/dashboard');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  if (!isOpen && isMobile) return null;

  return (
    <aside className={`intelligent-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
      {!isCollapsed && (
        <div className="sidebar-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search assistants..."
            value={sidebar.searchQuery}
            onChange={(e) => dispatch(setSidebarSearch(e.target.value))}
          />
        </div>
      )}

      <nav className="sidebar-nav">
        <div className="nav-section">
          {!isCollapsed && (
            <div 
              className="nav-section-header"
              onClick={() => toggleSection('navigation')}
            >
              <span>Navigation</span>
              {expandedSections.includes('navigation') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          )}
          
          {(isCollapsed || expandedSections.includes('navigation')) && (
            <ul className="nav-list">
              {filteredNavigation.map(item => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);
                const hasChildren = item.children?.length > 0;
                const isExpanded = expandedSections.includes(item.id);

                return (
                  <li key={item.id} className="nav-item-container">
                    <button
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        if (hasChildren && !isCollapsed) {
                          toggleSection(item.id);
                        } else {
                          handleNavClick(item);
                        }
                      }}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon size={20} />
                      {!isCollapsed && (
                        <>
                          <span className="nav-label">{item.label}</span>
                          {hasChildren && (
                            <span className="nav-chevron">
                              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </span>
                          )}
                        </>
                      )}
                    </button>

                    {!isCollapsed && hasChildren && isExpanded && (
                      <ul className="nav-children">
                        {item.children.map(child => (
                          <li key={child.id}>
                            <button
                              className={`nav-child-item ${isActiveRoute(child.path) ? 'active' : ''}`}
                              onClick={() => navigate(child.path)}
                            >
                              {child.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {permissions.canAccessAIAssistants && (
          <div className="nav-section">
            {!isCollapsed && (
              <div 
                className="nav-section-header"
                onClick={() => toggleSection('assistants')}
              >
                <span>AI Assistants</span>
                <span className="section-badge">{Object.keys(filteredAssistants).length}</span>
                {expandedSections.includes('assistants') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
            )}

            {(isCollapsed || expandedSections.includes('assistants')) && (
              <div className="departments-list">
                {Object.values(DEPARTMENTS).map(dept => {
                  const DeptIcon = DEPARTMENT_ICONS[dept.id] || Bot;
                  const deptAssistants = getAssistantsByDepartment(dept.id).filter(a => 
                    filteredAssistants[a.id]
                  );
                  const isExpanded = expandedDepartments.includes(dept.id);

                  if (deptAssistants.length === 0) return null;

                  return (
                    <div key={dept.id} className="department-group">
                      <button
                        className={`department-header ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => !isCollapsed && toggleDepartment(dept.id)}
                        style={{ '--dept-color': dept.color }}
                        title={isCollapsed ? dept.name : undefined}
                      >
                        <div className="dept-icon">
                          <DeptIcon size={16} />
                        </div>
                        {!isCollapsed && (
                          <>
                            <span className="dept-name">{dept.name}</span>
                            <span className="dept-count">{deptAssistants.length}</span>
                            <ChevronRight size={14} className={`dept-chevron ${isExpanded ? 'rotated' : ''}`} />
                          </>
                        )}
                      </button>

                      {!isCollapsed && isExpanded && (
                        <ul className="assistants-list">
                          {deptAssistants.map(assistant => (
                            <li key={assistant.id}>
                              <div className="assistant-item-wrapper">
                                <button
                                  className="assistant-item"
                                  onClick={() => handleAssistantClick(assistant)}
                                  style={{ '--assistant-color': assistant.color }}
                                >
                                  <div className="assistant-indicator" />
                                  <div className="assistant-info">
                                    <span className="assistant-name">{assistant.name}</span>
                                    <span className="assistant-role">{assistant.role}</span>
                                  </div>
                                </button>
                                <button 
                                  className={`pin-btn ${sidebar.pinnedItems.includes(assistant.id) ? 'pinned' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(togglePinnedItem(assistant.id));
                                  }}
                                  aria-label={`Pin ${assistant.name}`}
                                >
                                  <Pin size={12} />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      {!isCollapsed && sidebar.pinnedItems.length > 0 && (
        <div className="sidebar-pinned">
          <div className="pinned-header">
            <Star size={14} />
            <span>Pinned</span>
          </div>
          <div className="pinned-items">
            {sidebar.pinnedItems.map(id => {
              const assistant = AI_ASSISTANTS[id];
              if (!assistant) return null;
              return (
                <button
                  key={id}
                  className="pinned-item"
                  onClick={() => handleAssistantClick(assistant)}
                  style={{ '--assistant-color': assistant.color }}
                >
                  <div className="assistant-indicator" />
                  <span>{assistant.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};

export default IntelligentSidebar;
