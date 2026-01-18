import React from 'react';
import './AreaSummaryCard.css';

const AreaSummaryCard = ({
  area,
  total,
  available,
  rented,
  sold,
  availabilityRate,
  isExpanded,
  onToggleExpand,
  isLoading,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#10b981';
      case 'rented':
        return '#f59e0b';
      case 'sold':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className={rea-summary-card \}>
      <div className='area-header' onClick={onToggleExpand}>
        <div className='area-name'>
          <h3>{area}</h3>
          <span className='area-total'>{total} properties</span>
        </div>

        <div className='area-stats'>
          <div className='stat-item'>
            <span className='stat-label'>Available</span>
            <span className='stat-value available'>{available}</span>
          </div>
          <div className='stat-item'>
            <span className='stat-label'>Rented</span>
            <span className='stat-value rented'>{rented}</span>
          </div>
          <div className='stat-item'>
            <span className='stat-label'>Sold</span>
            <span className='stat-value sold'>{sold}</span>
          </div>
        </div>

        <div className='availability-indicator'>
          <div className='availability-percentage'>{availabilityRate.toFixed(0)}%</div>
          <span className='expand-icon'>{isExpanded ? '' : ''}</span>
        </div>
      </div>

      {isLoading && (
        <div className='area-loading'>
          <div className='spinner' />
          <span>Loading properties...</span>
        </div>
      )}

      {isExpanded && !isLoading && (
        <div className='area-content'>
          {/* Child properties will be rendered here by parent */}
        </div>
      )}
    </div>
  );
};

export default AreaSummaryCard;
