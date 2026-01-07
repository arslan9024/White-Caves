import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Key, 
  TrendingUp, 
  Shield, 
  Users, 
  Calculator,
  MapPin,
  FileText
} from 'lucide-react';
import './Features.css';

const features = [
  {
    icon: Home,
    title: 'Premium Properties',
    description: 'Access exclusive listings in Dubai\'s most prestigious neighborhoods including Palm Jumeirah, Emirates Hills, and Downtown.',
    color: '#DC2626'
  },
  {
    icon: Key,
    title: 'Rental Services',
    description: 'Find your perfect rental home with our comprehensive portfolio of furnished and unfurnished properties across Dubai.',
    color: '#F59E0B'
  },
  {
    icon: TrendingUp,
    title: 'Investment Advisory',
    description: 'Get expert guidance on property investments with market analysis, ROI projections, and portfolio management.',
    color: '#10B981'
  },
  {
    icon: Shield,
    title: 'RERA Certified',
    description: 'Fully licensed and registered with Dubai Real Estate Regulatory Agency for your peace of mind.',
    color: '#3B82F6'
  },
  {
    icon: Users,
    title: 'Expert Agents',
    description: '50+ experienced professionals dedicated to helping you find the perfect property for your needs.',
    color: '#8B5CF6'
  },
  {
    icon: Calculator,
    title: 'Financial Tools',
    description: 'Use our mortgage calculator, DLD fees estimator, and rent vs buy analyzer to make informed decisions.',
    color: '#EC4899'
  },
  {
    icon: MapPin,
    title: 'Virtual Tours',
    description: 'Experience properties from anywhere in the world with our immersive 3D virtual tour technology.',
    color: '#06B6D4'
  },
  {
    icon: FileText,
    title: 'Digital Contracts',
    description: 'Streamlined Ejari-compliant contract management with secure digital signatures and cloud storage.',
    color: '#F97316'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function Features() {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Our Services</span>
          <h2 className="section-title">Why Choose White Caves?</h2>
          <p className="section-subtitle">
            Comprehensive real estate solutions tailored to your needs in Dubai's luxury property market
          </p>
          <div className="divider" />
        </motion.div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
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
              <motion.a 
                href="#" 
                className="feature-link"
                whileHover={{ x: 5 }}
              >
                Learn more
                <span className="arrow">&#8594;</span>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
