// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/**
 * @component LuxuryHeroSection
 * @agent @Una (Luxury UI/UX Specialist)
 * @milestone MILESTONE-HERO
 *
 * White Caves Hero — Red / White palette
 * Glassmorphism stat cards · Framer Motion cinematic entrance
 * Parallax Dubai skyline · Animated gold counters · Premium search bar
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Search, Phone, Star, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MarketStats } from '../../../store/slices/homepageSlice';
import HeroSearchBar from './HeroSearchBar';
import './LuxuryHeroSection.css';

// --- Types -------------------------------------------------------------------

interface AnimatedRedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

interface LuxuryStatCard {
  number: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
}

export interface LuxuryHeroSectionProps {
  marketStats?: MarketStats;
  isLoading?: boolean;
}

// --- Animated Gold Counter ---------------------------------------------------

const AnimatedRedCounter: React.FC<AnimatedRedCounterProps> = ({
  end,
  duration = 2200,
  suffix = '',
  prefix = '',
}) => {
  const [count, setCount] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | undefined;
    let animationFrame: number;

    // Ease-out cubic for luxurious deceleration feel
    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp: number): void => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(easeOutCubic(progress) * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return (
    <span ref={ref} aria-live="polite" aria-atomic="true">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// --- Animation Variants ------------------------------------------------------

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.25,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const statsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.9 },
  },
};

const orbVariants: Variants = {
  animate: {
    y: [0, -24, 0],
    x: [0, 12, 0],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
  },
};

// --- Main Component ----------------------------------------------------------

export const LuxuryHeroSection: React.FC<LuxuryHeroSectionProps> = ({
  marketStats,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // Parallax transforms â€” disabled on reduced motion
  const skylineY = useTransform(scrollY, [0, 600], [0, prefersReducedMotion ? 0 : 160]);
  const contentOpacity = useTransform(scrollY, [0, 380], [1, 0]);
  const contentY = useTransform(scrollY, [0, 380], [0, prefersReducedMotion ? 0 : -40]);

  // Stat cards data
  const stats: LuxuryStatCard[] = [
    {
      number: marketStats?.totalProperties ?? 500,
      suffix: '+',
      label: 'Premium Properties',
      sublabel: 'Across Dubai Emirates',
      icon: <Star size={16} aria-hidden="true" />,
    },
    {
      number: 1000,
      suffix: '+',
      label: 'Satisfied Clients',
      sublabel: 'Global Investor Network',
      icon: <Award size={16} aria-hidden="true" />,
    },
    {
      number: 15,
      suffix: '+',
      label: 'Years of Excellence',
      sublabel: 'Since 2009, Dubai',
      icon: <Shield size={16} aria-hidden="true" />,
    },
    {
      number: marketStats?.activeAgents ?? 50,
      suffix: '+',
      label: 'Expert Consultants',
      sublabel: 'RERA Certified Agents',
      icon: <Search size={16} aria-hidden="true" />,
    },
  ];

  const handleBrowseProperties = (): void => navigate('/properties');
  const handleBookConsultation = (): void => navigate('/contact');

  return (
    <section
      className="luxury-hero"
      id="home"
      aria-label="White Caves Real Estate — Dubai Luxury Properties Hero"
    >
      {/* -- Background Layer ------------------------------- */}
      <div className="luxury-hero__background" aria-hidden="true">
        {/* Parallax Dubai Skyline */}
        <motion.div className="luxury-hero__skyline" style={{ y: skylineY }} aria-hidden="true" />

        {/* LCP-optimized image (invisible, browser prioritises it) — Phase 25: url must match preload href + CSS bg url */}
        <img
          src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1440&q=75"
          alt=""
          aria-hidden="true"
          // eslint-disable-next-line react/no-unknown-property
          fetchpriority="high"
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        />

        {/* Overlay layers */}
        <div className="luxury-hero__overlay-dark" />
        <div className="luxury-hero__overlay-gradient" />
        <div className="luxury-hero__overlay-vignette" />

        {/* Animated gold orbs */}
        <motion.div
          className="luxury-hero__orb luxury-hero__orb--1"
          variants={orbVariants}
          animate={prefersReducedMotion ? {} : 'animate'}
        />
        <motion.div
          className="luxury-hero__orb luxury-hero__orb--2"
          variants={orbVariants}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, 20, 0],
                  x: [0, -14, 0],
                  transition: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        />
        <motion.div
          className="luxury-hero__orb luxury-hero__orb--3"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.4, 0.2],
                  transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        />

        {/* Gold particle lines */}
        <div className="luxury-hero__lines" aria-hidden="true">
          <div className="luxury-hero__line luxury-hero__line--1" />
          <div className="luxury-hero__line luxury-hero__line--2" />
          <div className="luxury-hero__line luxury-hero__line--3" />
        </div>
      </div>

      {/* -- Content Layer ---------------------------------- */}
      <motion.div
        className="luxury-hero__content container"
        style={{ opacity: contentOpacity, y: contentY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* -- Top Pill Badge -- */}
        <motion.div
          className="luxury-hero__pill"
          variants={itemVariants}
          aria-label="Property availability badge"
        >
          <span className="luxury-hero__pill-dot" aria-hidden="true" />
          <span className="luxury-hero__pill-text">
            {marketStats?.totalProperties
              ? `${marketStats.totalProperties}+ Exclusive Properties Available`
              : 'Exclusive Dubai Properties · Verified & Trusted'}
          </span>
          <span className="luxury-hero__pill-arrow" aria-hidden="true">
            ›
          </span>
        </motion.div>

        {/* -- Hero Headline -- */}
        <motion.h1 className="luxury-hero__title" variants={itemVariants}>
          <span className="luxury-hero__title-line luxury-hero__title-line--light">
            Discover Your
          </span>
          <span className="luxury-hero__title-line luxury-hero__title-line--gold">
            Dream Property
          </span>
          <span className="luxury-hero__title-line luxury-hero__title-line--light">in Dubai</span>
        </motion.h1>

        {/* -- Market Price Ribbon -- */}
        <motion.div
          className="luxury-hero__market-ribbon"
          variants={itemVariants}
          aria-label="Dubai market statistics ribbon"
        >
          <div className="luxury-hero__ribbon-item">
            <span className="luxury-hero__ribbon-label">Dubai Marina</span>
            <span className="luxury-hero__ribbon-separator" aria-hidden="true">
              |
            </span>
            <span className="luxury-hero__ribbon-value">
              {marketStats?.averagePrice
                ? `AED ${(marketStats.averagePrice / 1_000_000).toFixed(1)}M avg`
                : 'From AED 1.2M'}
            </span>
          </div>
          <span className="luxury-hero__ribbon-divider" aria-hidden="true">
            ·
          </span>
          <div className="luxury-hero__ribbon-item">
            <span className="luxury-hero__ribbon-label">Downtown Dubai</span>
            <span className="luxury-hero__ribbon-separator" aria-hidden="true">
              |
            </span>
            <span className="luxury-hero__ribbon-value">From AED 2.5M</span>
          </div>
          <span className="luxury-hero__ribbon-divider" aria-hidden="true">
            ·
          </span>
          <div className="luxury-hero__ribbon-item">
            <span className="luxury-hero__ribbon-label">Palm Jumeirah</span>
            <span className="luxury-hero__ribbon-separator" aria-hidden="true">
              |
            </span>
            <span className="luxury-hero__ribbon-value">From AED 8M</span>
          </div>
        </motion.div>

        {/* -- Tagline -- */}
        <motion.p className="luxury-hero__tagline" variants={itemVariants}>
          White Caves Real Estate — where Dubai&apos;s most coveted residences meet world-class
          expertise. Explore penthouses, villas, and off-plan investments crafted for the discerning
          few.
        </motion.p>

        {/* -- Search Bar -- */}
        <motion.div
          className="luxury-hero__search-wrapper"
          variants={itemVariants}
          aria-label="Property search section"
        >
          <HeroSearchBar />
        </motion.div>

        {/* -- CTA Buttons -- */}
        <motion.div className="luxury-hero__cta-group" variants={itemVariants}>
          <motion.button
            className="luxury-hero__btn luxury-hero__btn--gold"
            onClick={handleBrowseProperties}
            whileHover={
              prefersReducedMotion
                ? {}
                : { scale: 1.04, boxShadow: '0 12px 36px rgba(196,30,58,0.45)' }
            }
            whileTap={{ scale: 0.97 }}
            aria-label="Browse all premium Dubai properties"
          >
            <span>Browse Properties</span>
            <ArrowRight size={18} aria-hidden="true" />
          </motion.button>

          <motion.button
            className="luxury-hero__btn luxury-hero__btn--ghost"
            onClick={handleBookConsultation}
            whileHover={
              prefersReducedMotion ? {} : { scale: 1.04, borderColor: 'rgba(196,30,58,0.7)' }
            }
            whileTap={{ scale: 0.97 }}
            aria-label="Book a consultation with our Dubai property experts"
          >
            <Phone size={18} aria-hidden="true" />
            <span>Book Consultation</span>
          </motion.button>
        </motion.div>

        {/* -- Gold Stat Cards -- */}
        <motion.div
          className="luxury-hero__stats"
          variants={statsContainerVariants}
          initial="hidden"
          animate="visible"
          role="list"
          aria-label="Key performance statistics"
        >
          {stats.map(stat => (
            <motion.div
              key={stat.label}
              className="luxury-hero__stat-card"
              variants={statCardVariants}
              whileHover={
                prefersReducedMotion
                  ? {}
                  : {
                      y: -6,
                      scale: 1.03,
                      borderColor: 'rgba(196,30,58,0.6)',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.45), 0 0 20px rgba(196,30,58,0.2)',
                    }
              }
              transition={{ duration: 0.25 }}
              role="listitem"
            >
              <div className="luxury-hero__stat-icon" aria-hidden="true">
                {stat.icon}
              </div>
              <div
                className="luxury-hero__stat-number"
                aria-label={`${stat.number}${stat.suffix} ${stat.label}`}
              >
                {isLoading ? (
                  <span className="luxury-hero__stat-skeleton" aria-hidden="true" />
                ) : (
                  <AnimatedRedCounter
                    end={stat.number}
                    duration={2200}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                )}
              </div>
              <div className="luxury-hero__stat-label">{stat.label}</div>
              {stat.sublabel && (
                <div className="luxury-hero__stat-sublabel" aria-label={stat.sublabel}>
                  {stat.sublabel}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* -- Trust Badges -- */}
        <motion.div
          className="luxury-hero__trust-strip"
          variants={itemVariants}
          aria-label="Trust and certification badges"
        >
          <div className="luxury-hero__trust-badge">
            <Shield size={14} aria-hidden="true" />
            <span>RERA Licensed</span>
          </div>
          <div className="luxury-hero__trust-divider" aria-hidden="true" />
          <div className="luxury-hero__trust-badge">
            <Award size={14} aria-hidden="true" />
            <span>Verified Properties</span>
          </div>
          <div className="luxury-hero__trust-divider" aria-hidden="true" />
          <div className="luxury-hero__trust-badge">
            <Star size={14} aria-hidden="true" />
            <span>5-Star Rated</span>
          </div>
          <div className="luxury-hero__trust-divider" aria-hidden="true" />
          <div className="luxury-hero__trust-badge">
            <Phone size={14} aria-hidden="true" />
            <span>24/7 Support</span>
          </div>
        </motion.div>
      </motion.div>

      {/* -- Scroll Indicator ------------------------------- */}
      <motion.button
        className="luxury-hero__scroll-cue"
        onClick={() => {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? {} : { opacity: [0, 1, 0.7], y: [10, 0, 4] }}
        transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
        aria-label="Scroll down to explore features"
      >
        <span className="luxury-hero__scroll-text">Scroll to Explore</span>
        <span className="luxury-hero__scroll-line" aria-hidden="true" />
      </motion.button>
    </section>
  );
};

export default LuxuryHeroSection;
