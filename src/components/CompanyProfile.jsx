import React, { useCallback } from 'react';
import './CompanyProfile.css';

export default function CompanyProfile() {
  const handleDownloadPDF = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    const baseUrl = import.meta.env.BASE_URL || '/';
    const pdfUrl = `${baseUrl}White-Caves-Company-Profile.pdf`.replace('//', '/');
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'White-Caves-Company-Profile.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <section className="company-profile-section" id="company-profile">
      <div className="company-profile-container">
        <div className="company-profile-header">
          <img src={`${import.meta.env.BASE_URL || '/'}company-logo.jpg`} alt="White Caves Real Estate" className="company-logo-large" />
          <div className="company-profile-title">
            <h2>White Caves Real Estate LLC</h2>
            <p className="company-tagline">Dubai's Premier Luxury Property Partner</p>
          </div>
        </div>

        <div className="company-profile-grid">
          <div className="profile-card">
            <div className="profile-card-icon">🏢</div>
            <h3>Who We Are</h3>
            <p>White Caves Real Estate is a leading Dubai-based real estate agency specializing in luxury residential and commercial properties across the UAE. With over 15 years of experience, we've built a reputation for excellence, integrity, and exceptional client service.</p>
          </div>

          <div className="profile-card">
            <div className="profile-card-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>To provide unparalleled real estate services that exceed expectations, connecting discerning clients with their dream properties while ensuring transparent, efficient, and personalized transactions.</p>
          </div>

          <div className="profile-card">
            <div className="profile-card-icon">🌟</div>
            <h3>Our Vision</h3>
            <p>To be the most trusted and innovative real estate company in the UAE, setting industry standards for customer satisfaction, technological advancement, and sustainable business practices.</p>
          </div>

          <div className="profile-card">
            <div className="profile-card-icon">📋</div>
            <h3>RERA Licensed</h3>
            <p>Fully licensed and regulated by the Real Estate Regulatory Agency (RERA) and Dubai Land Department (DLD), ensuring complete compliance with UAE real estate laws and regulations.</p>
          </div>
        </div>

        <div className="company-services-overview">
          <h3>Our Services</h3>
          <div className="services-list">
            <div className="service-item">
              <span className="service-icon">🏠</span>
              <span>Property Sales & Purchases</span>
            </div>
            <div className="service-item">
              <span className="service-icon">🔑</span>
              <span>Residential Rentals</span>
            </div>
            <div className="service-item">
              <span className="service-icon">🏗️</span>
              <span>Off-Plan Investments</span>
            </div>
            <div className="service-item">
              <span className="service-icon">🏢</span>
              <span>Commercial Properties</span>
            </div>
            <div className="service-item">
              <span className="service-icon">📄</span>
              <span>Property Management</span>
            </div>
            <div className="service-item">
              <span className="service-icon">💼</span>
              <span>Investment Advisory</span>
            </div>
            <div className="service-item">
              <span className="service-icon">🏖️</span>
              <span>Holiday Homes</span>
            </div>
            <div className="service-item">
              <span className="service-icon">📊</span>
              <span>Market Analysis</span>
            </div>
          </div>
        </div>

        <div className="company-stats-bar">
          <div className="stat-block">
            <span className="stat-number">500+</span>
            <span className="stat-label">Properties Listed</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Happy Clients</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">15+</span>
            <span className="stat-label">Years Experience</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">50+</span>
            <span className="stat-label">Expert Agents</span>
          </div>
        </div>

        <div className="company-contact-info">
          <h3>Contact Information</h3>
          <div className="contact-grid">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <strong>Head Office</strong>
                <p>Office D-72, El-Shaye-4, Port Saeed, Deira, Dubai, UAE</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <strong>Phone</strong>
                <p>+971-4-335-0592</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <div>
                <strong>WhatsApp</strong>
                <p>+971-56-361-6136</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <strong>Email</strong>
                <p>admin@whitecaves.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="company-profile-cta">
          <button className="btn btn-primary btn-lg download-profile-btn" onClick={handleDownloadPDF}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Company Profile (PDF)
          </button>
          <p className="download-hint">Get our complete company brochure with detailed information</p>
        </div>
      </div>
    </section>
  );
}
