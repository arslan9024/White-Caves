import React, { FC, lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setProperties, type Property } from '../store/propertySlice';
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
import ClickToChat from '../components/ClickToChat';
import RoleSelectionModal from '../components/RoleSelectionModal';
import PublicLayout from '../components/layout/PublicLayout';
import PageMeta from '../components/seo/PageMeta';
import StructuredData from '../components/seo/StructuredData';
import { useRecentlyViewed } from '../components/RecentlyViewed';
import { HOME_PROPERTIES } from '../data/homeProperties';
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
const Locations = lazy(() => import('../components/homepage/Locations'));
const FeaturedPropertiesSection = lazy(
  () => import('../components/homepage/FeaturedProperties/FeaturedPropertiesSection')
);
const Team = lazy(() => import('../components/homepage/Team'));
const Testimonials = lazy(() => import('../components/homepage/Testimonials'));
const ContactCTA = lazy(() => import('../components/homepage/Contact'));
const NewsletterSubscription = lazy(() => import('../components/NewsletterSubscription'));
const PropertyComparison = lazy(() => import('../components/PropertyComparison'));
const OffPlanTracker = lazy(() => import('../components/OffPlanTracker'));
const NeighborhoodAnalyzer = lazy(() => import('../components/NeighborhoodAnalyzer'));
const RentVsBuyCalculator = lazy(() => import('../components/RentVsBuyCalculator'));
const VirtualTourGallery = lazy(() => import('../components/VirtualTourGallery'));
const DubaiMap = lazy(() => import('../components/DubaiMap'));
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

  const [activeToolTab, setActiveToolTab] = useState<
    'all' | 'rentvsbuy' | 'offplan' | 'comparison' | 'neighborhood' | 'virtualtour'
  >('all');

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
        <Hero marketStats={marketStats} isLoading={isHomepageLoading} />
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

        {/* Above-fold companions lazy-loaded so they don't delay Hero render */}
        <Suspense fallback={<SectionLoader />}>
          <Features />
          <MarketStatsBanner marketStats={marketStats} isLoading={isHomepageLoading} />
        </Suspense>

        {/* Below the fold — lazy-loaded for faster initial paint */}
        <Suspense fallback={<SectionLoader />}>
          {/* Locations first so the map has context */}
          <Locations locationTrends={locationTrends} isLoading={isHomepageLoading} />
          <DubaiMap onPropertySelect={property => handlePropertyClick(property.id)} />
          <FeaturedPropertiesSection
            featuredProperties={displayedFeatured}
            isLoading={isHomepageLoading}
          />

          {/* ── Tools & Insights ───────────────────────────────────────────────── */}
          <div id="tools-insights" className="home-page-tools-insights" style={{ padding: '40px 20px', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', margin: '40px auto', maxWidth: '1400px' }}>
            <div className="home-page-tools-insights__inner" style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontWeight: 800, fontSize: '0.8rem', marginBottom: '12px' }}>
                <span>⚡ REAL ESTATE FINTECH & AI SUITE</span>
              </div>
              <h2 className="home-page-tools-insights__title" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>Interactive Tools & Market Insights</h2>
              <p className="home-page-tools-insights__description" style={{ color: '#64748B', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
                Make data-backed investment decisions with our live calculators, off-plan intelligence, property comparison, and 360° virtual tour suite.
              </p>

              {/* Interactive Tool Switcher Pills */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
                {[
                  { id: 'all', label: '🌟 All Tools', desc: 'Complete Suite' },
                  { id: 'rentvsbuy', label: '🧮 Rent vs Buy Calculator', desc: 'ROI & Mortgage' },
                  { id: 'offplan', label: '🏗️ Off-Plan Investment Tracker', desc: 'DLD Developers' },
                  { id: 'comparison', label: '⚖️ Property Comparison', desc: 'Side-by-side' },
                  { id: 'neighborhood', label: '🏙️ Neighborhood AI', desc: 'Dubai Amenities' },
                  { id: 'virtualtour', label: '🥽 360° Virtual Tours', desc: 'VR Experience' },
                ].map(tool => {
                  const isActive = activeToolTab === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveToolTab(tool.id as any)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '12px',
                        border: isActive ? '2px solid #EF4444' : '1px solid #E2E8F0',
                        background: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        color: isActive ? '#EF4444' : '#334155',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: isActive ? '0 4px 14px rgba(239, 68, 68, 0.15)' : 'none',
                        transition: 'all 200ms ease',
                      }}
                    >
                      {tool.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rendered Tool Viewports */}
            <div style={{ transition: 'all 300ms ease' }}>
              {(activeToolTab === 'all' || activeToolTab === 'rentvsbuy') && <RentVsBuyCalculator />}
              {(activeToolTab === 'all' || activeToolTab === 'offplan') && (
                <OffPlanTracker
                  marketStats={marketStats}
                  locationTrends={locationTrends}
                  featuredProperties={displayedFeatured}
                />
              )}
              {(activeToolTab === 'all' || activeToolTab === 'comparison') && <PropertyComparison />}
              {(activeToolTab === 'all' || activeToolTab === 'neighborhood') && <NeighborhoodAnalyzer />}
              {(activeToolTab === 'all' || activeToolTab === 'virtualtour') && (
                <VirtualTourGallery featuredProperties={displayedFeatured} />
              )}
            </div>
          </div>
          {/* ── /Tools & Insights ─────────────────────────────────────────────── */}

          <CompanyProfile />
          <Team topAgents={topAgents} isLoading={isHomepageLoading} />
          <Testimonials />
          <BlogSection
            marketStats={marketStats}
            featuredProperties={displayedFeatured}
            locationTrends={locationTrends}
          />
          <NewsletterSubscription />
          <ContactCTA />
          <OnboardingGateway />
        </Suspense>
        <ClickToChat />
        <RoleSelectionModal />
      </div>
    </PublicLayout>
  );
};

export default HomePage;
