import React, { useEffect } from 'react';
import { useRecommendations, useUserBehavior } from '../hooks/useRecommendations';
import OptimizedImage from './OptimizedImage';
import './AIRecommendations.css';

export default function AIRecommendations({ onPropertyClick }) {
  const { recommendations, loading, error, refresh } = useRecommendations();
  const { trackPropertyView } = useUserBehavior();

  const handlePropertyClick = (property) => {
    trackPropertyView(property);
    onPropertyClick?.(property);
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `AED ${(price / 1000000).toFixed(1)}M`;
    }
    return `AED ${(price / 1000).toFixed(0)}K`;
  };

  if (loading) {
    return (
      <div className="ai-recommendations">
        <div className="ai-header">
          <div className="ai-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h2>AI-Powered Recommendations</h2>
        </div>
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Analyzing your preferences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-recommendations">
        <div className="error-state">
          <p>Unable to load recommendations</p>
          <button onClick={refresh}>Try Again</button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="ai-recommendations">
        <div className="ai-header">
          <div className="ai-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h2>Personalized For You</h2>
        </div>
        <div className="empty-state">
          <p>Browse more properties to get personalized recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommendations">
      <div className="ai-header">
        <div className="ai-icon animated">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <div className="ai-header-text">
          <h2>AI-Powered Picks For You</h2>
          <p>Based on your preferences and browsing history</p>
        </div>
        <button className="refresh-btn" onClick={refresh}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((property, index) => (
          <div 
            key={property._id} 
            className="recommendation-card"
            onClick={() => handlePropertyClick(property)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="match-score">
              <span className="score">{property.matchScore}%</span>
              <span className="label">Match</span>
            </div>
            
            <div className="card-image">
              <OptimizedImage
                src={property.images?.[0] || '/placeholder-property.jpg'}
                alt={property.title}
              />
              {property.virtualTour && (
                <span className="vr-badge">360° Tour</span>
              )}
            </div>

            <div className="card-content">
              <div className="price">{formatPrice(property.price)}</div>
              <h3 className="title">{property.title}</h3>
              <p className="location">{property.location}</p>

              <div className="specs">
                <span>{property.bedrooms} Beds</span>
                <span>{property.bathrooms} Baths</span>
                <span>{property.area?.toLocaleString()} sqft</span>
              </div>

              {property.matchReasons?.length > 0 && (
                <div className="match-reasons">
                  {property.matchReasons.map((reason, i) => (
                    <span key={i} className="reason">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {reason}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
