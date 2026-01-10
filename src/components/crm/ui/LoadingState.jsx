import React from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import './LoadingState.css';

export const DataLoadingSkeleton = ({
  type = 'card',
  count = 1,
  columns = 4,
  showHeader = true
}) => {
  const renderCardSkeleton = () => (
    <div className="skeleton-card">
      <div className="skeleton-icon-box" />
      <div className="skeleton-text-group">
        <div className="skeleton-line short" />
        <div className="skeleton-line medium" />
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="skeleton-table">
      {showHeader && (
        <div className="skeleton-table-header">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="skeleton-cell header" />
          ))}
        </div>
      )}
      {Array.from({ length: count }).map((_, rowIdx) => (
        <div key={rowIdx} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={`skeleton-cell ${colIdx === 0 ? 'wide' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );

  const renderListSkeleton = () => (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-list-item">
          <div className="skeleton-avatar" />
          <div className="skeleton-text-group">
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" />
          </div>
          <div className="skeleton-badge" />
        </div>
      ))}
    </div>
  );

  const renderChartSkeleton = () => (
    <div className="skeleton-chart">
      <div className="skeleton-chart-bars">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-bar"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
      <div className="skeleton-chart-legend">
        <div className="skeleton-line short" />
        <div className="skeleton-line short" />
      </div>
    </div>
  );

  switch (type) {
    case 'table':
      return renderTableSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'chart':
      return renderChartSkeleton();
    case 'card':
    default:
      return (
        <div className="skeleton-grid" style={{ '--columns': columns }}>
          {Array.from({ length: count }).map((_, i) => (
            <React.Fragment key={i}>{renderCardSkeleton()}</React.Fragment>
          ))}
        </div>
      );
  }
};

export const LoadingSpinner = ({
  size = 'medium',
  text,
  fullPage = false,
  variant = 'spin'
}) => {
  const sizeMap = { small: 16, medium: 24, large: 40 };
  const iconSize = sizeMap[size] || 24;

  const content = (
    <div className={`loading-spinner ${size}`}>
      {variant === 'spin' ? (
        <Loader2 size={iconSize} className="spinner-icon" />
      ) : (
        <RefreshCw size={iconSize} className="spinner-icon" />
      )}
      {text && <span className="loading-text">{text}</span>}
    </div>
  );

  if (fullPage) {
    return <div className="loading-fullpage">{content}</div>;
  }

  return content;
};

export const LoadingOverlay = ({ visible, text = 'Loading...' }) => {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
};

export default DataLoadingSkeleton;
