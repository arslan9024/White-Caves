import React from 'react';
import { useSelector } from 'react-redux';
import { Star, Bed, Bath, Maximize2, MapPin, TrendingUp } from 'lucide-react';
import { selectFeaturedProperties, selectLastUpdated } from '../../store/slices/featuredSlice';
import './FeaturedProperties.css';

const FeaturedProperties = () => {
  const featuredProperties = useSelector(selectFeaturedProperties);
  const lastUpdated = useSelector(selectLastUpdated);

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `AED ${(price / 1000000).toFixed(1)}M`;
    }
    return `AED ${price.toLocaleString()}`;
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `Updated ${days}d ago`;
    if (hours > 0) return `Updated ${hours}h ago`;
    return 'Just updated';
  };

  if (featuredProperties.length === 0) {
    return (
      <section className="featured-properties-section">
        <div className="section-container">
          <div className="section-header">
            <div className="header-badge">
              <Star size={16} />
              <span>Curated by AI</span>
            </div>
            <h2>Featured Properties</h2>
            <p>Top-rated properties selected by our AI marketing assistant</p>
          </div>
          <div className="empty-featured">
            <TrendingUp size={48} />
            <h3>Featured Properties Coming Soon</h3>
            <p>Our AI assistant Olivia is analyzing properties to select the best listings for you</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-properties-section">
      <div className="section-container">
        <div className="section-header">
          <div className="header-badge">
            <Star size={16} />
            <span>AI-Selected Top 10</span>
          </div>
          <h2>Featured Properties</h2>
          <p>Handpicked by Olivia based on popularity, quality, and market trends</p>
          {lastUpdated && (
            <span className="last-updated">{formatTimeAgo(lastUpdated)}</span>
          )}
        </div>
        
        <div className="featured-grid">
          {featuredProperties.slice(0, 10).map((property, index) => (
            <div key={property.id} className={`featured-card ${index < 3 ? 'top-three' : ''}`}>
              {index < 3 && (
                <div className={`rank-badge rank-${index + 1}`}>
                  #{index + 1}
                </div>
              )}
              {property.isNew && (
                <div className="new-badge">New</div>
              )}
              <div className="card-image">
                <img 
                  src={property.image} 
                  alt={property.name}
                  loading="lazy"
                />
                <div className="score-overlay">
                  <TrendingUp size={14} />
                  <span>Score: {property.score?.toFixed(0) || 'N/A'}</span>
                </div>
              </div>
              <div className="card-content">
                <div className="property-type">{property.type}</div>
                <h3 className="property-title">{property.name}</h3>
                <div className="property-meta">
                  <span className="meta-item">
                    <Bed size={14} />
                    {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                  </span>
                  {property.bathrooms && (
                    <span className="meta-item">
                      <Bath size={14} />
                      {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                    </span>
                  )}
                  {property.sqft && (
                    <span className="meta-item">
                      <Maximize2 size={14} />
                      {property.sqft.toLocaleString()} sqft
                    </span>
                  )}
                </div>
                <div className="property-stats">
                  <span className="stat">
                    <strong>{property.inquiries}</strong> inquiries
                  </span>
                  <span className="stat">
                    <strong>{property.views?.toLocaleString()}</strong> views
                  </span>
                </div>
                <div className="property-footer">
                  <span className="property-price">{formatPrice(property.price)}</span>
                  <button className="view-btn">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;