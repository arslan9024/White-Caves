import React, { type FC } from 'react';
import { ArrowUpRight, Newspaper } from 'lucide-react';
import {
  useDldMarketNewsFeedStripLogic,
  type UseDldMarketNewsFeedStripOptions,
} from './logic/CRM-DASH.logic';
import {
  NewsCategory,
  NewsFeedDescription,
  NewsFeedFooter,
  NewsFeedHeader,
  NewsFeedItem,
  NewsFeedList,
  NewsFeedSection,
  NewsFeedStatus,
  NewsFeedTitle,
  NewsHeadline,
  NewsSource,
  NewsSummary,
  ScopeBadge,
  SourceLink,
} from './styles/DldMarketNewsFeedStrip.style';

export const DldMarketNewsFeedStrip: FC<UseDldMarketNewsFeedStripOptions> = options => {
  const { copy, isRTL, language, newsItems, status, statusMessage } =
    useDldMarketNewsFeedStripLogic(options);

  return (
    <NewsFeedSection
      aria-labelledby="dld-market-news-title"
      data-testid="dld-market-news-feed"
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
    >
      <NewsFeedHeader>
        <NewsFeedTitle id="dld-market-news-title">
          <Newspaper aria-hidden="true" size={20} />
          {copy.title}
        </NewsFeedTitle>
        <ScopeBadge>{copy.scope}</ScopeBadge>
      </NewsFeedHeader>
      <NewsFeedDescription>{copy.description}</NewsFeedDescription>

      {status === 'ready' ? (
        <NewsFeedList aria-label={copy.title}>
          {newsItems.map(item => (
            <NewsFeedItem key={item.id}>
              <NewsCategory>{item.category}</NewsCategory>
              <NewsHeadline>{item.title}</NewsHeadline>
              <NewsSummary>{item.description}</NewsSummary>
              <NewsFeedFooter>
                <NewsSource>{item.source}</NewsSource>
                <SourceLink
                  aria-label={item.readLabel}
                  href={item.sourceUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {copy.readSource}
                  <ArrowUpRight aria-hidden="true" size={16} />
                </SourceLink>
              </NewsFeedFooter>
            </NewsFeedItem>
          ))}
        </NewsFeedList>
      ) : (
        <NewsFeedStatus
          aria-live={status === 'error' ? undefined : 'polite'}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {statusMessage}
        </NewsFeedStatus>
      )}
    </NewsFeedSection>
  );
};

export default DldMarketNewsFeedStrip;
