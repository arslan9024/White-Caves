import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import { Award, Phone, Shield, Star } from 'lucide-react';
import { useLanguage } from '../../../../context/LanguageContext';
import { useTheme } from '../../../../context/ThemeContext';
import en from '../data/en.json';
import ar from '../data/ar.json';
import type { MarketStats } from '../../../../store/slices/homepageSlice';
import { trackHomepageEvent } from '../../../../utils/homepageTracking';

const copyByLanguage = { en, ar };

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

export const statCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export const statsContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } },
};

export const orbVariants: Variants = {
  animate: {
    y: [0, -24, 0],
    x: [0, 12, 0],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
  },
};

interface HeroLogicProps {
  marketStats?: MarketStats;
  onSearchClick?: () => void;
}

export function useHeroLogic({ marketStats, onSearchClick }: HeroLogicProps) {
  const navigate = useNavigate();
  const { language, isRTL, formatNumber } = useLanguage();
  const { isDark, setThemeMode } = useTheme();
  const copy = copyByLanguage[language === 'ar' ? 'ar' : 'en'];

  const stats = [
    { number: marketStats?.totalProperties ?? 500, suffix: '+', ...copy.stats[0], icon: 'star' },
    { number: 1000, suffix: '+', ...copy.stats[1], icon: 'award' },
    { number: 15, suffix: '+', ...copy.stats[2], icon: 'shield' },
    {
      number: marketStats?.activeAgents ?? 50,
      suffix: '+',
      ...copy.stats[3],
      icon: 'search',
    },
  ] as const;
  const trustBadges = [
    { label: copy.trust[0], Icon: Shield },
    { label: copy.trust[1], Icon: Award },
    { label: copy.trust[2], Icon: Star },
    { label: copy.trust[3], Icon: Phone },
  ];

  const markets = copy.markets.map((market, index) => ({
    ...market,
    price:
      index === 0 && marketStats?.averagePrice
        ? copy.averagePrice.replace(
            '{amount}',
            formatNumber(Number((marketStats.averagePrice / 1_000_000).toFixed(1)))
          )
        : market.price,
  }));

  const trackCta = useCallback(
    (ctaId: string, ctaLabel: string, destination: string, variant: 'primary' | 'secondary') => {
      trackHomepageEvent('homepage_hero_cta_click', {
        ctaId,
        ctaLabel,
        ctaVariant: variant,
        destination,
        section: 'luxury_hero',
      });
      navigate(destination);
    },
    [navigate]
  );

  const handleFindRentals = useCallback(
    () => trackCta('find-rentals', copy.findRentals, '/properties?mode=rent', 'primary'),
    [copy.findRentals, trackCta]
  );
  const handleBrowseProperties = useCallback(
    () => trackCta('browse-properties', copy.browseProperties, '/properties', 'secondary'),
    [copy.browseProperties, trackCta]
  );
  const handleBookConsultation = useCallback(
    () => trackCta('book-consultation', copy.bookConsultation, '/contact', 'secondary'),
    [copy.bookConsultation, trackCta]
  );
  const handleSearchClick = useCallback(() => {
    if (onSearchClick) {
      onSearchClick();
      return;
    }
    navigate('/properties');
  }, [navigate, onSearchClick]);
  const handleDeveloperClick = useCallback(
    (developer: string) => navigate(`/properties?developer=${encodeURIComponent(developer)}`),
    [navigate]
  );
  const developers = copy.developers.map(developer => ({
    label: developer.label,
    query: developer.query,
    onSelect: () => handleDeveloperClick(developer.query),
  }));
  const handleThemeToggle = useCallback(
    () => setThemeMode(isDark ? 'light' : 'dark'),
    [isDark, setThemeMode]
  );
  const handleScroll = useCallback(() => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return {
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
  };
}
