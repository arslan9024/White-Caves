import React, { FC, lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setProperties, type Property } from '../store/propertySlice';
import { HOME_PROPERTIES } from '../data/homeProperties';
import {
  clearError,
  fetchHomepageData,
  selectHomepageError,
  selectMarketStats,
  selectTopAgents,
  selectLocationTrends,
  selectFeaturedProperties,
  selectIsHomepageLoading,
  type HomepageProperty,
} from '../store/slices/homepageSlice';
import type { AppDispatch } from '../store/store';
import { buildHomepageJsonLd } from './homepageSeo';
import { buildOrganizationSchema } from '../utils/jsonLdSchemas';
import RoleSelectionModal from '../components/RoleSelectionModal';
import PublicLayout from '../components/layout/PublicLayout';
import PageMeta from '../components/seo/PageMeta';
import StructuredData from '../components/seo/StructuredData';
import { useRecentlyViewed } from '../components/RecentlyViewed';
import { MapContainer } from '../components/homepage/MapContainer';

import { ToolsDashboard } from '../components/homepage/ToolsDashboard';
import { AreaGuideGrid } from '../components/homepage/AreaGuideGrid';
import { TestimonialPodium } from '../components/homepage/TestimonialPodium';
import '../styles/luxuryDesignSystem.css';
import './HomePage.css';

// Above-the-fold: Hero is the LCP element — import directly (NOT lazy) so the
// browser can start rendering immediately without a waterfall.
// @Una: Using LuxuryHeroSection (Red/White/Black) as the primary hero
import { LuxuryHeroSection as Hero } from '../components/homepage/Hero/LuxuryHeroSection';

// P1 above-fold companions: lazy-loaded so they don't block hero render
const Features = lazy(() => import('../components/homepage/Features'));
const MarketStatsBanner = lazy(
  () => import('../components/homepage/MarketStats/MarketStatsBanner')
);

// Below-the-fold: lazy-loaded for faster initial paint
// Locations replaced by AreaGuideGrid (AEGIS 2.0)
const FeaturedPropertiesSection = lazy(
  () => import('../components/homepage/FeaturedProperties/FeaturedPropertiesSection')
);
const Team = lazy(() => import('../components/homepage/Team'));
// Testimonials replaced by TestimonialPodium (AEGIS 2.0)
const ContactCTA = lazy(() => import('../components/homepage/Contact'));
const NewsletterSubscription = lazy(() => import('../components/NewsletterSubscription'));
const CompanyProfile = lazy(() => import('../components/CompanyProfile'));
const BlogSection = lazy(() => import('../components/BlogSection'));
const OnboardingGateway = lazy(() => import('../components/OnboardingGateway'));

/** Minimal placeholder while lazy chunks load */
const SectionLoader: FC = () => (
  <div className="home-page-section-loader" aria-hidden="true">
    <div className="home-page-section-loader__spinner" />
  </div>
);

/**
 * Static fallback featured properties mapped from HOME_PROPERTIES.
 * Displayed instantly before the API resolves so the section never shows "coming soon".
 */
const FALLBACK_FEATURED: HomepageProperty[] = HOME_PROPERTIES.slice(0, 6).map(p => ({
  id: String(p.id),
  title: p.title,
  description: p.description,
  type: p.type,
  status: 'available',
  price: p.price,
  currency: 'AED',
  bedrooms: p.beds,
  bathrooms: p.baths,
  sqft: p.sqft,
  location: p.location,
  amenities: p.amenities,
  images: [],
  featured: true,
}));

const HOME_PROPERTIES_FOR_STORE: Property[] = HOME_PROPERTIES.map(p => ({
  id: p.id,
  title: p.title,
  location: p.location,
  type: p.type,
  price: p.price,
  beds: p.beds,
  baths: p.baths,
  sqft: p.sqft,
  amenities: p.amenities,
}));

const HomePage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const marketStats = useSelector(selectMarketStats);
  const topAgents = useSelector(selectTopAgents);
  const locationTrends = useSelector(selectLocationTrends);
  const featuredProperties = useSelector(selectFeaturedProperties);
  const isHomepageLoading = useSelector(selectIsHomepageLoading);
  const homepageError = useSelector(selectHomepageError);
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Use live data when available; fall back to static dummy data before API resolves
  const displayedFeatured = useMemo(
    () => (featuredProperties.length > 0 ? featuredProperties : FALLBACK_FEATURED),
    [featuredProperties]
  );

  const homepageJsonLd = useMemo(
    () =>
      buildHomepageJsonLd({
        marketStats,
        featuredProperties: displayedFeatured,
        topAgents,
        locationTrends,
      }),
    [marketStats, displayedFeatured, topAgents, locationTrends]
  );
  const structuredDataPayload = useMemo<Array<Record<string, unknown>>>(() => {
    const homepageSchemas = Array.isArray(homepageJsonLd) ? homepageJsonLd : [homepageJsonLd];

    return [...homepageSchemas, buildOrganizationSchema()].filter(
      (entry): entry is Record<string, unknown> => Boolean(entry)
    );
  }, [homepageJsonLd]);
  const trustHighlights = useMemo(
    () => [
      { label: 'Active Listings', value: marketStats.availableProperties.toLocaleString('en-US') },
      {
        label: 'Average Price',
        value: `AED ${Math.round(marketStats.averagePrice).toLocaleString('en-US')}`,
      },
      { label: 'Top Agents', value: String(topAgents.length || 0) },
      { label: 'Popular Areas', value: String(locationTrends.length || 0) },
    ],
    [
      marketStats.availableProperties,
      marketStats.averagePrice,
      topAgents.length,
      locationTrends.length,
    ]
  );
  const { addToRecent } = useRecentlyViewed();

  const pageTitle = 'White Caves Real Estate — Dubai Luxury Properties';
  const pageDescription =
    'Explore premium villas, penthouses, and investment-ready properties in Dubai with White Caves Real Estate. RERA-licensed agency serving luxury buyers and investors.';
  const pageKeywords = [
    'Dubai real estate',
    'luxury properties Dubai',
    'White Caves Real Estate',
    'Dubai villas',
    'RERA licensed',
  ];

  const handlePropertyClick = (propertyId: number): void => {
    addToRecent(String(propertyId));
    navigate(`/property/${propertyId}`);
  };

  useEffect(() => {
    // Seed Redux property store with static fallback for /properties page
    dispatch(setProperties(HOME_PROPERTIES_FOR_STORE));
    // Fetch live homepage data in the background (@Mira's aggregate endpoint)
    dispatch(fetchHomepageData());
  }, [dispatch]);

  useEffect(() => {
    const refreshIntervalMs = 120_000;
    const refreshTimer = window.setInterval(() => {
      dispatch(fetchHomepageData());
    }, refreshIntervalMs);

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        dispatch(fetchHomepageData());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(refreshTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!homepageError || isHomepageLoading) return;

    const retryTimer = window.setTimeout(() => {
      dispatch(fetchHomepageData());
    }, 45_000);

    return () => {
      window.clearTimeout(retryTimer);
    };
  }, [dispatch, homepageError, isHomepageLoading]);

  const handleHomepageRetry = (): void => {
    dispatch(clearError());
    dispatch(fetchHomepageData());
  };

  return (
    <PublicLayout>
      <PageMeta
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonicalPath="/"
        ogType="website"
        ogImage="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=630&fit=crop&q=80"
        jsonLd={homepageJsonLd}
      />
      <StructuredData id="home-jsonld" data={structuredDataPayload} />
      <div className="home-page">
        {homepageError && !isHomepageLoading ? (
          <div role="status" aria-live="polite" className="homepage-live-data-alert">
            <span>Live market data is temporarily unavailable. Showing trusted fallback data.</span>
            <button
              type="button"
              onClick={handleHomepageRetry}
              className="homepage-live-data-alert__retry"
            >
              Retry live data
            </button>
          </div>
        ) : null}



        {/* Phase 25: Hero is the LCP element — NOT wrapped in Suspense so it renders on first paint */}
        <Hero
          marketStats={marketStats}
          isLoading={isHomepageLoading}
          onSearchClick={() => setIsSearchOpen(true)}
        />

        <section className="home-page__trust-strip" aria-label="Market trust highlights">
          <div className="home-page__trust-grid">
            {trustHighlights.map(item => (
              <article key={item.label} className="home-page__trust-card">
                <span className="home-page__trust-label">{item.label}</span>
                <span className="home-page__trust-value">{item.value}</span>
              </article>
            ))}
          </div>
        </section>

        {/* Above-fold companions */}
        <Suspense fallback={<SectionLoader />}>
          <Features />
          <MarketStatsBanner marketStats={marketStats} isLoading={isHomepageLoading} />
        </Suspense>

        {/* STAGE 3: Area Guide Grid (Life in DAMAC Hills 2, Palm Jumeirah, Downtown) */}
        <AreaGuideGrid />

        {/* STAGE 2: Real Geospatial Map Engine with Red Markers */}
        <MapContainer />

        {/* Featured Properties */}
        <Suspense fallback={<SectionLoader />}>
          <FeaturedPropertiesSection
            featuredProperties={displayedFeatured}
            isLoading={isHomepageLoading}
          />
        </Suspense>

        {/* STAGE 1: Gamified ROI & Mortgage Tools Dashboard (Styled Components) */}
        <ToolsDashboard />

        {/* STAGE 3: 5-Star Investor Testimonial Podium */}
        <TestimonialPodium />

        {/* Below the fold companion sections */}
        <Suspense fallback={<SectionLoader />}>
          <CompanyProfile />
          <Team topAgents={topAgents} isLoading={isHomepageLoading} />
          <BlogSection
            marketStats={marketStats}
            featuredProperties={displayedFeatured}
            locationTrends={locationTrends}
          />
          <NewsletterSubscription />
          <ContactCTA />
          <OnboardingGateway />
        </Suspense>
        {/* STAGE 1: Quick Search Launcher Modal Overlay */}
        {isSearchOpen && (
          <div
            className="home-page-search-modal-backdrop"
            onClick={() => setIsSearchOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Quick Property Search"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '10vh',
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            <div
              className="home-page-search-modal-card"
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '680px',
                background: '#0F172A',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '24px',
                padding: '1.75rem',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(6, 182, 212, 0.15)',
                color: '#F8FAFC',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-f8fafc, #F8FAFC)' }}>
                    Luxury Property Search
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
                    Press <kbd style={{ background: 'var(--color-1e293b, #1E293B)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-334155, #334155)' }}>Ctrl + K</kbd> anytime to open
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94A3B8',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                  }}
                  aria-label="Close search"
                >
                  ✕
                </button>
              </div>

              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Search by community, villa name, penthouse, or RERA ID..."
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      navigate(`/properties?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                      setIsSearchOpen(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    background: '#1E293B',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    borderRadius: '14px',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    outline: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-d4af37, #D4AF37)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Popular Luxury Destinations
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Palm Jumeirah Villa', 'Downtown Penthouse', 'Dubai Marina', 'DAMAC Hills 2', 'Waterfront Estate', 'Off-Plan Investment'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        navigate(`/properties?q=${encodeURIComponent(tag)}`);
                        setIsSearchOpen(false);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#E2E8F0',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        (e.target as HTMLButtonElement).style.background = '#06B6D4';
                        (e.target as HTMLButtonElement).style.borderColor = '#06B6D4';
                      }}
                      onMouseLeave={e => {
                        (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                        (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <RoleSelectionModal />
      </div>
    </PublicLayout>
  );
};

export default HomePage;
