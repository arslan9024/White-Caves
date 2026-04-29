import React from 'react';
import { 
  Inbox, Search, FileX, Users, Database, AlertCircle,
  Plus, RefreshCw, ArrowRight
} from 'lucide-react';
import './EmptyState.css';

const EMPTY_STATE_ICONS = {
  inbox: Inbox,
  search: Search,
  file: FileX,
  users: Users,
  data: Database,
  error: AlertCircle
};

const EmptyStatePrompt = ({
  type = 'data',
  icon: CustomIcon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  size = 'medium',
  illustration
}) => {
  const Icon = CustomIcon || EMPTY_STATE_ICONS[type] || Inbox;

  const defaultTitles = {
    inbox: 'No messages',
    search: 'No results found',
    file: 'No files',
    users: 'No users found',
    data: 'No data available',
    error: 'Something went wrong'
  };

  const defaultDescriptions = {
    inbox: 'Your inbox is empty. New messages will appear here.',
    search: 'Try adjusting your search or filter to find what you\'re looking for.',
    file: 'No files have been uploaded yet.',
    users: 'No users match your current filters.',
    data: 'There\'s no data to display at the moment.',
    error: 'We couldn\'t load the data. Please try again.'
  };

  return (
    <div className={`empty-state ${size}`}>
      {illustration ? (
        <div className="empty-illustration">{illustration}</div>
      ) : (
        <div className="empty-icon-wrapper">
          <Icon size={size === 'small' ? 32 : size === 'large' ? 64 : 48} />
        </div>
      )}
      
      <div className="empty-content">
        <h3 className="empty-title">{title || defaultTitles[type]}</h3>
        <p className="empty-description">
          {description || defaultDescriptions[type]}
        </p>
      </div>

      {(actionLabel || secondaryLabel) && (
        <div className="empty-actions">
          {actionLabel && (
            <button className="empty-action primary" onClick={onAction}>
              <Plus size={16} />
              <span>{actionLabel}</span>
            </button>
          )}
          {secondaryLabel && (
            <button className="empty-action secondary" onClick={onSecondary}>
              <span>{secondaryLabel}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const ErrorStateWithRetry = ({
  title = 'Failed to load data',
  description = 'Something went wrong while fetching the data. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  error,
  showDetails = false
}) => {
  const [showError, setShowError] = React.useState(false);

  return (
    <div className="error-state">
      <div className="error-icon-wrapper">
        <AlertCircle size={48} />
      </div>
      
      <div className="error-content">
        <h3 className="error-title">{title}</h3>
        <p className="error-description">{description}</p>
        
        {showDetails && error && (
          <button 
            className="error-details-toggle"
            onClick={() => setShowError(!showError)}
          >
            {showError ? 'Hide details' : 'Show details'}
          </button>
        )}
        
        {showError && error && (
          <pre className="error-details">
            {error.message || JSON.stringify(error, null, 2)}
          </pre>
        )}
      </div>

      {onRetry && (
        <button className="error-retry" onClick={onRetry}>
          <RefreshCw size={16} />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
};

export const NoResultsState = ({
  query,
  onClear,
  suggestions = []
}) => (
  <div className="no-results-state">
    <div className="no-results-icon">
      <Search size={40} />
    </div>
    <h3>No results for "{query}"</h3>
    <p>We couldn't find anything matching your search.</p>
    
    {suggestions.length > 0 && (
      <div className="search-suggestions">
        <span>Try searching for:</span>
        <div className="suggestion-chips">
          {suggestions.map((s, i) => (
            <button key={i} className="suggestion-chip">{s}</button>
          ))}
        </div>
      </div>
    )}
    
    {onClear && (
      <button className="clear-search" onClick={onClear}>
        Clear search
      </button>
    )}
  </div>
);

export default EmptyStatePrompt;
