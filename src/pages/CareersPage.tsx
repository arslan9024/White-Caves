import React, { FC } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import AppLayout from '../components/layout/AppLayout';
import './CareersPage.css';

interface JobPosition {
  id: number;
  title: string;
  department: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

interface CareersPageProps {}

const CareersPage: FC<CareersPageProps> = () => {
  useDocumentTitle('Careers');

  const jobPositions: JobPosition[] = [
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
    }
  ];

  return (
    <AppLayout>
      <div className="careers-page">
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
                <p>Comprehensive training programs and mentorship from experienced professionals</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🏆</div>
                <h3>Career Growth</h3>
                <p>Clear career progression paths to management and leadership positions</p>
              </div>
            </div>
          </div>
        </section>

        <section className="careers-positions">
          <div className="careers-container">
            <h2>Open Positions</h2>
            <div className="positions-list">
              {jobPositions.map(job => (
                <div key={job.id} className="position-card">
                  <div className="position-header">
                    <h3>{job.title}</h3>
                    <span className="position-meta">{job.type} • {job.experience}</span>
                  </div>
                  <p className="position-desc">{job.description}</p>
                  <a
                    className="apply-btn"
                    href={`mailto:careers@whitecaves.ae?subject=Application: ${encodeURIComponent(job.title)}&body=${encodeURIComponent(`Hi,\n\nI would like to apply for the ${job.title} position.\n\nBest regards`)}`}
                    aria-label={`Apply for ${job.title} position`}
                  >
                    Apply Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default CareersPage;
