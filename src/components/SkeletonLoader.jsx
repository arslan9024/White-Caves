import React from 'react';
import './SkeletonLoader.css';

export function SkeletonText({ width = '100%', height = '1rem', className = '' }) {
  return (
    <div 
      className={`skeleton-text ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCircle({ size = '40px', className = '' }) {
  return (
    <div 
      className={`skeleton-circle ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonImage({ height = '200px', className = '' }) {
  return (
    <div 
      className={`skeleton-image ${className}`}
      style={{ height }}
    />
  );
}

export function SkeletonPropertyCard() {
  return (
    <div className="skeleton-property-card">
      <SkeletonImage height="200px" />
      <div className="skeleton-card-content">
        <SkeletonText width="70%" height="1.25rem" />
        <SkeletonText width="50%" height="0.875rem" />
        <div className="skeleton-stats">
          <SkeletonText width="60px" height="0.75rem" />
          <SkeletonText width="60px" height="0.75rem" />
          <SkeletonText width="60px" height="0.75rem" />
        </div>
        <div className="skeleton-footer">
          <SkeletonText width="40%" height="1.5rem" />
          <SkeletonText width="30%" height="2rem" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonPropertyGrid({ count = 6 }) {
  return (
    <div className="skeleton-property-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPropertyCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTestimonial() {
  return (
    <div className="skeleton-testimonial">
      <div className="skeleton-testimonial-header">
        <SkeletonCircle size="60px" />
        <div className="skeleton-testimonial-info">
          <SkeletonText width="120px" height="1rem" />
          <SkeletonText width="80px" height="0.75rem" />
        </div>
      </div>
      <SkeletonText width="100%" height="0.875rem" />
      <SkeletonText width="100%" height="0.875rem" />
      <SkeletonText width="70%" height="0.875rem" />
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="skeleton-stats-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton-stat-item">
          <SkeletonText width="80px" height="2.5rem" />
          <SkeletonText width="100px" height="0.875rem" />
        </div>
      ))}
    </div>
  );
}

export default {
  Text: SkeletonText,
  Circle: SkeletonCircle,
  Image: SkeletonImage,
  PropertyCard: SkeletonPropertyCard,
  PropertyGrid: SkeletonPropertyGrid,
  Testimonial: SkeletonTestimonial,
  Stats: SkeletonStats,
};
