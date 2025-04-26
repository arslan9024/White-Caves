
import { useState, useEffect } from 'react'
import './App.css'
import Auth from './components/Auth'
import { ThemeProvider, useTheme } from './context/ThemeContext'

function ThemeToggle() {
  const { isDark, setIsDark } = useTheme();
  return (
    <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
      {isDark ? '🌞' : '🌙'}
    </button>
  );
}

import MobileNav from './components/MobileNav';
import ContactForm from './components/ContactForm';
import PropertySearch from './components/PropertySearch';

function App() {
  const [user, setUser] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [properties] = useState([
    {
      id: 1,
      title: "Luxury Villa - Palm Jumeirah",
      beds: 5,
      baths: 6,
      sqft: 8000,
      price: 15000000,
      amenities: ["Pool", "Parking", "Security"],
      location: "Palm Jumeirah"
    },
    {
      id: 2,
      title: "Downtown Penthouse",
      beds: 4,
      baths: 5,
      sqft: 5500,
      price: 12500000,
      amenities: ["Gym", "Parking", "Concierge"],
      location: "Downtown Dubai"
    },
    {
      id: 3,
      title: "Emirates Hills Villa",
      beds: 6,
      baths: 7,
      sqft: 10000,
      price: 25000000,
      amenities: ["Pool", "Garden", "Security"],
      location: "Emirates Hills"
    }
  ]);
  const [filteredProperties, setFilteredProperties] = useState(properties);

  const handleSearch = (filters) => {
    const filtered = properties.filter(property => {
      const matchesSearch = filters.search === '' || 
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesMinPrice = !filters.minPrice || property.price >= parseInt(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || property.price <= parseInt(filters.maxPrice);
      const matchesBeds = filters.beds === 'any' || property.beds >= parseInt(filters.beds);

      return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesBeds;
    });
    setFilteredProperties(filtered);
  };

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/@me');
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    checkAuth();
  }, []);
  return (
    <div className="app">
      {!user ? (
        <div className="login-page">
          <h1>Welcome to White Caves</h1>
          <p>Please login to continue</p>
          <Auth onLogin={() => window.location.reload()} />
        </div>
      ) : (
        <>
          <header>
        <nav>
          <div className="logo">White Caves</div>
          <button className="hamburger" onClick={() => setMobileNavOpen(true)}>
            ☰
          </button>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#properties">Properties</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <section className="hero">
        <h1>Luxury Real Estate in Dubai</h1>
        <p>Discover Premium Properties with White Caves</p>
        <button className="cta-button">Explore Properties</button>
      </section>

      <section className="featured-properties">
        <h2>Featured Properties</h2>
        <PropertySearch onSearch={handleSearch} />
        <div className="property-grid">
          {filteredProperties.map(property => (
            <div className="property-card" key={property.id}>
            <div className="image-gallery">
              <div className="property-image"></div>
              <div className="gallery-nav">
                <div className="gallery-dot active"></div>
                <div className="gallery-dot"></div>
                <div className="gallery-dot"></div>
              </div>
            </div>
            <h3>{property.title}</h3>
            <p>{property.beds} Bed | {property.baths} Bath | {property.sqft.toLocaleString()} sq ft</p>
            <p className="price">AED {property.price.toLocaleString()}</p>
            <div className="property-amenities">
              {property.amenities.map((amenity, index) => (
                <span key={index} className="amenity">
                  {amenity === 'Pool' ? '🏊‍♂️' : 
                   amenity === 'Parking' ? '🚗' : 
                   amenity === 'Security' ? '👮‍♂️' : 
                   amenity === 'Gym' ? '💪' : 
                   amenity === 'Garden' ? '🌳' : 
                   amenity === 'Concierge' ? '👔' : '✨'} {amenity}
                </span>
              ))}
            </div>
            <button className="view-details">View Details</button>
          </div>
        </div>
      </section>

      <section className="contact">
        <h2>Contact Us</h2>
        <div className="contact-info">
          <p>Email: info@whitecaves.ae</p>
          <p>Phone: +971 4 XXX XXXX</p>
          <p>Address: Downtown Dubai, UAE</p>
        </div>
        <ContactForm />
      </section>

      <footer>
        <p>© 2024 White Caves Real Estate. All rights reserved.</p>
      </footer>
        </>
      )}
    </div>
  )
}

export default function AppWrapper() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
