import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useLanguage } from '../../../../context/LanguageContext';
import { useTheme } from '../../../../context/ThemeContext';
import { trackHomepageEvent } from '../../../../utils/homepageTracking';
import {
  HERO_COPY,
  HERO_DEVELOPERS,
  HERO_MARKET_AREAS,
  HERO_STATS,
  type HeroMarketStats,
} from '../data/HERO.data';

export function useAnimatedCounter(end: number, duration: number, reducedMotion: boolean) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    if (reducedMotion) {
      setCount(end);
      return;
    }

    let startTime: number | undefined;
    let animationFrame: number;
    const animate = (timestamp: number): void => {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * end));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [duration, end, hasStarted, reducedMotion]);

  return { count, ref };
}

export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
};

export const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

export const heroStatCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export const heroStatsContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } },
};

export const heroOrbVariants: Variants = {
  animate: {
    y: [0, -24, 0],
    x: [0, 12, 0],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
  },
};

interface UseHeroSectionLogicParams {
  marketStats?: HeroMarketStats;
  onSearchClick?: () => void;
}

export function useHeroSectionLogic({ marketStats, onSearchClick }: UseHeroSectionLogicParams) {
  const navigate = useNavigate();
  const { language, isRTL, formatNumber } = useLanguage();
  const { isDark, setThemeMode } = useTheme();
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const copy = HERO_COPY[language === 'ar' ? 'ar' : 'en'];

  const skylineY = useTransform(scrollY, [0, 600], [0, prefersReducedMotion ? 0 : 160]);
  const contentOpacity = useTransform(scrollY, [0, 380], [1, prefersReducedMotion ? 1 : 0]);
  const contentY = useTransform(scrollY, [0, 380], [0, prefersReducedMotion ? 0 : -40]);

  const stats = HERO_STATS.map(stat => {
    const number =
      stat.number === 'properties'
        ? (marketStats?.totalProperties ?? 500)
        : stat.number === 'agents'
          ? (marketStats?.activeAgents ?? 50)
          : stat.number === 'clients'
            ? 1000
            : 15;

    return {
      number,
      suffix: stat.suffix,
      label: copy[stat.label],
      sublabel: copy[stat.sublabel],
      icon: stat.icon,
    };
  });

  const marketAreas = HERO_MARKET_AREAS.map(area => {
    const amount =
      area.usesAverage && marketStats?.averagePrice
        ? marketStats.averagePrice / 1_000_000
        : area.minimumPrice;
    const formattedAmount = new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amount);

    return {
      label: copy[area.label],
      price: `${area.usesAverage && marketStats?.averagePrice ? copy.marketAverage : copy.marketFrom} AED ${formattedAmount}M`,
    };
  });

  const availabilityText = marketStats?.totalProperties
    ? copy.availabilityCount.replace('{count}', formatNumber(marketStats.totalProperties))
    : copy.availabilityFallback;

  const navigateTo = useCallback(
    (ctaId: string, destination: string, ctaLabel: string, ctaVariant: string) => {
      trackHomepageEvent('homepage_hero_cta_click', {
        ctaId,
        ctaLabel,
        ctaVariant,
        destination,
        section: 'luxury_hero',
      });
      navigate(destination);
    },
    [navigate]
  );

  const handleFindRentals = useCallback(
    () => navigateTo('find-rentals', '/properties?mode=rent', copy.rentals, 'primary'),
    [copy.rentals, navigateTo]
  );
  const handleBrowseProperties = useCallback(
    () => navigateTo('browse-properties', '/properties', copy.browse, 'secondary'),
    [copy.browse, navigateTo]
  );
  const handleBookConsultation = useCallback(
    () => navigateTo('book-consultation', '/contact', copy.consultation, 'secondary'),
    [copy.consultation, navigateTo]
  );
  const handleDeveloperClick = useCallback(
    (developer: string) => navigate(`/properties?developer=${encodeURIComponent(developer)}`),
    [navigate]
  );
  const scrollToContent = useCallback(() => {
    document.getElementById('features')?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [prefersReducedMotion]);

  const handleThemeToggle = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark');
  }, [isDark, setThemeMode]);

  return {
    availabilityText,
    copy,
    contentOpacity,
    contentY,
    developers: HERO_DEVELOPERS,
    handleBookConsultation,
    handleBrowseProperties,
    handleDeveloperClick,
    handleFindRentals,
    handleThemeToggle,
    isDark,
    isRTL,
    language,
    marketAreas,
    onSearchClick,
    prefersReducedMotion,
    skylineY,
    stats,
    scrollToContent,
  };
}
