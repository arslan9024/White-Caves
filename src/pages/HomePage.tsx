import React, { FC, lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { setProperties, type Property } from '../store/propertySlice';
import AppLayout from '../components/layout/AppLayout';
import Footer from '../components/Footer';
import ClickToChat from '../components/ClickToChat';
import { useRecentlyViewed } from '../components/RecentlyViewed';
import { HOME_PROPERTIES } from '../data/homeProperties';
import './HomePage.css';

// Above-the-fold: lazy-loaded to defer framer-motion (~120KB) from critical path
const Hero = lazy(() => import('../components/homepage/Hero'));
const Features = lazy(() => import('../components/homepage/Features'));

// Below-the-fold: lazy-loaded for faster initial paint
const Locations = lazy(() => import('../components/homepage/Locations'));
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
const NewsletterSubscription = lazy(() => import('../components/NewsletterSubscription'));
const OnboardingGateway = lazy(() => import('../components/OnboardingGateway'));

/** Minimal placeholder while lazy chunks load */
const SectionLoader: FC = () => (
  <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
    <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  </div>
);

const HomePage: FC = () => {
  useDocumentTitle('Dubai Luxury Real Estate');
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const { addToRecent } = useRecentlyViewed();

  const handlePropertyClick = (propertyId: number): void => {
    addToRecent(String(propertyId));
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    dispatch(setProperties(HOME_PROPERTIES as unknown as Property[]));
  }, [dispatch]);

  return (
    <AppLayout>
      <div className="home-page">
        {/* Above the fold — lazy-loaded to defer framer-motion from critical path */}
        <Suspense fallback={
          <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }} />
        }>
          <Hero />
          <Features />
        </Suspense>

        {/* Below the fold — lazy-loaded for faster initial paint */}
        <Suspense fallback={<SectionLoader />}>
          <DubaiMap onPropertySelect={(property) => handlePropertyClick(property.id)} />
          <Locations />
          <InteractiveMap />
          <PropertyComparison />
          <RentVsBuyCalculator />
          <OffPlanTracker />
          <NeighborhoodAnalyzer />
          <VirtualTourGallery />
          <CompanyProfile />
          <Team />
          <Testimonials />
          <BlogSection />
          <NewsletterSubscription />
          <ContactCTA />
          <OnboardingGateway />
        </Suspense>
        <ClickToChat />
        <Footer />
      </div>
    </AppLayout>
  );
};

export default HomePage;
