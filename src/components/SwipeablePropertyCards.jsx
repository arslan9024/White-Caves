import React from 'react';
import { useSwipeableCards } from '../hooks/useSwipeGesture';
import OptimizedImage from './OptimizedImage';
import './SwipeablePropertyCards.css';

export default function SwipeablePropertyCards({ properties, onPropertyClick, onFavorite }) {
  const {
    currentIndex,
    currentItem: property,
    goToNext,
    goToPrev,
    canGoNext,
    canGoPrev,
    handlers,
    swiping,
    swipeOffset
  } = useSwipeableCards(properties, { threshold: 80 });

  if (!properties.length) {
    return <div className="no-properties">No properties available</div>;
  }

  const cardStyle = swiping ? {
    transform: `translateX(${swipeOffset.x}px) rotate(${swipeOffset.x * 0.02}deg)`,
    transition: 'none'
  } : {};

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `AED ${(price / 1000000).toFixed(1)}M`;
    }
    return `AED ${(price / 1000).toFixed(0)}K`;
  };

  return (
    <div className="swipeable-cards-container">
      <div className="swipe-hint">
        {canGoPrev && <span className="hint-left">Swipe right for previous</span>}
        {canGoNext && <span className="hint-right">Swipe left for next</span>}
      </div>
      
      <div className="cards-wrapper" {...handlers}>
        <div className="property-card-swipeable" style={cardStyle}>
          <div className="card-image">
            <OptimizedImage
              src={property.images?.[0] || '/placeholder-property.jpg'}
              alt={property.title}
              className="property-image"
            />
            <div className="card-badges">
              {property.featured && <span className="badge featured">Featured</span>}
              <span className="badge type">{property.type}</span>
            </div>
            <button 
              className="favorite-btn"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite?.(property);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
          
          <div className="card-content" onClick={() => onPropertyClick?.(property)}>
            <div className="price">{formatPrice(property.price)}</div>
            <h3 className="title">{property.title}</h3>
            <p className="location">{property.location}</p>
            
            <div className="specs">
              <span className="spec">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                {property.bedrooms} Beds
              </span>
              <span className="spec">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
                {property.bathrooms} Baths
              </span>
              <span className="spec">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18"/>
                </svg>
                {property.area?.toLocaleString()} sqft
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="navigation-dots">
        {properties.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      
      <div className="card-counter">
        {currentIndex + 1} / {properties.length}
      </div>
      
      <div className="nav-buttons">
        <button 
          className="nav-btn prev" 
          onClick={goToPrev} 
          disabled={!canGoPrev}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button 
          className="nav-btn next" 
          onClick={goToNext} 
          disabled={!canGoNext}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
