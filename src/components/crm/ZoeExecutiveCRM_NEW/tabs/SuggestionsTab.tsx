import React from 'react';
import { Search, Plus, Filter, AlertCircle, CheckCircle, Clock, TrendingUp, Lightbulb, AlertTriangle, DollarSign } from 'lucide-react';

interface Suggestion {
  id: string | number;
  title?: string;
  description?: string;
  type: string;
  priority?: string;
}

interface SuggestionsTabProps {
  suggestions: Suggestion[];
  unreviewedCount: number;
  criticalCount: number;
  onStatusChange: (id: string | number, status: string) => void;
}

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number | string }>> = {
  process_improvement: TrendingUp,
  new_opportunity: Lightbulb,
  risk_alert: AlertTriangle,
  cost_saving: DollarSign
};

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ suggestions, unreviewedCount, criticalCount, onStatusChange }) => {
  return (
    <div className="suggestions-view">
      <div className="view-header">
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Search suggestions..." aria-label="Search suggestions" />
        </div>
        <div className="filter-buttons">
          <button className="filter-btn">
            <AlertCircle size={14} /> Critical ({criticalCount})
          </button>
          <button className="filter-btn">
            <Clock size={14} /> Unreviewed ({unreviewedCount})
          </button>
        </div>
      </div>
      <div className="suggestions-list">
        {suggestions && suggestions.length > 0 ? (
          suggestions.map((suggestion: Suggestion) => {
            const IconComponent = TYPE_ICONS[suggestion.type] || TrendingUp;
            return (
              <div key={suggestion.id} className={`suggestion-card ${suggestion.priority}`}>
                <div className="suggestion-header">
                  <div className="suggestion-icon">
                    <IconComponent size={20} />
                  </div>
                  <div className="suggestion-info">
                    <h4>{suggestion.title || 'Untitled Suggestion'}</h4>
                    <p>{suggestion.description || 'No description provided'}</p>
                  </div>
                </div>
                <div className="suggestion-footer">
                  <span className="priority-badge">{suggestion.priority || 'medium'}</span>
                  <div className="suggestion-actions">
                    <button onClick={() => onStatusChange(suggestion.id, 'reviewed')}>
                      <CheckCircle size={14} /> Review
                    </button>
                    <button onClick={() => onStatusChange(suggestion.id, 'archived')}>
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <p>No suggestions available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionsTab;
