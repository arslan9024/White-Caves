/**
 * PropertyDetailPage — Standalone Property View
 * ==============================================
 * Route: /property/:id
 * Full property detail with gallery, specs, location mini-map,
 * contact agent CTA, share buttons, similar properties carousel.
 */

import React, { FC, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePropertyBrowser, type PropertyType } from '../hooks/usePropertyBrowser';
import { usePublicFavorites } from '../hooks/usePublicFavorites';
import PublicLayout from '../components/layout/PublicLayout';
import { PropertyImageSlider } from '../shared/components/property';
import {
  ArrowLeft, Heart, Share2, MapPin, Bed, Bath, Maximize,
  Calendar, Building2, Phone, Mail, MessageCircle,
  Copy, Printer, ChevronRight,
} from 'lucide-react';
import { createLogger } from '../utils/logger';
import './PropertyDetailPage.css';

const log = createLogger('PropertyDetailPage');

const DubaiMap = lazy(() => import('../components/maps/DubaiMap'));

/* ─── Share Helpers ─────────────────────────────────────────────── */

function shareProperty(property: PropertyType) {
  const url = `${window.location.origin}/property/${property.id}`;
  const text = `${property.title} — AED ${property.price.toLocaleString()} | ${property.location}`;

  if (navigator.share) {
    navigator.share({ title: property.title, text, url }).catch(e => log.warn('Share failed:', e));
  } else {
    navigator.clipboard.writeText(url).catch(e => log.warn('Clipboard write failed:', e));
  }
}

function copyLink(propertyId: string) {
  const url = `${window.location.origin}/property/${propertyId}`;
  navigator.clipboard.writeText(url).catch(e => log.warn('Clipboard write failed:', e));
}

function printProperty() {
  window.print();
}

function contactWhatsApp(property: PropertyType) {
  const msg = encodeURIComponent(
    `Hi, I'm interested in "${property.title}" (AED ${property.price.toLocaleString()}) at ${property.location}. Can you share more details?`
  );
  window.open(`https://wa.me/971500000000?text=${msg}`, '_blank', 'noopener');
}

function contactPhone() {
  window.open('tel:+971500000000', '_self');
}

function contactEmail(property: PropertyType) {
  const subject = encodeURIComponent(`Inquiry: ${property.title}`);
  const body = encodeURIComponent(
    `I'm interested in "${property.title}" (AED ${property.price.toLocaleString()}) at ${property.location}.\n\nPlease send me more details.`
  );
  window.open(`mailto:info@whitecaves.ae?subject=${subject}&body=${body}`, '_self');
}

/* ─── Component ─────────────────────────────────────────────────── */

const PropertyDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, loading } = usePropertyBrowser();
  const { isFavorite, toggleFavorite } = usePublicFavorites();

  const property = useMemo(
    () => properties.find((p) => p.id === id) || null,
    [properties, id]
  );

  useDocumentTitle(property ? `${property.title} | White Caves` : 'Property Details');

  const similarProperties = useMemo(() => {
    if (!property) return [];
    return properties
      .filter(
        (p) =>
          p.id !== property.id &&
          (p.location === property.location || p.type === property.type)
      )
      .slice(0, 4);
  }, [properties, property]);

  const favoriteItem = property
    ? {
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price.toLocaleString(),
        image: property.image,
      }
    : null;

  /* ─── Loading / Not Found ───────────────────────────────────── */

  if (loading) {
    return (
      <PublicLayout>
        <div className="property-detail-page dubai-luxury-theme">
          <div className="detail-loading">
            <div className="loading-spinner" />
            <p>Loading property details...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!property) {
    return (
      <PublicLayout>
        <div className="property-detail-page dubai-luxury-theme">
          <div className="detail-not-found">
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</p>
            <h2>Property Not Found</h2>
            <p>The property you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link to="/properties" className="back-to-listings">
              <ArrowLeft size={16} /> Back to Listings
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  /* ─── Main Render ───────────────────────────────────────────── */

  return (
    <PublicLayout>
      <div className="property-detail-page dubai-luxury-theme" data-testid="property-detail-page">
        {/* ─── Breadcrumb ───────────────────────────────────── */}
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/properties">Properties</Link>
          <ChevronRight size={14} />
          <span>{property.location}</span>
          <ChevronRight size={14} />
          <span className="current">{property.title}</span>
        </nav>

        {/* ─── Gallery ──────────────────────────────────────── */}
        <section className="detail-gallery">
          <PropertyImageSlider
            images={property.images}
            title={property.title}
            showControls
            showThumbnails
            isFavorite={isFavorite(property.id)}
            onFavorite={() => favoriteItem && toggleFavorite(favoriteItem)}
            onShare={() => shareProperty(property)}
          />
        </section>

        {/* ─── Content Grid: Main + Sidebar ─────────────────── */}
        <div className="detail-content-grid">
          {/* ─── Main Content ─────────────────────────────── */}
          <main className="detail-main">
            {/* Header */}
            <div className="detail-header">
              <div className="detail-badges">
                {property.featured && <span className="badge featured">Featured</span>}
                <span className={`badge purpose ${property.purpose}`}>
                  {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                </span>
                <span className="badge type">{property.type}</span>
              </div>

              <h1 className="detail-title">{property.title}</h1>

              <p className="detail-location">
                <MapPin size={16} />
                {property.location}
              </p>

              <div className="detail-price-row">
                <span className="detail-price">
                  AED {property.price.toLocaleString()}
                </span>
                {property.sqft > 0 && (
                  <span className="detail-price-sqft">
                    AED {Math.round(property.price / property.sqft).toLocaleString()}/sqft
                  </span>
                )}
              </div>
            </div>

            {/* Specs Bar */}
            <div className="detail-specs-bar">
              <div className="spec-item">
                <Bed size={20} />
                <div>
                  <span className="spec-value">{property.beds}</span>
                  <span className="spec-label">Bedrooms</span>
                </div>
              </div>
              <div className="spec-item">
                <Bath size={20} />
                <div>
                  <span className="spec-value">{property.baths}</span>
                  <span className="spec-label">Bathrooms</span>
                </div>
              </div>
              <div className="spec-item">
                <Maximize size={20} />
                <div>
                  <span className="spec-value">{property.sqft.toLocaleString()}</span>
                  <span className="spec-label">Sq Ft</span>
                </div>
              </div>
              <div className="spec-item">
                <Calendar size={20} />
                <div>
                  <span className="spec-value">{property.yearBuilt}</span>
                  <span className="spec-label">Year Built</span>
                </div>
              </div>
              <div className="spec-item">
                <Building2 size={20} />
                <div>
                  <span className="spec-value">{property.type}</span>
                  <span className="spec-label">Type</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <section className="detail-amenities">
                <h2>Amenities & Features</h2>
                <div className="amenities-grid">
                  {property.amenities.map((a) => (
                    <span key={a} className="amenity-tag">
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Location Map */}
            <section className="detail-location-map">
              <h2>Location</h2>
              <Suspense
                fallback={
                  <div className="map-placeholder">
                    <p>Loading map...</p>
                  </div>
                }
              >
                <DubaiMap
                  properties={[property]}
                  showCommunities={false}
                  height="350px"
                />
              </Suspense>
            </section>
          </main>

          {/* ─── Sidebar ──────────────────────────────────── */}
          <aside className="detail-sidebar">
            {/* Contact Agent Card */}
            <div className="contact-agent-card">
              <h3>Contact Agent</h3>
              <p className="agent-subtitle">Interested in this property? Get in touch now.</p>

              <button
                className="contact-btn whatsapp"
                onClick={() => contactWhatsApp(property)}
              >
                <MessageCircle size={18} />
                WhatsApp
              </button>

              <button className="contact-btn phone" onClick={contactPhone}>
                <Phone size={18} />
                Call Agent
              </button>

              <button
                className="contact-btn email"
                onClick={() => contactEmail(property)}
              >
                <Mail size={18} />
                Send Email
              </button>
            </div>

            {/* Action Buttons */}
            <div className="detail-actions">
              <button
                className={`action-btn favorite ${isFavorite(property.id) ? 'active' : ''}`}
                onClick={() => favoriteItem && toggleFavorite(favoriteItem)}
              >
                <Heart
                  size={18}
                  fill={isFavorite(property.id) ? '#DC2626' : 'none'}
                />
                {isFavorite(property.id) ? 'Saved' : 'Save'}
              </button>

              <button
                className="action-btn share"
                onClick={() => shareProperty(property)}
              >
                <Share2 size={18} />
                Share
              </button>

              <button
                className="action-btn copy"
                onClick={() => copyLink(property.id)}
              >
                <Copy size={18} />
                Copy Link
              </button>

              <button className="action-btn print" onClick={printProperty}>
                <Printer size={18} />
                Print
              </button>
            </div>

            {/* Back to Listings */}
            <button
              className="back-btn"
              onClick={() => navigate('/properties')}
            >
              <ArrowLeft size={16} />
              Back to Listings
            </button>
          </aside>
        </div>

        {/* ─── Similar Properties ───────────────────────────── */}
        {similarProperties.length > 0 && (
          <section className="similar-properties">
            <h2>Similar Properties</h2>
            <div className="similar-grid">
              {similarProperties.map((sp) => (
                <Link
                  key={sp.id}
                  to={`/property/${sp.id}`}
                  className="similar-card"
                >
                  <img
                    src={sp.image}
                    alt={sp.title}
                    loading="lazy"
                    width={280}
                    height={180}
                    className="similar-card-image"
                  />
                  <div className="similar-card-info">
                    <span className="similar-type">{sp.type}</span>
                    <h4>{sp.title}</h4>
                    <p>
                      <MapPin size={12} /> {sp.location}
                    </p>
                    <span className="similar-price">
                      AED {sp.price.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </PublicLayout>
  );
};

export default PropertyDetailPage;
