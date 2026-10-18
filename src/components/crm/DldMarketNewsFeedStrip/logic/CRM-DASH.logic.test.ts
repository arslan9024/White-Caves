import { describe, expect, it } from 'vitest';
import { getUaeMarketNewsSources } from './CRM-DASH.logic';
import type { MarketNewsSource } from '../data/DldMarketNewsFeedStrip.data';

describe('getUaeMarketNewsSources', () => {
  it('indexes by country and returns only unique UAE sources', () => {
    const sources: MarketNewsSource[] = [
      {
        id: 'dld',
        countryCode: 'AE',
        copyKey: 'dldMarket',
        sourceUrl: 'https://dubailand.gov.ae/en/news-media/',
      },
      {
        id: 'global',
        countryCode: 'GB',
        copyKey: 'uaePolicy',
        sourceUrl: 'https://example.com/global',
      },
      {
        id: 'dld',
        countryCode: 'AE',
        copyKey: 'reraUpdates',
        sourceUrl: 'https://dubailand.gov.ae/en/eservices/real-estate-regulatory-agency/',
      },
    ];

    expect(getUaeMarketNewsSources(sources)).toEqual([sources[2]]);
  });

  it('returns an empty list when no UAE sources are available', () => {
    const sources: MarketNewsSource[] = [
      {
        id: 'global',
        countryCode: 'GB',
        copyKey: 'uaePolicy',
        sourceUrl: 'https://example.com/global',
      },
    ];

    expect(getUaeMarketNewsSources(sources)).toEqual([]);
  });
});
