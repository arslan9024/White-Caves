import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Building2, Users, Home, TrendingUp, Wallet, Megaphone,
  Shield, Server, Scale, Briefcase, ChevronLeft, ChevronRight,
  Search, LayoutGrid, FileText, Package, Brain, Settings,
  ChevronDown, ChevronUp, UserCheck, Wrench
} from 'lucide-react';
import {
  selectLeftSidebar,
  selectDashboardMode,
  selectDepartment,
  selectPillar,
  collapseLeftSidebar,
  toggleLeftSidebar
} from '../../../store/slices/workspaceSlice';
import './LeftSidebarCRM.css';

const CRM_DEPARTMENTS = [
  { id: 'executive', label: 'Executive', icon: Briefcase, color: '#10B981', description: 'Strategy & Oversight' },
  { id: 'sales', label: 'Sales', icon: TrendingUp, color: '#8B5CF6', description: 'Property Acquisition' },
  { id: 'leasing', label: 'Leasing', icon: Home, color: '#F59E0B', description: 'Tenant Management' },
  { id: 'property_management', label: 'Property Mgmt', icon: Building2, color: '#3B82F6', description: 'Maintenance & Assets' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, color: '#EC4899', description: 'Lead Generation' },
  { id: 'finance', label: 'Finance', icon: Wallet, color: '#F59E0B', description: 'Financial Reporting' },
  { id: 'compliance', label: 'Legal & Compliance', icon: Shield, color: '#6366F1', description: 'RERA/DLD Compliance' },
  { id: 'operations', label: 'Operations', icon: Wrench, color: '#0EA5E9', description: 'Logistics & Workflow' },
  { id: 'technology', label: 'Technology', icon: Server, color: '#06B6D4', description: 'Platform Support' },
  { id: 'hr', label: 'Human Resources', icon: UserCheck, color: '#14B8A6', description: 'Staff Management' }
];

const PLATFORM_PILLARS = [
  { id: 'discovery', label: 'Property Discovery', icon: Search, color: '#B03737' },
  { id: 'services', label: 'Service Hub', icon: Package, color: '#B03737' },
  { id: 'crm', label: 'CRM Overview', icon: LayoutGrid, color: '#B03737' },
  { id: 'inventory', label: 'Inventory', icon: FileText, color: '#B03737' },
  { id: 'ai_center', label: 'AI Command Center', icon: Brain, color: '#B03737' }
];

export default function LeftSidebarCRM() {
  const dispatch = useDispatch();
  const leftSidebar = useSelector(selectLeftSidebar);
  const dashboardMode = useSelector(selectDashboardMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    pillars: true,
    departments: true
  });

  const { isOpen, isCollapsed, selectedDepartment, selectedPillar } = leftSidebar;

  const handleDepartmentClick = (deptId) => {
    dispatch(selectDepartment(deptId));
  };

  const handlePillarClick = (pillarId) => {
    dispatch(selectPillar(pillarId));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredDepartments = CRM_DEPARTMENTS.filter(dept =>
    dept.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) {
    return (
      <div className="left-sidebar-collapsed">
        <button 
          className="sidebar-expand-btn"
          onClick={() => dispatch(toggleLeftSidebar())}
          title="Expand CRM Sidebar"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <aside className={`left-sidebar-crm ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <LayoutGrid size={20} className="title-icon" />
          {!isCollapsed && <span>CRM Dashboard</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => dispatch(collapseLeftSidebar(!isCollapsed))}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="sidebar-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <nav className="sidebar-nav">
        <div className="nav-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('pillars')}
          >
            {!isCollapsed && (
              <>
                <span className="section-label">Platform Pillars</span>
                {expandedSections.pillars ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </>
            )}
          </button>
          
          {expandedSections.pillars && (
            <div className="section-items">
              {PLATFORM_PILLARS.map(pillar => {
                const Icon = pillar.icon;
                const isActive = selectedPillar === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    className={`nav-item pillar-item ${isActive ? 'active' : ''}`}
                    onClick={() => handlePillarClick(pillar.id)}
                    title={pillar.label}
                  >
                    <div className="item-icon" style={{ color: pillar.color }}>
                      <Icon size={18} />
                    </div>
                    {!isCollapsed && <span className="item-label">{pillar.label}</span>}
                    {isActive && <div className="active-indicator" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="nav-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('departments')}
          >
            {!isCollapsed && (
              <>
                <span className="section-label">Departments</span>
                <span className="section-count">{CRM_DEPARTMENTS.length}</span>
                {expandedSections.departments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </>
            )}
          </button>
          
          {expandedSections.departments && (
            <div className="section-items departments-grid">
              {filteredDepartments.map(dept => {
                const Icon = dept.icon;
                const isActive = selectedDepartment === dept.id;
                return (
                  <button
                    key={dept.id}
                    className={`nav-item dept-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleDepartmentClick(dept.id)}
                    title={`${dept.label} - ${dept.description}`}
                  >
                    <div className="item-icon" style={{ backgroundColor: `${dept.color}15`, color: dept.color }}>
                      <Icon size={18} />
                    </div>
                    {!isCollapsed && (
                      <div className="item-content">
                        <span className="item-label">{dept.label}</span>
                        <span className="item-desc">{dept.description}</span>
                      </div>
                    )}
                    {isActive && <div className="active-indicator" style={{ backgroundColor: dept.color }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {!isCollapsed && (
        <div className="sidebar-footer">
          <button className="settings-btn" title="CRM Settings">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </aside>
  );
}
