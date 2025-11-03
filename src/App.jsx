import React, { useState, useEffect } from 'react'
import './App.css'
import Auth from './components/Auth'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useSelector, useDispatch } from 'react-redux';
import { setProperties } from './store/propertySlice';
import { setUser } from './store/userSlice';
import MobileNav from './components/MobileNav';
import ContactForm from './components/ContactForm';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import PropertySearch from './components/PropertySearch';
import PropertyMap from './components/PropertyMap';
import Services from './components/Services'; // Import Services component
import JobApplicants from './components/JobApplicants';
import WhatsAppButton from './components/WhatsAppButton';

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
        <>
          <header>
            <nav>
              <div className="logo">White Caves</div>
              <button className="hamburger" onClick={() => setMobileNavOpen(true)}>
                ☰
              </button>
              <div className="nav-links">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#services">Services</a>
                <a href="#laws">Dubai Laws</a>
                <a href="#contact">Contact</a>
                <ThemeToggle />
              </div>
            </nav>
          </header>
          <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

          <section className="hero" id="home">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">Luxury Real Estate in Dubai</h1>
              <p className="hero-subtitle">Discover Premium Properties with White Caves</p>
              <p className="hero-description">Experience unparalleled luxury living in Dubai's most prestigious locations</p>
              <Auth onLogin={() => window.location.reload()} />
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
              <p>White Caves is Dubai's premier luxury real estate agency, specializing in high-end properties across the emirate. With years of experience in the Dubai property market, we offer unparalleled expertise in buying, selling, and leasing premium residential and commercial properties.</p>
              
              <div className="company-features">
                <div className="feature">
                  <h3>🏆 Excellence</h3>
                  <p>Award-winning service with a track record of satisfied clients</p>
                </div>
                <div className="feature">
                  <h3>🌍 Global Reach</h3>
                  <p>International network connecting buyers and sellers worldwide</p>
                </div>
                <div className="feature">
                  <h3>💼 Professional Team</h3>
                  <p>Expert agents fluent in multiple languages</p>
                </div>
                <div className="feature">
                  <h3>🔒 Trust & Security</h3>
                  <p>Fully licensed and regulated by Dubai Land Department</p>
                </div>
              </div>
            </div>
          </section>

          <section className="services-info" id="services">
            <h2>Our Comprehensive Services</h2>
            <div className="services-grid">
              <div className="service-detail">
                <h3>For Buyers</h3>
                <ul>
                  <li><strong>Property Search:</strong> Personalized property matching based on your requirements</li>
                  <li><strong>Market Analysis:</strong> Detailed market insights and property valuations</li>
                  <li><strong>Viewing Arrangements:</strong> Scheduled property tours at your convenience</li>
                  <li><strong>Negotiation Support:</strong> Expert negotiation to secure the best deal</li>
                  <li><strong>Documentation:</strong> Complete assistance with Form B, title deeds, and transfer</li>
                  <li><strong>DEWA Registration:</strong> Utility connection and account setup</li>
                  <li><strong>Post-Purchase Support:</strong> Ongoing assistance after completion</li>
                </ul>
              </div>

              <div className="service-detail">
                <h3>For Sellers</h3>
                <ul>
                  <li><strong>Property Valuation:</strong> Accurate market-based pricing</li>
                  <li><strong>Marketing:</strong> Premium listings on major property portals</li>
                  <li><strong>Photography:</strong> Professional property photography and videography</li>
                  <li><strong>Buyer Screening:</strong> Pre-qualified buyer matching</li>
                  <li><strong>Form F Processing:</strong> Sales agreement documentation (requires 10% security cheque)</li>
                  <li><strong>Transaction Management:</strong> End-to-end sale coordination</li>
                </ul>
              </div>

              <div className="service-detail">
                <h3>For Tenants</h3>
                <ul>
                  <li><strong>Property Search:</strong> Find your ideal rental home</li>
                  <li><strong>Viewing Coordination:</strong> Multiple property viewings</li>
                  <li><strong>Lease Negotiation:</strong> Favorable rental terms</li>
                  <li><strong>EJARI Registration:</strong> Official tenancy contract registration</li>
                  <li><strong>DEWA Registration:</strong> Utility connection services</li>
                  <li><strong>Move-in Permit:</strong> Building access and key handover</li>
                  <li><strong>Renewal Services:</strong> Lease renewal assistance</li>
                </ul>
              </div>

              <div className="service-detail">
                <h3>For Landlords</h3>
                <ul>
                  <li><strong>Tenant Sourcing:</strong> Find reliable, verified tenants</li>
                  <li><strong>Property Management:</strong> Full-service property management</li>
                  <li><strong>Rent Collection:</strong> Timely rent collection services</li>
                  <li><strong>Maintenance Coordination:</strong> Property upkeep and repairs</li>
                  <li><strong>Legal Compliance:</strong> EJARI and all legal requirements</li>
                  <li><strong>Annual Inspections:</strong> Regular property condition reports</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="dubai-laws" id="laws">
            <h2>Dubai Real Estate Laws & Regulations</h2>
            <div className="laws-content">
              <div className="law-section">
                <h3>Dubai Land Department (DLD) Regulations</h3>
                <p>All real estate transactions in Dubai are governed by the Dubai Land Department. Key regulations include:</p>
                <ul>
                  <li><strong>Title Deed Registration:</strong> All property ownership must be registered with DLD</li>
                  <li><strong>Transfer Fees:</strong> 4% of property value (2% buyer, 2% seller) plus administrative fees</li>
                  <li><strong>Trustee Registration:</strong> All real estate agencies must be registered with RERA (Real Estate Regulatory Agency)</li>
                  <li><strong>Agent Licensing:</strong> All agents must hold valid RERA licenses</li>
                </ul>
              </div>

              <div className="law-section">
                <h3>EJARI System</h3>
                <p>EJARI is the mandatory tenancy contract registration system in Dubai:</p>
                <ul>
                  <li>All rental contracts must be registered within 90 days of signing</li>
                  <li>Required for DEWA connection, visa applications, and legal protection</li>
                  <li>Registration fee: AED 220 (including knowledge fee and innovation fee)</li>
                  <li>Protects both landlord and tenant rights under Dubai rental laws</li>
                </ul>
              </div>

              <div className="law-section">
                <h3>Rental Laws</h3>
                <ul>
                  <li><strong>Rent Increases:</strong> Regulated by RERA Rental Index (Decree No. 43 of 2013)</li>
                  <li><strong>Security Deposit:</strong> Typically 5% of annual rent (up to 10% for furnished properties)</li>
                  <li><strong>Payment Terms:</strong> Usually 1-4 cheques per year</li>
                  <li><strong>Notice Period:</strong> 90 days for contract termination or non-renewal</li>
                  <li><strong>Eviction:</strong> Only permitted through legal channels with valid reasons</li>
                </ul>
              </div>

              <div className="law-section">
                <h3>Property Ownership Laws</h3>
                <ul>
                  <li><strong>Freehold Areas:</strong> Foreign nationals can own property in designated freehold areas</li>
                  <li><strong>Leasehold:</strong> 99-year leases available in certain areas</li>
                  <li><strong>Off-Plan Properties:</strong> Protected under Escrow Account Law (Law No. 8 of 2007)</li>
                  <li><strong>Developer Regulations:</strong> All developers must register with RERA</li>
                  <li><strong>Mortgage Laws:</strong> Maximum 75% LTV for first-time buyers (UAE nationals), 80% for expats on ready properties</li>
                </ul>
              </div>

              <div className="law-section">
                <h3>Form Requirements</h3>
                <ul>
                  <li><strong>Form A:</strong> Memorandum of Understanding for off-plan purchases</li>
                  <li><strong>Form B:</strong> Sale agreement for ready properties (requires payment)</li>
                  <li><strong>Form F:</strong> Final sales contract (requires original 10% security cheque)</li>
                  <li><strong>NOC:</strong> No Objection Certificate from developer for resales</li>
                </ul>
              </div>

              <div className="law-section">
                <h3>Service Charges & Fees</h3>
                <ul>
                  <li><strong>Agency Commission:</strong> Typically 2% of transaction value + 5% VAT</li>
                  <li><strong>Trustee Office Fee:</strong> AED 420 for property registration</li>
                  <li><strong>Mortgage Registration:</strong> 0.25% of loan amount + AED 290</li>
                  <li><strong>DEWA Deposit:</strong> AED 2,000 for apartments, AED 4,000 for villas</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="contact" id="contact">
            <ContactUs />
            <ContactForm />
          </section>

          <Footer />
          <WhatsAppButton />
        </>
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

      <section className="job-applicants-section">
        <JobApplicants />
      </section>

      <section className="featured-properties">
        <h2>Featured Properties</h2>
        <PropertySearch onSearch={handleSearch} />
        <FeaturedAgents />
        <div className="property-grid">
          {filteredProperties.map(property => (
            <div key={property.id} className="property-card" id={`property-${property.id}`}>
              <div className="image-gallery">
                <div 
                  className="property-image" 
                  style={{backgroundImage: `url(${property.images?.[0] || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'})`}}
                ></div>
                {property.images && (
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
                )}
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
              </div>
              <div className="property-amenities">
                {property.amenities?.map((amenity, index) => (
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
          ))}
        </div>
      </section>

      <section className="contact">
        <ContactUs />
        <ContactForm />
      </section>

      <Footer />
      <WhatsAppButton />
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