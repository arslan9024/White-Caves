import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock styled-components
vi.mock('./BlogSection.styles', () => {
  const c = (tag: string) => ({ children, ...props }: any) => {
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

describe('BlogSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders main heading', () => {
      render(<BlogSection />);
      expect(screen.getByText('Real Estate Insights')).toBeInTheDocument();
    });

    it('renders subtitle', () => {
      render(<BlogSection />);
      expect(screen.getByText(/Stay informed with the latest news/)).toBeInTheDocument();
    });

    it('renders featured posts', () => {
      render(<BlogSection />);
      expect(screen.getByText("Dubai Real Estate Market Trends 2025: What Buyers Need to Know")).toBeInTheDocument();
      expect(screen.getByText("Complete Guide to Buying Property in Palm Jumeirah")).toBeInTheDocument();
    });

    it('renders Read Article buttons for featured posts', () => {
      render(<BlogSection />);
      const readArticles = screen.getAllByText('Read Article →');
      expect(readArticles.length).toBe(2); // 2 featured posts
    });

    it('renders non-featured post titles', () => {
      render(<BlogSection />);
      expect(screen.getByText("Understanding Dubai's Golden Visa Through Property Investment")).toBeInTheDocument();
      expect(screen.getByText("Top 10 Family-Friendly Communities in Dubai")).toBeInTheDocument();
    });

    it('renders post authors', () => {
      render(<BlogSection />);
      // Featured posts show author name directly; non-featured show "By Author"
      expect(screen.getByText('Ahmed Hassan')).toBeInTheDocument();
      expect(screen.getByText('Sarah Al-Maktoum')).toBeInTheDocument();
    });

    it('renders post dates', () => {
      render(<BlogSection />);
      expect(screen.getByText('December 10, 2025')).toBeInTheDocument();
      expect(screen.getByText('December 5, 2025')).toBeInTheDocument();
    });
  });

  // ── Category Filters ───────────────────────────────────────
  describe('category filters', () => {
    it('renders all category filter buttons', () => {
      render(<BlogSection />);
      expect(screen.getByText('All')).toBeInTheDocument();
      // Categories also appear as badges on cards, so use getAllByText
      expect(screen.getAllByText('Market Analysis').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Buying Guide').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Investment').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Lifestyle').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Legal').length).toBeGreaterThanOrEqual(1);
    });

    it('filters posts when category is selected', () => {
      render(<BlogSection />);
      // "Investment" appears as filter button AND card badge — click first one (filter)
      const investmentBtns = screen.getAllByText('Investment');
      fireEvent.click(investmentBtns[0]);
      // Only Investment posts should show in the regular grid
      expect(screen.getByText("Understanding Dubai's Golden Visa Through Property Investment")).toBeInTheDocument();
      expect(screen.getByText("Rental Yields in Dubai: Best Areas for Investment Returns")).toBeInTheDocument();
    });

    it('hides non-matching posts when filtered', () => {
      render(<BlogSection />);
      const legalBtns = screen.getAllByText('Legal');
      fireEvent.click(legalBtns[0]);
      // Legal post should show
      expect(screen.getByText("EJARI Registration: Step-by-Step Guide for Tenants")).toBeInTheDocument();
      // Non-legal non-featured should not show
      expect(screen.queryByText("Top 10 Family-Friendly Communities in Dubai")).not.toBeInTheDocument();
    });

    it('shows all posts when All is selected', () => {
      render(<BlogSection />);
      const legalBtns = screen.getAllByText('Legal');
      fireEvent.click(legalBtns[0]);
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText("Top 10 Family-Friendly Communities in Dubai")).toBeInTheDocument();
    });
  });

  // ── Featured vs Regular ────────────────────────────────────
  describe('featured vs regular', () => {
    it('featured posts have Read Article button', () => {
      render(<BlogSection />);
      const readArticles = screen.getAllByText('Read Article →');
      expect(readArticles.length).toBe(2);
    });

    it('regular posts have Read More links', () => {
      render(<BlogSection />);
      const readMores = screen.getAllByText('Read More →');
      expect(readMores.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Post Metadata ──────────────────────────────────────────
  describe('post metadata', () => {
    it('renders read time', () => {
      render(<BlogSection />);
      expect(screen.getByText('8 min read')).toBeInTheDocument();
      expect(screen.getByText('12 min read')).toBeInTheDocument();
    });

    it('renders categories on cards', () => {
      render(<BlogSection />);
      const investmentBadges = screen.getAllByText('Investment');
      expect(investmentBadges.length).toBeGreaterThanOrEqual(1); // filter button + category badges
    });
  });

  // ── Snapshot ───────────────────────────────────────────────
  describe('snapshot', () => {
    it('matches default snapshot', () => {
      const { container } = render(<BlogSection />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
