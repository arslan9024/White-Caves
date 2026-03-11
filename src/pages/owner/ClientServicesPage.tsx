import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './ClientServicesPage.css';

interface Section {
  id: string;
  label: string;
}

interface ClientServicesPageProps {}

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const ClientServicesPage: FC<ClientServicesPageProps> = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.currentUser);
  const [activeSection, setActiveSection] = useState<string>('services');

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  const sections: Section[] = [
    { id: 'services', label: 'Our Services' },
    { id: 'secondary', label: 'Secondary Sales' },
    { id: 'offplan', label: 'Off-Plan Sales' },
    { id: 'leasing', label: 'Leasing Services' },
    { id: 'process', label: 'Our Process' }
  ];

  return (
    <div className="client-services-page no-sidebar">
      <div className="cs-container full-width">
        <header className="cs-header">
          <h1>White Caves Real Estate LLC</h1>
          <p className="cs-tagline">"Your Gateway to Dubai's Future"</p>
          <div className="cs-contact-info">
            <span>📍 Dubai, UAE</span>
            <span>📧 info@whitecaves.ae</span>
            <span>📱 +971 56 361 6136</span>
          </div>
        </header>

        <nav className="cs-navigation">
          {sections.map(section => (
            <button
              key={section.id}
              className={`cs-nav-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {activeSection === 'services' && (
          <div className="cs-content-section">
            <h2>Comprehensive Real Estate Solutions in Dubai</h2>
            <p className="cs-intro">
              At White Caves Real Estate, we specialize in connecting clients with their ideal properties across Dubai's dynamic real estate market. Whether you're looking to buy an established home, invest in a new development, or lease residential or commercial space, we provide expert guidance every step of the way.
            </p>

            <div className="cs-property-grid">
              <div className="cs-property-type">
                <h4>🏢 Secondary Sales</h4>
                <p>Ready-to-move properties with immediate ownership transfer</p>
              </div>
              <div className="cs-property-type">
                <h4>🏗️ Off-Plan Sales</h4>
                <p>Pre-construction projects with flexible payment plans</p>
              </div>
              <div className="cs-property-type">
                <h4>🔑 Leasing</h4>
                <p>Residential & commercial rentals across Dubai</p>
              </div>
            </div>

            <h3>Why Choose White Caves Real Estate?</h3>
            <div className="cs-stats-grid">
              <div className="cs-stat-card">
                <div className="cs-stat-label">Expert Market Knowledge</div>
                <div className="cs-stat-value">10+</div>
                <div className="cs-stat-label">Years Combined Experience</div>
              </div>
              <div className="cs-stat-card">
                <div className="cs-stat-label">Transparent Process</div>
                <div className="cs-stat-value">100%</div>
                <div className="cs-stat-label">Client Satisfaction Focus</div>
              </div>
              <div className="cs-stat-card">
                <div className="cs-stat-label">Technology-Enabled</div>
                <div className="cs-stat-value">24/7</div>
                <div className="cs-stat-label">Client Portal Access</div>
              </div>
            </div>

            <div className="cs-highlight-box">
              <h3>🌟 Our Commitment to You</h3>
              <ul>
                <li>Personalized property matching based on your goals</li>
                <li>Full transparency in pricing and processes</li>
                <li>Expert guidance through every transaction stage</li>
                <li>Post-purchase support and follow-up</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'secondary' && (
          <div className="cs-content-section">
            <h2>Secondary Sales - Ready-to-Move Properties</h2>
            <p>Find your perfect home among Dubai's most established and prestigious communities.</p>
          </div>
        )}

        {activeSection === 'offplan' && (
          <div className="cs-content-section">
            <h2>Off-Plan Sales - Future Investments</h2>
            <p>Secure your slice of Dubai's future with off-plan investment opportunities.</p>
          </div>
        )}

        {activeSection === 'leasing' && (
          <div className="cs-content-section">
            <h2>Leasing Services - Your Rental Home</h2>
            <p>From family apartments to luxury villas and commercial spaces.</p>
          </div>
        )}

        {activeSection === 'process' && (
          <div className="cs-content-section">
            <h2>Our Process - Simple & Transparent</h2>
            <p>How we help you achieve your real estate goals</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientServicesPage;
