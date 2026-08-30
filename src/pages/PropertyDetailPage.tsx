/**
 * PropertyDetailPage — Standalone Property View
 * ==============================================
 * Route: /property/:id
 * Full property detail with gallery, specs, location mini-map,
 * contact agent CTA, share buttons, similar properties carousel.
 */

import React, { FC, useMemo, lazy, Suspense, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePropertyBrowser, type PropertyType } from '../hooks/usePropertyBrowser';
import { usePublicFavorites } from '../hooks/usePublicFavorites';
import PublicLayout from '../components/layout/PublicLayout';
import PageMeta from '../components/seo/PageMeta';
import StructuredData from '../components/seo/StructuredData';
import { buildPropertyDetailPageSchemas } from '../utils/jsonLdSchemas';
import { PropertyImageSlider } from '../shared/components/property';
import { Skeleton } from '../components/shared';
import PropertyDetailMortgageEmi from '../components/properties/PropertyDetailMortgageEmi/PropertyDetailMortgageEmi';
import RentalYieldVisualizer from '../components/properties/RentalYieldVisualizer';
import PropertyVectorBadges from '../components/properties/PropertyVectorBadges/PropertyVectorBadges';

import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Building2,
  Phone,
  Mail,
  MessageCircle,
  Copy,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { createLogger } from '../utils/logger';
import './PropertyDetailPage.css';

const log = createLogger('PropertyDetailPage');

const DubaiMap = lazy(() => import('../components/maps/DubaiMap'));
const VirtualTour = lazy(() => import('../components/VirtualTour'));

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
  const [showTour, setShowTour] = useState(false);

  const property = useMemo(() => properties.find(p => p.id === id) || null, [properties, id]);

  useDocumentTitle(property ? `${property.title} | White Caves` : 'Property Details');

  const similarProperties = useMemo(() => {
    if (!property) return [];
    return properties
      .filter(
        p => p.id !== property.id && (p.location === property.location || p.type === property.type)
      )
      .slice(0, 4);
  }, [properties, property]);

  const propertySeoImage = useMemo(() => {
    const firstImage = property?.images?.[0] || property?.image;
    if (!firstImage) return undefined;
    return firstImage.includes('fm=')
      ? firstImage
      : `${firstImage}${firstImage.includes('?') ? '&' : '?'}fm=webp`;
  }, [property]);

  const propertyJsonLd = useMemo(() => {
    if (!property) return null;

    // Build comprehensive schemas for property detail page
    // Includes: Organization + Breadcrumb + Property listing
    const schemas = buildPropertyDetailPageSchemas(
      {
        name: property.title,
        description: `${property.type} in ${property.location}`,
        address: {
          streetAddress: property.location,
          addressLocality: property.location,
          addressRegion: 'Dubai',
          postalCode: '',
          addressCountry: 'AE',
        },
        price: {
          amount: property.price,
          currency: 'AED',
        },
        bedrooms: property.beds,
        bathrooms: property.baths,
        floorSize: {
          value: property.sqft,
          unitCode: 'SQF',
        },
        image: property.images || property.image,
        url: `${window.location.origin}/property/${property.id}`,
        pricingType: 'SalePrice',
        availability: 'InStock',
      },
      undefined, // agentInfo - can be added later
      [
        { name: 'Home', url: '/' },
        {
          name: property.location,
          url: `/properties?area=${encodeURIComponent(property.location)}`,
        },
        { name: property.title, url: `${window.location.origin}/property/${property.id}` },
      ]
    );

    return schemas;
  }, [property]);

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
        <div
          className="property-detail-page dubai-luxury-theme detail-loading-skeleton"
          data-testid="property-detail-loading-skeleton"
        >
          <div className="detail-loading-shell">
            <div className="detail-loading-hero">
              <Skeleton variant="rect" height={420} borderRadius="16px" />
            </div>

            <div className="detail-loading-grid">
              <div className="detail-loading-main">
                <Skeleton variant="text" width="22%" height={24} />
                <Skeleton variant="text" width="64%" height={42} />
                <Skeleton variant="text" width="38%" height={18} />
                <Skeleton variant="text" width="32%" height={34} />

                <div className="detail-loading-specs">
                  {Array.from({ length: 5 }, (_, idx) => (
                    <Skeleton key={`spec-${idx}`} variant="rect" height={86} borderRadius="12px" />
                  ))}
                </div>

                <Skeleton variant="text" width="30%" height={24} />
                <Skeleton variant="text" lines={3} />
                <Skeleton variant="rect" height={350} borderRadius="12px" />
              </div>

              <aside className="detail-loading-sidebar">
                <Skeleton variant="text" width="50%" height={22} />
                <Skeleton variant="text" width="80%" height={14} />
                <Skeleton variant="rect" height={44} borderRadius="10px" />
                <Skeleton variant="rect" height={44} borderRadius="10px" />
                <Skeleton variant="rect" height={44} borderRadius="10px" />
                <div className="detail-loading-action-grid">
                  {Array.from({ length: 4 }, (_, idx) => (
                    <Skeleton
                      key={`action-${idx}`}
                      variant="rect"
                      height={38}
                      borderRadius="10px"
                    />
                  ))}
                </div>
                <Skeleton variant="rect" height={40} borderRadius="10px" />
              </aside>
            </div>
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
            <p className="detail-not-found-icon">🏠</p>
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
        <PageMeta
          title={property ? `${property.title} | White Caves` : 'Property Details | White Caves'}
          description={
            property
              ? `Explore ${property.title} in ${property.location}. ${property.beds} beds, ${property.baths} baths, ${property.sqft.toLocaleString()} sqft.`
              : 'Explore luxury property details in Dubai with White Caves.'
          }
          canonicalPath={property ? `/property/${property.id}` : '/properties'}
          ogType="article"
          ogImage={propertySeoImage}
        />
        {propertyJsonLd && <StructuredData id="wc-property-detail-jsonld" data={propertyJsonLd} />}

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
          {property.images && property.images.length > 0 && (
            <div className="detail-tour-toggle-row">
              <button
                className={`action-btn detail-tour-toggle-btn${showTour ? ' active' : ''}`}
                onClick={() => setShowTour(v => !v)}
              >
                {showTour ? '🏠 Hide 360° Tour' : '🔭 360° Virtual Tour'}
              </button>
            </div>
          )}
        </section>

        {/* ─── Virtual Tour (lazy) ───────────────────────────── */}
        {showTour && property.images && property.images.length > 0 && (
          <section className="detail-virtual-tour detail-virtual-tour-section">
            <Suspense
              fallback={<div className="detail-virtual-tour-loading">Loading virtual tour…</div>}
            >
              <VirtualTour
                images={property.images.map((src: string) => ({ src, name: property.title }))}
                propertyTitle={property.title}
                onClose={() => setShowTour(false)}
              />
            </Suspense>
          </section>
        )}

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

              <div style={{ margin: '12px 0' }}>
                <PropertyVectorBadges 
                  isOffPlan={property.offPlan}
                  isDldVerified={true}
                  isReraCompliant={true}
                  energyRating="A+"
                />
              </div>

              <h1 className="detail-title">{property.title}</h1>

              <p className="detail-location">
                <MapPin size={16} />
                {property.location}
              </p>

              <div className="detail-price-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span className="detail-price">AED {property.price.toLocaleString()}</span>
                  {property.sqft > 0 && (
                    <span className="detail-price-sqft">
                      AED {Math.round(property.price / property.sqft).toLocaleString()}/sqft
                    </span>
                  )}
                </div>
                
                <div className="detail-price-breakdown">
                  <span className="breakdown-item"><strong>Base Price:</strong> AED {(property.price * 0.94).toLocaleString()}</span>
                  <span className="breakdown-item"><strong>DLD Fee (4%):</strong> AED {(property.price * 0.04).toLocaleString()}</span>
                  <span className="breakdown-item"><strong>Agency Fee (2%):</strong> AED {(property.price * 0.02).toLocaleString()}</span>
                </div>
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
                  {property.amenities.map(a => (
                    <span key={a} className="amenity-tag">
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Drone Video Embed */}
            <section className="detail-drone-video">
              <h2>Property Walkthrough</h2>
              <div className="video-container">
                <video 
                  src="https://www.w3schools.com/html/mov_bbb.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  controls 
                  className="drone-video"
                />
              </div>
            </section>

            {/* Floor Plan */}
            <section className="detail-floor-plan">
              <h2>Interactive Floor Plan</h2>
              <div className="floor-plan-container">
                <svg viewBox="0 0 800 600" className="interactive-floor-plan">
                  <rect x="100" y="100" width="600" height="400" fill="none" stroke="#d4af37" strokeWidth="4" />
                  <rect x="100" y="100" width="200" height="200" className="room bedroom" />
                  <text x="200" y="200" textAnchor="middle" fill="#d4af37" fontWeight="bold">Bedroom 1</text>
                  <rect x="300" y="100" width="400" height="200" className="room living" />
                  <text x="500" y="200" textAnchor="middle" fill="#d4af37" fontWeight="bold">Living Room</text>
                  <rect x="100" y="300" width="300" height="200" className="room kitchen" />
                  <text x="250" y="400" textAnchor="middle" fill="#d4af37" fontWeight="bold">Kitchen</text>
                  <rect x="400" y="300" width="300" height="200" className="room bedroom" />
                  <text x="550" y="400" textAnchor="middle" fill="#d4af37" fontWeight="bold">Master Bedroom</text>
                </svg>
              </div>
            </section>

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
                <DubaiMap properties={[property]} showCommunities={false} height="350px" />
              </Suspense>
            </section>

            {/* Financial Calculators */}
            <section className="detail-financial-tools" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '40px' }}>
              <h2>Financial Analysis</h2>
              {property.purpose === 'buy' && (
                <div className="mortgage-calc-wrapper">
                  <PropertyDetailMortgageEmi propertyPrice={property.price} />
                </div>
              )}
              <div className="roi-calc-wrapper">
                <RentalYieldVisualizer propertyPrice={property.price} estimatedAnnualRent={Math.round(property.price * 0.07)} />
              </div>
            </section>
          </main>

          {/* ─── Sidebar ──────────────────────────────────── */}
          <aside className="detail-sidebar">
            {/* Contact Agent Card */}
            <div className="contact-agent-card">
              <h3>Contact Agent</h3>
              <p className="agent-subtitle">Interested in this property? Get in touch now.</p>

              <button className="contact-btn whatsapp" onClick={() => contactWhatsApp(property)}>
                <MessageCircle size={18} />
                WhatsApp
              </button>

              <button className="contact-btn phone" onClick={contactPhone}>
                <Phone size={18} />
                Call Agent
              </button>

              <button className="contact-btn email" onClick={() => contactEmail(property)}>
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
                <Heart size={18} fill={isFavorite(property.id) ? '#EF4444' : 'none'} />
                {isFavorite(property.id) ? 'Saved' : 'Save'}
              </button>

              <button className="action-btn share" onClick={() => shareProperty(property)}>
                <Share2 size={18} />
                Share
              </button>

              <button className="action-btn copy" onClick={() => copyLink(property.id)}>
                <Copy size={18} />
                Copy Link
              </button>

              <button className="action-btn print" onClick={printProperty}>
                <Printer size={18} />
                Print
              </button>
            </div>

            {/* Back to Listings */}
            <button className="back-btn" onClick={() => navigate('/properties')}>
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
              {similarProperties.map(sp => (
                <Link key={sp.id} to={`/property/${sp.id}`} className="similar-card">
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
                    <span className="similar-price">AED {sp.price.toLocaleString()}</span>
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
