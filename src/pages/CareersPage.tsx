import React, { FC, useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
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

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  currentCompany: string;
  linkedIn: string;
  coverLetter: string;
  heardFrom: string;
}

interface CareersPageProps {}

const CareersPage: FC<CareersPageProps> = () => {
  useDocumentTitle('Careers');
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
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
  const [submitted, setSubmitted] = useState<boolean>(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(scrollTimerRef.current);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApply = (job: JobPosition): void => {
    setSelectedJob(job);
    setFormData({ ...formData, position: job.title });
    setShowForm(true);
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // TODO: Wire to backend API (POST /api/careers/apply)
    setSubmitted(true);
    setShowForm(false);
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

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
                  <button
                    className="apply-btn"
                    onClick={() => handleApply(job)}
                  >
                    Apply Now
                  </button>
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
