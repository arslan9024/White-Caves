import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown, Bot, LayoutDashboard, FileText, Users, Target, Briefcase,
  MessageSquare, TrendingUp, DollarSign, Shield, Database, BarChart3,
  Workflow, Zap, Home, Server, Palette, Scale, Building, Landmark,
  Wallet, Users2, Map, Lightbulb, Wrench, Download, ScanText, Radio,
  GitBranch, MessageCircle, Filter, Handshake, LineChart, Calculator,
  UserPlus, Calendar, Award, Receipt, CreditCard, Lock, PieChart,
  Share2, Brain, UserCheck, History, Rocket, Book, Layers, Sun, Code,
  Gauge, AlertCircle, ClipboardCheck, Send, Sparkles, Flag, Key, Cpu,
  Crown, Compass, Eye, AlertTriangle, Activity, Search, X, Check
} from 'lucide-react';
import { setActiveWorkspace, setActiveAssistant, setActiveFeatureTab } from '../../store/slices/dashboardViewSlice';
import {
  selectAllAssistantsArray,
  selectAssistantsByDepartment,
  selectCurrentAssistant,
  selectAssistant
} from '../../store/slices/aiAssistantDashboardSlice';
import { getAssistantFeatures } from '../../config/assistantFeatures';
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
  maven: Wallet,
  penny: Calculator,
  quinn: CreditCard,
  marcus: Zap,
  stella: Palette,
  vera: UserCheck,
  sage: TrendingUp,
  ivy: FileText,
  max: FileText
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
  import: ScanText,
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
  timeline: Activity,
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
  events: Activity,
  systems: Gauge,
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

const CommandSidebar = ({ collapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const allAssistants = useSelector(selectAllAssistantsArray);
  const assistantsByDepartment = useSelector(selectAssistantsByDepartment);
  const currentAssistant = useSelector(selectCurrentAssistant);
  
  const [assistantDropdownOpen, setAssistantDropdownOpen] = useState(false);
  const [featureDropdownOpen, setFeatureDropdownOpen] = useState(false);
  const [assistantSearch, setAssistantSearch] = useState('');
  const [featureSearch, setFeatureSearch] = useState('');
  const [highlightedAssistantIndex, setHighlightedAssistantIndex] = useState(-1);
  const [highlightedFeatureIndex, setHighlightedFeatureIndex] = useState(-1);
  
  const assistantDropdownRef = useRef(null);
  const featureDropdownRef = useRef(null);
  const assistantSearchRef = useRef(null);
  const featureSearchRef = useRef(null);
  
  const selectedFeature = useSelector(state => state.dashboardView?.activeFeatureTab) || 'dashboard';
  
  const currentFeatures = useMemo(() => {
    if (!currentAssistant) return [];
    return getAssistantFeatures(currentAssistant.id);
  }, [currentAssistant]);

  const filteredAssistants = useMemo(() => {
    if (!assistantSearch.trim()) return allAssistants;
    const query = assistantSearch.toLowerCase();
    return allAssistants.filter(a => 
      a.name?.toLowerCase().includes(query) ||
      a.title?.toLowerCase().includes(query) ||
      a.id?.toLowerCase().includes(query)
    );
  }, [allAssistants, assistantSearch]);

  const filteredFeatures = useMemo(() => {
    if (!featureSearch.trim()) return currentFeatures;
    const query = featureSearch.toLowerCase();
    return currentFeatures.filter(f => 
      f.label?.toLowerCase().includes(query) ||
      f.id?.toLowerCase().includes(query)
    );
  }, [currentFeatures, featureSearch]);

  const groupedFilteredAssistants = useMemo(() => {
    const groups = {};
    filteredAssistants.forEach(assistant => {
      for (const [deptId, assistants] of Object.entries(assistantsByDepartment)) {
        if (assistants.some(a => a.id === assistant.id)) {
          if (!groups[deptId]) groups[deptId] = [];
          groups[deptId].push(assistant);
          break;
        }
      }
    });
    return groups;
  }, [filteredAssistants, assistantsByDepartment]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (assistantDropdownRef.current && !assistantDropdownRef.current.contains(event.target)) {
        setAssistantDropdownOpen(false);
        setAssistantSearch('');
        setHighlightedAssistantIndex(-1);
      }
      if (featureDropdownRef.current && !featureDropdownRef.current.contains(event.target)) {
        setFeatureDropdownOpen(false);
        setFeatureSearch('');
        setHighlightedFeatureIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (assistantDropdownOpen && assistantSearchRef.current) {
      assistantSearchRef.current.focus();
    }
  }, [assistantDropdownOpen]);

  useEffect(() => {
    if (featureDropdownOpen && featureSearchRef.current) {
      featureSearchRef.current.focus();
    }
  }, [featureDropdownOpen]);

  const handleAssistantSelect = useCallback((assistant) => {
    dispatch(selectAssistant(assistant.id));
    dispatch(setActiveAssistant(assistant.id));
    dispatch(setActiveWorkspace('ai-command'));
    dispatch(setActiveFeatureTab('dashboard'));
    setAssistantDropdownOpen(false);
    setAssistantSearch('');
    setHighlightedAssistantIndex(-1);
  }, [dispatch]);
  
  const handleFeatureSelect = useCallback((featureId) => {
    dispatch(setActiveFeatureTab(featureId));
    setFeatureDropdownOpen(false);
    setFeatureSearch('');
    setHighlightedFeatureIndex(-1);
  }, [dispatch]);

  const handleAssistantKeyDown = useCallback((e) => {
    if (!assistantDropdownOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedAssistantIndex(prev => 
          prev < filteredAssistants.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedAssistantIndex(prev => 
          prev > 0 ? prev - 1 : filteredAssistants.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedAssistantIndex >= 0 && filteredAssistants[highlightedAssistantIndex]) {
          handleAssistantSelect(filteredAssistants[highlightedAssistantIndex]);
        }
        break;
      case 'Escape':
        setAssistantDropdownOpen(false);
        setAssistantSearch('');
        break;
      default:
        break;
    }
  }, [assistantDropdownOpen, filteredAssistants, highlightedAssistantIndex, handleAssistantSelect]);

  const handleFeatureKeyDown = useCallback((e) => {
    if (!featureDropdownOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedFeatureIndex(prev => 
          prev < filteredFeatures.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedFeatureIndex(prev => 
          prev > 0 ? prev - 1 : filteredFeatures.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedFeatureIndex >= 0 && filteredFeatures[highlightedFeatureIndex]) {
          handleFeatureSelect(filteredFeatures[highlightedFeatureIndex].id);
        }
        break;
      case 'Escape':
        setFeatureDropdownOpen(false);
        setFeatureSearch('');
        break;
      default:
        break;
    }
  }, [featureDropdownOpen, filteredFeatures, highlightedFeatureIndex, handleFeatureSelect]);

  const getAssistantIcon = (assistantId) => {
    return ASSISTANT_ICONS[assistantId] || Bot;
  };
  
  const getFeatureIcon = (featureId) => {
    return FEATURE_ICONS[featureId] || LayoutDashboard;
  };

  const getDepartmentForAssistant = (assistantId) => {
    for (const [deptId, assistants] of Object.entries(assistantsByDepartment)) {
      if (assistants.some(a => a.id === assistantId)) {
        return DEPARTMENTS[deptId]?.name || deptId;
      }
    }
    return '';
  };

  const selectedFeatureData = currentFeatures.find(f => f.id === selectedFeature);

  if (collapsed) {
    return (
      <aside className="command-sidebar collapsed">
        <div className="sidebar-collapsed-content">
          <div className="collapsed-icon" title="AI Command Center">
            <Bot size={24} />
          </div>
          {currentAssistant && (
            <div 
              className="collapsed-assistant-icon" 
              title={currentAssistant.name}
              style={{ '--assistant-color': currentAssistant.colorScheme }}
            >
              {React.createElement(getAssistantIcon(currentAssistant.id), { size: 20 })}
            </div>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside className="command-sidebar">
      <div className="sidebar-content">
        <div className="sidebar-brand">
          <Bot size={24} />
          <span>AI Command</span>
        </div>

        <div className="dropdown-selectors">
          <div className="selector-group" ref={assistantDropdownRef}>
            <label className="selector-label">AI Assistant</label>
            <button 
              className={`selector-dropdown ${assistantDropdownOpen ? 'open' : ''}`}
              onClick={() => {
                setAssistantDropdownOpen(!assistantDropdownOpen);
                setFeatureDropdownOpen(false);
                setHighlightedAssistantIndex(-1);
              }}
            >
              {currentAssistant ? (
                <div className="selected-value">
                  <div className="selected-icon" style={{ '--assistant-color': currentAssistant.colorScheme }}>
                    {React.createElement(getAssistantIcon(currentAssistant.id), { size: 18 })}
                  </div>
                  <div className="selected-info">
                    <span className="selected-name">{currentAssistant.name}</span>
                    <span className="selected-dept">{getDepartmentForAssistant(currentAssistant.id)}</span>
                  </div>
                </div>
              ) : (
                <span className="placeholder">Select an assistant...</span>
              )}
              <ChevronDown size={18} className={`dropdown-chevron ${assistantDropdownOpen ? 'rotated' : ''}`} />
            </button>

            {assistantDropdownOpen && (
              <div className="dropdown-menu assistant-menu" onKeyDown={handleAssistantKeyDown}>
                <div className="dropdown-search">
                  <Search size={16} />
                  <input
                    ref={assistantSearchRef}
                    type="text"
                    placeholder="Search assistants..."
                    value={assistantSearch}
                    onChange={(e) => {
                      setAssistantSearch(e.target.value);
                      setHighlightedAssistantIndex(0);
                    }}
                  />
                  {assistantSearch && (
                    <button className="clear-search" onClick={() => setAssistantSearch('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>
                
                <div className="dropdown-options-list">
                  {filteredAssistants.length === 0 ? (
                    <div className="empty-message">No assistants found</div>
                  ) : (
                    Object.entries(groupedFilteredAssistants).map(([deptId, assistants]) => {
                      const dept = DEPARTMENTS[deptId];
                      if (!dept || assistants.length === 0) return null;
                      const DeptIcon = DEPARTMENT_ICONS[deptId] || Bot;
                      
                      return (
                        <div key={deptId} className="dropdown-group">
                          <div className="group-header" style={{ '--dept-color': dept.color }}>
                            <DeptIcon size={14} />
                            <span>{dept.name}</span>
                            <span className="group-count">{assistants.length}</span>
                          </div>
                          {assistants.map((assistant, idx) => {
                            const IconComponent = getAssistantIcon(assistant.id);
                            const isSelected = currentAssistant?.id === assistant.id;
                            const globalIndex = filteredAssistants.findIndex(a => a.id === assistant.id);
                            const isHighlighted = highlightedAssistantIndex === globalIndex;
                            
                            return (
                              <button
                                key={assistant.id}
                                className={`dropdown-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                                onClick={() => handleAssistantSelect(assistant)}
                                onMouseEnter={() => setHighlightedAssistantIndex(globalIndex)}
                              >
                                <div className="option-icon" style={{ '--assistant-color': assistant.colorScheme }}>
                                  <IconComponent size={16} />
                                </div>
                                <div className="option-info">
                                  <span className="option-name">{assistant.name}</span>
                                  <span className="option-title">{assistant.title}</span>
                                </div>
                                {isSelected && <Check size={16} className="check-icon" />}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="selector-group" ref={featureDropdownRef}>
            <label className="selector-label">Feature</label>
            <button 
              className={`selector-dropdown ${featureDropdownOpen ? 'open' : ''} ${!currentAssistant ? 'disabled' : ''}`}
              onClick={() => {
                if (currentAssistant) {
                  setFeatureDropdownOpen(!featureDropdownOpen);
                  setAssistantDropdownOpen(false);
                  setHighlightedFeatureIndex(-1);
                }
              }}
              disabled={!currentAssistant}
            >
              {selectedFeatureData ? (
                <div className="selected-value">
                  <div className="selected-icon feature-icon" style={{ '--assistant-color': currentAssistant?.colorScheme }}>
                    {React.createElement(getFeatureIcon(selectedFeatureData.id), { size: 18 })}
                  </div>
                  <span className="selected-name">{selectedFeatureData.label}</span>
                </div>
              ) : (
                <span className="placeholder">
                  {currentAssistant ? 'Select a feature...' : 'Select assistant first'}
                </span>
              )}
              <ChevronDown size={18} className={`dropdown-chevron ${featureDropdownOpen ? 'rotated' : ''}`} />
            </button>

            {featureDropdownOpen && currentFeatures.length > 0 && (
              <div className="dropdown-menu feature-menu" onKeyDown={handleFeatureKeyDown}>
                <div className="dropdown-search">
                  <Search size={16} />
                  <input
                    ref={featureSearchRef}
                    type="text"
                    placeholder="Search features..."
                    value={featureSearch}
                    onChange={(e) => {
                      setFeatureSearch(e.target.value);
                      setHighlightedFeatureIndex(0);
                    }}
                  />
                  {featureSearch && (
                    <button className="clear-search" onClick={() => setFeatureSearch('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>
                
                <div className="dropdown-options-list">
                  {filteredFeatures.length === 0 ? (
                    <div className="empty-message">No features found</div>
                  ) : (
                    filteredFeatures.map((feature, idx) => {
                      const IconComponent = getFeatureIcon(feature.id);
                      const isSelected = selectedFeature === feature.id;
                      const isHighlighted = highlightedFeatureIndex === idx;
                      
                      return (
                        <button
                          key={feature.id}
                          className={`dropdown-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                          onClick={() => handleFeatureSelect(feature.id)}
                          onMouseEnter={() => setHighlightedFeatureIndex(idx)}
                        >
                          <div className="option-icon feature-icon" style={{ '--assistant-color': currentAssistant?.colorScheme }}>
                            <IconComponent size={16} />
                          </div>
                          <span className="option-name">{feature.label}</span>
                          {isSelected && <Check size={16} className="check-icon" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {currentAssistant && (
          <div className="current-selection-summary">
            <div className="summary-item">
              <span className="summary-label">Assistant:</span>
              <span className="summary-value">{currentAssistant.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Feature:</span>
              <span className="summary-value">{selectedFeatureData?.label || 'Dashboard'}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default CommandSidebar;
