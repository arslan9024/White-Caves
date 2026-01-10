import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PropertySearchHero from '../PropertySearchHero';
import './Hero.css';

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return <span>{count}{suffix}</span>;
};

export default function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const stats = [
    { number: 500, suffix: '+', label: 'Premium Properties' },
    { number: 1000, suffix: '+', label: 'Happy Clients' },
    { number: 15, suffix: '+', label: 'Years Experience' },
    { number: 50, suffix: '+', label: 'Expert Agents' }
  ];

  const scrollToContent = () => {
    const nextSection = document.getElementById('features');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section hero-section-search" id="home">
      <PropertySearchHero />
      
      <motion.div 
        className="hero-stats-section"
        style={{ opacity }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="hero-stats-grid container">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="hero-stat-item"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span className="hero-stat-number">
                <AnimatedCounter end={stat.number} duration={2000} suffix={stat.suffix} />
              </span>
              <span className="hero-stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="hero-trust-badges container">
          <div className="trust-badge">
            <span className="trust-icon">&#128737;</span>
            Verified Properties
          </div>
          <div className="trust-badge">
            <span className="trust-icon">&#9989;</span>
            RERA Licensed
          </div>
          <div className="trust-badge">
            <span className="trust-icon">&#128176;</span>
            Best Value
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={scrollToContent}
      >
        <ChevronDown size={32} />
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
}
