import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Search, Filter, Grid, List, Bot, ChevronRight,
  Activity, AlertCircle, CheckCircle, Clock, ExternalLink,
  Building2, Users, Briefcase, MessageSquare, Wallet, 
  Megaphone, Shield, Server, Brain, Scale
} from 'lucide-react';
import { selectAssistant } from '../../../store/slices/aiAssistantDashboardSlice';
import { AI_ASSISTANTS_REGISTRY, getDepartmentGroups } from '../../../data/organization/aiAssistantsRegistry';
import './AIAssistantsRegistry.css';

const DEPARTMENT_ICONS = {
  Executive: Briefcase,
  Operations: Building2,
  Sales: Users,
  Communications: MessageSquare,
  Finance: Wallet,
  Marketing: Megaphone,
  Compliance: Shield,
  Technology: Server,
  Intelligence: Brain,
  Legal: Scale
};

const StatusIndicator = ({ status }) => {
  const statusConfig = {
    active: { icon: CheckCircle, label: 'Active', color: '#10b981' },
    inactive: { icon: Clock, label: 'Inactive', color: '#64748b' },
    error: { icon: AlertCircle, label: 'Error', color: '#ef4444' },
    maintenance: { icon: Activity, label: 'Maintenance', color: '#f59e0b' }
  };

  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;

  return (
    <span className={`status-indicator ${status}`} style={{ '--status-color': config.color }}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  );
};

const AssistantCard = ({ assistant, onClick, compact = false }) => {
  const DeptIcon = DEPARTMENT_ICONS[assistant.department] || Bot;

  if (compact) {
    return (
      <div className="assistant-card compact" onClick={onClick}>
        <div className="card-avatar" style={{ '--assistant-color': assistant.color }}>
          <Bot size={18} />
        </div>
        <div className="card-info">
          <span className="card-name">{assistant.name}</span>
          <span className="card-role">{assistant.role}</span>
        </div>
        <StatusIndicator status={assistant.status} />
      </div>
    );
  }

  return (
    <div className="assistant-card" onClick={onClick}>
      <div className="card-header">
        <div className="card-avatar" style={{ '--assistant-color': assistant.color }}>
          <Bot size={24} />
        </div>
        <div className="card-meta">
          <span className="card-name">{assistant.name}</span>
          <span className="card-department">
            <DeptIcon size={12} />
            {assistant.department}
          </span>
        </div>
        <StatusIndicator status={assistant.status} />
      </div>

      <p className="card-role">{assistant.role}</p>
      <p className="card-description">{assistant.description}</p>

      <div className="card-capabilities">
        {assistant.capabilities.slice(0, 3).map((cap, idx) => (
          <span key={idx} className="capability-tag">{cap}</span>
        ))}
        {assistant.capabilities.length > 3 && (
          <span className="capability-more">+{assistant.capabilities.length - 3}</span>
        )}
      </div>

      <div className="card-footer">
        <span className="access-level">{assistant.accessLevel}</span>
        <button className="view-dashboard-btn">
          Open Dashboard <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

const AIAssistantsRegistry = ({ 
  onSelectAssistant,
  viewMode: propViewMode,
  showFilters = true,
  showSearch = true,
  compactMode = false
}) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [viewMode, setViewMode] = useState(propViewMode || 'grid');

  const departmentGroups = useMemo(() => getDepartmentGroups(), []);
  const departments = Object.keys(departmentGroups);

  const filteredAssistants = useMemo(() => {
    let result = AI_ASSISTANTS_REGISTRY;

    if (selectedDepartment !== 'all') {
      result = result.filter(a => a.department === selectedDepartment);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.capabilities.some(c => c.toLowerCase().includes(q))
      );
    }

    return result;
  }, [selectedDepartment, searchQuery]);

  const handleSelectAssistant = (assistant) => {
    dispatch(selectAssistant(assistant.id));
    onSelectAssistant?.(assistant);
  };

  const stats = useMemo(() => ({
    total: AI_ASSISTANTS_REGISTRY.length,
    active: AI_ASSISTANTS_REGISTRY.filter(a => a.status === 'active').length,
    departments: departments.length
  }), [departments]);

  return (
    <div className={`ai-registry ${compactMode ? 'compact' : ''}`}>
      <div className="registry-header">
        <div className="registry-stats">
          <div className="stat">
            <Bot size={16} />
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">AI Assistants</span>
          </div>
          <div className="stat active">
            <CheckCircle size={16} />
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <Building2 size={16} />
            <span className="stat-value">{stats.departments}</span>
            <span className="stat-label">Departments</span>
          </div>
        </div>

        <div className="registry-controls">
          {showSearch && (
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search assistants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {showFilters && (
            <div className="filter-group">
              <Filter size={14} />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}

          <div className="view-toggle">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="assistants-grid">
          {filteredAssistants.map(assistant => (
            <AssistantCard
              key={assistant.id}
              assistant={assistant}
              onClick={() => handleSelectAssistant(assistant)}
              compact={compactMode}
            />
          ))}
        </div>
      ) : (
        <div className="assistants-list">
          {departments.map(dept => {
            const deptAssistants = filteredAssistants.filter(a => a.department === dept);
            if (deptAssistants.length === 0) return null;

            const DeptIcon = DEPARTMENT_ICONS[dept] || Building2;

            return (
              <div key={dept} className="department-group">
                <div className="department-header">
                  <DeptIcon size={18} />
                  <h4>{dept}</h4>
                  <span className="count">{deptAssistants.length}</span>
                </div>
                <div className="department-assistants">
                  {deptAssistants.map(assistant => (
                    <AssistantCard
                      key={assistant.id}
                      assistant={assistant}
                      onClick={() => handleSelectAssistant(assistant)}
                      compact
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredAssistants.length === 0 && (
        <div className="no-results">
          <Bot size={48} />
          <h3>No assistants found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistantsRegistry;
