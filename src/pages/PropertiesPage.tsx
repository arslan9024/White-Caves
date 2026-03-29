import React, { FC, useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { RootState, AppDispatch } from '../store/store';
import { addToFavorites, removeFromFavorites, selectFavorites } from '../store/dashboardSlice';
import { selectAllProperties, selectPropertiesLoading, fetchPropertiesFromAPI } from '../store/crmDataSlice';
import AppLayout from '../components/layout/AppLayout';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { PropertyImageSlider, PropertyDetailModal } from '../shared/components/property';
import { Search, SlidersHorizontal, Grid, List, MapPin, Bed, Bath, Maximize, X, ChevronDown } from 'lucide-react';
import './PropertiesPage.css';

interface PropertyType {
  id: string;
  title: string;
  location: string;
  type: string;
  purpose: 'buy' | 'rent';
  beds: number;
  baths: number;
  sqft: number;
  price: number;
  priceType?: string;
  images: string[];
  image: string;
  amenities: string[];
  featured: boolean;
  yearBuilt: number;
}

interface PropertiesPageProps {}

/** Default placeholder image when property has no images */
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800';

/** Map a CRM API property to the display format */
function mapApiProperty(p: Record<string, unknown>): PropertyType {
  const images = Array.isArray(p.images) && p.images.length > 0
    ? (p.images as string[])
    : [PLACEHOLDER_IMAGE];
  return {
    id: String(p.id || ''),
    // NOTE: Using string IDs to match MongoDB/Prisma ObjectId format
    title: String(p.title || 'Untitled Property'),
    location: String(p.location || p.area || 'Dubai'),
    type: String(p.type || 'Apartment'),
    purpose: (p.purpose as 'buy' | 'rent') || 'buy',
    beds: Number(p.bedrooms ?? p.beds ?? 0),
    baths: Number(p.bathrooms ?? p.baths ?? 0),
    sqft: Number(p.sqft ?? 0),
    price: Number(p.price ?? 0),
    priceType: p.priceType ? String(p.priceType) : undefined,
    images,
    image: images[0],
    amenities: Array.isArray(p.amenities) ? (p.amenities as string[]) : [],
    featured: Boolean(p.featured),
    yearBuilt: Number(p.yearBuilt ?? p.year_built ?? new Date().getFullYear()),
  };
}

const PropertiesPage: FC<PropertiesPageProps> = () => {
  useDocumentTitle('Properties');
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => selectFavorites(state));
  const apiProperties = useSelector(selectAllProperties) as Record<string, unknown>[];
  const loading = useSelector(selectPropertiesLoading);
  
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);

  // Fetch properties from API on mount
  useEffect(() => {
    const promise = dispatch(fetchPropertiesFromAPI({}));
    return () => { promise.abort?.(); };
  }, [dispatch]);

  // Map API properties to display format
  const properties = useMemo(
    () => apiProperties.map(mapApiProperty),
    [apiProperties]
  );

  // Filter by search term
  const filteredProperties = useMemo(() => {
    if (!searchTerm.trim()) return properties;
    const term = searchTerm.toLowerCase();
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.type.toLowerCase().includes(term)
    );
  }, [properties, searchTerm]);

  const handleFavoriteToggle = useCallback((property: PropertyType) => {
    const isFavorited = favorites.some(f => f.id === property.id);
    if (isFavorited) {
      dispatch(removeFromFavorites(property.id));
    } else {
      dispatch(addToFavorites({
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price.toLocaleString(),
        image: property.image,
      }));
    }
  }, [favorites, dispatch]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

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
            isFavorite={favorites.some(f => f.id === selectedProperty.id)}
            onFavorite={() => handleFavoriteToggle(selectedProperty)}
          />
        )}

        <Footer />
      </div>
    </AppLayout>
  );
};

export default PropertiesPage;
