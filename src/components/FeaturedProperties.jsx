import React, { useState, useEffect, useCallback } from 'react';
import { Home, MapPin, Bed, Bath, Square, Eye, MessageCircle, Star, ChevronLeft, ChevronRight, X, Phone, FileText, Bot } from 'lucide-react';
import './FeaturedProperties.css';

const formatPrice = (price) => {
  if (!price) return 'Price on Request';
  if (price >= 1000000) {
    return `AED ${(price / 1000000).toFixed(2)}M`;
  } else if (price >= 1000) {
    return `AED ${(price / 1000).toFixed(0)}K`;
  }
  return `AED ${price.toLocaleString()}`;
};

const PropertyCard = ({ property, rank, onViewDetails }) => {
  const { title, propertyType, area, askingPrice, rooms, actualArea, images, score, purpose } = property;
  const primaryImage = images?.[0] || '/placeholder-property.jpg';

  return (
    <div className="featured-property-card" onClick={() => onViewDetails(property)}>
      {rank <= 3 && (
        <div className={`rank-badge rank-${rank}`}>
          <Star size={12} />
          #{rank}
        </div>
      )}
      <div className="property-image-container">
        <img 
          src={primaryImage} 
          alt={title} 
          className="property-image"
          onError={(e) => { e.target.src = '/placeholder-property.jpg'; }}
        />
        <div className="property-purpose-badge">{purpose === 'sale' ? 'For Sale' : 'For Rent'}</div>
        {score && (
          <div className="property-score-badge">
            <Bot size={12} />
            {Math.round(score)}
          </div>
        )}
      </div>
      <div className="property-content">
        <h3 className="property-title">{title || `${propertyType} in ${area}`}</h3>
        <div className="property-location">
          <MapPin size={14} />
          <span>{area}</span>
        </div>
        <div className="property-price">{formatPrice(askingPrice)}</div>
        <div className="property-specs">
          {rooms && (
            <span className="spec">
              <Bed size={14} />
              {rooms} {rooms === 1 ? 'Bed' : 'Beds'}
            </span>
          )}
          {actualArea && (
            <span className="spec">
              <Square size={14} />
              {actualArea.toLocaleString()} sqft
            </span>
          )}
        </div>
        <div className="property-type-badge">{propertyType}</div>
      </div>
    </div>
  );
};

const PropertyModal = ({ property, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images?.length > 0 ? property.images : ['/placeholder-property.jpg'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="property-modal-overlay" onClick={onClose}>
      <div className="property-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-gallery">
          <div className="main-image-container">
            <img 
              src={images[currentImageIndex]} 
              alt={property.title}
              className="main-image"
              onError={(e) => { e.target.src = '/placeholder-property.jpg'; }}
            />
            {images.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={prevImage}><ChevronLeft size={24} /></button>
                <button className="gallery-nav next" onClick={nextImage}><ChevronRight size={24} /></button>
                <div className="image-counter">{currentImageIndex + 1} / {images.length}</div>
              </>
            )}
          </div>
        </div>

        <div className="modal-details">
          <div className="modal-header">
            <h2>{property.title || `${property.propertyType} in ${property.area}`}</h2>
            <div className="modal-price">{formatPrice(property.askingPrice)}</div>
          </div>

          <div className="modal-location">
            <MapPin size={16} />
            <span>{property.area}{property.project ? `, ${property.project}` : ''}</span>
          </div>

          <div className="modal-specs">
            <div className="spec-item">
              <Home size={20} />
              <span className="spec-value">{property.propertyType}</span>
              <span className="spec-label">Type</span>
            </div>
            {property.rooms && (
              <div className="spec-item">
                <Bed size={20} />
                <span className="spec-value">{property.rooms}</span>
                <span className="spec-label">Bedrooms</span>
              </div>
            )}
            {property.actualArea && (
              <div className="spec-item">
                <Square size={20} />
                <span className="spec-value">{property.actualArea.toLocaleString()}</span>
                <span className="spec-label">Sqft</span>
              </div>
            )}
          </div>

          {property.scoreBreakdown && (
            <div className="ai-score-section">
              <h4><Bot size={16} /> AI Score Breakdown</h4>
              <div className="score-breakdown">
                <div className="score-item">
                  <span>Inquiries</span>
                  <span className="score-value">+{property.scoreBreakdown.inquiriesScore}</span>
                </div>
                <div className="score-item">
                  <span>Views</span>
                  <span className="score-value">+{property.scoreBreakdown.viewsScore}</span>
                </div>
                <div className="score-item">
                  <span>Quality</span>
                  <span className="score-value">+{property.scoreBreakdown.qualityScore}</span>
                </div>
                {property.scoreBreakdown.newListingBonus > 0 && (
                  <div className="score-item highlight">
                    <span>New Listing Bonus</span>
                    <span className="score-value">+{property.scoreBreakdown.newListingBonus}</span>
                  </div>
                )}
                <div className="score-total">
                  <span>Total Score</span>
                  <span className="score-value">{property.score}</span>
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button className="action-btn primary">
              <Phone size={16} /> Schedule Viewing
            </button>
            <button className="action-btn secondary">
              <MessageCircle size={16} /> Inquire via WhatsApp
            </button>
            <button className="action-btn tertiary">
              <FileText size={16} /> Download Brochure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [dateActive, setDateActive] = useState(null);

  const fetchFeaturedProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/featured-properties');
      const data = await response.json();

      if (data.success && data.featuredProperties) {
        setProperties(data.featuredProperties);
        setDateActive(data.dateActive);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to load properties');
      }
    } catch (err) {
      console.error('Error fetching featured properties:', err);
      setError('Unable to load featured properties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProperties();
  }, [fetchFeaturedProperties]);

  const openModal = (property) => {
    setSelectedProperty(property);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProperty(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <section className="featured-properties-section">
        <div className="featured-container">
          <div className="featured-header">
            <h2 className="featured-title">Featured Properties</h2>
            <p className="featured-subtitle">Loading today's selection...</p>
          </div>
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="property-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || properties.length === 0) {
    return (
      <section className="featured-properties-section">
        <div className="featured-container">
          <div className="featured-header">
            <h2 className="featured-title">Featured Properties</h2>
            <p className="featured-subtitle">{error || 'No properties available at this time'}</p>
          </div>
          <button className="retry-btn" onClick={fetchFeaturedProperties}>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const formattedDate = dateActive ? new Date(dateActive).toLocaleDateString('en-AE', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  return (
    <section className="featured-properties-section">
      <div className="featured-container">
        <div className="featured-header">
          <div className="header-content">
            <h2 className="featured-title">
              <span className="highlight">Featured Properties</span> in Dubai
            </h2>
            <p className="featured-subtitle">
              <Bot size={16} /> Curated by Olivia AI | Updated Daily | {formattedDate}
            </p>
          </div>
          <div className="header-badges">
            <span className="ai-badge">
              <Bot size={14} /> AI Selected
            </span>
            <span className="count-badge">
              {properties.length} Properties
            </span>
          </div>
        </div>

        <div className={`properties-grid ${viewMode}`}>
          {properties.map((property, index) => (
            <PropertyCard
              key={property.propertyRef || index}
              property={property}
              rank={index + 1}
              onViewDetails={openModal}
            />
          ))}
        </div>

        <div className="ai-note">
          <Bot size={18} />
          <p>
            These properties are automatically selected daily by <strong>Olivia</strong>, our Marketing AI,
            using a scoring algorithm based on inquiries, views, quality, and listing freshness.
          </p>
        </div>
      </div>

      {selectedProperty && (
        <PropertyModal property={selectedProperty} onClose={closeModal} />
      )}
    </section>
  );
};

export default FeaturedProperties;
