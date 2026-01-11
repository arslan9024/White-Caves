import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  RefreshCw, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Zap, 
  Bot,
  Send,
  FileText,
  BarChart2,
  Settings
} from 'lucide-react';
import './AIQuickActions.css';

const ICON_MAP = {
  plus: Plus,
  refresh: RefreshCw,
  download: Download,
  upload: Upload,
  search: Search,
  filter: Filter,
  zap: Zap,
  bot: Bot,
  send: Send,
  file: FileText,
  chart: BarChart2,
  settings: Settings
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export default function AIQuickActions({ 
  actions = [], 
  assistantName,
  onAction,
  layout = 'horizontal' 
}) {
  return (
    <div className={`ai-quick-actions ${layout}`}>
      {assistantName && (
        <div className="actions-header">
          <Bot size={16} />
          <span>{assistantName}'s Actions</span>
        </div>
      )}
      
      <div className="actions-list">
        {actions.map((action, index) => {
          const IconComponent = ICON_MAP[action.icon] || Zap;
          
          return (
            <motion.button
              key={action.id || index}
              className={`quick-action-btn ${action.variant || 'default'} ${action.loading ? 'loading' : ''}`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => onAction?.(action)}
              disabled={action.disabled || action.loading}
              title={action.tooltip || action.label}
            >
              {action.loading ? (
                <RefreshCw size={16} className="spin" />
              ) : (
                <IconComponent size={16} />
              )}
              <span className="action-label">{action.label}</span>
              {action.badge && (
                <span className="action-badge">{action.badge}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function QuickActionButton({ 
  icon = 'zap', 
  label, 
  onClick, 
  variant = 'default',
  loading = false,
  disabled = false,
  badge
}) {
  const IconComponent = ICON_MAP[icon] || Zap;
  
  return (
    <motion.button
      className={`quick-action-btn ${variant} ${loading ? 'loading' : ''}`}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <RefreshCw size={16} className="spin" />
      ) : (
        <IconComponent size={16} />
      )}
      {label && <span className="action-label">{label}</span>}
      {badge && <span className="action-badge">{badge}</span>}
    </motion.button>
  );
}

export function AIActionPanel({ 
  title,
  assistant,
  actions = [],
  suggestions = [],
  onAction,
  onSuggestionClick
}) {
  return (
    <div className="ai-action-panel">
      <div className="panel-header">
        <div className="assistant-info">
          <div 
            className="assistant-avatar"
            style={{ background: assistant?.color || '#D4AF37' }}
          >
            {assistant?.name?.charAt(0) || 'A'}
          </div>
          <div className="assistant-meta">
            <span className="assistant-name">{assistant?.name || 'AI Assistant'}</span>
            <span className="assistant-role">{assistant?.role}</span>
          </div>
        </div>
        <span className="status-indicator online"></span>
      </div>
      
      {actions.length > 0 && (
        <div className="panel-section">
          <h4 className="section-label">Quick Actions</h4>
          <div className="actions-grid">
            {actions.map((action, index) => {
              const IconComponent = ICON_MAP[action.icon] || Zap;
              return (
                <motion.button
                  key={action.id || index}
                  className="panel-action-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAction?.(action)}
                >
                  <IconComponent size={18} />
                  <span>{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
      
      {suggestions.length > 0 && (
        <div className="panel-section">
          <h4 className="section-label">AI Suggestions</h4>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                className="suggestion-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSuggestionClick?.(suggestion)}
              >
                <Zap size={14} className="suggestion-icon" />
                <span>{suggestion.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
