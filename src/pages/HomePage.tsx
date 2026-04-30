import React, { FC, lazy, Suspense, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, Map, BarChart2, Eye, Home } from 'lucide-react';
import { useSEO, getCanonicalUrl } from '../hooks/useSEO';
import { setProperties, type Property } from '../store/propertySlice';
import {
  fetchHomepageData,
  selectMarketStats,
  selectTopAgents,
  selectLocationTrends,
  selectFeaturedProperties,
  selectIsHomepageLoading,
  type HomepageProperty,
} from '../store/slices/homepageSlice';
import type { AppDispatch } from '../store/store';
import { buildHomepageJsonLd } from './homepageSeo';
import ClickToChat from '../components/ClickToChat';
import RoleSelectionModal from '../components/RoleSelectionModal';
import PublicLayout from '../components/layout/PublicLayout';
import { HOME_PROPERTIES } from '../data/homeProperties';
import './HomePage.css';

// Above-the-fold: lazy-loaded to defer framer-motion (~120KB) from critical path
const Hero = lazy(() => import('../components/homepage/Hero'));
const MarketStatsBanner = lazy(
  () => import('../components/homepage/MarketStats/MarketStatsBanner')
);

// Below-the-fold: lazy-loaded for faster initial paint
const FeaturedPropertiesSection = lazy(
  () => import('../components/homepage/FeaturedProperties/FeaturedPropertiesSection')
);
const Locations = lazy(() => import('../components/homepage/Locations'));
const Features = lazy(() => import('../components/homepage/Features'));
const Team = lazy(() => import('../components/homepage/Team'));
const Testimonials = lazy(() => import('../components/homepage/Testimonials'));
const PropertyComparison = lazy(() => import('../components/PropertyComparison'));
const RentVsBuyCalculator = lazy(() => import('../components/RentVsBuyCalculator'));
const CompanyProfile = lazy(() => import('../components/CompanyProfile'));
const BlogSection = lazy(() => import('../components/BlogSection'));
const NewsletterSubscription = lazy(() => import('../components/NewsletterSubscription'));
const ContactCTA = lazy(() => import('../components/homepage/Contact'));
const PopularSearches = lazy(
  () => import('../components/homepage/PopularSearches/PopularSearches')
);
const MobileAppBanner = lazy(
  () => import('../components/homepage/MobileAppBanner/MobileAppBanner')
);
const OnboardingGateway = lazy(() => import('../components/OnboardingGateway'));

/** Minimal placeholder while lazy chunks load */
const SectionLoader: FC = () => (
  <div
    style={{
      minHeight: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.5,
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
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
  images: [p.image],
  featured: true,
}));

/** CTA cards linking to the full /tools page for the 4 heavy tools */
const TOOL_CARDS = [
  {
    icon: <Map size={28} />,
    title: 'Interactive Property Map',
    description: 'Explore listings by location across Dubai neighbourhoods.',
    color: '#3B82F6',
  },
  {
    icon: <BarChart2 size={28} />,
    title: 'Off-Plan Tracker',
    description: 'Track launch schedules, pricing trends, and ROI on new developments.',
    color: '#10B981',
  },
  {
    icon: <Home size={28} />,
    title: 'Neighborhood Analyzer',
    description: 'Deep-dive into lifestyle scores, school ratings, and community data.',
    color: '#8B5CF6',
  },
  {
    icon: <Eye size={28} />,
    title: 'Virtual Tour Gallery',
    description: '360° immersive tours of our premium listings from anywhere.',
    color: '#F59E0B',
  },
];

const ToolsCTAGrid: FC = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 1.5rem 3rem',
      }}
    >
      {TOOL_CARDS.map(card => (
        <motion.div
          key={card.title}
          whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
          onClick={() => navigate('/tools')}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/tools');
            }
          }}
          style={{
            background: '#fff',
            border: '1px solid #f0f0f0',
            borderRadius: 14,
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ color: card.color, marginBottom: '0.75rem' }}>{card.icon}</div>
          <h3
            style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.4rem' }}
          >
            {card.title}
          </h3>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              lineHeight: 1.55,
              marginBottom: '0.75rem',
            }}
          >
            {card.description}
          </p>
          <span
            style={{
              fontSize: '0.8rem',
              color: card.color,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            Open Tool <ArrowRight size={13} />
          </span>
        </motion.div>
      ))}
    </div>
  );
};

const HomePage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const marketStats = useSelector(selectMarketStats);
  const topAgents = useSelector(selectTopAgents);
  const locationTrends = useSelector(selectLocationTrends);
  const featuredProperties = useSelector(selectFeaturedProperties);
  const isHomepageLoading = useSelector(selectIsHomepageLoading);
  const navigate = useNavigate();

  // Use live data when available; fall back to static dummy data before API resolves
  const displayedFeatured = useMemo(
    () => (featuredProperties.length > 0 ? featuredProperties : FALLBACK_FEATURED),
    [featuredProperties]
  );

  useSEO({
    title: 'White Caves Real Estate — Dubai Luxury Properties',
    description:
      'Explore premium villas, penthouses, and investment-ready properties in Dubai with White Caves Real Estate. RERA-licensed agency serving luxury buyers and investors.',
    keywords: [
      'Dubai real estate',
      'luxury properties Dubai',
      'White Caves Real Estate',
      'Dubai villas',
      'RERA licensed',
    ],
    canonicalUrl: getCanonicalUrl('/'),
    ogType: 'website',
    ogImage:
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=630&fit=crop&q=80',
    jsonLd: buildHomepageJsonLd({
      marketStats,
      featuredProperties,
      topAgents,
      locationTrends,
    }),
  });

  useEffect(() => {
    // Seed Redux property store with static fallback for /properties page
    dispatch(setProperties(HOME_PROPERTIES as unknown as Property[]));
    // Fetch live homepage data in the background (@Mira's aggregate endpoint)
    dispatch(fetchHomepageData());
  }, [dispatch]);

  return (
    <PublicLayout>
      <div className="home-page">
        {/* ── Above the fold ──────────────────────────────────────────────── */}
        <Suspense
          fallback={
            <div
              style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
              }}
            />
          }
        >
          <Hero marketStats={marketStats} isLoading={isHomepageLoading} />
        </Suspense>

        {/* ── Below the fold (conversion-optimised order) ─────────────────── */}
        <Suspense fallback={<SectionLoader />}>
          {/* 1. OnboardingGateway — role selection prompt, surfaced near top */}
          <OnboardingGateway />

          {/* 2. Market stats ribbon */}
          <MarketStatsBanner marketStats={marketStats} isLoading={isHomepageLoading} />

          {/* 3. Featured properties — primary conversion goal */}
          <FeaturedPropertiesSection
            featuredProperties={displayedFeatured}
            isLoading={isHomepageLoading}
          />

          {/* 4. Popular area searches — supports browsing intent */}
          <PopularSearches />

          {/* 5. Locations grid */}
          <Locations locationTrends={locationTrends} isLoading={isHomepageLoading} />

          {/* 6. Why White Caves — platform USPs */}
          <Features />

          {/* 7. Team — trust builder */}
          <Team topAgents={topAgents} isLoading={isHomepageLoading} />

          {/* 8. Testimonials — social proof */}
          <Testimonials />

          {/* ── Tools & Insights (2 featured + 4 CTA cards to /tools) ─────── */}
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
                Use our interactive calculators, market data, and research tools to make confident
                property decisions in Dubai.
              </p>
            </div>

            {/* 2 featured tools inline */}
            <PropertyComparison />
            <RentVsBuyCalculator />

            {/* CTA tiles for 4 additional tools on /tools page */}
            <div
              style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '1.5rem 1.5rem 0.5rem',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  color: '#1a1a2e',
                  fontWeight: 600,
                  fontSize: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                More Tools Available
              </p>
            </div>
            <ToolsCTAGrid />

            <div style={{ textAlign: 'center', paddingBottom: '2.5rem' }}>
              <motion.button
                className="btn btn-outline"
                onClick={() => navigate('/tools')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Calculator size={18} />
                Explore All Tools
              </motion.button>
            </div>
          </div>
          {/* ── /Tools & Insights ─────────────────────────────────────────── */}

          {/* 9. Company profile */}
          <CompanyProfile />

          {/* 10. Blog */}
          <BlogSection
            marketStats={marketStats}
            featuredProperties={featuredProperties}
            locationTrends={locationTrends}
          />

          {/* 11. Newsletter */}
          <NewsletterSubscription />

          {/* 12. Contact CTA */}
          <ContactCTA />

          {/* 13. Mobile app banner */}
          <MobileAppBanner />
        </Suspense>
        <ClickToChat />
        <RoleSelectionModal />
      </div>
    </PublicLayout>
  );
};

export default HomePage;
