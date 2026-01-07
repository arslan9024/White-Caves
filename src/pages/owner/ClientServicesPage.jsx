import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RoleNavigation from '../../components/RoleNavigation';
import './ClientServicesPage.css';

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

export default function ClientServicesPage() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  const [activeSection, setActiveSection] = useState('services');

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  const sections = [
    { id: 'services', label: 'Our Services' },
    { id: 'secondary', label: 'Secondary Sales' },
    { id: 'offplan', label: 'Off-Plan Sales' },
    { id: 'leasing', label: 'Leasing Services' },
    { id: 'process', label: 'Our Process' }
  ];

  return (
    <div className="client-services-page">
      <RoleNavigation role="owner" userName={user?.displayName || user?.email} />
      
      <div className="cs-container">
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
              <div className="cs-stat-card">
                <div className="cs-stat-label">Prime Locations</div>
                <div className="cs-stat-value">50+</div>
                <div className="cs-stat-label">Areas Covered in Dubai</div>
              </div>
            </div>

            <div className="cs-highlight-box">
              <h3>🌟 Our Commitment to You</h3>
              <ul>
                <li><strong>Transparent Pricing:</strong> No hidden fees, clear commission structure</li>
                <li><strong>Tech-Enabled Service:</strong> Virtual tours, digital contracts, online client portal</li>
                <li><strong>Bilingual Support:</strong> Full services in English and Arabic</li>
                <li><strong>Legal Compliance:</strong> RERA-certified agents ensuring smooth transactions</li>
                <li><strong>Personalized Approach:</strong> Tailored solutions for your unique needs</li>
              </ul>
            </div>

            <div className="cs-cta-section">
              <button className="cs-cta-button" onClick={() => navigate('/services')}>Schedule a Consultation</button>
              <button className="cs-cta-button" onClick={() => navigate('/')}>Browse Properties</button>
            </div>
          </div>
        )}

        {activeSection === 'secondary' && (
          <div className="cs-content-section">
            <h2>Secondary Sales - Ready-to-Move Properties</h2>
            <p className="cs-intro">
              Looking for a property you can move into immediately? Our secondary sales service connects you with established properties across Dubai's most sought-after neighborhoods.
            </p>

            <div className="cs-service-card">
              <h3>🏠 Residential Secondary Sales</h3>
              <p><strong>Perfect for:</strong> Families, individuals, and investors seeking immediate occupancy</p>
              
              <h4>Property Types:</h4>
              <ul>
                <li>Apartments in established communities (Dubai Marina, Downtown, JBR, Palm Jumeirah)</li>
                <li>Villas and townhouses in gated communities (Arabian Ranches, Springs, Meadows)</li>
                <li>Penthouses with premium amenities and views</li>
                <li>Studios and 1-bedroom units ideal for singles or young professionals</li>
              </ul>

              <h4>What We Offer:</h4>
              <div className="cs-benefits">
                <div className="cs-benefit-item">Complete property valuation and market analysis</div>
                <div className="cs-benefit-item">Access to exclusive off-market listings</div>
                <div className="cs-benefit-item">Professional property viewings with detailed information</div>
                <div className="cs-benefit-item">Negotiation support to secure the best price</div>
                <div className="cs-benefit-item">Full legal assistance and documentation support</div>
                <div className="cs-benefit-item">Connection with mortgage providers and financial advisors</div>
                <div className="cs-benefit-item">Post-purchase support including move-in coordination</div>
              </div>
            </div>

            <div className="cs-service-card">
              <h3>🏢 Commercial Secondary Sales</h3>
              <p><strong>Perfect for:</strong> Business owners, investors, and corporate entities</p>
              
              <h4>Property Types:</h4>
              <ul>
                <li>Office spaces in business districts (DIFC, Business Bay, Dubai Media City)</li>
                <li>Retail units in high-traffic areas and shopping centers</li>
                <li>Warehouses and industrial units in Jebel Ali and Dubai South</li>
                <li>Mixed-use properties with residential and commercial potential</li>
              </ul>

              <h4>Additional Services:</h4>
              <div className="cs-benefits">
                <div className="cs-benefit-item">Investment return analysis and projections</div>
                <div className="cs-benefit-item">Tenant sourcing for investment properties</div>
                <div className="cs-benefit-item">Business license and regulatory guidance</div>
                <div className="cs-benefit-item">Property management recommendations</div>
              </div>
            </div>

            <h3>Why Buy Secondary Properties?</h3>
            <div className="cs-table-wrapper">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Advantage</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Immediate Availability</td>
                    <td>Move in right away or start generating rental income immediately</td>
                  </tr>
                  <tr>
                    <td>Established Communities</td>
                    <td>Proven infrastructure, amenities, and community atmosphere</td>
                  </tr>
                  <tr>
                    <td>Clear Market Value</td>
                    <td>Comparable sales data makes valuation straightforward</td>
                  </tr>
                  <tr>
                    <td>Physical Inspection</td>
                    <td>See exactly what you're buying before committing</td>
                  </tr>
                  <tr>
                    <td>Negotiation Opportunity</td>
                    <td>Potential to negotiate below asking price</td>
                  </tr>
                  <tr>
                    <td>No Construction Risk</td>
                    <td>Property is completed and ready for use</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cs-highlight-box">
              <h3>📋 Buyer Commission Structure</h3>
              <p><strong>Residential:</strong> 2% of purchase price (paid at completion)</p>
              <p><strong>Commercial:</strong> 2% of purchase price (negotiable for high-value transactions)</p>
              <p className="cs-note">*All fees are transparent and discussed upfront. No hidden charges.</p>
            </div>
          </div>
        )}

        {activeSection === 'offplan' && (
          <div className="cs-content-section">
            <h2>Off-Plan Sales - Invest in Dubai's Future</h2>
            <p className="cs-intro">
              Get in early on Dubai's newest developments and benefit from attractive payment plans, capital appreciation, and modern designs. We partner with Dubai's most reputable developers to bring you the best pre-construction opportunities.
            </p>

            <div className="cs-service-card">
              <h3>🏗️ Residential Off-Plan Projects</h3>
              <p><strong>Perfect for:</strong> Investors, first-time buyers, and those seeking modern designs</p>
              
              <h4>Featured Development Areas:</h4>
              <ul>
                <li><strong>Dubai Creek Harbour:</strong> Waterfront living next to iconic landmarks</li>
                <li><strong>Dubai Hills Estate:</strong> Golf course communities with green spaces</li>
                <li><strong>Dubai South:</strong> Near Expo 2020 site and Al Maktoum Airport</li>
                <li><strong>Mohammed Bin Rashid City:</strong> Family-oriented mega-community</li>
                <li><strong>Jumeirah Village Circle:</strong> Affordable family apartments</li>
              </ul>

              <h4>Developer Partners:</h4>
              <div className="cs-benefits">
                <div className="cs-benefit-item">Emaar Properties - Dubai's leading developer</div>
                <div className="cs-benefit-item">Damac Properties - Luxury residential focus</div>
                <div className="cs-benefit-item">Nakheel - Iconic projects like Palm Jumeirah</div>
                <div className="cs-benefit-item">Dubai Properties - Established communities</div>
                <div className="cs-benefit-item">Meraas - Innovative urban developments</div>
              </div>
            </div>

            <div className="cs-service-card">
              <h3>🏢 Commercial Off-Plan Developments</h3>
              <p><strong>Perfect for:</strong> Business investors, corporate buyers, and portfolio diversification</p>
              
              <h4>Project Types:</h4>
              <ul>
                <li>Business parks with flexible office configurations</li>
                <li>Retail spaces in new shopping destinations</li>
                <li>Mixed-use towers with commercial podiums</li>
                <li>Hospitality projects (hotels, serviced apartments)</li>
              </ul>
            </div>

            <h3>Benefits of Off-Plan Investment</h3>
            <div className="cs-table-wrapper">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Benefit</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Flexible Payment Plans</td>
                    <td>Spread payments over construction period (typically 20-40% down, rest during construction)</td>
                  </tr>
                  <tr>
                    <td>Lower Entry Price</td>
                    <td>Pre-construction prices often 15-30% below completed market value</td>
                  </tr>
                  <tr>
                    <td>Capital Appreciation</td>
                    <td>Property value increases as construction progresses</td>
                  </tr>
                  <tr>
                    <td>Modern Design & Tech</td>
                    <td>Latest architecture, smart home features, energy efficiency</td>
                  </tr>
                  <tr>
                    <td>Choice of Units</td>
                    <td>Select best locations, floors, and views early</td>
                  </tr>
                  <tr>
                    <td>Developer Warranties</td>
                    <td>1-2 year structural warranties on new properties</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Typical Payment Structure Example</h3>
            <div className="cs-highlight-box">
              <h4>2-Bedroom Apartment - Dubai Creek Harbour</h4>
              <p><strong>Total Price:</strong> AED 1,800,000</p>
              <ul>
                <li>10% - On booking: AED 180,000</li>
                <li>10% - Within 60 days: AED 180,000</li>
                <li>40% - During construction (quarterly): AED 720,000</li>
                <li>40% - On handover: AED 720,000</li>
              </ul>
              <p className="cs-note"><strong>Expected completion:</strong> Q4 2027</p>
            </div>

            <div className="cs-service-card">
              <h3>🎯 Our Off-Plan Services Include:</h3>
              <div className="cs-benefits">
                <div className="cs-benefit-item">Market research and developer reputation verification</div>
                <div className="cs-benefit-item">Detailed project analysis (location, ROI projections, completion timeline)</div>
                <div className="cs-benefit-item">Payment plan optimization based on your financial situation</div>
                <div className="cs-benefit-item">Site visits to show project progress and nearby amenities</div>
                <div className="cs-benefit-item">Contract review and legal protection</div>
                <div className="cs-benefit-item">Progress monitoring throughout construction</div>
                <div className="cs-benefit-item">Snagging inspection before handover</div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'leasing' && (
          <div className="cs-content-section">
            <h2>Leasing Services - Residential & Commercial</h2>
            <p className="cs-intro">
              Whether you're a landlord looking to rent your property or a tenant searching for your next home or office, our leasing team provides comprehensive support throughout the rental process.
            </p>

            <div className="cs-service-card">
              <h3>🏠 For Tenants - Find Your Perfect Rental</h3>
              
              <h4>Residential Leasing:</h4>
              <ul>
                <li>Apartments, villas, townhouses across Dubai</li>
                <li>Short-term and long-term rental options</li>
                <li>Furnished and unfurnished properties</li>
                <li>Family communities, beachfront, city center locations</li>
              </ul>

              <h4>Commercial Leasing:</h4>
              <ul>
                <li>Office spaces in prime business districts</li>
                <li>Retail units in shopping malls and street-level</li>
                <li>Warehouses and industrial spaces</li>
                <li>Co-working and flexible office solutions</li>
              </ul>

              <h4>Our Tenant Services:</h4>
              <div className="cs-benefits">
                <div className="cs-benefit-item">Property search based on your requirements and budget</div>
                <div className="cs-benefit-item">Accompanied viewings at convenient times</div>
                <div className="cs-benefit-item">Lease negotiation and terms review</div>
                <div className="cs-benefit-item">Ejari registration assistance</div>
                <div className="cs-benefit-item">Move-in inspection and documentation</div>
              </div>
            </div>

            <div className="cs-service-card">
              <h3>🏢 For Landlords - Maximize Your Rental Income</h3>
              
              <h4>Our Landlord Services:</h4>
              <div className="cs-benefits">
                <div className="cs-benefit-item">Free property valuation and rental price assessment</div>
                <div className="cs-benefit-item">Professional photography and listing creation</div>
                <div className="cs-benefit-item">Multi-platform marketing (portals, social media, network)</div>
                <div className="cs-benefit-item">Tenant screening and background checks</div>
                <div className="cs-benefit-item">Lease preparation and Ejari registration</div>
                <div className="cs-benefit-item">Move-in/move-out inspections</div>
              </div>

              <h4>Property Management (Optional):</h4>
              <ul>
                <li>Rent collection and financial reporting</li>
                <li>Maintenance coordination</li>
                <li>Tenant communication and issue resolution</li>
                <li>Lease renewal management</li>
              </ul>
            </div>

            <h3>Leasing Commission Structure</h3>
            <div className="cs-table-wrapper">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Tenant Pays</th>
                    <th>Landlord Pays</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Residential Leasing</td>
                    <td>5% of annual rent</td>
                    <td>5% of annual rent</td>
                  </tr>
                  <tr>
                    <td>Commercial Leasing</td>
                    <td>Negotiable</td>
                    <td>5-10% of annual rent</td>
                  </tr>
                  <tr>
                    <td>Property Management</td>
                    <td>N/A</td>
                    <td>5-8% of monthly rent</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cs-highlight-box">
              <h3>📋 Rental Requirements in Dubai</h3>
              <ul>
                <li><strong>Ejari:</strong> All tenancy contracts must be registered with Ejari</li>
                <li><strong>Security Deposit:</strong> Typically 5% (unfurnished) or 10% (furnished) of annual rent</li>
                <li><strong>Agency Fee:</strong> Usually 5% of annual rent, paid by tenant</li>
                <li><strong>Payment:</strong> 1-4 cheques common (fewer cheques = negotiating power)</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'process' && (
          <div className="cs-content-section">
            <h2>Our Client Journey</h2>
            <p className="cs-intro">
              At White Caves Real Estate, we believe in a structured, transparent process that keeps you informed at every stage. Here's what you can expect when working with us:
            </p>

            <h3>For Buyers (Secondary & Off-Plan)</h3>
            <div className="cs-process-steps">
              <div className="cs-process-step">
                <div className="cs-step-number">1</div>
                <div className="cs-step-content">
                  <h4>Initial Consultation</h4>
                  <p>We discuss your requirements, budget, preferred locations, and timeline. This helps us understand exactly what you're looking for.</p>
                </div>
              </div>
              <div className="cs-process-step">
                <div className="cs-step-number">2</div>
                <div className="cs-step-content">
                  <h4>Property Search & Shortlisting</h4>
                  <p>Based on your criteria, we compile a curated list of properties that match your needs, including market insights for each option.</p>
                </div>
              </div>
              <div className="cs-process-step">
                <div className="cs-step-number">3</div>
                <div className="cs-step-content">
                  <h4>Property Viewings</h4>
                  <p>We arrange convenient viewing times and accompany you to each property, providing detailed information and answering all questions.</p>
                </div>
              </div>
              <div className="cs-process-step">
                <div className="cs-step-number">4</div>
                <div className="cs-step-content">
                  <h4>Offer & Negotiation</h4>
                  <p>Once you've found your ideal property, we handle price negotiation and terms discussion to secure the best possible deal.</p>
                </div>
              </div>
              <div className="cs-process-step">
                <div className="cs-step-number">5</div>
                <div className="cs-step-content">
                  <h4>Documentation & Legal</h4>
                  <p>We coordinate with all parties - seller, bank (if mortgage), legal team - to ensure smooth documentation and compliance.</p>
                </div>
              </div>
              <div className="cs-process-step">
                <div className="cs-step-number">6</div>
                <div className="cs-step-content">
                  <h4>Transfer & Handover</h4>
                  <p>We guide you through the Dubai Land Department transfer process and ensure a smooth handover of keys.</p>
                </div>
              </div>
              <div className="cs-process-step">
                <div className="cs-step-number">7</div>
                <div className="cs-step-content">
                  <h4>After-Sales Support</h4>
                  <p>Our relationship doesn't end at handover. We're available for any post-purchase questions and can assist with property management, renovations, or future sales.</p>
                </div>
              </div>
            </div>

            <div className="cs-highlight-box">
              <h3>📞 Ready to Start?</h3>
              <p>Contact us today for a free, no-obligation consultation:</p>
              <p><strong>📱 Phone/WhatsApp:</strong> +971 56 361 6136 / +971 56 361 6136</p>
              <p><strong>📧 Email:</strong> info@whitecaves.ae</p>
              <p><strong>📍 Office:</strong> Office D-72, El-Shaye-4, Port Saeed, Dubai</p>
              <p><strong>⏰ Hours:</strong> Sunday - Thursday: 9 AM - 6 PM | Saturday: 10 AM - 2 PM</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
