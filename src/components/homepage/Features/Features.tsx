import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Globe,
  Clock,
  Search,
  LucideIcon,
  ChevronUp,
} from 'lucide-react';
import './Features.css';

interface FeatureDetail {
  details: string;
  cta: { text: string; link: string };
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  detail: FeatureDetail;
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: 'AI-Powered Matching',
    description:
      'Intelligent property recommendations tailored to your preferences, budget, and investment goals.',
    color: '#E31E24',
    detail: {
      details:
        'Our ML algorithm analyzes 50+ property attributes against your preferences to surface the most relevant listings. Updated daily with new market data.',
      cta: { text: 'Try Property Search', link: '/properties' },
    },
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp-First Communication',
    description:
      'Direct messaging with agents on WhatsApp for instant answers to your property questions.',
    color: '#25D366',
    detail: {
      details:
        'Connect directly with your dedicated agent on WhatsApp within minutes. No forms, no waiting — real conversations with licensed professionals.',
      cta: { text: 'Chat on WhatsApp', link: '#chat' },
    },
  },
  {
    icon: CheckCircle2,
    title: 'RERA Compliant',
    description:
      'Fully licensed and regulated by Dubai Real Estate Regulatory Agency for complete peace of mind.',
    color: '#10B981',
    detail: {
      details:
        'White Caves holds RERA license #XXXX. All listings are verified and agents are registered with DLD.',
      cta: { text: 'View Our Credentials', link: '/about' },
    },
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description:
      'Browse properties and communicate with our team in English, Arabic, and other languages.',
    color: '#3B82F6',
    detail: {
      details:
        'Full support for English and Arabic with more languages coming. Our team includes speakers of 12+ languages.',
      cta: { text: 'Meet Our Team', link: '#team' },
    },
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description:
      'Round-the-clock customer support and property inquiries &mdash; we&apos;re always here to assist you.',
    color: '#8B5CF6',
    detail: {
      details:
        'Our AI assistant Zoe is always on. Human agents are available 9am-10pm Dubai time.',
      cta: { text: 'Contact Us', link: '/contact' },
    },
  },
  {
    icon: Search,
    title: 'Verified Listings',
    description:
      'Every property is thoroughly verified and updated in real-time for accuracy and transparency.',
    color: '#F59E0B',
    detail: {
      details:
        'Every listing goes through a 5-step verification: agent license check, title deed validation, site visit, pricing audit, and photo authentication.',
      cta: { text: 'Browse Properties', link: '/properties' },
    },
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
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);

  const handleCardClick = (title: string) => {
    setExpandedTitle(prev => (prev === title ? null : title));
  };

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
          {features.map(feature => {
            const isOpen = expandedTitle === feature.title;
            return (
              <motion.div
                key={feature.title}
                className="feature-card"
                variants={cardVariants}
                whileHover={isOpen ? {} : { y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                onClick={() => handleCardClick(feature.title)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                style={{ cursor: 'pointer' }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(feature.title); } }}
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
                  {isOpen ? 'Collapse' : 'Learn more'}
                  <span className="arrow">{isOpen ? <ChevronUp size={14} /> : <>&#8594;</>}</span>
                </motion.span>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <div style={{
                        borderTop: `2px solid ${feature.color}30`,
                        marginTop: '0.75rem',
                        paddingTop: '0.75rem',
                      }}>
                        <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                          {feature.detail.details}
                        </p>
                        <a
                          href={feature.detail.cta.link}
                          style={{
                            display: 'inline-block',
                            padding: '0.4rem 1rem',
                            background: feature.color,
                            color: '#fff',
                            borderRadius: 20,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          {feature.detail.cta.text}
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
