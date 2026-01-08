import React, { memo, useState, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, Maximize2, X, Grid, 
  Image, MapPin, Bed, Bath, Square, Tag
} from 'lucide-react';
import './PropertyComponents.css';

const PropertyMediaGallery = memo(({ 
  images = [],
  title = '',
  onImageClick,
  showThumbnails = true,
  maxThumbnails = 5
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  }, [images.length]);
  
  const handleNext = useCallback(() => {
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  }, [images.length]);
  
  const handleThumbnailClick = useCallback((index) => {
    setCurrentIndex(index);
  }, []);
  
  if (images.length === 0) {
    return (
      <div className="property-gallery empty">
        <Image size={48} />
        <span>No images available</span>
      </div>
    );
  }
  
  return (
    <>
      <div className="property-gallery">
        <div className="gallery-main">
          <img 
            src={images[currentIndex]?.url || images[currentIndex]} 
            alt={`${title} - Image ${currentIndex + 1}`}
            onClick={() => setIsFullscreen(true)}
          />
          
          {images.length > 1 && (
            <>
              <button className="gallery-nav prev" onClick={handlePrev}>
                <ChevronLeft size={20} />
              </button>
              <button className="gallery-nav next" onClick={handleNext}>
                <ChevronRight size={20} />
              </button>
            </>
          )}
          
          <button 
            className="fullscreen-btn"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 size={16} />
          </button>
          
          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
        
        {showThumbnails && images.length > 1 && (
          <div className="gallery-thumbnails">
            {images.slice(0, maxThumbnails).map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img 
                  src={image?.url || image} 
                  alt={`Thumbnail ${index + 1}`}
                />
              </button>
            ))}
            {images.length > maxThumbnails && (
              <button className="thumbnail more">
                <Grid size={16} />
                <span>+{images.length - maxThumbnails}</span>
              </button>
            )}
          </div>
        )}
      </div>
      
      {isFullscreen && (
        <div className="fullscreen-overlay" onClick={() => setIsFullscreen(false)}>
          <button className="close-fullscreen" onClick={() => setIsFullscreen(false)}>
            <X size={24} />
          </button>
          <img 
            src={images[currentIndex]?.url || images[currentIndex]} 
            alt={`${title} - Fullscreen`}
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button 
                className="fullscreen-nav prev" 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                className="fullscreen-nav next"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
});

PropertyMediaGallery.displayName = 'PropertyMediaGallery';

const PropertySpecsGrid = memo(({ property }) => {
  if (!property) return null;
  
  const specs = [
    { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    { icon: Square, label: 'Area', value: `${property.area?.toLocaleString()} sqft` },
    { icon: Tag, label: 'Type', value: property.type },
    { icon: MapPin, label: 'Location', value: property.location }
  ].filter(spec => spec.value);
  
  return (
    <div className="property-specs-grid">
      {specs.map((spec, index) => (
        <div key={index} className="spec-item">
          <spec.icon size={18} />
          <div className="spec-content">
            <span className="spec-value">{spec.value}</span>
            <span className="spec-label">{spec.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

PropertySpecsGrid.displayName = 'PropertySpecsGrid';

const PropertyDetailContainer = memo(({ 
  property,
  onClose,
  showOwnerInfo = true,
  showFinancials = true
}) => {
  if (!property) return null;
  
  return (
    <div className="property-detail-container">
      <div className="detail-header">
        <div className="header-info">
          <h2>{property.title || property.unitNumber}</h2>
          <p className="property-address">
            <MapPin size={14} />
            {property.location || property.address}
          </p>
        </div>
        <div className="header-price">
          <span className="price-label">{property.purpose || 'Price'}</span>
          <span className="price-value">
            AED {property.price?.toLocaleString()}
          </span>
        </div>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        )}
      </div>
      
      <PropertyMediaGallery 
        images={property.images || []}
        title={property.title}
      />
      
      <PropertySpecsGrid property={property} />
      
      {showOwnerInfo && property.owner && (
        <div className="owner-info-section">
          <h4>Owner Information</h4>
          <div className="owner-card">
            <div className="owner-avatar">
              {property.owner.avatar || property.owner.name?.charAt(0)}
            </div>
            <div className="owner-details">
              <span className="owner-name">{property.owner.name}</span>
              <span className="owner-contact">{property.owner.phone}</span>
              <span className="owner-email">{property.owner.email}</span>
            </div>
          </div>
        </div>
      )}
      
      {showFinancials && (
        <div className="financial-section">
          <h4>Financial Details</h4>
          <div className="financial-grid">
            <div className="financial-item">
              <span className="fin-label">List Price</span>
              <span className="fin-value">AED {property.price?.toLocaleString()}</span>
            </div>
            {property.commission && (
              <div className="financial-item">
                <span className="fin-label">Commission</span>
                <span className="fin-value">{property.commission}%</span>
              </div>
            )}
            {property.serviceCharge && (
              <div className="financial-item">
                <span className="fin-label">Service Charge</span>
                <span className="fin-value">AED {property.serviceCharge?.toLocaleString()}/yr</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {property.description && (
        <div className="description-section">
          <h4>Description</h4>
          <p>{property.description}</p>
        </div>
      )}
    </div>
  );
});

PropertyDetailContainer.displayName = 'PropertyDetailContainer';

export default PropertyMediaGallery;
export { PropertySpecsGrid, PropertyDetailContainer };
