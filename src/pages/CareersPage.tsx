import React, { FC, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  DollarSign,
  BookOpen,
  TrendingUp,
  Briefcase,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import PublicLayout from '../components/layout/PublicLayout';
import PageHeroBanner from '../components/layout/PageHeroBanner';
import PageMeta from '../components/seo/PageMeta';
import { authFetch } from '../utils/authFetch';
import './CareersPage.css';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: 'easeOut' } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVar: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

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

const CareersPage: FC = () => {
  useDocumentTitle('Careers');

  const [applyingFor, setApplyingFor] = useState<string | null>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', coverLetter: '' });
  const [applyStatus, setApplyStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [applyError, setApplyError] = useState<string | null>(null);

  const handleApplySubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!applyingFor) return;
    setApplyStatus('submitting');
    setApplyError(null);
    try {
      const res = await authFetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: applyForm.name,
          email: applyForm.email,
          phone: applyForm.phone || undefined,
          position: applyingFor,
          coverLetter: applyForm.coverLetter || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setApplyStatus('success');
        setApplyForm({ name: '', email: '', phone: '', coverLetter: '' });
      } else {
        setApplyStatus('error');
        setApplyError(json.error || 'Failed to submit application. Please try again.');
      }
    } catch {
      setApplyStatus('error');
      setApplyError('Network error. Please check your connection and try again.');
    }
  };

  const closeApplyModal = (): void => {
    setApplyingFor(null);
    setApplyStatus('idle');
    setApplyError(null);
    setApplyForm({ name: '', email: '', phone: '', coverLetter: '' });
  };

  const jobPositions: JobPosition[] = [
    {
      id: 1,
      title: 'Secondary Sales Agent',
      department: 'Sales',
      type: 'Full-time',
      experience: '1-3 years',
      description:
        "Join our secondary sales team to help clients buy and sell ready properties across Dubai's premium communities.",
      responsibilities: [
        'Build and maintain client relationships',
        'Conduct property viewings and market analysis',
        'Negotiate deals and close transactions',
        'Achieve monthly sales targets',
        'Stay updated on market trends and property values',
      ],
      requirements: [
        "Valid UAE driver's license",
        'RERA certified or willing to obtain',
        'Excellent communication skills',
        'Strong negotiation abilities',
        'Previous real estate experience preferred',
      ],
    },
    {
      id: 2,
      title: 'Off-Plan Sales Consultant',
      department: 'Sales',
      type: 'Full-time',
      experience: '2-5 years',
      description:
        "Represent top developers and help investors secure the best off-plan opportunities in Dubai's newest projects.",
      responsibilities: [
        'Present new development projects to investors',
        'Analyze ROI and investment potential',
        'Build relationships with developers',
        'Manage sales pipeline from lead to close',
        'Attend project launches and exhibitions',
      ],
      requirements: [
        'Strong knowledge of Dubai real estate market',
        'Experience with off-plan sales',
        'Fluent in English, Arabic is a plus',
        'Excellent presentation skills',
        'Goal-oriented mindset',
      ],
    },
  ];

  const benefits = [
    {
      Icon: DollarSign,
      title: 'Competitive Commission',
      desc: 'Industry-leading commission structure with uncapped earning potential',
    },
    {
      Icon: BookOpen,
      title: 'Training & Development',
      desc: 'Comprehensive training programs and mentorship from experienced professionals',
    },
    {
      Icon: TrendingUp,
      title: 'Career Growth',
      desc: 'Clear career progression paths to management and leadership positions',
    },
  ];

  return (
    <PublicLayout>
      <div className="careers-page">
        <PageMeta
          title="Careers at White Caves | Dubai Real Estate Jobs"
          description="Join White Caves Real Estate in Dubai. Explore open sales and off-plan consultant roles."
          canonicalPath="/careers"
          ogType="website"
        />

        <PageHeroBanner
          badge="Join Our Team"
          title="Build Your Career with White Caves"
          subtitle="Join Dubai's fastest-growing real estate team and unlock your potential — 50+ team members, AED 2B+ in transactions"
          theme="navy"
          breadcrumbs={[{ label: 'Careers' }]}
          stat={{ value: '50+', label: 'Team Members' }}
        />

        {/* ── Benefits ──────────────────────────────────────────────── */}
        <section className="careers-benefits">
          <div className="careers-container">
            <motion.div
              className="careers-section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="careers-section-tag">Why White Caves?</span>
              <h2 className="careers-section-title">Why Join White Caves?</h2>
              <div className="careers-divider" />
            </motion.div>

            <motion.div
              className="benefits-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {benefits.map(({ Icon, title, desc }) => (
                <motion.div
                  key={title}
                  className="benefit-card"
                  variants={cardVar}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                >
                  <div className="benefit-icon-wrapper">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Positions ─────────────────────────────────────────────── */}
        <section className="careers-positions">
          <div className="careers-container">
            <motion.div
              className="careers-section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="careers-section-tag">Now Hiring</span>
              <h2 className="careers-section-title">Open Positions</h2>
              <div className="careers-divider" />
            </motion.div>

            <motion.div
              className="positions-list"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {jobPositions.map(job => (
                <motion.div key={job.id} className="position-card" variants={cardVar}>
                  <div className="position-card-icon">
                    <Briefcase size={22} strokeWidth={1.7} />
                  </div>
                  <div className="position-body">
                    <div className="position-header">
                      <h3>{job.title}</h3>
                      <span className="position-meta">
                        {job.type} &bull; {job.experience}
                      </span>
                    </div>
                    <p className="position-desc">{job.description}</p>
                    <ul className="position-highlights">
                      {job.requirements.slice(0, 3).map(req => (
                        <li key={req}>
                          <CheckCircle2 size={14} className="req-check" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    className="apply-btn"
                    onClick={() => {
                      setApplyingFor(job.title);
                      setApplyStatus('idle');
                    }}
                    aria-label={`Apply for ${job.title} position`}
                  >
                    Apply Now <ChevronRight size={16} className="apply-arrow" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      {/* ─── Apply Modal ──────────────────────────────────────────── */}
      {applyingFor && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Apply for ${applyingFor}`}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={closeApplyModal}
        >
          <div
            style={{
              background: 'var(--bg-primary, #fff)',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Apply — {applyingFor}</h2>
              <button
                onClick={closeApplyModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {applyStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2
                  size={52}
                  strokeWidth={1.5}
                  style={{ color: 'var(--accent-green, #22c55e)', marginBottom: '1rem' }}
                />
                <h3>Application Submitted!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Thank you for applying. We&apos;ll review your application and be in touch within
                  5 business days.
                </p>
                <button
                  onClick={closeApplyModal}
                  className="apply-btn"
                  style={{ display: 'inline-flex' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit}>
                {applyError && (
                  <p
                    style={{
                      color: '#B91C1C',
                      background: '#FEF2F2',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                    }}
                  >
                    {applyError}
                  </p>
                )}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applyForm.name}
                    onChange={e => setApplyForm(p => ({ ...p, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={applyForm.email}
                    onChange={e => setApplyForm(p => ({ ...p, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={applyForm.phone}
                    placeholder="+971 50 000 0000"
                    onChange={e => setApplyForm(p => ({ ...p, phone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
                    Cover Letter
                  </label>
                  <textarea
                    rows={4}
                    value={applyForm.coverLetter}
                    placeholder="Tell us why you'd be a great fit…"
                    onChange={e => setApplyForm(p => ({ ...p, coverLetter: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="apply-btn"
                  disabled={applyStatus === 'submitting'}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  {applyStatus === 'submitting' ? 'Submitting…' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

export default CareersPage;
