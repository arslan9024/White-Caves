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
        <RoleSelectionModal />
      </div>
    </PublicLayout>
  );
};

export default HomePage;
