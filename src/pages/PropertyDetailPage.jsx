import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites, selectFavorites } from '../store/dashboardSlice';
import AppLayout from '../components/layout/AppLayout';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  Share2,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Building2,
  Check,
  Printer,
  Download,
  Clock,
  Shield,
  Award,
} from 'lucide-react';
import './PropertyDetailPage.css';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const isFavorite = property && favorites.includes(property._id || property.id);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/crud/properties/${id}`);
        if (!response.ok) {
          throw new Error('Property not found');
        }
        const data = await response.json();
        setProperty(data.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Property not found';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleToggleFavorite = () => {
    const propertyId = property._id || property.id;
    if (isFavorite) {
      dispatch(removeFromFavorites(propertyId));
    } else {
      dispatch(addToFavorites(propertyId));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title} in ${property.location}`,
          url: window.location.href,
        });
      } catch {
        setStatusMessage({ type: 'error', text: 'Unable to share this property right now.' });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setStatusMessage({ type: 'success', text: 'Link copied to clipboard!' });
    }
  };

  const handleContactSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/crud/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          source: 'property_page',
          propertyInterest: property.title,
          status: 'new',
          notes: contactForm.message,
          interestedIn: property.purpose === 'rent' ? 'rent' : 'buy',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setShowContactModal(false);
          setSubmitted(false);
          setContactForm({ name: '', email: '', phone: '', message: '' });
        }, 2000);
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Unable to submit your request right now.' });
    } finally {
      setSubmitting(false);
    }
  };

  const nextImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex(prev => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images?.length) {
      setCurrentImageIndex(prev => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const formatPrice = (price, purpose) => {
    if (!price) return 'Price on request';
    const formatted = new Intl.NumberFormat('en-AE', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price);
    return `AED ${formatted}${purpose === 'rent' ? '/yr' : ''}`;
  };

  const generateGoogleMapsUrl = () => {
    if (!property?.location) return null;
    const query = encodeURIComponent(`${property.address || ''} ${property.location}, Dubai, UAE`);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${query}`;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="property-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading property details...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !property) {
    return (
      <AppLayout>
        <div className="property-detail-error">
          <h2>Property Not Found</h2>
          <p>Sorry, we couldn&apos;t find the property you&apos;re looking for.</p>
          <button onClick={() => navigate('/properties')} className="back-btn">
            <ChevronLeft size={20} />
            Back to Properties
          </button>
        </div>
      </AppLayout>
    );
  }

  const images = property.images?.length
    ? property.images
    : [property.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'];

  return (
    <AppLayout>
      <div className="property-detail-page">
        {statusMessage && (
          <div
            role={statusMessage.type === 'error' ? 'alert' : 'status'}
            data-testid="property-detail-status-banner"
            style={{
              marginBottom: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              borderLeft: `4px solid ${statusMessage.type === 'error' ? '#F04438' : '#12B76A'}`,
              background: statusMessage.type === 'error' ? '#FEF3F2' : '#ECFDF3',
              color: statusMessage.type === 'error' ? '#B42318' : '#027A48',
            }}
          >
            {statusMessage.type === 'error' ? '⚠️' : '✅'} {statusMessage.text}
          </div>
        )}

        <nav className="breadcrumb-nav">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/properties">Properties</Link>
          <span>/</span>
          <span className="current">{property.title}</span>
        </nav>

        <div className="property-gallery-section">
          <div className="main-image-container">
            <img
              src={images[currentImageIndex]} // eslint-disable-line security/detect-object-injection
              alt={property.title}
              onClick={() => setShowGalleryModal(true)}
            />
            {images.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={prevImage}>
                  <ChevronLeft size={24} />
                </button>
                <button className="gallery-nav next" onClick={nextImage}>
                  <ChevronRight size={24} />
                </button>
                <div className="image-counter">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
            <div className="gallery-actions">
              <button
                onClick={handleToggleFavorite}
                className={`action-btn ${isFavorite ? 'active' : ''}`}
              >
                <Heart size={20} fill={isFavorite ? '#B03737' : 'none'} />
              </button>
              <button onClick={handleShare} className="action-btn">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {images.length > 1 && (
            <div className="thumbnail-row">
              {images.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img src={img} alt={`View ${idx + 1}`} />
                  {idx === 4 && images.length > 5 && (
                    <span className="more-images">+{images.length - 5}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="property-detail-content">
          <div className="property-main-info">
            <div className="property-header">
              <div className="property-badges">
                {property.featured && <span className="badge featured">Featured</span>}
                <span className={`badge ${property.purpose === 'rent' ? 'rent' : 'sale'}`}>
                  {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                {property.status === 'off-plan' && <span className="badge off-plan">Off-Plan</span>}
              </div>
              <h1>{property.title}</h1>
              <div className="property-location">
                <MapPin size={18} />
                <span>{property.address || property.location}, Dubai</span>
              </div>
            </div>

            <div className="property-price-section">
              <div className="price">{formatPrice(property.price, property.purpose)}</div>
              {property.purpose === 'rent' && (
                <div className="price-breakdown">
                  Approx. AED {Math.round(property.price / 12).toLocaleString()}/month
                </div>
              )}
            </div>

            <div className="property-specs">
              <div className="spec">
                <Bed size={22} />
                <span>{property.beds || property.bedrooms || 'N/A'}</span>
                <label>Bedrooms</label>
              </div>
              <div className="spec">
                <Bath size={22} />
                <span>{property.baths || property.bathrooms || 'N/A'}</span>
                <label>Bathrooms</label>
              </div>
              <div className="spec">
                <Maximize size={22} />
                <span>{(property.sqft || property.size || 0).toLocaleString()}</span>
                <label>Sq.Ft</label>
              </div>
              <div className="spec">
                <Building2 size={22} />
                <span>{property.type || 'Property'}</span>
                <label>Type</label>
              </div>
            </div>

            <div className="property-section">
              <h2>Description</h2>
              <p className="property-description">
                {property.description ||
                  `Experience luxury living in this stunning ${property.type?.toLowerCase() || 'property'} located in the prestigious ${property.location} area of Dubai. This exceptional property offers ${property.beds || property.bedrooms || 'multiple'} bedrooms and ${property.baths || property.bathrooms || 'multiple'} bathrooms across ${(property.sqft || property.size || 0).toLocaleString()} sq.ft of living space. Perfect for those seeking an upscale lifestyle in one of Dubai's most sought-after communities.`}
              </p>
            </div>

            {property.amenities?.length > 0 && (
              <div className="property-section">
                <h2>Amenities & Features</h2>
                <div className="amenities-grid">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="amenity-item">
                      <Check size={16} />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="property-section">
              <h2>Location</h2>
              <div className="location-info">
                <p>
                  <MapPin size={16} />
                  {property.address || property.location}, Dubai, UAE
                </p>
              </div>
              <div className="google-map-container">
                <iframe
                  title="Property Location"
                  src={generateGoogleMapsUrl()}
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="property-section">
              <h2>Property Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Property ID</label>
                  <span>{property.propertyId || property._id}</span>
                </div>
                <div className="detail-item">
                  <label>Property Type</label>
                  <span>{property.type}</span>
                </div>
                <div className="detail-item">
                  <label>Purpose</label>
                  <span>{property.purpose === 'rent' ? 'For Rent' : 'For Sale'}</span>
                </div>
                <div className="detail-item">
                  <label>Bedrooms</label>
                  <span>{property.beds || property.bedrooms || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Bathrooms</label>
                  <span>{property.baths || property.bathrooms || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Size</label>
                  <span>{(property.sqft || property.size || 0).toLocaleString()} sq.ft</span>
                </div>
                {property.yearBuilt && (
                  <div className="detail-item">
                    <label>Year Built</label>
                    <span>{property.yearBuilt}</span>
                  </div>
                )}
                {property.developer && (
                  <div className="detail-item">
                    <label>Developer</label>
                    <span>{property.developer}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="property-sidebar">
            <div className="contact-card">
              <h3>Interested in this property?</h3>
              <p>Contact our luxury property specialists for a private viewing</p>

              <div className="contact-buttons">
                <button className="contact-btn primary" onClick={() => setShowContactModal(true)}>
                  <Mail size={18} />
                  Request Info
                </button>
                <a href="tel:+97142880889" className="contact-btn secondary">
                  <Phone size={18} />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/97142880889?text=Hi, I'm interested in ${property.title} (${window.location.href})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn whatsapp"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </div>

              <div className="agent-info">
                <div className="agent-avatar">
                  <img
                    src="https://ui-avatars.com/api/?name=White+Caves&background=B03737&color=fff"
                    alt="Agent"
                  />
                </div>
                <div className="agent-details">
                  <h4>White Caves Real Estate</h4>
                  <p>Luxury Property Specialists</p>
                  <div className="agent-badges">
                    <span>
                      <Shield size={14} /> Verified
                    </span>
                    <span>
                      <Award size={14} /> Top Agent
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <button className="quick-action-btn">
                <Printer size={18} />
                Print
              </button>
              <button className="quick-action-btn">
                <Download size={18} />
                Brochure
              </button>
              <button className="quick-action-btn">
                <Calendar size={18} />
                Schedule Viewing
              </button>
            </div>

            <div className="trust-badges">
              <div className="trust-item">
                <Shield size={24} />
                <div>
                  <strong>RERA Licensed</strong>
                  <span>BRN: 12345</span>
                </div>
              </div>
              <div className="trust-item">
                <Clock size={24} />
                <div>
                  <strong>Quick Response</strong>
                  <span>Within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showGalleryModal && (
        <div className="gallery-modal" onClick={() => setShowGalleryModal(false)}>
          <button className="close-modal" onClick={() => setShowGalleryModal(false)}>
            <X size={24} />
          </button>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line security/detect-object-injection */}
            <img src={images[currentImageIndex]} alt={property.title} />
            {images.length > 1 && (
              <>
                <button className="modal-nav prev" onClick={prevImage}>
                  <ChevronLeft size={32} />
                </button>
                <button className="modal-nav next" onClick={nextImage}>
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            <div className="modal-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="contact-modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="contact-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowContactModal(false)}>
              <X size={20} />
            </button>
            <h3>Request Property Information</h3>
            <p className="modal-property">{property.title}</p>

            {submitted ? (
              <div className="success-message">
                <Check size={48} />
                <h4>Thank you!</h4>
                <p>We&apos;ll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={contactForm.phone}
                    onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Message (optional)"
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                  />
                </div>
                <button type="submit" disabled={submitting} className="submit-btn">
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </AppLayout>
  );
};

export default PropertyDetailPage;
