import React, { FC } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePropertyBrowser } from '../hooks/usePropertyBrowser';
import AppLayout from '../components/layout/AppLayout';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { PropertyImageSlider, PropertyDetailModal } from '../shared/components/property';
import { Search, SlidersHorizontal, Grid, List, MapPin, Bed, Bath, Maximize, X, ChevronDown } from 'lucide-react';
import './PropertiesPage.css';

interface PropertiesPageProps {}

const PropertiesPage: FC<PropertiesPageProps> = () => {
  useDocumentTitle('Properties');
  const {
    loading,
    favorites,
    view,
    setView,
    searchTerm,
    handleSearchChange,
    filteredProperties,
    selectedProperty,
    setSelectedProperty,
    handleFavoriteToggle,
    isFavorite,
  } = usePropertyBrowser();

  return (
    <AppLayout>
      <div className="properties-page">
        <section className="properties-hero">
          <h1>Find Your Dream Property</h1>
          <p>Browse our exclusive collection of properties across Dubai</p>
        </section>

        <section className="properties-content">
          <div className="filter-section">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search properties by location, type, or price..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
            >
              <Grid size={20} />
            </button>
            <button
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <List size={20} />
            </button>
          </div>

          <div className={`properties-grid ${view}`}>
            {loading && (
              <div className="properties-loading" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem' }}>
                <p style={{ fontSize: '1.1rem', color: '#555' }}>⏳ Loading properties...</p>
              </div>
            )}
            {!loading && filteredProperties.length === 0 && (
              <div className="properties-empty" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem' }}>
                <p style={{ fontSize: '1.5rem' }}>🏠</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333' }}>No Properties Found</p>
                <p style={{ fontSize: '0.9rem', color: '#888' }}>
                  {searchTerm ? 'Try adjusting your search terms.' : 'Properties will appear here once they are listed.'}
                </p>
              </div>
            )}
            {filteredProperties.map(property => (
              <div
                key={property.id}
                className="property-item"
                onClick={() => setSelectedProperty(property)}
              >
                <div className="property-image">
                  <img src={property.image} alt={property.title} loading="lazy" width={400} height={260} />
                </div>
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p className="location">
                    <MapPin size={16} /> {property.location}
                  </p>
                  <div className="property-specs">
                    <span><Bed size={16} /> {property.beds} Beds</span>
                    <span><Bath size={16} /> {property.baths} Baths</span>
                    <span><Maximize size={16} /> {property.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

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
