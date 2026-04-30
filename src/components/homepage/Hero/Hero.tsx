import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MarketStats } from '../../../store/slices/homepageSlice';
import { useLanguage } from '../../../context/LanguageContext';
import HeroSearchBar from './HeroSearchBar';
import './Hero.css';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

interface Stat {
  number: number;
  suffix: string;
  prefix?: string;
  label: string;
}

interface HeroProps {
  marketStats?: MarketStats;
  isLoading?: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
}) => {
  const [count, setCount] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Start the counter only when it enters the viewport
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
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | undefined;
    let animationFrame: number;

    const animate = (timestamp: number): void => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const Hero = ({ marketStats, isLoading = false }: HeroProps) => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const prefersReducedMotion = useReducedMotion();
  const { t } = useLanguage();

  // Live stats from API, fallback to static values for instant render
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
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeInOut' },
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
      <div className="hero-background">
        <motion.div className="hero-bg-image" style={{ y }} />
        {/* Hidden eager-loaded img for LCP — browser prioritises this over CSS background-image */}
        <img
          src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt=""
          aria-hidden="true"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore fetchpriority is a valid HTML attribute in modern browsers
          fetchPriority="high"
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

        <motion.div variants={itemVariants}>
          <HeroSearchBar />
        </motion.div>

        <motion.div className="hero-cta-group" variants={itemVariants}>
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

        <motion.div className="hero-stats-grid" variants={itemVariants}>
          {stats.map(stat => (
            <motion.div
              key={stat.label}
              className="hero-stat-item"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span className="hero-stat-number">
                {isLoading ? (
                  <span className="hero-stat-skeleton" aria-hidden="true" />
                ) : (
                  <AnimatedCounter
                    end={stat.number}
                    duration={2000}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                )}
              </span>
              <span className="hero-stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

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
