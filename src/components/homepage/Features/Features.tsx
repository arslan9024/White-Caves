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
  tone: 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'whatsapp';
  detail: FeatureDetail;
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: 'AI-Powered Matching',
    description:
      'Intelligent property recommendations tailored to your preferences, budget, and investment goals.',
    tone: 'red',
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
    tone: 'whatsapp',
    detail: {
      details:
        'Connect directly with your dedicated agent on WhatsApp within minutes. No forms, no waiting — real conversations with licensed professionals.',
      cta: { text: 'Chat on WhatsApp', link: '/owner/whatsapp' },
    },
  },
  {
    icon: CheckCircle2,
    title: 'RERA Compliant',
    description:
      'Fully licensed and regulated by Dubai Real Estate Regulatory Agency for complete peace of mind.',
    tone: 'green',
    detail: {
      details:
        'White Caves operates as a RERA-compliant real estate brokerage in Dubai. All listings are verified and our agents are registered with DLD.',
      cta: { text: 'View Our Credentials', link: '/about' },
    },
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description:
      'Browse properties and communicate with our team in English, Arabic, and other languages.',
    tone: 'blue',
    detail: {
      details:
        'Full support for English and Arabic with more languages coming. Our team includes speakers of 12+ languages.',
      cta: { text: 'Meet Our Team', link: '/about' },
    },
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description:
      "Round-the-clock customer support and property inquiries — we're always here to assist you.",
    tone: 'purple',
    detail: {
      details: 'Our AI assistant Zoe is always on. Human agents are available 9am-10pm Dubai time.',
      cta: { text: 'Contact Us', link: '/contact' },
    },
  },
  {
    icon: Search,
    title: 'Verified Listings',
    description:
      'Every property is thoroughly verified and updated in real-time for accuracy and transparency.',
    tone: 'orange',
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
          {features.map((feature, idx) => {
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
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(feature.title);
                  }
                }}
              >
                <span className="feature-number">{String(idx + 1).padStart(2, '0')}</span>
                <div className={`feature-icon-wrapper feature-icon-wrapper--${feature.tone}`}>
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
                      className="feature-detail-panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <div
                        className={`feature-detail-content feature-detail-content--${feature.tone}`}
                      >
                        <p className="feature-detail-text">{feature.detail.details}</p>
                        <a
                          href={feature.detail.cta.link}
                          className={`feature-detail-cta feature-detail-cta--${feature.tone}`}
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
