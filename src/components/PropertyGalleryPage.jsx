import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Share2, Heart, MapPin, Bed, Bath, Maximize2, DollarSign } from 'lucide-react';
import './PropertyGalleryPage.css';

const PropertyGalleryPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('gallery'); // gallery, details, documents

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/crud/properties/${propertyId}`);
        if (!response.ok) throw new Error('Failed to fetch property');
        const data = await response.json();
        setProperty(data);

        // Fetch similar properties
        const similarResponse = await fetch(`/api/properties/${propertyId}/similar`);
        if (similarResponse.ok) {
          const similarData = await similarResponse.json();
          setSimilarProperties(similarData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (loading) return <div className="property-gallery-loading">Loading property...</div>;
  if (error) return <div className="property-gallery-error">Error: {error}</div>;
  if (!property) return <div className="property-gallery-error">Property not found</div>;

  const images = property.gallery || property.images || [property.image];
  const currentImage = images[currentImageIndex];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleFavorite = async () => {
    try {
      const response = await fetch(`/api/favorites`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId })
      });
      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error('Failed to update favorite:', err);
    }
  };

  return (
    <div className="property-gallery-page">
      {/* Header */}
      <div className="gallery-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <div className="gallery-actions">
          <button className="btn-action" onClick={handleShare} title="Share">
            <Share2 size={20} />
          </button>
          <button 
            className={`btn-action ${isFavorite ? 'favorite-active' : ''}`}
            onClick={handleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={20} />
          </button>
        </div>
      </div>

      {/* Main Gallery */}
      <div className={`gallery-main ${isFullscreen ? 'fullscreen' : ''}`}>
        <img
          src={currentImage}
          alt={`Property view ${currentImageIndex + 1}`}
          className="gallery-image"
        />

        {/* Navigation */}
        <button
          className="gallery-nav gallery-nav-prev"
          onClick={handlePrevImage}
          disabled={images.length <= 1}
        >
          <ChevronLeft size={32} />
        </button>
        <button
          className="gallery-nav gallery-nav-next"
          onClick={handleNextImage}
          disabled={images.length <= 1}
        >
          <ChevronRight size={32} />
        </button>

        {/* Image Counter */}
        <div className="gallery-counter">
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Fullscreen Toggle */}
        <button
          className="btn-fullscreen"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <Maximize2 size={20} />
        </button>
      </div>

      {/* Thumbnail Strip */}
      {!isFullscreen && (
        <div className="gallery-thumbnails">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(idx)}
              style={{ backgroundImage: `url(${img})` }}
              aria-label={`Image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Tabs */}
      {!isFullscreen && (
        <div className="gallery-tabs">
          <button
            className={`tab ${selectedTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setSelectedTab('gallery')}
          >
            Gallery
          </button>
          <button
            className={`tab ${selectedTab === 'details' ? 'active' : ''}`}
            onClick={() => setSelectedTab('details')}
          >
            Details
          </button>
          <button
            className={`tab ${selectedTab === 'documents' ? 'active' : ''}`}
            onClick={() => setSelectedTab('documents')}
          >
            Documents
          </button>
        </div>
      )}

      {/* Content Sections */}
      {!isFullscreen && (
        <div className="gallery-content">
          {selectedTab === 'gallery' && (
            <div className="gallery-info">
              <h1>{property.title}</h1>
              <div className="property-meta">
                <div className="meta-item">
                  <DollarSign size={18} />
                  <span>{property.price ? `AED ${parseInt(property.price).toLocaleString()}` : 'Price on request'}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={18} />
                  <span>{property.area || property.location}</span>
                </div>
              </div>
              <p className="property-description">{property.description}</p>
            </div>
          )}

          {selectedTab === 'details' && (
            <div className="property-details">
              <div className="details-grid">
                <div className="detail-item">
                  <Bed size={20} />
                  <div>
                    <label>Bedrooms</label>
                    <span>{property.beds || property.bedrooms || 'N/A'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Bath size={20} />
                  <div>
                    <label>Bathrooms</label>
                    <span>{property.baths || property.bathrooms || 'N/A'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Maximize2 size={20} />
                  <div>
                    <label>Area</label>
                    <span>{property.sqft || property.area_sqft || 'N/A'} sqft</span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price Per Sqft</span>
                  <span className="detail-value">
                    {property.price && property.sqft
                      ? `AED ${Math.round(property.price / property.sqft)}`
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="amenities-section">
                <h3>Amenities</h3>
                <div className="amenities-list">
                  {property.amenities && property.amenities.length > 0 ? (
                    property.amenities.map((amenity, idx) => (
                      <span key={idx} className="amenity-tag">{amenity}</span>
                    ))
                  ) : (
                    <p>No amenities listed</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'documents' && (
            <div className="property-documents">
              <h3>Documents & Floor Plans</h3>
              {property.documents && property.documents.length > 0 ? (
                <ul className="documents-list">
                  {property.documents.map((doc, idx) => (
                    <li key={idx}>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        {doc.name || `Document ${idx + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-documents">
                  No documents available. <button className="link-btn">Request floor plan</button>
                </p>
              )}
            </div>
          )}

          {/* Contact Agent Section */}
          <div className="gallery-contact-section">
            <h3>Interested in this property?</h3>
            <button
              className="btn-contact-agent"
              onClick={() => navigate(`/property/${propertyId}/contact-agent`)}
            >
              Contact Agent
            </button>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <div className="similar-properties-section">
              <h3>Similar Properties</h3>
              <div className="similar-properties-grid">
                {similarProperties.slice(0, 4).map((prop) => (
                  <div
                    key={prop._id}
                    className="similar-property-card"
                    onClick={() => navigate(`/property-gallery/${prop._id}`)}
                  >
                    <img src={prop.image || prop.images?.[0]} alt={prop.title} />
                    <div className="card-overlay">
                      <h4>{prop.title}</h4>
                      <p className="card-price">AED {parseInt(prop.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyGalleryPage;
