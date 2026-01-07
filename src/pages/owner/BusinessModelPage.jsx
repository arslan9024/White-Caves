import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './BusinessModelPage.css';

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

export default function BusinessModelPage() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  const sections = [
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
            
            <h3>Digital Marketing Channels</h3>
            <div className="bm-table-wrapper">
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Purpose</th>
                    <th>Content Focus</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Instagram</td>
                    <td>Visual Storytelling</td>
                    <td>Luxury visuals, property showcases, testimonials</td>
                  </tr>
                  <tr>
                    <td>LinkedIn</td>
                    <td>B2B Marketing</td>
                    <td>Market analysis, corporate services</td>
                  </tr>
                  <tr>
                    <td>YouTube</td>
                    <td>Education & Tours</td>
                    <td>Virtual tours, broker interviews, guides</td>
                  </tr>
                  <tr>
                    <td>Google Ads</td>
                    <td>Lead Generation</td>
                    <td>High-intent keywords (AED 3,000/month)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3>Content Marketing Pillars</h3>
            <ul className="bm-list">
              <li>Investment guides for foreign buyers</li>
              <li>Area guides (Dubai Marina, Downtown, Palm Jumeirah)</li>
              <li>Legal FAQs and market trends</li>
              <li>Monthly market reports (lead generation)</li>
              <li>Webinars: "Investing in Dubai Real Estate 101"</li>
            </ul>
          </div>
        )}

        {activeSection === 'financials' && (
          <div className="bm-content-section">
            <h2>Financial Projections & Funding</h2>
            
            <h3>Startup Capital Breakdown</h3>
            <div className="bm-table-wrapper">
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Initial Cost (AED)</th>
                    <th>Monthly Cost (AED)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Licensing & Legal</td>
                    <td>150,000</td>
                    <td>5,000</td>
                  </tr>
                  <tr>
                    <td>Office Setup & Rent</td>
                    <td>120,000</td>
                    <td>35,000</td>
                  </tr>
                  <tr>
                    <td>Technology Infrastructure</td>
                    <td>80,000</td>
                    <td>8,000</td>
                  </tr>
                  <tr>
                    <td>Marketing Launch</td>
                    <td>150,000</td>
                    <td>20,000</td>
                  </tr>
                  <tr>
                    <td>Team Salaries (6 months)</td>
                    <td>250,000</td>
                    <td>125,000</td>
                  </tr>
                  <tr className="total-row">
                    <td><strong>Total</strong></td>
                    <td><strong>750,000</strong></td>
                    <td><strong>193,000</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3>3-Year Revenue Forecast</h3>
            <div className="bm-table-wrapper">
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Transactions</th>
                    <th>Revenue (AED)</th>
                    <th>Net Profit (AED)</th>
                    <th>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Year 1</td>
                    <td>30 (15 sales, 15 leases)</td>
                    <td>900,000</td>
                    <td className="negative">(416,000)</td>
                    <td>Investment Phase</td>
                  </tr>
                  <tr>
                    <td>Year 2</td>
                    <td>75 (35 sales, 40 leases)</td>
                    <td>2,182,000</td>
                    <td className="positive">480,000</td>
                    <td>22%</td>
                  </tr>
                  <tr>
                    <td>Year 3</td>
                    <td>120 (50 sales, 70 leases)</td>
                    <td>3,850,000</td>
                    <td className="positive">1,155,000</td>
                    <td>30%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="bm-highlight-box">
              <h3>Funding Strategy</h3>
              <ul className="bm-list">
                <li><strong>Owner Investment:</strong> 60% (AED 450,000)</li>
                <li><strong>Strategic Partner:</strong> 25% (AED 187,500)</li>
                <li><strong>Business Loan:</strong> 15% (AED 112,500) - Repayment from Month 18</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'operations' && (
          <div className="bm-content-section">
            <h2>Operational Workflows & Team Structure</h2>
            
            <h3>Core Team (Starting - 5 People)</h3>
            <ol className="bm-ordered-list">
              <li><strong>Managing Director/Broker:</strong> Strategy, key client relationships</li>
              <li><strong>Sales Manager:</strong> Team leadership, training, performance</li>
              <li><strong>Leasing Specialist:</strong> Rental market, tenant/landlord relations</li>
              <li><strong>Marketing Coordinator:</strong> Digital presence, content, leads</li>
              <li><strong>Administrative Assistant:</strong> Operations, documentation, scheduling</li>
            </ol>
            
            <h3>Technology Stack</h3>
            <div className="bm-table-wrapper">
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>Tool</th>
                    <th>Purpose</th>
                    <th>Monthly Cost (AED)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Salesforce Real Estate Cloud</td>
                    <td>CRM & Client Management</td>
                    <td>3,500</td>
                  </tr>
                  <tr>
                    <td>Yardi/AppFolio</td>
                    <td>Property Management</td>
                    <td>2,500</td>
                  </tr>
                  <tr>
                    <td>Microsoft 365 + Teams</td>
                    <td>Communication</td>
                    <td>1,200</td>
                  </tr>
                  <tr>
                    <td>Matterport 3D</td>
                    <td>Virtual Tours</td>
                    <td>800</td>
                  </tr>
                  <tr>
                    <td>DocuSign</td>
                    <td>Digital Signatures</td>
                    <td>500</td>
                  </tr>
                  <tr>
                    <td>QuickBooks Online</td>
                    <td>Accounting</td>
                    <td>400</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3>Key Performance Indicators (KPIs)</h3>
            <div className="bm-table-wrapper">
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Metric</th>
                    <th>Target</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan={3}>Sales</td>
                    <td>Listings secured/month</td>
                    <td>8</td>
                  </tr>
                  <tr>
                    <td>Average days on market</td>
                    <td>&lt; 45 days</td>
                  </tr>
                  <tr>
                    <td>Sales price vs. asking</td>
                    <td>&gt; 97%</td>
                  </tr>
                  <tr>
                    <td rowSpan={2}>Marketing</td>
                    <td>Cost per lead</td>
                    <td>&lt; AED 500</td>
                  </tr>
                  <tr>
                    <td>Website conversion rate</td>
                    <td>&gt; 3%</td>
                  </tr>
                  <tr>
                    <td rowSpan={2}>Client Service</td>
                    <td>Net Promoter Score</td>
                    <td>&gt; 50</td>
                  </tr>
                  <tr>
                    <td>Repeat business rate</td>
                    <td>&gt; 40%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'growth' && (
          <div className="bm-content-section">
            <h2>Growth & Expansion Strategy</h2>
            
            <div className="bm-highlight-box growth-phase">
              <h3>Short-Term (0-12 Months): Market Penetration</h3>
              <ul className="bm-list">
                <li>Focus on 3 prime areas: Dubai Marina, Downtown, Business Bay</li>
                <li>Build brand recognition through digital presence</li>
                <li>Establish referral networks with international brokerages</li>
                <li>Achieve first 30 transactions</li>
              </ul>
            </div>
            
            <div className="bm-highlight-box growth-phase">
              <h3>Medium-Term (13-36 Months): Service Diversification</h3>
              <ul className="bm-list">
                <li>Launch property management division (target: 50 properties by Year 3)</li>
                <li>Develop corporate relocation program</li>
                <li>Introduce investment advisory services</li>
                <li>Expand to Abu Dhabi market</li>
                <li>Achieve profitability (Month 14 break-even)</li>
              </ul>
            </div>
            
            <div className="bm-highlight-box growth-phase">
              <h3>Long-Term (36+ Months): Strategic Expansion</h3>
              <ul className="bm-list">
                <li>Franchise model for UAE expansion</li>
                <li>Consider adjacent markets (Saudi Arabia, Qatar)</li>
                <li>Technology spin-off: Property management SaaS</li>
                <li>Possible acquisition of smaller brokerages</li>
                <li>Target: AED 10M+ annual revenue</li>
              </ul>
            </div>
            
            <h3>Risk Management</h3>
            <div className="bm-table-wrapper">
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>Risk</th>
                    <th>Mitigation Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Market Downturn</td>
                    <td>Diversify services, build cash reserves, flexible costs</td>
                  </tr>
                  <tr>
                    <td>Regulatory Changes</td>
                    <td>RERA compliance officer, legal retainer, ongoing training</td>
                  </tr>
                  <tr>
                    <td>Key Staff Departure</td>
                    <td>Documentation, incentive programs, team-based client management</td>
                  </tr>
                  <tr>
                    <td>Technology Failure</td>
                    <td>Cloud-based systems, regular backups, IT support contract</td>
                  </tr>
                  <tr>
                    <td>Reputation Risk</td>
                    <td>Transparent practices, satisfaction guarantees, review management</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
