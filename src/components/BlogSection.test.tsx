import { describe, it, expect, vi, beforeEach } from 'vitest';
/* eslint-disable react/display-name, @typescript-eslint/no-explicit-any, security/detect-object-injection */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock styled-components
vi.mock('./BlogSection.styles', () => {
  const c =
    (tag: string) =>
    ({ children, ...props }: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) filtered[k] = v;
      }
      return React.createElement(tag, filtered, children);
    };
  return {
    BlogSectionContainer: c('section'),
    BlogContainer: c('div'),
    BlogHeader: c('div'),
    FeaturedPosts: c('div'),
    FeaturedPost: c('article'),
    FeaturedImage: c('div'),
    PostCategory: c('span'),
    FeaturedContent: c('div'),
    PostMeta: c('div'),
    PostAuthor: c('span'),
    ReadMoreBtn: c('button'),
    BlogFilters: c('div'),
    FilterBtn: (props: any) => {
      const { children, $isActive, ...rest } = props;
      return React.createElement('button', { ...rest, 'data-active': $isActive }, children);
    },
    BlogGrid: c('div'),
    BlogCard: c('article'),
    BlogCardImage: c('div'),
    BlogCardContent: c('div'),
    BlogCardCategory: c('span'),
    BlogCardTitle: c('h3'),
    BlogCardMeta: c('div'),
    LoadMoreBtn: c('button'),
    CardFooter: c('div'),
    ReadMoreLink: c('a'),
    LoadMoreContainer: c('div'),
  };
});

import BlogSection from './BlogSection';

const renderBlogSection = (props?: React.ComponentProps<typeof BlogSection>) =>
  render(
    <MemoryRouter>
      <BlogSection {...props} />
    </MemoryRouter>
  );

describe('BlogSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders main heading', () => {
      renderBlogSection();
      expect(screen.getByText('Real Estate Insights')).toBeInTheDocument();
    });

    it('renders subtitle', () => {
      renderBlogSection();
      expect(screen.getByText(/Stay informed with the latest news/)).toBeInTheDocument();
    });

    it('renders featured posts', () => {
      renderBlogSection();
      expect(
        screen.getByText('Dubai Real Estate Market Trends 2026: What Buyers Need to Know')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Complete Guide to Buying Property in Palm Jumeirah')
      ).toBeInTheDocument();
    });

    it('renders Read Article buttons for featured posts', () => {
      renderBlogSection();
      const readArticles = screen.getAllByText('Read Article →');
      expect(readArticles.length).toBe(2); // 2 featured posts
    });

    it('navigates to market insights when featured Read Article is clicked', () => {
      renderBlogSection();
      const readArticles = screen.getAllByText('Read Article →');
      fireEvent.click(readArticles[0]);
      expect(mockNavigate).toHaveBeenCalledWith('/market');
    });

    it('renders non-featured post titles', () => {
      renderBlogSection();
      expect(
        screen.getByText("Understanding Dubai's Golden Visa Through Property Investment")
      ).toBeInTheDocument();
      expect(screen.getByText('Top 10 Family-Friendly Communities in Dubai')).toBeInTheDocument();
    });

    it('renders post authors', () => {
      renderBlogSection();
      // Featured posts show author name directly; non-featured show "By Author"
      expect(screen.getByText('Ahmed Hassan')).toBeInTheDocument();
      expect(screen.getByText('Sarah Al-Maktoum')).toBeInTheDocument();
    });

    it('renders post dates', () => {
      renderBlogSection();
      expect(screen.getByText('April 10, 2026')).toBeInTheDocument();
      expect(screen.getByText('April 5, 2026')).toBeInTheDocument();
    });
  });

  // ── Category Filters ───────────────────────────────────────
  describe('category filters', () => {
    it('renders all category filter buttons', () => {
      renderBlogSection();
      expect(screen.getByText('All')).toBeInTheDocument();
      // Categories also appear as badges on cards, so use getAllByText
      expect(screen.getAllByText('Market Analysis').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Buying Guide').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Investment').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Lifestyle').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Legal').length).toBeGreaterThanOrEqual(1);
    });

    it('filters posts when category is selected', () => {
      renderBlogSection();
      // "Investment" appears as filter button AND card badge — click first one (filter)
      const investmentBtns = screen.getAllByText('Investment');
      fireEvent.click(investmentBtns[0]);
      // Only Investment posts should show in the regular grid
      expect(
        screen.getByText("Understanding Dubai's Golden Visa Through Property Investment")
      ).toBeInTheDocument();
      expect(
        screen.getByText('Rental Yields in Dubai: Best Areas for Investment Returns')
      ).toBeInTheDocument();
    });

    it('hides non-matching posts when filtered', () => {
      renderBlogSection();
      const legalBtns = screen.getAllByText('Legal');
      fireEvent.click(legalBtns[0]);
      // Legal post should show
      expect(
        screen.getByText('EJARI Registration: Step-by-Step Guide for Tenants')
      ).toBeInTheDocument();
      // Non-legal non-featured should not show
      expect(
        screen.queryByText('Top 10 Family-Friendly Communities in Dubai')
      ).not.toBeInTheDocument();
    });

    it('shows all posts when All is selected', () => {
      renderBlogSection();
      const legalBtns = screen.getAllByText('Legal');
      fireEvent.click(legalBtns[0]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('Top 10 Family-Friendly Communities in Dubai')).toBeInTheDocument();
    });
  });

  // ── Featured vs Regular ────────────────────────────────────
  describe('featured vs regular', () => {
    it('featured posts have Read Article button', () => {
      renderBlogSection();
      const readArticles = screen.getAllByText('Read Article →');
      expect(readArticles.length).toBe(2);
    });

    it('regular posts have Read More links', () => {
      renderBlogSection();
      const readMores = screen.getAllByText('Read More →');
      expect(readMores.length).toBeGreaterThanOrEqual(1);
    });

    it('regular Read More links target valid app routes', () => {
      renderBlogSection();
      const links = screen.getAllByText('Read More →');
      expect(links.length).toBeGreaterThanOrEqual(1);
      const hrefs = links.map(link => link.getAttribute('to') || link.getAttribute('href') || '');
      expect(hrefs.some(href => href.includes('/market'))).toBe(true);
      expect(hrefs.some(href => href.includes('/properties') || href.includes('/services'))).toBe(
        true
      );
    });
  });

  // ── Post Metadata ──────────────────────────────────────────
  describe('post metadata', () => {
    it('renders read time', () => {
      renderBlogSection();
      expect(screen.getByText('8 min read')).toBeInTheDocument();
      expect(screen.getByText('12 min read')).toBeInTheDocument();
    });

    it('renders categories on cards', () => {
      renderBlogSection();
      const investmentBadges = screen.getAllByText('Investment');
      expect(investmentBadges.length).toBeGreaterThanOrEqual(1); // filter button + category badges
    });

    it('generates live insight posts when homepage data props are provided', () => {
      renderBlogSection({
        marketStats: {
          totalProperties: 500,
          availableProperties: 320,
          averagePrice: 4500000,
          portfolioValue: 2250000000,
          activeAgents: 50,
        },
        locationTrends: [
          {
            name: 'Palm Jumeirah',
            propertyCount: 120,
            avgPrice: 15000000,
            trendPercent: 12,
            trendDirection: 'up',
          },
        ],
        featuredProperties: [
          {
            id: 'prop-1',
            title: 'Azure Palm Villa',
            type: 'Villa',
            status: 'available',
            price: 15000000,
            currency: 'AED',
            bedrooms: 5,
            bathrooms: 6,
            sqft: 8200,
            location: 'Palm Jumeirah',
            amenities: ['Pool'],
            images: ['https://example.com/villa.jpg'],
            featured: true,
          },
        ],
      });

      expect(screen.getByText(/Palm Jumeirah Property Trend: 12% Momentum/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Dubai Luxury Inventory Snapshot: 320 Available Listings/i)
      ).toBeInTheDocument();
    });
  });
});
