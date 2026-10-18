import englishCopy from './en.json';
import arabicCopy from './ar.json';

export interface HeroMarketStats {
  totalProperties?: number;
  activeAgents?: number;
  averagePrice?: number;
}

export const HERO_COPY = {
  en: englishCopy,
  ar: arabicCopy,
} as const;

export const HERO_DEVELOPERS = ['Emaar', 'DAMAC', 'Nakheel', 'Meraas', 'Sobha', 'Ellington'];

export const HERO_STATS = [
  {
    number: 'properties',
    suffix: '+',
    label: 'premiumProperties',
    sublabel: 'propertiesCoverage',
    icon: 'star',
  },
  {
    number: 'clients',
    suffix: '+',
    label: 'satisfiedClients',
    sublabel: 'investorNetwork',
    icon: 'award',
  },
  { number: 'years', suffix: '+', label: 'yearsExcellence', sublabel: 'since2009', icon: 'shield' },
  {
    number: 'agents',
    suffix: '+',
    label: 'expertConsultants',
    sublabel: 'reraAgents',
    icon: 'search',
  },
] as const;

export const HERO_MARKET_AREAS = [
  { label: 'marketMarina', minimumPrice: 1.2, usesAverage: true },
  { label: 'marketDowntown', minimumPrice: 2.5, usesAverage: false },
  { label: 'marketPalm', minimumPrice: 8, usesAverage: false },
] as const;

export const HERO_COUNTER_DURATION = 2200;
