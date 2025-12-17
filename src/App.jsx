import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/design-system.css'
import Auth from './components/Auth'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useSelector, useDispatch } from 'react-redux';
import { setProperties } from './store/propertySlice';
import { setUser } from './store/userSlice';
import MegaNav from './components/MegaNav';
import MobileNav from './components/MobileNav';
import ContactForm from './components/ContactForm';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import AdvancedSearch from './components/AdvancedSearch';
import PropertyMap from './components/PropertyMap';
import Services from './components/Services';
import JobApplicants from './components/JobApplicants';
import WhatsAppButton from './components/WhatsAppButton';
import FeaturedAgents from './components/FeaturedAgents';
import MortgageCalculator from './components/MortgageCalculator';
import RecentlyViewed, { useRecentlyViewed } from './components/RecentlyViewed';
import InteractiveMap from './components/InteractiveMap';
import PropertyComparison from './components/PropertyComparison';
import ImageGallery from './components/ImageGallery';
import BlogSection from './components/BlogSection';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import NewsletterSubscription from './components/NewsletterSubscription';
import AdminDashboard from './components/AdminDashboard';
import RoleGateway from './components/RoleGateway';

import BuyerDashboardPage from './pages/buyer/BuyerDashboardPage';
import MortgageCalculatorPage from './pages/buyer/MortgageCalculatorPage';
import DLDFeesPage from './pages/buyer/DLDFeesPage';
import TitleDeedRegistrationPage from './pages/buyer/TitleDeedRegistrationPage';
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import PricingToolsPage from './pages/seller/PricingToolsPage';
import LandlordDashboardPage from './pages/landlord/LandlordDashboardPage';
import RentalManagementPage from './pages/landlord/RentalManagementPage';
import LeasingAgentDashboardPage from './pages/leasing-agent/LeasingAgentDashboardPage';
import TenantScreeningPage from './pages/leasing-agent/TenantScreeningPage';
import SalesAgentDashboardPage from './pages/secondary-sales-agent/SalesAgentDashboardPage';
import SalesPipelinePage from './pages/secondary-sales-agent/SalesPipelinePage';

function HomePage({ onLogin }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { recentIds, addToRecent, clearRecent } = useRecentlyViewed();

  const handlePropertyClick = (propertyId) => {
    addToRecent(propertyId);
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    dispatch(setProperties([
      {
        id: 1,
        title: "Beachfront Villa with Private Pool - Palm Jumeirah",
        beds: 6,
        baths: 7,
        sqft: 12000,
        price: 45000000,
        amenities: ["Pool", "Beach Access", "Parking", "Security", "Garden", "Gym"],
        location: "Palm Jumeirah",
        type: "Villa",
        description: "Stunning beachfront villa on the prestigious Palm Jumeirah fronds with panoramic views of the Arabian Gulf."
      },
      {
        id: 2,
        title: "Burj Khalifa View Penthouse - Downtown Dubai",
        beds: 4,
        baths: 5,
        sqft: 6500,
        price: 35000000,
        amenities: ["Gym", "Parking", "Concierge", "Pool", "Security"],
        location: "Downtown Dubai",
        type: "Penthouse",
        description: "Ultra-luxury penthouse with breathtaking views of Burj Khalifa and Dubai Fountain."
      },
      {
        id: 3,
        title: "Mediterranean Style Mansion - Emirates Hills",
        beds: 7,
        baths: 9,
        sqft: 15000,
        price: 65000000,
        amenities: ["Pool", "Garden", "Security", "Parking", "Gym", "Cinema"],
        location: "Emirates Hills",
        type: "Villa",
        description: "Magnificent Mediterranean-inspired mansion on the prestigious Emirates Hills golf course."
      },
      {
        id: 4,
        title: "Waterfront Apartment - Dubai Marina",
        beds: 3,
        baths: 4,
        sqft: 3200,
        price: 8500000,
        amenities: ["Pool", "Gym", "Parking", "Concierge", "Security"],
        location: "Dubai Marina",
        type: "Apartment",
        description: "Elegant waterfront apartment with stunning marina views."
      },
      {
        id: 5,
        title: "Modern Villa with Golf Course Views - Arabian Ranches",
        beds: 5,
        baths: 6,
        sqft: 8500,
        price: 18000000,
        amenities: ["Pool", "Garden", "Parking", "Security"],
        location: "Arabian Ranches",
        type: "Villa",
        description: "Contemporary villa overlooking the championship golf course in Arabian Ranches."
      },
      {
        id: 6,
        title: "Luxury Townhouse - Jumeirah Village Circle",
        beds: 4,
        baths: 5,
        sqft: 4500,
        price: 6500000,
        amenities: ["Pool", "Parking", "Garden", "Security"],
        location: "Jumeirah Village Circle",
        type: "Townhouse",
        description: "Spacious townhouse in the heart of JVC."
      }
    ]));
  }, [dispatch]);

  return (
    <div className="app">
      <MegaNav user={user} onLogin={() => setShowAuthModal(true)} />

      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>
              &times;
            </button>
            <Auth onLogin={() => {
              setShowAuthModal(false);
              window.location.reload();
            }} />
          </div>
        </div>
      )}

      <section className="hero" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title animate-fadeInUp">Luxury Real Estate in Dubai</h1>
          <p className="hero-subtitle animate-fadeInUp animate-delay-100">Discover Premium Properties with White Caves</p>
          <p className="hero-description animate-fadeInUp animate-delay-200">Experience unparalleled luxury living in Dubai's most prestigious locations</p>
          <button className="btn btn-primary btn-lg animate-fadeInUp animate-delay-300" onClick={() => setShowAuthModal(true)}>
            Get Started
          </button>
          <div className="hero-stats">
            <div className="stat-item">
              <h3>500+</h3>
              <p>Premium Properties</p>
            </div>
            <div className="stat-item">
              <h3>1000+</h3>
              <p>Happy Clients</p>
            </div>
            <div className="stat-item">
              <h3>15+</h3>
              <p>Years Experience</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Expert Agents</p>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section" id="map">
        <InteractiveMap onPropertySelect={(property) => handlePropertyClick(property.id)} />
      </section>

      <section className="comparison-section" id="compare">
        <PropertyComparison />
      </section>
      
      <section className="featured-locations">
        <h2>Explore Dubai's Premier Locations</h2>
        <p className="section-subtitle">From Palm Jumeirah to Downtown Dubai</p>
        <div className="locations-grid">
          <div className="location-card" style={{backgroundImage: "url(https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)"}}>
            <div className="location-overlay">
              <h3>Palm Jumeirah</h3>
              <p>Iconic waterfront villas</p>
            </div>
          </div>
          <div className="location-card" style={{backgroundImage: "url(https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)"}}>
            <div className="location-overlay">
              <h3>Downtown Dubai</h3>
              <p>Luxury apartments & penthouses</p>
            </div>
          </div>
          <div className="location-card" style={{backgroundImage: "url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)"}}>
            <div className="location-overlay">
              <h3>Emirates Hills</h3>
              <p>Exclusive golf course villas</p>
            </div>
          </div>
          <div className="location-card" style={{backgroundImage: "url(https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)"}}>
            <div className="location-overlay">
              <h3>Dubai Marina</h3>
              <p>Waterfront living redefined</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-content">
          <h2>About White Caves Real Estate</h2>
          <p>White Caves is Dubai's premier luxury real estate agency, specializing in high-end properties across the emirate.</p>
          
          <div className="company-features">
            <div className="feature">
              <h3>Excellence</h3>
              <p>Award-winning service with a track record of satisfied clients</p>
            </div>
            <div className="feature">
              <h3>Global Reach</h3>
              <p>International network connecting buyers and sellers worldwide</p>
            </div>
            <div className="feature">
              <h3>Professional Team</h3>
              <p>Expert agents fluent in multiple languages</p>
            </div>
            <div className="feature">
              <h3>Trust & Security</h3>
              <p>Fully licensed and regulated by Dubai Land Department</p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsCarousel />
      <BlogSection />
      <NewsletterSubscription />
      <ContactUs />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/@me');
        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
          const userData = await response.json();
          dispatch(setUser(userData));
        }
      } catch (error) {
      }
    };
    checkAuth();
  }, [dispatch]);

  const handleRoleSelect = (role) => {
    localStorage.setItem('userRole', JSON.stringify({
      role,
      selectedAt: new Date().toISOString(),
      locked: true
    }));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/select-role" element={<RoleGateway user={user} onRoleSelect={handleRoleSelect} />} />
        
        <Route path="/buyer/dashboard" element={<BuyerDashboardPage />} />
        <Route path="/buyer/mortgage-calculator" element={<MortgageCalculatorPage />} />
        <Route path="/buyer/dld-fees" element={<DLDFeesPage />} />
        <Route path="/buyer/title-deed-registration" element={<TitleDeedRegistrationPage />} />
        
        <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
        <Route path="/seller/pricing-tools" element={<PricingToolsPage />} />
        
        <Route path="/landlord/dashboard" element={<LandlordDashboardPage />} />
        <Route path="/landlord/rental-management" element={<RentalManagementPage />} />
        
        <Route path="/leasing-agent/dashboard" element={<LeasingAgentDashboardPage />} />
        <Route path="/leasing-agent/tenant-screening" element={<TenantScreeningPage />} />
        
        <Route path="/secondary-sales-agent/dashboard" element={<SalesAgentDashboardPage />} />
        <Route path="/secondary-sales-agent/sales-pipeline" element={<SalesPipelinePage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
