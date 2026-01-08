import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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

const TypewriterText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  
  return <span>{displayText}<span className="typewriter-cursor">|</span></span>;
};

export default function Hero() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user?.currentUser);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const stats = [
    { number: 500, suffix: '+', label: 'Premium Properties' },
    { number: 1000, suffix: '+', label: 'Happy Clients' },
    { number: 15, suffix: '+', label: 'Years Experience' },
    { number: 50, suffix: '+', label: 'Expert Agents' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const handleGetStarted = () => {
    navigate(user ? '/select-role' : '/signin');
  };

  const scrollToContent = () => {
    const nextSection = document.getElementById('features');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-background">
        <motion.div 
          className="hero-bg-image"
          style={{ y }}
        />
        <div className="hero-overlay" />
        <div className="hero-gradient-overlay" />
      </div>

      <div className="floating-shapes">
        <motion.div 
          className="shape shape-1"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="shape shape-2"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="shape shape-3"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="shape shape-4"
          animate={{ 
            x: [0, 15, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div 
        className="hero-content container"
        style={{ opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-badge" variants={itemVariants}>
          <span className="badge-icon">&#9733;</span>
          Trusted by 1000+ Clients in Dubai
        </motion.div>

        <motion.h1 className="hero-title" variants={itemVariants}>
          Find Your Dream
          <span className="gradient-text"> Luxury Home</span>
          <br />in Dubai
        </motion.h1>

        <motion.p className="hero-description" variants={itemVariants}>
          Experience unparalleled luxury living in Dubai's most prestigious locations.
          White Caves Real Estate brings you exclusive properties with world-class amenities.
        </motion.p>

        <motion.div className="hero-cta-group" variants={itemVariants}>
          <motion.button 
            className="btn btn-primary btn-lg hero-btn-primary"
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(211, 47, 47, 0.4)" }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
            <ArrowRight size={20} />
          </motion.button>
          
          <motion.button 
            className="btn btn-outline-white btn-lg hero-btn-secondary"
            onClick={() => navigate('/properties')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play size={20} />
            View Properties
          </motion.button>
        </motion.div>

        <motion.div 
          className="hero-stats-grid"
          variants={itemVariants}
        >
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
        </motion.div>

        <motion.div 
          className="hero-trust-badges"
          variants={itemVariants}
        >
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
        </motion.div>
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
