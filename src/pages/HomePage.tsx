import React, { FC, lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProperties } from '../store/propertySlice';
import AppLayout from '../components/layout/AppLayout';
import Footer from '../components/Footer';
import ClickToChat from '../components/ClickToChat';
import Hero from '../components/homepage/Hero';
import Features from '../components/homepage/Features';
import { useRecentlyViewed } from '../components/RecentlyViewed';
import './HomePage.css';

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

interface Property {
  id: number;
  title: string;
  beds: number;
  baths: number;
  sqft: number;
  price: number;
  amenities: string[];
  location: string;
  type: string;
  description: string;
}

const HomePage: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.currentUser);
  const { addToRecent } = useRecentlyViewed();

  const handlePropertyClick = (propertyId: number): void => {
    addToRecent(propertyId);
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    const properties: Property[] = [
      {
        id: 1,
        title: "Beachfront Villa with Private Pool - Palm Jumeirah",
        beds: 6,
        baths: 7,
        sqft: 12000,
        price: 45000000,
        amenities: ["Pool", "Beach Access", "Parking", "Security", "Garden", "Gym"],
        location: "Palm Jumeirah",
        type: "Villa",
        description: "Stunning beachfront villa on the prestigious Palm Jumeirah fronds with panoramic views of the Arabian Gulf."
      },
      {
        id: 2,
        title: "Burj Khalifa View Penthouse - Downtown Dubai",
        beds: 4,
        baths: 5,
        sqft: 6500,
        price: 35000000,
        amenities: ["Gym", "Parking", "Concierge", "Pool", "Security"],
        location: "Downtown Dubai",
        type: "Penthouse",
        description: "Ultra-luxury penthouse with breathtaking views of Burj Khalifa and Dubai Fountain."
      },
      {
        id: 3,
        title: "Mediterranean Style Mansion - Emirates Hills",
        beds: 7,
        baths: 9,
        sqft: 15000,
        price: 65000000,
        amenities: ["Pool", "Garden", "Security", "Parking", "Gym", "Cinema"],
        location: "Emirates Hills",
        type: "Villa",
        description: "Magnificent mansion with lush gardens and golf course views in the most exclusive community."
      },
      {
        id: 4,
        title: "Marina Skyline Apartment - Dubai Marina",
        beds: 3,
        baths: 4,
        sqft: 3200,
        price: 8500000,
        amenities: ["Pool", "Gym", "Parking", "Security", "Concierge"],
        location: "Dubai Marina",
        type: "Apartment",
        description: "Contemporary living space with stunning marina and sea views."
      },
      {
        id: 5,
        title: "Signature Villa - Palm Jumeirah",
        beds: 5,
        baths: 6,
        sqft: 8500,
        price: 28000000,
        amenities: ["Pool", "Beach Access", "Parking", "Security", "Garden"],
        location: "Palm Jumeirah",
        type: "Villa",
        description: "Exclusive signature villa with private beach access and infinity pool."
      },
      {
        id: 6,
        title: "Sky Collection Duplex - DIFC",
        beds: 4,
        baths: 5,
        sqft: 5200,
        price: 22000000,
        amenities: ["Pool", "Gym", "Concierge", "Parking", "Security"],
        location: "DIFC",
        type: "Penthouse",
        description: "Stunning duplex penthouse in the heart of Dubai's financial district."
      }
    ];

    dispatch(setProperties(properties));
  }, [dispatch]);

  return (
    <AppLayout>
      <div className="home-page">
        {/* Above the fold — eagerly loaded */}
        <Hero onPropertyClick={handlePropertyClick} />
        <Features />

        {/* Below the fold — lazy-loaded for faster initial paint */}
        <Suspense fallback={<SectionLoader />}>
          <DubaiMap onLocationClick={handlePropertyClick} />
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
