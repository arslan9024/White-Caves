import React from 'react';
import './LoadingStates.css';

export default function SkeletonLoader({
  type = 'text',
  count = 1,
  width,
  height,
  className = '',
  animated = true,
}) {
  const renderSkeleton = (index) => {
    const style = {
      width: width || undefined,
      height: height || undefined,
    };

    switch (type) {
      case 'avatar':
        return (
          <div 
            key={index}
            className={`skeleton skeleton-avatar ${animated ? 'animated' : ''} ${className}`}
            style={style}
          />
        );
      
      case 'card':
        return (
          <div key={index} className={`skeleton-card ${animated ? 'animated' : ''} ${className}`}>
            <div className="skeleton skeleton-image" />
            <div className="skeleton-card-content">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text short" />
            </div>
          </div>
        );
      
      case 'stat':
        return (
          <div key={index} className={`skeleton-stat ${animated ? 'animated' : ''} ${className}`}>
            <div className="skeleton skeleton-stat-icon" />
            <div className="skeleton-stat-content">
              <div className="skeleton skeleton-stat-value" />
              <div className="skeleton skeleton-stat-label" />
            </div>
          </div>
        );
      
      case 'table-row':
        return (
          <div key={index} className={`skeleton-table-row ${animated ? 'animated' : ''} ${className}`}>
            <div className="skeleton skeleton-cell" style={{ width: '15%' }} />
            <div className="skeleton skeleton-cell" style={{ width: '25%' }} />
            <div className="skeleton skeleton-cell" style={{ width: '20%' }} />
            <div className="skeleton skeleton-cell" style={{ width: '15%' }} />
            <div className="skeleton skeleton-cell" style={{ width: '10%' }} />
          </div>
        );
      
      case 'list-item':
        return (
          <div key={index} className={`skeleton-list-item ${animated ? 'animated' : ''} ${className}`}>
            <div className="skeleton skeleton-avatar small" />
            <div className="skeleton-list-content">
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text short" />
            </div>
          </div>
        );
      
      case 'text':
      default:
        return (
          <div 
            key={index}
            className={`skeleton skeleton-text ${animated ? 'animated' : ''} ${className}`}
            style={style}
          />
        );
    }
  };

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }, (_, i) => renderSkeleton(i))}
    </div>
  );
}

export function ContentPlaceholder({ 
  rows = 3, 
  showAvatar = false, 
  showImage = false,
  className = '' 
}) {
  return (
    <div className={`content-placeholder ${className}`}>
      {showImage && (
        <div className="skeleton skeleton-image animated" />
      )}
      <div className="placeholder-content">
        {showAvatar && (
          <div className="skeleton skeleton-avatar animated" />
        )}
        <div className="placeholder-text">
          {Array.from({ length: rows }, (_, i) => (
            <div 
              key={i}
              className={`skeleton skeleton-text animated ${i === rows - 1 ? 'short' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
