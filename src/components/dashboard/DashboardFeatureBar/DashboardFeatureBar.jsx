import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Bot, LayoutDashboard, Users, TrendingUp, Settings, 
  FileText, MessageSquare, Calendar, Search, Command, Activity
} from 'lucide-react';
import { setActiveFeature } from '../../../store/appSlice';
import './DashboardFeatureBar.css';

const FEATURE_ICONS = {
  dashboard: LayoutDashboard,
  leads: Users,
  analytics: TrendingUp,
  settings: Settings,
  reports: FileText,
  messages: MessageSquare,
  calendar: Calendar,
  activity: Activity
};

const DEFAULT_FEATURES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'leads', label: 'Leads', icon: 'leads' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'activity', label: 'Activity', icon: 'activity' }
];

const DashboardFeatureBar = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const activeAssistant = useSelector(state => state.app?.activeAssistant);
  const activeFeature = useSelector(state => state.app?.activeFeature || 'dashboard');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getFeatures = () => {
    if (!activeAssistant) return DEFAULT_FEATURES;
    return activeAssistant.features || DEFAULT_FEATURES;
  };

  const features = getFeatures();

  const handleFeatureClick = (featureId) => {
    dispatch(setActiveFeature(featureId));
  };

  const getIcon = (iconName) => {
    return FEATURE_ICONS[iconName] || LayoutDashboard;
  };

  return (
    <div className="dashboard-feature-bar">
      <div className="feature-bar-left">
        {activeAssistant && (
          <div 
            className="active-assistant-badge"
            style={{ 
              background: `${activeAssistant.color}15`,
              borderColor: `${activeAssistant.color}40`
            }}
          >
            <Bot size={16} style={{ color: activeAssistant.color }} />
            <span style={{ color: activeAssistant.color }}>{activeAssistant.name}</span>
            <span className="assistant-status online" />
          </div>
        )}

        <div className="feature-tabs">
          {features.map(feature => {
            const Icon = getIcon(feature.icon);
            const isActive = activeFeature === feature.id;
            return (
              <button
                key={feature.id}
                className={`feature-tab ${isActive ? 'active' : ''}`}
                onClick={() => handleFeatureClick(feature.id)}
                style={isActive && activeAssistant ? { 
                  '--tab-active-color': activeAssistant.color 
                } : {}}
              >
                <Icon size={16} />
                <span>{feature.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="feature-bar-center">
        <div className={`feature-search ${searchFocused ? 'focused' : ''}`}>
          <Search size={16} className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={`Search ${activeAssistant?.name || 'dashboard'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <div className="search-shortcut">
            <kbd><Command size={10} /></kbd>
            <kbd>K</kbd>
          </div>
        </div>
      </div>

      <div className="feature-bar-right">
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-value">24</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">12</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFeatureBar;
