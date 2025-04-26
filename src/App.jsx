
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

function App() {
  const [user, setUser] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
        <div className="property-grid">
          <div className="property-card">
            <div className="image-gallery">
              <div className="property-image"></div>
              <div className="gallery-nav">
                <div className="gallery-dot active"></div>
                <div className="gallery-dot"></div>
                <div className="gallery-dot"></div>
              </div>
            </div>
            <h3>Luxury Villa - Palm Jumeirah</h3>
            <p>5 Bed | 6 Bath | 8,000 sq ft</p>
            <p className="price">AED 15,000,000</p>
            <div className="property-amenities">
              <span className="amenity">🏊‍♂️ Pool</span>
              <span className="amenity">🚗 Parking</span>
              <span className="amenity">👮‍♂️ Security</span>
            </div>
            <button className="view-details">View Details</button>
          </div>
          <div className="property-card">
            <div className="property-image"></div>
            <h3>Downtown Penthouse</h3>
            <p>4 Bed | 5 Bath | 5,500 sq ft</p>
            <p className="price">AED 12,500,000</p>
          </div>
          <div className="property-card">
            <div className="property-image"></div>
            <h3>Emirates Hills Villa</h3>
            <p>6 Bed | 7 Bath | 10,000 sq ft</p>
            <p className="price">AED 25,000,000</p>
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
