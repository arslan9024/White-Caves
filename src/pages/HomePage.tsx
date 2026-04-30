import React, { FC, lazy, Suspense, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSEO, getCanonicalUrl } from '../hooks/useSEO';
import { setProperties, type Property } from '../store/propertySlice';
import { fetchHomepageData, selectMarketStats, selectTopAgents, selectLocationTrends, selectFeaturedProperties, selectIsHomepageLoading, type HomepageProperty } from '../store/slices/homepageSlice';
import type { AppDispatch } from '../store/store';
import { buildHomepageJsonLd } from './homepageSeo';
import ClickToChat from '../components/ClickToChat';
import RoleSelectionModal from '../components/RoleSelectionModal';
import PublicLayout from '../components/layout/PublicLayout';
import { useRecentlyViewed } from '../components/RecentlyViewed';
import { HOME_PROPERTIES } from '../data/homeProperties';
import './HomePage.css';

// Above-the-fold: lazy-loaded to defer framer-motion (~120KB) from critical path
// @Una: Using LuxuryHeroSection (Red/White/Black) as the primary hero
const Hero = lazy(() =>
  import('../components/homepage/Hero/LuxuryHeroSection').then(m => ({ default: m.LuxuryHeroSection }))
);
const Features = lazy(() => import('../components/homepage/Features'));
const MarketStatsBanner = lazy(() => import('../components/homepage/MarketStats/MarketStatsBanner'));

// Below-the-fold: lazy-loaded for faster initial paint
const Locations = lazy(() => import('../components/homepage/Locations'));
const FeaturedPropertiesSection = lazy(() => import('../components/homepage/FeaturedProperties/FeaturedPropertiesSection'));
const Team = lazy(() => import('../components/homepage/Team'));
const Testimonials = lazy(() => import('../components/homepage/Testimonials'));
const ContactCTA = lazy(() => import('../components/homepage/Contact'));
const NewsletterSubscription = lazy(() => import('../components/NewsletterSubscription'));
const InteractiveMap = lazy(() => import('../components/InteractiveMap'));
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
  <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
    <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
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

const HomePage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const marketStats = useSelector(selectMarketStats);
  const topAgents = useSelector(selectTopAgents);
  const locationTrends = useSelector(selectLocationTrends);
  const featuredProperties = useSelector(selectFeaturedProperties);
  const isHomepageLoading = useSelector(selectIsHomepageLoading);

  // Use live data when available; fall back to static dummy data before API resolves
  const displayedFeatured = useMemo(
    () => (featuredProperties.length > 0 ? featuredProperties : FALLBACK_FEATURED),
    [featuredProperties]
  );

  useSEO({
    title: 'White Caves Real Estate — Dubai Luxury Properties',
    description: 'Explore premium villas, penthouses, and investment-ready properties in Dubai with White Caves Real Estate. RERA-licensed agency serving luxury buyers and investors.',
    keywords: ['Dubai real estate', 'luxury properties Dubai', 'White Caves Real Estate', 'Dubai villas', 'RERA licensed'],
    canonicalUrl: getCanonicalUrl('/'),
    ogType: 'website',
    ogImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=630&fit=crop&q=80',
    jsonLd: buildHomepageJsonLd({
      marketStats,
      featuredProperties,
      topAgents,
      locationTrends,
    }),
  });
  const { addToRecent } = useRecentlyViewed();

  const handlePropertyClick = (propertyId: number): void => {
    addToRecent(String(propertyId));
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    // Seed Redux property store with static fallback for /properties page
    dispatch(setProperties(HOME_PROPERTIES as unknown as Property[]));
    // Fetch live homepage data in the background (@Mira's aggregate endpoint)
    dispatch(fetchHomepageData());
  }, [dispatch]);

  return (
    <PublicLayout>
      <div className="home-page">
        {/* Above the fold — lazy-loaded to defer framer-motion from critical path */}
        <Suspense fallback={
          <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(196,30,58,0.2)', borderTop: '3px solid #C41E3A', animation: 'spin 0.9s linear infinite' }} />
          </div>
        }>
          <Hero marketStats={marketStats} isLoading={isHomepageLoading} />
          <Features />
          <MarketStatsBanner marketStats={marketStats} isLoading={isHomepageLoading} />
        </Suspense>

        {/* Below the fold — lazy-loaded for faster initial paint */}
        <Suspense fallback={<SectionLoader />}>
          {/* Locations first so the map has context */}
          <Locations locationTrends={locationTrends} isLoading={isHomepageLoading} />
          <DubaiMap onPropertySelect={(property) => handlePropertyClick(property.id)} />
          <FeaturedPropertiesSection featuredProperties={displayedFeatured} isLoading={isHomepageLoading} />

          {/* ── Tools & Insights ───────────────────────────────────────────────── */}
          <div
            id="tools-insights"
            style={{
              background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '3.5rem 1.5rem 1rem',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  color: '#E31E24',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Expert Resources
              </p>
              <h2
                style={{
                  color: '#1a1a2e',
                  fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                Tools &amp; Insights
              </h2>
              <p
                style={{
                  color: '#6b7280',
                  maxWidth: 560,
                  margin: '0 auto 0.5rem',
                  lineHeight: 1.65,
                }}
              >
                Use our interactive calculators, market data, and research tools to make
                confident property decisions in Dubai.
              </p>
            </div>

            <InteractiveMap />
            <PropertyComparison />
            <RentVsBuyCalculator />
            <OffPlanTracker
              marketStats={marketStats}
              locationTrends={locationTrends}
              featuredProperties={featuredProperties}
            />
            <NeighborhoodAnalyzer />
            <VirtualTourGallery featuredProperties={featuredProperties} />
          </div>
          {/* ── /Tools & Insights ─────────────────────────────────────────────── */}

          <CompanyProfile />
          <Team topAgents={topAgents} isLoading={isHomepageLoading} />
          <Testimonials />
          <BlogSection
            marketStats={marketStats}
            featuredProperties={featuredProperties}
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
