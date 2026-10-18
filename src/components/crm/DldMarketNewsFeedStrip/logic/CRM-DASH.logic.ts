import { useMemo } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import arabicCopy from '../data/ar.json';
import englishCopy from '../data/en.json';
import {
  DLD_MARKET_NEWS_SOURCES,
  type MarketNewsSource,
} from '../data/DldMarketNewsFeedStrip.data';

export type MarketNewsFeedStatus = 'loading' | 'error' | 'empty' | 'ready';

export interface UseDldMarketNewsFeedStripOptions {
  sourceItems?: readonly MarketNewsSource[];
  isLoading?: boolean;
  hasError?: boolean;
}

export function getUaeMarketNewsSources(
  sourceItems: readonly MarketNewsSource[]
): MarketNewsSource[] {
  const newsMapIndexHash = new Map<string, Map<string, MarketNewsSource>>();

  for (const sourceItem of sourceItems) {
    const countryItems =
      newsMapIndexHash.get(sourceItem.countryCode) ?? new Map<string, MarketNewsSource>();
    countryItems.set(sourceItem.id, sourceItem);
    newsMapIndexHash.set(sourceItem.countryCode, countryItems);
  }

  return Array.from(newsMapIndexHash.get('AE')?.values() ?? []);
}

export function useDldMarketNewsFeedStripLogic(options: UseDldMarketNewsFeedStripOptions = {}) {
  const { language, isRTL } = useLanguage();
  const copy = language === 'ar' ? arabicCopy : englishCopy;
  const sourceItems = options.sourceItems ?? DLD_MARKET_NEWS_SOURCES;
  const newsItems = useMemo(
    () =>
      getUaeMarketNewsSources(sourceItems).map(sourceItem => {
        const article = copy.articles[sourceItem.copyKey];

        return {
          ...article,
          id: sourceItem.id,
          sourceUrl: sourceItem.sourceUrl,
          readLabel: `${copy.readSource}: ${article.source}`,
        };
      }),
    [copy, sourceItems]
  );
  const status: MarketNewsFeedStatus = options.isLoading
    ? 'loading'
    : options.hasError
      ? 'error'
      : newsItems.length === 0
        ? 'empty'
        : 'ready';
  const statusMessage =
    status === 'loading'
      ? copy.loading
      : status === 'error'
        ? copy.error
        : status === 'empty'
          ? copy.empty
          : null;

  return {
    copy,
    isRTL,
    language: language === 'ar' ? 'ar' : 'en',
    newsItems,
    status,
    statusMessage,
  };
}
