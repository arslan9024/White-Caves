import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProperties } from '../store/propertySlice';
import AppLayout from '../components/layout/AppLayout';
import Footer from '../components/Footer';
import ClickToChat from '../components/ClickToChat';
import Hero from '../components/homepage/Hero';
import Features from '../components/homepage/Features';
import FeaturedProperties from '../components/homepage/FeaturedProperties';
import Locations from '../components/homepage/Locations';
import Team from '../components/homepage/Team';
import Testimonials from '../components/homepage/Testimonials';
import ContactCTA from '../components/homepage/Contact';
import InteractiveMap from '../components/InteractiveMap';
import PropertyComparison from '../components/PropertyComparison';
import OffPlanTracker from '../components/OffPlanTracker';
import NeighborhoodAnalyzer from '../components/NeighborhoodAnalyzer';
import RentVsBuyCalculator from '../components/RentVsBuyCalculator';
import VirtualTourGallery from '../components/VirtualTourGallery';
import DubaiMap from '../components/DubaiMap';
import CompanyProfile from '../components/CompanyProfile';
import BlogSection from '../components/BlogSection';
import NewsletterSubscription from '../components/NewsletterSubscription';
import OnboardingGateway from '../components/OnboardingGateway';
import { useRecentlyViewed } from '../components/RecentlyViewed';
import './HomePage.css';

export default function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const { addToRecent } = useRecentlyViewed();

  const handlePropertyClick = (propertyId) => {
    addToRecent(propertyId);
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    dispatch(setProperties([
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
    ]));
  }, [dispatch]);

  return (
    <AppLayout>
      <div className="home-page">
        <Hero onPropertyClick={handlePropertyClick} />
        <Features />
        <FeaturedProperties />
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
        <ClickToChat />
        <Footer />
      </div>
    </AppLayout>
  );
}
