import React from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MarketStats } from '../../../store/slices/homepageSlice';
import { useLanguage } from '../../../context/LanguageContext';
import './Hero.css';
import { HeroVideoBackground } from './HeroVideoBackground';
import { HeroSearchBar } from './HeroSearchBar';
import { HeroLiveStats, type Stat } from './HeroLiveStats';

interface HeroProps {
  marketStats?: MarketStats;
  isLoading?: boolean;
}

const Hero = ({ marketStats, isLoading = false }: HeroProps) => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const prefersReducedMotion = useReducedMotion();
  const { t } = useLanguage();

  const stats: Stat[] = [
    {
      number: marketStats?.totalProperties ?? 500,
      suffix: '+',
      label: t('hero.premiumProperties'),
    },
    {
      number: 1000,
      suffix: '+',
      label: t('hero.happyClients'),
    },
    { number: 15, suffix: '+', label: t('hero.yearsExperience') },
    {
      number: marketStats?.activeAgents ?? 50,
      suffix: '+',
      label: t('hero.expertAgents'),
    },
    {
      number: 10,
      suffix: 'B+',
      prefix: 'AED ',
      label: 'Managed Assets',
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, // custom ease-out
    },
  };

  const handleBrowseProperties = (): void => {
    navigate('/properties');
  };

  const handleBookConsultation = (): void => {
    navigate('/contact');
  };

  const scrollToContent = (): void => {
    const nextSection = document.getElementById('features');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section dubai-luxury-theme" id="home">
      <HeroVideoBackground y={y} />

      <div className="floating-shapes">
        <motion.div
          className="shape shape-1"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, -20, 0],
                  rotate: [0, 10, 0],
                }
          }
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="shape shape-2"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, 20, 0],
                  rotate: [0, -10, 0],
                }
          }
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="shape shape-3"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }
          }
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="shape shape-4"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: [0, 15, 0],
                  y: [0, -10, 0],
                }
          }
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
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
          {marketStats?.totalProperties
            ? t('hero.propertiesAvailable', { count: marketStats.totalProperties })
            : t('hero.trustedByClients', { count: 1000 })}
        </motion.div>

        <motion.h1 className="hero-title" variants={itemVariants}>
          {t('hero.title')}
          <span className="gradient-text"> {t('hero.titleHighlight')}</span>
          <br />
          {t('hero.titleSuffix')}
        </motion.h1>

        <motion.p className="hero-description" variants={itemVariants}>
          {t('hero.description')}
        </motion.p>

        <motion.div variants={itemVariants} className="w-full relative z-50">
          <HeroSearchBar />
        </motion.div>

        <motion.div className="hero-cta-group mt-8" variants={itemVariants}>
          <motion.button
            className="btn btn-primary btn-lg hero-btn-primary"
            onClick={handleBrowseProperties}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(227, 30, 36, 0.35)' }}
            whileTap={{ scale: 0.98 }}
          >
            {t('hero.browseProperties')}
            <ArrowRight size={20} />
          </motion.button>

          <motion.button
            className="btn btn-outline-white btn-lg hero-btn-secondary"
            onClick={handleBookConsultation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play size={20} />
            {t('hero.bookConsultation')}
          </motion.button>
        </motion.div>

        <HeroLiveStats stats={stats} isLoading={isLoading} itemVariants={itemVariants} />

        <motion.div className="hero-trust-badges" variants={itemVariants}>
          <div className="trust-badge">
            <span className="trust-icon">&#128737;</span>
            {t('hero.verifiedProperties')}
          </div>
          <div className="trust-badge">
            <span className="trust-icon">&#9989;</span>
            {t('hero.reraLicensed')}
          </div>
          <div className="trust-badge">
            <span className="trust-icon">&#128176;</span>
            {t('hero.bestValue')}
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
        <span>{t('hero.scrollToExplore')}</span>
      </motion.div>
    </section>
  );
};

export default Hero;

