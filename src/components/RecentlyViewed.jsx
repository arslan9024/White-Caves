import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './RecentlyViewed.css';

const STORAGE_KEY = 'whitecaves_recently_viewed';
const MAX_ITEMS = 6;

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentIds(JSON.parse(stored));
      } catch (e) {
        setRecentIds([]);
      }
    }
  }, []);

  const addToRecent = (propertyId) => {
    setRecentIds(prev => {
      const filtered = prev.filter(id => id !== propertyId);
      const updated = [propertyId, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentIds([]);
  };

  return { recentIds, addToRecent, clearRecent };
}

export default function RecentlyViewed({ recentIds = [], onClear, onPropertyClick }) {
  const properties = useSelector(state => state.properties.properties);

  const recentProperties = recentIds
    .map(id => properties.find(p => p.id === id))
    .filter(Boolean);

  if (recentProperties.length === 0) {
    return null;
  }

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `AED ${(price / 1000000).toFixed(1)}M`;
    }
    return `AED ${(price / 1000).toFixed(0)}K`;
  };

  return (
    <section className="recently-viewed">
      <div className="recently-viewed-header">
        <div className="header-left">
          <h3 className="section-title">Recently Viewed</h3>
          <span className="item-count">{recentProperties.length} properties</span>
        </div>
        <button className="clear-btn" onClick={onClear}>
          Clear All
        </button>
      </div>

      <div className="recently-viewed-scroll">
        <div className="recently-viewed-track">
          {recentProperties.map((property, index) => (
            <div 
              key={property.id} 
              className="recent-property-card glass-card"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => onPropertyClick && onPropertyClick(property.id)}
            >
              <div className="recent-property-image">
                <img 
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'} 
                  alt={property.title}
                />
                <span className="property-type-badge">{property.type}</span>
              </div>
              <div className="recent-property-info">
                <h4 className="property-title">{property.title}</h4>
                <p className="property-location">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {property.location}
                </p>
                <div className="property-specs">
                  <span>{property.beds} beds</span>
                  <span className="dot"></span>
                  <span>{property.baths} baths</span>
                  <span className="dot"></span>
                  <span>{property.sqft.toLocaleString()} sqft</span>
                </div>
                <p className="property-price">{formatPrice(property.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-indicators">
        <button className="scroll-btn scroll-left" aria-label="Scroll left">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button className="scroll-btn scroll-right" aria-label="Scroll right">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
