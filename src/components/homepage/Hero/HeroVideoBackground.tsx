import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './Hero.css';

interface HeroVideoBackgroundProps {
  y: any; // MotionValue
}

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({ y }) => {
  const prefersReducedMotion = useReducedMotion();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  // Detect slow connections (2G/3G/Save-Data) to optimize LCP and save mobile data
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === '3g') {
        setIsSlowConnection(true);
      }
    }
  }, []);

  const posterUrl =
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  return (
    <div className="hero-background">
      <motion.div className="hero-bg-image" style={{ y }}>
        {!prefersReducedMotion && !isSlowConnection ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`hero-video transition-opacity duration-700 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
            poster={posterUrl}
          >
            {/* Adaptive Bitrate Streaming Sources (1080p Desktop -> 720p Mobile) */}
            <source
              src="https://cdn.coverr.co/videos/coverr-dubai-marina-at-night-4286/1080p.mp4"
              type="video/mp4"
              media="(min-width: 1024px)"
            />
            <source
              src="https://cdn.coverr.co/videos/coverr-dubai-marina-at-night-4286/720p.mp4"
              type="video/mp4"
            />
          </video>
        ) : null}

        {/* Fallback Static Image for Reduced Motion or Slow Networks */}
        {(!isVideoLoaded || prefersReducedMotion || isSlowConnection) && (
          <img
            src={posterUrl}
            alt="Dubai Prime Skyline"
            aria-hidden="true"
            className="hero-video object-cover w-full h-full"
            loading="eager"
          />
        )}
      </motion.div>
      <div className="hero-overlay" />
      <div className="hero-gradient-overlay" />
    </div>
  );
};
