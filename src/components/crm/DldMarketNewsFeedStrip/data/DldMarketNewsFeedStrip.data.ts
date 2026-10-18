export type MarketNewsCopyKey = 'dldMarket' | 'reraUpdates' | 'uaePolicy';

export interface MarketNewsSource {
  id: string;
  countryCode: string;
  copyKey: MarketNewsCopyKey;
  sourceUrl: string;
}

export const DLD_MARKET_NEWS_SOURCES: readonly MarketNewsSource[] = [
  {
    id: 'dld-market-reports',
    countryCode: 'AE',
    copyKey: 'dldMarket',
    sourceUrl: 'https://dubailand.gov.ae/en/news-media/',
  },
  {
    id: 'rera-regulatory-updates',
    countryCode: 'AE',
    copyKey: 'reraUpdates',
    sourceUrl: 'https://dubailand.gov.ae/en/eservices/real-estate-regulatory-agency/',
  },
  {
    id: 'uae-housing-policy',
    countryCode: 'AE',
    copyKey: 'uaePolicy',
    sourceUrl: 'https://u.ae/en/information-and-services/housing',
  },
];
