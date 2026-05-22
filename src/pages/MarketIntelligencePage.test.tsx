import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MarketIntelligencePage from './MarketIntelligencePage';

const fetchMock = vi.fn();
const mockUseLanguage = vi.fn();

vi.mock('../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../context/LanguageContext', () => ({
  LANGUAGES: { EN: 'en', AR: 'ar' },
  useLanguage: () => mockUseLanguage(),
}));

vi.mock('leaflet/dist/leaflet.css', () => ({}));

vi.mock('../components/maps/MarketChoroplethMap', () => ({
  default: ({ rows }: { rows: Array<{ area: string }> }) => (
    <div data-testid="market-choropleth-map-mock">Rows: {rows.length}</div>
  ),
}));

const priceIndexRows = [
  {
    area: 'Palm Jumeirah',
    zone: 'premium',
    avgPricePerSqft: 3800,
    avgAnnualRent: 312000,
    grossYield: 8.2,
    transactionVol: 24,
    daysOnMarket: 36,
    source: 'database',
    dataDate: '2026-05-01T00:00:00.000Z',
  },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <MarketIntelligencePage />
    </MemoryRouter>
  );

describe('MarketIntelligencePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLanguage.mockReturnValue({
      language: 'en',
      isRTL: false,
      formatCurrency: (value: number) =>
        new Intl.NumberFormat('en-AE', {
          style: 'currency',
          currency: 'AED',
          maximumFractionDigits: 0,
        }).format(value),
      formatNumber: (value: number) => new Intl.NumberFormat('en-AE').format(value),
    });
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/api/market/price-index')) {
        return {
          json: async () => ({ success: true, data: priceIndexRows }),
        };
      }

      if (url.includes('/api/market/indicators')) {
        return {
          json: async () => ({
            success: true,
            data: {
              avgDaysOnMarket: 41,
              absorptionRate: 4.6,
              newListings: 18,
              activeListings: 132,
              areasIncluded: 2,
              source: 'database',
            },
          }),
        };
      }

      if (url.includes('/api/market/rera-index')) {
        return {
          json: async () => ({
            success: true,
            data: [
              {
                area: 'Downtown Dubai',
                propertyType: 'apartment',
                bedrooms: '1BR',
                avgRentAed: 90000,
                allowedIncreaseBelow10Pct: '0%',
                allowedIncrease10to20Pct: '5%',
                allowedIncrease20to30Pct: '10%',
                allowedIncrease30to40Pct: '15%',
                allowedIncreaseAbove40Pct: '20%',
              },
            ],
          }),
        };
      }

      throw new Error(`Unhandled fetch URL: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders English market data by default', async () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Market Intelligence' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
    });

    expect(screen.getByText('Price Index')).toBeInTheDocument();
    expect(screen.getAllByText('Premium').length).toBeGreaterThan(0);
    expect(screen.getByText('1 areas')).toBeInTheDocument();
    expect(document.querySelector('[dir="ltr"]')).toBeTruthy();
  });

  it('renders Arabic labels and rtl direction when Arabic is selected', async () => {
    mockUseLanguage.mockReturnValue({
      language: 'ar',
      isRTL: true,
      formatCurrency: (value: number) =>
        new Intl.NumberFormat('ar-AE', {
          style: 'currency',
          currency: 'AED',
          maximumFractionDigits: 0,
        }).format(value),
      formatNumber: (value: number) => new Intl.NumberFormat('ar-AE').format(value),
    });

    renderPage();

    expect(screen.getByRole('heading', { name: 'ذكاء السوق' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
    });

    expect(screen.getByText('مؤشر الأسعار')).toBeInTheDocument();
    expect(screen.getAllByText('فاخر').length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        (_content, node) => node?.tagName === 'SPAN' && !!node.textContent?.includes('مناطق')
      )
    ).toBeInTheDocument();
    expect(document.querySelector('[dir="rtl"]')).toBeTruthy();
  });

  it('renders heatmap tab and choropleth container', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Heatmap' }));

    await waitFor(() => {
      expect(screen.getByTestId('market-choropleth-map-mock')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Approximate choropleth heatmap based on average price per sqft by area.')
    ).toBeInTheDocument();
  });
});
