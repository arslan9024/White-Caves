import React, { FC, lazy, Suspense } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePropertyBrowser } from '../hooks/usePropertyBrowser';
import AppLayout from '../components/layout/AppLayout';
import Footer from '../components/Footer';
import PropertyFilterPanel from './properties/PropertyFilterPanel';
import { PropertyDetailModal } from '../shared/components/property';
import { Link } from 'react-router-dom';
import {
  Grid, List, Map as MapIcon, MapPin, Bed, Bath, Maximize, Heart, Share2, ChevronRight,
} from 'lucide-react';
import { createLogger } from '../utils/logger';
import SEOHead from '../components/SEOHead';
import 'leaflet/dist/leaflet.css';

const log = createLogger('PropertiesPage');
import './PropertiesPage.css';

const InteractiveMap = lazy(() =>
  import('../components/maps/InteractiveMap').then((m) => ({ default: m.default }))
);

const PropertiesPage: FC = () => {
  useDocumentTitle('Properties');
  const {
    loading,
    view,
    setView,
    properties,
    filteredProperties,
    selectedProperty,
    setSelectedProperty,
    handleFavoriteToggle,
    isFavorite,
  } = usePropertyBrowser();

  return (
    <AppLayout>
      <SEOHead
        title="Properties for Sale & Rent in Dubai"
        description="Browse luxury apartments, villas, and penthouses for sale and rent in Dubai. Advanced search with map view. Filter by area, price, bedrooms, and amenities."
        canonical="/properties"
        keywords={['properties for sale Dubai', 'apartments for rent Dubai', 'luxury villas Dubai', 'Dubai real estate listings']}
      />
      <div className="properties-page">
        {/* ─── Hero Banner ──────────────────────────────────── */}
        <section className="properties-hero">
          <div className="properties-hero-overlay" />
          <div className="properties-hero-content">
            <h1>Discover Luxury Properties</h1>
            <p>Browse our exclusive collection of premium properties across Dubai</p>
          </div>
        </section>

        {/* ─── Filter Panel ─────────────────────────────────── */}
        <PropertyFilterPanel
          resultCount={filteredProperties.length}
          totalCount={properties.length}
        />

        {/* ─── Content ──────────────────────────────────────── */}
        <section className="properties-container">
          {/* View toggle */}
          <div className="results-header">
            <div className="results-controls">
              <div className="view-toggle">
                <button
                  className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`view-btn ${view === 'list' ? 'active' : ''}`}
                  onClick={() => setView('list')}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
                <button
                  className={`view-btn ${view === 'map' ? 'active' : ''}`}
                  onClick={() => setView('map')}
                  aria-label="Map view"
                >
                  <MapIcon size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Map View */}
          {view === 'map' && (
            <div className="properties-map-section">
              <Suspense fallback={<div className="map-loading-fallback"><p>Loading map...</p></div>}>
                <InteractiveMap
                  properties={filteredProperties}
                  onPropertyClick={(p) => setSelectedProperty(p as typeof selectedProperty)}
                />
              </Suspense>
            </div>
          )}

          {/* Property Grid */}
          <div className={`properties-grid ${view}`} style={view === 'map' ? { display: 'none' } : undefined}>
            {loading && (
              <div className="properties-loading" style={{ gridColumn: '1 / -1' }}>
                <div className="loading-spinner" />
                <p>Loading properties...</p>
              </div>
            )}

            {!loading && filteredProperties.length === 0 && (
              <div className="no-results" style={{ gridColumn: '1 / -1' }}>
                <div className="no-results-content">
                  <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏠</p>
                  <h3>No Properties Found</h3>
                  <p>Try adjusting your filters or search criteria.</p>
                </div>
              </div>
            )}

            {filteredProperties.map((property) => (
              <article
                key={property.id}
                className="property-card-enhanced"
                onClick={() => setSelectedProperty(property)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSelectedProperty(property);
                }}
                role="button"
                aria-label={`View ${property.title}`}
              >
                {/* Card Image */}
                <div className="card-image-wrapper">
                  <img
                    src={property.image}
                    alt={property.title}
                    loading="lazy"
                    width={400}
                    height={260}
                    className="card-main-image"
                  />
                  <div className="card-badges">
                    {property.featured && (
                      <span className="badge featured">Featured</span>
                    )}
                    <span className={`badge purpose ${property.purpose}`}>
                      {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                  <button
                    className={`card-fav-btn ${isFavorite(property.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteToggle(property);
                    }}
                    aria-label={
                      isFavorite(property.id)
                        ? 'Remove from favorites'
                        : 'Add to favorites'
                    }
                  >
                    <Heart
                      size={18}
                      fill={isFavorite(property.id) ? '#DC2626' : 'none'}
                      stroke={isFavorite(property.id) ? '#DC2626' : 'white'}
                    />
                  </button>
                </div>

                {/* Card Content */}
                <div className="card-content">
                  <span className="card-type">{property.type}</span>
                  <h3 className="card-title">{property.title}</h3>
                  <p className="card-location">
                    <MapPin size={14} />
                    {property.location}
                  </p>

                  <div className="card-specs">
                    <span><Bed size={14} /> {property.beds} Beds</span>
                    <span><Bath size={14} /> {property.baths} Baths</span>
                    <span><Maximize size={14} /> {property.sqft.toLocaleString()} sqft</span>
                  </div>

                  {property.amenities.length > 0 && (
                    <div className="card-amenities">
                      {property.amenities.slice(0, 3).map((a) => (
                        <span key={a} className="amenity-chip">{a}</span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="amenity-chip more">
                          +{property.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="card-footer">
                    <span className="card-price">
                      AED {property.price.toLocaleString()}
                    </span>
                    <div className="card-footer-actions">
                      <button
                        className="card-share-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `${window.location.origin}/property/${property.id}`;
                          if (navigator.share) {
                            navigator.share({ title: property.title, url }).catch(e => log.warn('Share failed:', e));
                          } else {
                            navigator.clipboard.writeText(url).catch(e => log.warn('Clipboard write failed:', e));
                          }
                        }}
                        aria-label="Share property"
                      >
                        <Share2 size={14} />
                      </button>
                      <Link
                        to={`/property/${property.id}`}
                        className="view-details-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Details <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── Detail Modal ─────────────────────────────────── */}
        {selectedProperty && (
          <PropertyDetailModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            isFavorite={isFavorite(selectedProperty.id)}
            onFavorite={() => handleFavoriteToggle(selectedProperty)}
          />
        )}

        <Footer />
      </div>
    </AppLayout>
  );
};

export default PropertiesPage;
