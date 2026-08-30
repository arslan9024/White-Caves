import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './Hero.css';

interface HeroVideoBackgroundProps {
  y: any; // MotionValue
}

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({ y }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="hero-background">
      <motion.div className="hero-bg-image" style={{ y }}>
        {!prefersReducedMotion && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hero-video"
            poster="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          >
            {/* High res and low res video placeholders */}
            <source src="https://cdn.coverr.co/videos/coverr-dubai-marina-at-night-4286/1080p.mp4" type="video/mp4" media="(min-width: 1024px)" />
            <source src="https://cdn.coverr.co/videos/coverr-dubai-marina-at-night-4286/720p.mp4" type="video/mp4" />
          </video>
        )}
      </motion.div>
      <img
        src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        alt=""
        aria-hidden="true"
        loading="eager"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      <div className="hero-overlay" />
      <div className="hero-gradient-overlay" />
    </div>
  );
};
