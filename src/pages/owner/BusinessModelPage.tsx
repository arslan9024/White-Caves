import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './BusinessModelPage.css';

interface Section {
  id: string;
  label: string;
}

interface BusinessModelPageProps {}

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const BusinessModelPage: FC<BusinessModelPageProps> = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.currentUser);
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  const sections: Section[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'marketing', label: 'Marketing Strategy' },
    { id: 'financials', label: 'Financial Projections' },
    { id: 'operations', label: 'Operations' },
    { id: 'growth', label: 'Growth Strategy' }
  ];

  return (
    <div className="business-model-page no-sidebar">
      <div className="bm-container full-width">
        <header className="bm-header">
          <h1>White Caves Real Estate LLC</h1>
          <p className="bm-tagline">"Your Gateway to Dubai's Future"</p>
          <span className="secret-badge">Confidential Business Model</span>
        </header>

        <nav className="bm-navigation">
          {sections.map(section => (
            <button
              key={section.id}
              className={`bm-nav-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {activeSection === 'overview' && (
          <div className="bm-content-section">
            <h2>Business Overview</h2>
            
            <div className="bm-highlight-box">
              <h3>Brand Promise</h3>
              <p><strong>"Transparent, Tech-Enabled, Tailored Real Estate Solutions"</strong></p>
            </div>
            
            <h3>Key Startup Requirements</h3>
            <div className="bm-stats-grid">
              <div className="bm-stat-card">
                <div className="bm-stat-label">Total Capital Required</div>
                <div className="bm-stat-value">AED 750K</div>
              </div>
              <div className="bm-stat-card">
                <div className="bm-stat-label">Monthly Operating Cost</div>
                <div className="bm-stat-value">AED 193K</div>
              </div>
              <div className="bm-stat-card">
                <div className="bm-stat-label">Break-Even Point</div>
                <div className="bm-stat-value">Month 14</div>
              </div>
              <div className="bm-stat-card">
                <div className="bm-stat-label">Year 3 Revenue Target</div>
                <div className="bm-stat-value">AED 3.85M</div>
              </div>
            </div>
            
            <h3>Core Services</h3>
            <ul className="bm-list">
              <li><strong>Sales & Leasing:</strong> Residential and commercial properties</li>
              <li><strong>Property Management:</strong> Full-service management for landlords</li>
              <li><strong>Corporate Relocation:</strong> Specialized packages for businesses</li>
              <li><strong>Investment Advisory:</strong> Market analysis and investment guidance</li>
            </ul>
          </div>
        )}

        {activeSection === 'marketing' && (
          <div className="bm-content-section">
            <h2>Marketing Strategy: Digital-First, Relationship-Backed</h2>
            
            <h3>Phase 1: Foundation & Awareness (Months 1-6)</h3>
            <div className="bm-highlight-box">
              <strong>Website Development:</strong>
              <ul className="bm-list">
                <li>Responsive, Arabic/English bilingual site</li>
                <li>Integrated CRM with client portal</li>
                <li>AI-powered property recommendations</li>
                <li>Virtual tour integration</li>
                <li>Live chat with instant broker connection</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'financials' && (
          <div className="bm-content-section">
            <h2>Financial Projections</h2>
            <div className="bm-highlight-box">
              <strong>Revenue Model:</strong>
              <ul className="bm-list">
                <li>Commission-based (2-3% on secondary sales)</li>
                <li>Property management fees (5-8% of rental value)</li>
                <li>Consultation and advisory fees</li>
                <li>Marketing and content services</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'operations' && (
          <div className="bm-content-section">
            <h2>Operations</h2>
            <p>Operational structure and processes</p>
          </div>
        )}

        {activeSection === 'growth' && (
          <div className="bm-content-section">
            <h2>Growth Strategy</h2>
            <p>Expansion and scaling plans</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessModelPage;
