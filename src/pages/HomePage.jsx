import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProperties } from '../store/propertySlice';
import MegaNav from '../components/MegaNav';
import Footer from '../components/Footer';
import ClickToChat from '../components/ClickToChat';
import Hero from '../components/homepage/Hero';
import Features from '../components/homepage/Features';
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
        description: "Magnificent Mediterranean-inspired mansion on the prestigious Emirates Hills golf course."
      },
      {
        id: 4,
        title: "Waterfront Apartment - Dubai Marina",
        beds: 3,
        baths: 4,
        sqft: 3200,
        price: 8500000,
        amenities: ["Pool", "Gym", "Parking", "Concierge", "Security"],
        location: "Dubai Marina",
        type: "Apartment",
        description: "Elegant waterfront apartment with stunning marina views."
      },
      {
        id: 5,
        title: "Modern Villa with Golf Course Views - Arabian Ranches",
        beds: 5,
        baths: 6,
        sqft: 8500,
        price: 18000000,
        amenities: ["Pool", "Garden", "Parking", "Security"],
        location: "Arabian Ranches",
        type: "Villa",
        description: "Contemporary villa overlooking the championship golf course in Arabian Ranches."
      },
      {
        id: 6,
        title: "Luxury Townhouse - Jumeirah Village Circle",
        beds: 4,
        baths: 5,
        sqft: 4500,
        price: 6500000,
        amenities: ["Pool", "Parking", "Garden", "Security"],
        location: "Jumeirah Village Circle",
        type: "Townhouse",
        description: "Spacious townhouse in the heart of JVC."
      }
    ]));
  }, [dispatch]);

  return (
    <div className="homepage">
      <MegaNav user={user} />
      
      <Hero />
      
      <OnboardingGateway />
      
      <Features />
      
      <Locations />
      
      <section className="section-wrapper" id="map">
        <InteractiveMap onPropertySelect={(property) => handlePropertyClick(property.id)} />
      </section>

      <section className="section-wrapper" id="compare">
        <PropertyComparison />
      </section>

      <section className="section-wrapper" id="offplan">
        <OffPlanTracker />
      </section>

      <section className="section-wrapper" id="neighborhood">
        <NeighborhoodAnalyzer />
      </section>

      <section className="section-wrapper" id="calculator">
        <RentVsBuyCalculator />
      </section>

      <section className="section-wrapper" id="virtual-tours">
        <VirtualTourGallery />
      </section>

      <section className="section-wrapper" id="dubai-map">
        <DubaiMap onPropertySelect={(property) => handlePropertyClick(property.id)} />
      </section>

      <Testimonials />

      <Team />
      
      <CompanyProfile />
      
      <BlogSection />
      
      <ContactCTA />
      
      <NewsletterSubscription />
      
      <Footer />
      
      <ClickToChat />
    </div>
  );
}
