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
  Crown, Compass, Eye, AlertTriangle, Activity
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
  suggestion_inbox: Lightbulb,
  executive_reports: FileText,
  kpi_analytics: BarChart3,
  md_briefings: Briefcase,
  inventory: Building,
  data_tools: Wrench,
  asset_fetcher: Download,
  data_import: ScanText,
  conversations: MessageSquare,
  agent_status: Users,
  templates: FileText,
  broadcasts: Radio,
  bot_builder: Bot,
  flow_designer: GitBranch,
  sessions: MessageCircle,
  bot_analytics: BarChart3,
  pipeline: Filter,
  lead_list: Users,
  scoring: Target,
  nurturing_workflows: Workflow,
  deals: Handshake,
  sales_pipeline: TrendingUp,
  forecast: LineChart,
  commission_calculator: Calculator,
  employees: Users,
  recruitment: UserPlus,
  attendance: Calendar,
  performance_reviews: Award,
  leases: FileText,
  tenants: Users,
  maintenance: Wrench,
  rental_analytics: BarChart3,
  invoices: Receipt,
  payments: CreditCard,
  financial_reports: FileText,
  escrow: Lock,
  campaigns: Zap,
  social_media: Share2,
  automation: Zap,
  market_intelligence: Brain,
  kyc: UserCheck,
  aml: Shield,
  contract_review: FileText,
  audit_trail: History,
  events: Activity,
  timeline_analytics: LineChart,
  compliance_reports: ClipboardCheck,
  systems_health: Gauge,
  deployments: Rocket,
  documentation: Book,
  ai_governance: Shield,
  components: Layers,
  design_system: Palette,
  accessibility: Eye,
  themes: Sun,
  apis: Code,
  database: Database,
  performance: Activity,
  security: Lock,
  risk_analysis: AlertTriangle,
  contracts: FileText,
  regulations: Scale,
  best_practices: Book,
  monitoring: Eye,
  predictive_maintenance: Wrench,
  inspections: ClipboardCheck,
  emergency_response: AlertCircle,
  prospects: Users,
  outreach_campaigns: Send,
  pattern_detection: Sparkles,
  lead_enrichment: Database,
  market_trends: TrendingUp,
  pricing_predictions: LineChart,
  competitor_tracking: Users,
  economic_indicators: BarChart3,
  projects: Building,
  feasibility_analysis: Calculator,
  developer_tracking: Users,
  zoning: Map,
  milestones: Flag,
  snagging: ClipboardCheck,
  handover: Key,
  defects: AlertCircle,
  facilities: Building,
  iot: Cpu,
  events_community: Calendar,
  energy_optimization: Zap,
  vip_clients: Crown,
  concierge: Sparkles,
  lifestyle: Compass,
  partners: Handshake,
  portfolio: PieChart,
  yields: TrendingUp,
  tax_planning: Calculator,
  investment_advice: Lightbulb
};

const CommandSidebar = ({ collapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const allAssistants = useSelector(selectAllAssistantsArray);
  const assistantsByDepartment = useSelector(selectAssistantsByDepartment);
  const currentAssistant = useSelector(selectCurrentAssistant);
  
  const [assistantDropdownOpen, setAssistantDropdownOpen] = useState(false);
  const [featureDropdownOpen, setFeatureDropdownOpen] = useState(false);
  
  const assistantDropdownRef = useRef(null);
  const featureDropdownRef = useRef(null);
  
  const selectedFeature = useSelector(state => state.dashboardView?.activeFeatureTab) || 'dashboard';
  
  const currentFeatures = useMemo(() => {
    if (!currentAssistant) return [];
    return getAssistantFeatures(currentAssistant.id);
  }, [currentAssistant]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (assistantDropdownRef.current && !assistantDropdownRef.current.contains(event.target)) {
        setAssistantDropdownOpen(false);
      }
      if (featureDropdownRef.current && !featureDropdownRef.current.contains(event.target)) {
        setFeatureDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAssistantSelect = useCallback((assistant) => {
    dispatch(selectAssistant(assistant.id));
    dispatch(setActiveAssistant(assistant.id));
    dispatch(setActiveWorkspace('ai-command'));
    dispatch(setActiveFeatureTab('dashboard'));
    setAssistantDropdownOpen(false);
  }, [dispatch]);
  
  const handleFeatureSelect = useCallback((featureId) => {
    dispatch(setActiveFeatureTab(featureId));
    setFeatureDropdownOpen(false);
  }, [dispatch]);

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

  const formatFeatureName = (featureId) => {
    return featureId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
              <div className="dropdown-menu assistant-menu">
                {Object.entries(assistantsByDepartment).map(([deptId, assistants]) => {
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
                      {assistants.map(assistant => {
                        const IconComponent = getAssistantIcon(assistant.id);
                        const isSelected = currentAssistant?.id === assistant.id;
                        
                        return (
                          <button
                            key={assistant.id}
                            className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleAssistantSelect(assistant)}
                          >
                            <div className="option-icon" style={{ '--assistant-color': assistant.colorScheme }}>
                              <IconComponent size={16} />
                            </div>
                            <div className="option-info">
                              <span className="option-name">{assistant.name}</span>
                              <span className="option-title">{assistant.title}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
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
                }
              }}
              disabled={!currentAssistant}
            >
              {selectedFeatureData ? (
                <div className="selected-value">
                  <div className="selected-icon feature-icon">
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
              <div className="dropdown-menu feature-menu">
                {currentFeatures.map(feature => {
                  const IconComponent = getFeatureIcon(feature.id);
                  const isSelected = selectedFeature === feature.id;
                  
                  return (
                    <button
                      key={feature.id}
                      className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleFeatureSelect(feature.id)}
                    >
                      <div className="option-icon feature-icon">
                        <IconComponent size={16} />
                      </div>
                      <span className="option-name">{feature.label}</span>
                    </button>
                  );
                })}
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
              <span className="summary-value">{formatFeatureName(selectedFeature)}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default CommandSidebar;
