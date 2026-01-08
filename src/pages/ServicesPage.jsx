import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from '../components/layout/AppLayout';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import './ServicesPage.css';

export default function ServicesPage() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  const [activeService, setActiveService] = useState('offplan');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your inquiry! Our team will contact you shortly.');
    setFormData({ name: '', phone: '', service: '', message: '' });
  };

  const services = [
    {
      id: 'buying',
      icon: '🔑',
      title: 'Buying Services',
      subtitle: 'Find Your Perfect Property',
      subServices: ['Off-plan purchases', 'Secondary market', 'New developments'],
      features: ['Market analysis', 'Negotiation support', 'Due diligence']
    },
    {
      id: 'selling',
      icon: '📈',
      title: 'Selling Services',
      subtitle: 'Maximize Your Property Value',
      subServices: ['Property valuation', 'Strategic marketing', 'Seamless closing'],
      features: ['Premium exposure', 'Competitive pricing', 'Quick transactions']
    },
    {
      id: 'leasing',
      icon: '📋',
      title: 'Leasing Services',
      subtitle: 'Hassle-Free Property Rental',
      subServices: ['Residential leasing', 'Commercial leasing', 'Property management'],
      features: ['Tenant screening', 'Legal compliance', 'Maintenance support']
    }
  ];

  const processSteps = [
    { step: 1, title: 'Consultation', icon: '💬', desc: 'Free initial discussion' },
    { step: 2, title: 'Requirement Analysis', icon: '📊', desc: 'Understanding your needs' },
    { step: 3, title: 'Property Shortlisting', icon: '🏠', desc: 'Curated property selection' },
    { step: 4, title: 'Viewings', icon: '👁️', desc: 'Scheduled property tours' },
    { step: 5, title: 'Offer & Negotiation', icon: '🤝', desc: 'Expert deal making' },
    { step: 6, title: 'Documentation', icon: '📝', desc: 'Legal paperwork handled' },
    { step: 7, title: 'Handover', icon: '🔑', desc: 'Keys in your hands' }
  ];

  const primeAreas = [
    { name: 'Downtown Dubai', yield: '5.2%', trend: '+8%' },
    { name: 'Dubai Marina', yield: '6.1%', trend: '+5%' },
    { name: 'Palm Jumeirah', yield: '4.8%', trend: '+12%' },
    { name: 'Business Bay', yield: '6.5%', trend: '+7%' },
    { name: 'JVC', yield: '7.2%', trend: '+10%' },
    { name: 'Arabian Ranches', yield: '5.0%', trend: '+6%' }
  ];

  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '500+', label: 'Properties Sold' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: 'AED 2B+', label: 'Total Value Transacted' }
  ];

  return (
    <AppLayout>
      <div className="services-page">
        <section className="services-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Premium Real Estate Services in Dubai</h1>
          <p className="hero-subtitle">Expert guidance for buying, selling, and leasing properties in off-plan and secondary markets</p>
          <div className="hero-cta">
            <button className="btn-primary-gold" onClick={() => document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' })}>
              Get Free Consultation
            </button>
            <button className="btn-secondary-outline" onClick={() => navigate('/')}>
              Browse Properties
            </button>
          </div>
        </div>
      </section>

      <section className="services-overview">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">Comprehensive real estate solutions tailored to your needs</p>
          
          <div className="services-cards">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p className="service-subtitle">{service.subtitle}</p>
                <div className="service-list">
                  <h4>What We Offer</h4>
                  <ul>
                    {service.subServices.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </div>
                <div className="service-features">
                  <h4>Key Features</h4>
                  <ul>
                    {service.features.map((feature, i) => (
                      <li key={i}><span className="check">✓</span> {feature}</li>
                    ))}
                  </ul>
                </div>
                <button className="btn-learn-more" onClick={() => document.getElementById('detailed-services').scrollIntoView({ behavior: 'smooth' })}>
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="detailed-services" className="detailed-services">
        <div className="container">
          <h2 className="section-title">Detailed Service Breakdown</h2>
          
          <div className="service-tabs">
            <button 
              className={`tab-btn ${activeService === 'offplan' ? 'active' : ''}`}
              onClick={() => setActiveService('offplan')}
            >
              Off-Plan Properties
            </button>
            <button 
              className={`tab-btn ${activeService === 'secondary' ? 'active' : ''}`}
              onClick={() => setActiveService('secondary')}
            >
              Secondary Market
            </button>
            <button 
              className={`tab-btn ${activeService === 'leasing' ? 'active' : ''}`}
              onClick={() => setActiveService('leasing')}
            >
              Leasing Services
            </button>
          </div>

          {activeService === 'offplan' && (
            <div className="service-detail-content">
              <h3>Off-Plan Properties</h3>
              <p>Invest in Dubai's future with our expert off-plan property guidance. Access exclusive pre-launch prices and flexible payment plans from premier developers.</p>
              
              <div className="process-flowchart">
                <h4>Off-Plan Purchase Process</h4>
                <div className="flowchart-steps">
                  <div className="flow-step">
                    <div className="flow-icon">🔍</div>
                    <div className="flow-label">Research</div>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">
                    <div className="flow-icon">🏗️</div>
                    <div className="flow-label">Selection</div>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">
                    <div className="flow-icon">📝</div>
                    <div className="flow-label">Booking</div>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">
                    <div className="flow-icon">💳</div>
                    <div className="flow-label">Payment Plan</div>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">
                    <div className="flow-icon">🔑</div>
                    <div className="flow-label">Handover</div>
                  </div>
                </div>
              </div>

              <div className="benefits-grid">
                <div className="benefit-card">
                  <h5>💰 Price Advantages</h5>
                  <p>Access pre-launch prices up to 20% below market value</p>
                </div>
                <div className="benefit-card">
                  <h5>🎨 Customization Options</h5>
                  <p>Personalize finishes and layouts to your preference</p>
                </div>
                <div className="benefit-card">
                  <h5>📅 Flexible Payment Plans</h5>
                  <p>Spread payments over construction period with 0% interest</p>
                </div>
              </div>
            </div>
          )}

          {activeService === 'secondary' && (
            <div className="service-detail-content">
              <h3>Secondary Market</h3>
              <p>Move into your dream property immediately with our extensive secondary market listings. Established communities, proven locations, and immediate occupancy.</p>
              
              <div className="comparison-table">
                <h4>Off-Plan vs Secondary Market</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Off-Plan</th>
                      <th>Secondary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Availability</td>
                      <td>Future delivery</td>
                      <td>Immediate</td>
                    </tr>
                    <tr>
                      <td>Price</td>
                      <td>Pre-launch discounts</td>
                      <td>Market value</td>
                    </tr>
                    <tr>
                      <td>Payment</td>
                      <td>Flexible plans</td>
                      <td>Full payment/Mortgage</td>
                    </tr>
                    <tr>
                      <td>Inspection</td>
                      <td>Model units only</td>
                      <td>Actual property</td>
                    </tr>
                    <tr>
                      <td>Community</td>
                      <td>Developing</td>
                      <td>Established</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="success-metrics">
                <div className="metric">
                  <span className="metric-value">21</span>
                  <span className="metric-label">Average Days on Market</span>
                </div>
                <div className="metric">
                  <span className="metric-value">97%</span>
                  <span className="metric-label">Asking Price Achieved</span>
                </div>
                <div className="metric">
                  <span className="metric-value">350+</span>
                  <span className="metric-label">Properties Sold in 2024</span>
                </div>
              </div>
            </div>
          )}

          {activeService === 'leasing' && (
            <div className="service-detail-content">
              <h3>Leasing Services</h3>
              <p>Whether you're a landlord seeking reliable tenants or a tenant looking for your perfect home, our leasing experts ensure a smooth, compliant process.</p>
              
              <div className="leasing-services-grid">
                <div className="leasing-card">
                  <h5>🏠 Residential Leasing</h5>
                  <p>Apartments, villas, and townhouses across Dubai's prime locations</p>
                </div>
                <div className="leasing-card">
                  <h5>🏢 Commercial Leasing</h5>
                  <p>Office spaces, retail units, and warehouses for businesses</p>
                </div>
                <div className="leasing-card">
                  <h5>🔧 Property Management</h5>
                  <p>Full-service management including maintenance and tenant relations</p>
                </div>
              </div>

              <div className="faq-section">
                <h4>Frequently Asked Questions</h4>
                <div className="faq-item">
                  <strong>What is Ejari?</strong>
                  <p>Ejari is Dubai's official tenancy contract registration system, mandatory for all rental agreements.</p>
                </div>
                <div className="faq-item">
                  <strong>How much security deposit is required?</strong>
                  <p>Typically 5% of annual rent for unfurnished and 10% for furnished properties.</p>
                </div>
                <div className="faq-item">
                  <strong>What tenant screening do you provide?</strong>
                  <p>Background checks, employment verification, and previous landlord references.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="market-insights">
        <div className="container">
          <h2 className="section-title">Dubai Market Insights</h2>
          <p className="section-subtitle">Real-time data from Dubai's prime property locations</p>
          
          <div className="areas-grid">
            {primeAreas.map((area, i) => (
              <div key={i} className="area-card">
                <h4>{area.name}</h4>
                <div className="area-stats">
                  <div className="area-stat">
                    <span className="stat-label">Rental Yield</span>
                    <span className="stat-value">{area.yield}</span>
                  </div>
                  <div className="area-stat">
                    <span className="stat-label">Price Trend</span>
                    <span className="stat-value positive">{area.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process-timeline">
        <div className="container">
          <h2 className="section-title">Our Client Journey</h2>
          <p className="section-subtitle">A seamless process from consultation to handover</p>
          
          <div className="timeline">
            {processSteps.map((step, i) => (
              <div key={i} className="timeline-step">
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {i < processSteps.length - 1 && <div className="timeline-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-indicators">
        <div className="container">
          <h2 className="section-title">Why Choose White Caves</h2>
          
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="certifications">
            <div className="cert-badge">
              <span className="cert-icon">🏛️</span>
              <span>RERA Certified</span>
            </div>
            <div className="cert-badge">
              <span className="cert-icon">📜</span>
              <span>DLD Licensed</span>
            </div>
            <div className="cert-badge">
              <span className="cert-icon">✅</span>
              <span>DTCM Approved</span>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-section" className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <h2>Ready to Begin Your Dubai Property Journey?</h2>
              <p>Get expert guidance from our team of certified real estate professionals</p>
              <div className="contact-info">
                <p><strong>📍</strong> Office D-72, El-Shaye-4, Port Saeed, Dubai</p>
                <p><strong>📞</strong> +971 56 361 6136</p>
                <p><strong>📱</strong> +971 56 361 6136</p>
              </div>
            </div>
            <div className="cta-form">
              <h3>Request a Consultation</h3>
              <form onSubmit={handleFormSubmit}>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleFormChange}
                  required 
                />
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={handleFormChange}
                  required 
                />
                <select 
                  name="service" 
                  value={formData.service}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Service Interest</option>
                  <option value="buying">Buying Property</option>
                  <option value="selling">Selling Property</option>
                  <option value="leasing">Leasing Services</option>
                  <option value="management">Property Management</option>
                </select>
                <textarea 
                  name="message" 
                  placeholder="Your Message (Optional)"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows="3"
                ></textarea>
                <button type="submit" className="btn-submit">Send Inquiry</button>
              </form>
            </div>
          </div>
        </div>
      </section>

        <Footer />
        <WhatsAppButton />
      </div>
    </AppLayout>
  );
}
