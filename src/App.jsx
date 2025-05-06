import { useState, useEffect } from 'react'
import './App.css'
import Auth from './components/Auth'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useSelector, useDispatch } from 'react-redux';
import { setProperties } from './store/propertySlice';
import { setUser } from './store/userSlice';
import MobileNav from './components/MobileNav';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import PropertySearch from './components/PropertySearch';
import PropertyMap from './components/PropertyMap';
import Services from './components/Services'; // Import Services component

function ThemeToggle() {
  const { isDark, setIsDark } = useTheme();
  return (
    <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
      {isDark ? '🌞' : '🌙'}
    </button>
  );
}


function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const filteredProperties = useSelector(state => state.properties.filteredProperties);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    dispatch(setProperties([
      {
        id: 1,
        title: "Luxury Villa - Palm Jumeirah",
        beds: 5,
        baths: 6,
        sqft: 8000,
        price: 15000000,
        amenities: ["Pool", "Parking", "Security"],
        location: "Palm Jumeirah",
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        ]
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
    ]));
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/@me');
        const userData = await response.json();
        dispatch(setUser(userData));
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    checkAuth();
  }, [dispatch]);
  const handleSearch = (filters) => {
    const filtered = filteredProperties.filter(property => {
      const matchesSearch = !filters.search || 
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.search.toLowerCase());

      const matchesMinPrice = !filters.minPrice || property.price >= parseInt(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || property.price <= parseInt(filters.maxPrice);
      const matchesBeds = filters.beds === 'any' || property.beds >= parseInt(filters.beds);
      const matchesLocation = !filters.location || 
        property.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesMinSqft = !filters.minSqft || property.sqft >= parseInt(filters.minSqft);
      const matchesMaxSqft = !filters.maxSqft || property.sqft <= parseInt(filters.maxSqft);
      const matchesAmenities = filters.amenities.length === 0 || 
        filters.amenities.every(amenity => property.amenities.includes(amenity));

      return matchesSearch && matchesMinPrice && matchesMaxPrice && 
             matchesBeds && matchesLocation && matchesMinSqft && 
             matchesMaxSqft && matchesAmenities;
    });
    dispatch(setProperties(filtered));
  };

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
      <Services /> {/* Added Services component */}

      <section className="featured-properties">
        <h2>Featured Properties</h2>
        <PropertySearch onSearch={handleSearch} />
        <FeaturedAgents />
        <div className="property-grid">
          {filteredProperties.map(property => (
            <React.Fragment key={property.id}>
              <div className="property-card" id={`property-${property.id}`}>
              <div className="image-gallery">
              <div 
                className="property-image" 
                style={{backgroundImage: `url(${property.images[0]})`}}
              ></div>
              <div className="gallery-nav">
                {property.images.map((_, index) => (
                  <div 
                    key={index} 
                    className={`gallery-dot ${index === 0 ? 'active' : ''}`}
                    onClick={() => {
                      const image = document.querySelector(`#property-${property.id} .property-image`);
                      image.style.backgroundImage = `url(${property.images[index]})`;
                      document.querySelectorAll(`#property-${property.id} .gallery-dot`).forEach(dot => dot.classList.remove('active'));
                      document.querySelectorAll(`#property-${property.id} .gallery-dot`)[index].classList.add('active');
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <h3>{property.title}</h3>
            <div className="property-stats">
              <div className="stat">
                <span className="stat-icon">🛏️</span>
                <span className="stat-value">{property.beds} Beds</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🚿</span>
                <span className="stat-value">{property.baths} Baths</span>
              </div>
              <div className="stat">
                <span className="stat-icon">📏</span>
                <span className="stat-value">{property.sqft.toLocaleString()} sq.ft</span>
              </div>
            </div>
            <div className="property-price">
              <span className="currency">AED</span>
              <span className="amount">{property.price.toLocaleString()}</span>
            </div>q ft</p>
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
            <div className="property-map">
              <PropertyMap location={property.location} />
            </div>
            <button className="view-details">View Details</button>
          </div>
          </React.Fragment>
        ))}
        </div>
      </section>

      <section className="contact">
        <ContactUs />
        <ContactForm />
      </section>

      <Footer />
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

// Redux store files (propertySlice.js and userSlice.js) need to be created separately.  Example below

//propertySlice.js
import { createSlice } from '@reduxjs/toolkit';

const propertySlice = createSlice({
  name: 'properties',
  initialState: {
    filteredProperties: []
  },
  reducers: {
    setProperties: (state, action) => {
      state.filteredProperties = action.payload;
    }
  }
});

export const { setProperties } = propertySlice.actions;
export default propertySlice.reducer;


//userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    }
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;


//index.js (or similar entry point for your redux store)
import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './store/propertySlice';
import userReducer from './store/userSlice';

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    user: userReducer
  }
});