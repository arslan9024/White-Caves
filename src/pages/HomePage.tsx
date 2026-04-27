import React, { FC, lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSEO, getCanonicalUrl } from '../hooks/useSEO';
import { setProperties, type Property } from '../store/propertySlice';
import { fetchHomepageData, selectMarketStats, selectTopAgents, selectLocationTrends, selectFeaturedProperties, selectIsHomepageLoading } from '../store/slices/homepageSlice';
import type { AppDispatch } from '../store/store';
import { buildHomepageJsonLd } from './homepageSeo';
import ClickToChat from '../components/ClickToChat';
import PublicLayout from '../components/layout/PublicLayout';
import { useRecentlyViewed } from '../components/RecentlyViewed';
import { HOME_PROPERTIES } from '../data/homeProperties';
import './HomePage.css';

// Above-the-fold: lazy-loaded to defer framer-motion (~120KB) from critical path
const Hero = lazy(() => import('../components/homepage/Hero'));
const Features = lazy(() => import('../components/homepage/Features'));
const MarketStatsBanner = lazy(() => import('../components/homepage/MarketStats/MarketStatsBanner'));

// Below-the-fold: lazy-loaded for faster initial paint
const Locations = lazy(() => import('../components/homepage/Locations'));
const FeaturedPropertiesSection = lazy(() => import('../components/homepage/FeaturedProperties/FeaturedPropertiesSection'));
const Team = lazy(() => import('../components/homepage/Team'));
const Testimonials = lazy(() => import('../components/homepage/Testimonials'));
const ContactCTA = lazy(() => import('../components/homepage/Contact'));
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

const HomePage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const marketStats = useSelector(selectMarketStats);
  const topAgents = useSelector(selectTopAgents);
  const locationTrends = useSelector(selectLocationTrends);
  const featuredProperties = useSelector(selectFeaturedProperties);
  const isHomepageLoading = useSelector(selectIsHomepageLoading);

  useSEO({
    title: 'Dubai Luxury Real Estate',
    description: 'Explore premium villas, penthouses, and investment-ready properties in Dubai with White Caves Real Estate.',
    keywords: ['Dubai real estate', 'luxury properties Dubai', 'White Caves Real Estate', 'Dubai villas'],
    canonicalUrl: getCanonicalUrl('/'),
    ogType: 'website',
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
          <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)' }} />
        }>
          <Hero marketStats={marketStats} isLoading={isHomepageLoading} />
          <Features />
          <MarketStatsBanner marketStats={marketStats} isLoading={isHomepageLoading} />
        </Suspense>

        {/* Below the fold — lazy-loaded for faster initial paint */}
        <Suspense fallback={<SectionLoader />}>
          <DubaiMap onPropertySelect={(property) => handlePropertyClick(property.id)} />
          <Locations locationTrends={locationTrends} isLoading={isHomepageLoading} />
          <FeaturedPropertiesSection featuredProperties={featuredProperties} isLoading={isHomepageLoading} />
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
          <CompanyProfile />
          <Team topAgents={topAgents} isLoading={isHomepageLoading} />
          <Testimonials />
          <BlogSection
            marketStats={marketStats}
            featuredProperties={featuredProperties}
            locationTrends={locationTrends}
          />
          <ContactCTA />
          <OnboardingGateway />
        </Suspense>
        <ClickToChat />
      </div>
    </PublicLayout>
  );
};

export default HomePage;
