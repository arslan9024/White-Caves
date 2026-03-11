import React, { FC, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { addToFavorites, removeFromFavorites, selectFavorites } from '../store/dashboardSlice';
import AppLayout from '../components/layout/AppLayout';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { PropertyImageSlider, PropertyDetailModal } from '../shared/components/property';
import { Search, SlidersHorizontal, Grid, List, MapPin, Bed, Bath, Maximize, X, ChevronDown } from 'lucide-react';
import './PropertiesPage.css';

interface PropertyType {
  id: number;
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

const SAMPLE_PROPERTIES: PropertyType[] = [
  {
    id: 1,
    title: "Beachfront Villa with Private Pool",
    location: "Palm Jumeirah",
    type: "Villa",
    purpose: "buy",
    beds: 6,
    baths: 7,
    sqft: 12000,
    price: 45000000,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    amenities: ["Pool", "Beach Access", "Parking", "Security", "Garden", "Gym"],
    featured: true,
    yearBuilt: 2022
  },
  {
    id: 2,
    title: "Burj Khalifa View Penthouse",
    location: "Downtown Dubai",
    type: "Penthouse",
    purpose: "buy",
    beds: 4,
    baths: 5,
    sqft: 6500,
    price: 35000000,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800"
    ],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    amenities: ["Gym", "Parking", "Concierge", "Pool", "Security"],
    featured: true,
    yearBuilt: 2021
  }
];

const PropertiesPage: FC<PropertiesPageProps> = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => selectFavorites(state));
  
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);

  const handleFavoriteToggle = useCallback((propertyId: number) => {
    const isFavorited = favorites.includes(propertyId);
    if (isFavorited) {
      dispatch(removeFromFavorites(propertyId));
    } else {
      dispatch(addToFavorites(propertyId));
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
            {SAMPLE_PROPERTIES.map(property => (
              <div
                key={property.id}
                className="property-item"
                onClick={() => setSelectedProperty(property)}
              >
                <div className="property-image">
                  <img src={property.image} alt={property.title} />
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
            isFavorited={favorites.includes(selectedProperty.id)}
            onFavoriteToggle={() => handleFavoriteToggle(selectedProperty.id)}
          />
        )}

        <Footer />
      </div>
    </AppLayout>
  );
};

export default PropertiesPage;
