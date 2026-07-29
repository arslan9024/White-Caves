import React, { FC, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Key,
  TrendingUp,
  FileText,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Phone,
  Shield,
  Award,
  BarChart2,
  Search,
  MessageCircle,
  Eye,
  DollarSign,
  type LucideIcon,
} from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import PublicLayout from '../components/layout/PublicLayout';
import PageHeroBanner from '../components/layout/PageHeroBanner';
import PageMeta from '../components/seo/PageMeta';
import { useToast } from '../components/Toast';
import { authFetch } from '../utils/authFetch';
import './ServicesPage.css';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Service {
  id: string;
  icon: LucideIcon;
  color: string;
  title: string;
  subtitle: string;
  subServices: string[];
  features: string[];
}

interface ProcessStep {
  step: number;
  title: string;
  icon: LucideIcon;
  desc: string;
}

interface PrimeArea {
  name: string;
  yield: string;
  yieldNum: number;
  trend: string;
}

interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface ConsultationForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: 'easeOut' } },
};

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: 'easeOut' } },
};

// ─── Static data ──────────────────────────────────────────────────────────────
const services: Service[] = [
  {
    id: 'buying',
    icon: Key,
    color: '#C9A84C',
    title: 'Buying Services',
    subtitle: 'Find Your Perfect Property',
    subServices: ['Off-plan purchases', 'Secondary market', 'New developments'],
    features: ['Market analysis', 'Negotiation support', 'Due diligence'],
  },
  {
    id: 'selling',
    icon: TrendingUp,
    color: '#10B981',
    title: 'Selling Services',
    subtitle: 'Maximize Your Property Value',
    subServices: ['Property valuation', 'Strategic marketing', 'Seamless closing'],
    features: ['Premium exposure', 'Competitive pricing', 'Quick transactions'],
  },
  {
    id: 'leasing',
    icon: FileText,
    color: '#C9A84C',
    title: 'Leasing Services',
    subtitle: 'Hassle-Free Property Rental',
    subServices: ['Residential leasing', 'Commercial leasing', 'Property management'],
    features: ['Tenant screening', 'Legal compliance', 'Maintenance support'],
  },
];

const processSteps: ProcessStep[] = [
  { step: 1, title: 'Consultation', icon: MessageCircle, desc: 'Free initial discussion' },
  { step: 2, title: 'Requirement Analysis', icon: BarChart2, desc: 'Understanding your needs' },
  { step: 3, title: 'Property Shortlisting', icon: Search, desc: 'Curated property selection' },
  { step: 4, title: 'Viewings', icon: Eye, desc: 'Scheduled property tours' },
  { step: 5, title: 'Offer & Negotiation', icon: DollarSign, desc: 'Expert deal making' },
  { step: 6, title: 'Documentation', icon: FileText, desc: 'Legal paperwork handled' },
  { step: 7, title: 'Handover', icon: Key, desc: 'Keys in your hands' },
];

const primeAreas: PrimeArea[] = [
  { name: 'Downtown Dubai', yield: '5.2%', yieldNum: 5.2, trend: '+8%' },
  { name: 'Dubai Marina', yield: '6.1%', yieldNum: 6.1, trend: '+5%' },
  { name: 'Palm Jumeirah', yield: '4.8%', yieldNum: 4.8, trend: '+12%' },
  { name: 'Business Bay', yield: '6.5%', yieldNum: 6.5, trend: '+7%' },
  { name: 'JVC', yield: '7.2%', yieldNum: 7.2, trend: '+10%' },
  { name: 'Arabian Ranches', yield: '5.0%', yieldNum: 5.0, trend: '+6%' },
];

const stats: Stat[] = [
  { value: '15+', label: 'Years Experience', icon: Award },
  { value: '500+', label: 'Properties Sold', icon: Key },
  { value: '98%', label: 'Client Satisfaction', icon: CheckCircle2 },
  { value: 'AED 2B+', label: 'Total Value Transacted', icon: TrendingUp },
];

const ServicesPage: FC = () => {
  useDocumentTitle('Our Services');
  const navigate = useNavigate();
  const toast = useToast();
  const [activeService, setActiveService] = useState<string>('offplan');
  const [formData, setFormData] = useState<ConsultationForm>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapServiceToInquiryType = (service: string): 'buy' | 'rent' | 'invest' | 'general' => {
    switch (service) {
      case 'buying':
        return 'buy';
      case 'leasing':
        return 'rent';
      case 'selling':
        return 'invest';
      default:
        return 'general';
    }
  };

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    if (!name || !email || !phone || !formData.service) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: `[Services Page — ${formData.service}] ${formData.message.trim()}`,
          inquiryType: mapServiceToInquiryType(formData.service),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          message?: string;
          error?: string;
        };
        throw new Error(data.message ?? data.error ?? 'Failed to send inquiry. Please try again.');
      }

      toast.success('Thank you for your inquiry! Our team will contact you shortly.');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send inquiry. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="services-page">
        <PageMeta
          title="Real Estate Services | White Caves Dubai"
          description="Discover White Caves buying, selling, and leasing services for Dubai luxury properties."
          canonicalPath="/services"
          ogType="website"
        />
        {/* ── Hero banner ──────────────────────────────────────────────────── */}
        <PageHeroBanner
          badge="Real Estate Services"
          title="Premium Real Estate Services in Dubai"
          subtitle="Expert guidance for buying, selling, and leasing properties in off-plan and secondary markets"
          theme="navy"
          breadcrumbs={[{ label: 'Services' }]}
        />

        {/* ── Hero CTA strip ───────────────────────────────────────────────── */}
        <div className="services-hero-cta">
          <motion.button
            className="btn-primary-red"
            whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(212,175,55,0.55)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Get Free Consultation
          </motion.button>
          <motion.button
            className="btn-secondary-outline"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
          >
            Browse Properties
          </motion.button>
        </div>

        {/* ── Services Overview ─────────────────────────────────────────────── */}
        <section className="services-overview">
          <div className="container">
            <motion.div
              className="section-header"
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="section-tag">What We Do</span>
              <h2 className="section-title">Our Services</h2>
              <p className="section-subtitle">
                Comprehensive real estate solutions tailored to your needs
              </p>
              <div className="section-divider" />
            </motion.div>

            <motion.div
              className="services-cards"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {services.map(service => {
                const ServiceIcon = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    className="service-card"
                    variants={cardVariants}
                    whileHover={{ y: -10, boxShadow: '0 24px 56px rgba(0,0,0,0.13)' }}
                    style={{ '--service-color': service.color } as React.CSSProperties}
                  >
                    <div
                      className="service-icon-wrapper"
                      style={{ background: `${service.color}18`, color: service.color }}
                    >
                      <ServiceIcon size={36} strokeWidth={1.5} />
                    </div>
                    <h3>{service.title}</h3>
                    <p className="service-subtitle">{service.subtitle}</p>
                    <div className="service-list">
                      <h4>What We Offer</h4>
                      <ul>
                        {service.subServices.map(sub => (
                          <li key={sub}>{sub}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="service-features">
                      <h4>Key Features</h4>
                      <ul>
                        {service.features.map(feature => (
                          <li key={feature}>
                            <span className="check">✓</span> {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className="btn-learn-more"
                      onClick={() =>
                        document
                          .getElementById('detailed-services')
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }
                    >
                      Learn More
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── Detailed Service Tabs ────────────────────────────────────────── */}
        <section id="detailed-services" className="detailed-services">
          <div className="container">
            <motion.div
              className="section-header"
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="section-tag">Deep Dive</span>
              <h2 className="section-title">Detailed Service Breakdown</h2>
              <div className="section-divider" />
            </motion.div>

            <div className="service-tabs">
              {(
                [
                  { key: 'offplan', label: 'Off-Plan Properties' },
                  { key: 'secondary', label: 'Secondary Market' },
                  { key: 'leasing', label: 'Leasing Services' },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  className={`tab-btn${activeService === key ? ' active' : ''}`}
                  onClick={() => setActiveService(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {activeService === 'offplan' && (
                <motion.div
                  key="offplan"
                  className="service-detail-content"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.28 }}
                >
                  <h3>Off-Plan Properties</h3>
                  <p>
                    Invest in Dubai&apos;s future with our expert off-plan property guidance. Access
                    exclusive pre-launch prices and flexible payment plans from premier developers.
                  </p>

                  <div className="process-flowchart">
                    <h4>Off-Plan Purchase Process</h4>
                    <div className="flowchart-steps">
                      {[
                        { icon: '🔍', label: 'Research' },
                        { icon: '🏗️', label: 'Selection' },
                        { icon: '📝', label: 'Booking' },
                        { icon: '💳', label: 'Payment Plan' },
                        { icon: '🔑', label: 'Handover' },
                      ].map((step, idx) => (
                        <React.Fragment key={step.label}>
                          <div className="flow-step">
                            <div className="flow-icon">{step.icon}</div>
                            <div className="flow-label">{step.label}</div>
                          </div>
                          {idx < 4 && <div className="flow-arrow">→</div>}
                        </React.Fragment>
                      ))}
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
                </motion.div>
              )}

              {activeService === 'secondary' && (
                <motion.div
                  key="secondary"
                  className="service-detail-content"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.28 }}
                >
                  <h3>Secondary Market</h3>
                  <p>
                    Move into your dream property immediately with our extensive secondary market
                    listings. Established communities, proven locations, and immediate occupancy.
                  </p>

                  <div className="comparison-table">
                    <h4>Off-Plan vs Secondary Market</h4>
                    <table aria-label="Off-plan versus secondary market comparison">
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
                </motion.div>
              )}

              {activeService === 'leasing' && (
                <motion.div
                  key="leasing"
                  className="service-detail-content"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.28 }}
                >
                  <h3>Leasing Services</h3>
                  <p>
                    Whether you&apos;re a landlord seeking reliable tenants or a tenant looking for
                    your perfect home, our leasing experts ensure a smooth, compliant process.
                  </p>

                  <div className="leasing-services-grid">
                    <div className="leasing-card">
                      <h5>🏠 Residential Leasing</h5>
                      <p>Apartments, villas, and townhouses across Dubai&apos;s prime locations</p>
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
                      <p>
                        Ejari is Dubai&apos;s official tenancy contract registration system,
                        mandatory for all rental agreements.
                      </p>
                    </div>
                    <div className="faq-item">
                      <strong>How much security deposit is required?</strong>
                      <p>
                        Typically 5% of annual rent for unfurnished and 10% for furnished
                        properties.
                      </p>
                    </div>
                    <div className="faq-item">
                      <strong>What tenant screening do you provide?</strong>
                      <p>
                        Background checks, employment verification, and previous landlord
                        references.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Market Insights ───────────────────────────────────────────────── */}
        <section className="market-insights">
          <div className="container">
            <motion.div
              className="section-header"
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="section-tag section-tag--light">Live Data</span>
              <h2 className="section-title insights-title">Dubai Market Insights</h2>
              <p className="section-subtitle insights-subtitle">
                Real-time data from Dubai&apos;s prime property locations
              </p>
              <div className="section-divider section-divider--light" />
            </motion.div>

            <motion.div
              className="areas-grid"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {primeAreas.map(area => (
                <motion.div
                  key={area.name}
                  className="area-card"
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                >
                  <h4>{area.name}</h4>
                  <div className="area-yield-bar" aria-hidden="true">
                    <div
                      className="area-yield-fill"
                      style={{ width: `${Math.min((area.yieldNum / 10) * 100, 100)}%` }}
                    />
                  </div>
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
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Process Timeline ──────────────────────────────────────────────── */}
        <section className="process-timeline">
          <div className="container">
            <motion.div
              className="section-header"
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="section-tag">How We Work</span>
              <h2 className="section-title">Our Client Journey</h2>
              <p className="section-subtitle">A seamless process from consultation to handover</p>
              <div className="section-divider" />
            </motion.div>

            <motion.div
              className="timeline"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {processSteps.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <motion.div key={step.title} className="timeline-step" variants={cardVariants}>
                    <div className="step-number">{step.step}</div>
                    <div className="step-icon-wrapper">
                      <StepIcon size={22} strokeWidth={1.8} />
                    </div>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                    {i < processSteps.length - 1 && (
                      <div className="timeline-connector" aria-hidden="true" />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── Trust Indicators ──────────────────────────────────────────────── */}
        <section className="trust-indicators">
          <div className="container">
            <motion.div
              className="section-header"
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="section-tag">Our Track Record</span>
              <h2 className="section-title">Why Choose White Caves</h2>
              <div className="section-divider" />
            </motion.div>

            <motion.div
              className="stats-grid"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {stats.map(stat => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="stat-card"
                    variants={cardVariants}
                    whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
                  >
                    <div className="stat-icon-wrapper">
                      <StatIcon size={26} strokeWidth={1.6} />
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              className="certifications"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <motion.div
                className="cert-badge"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Shield size={22} className="cert-icon-svg" />
                <span>RERA Certified</span>
              </motion.div>
              <motion.div
                className="cert-badge"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Award size={22} className="cert-icon-svg" />
                <span>DLD Licensed</span>
              </motion.div>
              <motion.div
                className="cert-badge"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle2 size={22} className="cert-icon-svg" />
                <span>DTCM Approved</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Contact + CTA Form ────────────────────────────────────────────── */}
        <section id="contact-section" className="cta-section">
          <div className="container">
            <div className="cta-content">
              <motion.div
                className="cta-text"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2>Ready to Begin Your Dubai Property Journey?</h2>
                <p>Get expert guidance from our team of certified real estate professionals</p>
                <div className="contact-info">
                  <p>
                    <MapPin size={16} className="contact-icon" aria-hidden="true" />
                    Office D-72, El-Shaye-4, Port Saeed, Dubai
                  </p>
                  <p>
                    <Phone size={16} className="contact-icon" aria-hidden="true" />
                    +971 56 361 6136
                  </p>
                  <p>
                    <ArrowRight size={16} className="contact-icon" aria-hidden="true" />
                    +971 56 361 6136
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="cta-form"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
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
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
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
                    rows={3}
                  />
                  <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Send Inquiry'}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default ServicesPage;
