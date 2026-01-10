import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, Search, Bot, Bell, Activity, Zap,
  MessageSquare, TrendingUp, DollarSign, Briefcase, Shield,
  Database, BarChart3, FileText, Workflow, Settings, Star,
  CheckCircle, AlertTriangle, Clock, Users, LayoutGrid, List,
  Eye, Target, Home, Server, Palette, Scale, Building, Landmark,
  Wallet, Users2, Map, LayoutDashboard, Lightbulb, Wrench, Download,
  FileSpreadsheet, ScanText, Radio, GitBranch, MessageCircle, Filter,
  Handshake, LineChart, Calculator, UserPlus, Calendar, Award, Receipt,
  CreditCard, Lock, PieChart, Share2, Brain, UserCheck, History,
  Rocket, Book, Layers, Sun, Code, Gauge, AlertCircle, ClipboardCheck,
  Send, Sparkles, Flag, Key, Cpu, Crown, Compass, Menu, X
} from 'lucide-react';
import {
  selectSidebar,
  setSidebarSearch
} from '../../store/slices/navigationUISlice';
import { setActiveWorkspace, setActiveAssistant, setActiveFeatureTab } from '../../store/slices/dashboardViewSlice';
import {
  selectAllAssistantsArray,
  selectAssistantsByDepartment,
  selectPerformance,
  selectGlobalUnreadCount,
  selectAllUnreadCounts,
  selectUI,
  selectCurrentAssistant,
  selectFavorites,
  toggleFavorite,
  selectAssistant
} from '../../store/slices/aiAssistantDashboardSlice';
import { ASSISTANT_FEATURES, getAssistantFeatures, getDefaultFeature } from '../../config/assistantFeatures';
import { DEPARTMENTS } from '../../config/navigationMap';
import './CommandSidebar.css';

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

const ASSISTANT_ICONS = {
  mary: FileText,
  theodora: DollarSign,
  olivia: Zap,
  zoe: Briefcase,
  laila: Shield,
  linda: MessageSquare,
  sophia: Users,
  daisy: Home,
  clara: Target,
  nina: Bot,
  nancy: Users2,
  aurora: Server,
  hazel: Palette,
  willow: Database,
  evangeline: Scale,
  sentinel: Eye,
  hunter: Target,
  henry: Shield,
  cipher: BarChart3,
  atlas: Map,
  vesta: Building,
  juno: Building,
  kairos: Landmark,
  maven: Wallet
};

const FEATURE_ICONS = {
  dashboard: LayoutDashboard,
  suggestions: Lightbulb,
  reports: FileText,
  analytics: BarChart3,
  briefings: Briefcase,
  planning: Target,
  inventory: Building,
  data_tools: Wrench,
  asset_fetcher: Download,
  import: FileSpreadsheet,
  ocr: ScanText,
  conversations: MessageSquare,
  agents: Users,
  templates: FileText,
  broadcasts: Radio,
  scoring: Target,
  bot_builder: Bot,
  flows: GitBranch,
  sessions: MessageCircle,
  pipeline: Filter,
  leads: Users,
  nurturing: Workflow,
  timeline: Clock,
  deals: Handshake,
  forecast: LineChart,
  commission: Calculator,
  employees: Users,
  recruitment: UserPlus,
  attendance: Calendar,
  performance: Award,
  leases: FileText,
  tenants: Users,
  maintenance: Wrench,
  invoices: Receipt,
  payments: CreditCard,
  escrow: Lock,
  budget: PieChart,
  campaigns: Zap,
  social: Share2,
  automation: Zap,
  intelligence: Brain,
  kyc: UserCheck,
  aml: Shield,
  contracts: FileText,
  audit: History,
  systems: Activity,
  deployments: Rocket,
  documentation: Book,
  governance: Shield,
  components: Layers,
  design_system: Palette,
  accessibility: Eye,
  themes: Sun,
  apis: Code,
  database: Database,
  security: Lock,
  risks: AlertTriangle,
  regulations: Scale,
  library: Book,
  monitoring: Eye,
  inspections: ClipboardCheck,
  emergency: AlertCircle,
  prospects: Users,
  outreach: Send,
  patterns: Sparkles,
  enrichment: Database,
  events: List,
  trends: TrendingUp,
  predictions: LineChart,
  competitors: Users,
  indicators: BarChart3,
  projects: Building,
  feasibility: Calculator,
  developers: Users,
  zoning: Map,
  milestones: Flag,
  snagging: ClipboardCheck,
  handover: Key,
  defects: AlertCircle,
  facilities: Building,
  iot: Cpu,
  energy: Zap,
  vip: Crown,
  concierge: Sparkles,
  lifestyle: Compass,
  partners: Handshake,
  portfolio: PieChart,
  yields: TrendingUp,
  tax: Calculator,
  advice: Lightbulb
};

const QuickStats = ({ assistants, performance }) => {
  const activeCount = assistants.filter(a => a.metrics?.systemHealth === 'optimal').length;
  const alertCount = performance?.criticalAlerts?.length || 0;
  
  return (
    <div className="command-quick-stats">
      <div className="stat-item">
        <div className="stat-icon active">
          <Bot size={14} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{activeCount}/{assistants.length}</span>
          <span className="stat-label">Active</span>
        </div>
      </div>
      <div className="stat-item">
        <div className="stat-icon health">
          <Activity size={14} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{performance?.overallHealth || 98}%</span>
          <span className="stat-label">Health</span>
        </div>
      </div>
      <div className="stat-item">
        <div className={`stat-icon ${alertCount > 0 ? 'alert' : 'ok'}`}>
          <Bell size={14} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{alertCount}</span>
          <span className="stat-label">Alerts</span>
        </div>
      </div>
    </div>
  );
};

const CommandSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const sidebar = useSelector(selectSidebar) || {};
  const allAssistants = useSelector(selectAllAssistantsArray);
  const assistantsByDepartment = useSelector(selectAssistantsByDepartment);
  const performance = useSelector(selectPerformance);
  const globalUnread = useSelector(selectGlobalUnreadCount);
  const unreadCounts = useSelector(selectAllUnreadCounts);
  const ui = useSelector(selectUI);
  const currentAssistant = useSelector(selectCurrentAssistant);
  const favorites = useSelector(selectFavorites);
  
  const [expandedDepartments, setExpandedDepartments] = useState(['executive', 'operations', 'sales']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const currentFeatures = useMemo(() => {
    if (!currentAssistant) return [];
    return getAssistantFeatures(currentAssistant.id);
  }, [currentAssistant]);
  
  const selectedFeature = useSelector(state => state.dashboardView?.activeFeatureTab) || 'dashboard';
  
  const filteredByDepartment = useMemo(() => {
    if (!searchQuery) return assistantsByDepartment;
    
    const query = searchQuery.toLowerCase();
    const filtered = {};
    
    Object.entries(assistantsByDepartment).forEach(([dept, assistants]) => {
      const matches = assistants.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.title.toLowerCase().includes(query)
      );
      if (matches.length > 0) {
        filtered[dept] = matches;
      }
    });
    
    return filtered;
  }, [assistantsByDepartment, searchQuery]);

  const toggleDepartment = useCallback((deptId) => {
    setExpandedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  }, []);

  const handleAssistantClick = useCallback((assistant) => {
    dispatch(selectAssistant(assistant.id));
    dispatch(setActiveAssistant(assistant.id));
    dispatch(setActiveWorkspace('ai-command'));
    dispatch(setActiveFeatureTab('dashboard'));
    setIsMobileOpen(false);
    navigate('/md/dashboard');
  }, [dispatch, navigate]);
  
  const handleFeatureClick = useCallback((featureId) => {
    dispatch(setActiveFeatureTab(featureId));
  }, [dispatch]);

  const handleToggleFavorite = useCallback((e, assistantId) => {
    e.stopPropagation();
    dispatch(toggleFavorite(assistantId));
  }, [dispatch]);

  const getAssistantStatus = useCallback((assistant) => {
    if (!assistant) return 'offline';
    if (assistant.metrics?.systemHealth === 'optimal') return 'active';
    if (assistant.metrics?.systemHealth === 'warning') return 'warning';
    return 'idle';
  }, []);

  const getAssistantIcon = useCallback((assistantId) => {
    return ASSISTANT_ICONS[assistantId] || Bot;
  }, []);
  
  const getFeatureIcon = useCallback((iconName) => {
    return FEATURE_ICONS[iconName] || LayoutDashboard;
  }, []);

  return (
    <>
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <aside className={`command-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Bot size={24} />
            <span>AI Command</span>
          </div>
          {globalUnread > 0 && (
            <div className="global-badge">
              <Bell size={14} />
              <span>{globalUnread}</span>
            </div>
          )}
        </div>
        
        <QuickStats assistants={allAssistants} performance={performance} />
        
        <div className="sidebar-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search assistants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sidebar-sections">
          <div className="selector-section assistants-section">
            <div className="section-header">
              <Users size={16} />
              <span>AI Assistants</span>
              <span className="section-count">{allAssistants.length}</span>
            </div>
            
            <div className="section-content scrollable">
              {Object.values(DEPARTMENTS).map(dept => {
                const DeptIcon = DEPARTMENT_ICONS[dept.id] || Bot;
                const deptAssistants = filteredByDepartment[dept.id] || [];
                const isExpanded = expandedDepartments.includes(dept.id);
                const deptUnread = deptAssistants.reduce((sum, a) => sum + (unreadCounts[a.id] || 0), 0);
                const hasSelectedAssistant = currentAssistant && deptAssistants.some(a => a.id === currentAssistant.id);

                if (deptAssistants.length === 0) return null;

                return (
                  <div key={dept.id} className={`department-group ${hasSelectedAssistant ? 'has-selected' : ''}`}>
                    <button
                      className={`department-header ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleDepartment(dept.id)}
                      style={{ '--dept-color': dept.color }}
                    >
                      <DeptIcon size={16} className="dept-icon" />
                      <span className="dept-name">{dept.name}</span>
                      <span className="dept-count">{deptAssistants.length}</span>
                      {deptUnread > 0 && <span className="dept-badge">{deptUnread}</span>}
                      <ChevronRight size={14} className={`chevron ${isExpanded ? 'rotated' : ''}`} />
                    </button>

                    {isExpanded && (
                      <ul className="assistants-list">
                        {deptAssistants.map(assistant => {
                          const status = getAssistantStatus(assistant);
                          const unread = unreadCounts[assistant.id] || 0;
                          const isSelected = currentAssistant?.id === assistant.id;
                          const isFavorite = favorites.includes(assistant.id);
                          const IconComponent = getAssistantIcon(assistant.id);
                          
                          return (
                            <li key={assistant.id}>
                              <div
                                className={`assistant-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleAssistantClick(assistant)}
                                role="button"
                                tabIndex={0}
                                style={{ '--assistant-color': assistant.colorScheme }}
                              >
                                <div className={`status-dot ${status}`} />
                                <div className="assistant-avatar" style={{ backgroundColor: assistant.colorScheme }}>
                                  <IconComponent size={14} />
                                </div>
                                <div className="assistant-info">
                                  <span className="assistant-name">{assistant.name}</span>
                                  <span className="assistant-role">{assistant.title}</span>
                                </div>
                                <div className="assistant-actions">
                                  <button 
                                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                                    onClick={(e) => handleToggleFavorite(e, assistant.id)}
                                  >
                                    <Star size={12} fill={isFavorite ? 'currentColor' : 'none'} />
                                  </button>
                                  {unread > 0 && <span className="unread-badge">{unread}</span>}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {currentAssistant && currentFeatures.length > 0 && (
            <div className="selector-section features-section">
              <div className="section-header" style={{ '--section-color': currentAssistant.colorScheme }}>
                <div className="current-assistant-badge" style={{ backgroundColor: currentAssistant.colorScheme }}>
                  {React.createElement(getAssistantIcon(currentAssistant.id), { size: 14 })}
                </div>
                <span>{currentAssistant.name}'s Features</span>
              </div>
              
              <div className="section-content scrollable">
                <ul className="features-list">
                  {currentFeatures.map(feature => {
                    const FeatureIcon = getFeatureIcon(feature.id);
                    const isActive = selectedFeature === feature.id;
                    
                    return (
                      <li key={feature.id}>
                        <button
                          className={`feature-item ${isActive ? 'active' : ''}`}
                          onClick={() => handleFeatureClick(feature.id)}
                          style={{ '--feature-color': currentAssistant.colorScheme }}
                        >
                          <FeatureIcon size={16} />
                          <span>{feature.label}</span>
                          {feature.default && <span className="default-badge">Default</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button className="footer-btn" title="Settings">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </aside>
      
      {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />}
    </>
  );
};

export default CommandSidebar;
