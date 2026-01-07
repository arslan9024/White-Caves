import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Building2, Home as HomeIcon, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Locations.css';

const locations = [
  {
    id: 1,
    name: 'Palm Jumeirah',
    description: 'Iconic waterfront living with private beaches and stunning views',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    properties: 120,
    avgPrice: '15M AED',
    trend: '+12%'
  },
  {
    id: 2,
    name: 'Downtown Dubai',
    description: 'Luxury apartments with Burj Khalifa views and world-class amenities',
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    properties: 200,
    avgPrice: '8M AED',
    trend: '+8%'
  },
  {
    id: 3,
    name: 'Emirates Hills',
    description: 'Exclusive golf course villas in Dubai\'s most prestigious community',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    properties: 45,
    avgPrice: '35M AED',
    trend: '+15%'
  },
  {
    id: 4,
    name: 'Dubai Marina',
    description: 'Vibrant waterfront lifestyle with stunning marina views',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    properties: 180,
    avgPrice: '5M AED',
    trend: '+10%'
  }
];

export default function Locations() {
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  return (
    <section className="locations-section" id="locations">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Premier Locations</span>
          <h2 className="section-title">Explore Dubai's Finest Neighborhoods</h2>
          <p className="section-subtitle">
            Discover exclusive properties in the most sought-after locations across Dubai
          </p>
          <div className="divider" />
        </motion.div>

        <div className="locations-grid">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              className={`location-card ${hoveredId === location.id ? 'hovered' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(location.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(`/properties?location=${location.name}`)}
            >
              <div className="location-image-wrapper">
                <motion.img 
                  src={location.image} 
                  alt={location.name}
                  className="location-image"
                  animate={{ scale: hoveredId === location.id ? 1.1 : 1 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="location-overlay" />
                
                <div className="location-stats-floating">
                  <div className="stat-badge">
                    <Building2 size={14} />
                    {location.properties} Properties
                  </div>
                  <div className="stat-badge trend">
                    <TrendingUp size={14} />
                    {location.trend}
                  </div>
                </div>
              </div>
              
              <div className="location-content">
                <div className="location-header">
                  <MapPin size={18} className="location-pin" />
                  <h3 className="location-name">{location.name}</h3>
                </div>
                <p className="location-description">{location.description}</p>
                
                <div className="location-footer">
                  <div className="location-price">
                    <span className="price-label">Avg. Price</span>
                    <span className="price-value">{location.avgPrice}</span>
                  </div>
                  <motion.button 
                    className="location-cta"
                    whileHover={{ x: 5 }}
                  >
                    View Properties
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="locations-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/properties')}
          >
            Explore All Locations
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
