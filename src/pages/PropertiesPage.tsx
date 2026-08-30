import React, { FC, lazy, Suspense } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePropertyBrowser } from '../hooks/usePropertyBrowser';
import { useSearchParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import PageHeroBanner from '../components/layout/PageHeroBanner';
import PageMeta from '../components/seo/PageMeta';
import PropertyFilterPanel from './properties/PropertyFilterPanel';
import { PropertyDetailModal, LuxuryPropertyCard } from '../shared/components/property';
import { Link } from 'react-router-dom';
import {
  Grid,
  List,
  Map as MapIcon,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  Share2,
  ChevronRight,
} from 'lucide-react';
import { createLogger } from '../utils/logger';
import 'leaflet/dist/leaflet.css';

const log = createLogger('PropertiesPage');
import './PropertiesPage.css';

const InteractiveMap = lazy(() =>
  import('../components/maps/InteractiveMap').then(m => ({ default: m.default }))
);

const PropertiesPage: FC = () => {
  // TASK-020 / Phase 27: Dynamic SEO based on homepage search params
  const [searchParams] = useSearchParams();
  const seoLocation = searchParams.get('location');
  const seoType = searchParams.get('type');
  const seoMode = searchParams.get('mode') ?? 'buy';
  const seoBeds = searchParams.get('beds');

  // Build dynamic page title: "2BR Apartments for Sale in Downtown Dubai | White Caves"
  const titleParts: string[] = [];
  if (seoBeds) titleParts.push(`${seoBeds}BR`);
  if (seoType) titleParts.push(seoType);
  titleParts.push(seoMode === 'rent' ? 'for Rent' : 'for Sale');
  if (seoLocation) titleParts.push(`in ${seoLocation}`);
  const dynamicTitle =
    titleParts.length > 2
      ? titleParts.join(' ')
      : `Properties ${seoMode === 'rent' ? 'for Rent' : 'for Sale'} in Dubai`;

  useDocumentTitle(dynamicTitle);

  const descParts: string[] = ['Browse Dubai luxury'];
  if (seoBeds) descParts.push(`${seoBeds}-bedroom`);
  if (seoType) descParts.push(seoType.toLowerCase());
  descParts.push('properties');
  if (seoMode === 'rent') descParts.push('for rent');
  else descParts.push('for sale');
  if (seoLocation) descParts.push(`in ${seoLocation}`);
  descParts.push('with White Caves Real Estate. View verified listings, floor plans & pricing.');
  const dynamicDescription = descParts.join(' ');

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
    <PublicLayout>
      <div className="properties-page dubai-luxury-theme">
        <PageMeta
          title={`${dynamicTitle} | White Caves Real Estate`}
          description={dynamicDescription}
          canonicalPath="/properties"
          ogType="website"
        />

        {/* ─── Hero Banner ──────────────────────────────────── */}
        <PageHeroBanner
          badge="Luxury Collection"
          title="Discover Luxury Properties"
          subtitle="Browse our exclusive collection of premium properties across Dubai's most prestigious communities"
          theme="dark"
          breadcrumbs={[{ label: 'Properties' }]}
          stat={{ value: '500+', label: 'Properties' }}
        />

        {/* ─── Content Section ─────────────────────────────── */}
        <section className="properties-content-section">
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
                <Suspense
                  fallback={
                    <div className="map-loading-fallback">
                      <p>Loading map...</p>
                    </div>
                  }
                >
                  <InteractiveMap
                    properties={filteredProperties}
                    onPropertyClick={p => setSelectedProperty(p as typeof selectedProperty)}
                  />
                </Suspense>
              </div>
            )}

            {/* Property Grid */}
            <div
              className={`properties-grid ${view}`}
              style={view === 'map' ? { display: 'none' } : undefined}
            >
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

              {filteredProperties.map(property => (
                <LuxuryPropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={isFavorite(property.id)}
                  onFavoriteToggle={() => handleFavoriteToggle(property)}
                  onClick={() => setSelectedProperty(property)}
                />
              ))}

            </div>
          </section>
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
      </div>
    </PublicLayout>
  );
};

export default PropertiesPage;
