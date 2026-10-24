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
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Search, Phone, Star, Shield, Award, Sun, Moon } from 'lucide-react';
import type { MarketStats } from '../../../store/slices/homepageSlice';
import {
  containerVariants,
  itemVariants,
  orbVariants,
  statCardVariants,
  statsContainerVariants,
  useHeroLogic,
} from './logic/HERO.logic';
import './styles/HERO.style.css';

// --- Types -------------------------------------------------------------------

interface AnimatedRedCounterProps {
  end: number;
  formatNumber: (value: number) => string;
  duration?: number;
  suffix?: string;
}

const STAT_ICONS = { star: Star, award: Award, shield: Shield, search: Search };

export interface LuxuryHeroSectionProps {
  marketStats?: MarketStats;
  isLoading?: boolean;
  onSearchClick?: () => void;
}

// --- Animated Gold Counter ---------------------------------------------------

const AnimatedRedCounter: React.FC<AnimatedRedCounterProps> = ({
  end,
  formatNumber,
  duration = 2200,
  suffix = '',
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
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

// --- Main Component ----------------------------------------------------------

export const LuxuryHeroSection: React.FC<LuxuryHeroSectionProps> = ({
  marketStats,
  isLoading = false,
  onSearchClick,
}) => {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const {
    copy,
    isDark,
    isRTL,
    language,
    formatNumber,
    markets,
    stats,
    developers,
    trustBadges,
    handleBrowseProperties,
    handleBookConsultation,
    handleFindRentals,
    handleSearchClick,
    handleScroll,
    handleThemeToggle,
  } = useHeroLogic({ marketStats, onSearchClick });

  // Parallax transforms â€” disabled on reduced motion
  const skylineY = useTransform(scrollY, [0, 600], [0, prefersReducedMotion ? 0 : 160]);
  const contentOpacity = useTransform(scrollY, [0, 380], [1, 0]);
  const contentY = useTransform(scrollY, [0, 380], [0, prefersReducedMotion ? 0 : -40]);

  return (
    <section
      className="luxury-hero"
      id="home"
      aria-label={copy.sectionLabel}
      lang={language === 'ar' ? 'ar' : 'en'}
      dir={isRTL ? 'rtl' : 'ltr'}
      data-theme={isDark ? 'dark' : 'light'}
    >
      {/* -- Background Layer ------------------------------- */}
      <div className="luxury-hero__background" aria-hidden="true">
        {/* Parallax Dubai Skyline */}
        <motion.div className="luxury-hero__skyline" style={{ y: skylineY }} aria-hidden="true" />

        {/* LCP-optimized image (invisible, browser prioritises it) — Phase 25: url must match preload href + CSS bg url */}
        <img
          src="/images/dubai-skyline.jpg"
          alt=""
          aria-hidden="true"
          className="luxury-hero__lcp-image"
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

      <button
        className="luxury-hero__theme-toggle"
        type="button"
        onClick={handleThemeToggle}
        aria-label={isDark ? copy.switchToLight : copy.switchToDark}
        aria-pressed={isDark}
      >
        {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      </button>

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
          aria-label={copy.availabilityLabel}
        >
          <span className="luxury-hero__pill-dot" aria-hidden="true" />
          <span className="luxury-hero__pill-text">
            {marketStats?.totalProperties
              ? copy.availabilityWithCount.replace(
                  '{count}',
                  formatNumber(marketStats.totalProperties)
                )
              : copy.availability}
          </span>
          <span className="luxury-hero__pill-arrow" aria-hidden="true">
            ›
          </span>
        </motion.div>

        {/* -- Hero Headline -- */}
        <motion.h1 className="luxury-hero__title" variants={itemVariants}>
          <span className="luxury-hero__title-line luxury-hero__title-line--light">
            {copy.heading[0]}
          </span>
          <span className="luxury-hero__title-line luxury-hero__title-line--red">
            {copy.heading[1]}
          </span>
          <span className="luxury-hero__title-line luxury-hero__title-line--light">
            {copy.heading[2]}
          </span>
        </motion.h1>

        {/* -- Market Price Ribbon -- */}
        <motion.div
          className="luxury-hero__market-ribbon"
          variants={itemVariants}
          aria-label={copy.marketLabel}
        >
          {markets.map(market => (
            <div className="luxury-hero__ribbon-item" key={market.name}>
              <span className="luxury-hero__ribbon-label">{market.name}</span>
              <span className="luxury-hero__ribbon-separator" aria-hidden="true">
                |
              </span>
              <span className="luxury-hero__ribbon-value">{market.price}</span>
            </div>
          ))}
        </motion.div>

        {/* -- Tagline -- */}
        <motion.p className="luxury-hero__tagline" variants={itemVariants}>
          {copy.tagline}
        </motion.p>

        {/* -- Search Bar -- */}
        <motion.div className="luxury-hero__search-wrapper" variants={itemVariants}>
          <button
            className="luxury-hero__search-button"
            type="button"
            onClick={handleSearchClick}
            aria-label={copy.search}
          >
            <span className="luxury-hero__search-icon" aria-hidden="true">
              <Search size={16} />
            </span>
            <span>{copy.searchPlaceholder}</span>
          </button>

          {/* -- Luxury Branded Developer Filter Chips (T-009) -- */}
          <div className="luxury-hero__developers">
            <span className="luxury-hero__developers-label">{copy.developersLabel}</span>
            {developers.map(developer => (
              <button
                key={developer.query}
                className="luxury-hero__developer"
                type="button"
                onClick={developer.onSelect}
              >
                {developer.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* -- CTA Buttons -- */}
        <motion.div className="luxury-hero__cta-group" variants={itemVariants}>
          <motion.button
            className="luxury-hero__btn luxury-hero__btn--red"
            onClick={handleFindRentals}
            whileHover={
              prefersReducedMotion
                ? {}
                : { scale: 1.04, boxShadow: 'var(--wc-shadow-luxury)' }
            }
            whileTap={{ scale: 0.97 }}
            aria-label={copy.findRentalsLabel}
          >
            <span>{copy.findRentals}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </motion.button>

          <motion.button
            className="luxury-hero__btn luxury-hero__btn--ghost"
            onClick={handleBrowseProperties}
            whileHover={
              prefersReducedMotion ? {} : { scale: 1.04, borderColor: 'var(--wc-red-glow)' }
            }
            whileTap={{ scale: 0.97 }}
            aria-label={copy.browsePropertiesLabel}
          >
            <Phone size={18} aria-hidden="true" />
            <span>{copy.browseProperties}</span>
          </motion.button>

          <motion.button
            className="luxury-hero__btn luxury-hero__btn--ghost"
            onClick={handleBookConsultation}
            whileHover={
              prefersReducedMotion ? {} : { scale: 1.04, borderColor: 'var(--wc-red-glow)' }
            }
            whileTap={{ scale: 0.97 }}
            aria-label={copy.bookConsultationLabel}
          >
            <Phone size={18} aria-hidden="true" />
            <span>{copy.bookConsultation}</span>
          </motion.button>
        </motion.div>

        {/* -- Gold Stat Cards -- */}
        <motion.div
          className="luxury-hero__stats"
          variants={statsContainerVariants}
          initial="hidden"
          animate="visible"
          role="list"
          aria-label={copy.statsLabel}
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
                      borderColor: 'var(--wc-red-glow)',
                      boxShadow: 'var(--wc-shadow-lg)',
                    }
              }
              transition={{ duration: 0.25 }}
              role="listitem"
            >
              <div className="luxury-hero__stat-icon" aria-hidden="true">
                {React.createElement(STAT_ICONS[stat.icon], { size: 16 })}
              </div>
              <div
                className="luxury-hero__stat-number"
                aria-label={`${formatNumber(stat.number)}${stat.suffix} ${stat.label}`}
              >
                {isLoading ? (
                  <span className="luxury-hero__stat-skeleton" aria-hidden="true" />
                ) : (
                  <AnimatedRedCounter
                    end={stat.number}
                    formatNumber={formatNumber}
                    duration={2200}
                    suffix={stat.suffix}
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
          aria-label={copy.trustLabel}
        >
          {trustBadges.map(({ label, Icon }, index) => (
            <React.Fragment key={label}>
              {index > 0 && <div className="luxury-hero__trust-divider" aria-hidden="true" />}
              <div className="luxury-hero__trust-badge">
                <Icon size={14} aria-hidden="true" />
                <span>{label}</span>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      {/* -- Scroll Indicator ------------------------------- */}
      <motion.button
        className="luxury-hero__scroll-cue"
        onClick={handleScroll}
        initial={{ opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? {} : { opacity: [0, 1, 0.7], y: [10, 0, 4] }}
        transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
        aria-label={copy.scrollLabel}
      >
        <span className="luxury-hero__scroll-text">{copy.scrollText}</span>
        <span className="luxury-hero__scroll-line" aria-hidden="true" />
      </motion.button>
    </section>
  );
};

export default LuxuryHeroSection;
