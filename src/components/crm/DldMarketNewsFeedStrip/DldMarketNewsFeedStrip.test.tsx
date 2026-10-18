import React, { type ComponentProps } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../../../context/LanguageContext';
import { DLD_MARKET_NEWS_SOURCES } from './data/DldMarketNewsFeedStrip.data';
import { DldMarketNewsFeedStrip } from './DldMarketNewsFeedStrip';

function ArabicLanguageControl() {
  const { setLanguage } = useLanguage();
  return (
    <button onClick={() => setLanguage('ar')} type="button">
      Arabic
    </button>
  );
}

function feed(props: ComponentProps<typeof DldMarketNewsFeedStrip> = {}) {
  return (
    <LanguageProvider>
      <ArabicLanguageControl />
      <DldMarketNewsFeedStrip {...props} />
    </LanguageProvider>
  );
}

const renderFeed = (props: ComponentProps<typeof DldMarketNewsFeedStrip> = {}) =>
  render(feed(props));

describe('DldMarketNewsFeedStrip', () => {
  beforeEach(() => localStorage.setItem('whitecaves_language', 'en'));
  afterEach(() => localStorage.removeItem('whitecaves_language'));

  it('renders accessible UAE source links in English', () => {
    renderFeed();

    expect(screen.getByRole('region', { name: 'DLD Market Intelligence' })).toHaveAttribute(
      'dir',
      'ltr'
    );
    expect(screen.getByText('Dubai market reports')).toBeInTheDocument();
    expect(screen.getByText('UAE housing announcements')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(DLD_MARKET_NEWS_SOURCES.length);
    expect(screen.getAllByRole('link')[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('filters out non-UAE sources and renders Arabic RTL copy', () => {
    renderFeed({
      sourceItems: [
        ...DLD_MARKET_NEWS_SOURCES,
        {
          id: 'outside-uae',
          countryCode: 'GB',
          copyKey: 'dldMarket',
          sourceUrl: 'https://example.com/global',
        },
        { ...DLD_MARKET_NEWS_SOURCES[0] },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Arabic' }));

    expect(
      screen.getByRole('region', { name: 'معلومات سوق دائرة الأراضي والأملاك' })
    ).toHaveAttribute('dir', 'rtl');
    expect(screen.queryByRole('link', { name: /outside-uae/i })).not.toBeInTheDocument();
    expect(screen.getByText('تقارير سوق دبي')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(DLD_MARKET_NEWS_SOURCES.length);
  });

  it('renders loading, error, and empty feed states accessibly', () => {
    const { rerender } = renderFeed({ isLoading: true });
    expect(screen.getByRole('status')).toHaveTextContent('Loading UAE market updates.');

    rerender(feed({ hasError: true }));
    expect(screen.getByRole('alert')).toHaveTextContent('UAE market updates could not be loaded.');

    rerender(feed({ sourceItems: [] }));
    expect(screen.getByRole('status')).toHaveTextContent('No UAE market updates are available.');
  });
});
