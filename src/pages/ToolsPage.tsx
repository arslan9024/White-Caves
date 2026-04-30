import React, { FC, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import PublicLayout from '../components/layout/PublicLayout';
import PageHeroBanner from '../components/layout/PageHeroBanner';
import {
  selectMarketStats,
  selectLocationTrends,
  selectFeaturedProperties,
} from '../store/slices/homepageSlice';

const InteractiveMap = lazy(() => import('../components/InteractiveMap'));
const OffPlanTracker = lazy(() => import('../components/OffPlanTracker'));
const NeighborhoodAnalyzer = lazy(() => import('../components/NeighborhoodAnalyzer'));
const VirtualTourGallery = lazy(() => import('../components/VirtualTourGallery'));

const ToolLoader: FC = () => (
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
        borderTop: '3px solid #E31E24',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  </div>
);

const ToolsPage: FC = () => {
  useDocumentTitle('Property Tools & Market Insights | White Caves Real Estate');

  const marketStats = useSelector(selectMarketStats);
  const locationTrends = useSelector(selectLocationTrends);
  const featuredProperties = useSelector(selectFeaturedProperties);

  return (
    <PublicLayout>
      <PageHeroBanner
        title="Property Tools & Market Insights"
        subtitle="Interactive calculators, maps, and research tools to make confident property decisions in Dubai."
        backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <div style={{ background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)' }}>
        <Suspense fallback={<ToolLoader />}>
          <InteractiveMap />
        </Suspense>

        <Suspense fallback={<ToolLoader />}>
          <OffPlanTracker
            marketStats={marketStats}
            locationTrends={locationTrends}
            featuredProperties={featuredProperties}
          />
        </Suspense>

        <Suspense fallback={<ToolLoader />}>
          <NeighborhoodAnalyzer />
        </Suspense>

        <Suspense fallback={<ToolLoader />}>
          <VirtualTourGallery featuredProperties={featuredProperties} />
        </Suspense>
      </div>
    </PublicLayout>
  );
};

export default ToolsPage;
