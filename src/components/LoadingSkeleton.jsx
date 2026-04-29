import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({
  variant = 'card',
  count = 1,
  height = 200,
  width = '100%',
  className = ''
}) => {
  const renderCard = () => (
    <div className="skeleton-card" style={{ height: `${height}px`, width }}>
      <div className="skeleton-header"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  );

  const renderList = () => (
    <div className="skeleton-list" style={{ width }}>
      <div className="skeleton-avatar"></div>
      <div className="skeleton-text">
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="skeleton-table" style={{ width }}>
      <div className="skeleton-row">
        <div className="skeleton-cell"></div>
        <div className="skeleton-cell"></div>
        <div className="skeleton-cell"></div>
      </div>
      <div className="skeleton-row">
        <div className="skeleton-cell"></div>
        <div className="skeleton-cell"></div>
        <div className="skeleton-cell"></div>
      </div>
      <div className="skeleton-row">
        <div className="skeleton-cell"></div>
        <div className="skeleton-cell"></div>
        <div className="skeleton-cell"></div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return renderCard();
      case 'list':
        return renderList();
      case 'table':
        return renderTable();
      default:
        return renderCard();
    }
  };

  return (
    <div className={`loading-skeleton ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
