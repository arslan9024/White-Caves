import './SkeletonLoader.css';

/**
 * SkeletonLoader Component
 * Displays loading placeholders while content is being fetched
 * 
 * @param {string} type - Type of skeleton ('card', 'text', 'chart', 'table', 'grid', 'list')
 * @param {number} count - Number of skeleton items to render
 * @param {string} variant - Animation variant ('pulse' or default shimmer)
 */
export function SkeletonLoader({ type = 'card', count = 1, variant = '' }) {
  const variantClass = variant ? ` ${variant}` : '';

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`skeleton skeleton-card${variantClass}`} />
        );
      case 'text':
        return (
          <div className={`skeleton skeleton-text long${variantClass}`} />
        );
      case 'chart':
        return (
          <div className={`skeleton skeleton-chart${variantClass}`} />
        );
      case 'table':
        return (
          <div className={`skeleton-table${variantClass}`}>
            <div className="skeleton-table-header">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton" />
              ))}
            </div>
            {[...Array(5)].map((_, rowIndex) => (
              <div key={rowIndex} className="skeleton-table-row">
                {[...Array(5)].map((_, cellIndex) => (
                  <div
                    key={cellIndex}
                    className={`skeleton skeleton-table-cell${variantClass}`}
                  />
                ))}
              </div>
            ))}
          </div>
        );
      case 'grid':
        return (
          <div className={`skeleton-grid${variantClass}`}>
            {[...Array(count)].map((_, i) => (
              <div key={i} className={`skeleton skeleton-grid-item${variantClass}`} />
            ))}
          </div>
        );
      case 'list':
        return (
          <div className={`skeleton-lines${variantClass}`}>
            {[...Array(count)].map((_, i) => (
              <div
                key={i}
                className={`skeleton skeleton-line${variantClass}`}
                style={{
                  width: i === count - 1 ? '80%' : '100%'
                }}
              />
            ))}
          </div>
        );
      case 'avatar':
        return (
          <div className={`skeleton skeleton-avatar${variantClass}`} />
        );
      case 'button':
        return (
          <div className={`skeleton skeleton-button${variantClass}`} />
        );
      default:
        return (
          <div className={`skeleton${variantClass}`} style={{ height: '100px' }} />
        );
    }
  };

  if (type === 'grid' || type === 'table' || type === 'list') {
    return renderSkeleton();
  }

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
