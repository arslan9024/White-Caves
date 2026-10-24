/**
 * @component LuxuryHeroSection
 * @agent @Una (Luxury UI/UX Specialist)
 * @milestone MILESTONE-HERO
 *
 * White Caves Hero — Red / White / Slate palette
 * Four-way: View + logic/HERO.logic + styles/HERO.style + data/*
 * Dark/light via ThemeContext · EN/AR RTL · reduced motion
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Phone, Star, Shield, Award, Sun, Moon } from 'lucide-react';
import type { HeroMarketStats } from './data/HERO.data';
import {
  heroContainerVariants,
  heroItemVariants,
  heroOrbVariants,
  heroStatCardVariants,
  heroStatsContainerVariants,
  useAnimatedCounter,
  useHeroSectionLogic,
} from './logic/HERO.logic';
import { HERO_COUNTER_DURATION } from './data/HERO.data';
import { heroLayerStyle } from './styles/HERO.style';

interface AnimatedRedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  language: string;
  reducedMotion: boolean;
}

interface LuxuryStatCard {
  number: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel?: string;
  icon: 'star' | 'award' | 'shield' | 'search';
}

export interface LuxuryHeroSectionProps {
  marketStats?: HeroMarketStats;
  isLoading?: boolean;
  onSearchClick?: () => void;
}

const StatIcon: React.FC<{ icon: LuxuryStatCard['icon'] }> = ({ icon }) => {
  if (icon === 'award') return <Award size={16} aria-hidden="true" />;
  if (icon === 'shield') return <Shield size={16} aria-hidden="true" />;
  if (icon === 'search') return <Search size={16} aria-hidden="true" />;
  return <Star size={16} aria-hidden="true" />;
};

const AnimatedRedCounter: React.FC<AnimatedRedCounterProps> = ({
  end,
  duration = HERO_COUNTER_DURATION,
  suffix = '',
  prefix = '',
  language,
  reducedMotion,
}) => {
  const { count, ref } = useAnimatedCounter(end, duration, reducedMotion);

  return (
    <span ref={ref}>
      {prefix}
      {new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE').format(count)}
      {suffix}
    </span>
  );
};

export const LuxuryHeroSection: React.FC<LuxuryHeroSectionProps> = ({
  marketStats,
  isLoading = false,
  onSearchClick,
}) => {
  const {
    availabilityText,
    copy,
    contentOpacity,
    contentY,
    developers,
    handleBookConsultation,
    handleBrowseProperties,
    handleDeveloperClick,
    handleFindRentals,
    handleThemeToggle,
    isDark,
    isRTL,
    language,
    marketAreas,
    onSearchClick: openSearch,
    prefersReducedMotion,
    skylineY,
    stats,
    scrollToContent,
  } = useHeroSectionLogic({ marketStats, onSearchClick });

  return (
    <section
      className="luxury-hero"
      id="home"
      data-testid="hero-section"
      data-theme={isDark ? 'dark' : 'light'}
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
      style={heroLayerStyle}
      aria-labelledby="luxury-hero-title"
    >
      <div className="luxury-hero__background" aria-hidden="true">
        <motion.div className="luxury-hero__skyline" style={{ y: skylineY }} aria-hidden="true" />
        <img
          src="/images/dubai-skyline.jpg"
          alt=""
          aria-hidden="true"
          className="luxury-hero__lcp-image"
        />
        <div className="luxury-hero__overlay-dark" />
        <div className="luxury-hero__overlay-gradient" />
        <div className="luxury-hero__overlay-vignette" />
        <motion.div
          className="luxury-hero__orb luxury-hero__orb--1"
          variants={heroOrbVariants}
          animate={prefersReducedMotion ? {} : 'animate'}
        />
        <motion.div
          className="luxury-hero__orb luxury-hero__orb--2"
          variants={heroOrbVariants}
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
        <div className="luxury-hero__lines" aria-hidden="true">
          <div className="luxury-hero__line luxury-hero__line--1" />
          <div className="luxury-hero__line luxury-hero__line--2" />
          <div className="luxury-hero__line luxury-hero__line--3" />
        </div>
      </div>

      <button
        type="button"
        className="luxury-hero__theme-toggle"
        onClick={handleThemeToggle}
        aria-label={isDark ? copy.switchToLight : copy.switchToDark}
        aria-pressed={isDark}
      >
        {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
      </button>

      <motion.div
        className="luxury-hero__content container"
        style={{ opacity: contentOpacity, y: contentY }}
        variants={heroContainerVariants}
        initial={prefersReducedMotion ? false : 'hidden'}
        animate="visible"
      >
        <motion.div className="luxury-hero__pill" variants={heroItemVariants} role="status">
          <span className="luxury-hero__pill-dot" aria-hidden="true" />
          <span className="luxury-hero__pill-text">{availabilityText}</span>
          <span className="luxury-hero__pill-arrow" aria-hidden="true">
            ›
          </span>
        </motion.div>

        <motion.h1
          id="luxury-hero-title"
          className="luxury-hero__title"
          variants={heroItemVariants}
        >
          <span className="luxury-hero__title-line luxury-hero__title-line--light">
            {copy.titleLineOne}
          </span>
          <span className="luxury-hero__title-line luxury-hero__title-line--red">
            {copy.titleLineTwo}
          </span>
          <span className="luxury-hero__title-line luxury-hero__title-line--light">
            {copy.titleLineThree}
          </span>
        </motion.h1>

        <motion.div
          className="luxury-hero__market-ribbon"
          variants={heroItemVariants}
          aria-label={copy.marketLabel}
        >
          {marketAreas.map((area, index) => (
            <React.Fragment key={area.label}>
              {index > 0 && (
                <span className="luxury-hero__ribbon-divider" aria-hidden="true">
                  ·
                </span>
              )}
              <div className="luxury-hero__ribbon-item">
                <span className="luxury-hero__ribbon-label">{area.label}</span>
                <span className="luxury-hero__ribbon-separator" aria-hidden="true">
                  |
                </span>
                <span className="luxury-hero__ribbon-value">{area.price}</span>
              </div>
            </React.Fragment>
          ))}
        </motion.div>

        <motion.p className="luxury-hero__tagline" variants={heroItemVariants}>
          {copy.tagline}
        </motion.p>

        <motion.div
          className="luxury-hero__search-wrapper"
          variants={heroItemVariants}
          aria-label={copy.searchAction}
        >
          <button
            type="button"
            className="luxury-hero__search-action"
            onClick={openSearch}
            aria-label={copy.searchAction}
          >
            <Search size={16} aria-hidden="true" />
            <span>{copy.searchAction}</span>
          </button>

          <div className="luxury-hero__developer-list">
            <span className="luxury-hero__developer-label">{copy.developerHeading}</span>
            {developers.map(dev => (
              <button
                type="button"
                key={dev}
                className="luxury-hero__developer-chip"
                onClick={() => handleDeveloperClick(dev)}
              >
                {dev}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div className="luxury-hero__cta-group" variants={heroItemVariants}>
          <motion.button
            className="luxury-hero__btn luxury-hero__btn--red"
            onClick={handleFindRentals}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            aria-label={copy.rentalsLabel}
          >
            <span>{copy.rentals}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </motion.button>

          <motion.button
            className="luxury-hero__btn luxury-hero__btn--ghost"
            onClick={handleBrowseProperties}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            aria-label={copy.browseLabel}
          >
            <Phone size={18} aria-hidden="true" />
            <span>{copy.browse}</span>
          </motion.button>

          <motion.button
            className="luxury-hero__btn luxury-hero__btn--ghost"
            onClick={handleBookConsultation}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            aria-label={copy.consultationLabel}
          >
            <Phone size={18} aria-hidden="true" />
            <span>{copy.consultation}</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="luxury-hero__stats"
          variants={heroStatsContainerVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          role="list"
          aria-label={copy.statsLabel}
        >
          {stats.map(stat => (
            <motion.div
              key={stat.label}
              className="luxury-hero__stat-card"
              variants={heroStatCardVariants}
              whileHover={
                prefersReducedMotion
                  ? {}
                  : {
                      y: -6,
                      scale: 1.03,
                    }
              }
              role="listitem"
            >
              <div className="luxury-hero__stat-icon" aria-hidden="true">
                <StatIcon icon={stat.icon} />
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
                    duration={HERO_COUNTER_DURATION}
                    suffix={stat.suffix}
                    language={language}
                    reducedMotion={Boolean(prefersReducedMotion)}
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

        <motion.div
          className="luxury-hero__trust-strip"
          variants={heroItemVariants}
          aria-label={copy.trustLabel}
        >
          <div className="luxury-hero__trust-badge">
            <Shield size={14} aria-hidden="true" />
            <span>{copy.reraLicensed}</span>
          </div>
          <div className="luxury-hero__trust-divider" aria-hidden="true" />
          <div className="luxury-hero__trust-badge">
            <Award size={14} aria-hidden="true" />
            <span>{copy.verifiedProperties}</span>
          </div>
          <div className="luxury-hero__trust-divider" aria-hidden="true" />
          <div className="luxury-hero__trust-badge">
            <Star size={14} aria-hidden="true" />
            <span>{copy.fiveStarRated}</span>
          </div>
          <div className="luxury-hero__trust-divider" aria-hidden="true" />
          <div className="luxury-hero__trust-badge">
            <Phone size={14} aria-hidden="true" />
            <span>{copy.support247}</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        className="luxury-hero__scroll-cue"
        onClick={scrollToContent}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={
          prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: [0, 1, 0.7], y: [10, 0, 4] }
        }
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
