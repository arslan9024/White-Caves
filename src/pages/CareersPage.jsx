import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MegaNav from '../components/MegaNav';
import './CareersPage.css';

const jobPositions = [
  {
    id: 1,
    title: 'Secondary Sales Agent',
    department: 'Sales',
    type: 'Full-time',
    experience: '1-3 years',
    description: 'Join our secondary sales team to help clients buy and sell ready properties across Dubai\'s premium communities.',
    responsibilities: [
      'Build and maintain client relationships',
      'Conduct property viewings and market analysis',
      'Negotiate deals and close transactions',
      'Achieve monthly sales targets',
      'Stay updated on market trends and property values'
    ],
    requirements: [
      'Valid UAE driver\'s license',
      'RERA certified or willing to obtain',
      'Excellent communication skills',
      'Strong negotiation abilities',
      'Previous real estate experience preferred'
    ]
  },
  {
    id: 2,
    title: 'Off-Plan Sales Consultant',
    department: 'Sales',
    type: 'Full-time',
    experience: '2-5 years',
    description: 'Represent top developers and help investors secure the best off-plan opportunities in Dubai\'s newest projects.',
    responsibilities: [
      'Present new development projects to investors',
      'Analyze ROI and investment potential',
      'Build relationships with developers',
      'Manage sales pipeline from lead to close',
      'Attend project launches and exhibitions'
    ],
    requirements: [
      'Strong knowledge of Dubai real estate market',
      'Experience with off-plan sales',
      'Fluent in English, Arabic is a plus',
      'Excellent presentation skills',
      'Goal-oriented mindset'
    ]
  },
  {
    id: 3,
    title: 'Leasing Consultant',
    department: 'Leasing',
    type: 'Full-time',
    experience: '0-2 years',
    description: 'Help tenants find their perfect rental homes and assist landlords in maximizing their property returns.',
    responsibilities: [
      'Match tenants with suitable properties',
      'Conduct property viewings',
      'Handle lease negotiations and paperwork',
      'Coordinate Ejari registration',
      'Provide excellent customer service'
    ],
    requirements: [
      'Customer-focused attitude',
      'Basic knowledge of Dubai rental market',
      'Good organizational skills',
      'Valid UAE driver\'s license',
      'Fresh graduates welcome'
    ]
  },
  {
    id: 4,
    title: 'Senior Sales Team Leader',
    department: 'Management',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Lead and mentor a team of sales agents while driving revenue growth and maintaining high performance standards.',
    responsibilities: [
      'Manage and mentor sales team',
      'Set and monitor team targets',
      'Develop sales strategies',
      'Handle high-value transactions',
      'Report to senior management'
    ],
    requirements: [
      'Proven track record in real estate sales',
      'Leadership experience',
      'Strong analytical skills',
      'Excellent communication',
      'RERA broker license'
    ]
  },
  {
    id: 5,
    title: 'Property Consultant - Commercial',
    department: 'Sales',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'Specialize in commercial real estate including offices, retail spaces, and industrial properties.',
    responsibilities: [
      'Handle commercial property transactions',
      'Advise on investment returns',
      'Build corporate client relationships',
      'Understand business licensing requirements',
      'Market commercial listings'
    ],
    requirements: [
      'Commercial real estate experience',
      'Understanding of business setup in UAE',
      'Professional demeanor',
      'Strong networking skills',
      'B2B sales experience'
    ]
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    currentCompany: '',
    linkedIn: '',
    coverLetter: '',
    heardFrom: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setFormData({ ...formData, position: job.title });
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Application submitted:', formData);
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="careers-page">
      <MegaNav />
      
      <section className="careers-hero">
        <div className="careers-hero-overlay"></div>
        <div className="careers-hero-content">
          <h1>Build Your Career with White Caves</h1>
          <p>Join Dubai's fastest-growing real estate team and unlock your potential</p>
          <div className="careers-hero-stats">
            <div className="hero-stat">
              <span className="stat-number">50+</span>
              <span className="stat-text">Team Members</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">AED 2B+</span>
              <span className="stat-text">Transactions</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">100%</span>
              <span className="stat-text">Growth Support</span>
            </div>
          </div>
        </div>
      </section>

      {submitted && (
        <div className="careers-success-message">
          <div className="success-content">
            <span className="success-icon">✓</span>
            <h3>Application Submitted Successfully!</h3>
            <p>Thank you for your interest in joining White Caves Real Estate. Our HR team will review your application and contact you within 3-5 business days.</p>
          </div>
        </div>
      )}

      <section className="careers-benefits">
        <div className="careers-container">
          <h2>Why Join White Caves?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Competitive Commission</h3>
              <p>Industry-leading commission structure with uncapped earning potential</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📚</div>
              <h3>Training & Development</h3>
              <p>Comprehensive training programs and mentorship from industry experts</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏆</div>
              <h3>Recognition & Rewards</h3>
              <p>Monthly incentives, bonuses, and annual awards for top performers</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌍</div>
              <h3>Global Network</h3>
              <p>Access to international investors and premium property portfolios</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📈</div>
              <h3>Career Growth</h3>
              <p>Clear promotion pathways from agent to team leader to management</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏢</div>
              <h3>Modern Workspace</h3>
              <p>Premium office in Port Saeed with latest technology and tools</p>
            </div>
          </div>
        </div>
      </section>

      <section className="careers-openings">
        <div className="careers-container">
          <h2>Current Openings</h2>
          <p className="openings-subtitle">We're always looking for talented real estate professionals</p>
          
          <div className="jobs-grid">
            {jobPositions.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <div className="job-tags">
                    <span className="job-tag department">{job.department}</span>
                    <span className="job-tag type">{job.type}</span>
                  </div>
                </div>
                <p className="job-experience">Experience: {job.experience}</p>
                <p className="job-description">{job.description}</p>
                
                <div className="job-details">
                  <div className="job-section">
                    <h4>Key Responsibilities:</h4>
                    <ul>
                      {job.responsibilities.slice(0, 3).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="job-section">
                    <h4>Requirements:</h4>
                    <ul>
                      {job.requirements.slice(0, 3).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button className="apply-btn" onClick={() => handleApply(job)}>
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showForm && (
        <section id="application-form" className="careers-application">
          <div className="careers-container">
            <div className="application-form-wrapper">
              <div className="form-header">
                <h2>Apply for {selectedJob?.title}</h2>
                <p>Fill out the form below and our HR team will get back to you</p>
                <button className="close-form-btn" onClick={() => setShowForm(false)}>×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="application-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="name@email.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                  <div className="form-group">
                    <label>Position *</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Position</option>
                      {jobPositions.map(job => (
                        <option key={job.id} value={job.title}>{job.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Years of Experience *</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Experience</option>
                      <option value="fresher">Fresher (0-1 years)</option>
                      <option value="junior">Junior (1-3 years)</option>
                      <option value="mid">Mid-Level (3-5 years)</option>
                      <option value="senior">Senior (5-10 years)</option>
                      <option value="expert">Expert (10+ years)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Current/Previous Company</label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>LinkedIn Profile</label>
                    <input
                      type="url"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div className="form-group">
                    <label>How did you hear about us?</label>
                    <select
                      name="heardFrom"
                      value={formData.heardFrom}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Option</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="indeed">Indeed</option>
                      <option value="referral">Employee Referral</option>
                      <option value="website">Company Website</option>
                      <option value="social">Social Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Cover Letter / Why do you want to join White Caves? *</label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    placeholder="Tell us about yourself, your experience, and why you'd be a great fit for our team..."
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      <section className="careers-cta">
        <div className="careers-container">
          <div className="cta-content">
            <h2>Don't See Your Role?</h2>
            <p>We're always interested in meeting talented individuals. Send us your CV and we'll keep you in mind for future opportunities.</p>
            <div className="cta-contact">
              <div className="cta-item">
                <span className="cta-icon">📧</span>
                <span>careers@whitecaves.ae</span>
              </div>
              <div className="cta-item">
                <span className="cta-icon">📱</span>
                <span>+971 56 361 6136</span>
              </div>
              <div className="cta-item">
                <span className="cta-icon">📍</span>
                <span>Office D-72, El-Shaye-4, Port Saeed, Dubai</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="careers-footer">
        <div className="careers-container">
          <p>&copy; 2024 White Caves Real Estate LLC. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/signin">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
