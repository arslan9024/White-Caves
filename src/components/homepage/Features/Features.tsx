import { motion, type Variants } from 'framer-motion';
import {
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Globe,
  Clock,
  Search,
  LucideIcon,
} from 'lucide-react';
import './Features.css';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: 'AI-Powered Matching',
    description:
      'Intelligent property recommendations tailored to your preferences, budget, and investment goals.',
    color: '#E31E24',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp-First Communication',
    description:
      'Direct messaging with agents on WhatsApp for instant answers to your property questions.',
    color: '#25D366',
  },
  {
    icon: CheckCircle2,
    title: 'RERA Compliant',
    description:
      'Fully licensed and regulated by Dubai Real Estate Regulatory Agency for complete peace of mind.',
    color: '#10B981',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description:
      'Browse properties and communicate with our team in English, Arabic, and other languages.',
    color: '#3B82F6',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description:
      'Round-the-clock customer support and property inquiries — we\'re always here to assist you.',
    color: '#8B5CF6',
  },
  {
    icon: Search,
    title: 'Verified Listings',
    description:
      'Every property is thoroughly verified and updated in real-time for accuracy and transparency.',
    color: '#F59E0B',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const Features = () => {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Our Services</span>
          <h2 className="section-title">Why Choose White Caves?</h2>
          <p className="section-subtitle">
            Comprehensive real estate solutions tailored to your needs in Dubai&apos;s luxury
            property market
          </p>
          <div className="divider" />
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map(feature => (
            <motion.div
              key={feature.title}
              className="feature-card"
              variants={cardVariants}
              whileHover={{
                y: -10,
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              }}
            >
              <div
                className="feature-icon-wrapper"
                style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
              >
                <feature.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <motion.span
                className="feature-link"
                whileHover={{ x: 5 }}
                role="text"
                aria-label={`Learn more about ${feature.title}`}
              >
                Learn more
                <span className="arrow">&#8594;</span>
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
