import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  featuredProperties: [
    {
      id: 1,
      title: 'Luxury Penthouse in Dubai Marina',
      description: 'Stunning 4-bedroom penthouse with panoramic views of the Marina and Palm Jumeirah. Features include private pool, smart home technology, and premium finishes throughout.',
      price: 15000000,
      priceFormatted: 'AED 15,000,000',
      type: 'sale',
      propertyType: 'Penthouse',
      bedrooms: 4,
      bathrooms: 5,
      area: 6500,
      location: 'Dubai Marina',
      images: [
        '/assets/properties/marina-penthouse-1.jpg',
        '/assets/properties/marina-penthouse-2.jpg',
        '/assets/properties/marina-penthouse-3.jpg'
      ],
      features: ['Private Pool', 'Smart Home', 'Marina View', 'Concierge'],
      agent: { name: 'Sarah Johnson', phone: '+971 50 123 4567' }
    },
    {
      id: 2,
      title: 'Modern Villa in Palm Jumeirah',
      description: 'Exquisite beachfront villa offering private beach access, infinity pool, and breathtaking sunset views. Designed for ultimate luxury living.',
      price: 35000000,
      priceFormatted: 'AED 35,000,000',
      type: 'sale',
      propertyType: 'Villa',
      bedrooms: 6,
      bathrooms: 7,
      area: 12000,
      location: 'Palm Jumeirah',
      images: [
        '/assets/properties/palm-villa-1.jpg',
        '/assets/properties/palm-villa-2.jpg',
        '/assets/properties/palm-villa-3.jpg'
      ],
      features: ['Beach Access', 'Infinity Pool', 'Home Cinema', 'Staff Quarters'],
      agent: { name: 'Ahmed Al Rashid', phone: '+971 50 234 5678' }
    },
    {
      id: 3,
      title: 'Elegant Apartment in Downtown Dubai',
      description: 'Sophisticated 3-bedroom apartment with direct views of Burj Khalifa. Walking distance to Dubai Mall and Dubai Fountain.',
      price: 8500000,
      priceFormatted: 'AED 8,500,000',
      type: 'sale',
      propertyType: 'Apartment',
      bedrooms: 3,
      bathrooms: 4,
      area: 3200,
      location: 'Downtown Dubai',
      images: [
        '/assets/properties/downtown-apt-1.jpg',
        '/assets/properties/downtown-apt-2.jpg',
        '/assets/properties/downtown-apt-3.jpg'
      ],
      features: ['Burj Khalifa View', 'Premium Location', 'High Floor', 'Gym'],
      agent: { name: 'Maria Santos', phone: '+971 50 345 6789' }
    }
  ],
  
  rentalProperties: [
    {
      id: 101,
      title: 'Luxury 2BR in DIFC',
      description: 'Modern 2-bedroom apartment in the heart of Dubai International Financial Centre. Perfect for professionals.',
      price: 180000,
      priceFormatted: 'AED 180,000/year',
      type: 'rent',
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: 1500,
      location: 'DIFC',
      images: [
        '/assets/properties/difc-apt-1.jpg',
        '/assets/properties/difc-apt-2.jpg'
      ],
      features: ['City View', 'Gym', 'Pool', 'Covered Parking'],
      agent: { name: 'John Smith', phone: '+971 50 456 7890' }
    },
    {
      id: 102,
      title: 'Family Villa in Arabian Ranches',
      description: 'Spacious 5-bedroom villa with private garden and community pool access. Ideal for families.',
      price: 350000,
      priceFormatted: 'AED 350,000/year',
      type: 'rent',
      propertyType: 'Villa',
      bedrooms: 5,
      bathrooms: 5,
      area: 5000,
      location: 'Arabian Ranches',
      images: [
        '/assets/properties/ar-villa-1.jpg',
        '/assets/properties/ar-villa-2.jpg'
      ],
      features: ['Private Garden', 'Maid Room', 'Community Pool', 'Near Schools'],
      agent: { name: 'Fatima Al Hassan', phone: '+971 50 567 8901' }
    }
  ],

  heroSlides: [
    {
      id: 1,
      title: 'Find Your Dream Luxury Home in Dubai',
      subtitle: 'Experience unparalleled luxury living in Dubai\'s most prestigious locations. White Caves brings you exclusive properties with world-class amenities.',
      image: '/assets/hero/dubai-skyline.jpg',
      ctaText: 'Explore Properties',
      ctaLink: '/properties'
    },
    {
      id: 2,
      title: 'Premium Waterfront Living',
      subtitle: 'Discover stunning beachfront villas and marina residences with private beach access and breathtaking views.',
      image: '/assets/hero/waterfront.jpg',
      ctaText: 'View Waterfront',
      ctaLink: '/properties?location=waterfront'
    },
    {
      id: 3,
      title: 'Investment Opportunities',
      subtitle: 'Dubai\'s real estate market offers exceptional returns. Let our experts guide you to the best investment properties.',
      image: '/assets/hero/investment.jpg',
      ctaText: 'Learn More',
      ctaLink: '/services/investment'
    }
  ],

  neighborhoods: [
    {
      id: 'dubai-marina',
      name: 'Dubai Marina',
      description: 'Premier waterfront community with stunning marina views and world-class amenities.',
      image: '/assets/neighborhoods/marina.jpg',
      score: 92,
      grade: 'A+',
      trend: 'rising',
      avgPrice: 2500000,
      properties: 245
    },
    {
      id: 'downtown',
      name: 'Downtown Dubai',
      description: 'Iconic location home to Burj Khalifa, Dubai Mall, and the famous Dubai Fountain.',
      image: '/assets/neighborhoods/downtown.jpg',
      score: 95,
      grade: 'A+',
      trend: 'stable',
      avgPrice: 3200000,
      properties: 189
    },
    {
      id: 'palm-jumeirah',
      name: 'Palm Jumeirah',
      description: 'World-famous man-made island offering exclusive beachfront living.',
      image: '/assets/neighborhoods/palm.jpg',
      score: 94,
      grade: 'A+',
      trend: 'rising',
      avgPrice: 8500000,
      properties: 156
    },
    {
      id: 'jbr',
      name: 'JBR - The Walk',
      description: 'Vibrant beachfront community with retail, dining, and entertainment.',
      image: '/assets/neighborhoods/jbr.jpg',
      score: 88,
      grade: 'A',
      trend: 'rising',
      avgPrice: 1800000,
      properties: 312
    }
  ],

  services: [
    {
      id: 'buying',
      title: 'Property Buying',
      description: 'Expert guidance through every step of purchasing your dream property in Dubai.',
      icon: '🏠',
      features: ['Market Analysis', 'Property Tours', 'Negotiation Support', 'Legal Assistance']
    },
    {
      id: 'selling',
      title: 'Property Selling',
      description: 'Maximize your property value with our comprehensive selling services.',
      icon: '💰',
      features: ['Valuation', 'Marketing', 'Buyer Screening', 'Transaction Support']
    },
    {
      id: 'leasing',
      title: 'Leasing Services',
      description: 'Full-service leasing for landlords and tenants.',
      icon: '🔑',
      features: ['Tenant Screening', 'Lease Preparation', 'Rent Collection', 'Maintenance']
    },
    {
      id: 'investment',
      title: 'Investment Advisory',
      description: 'Strategic investment advice for maximum returns.',
      icon: '📈',
      features: ['ROI Analysis', 'Market Trends', 'Portfolio Management', 'Off-Plan Deals']
    }
  ],

  testimonials: [
    {
      id: 1,
      name: 'Mohammed Al Farsi',
      role: 'Property Investor',
      content: 'White Caves helped me find the perfect investment property in Dubai Marina. Their market knowledge is exceptional.',
      rating: 5,
      avatar: '/assets/testimonials/user1.jpg'
    },
    {
      id: 2,
      name: 'Emma Thompson',
      role: 'Homeowner',
      content: 'The team made buying our family home a seamless experience. Highly recommend their services.',
      rating: 5,
      avatar: '/assets/testimonials/user2.jpg'
    },
    {
      id: 3,
      name: 'Raj Patel',
      role: 'Business Owner',
      content: 'Professional service from start to finish. They found us the perfect office space in DIFC.',
      rating: 5,
      avatar: '/assets/testimonials/user3.jpg'
    }
  ],

  sliderSettings: {
    autoPlay: true,
    autoPlayInterval: 5000,
    showDots: true,
    showArrows: true,
    infinite: true,
    slidesPerView: {
      mobile: 1,
      tablet: 2,
      desktop: 3
    }
  },

  isLoading: false,
  error: null
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setFeaturedProperties: (state, action) => {
      state.featuredProperties = action.payload;
    },
    setRentalProperties: (state, action) => {
      state.rentalProperties = action.payload;
    },
    setHeroSlides: (state, action) => {
      state.heroSlides = action.payload;
    },
    setNeighborhoods: (state, action) => {
      state.neighborhoods = action.payload;
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setTestimonials: (state, action) => {
      state.testimonials = action.payload;
    },
    updateSliderSettings: (state, action) => {
      state.sliderSettings = { ...state.sliderSettings, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addProperty: (state, action) => {
      const property = action.payload;
      if (property.type === 'sale') {
        state.featuredProperties.push(property);
      } else {
        state.rentalProperties.push(property);
      }
    },
    updateProperty: (state, action) => {
      const { id, updates } = action.payload;
      const saleIndex = state.featuredProperties.findIndex(p => p.id === id);
      if (saleIndex !== -1) {
        state.featuredProperties[saleIndex] = { ...state.featuredProperties[saleIndex], ...updates };
      }
      const rentIndex = state.rentalProperties.findIndex(p => p.id === id);
      if (rentIndex !== -1) {
        state.rentalProperties[rentIndex] = { ...state.rentalProperties[rentIndex], ...updates };
      }
    },
    removeProperty: (state, action) => {
      const id = action.payload;
      state.featuredProperties = state.featuredProperties.filter(p => p.id !== id);
      state.rentalProperties = state.rentalProperties.filter(p => p.id !== id);
    }
  }
});

export const {
  setFeaturedProperties,
  setRentalProperties,
  setHeroSlides,
  setNeighborhoods,
  setServices,
  setTestimonials,
  updateSliderSettings,
  setLoading,
  setError,
  addProperty,
  updateProperty,
  removeProperty
} = contentSlice.actions;

export const selectFeaturedProperties = state => state.content?.featuredProperties || [];
export const selectRentalProperties = state => state.content?.rentalProperties || [];
export const selectHeroSlides = state => state.content?.heroSlides || [];
export const selectNeighborhoods = state => state.content?.neighborhoods || [];
export const selectServices = state => state.content?.services || [];
export const selectTestimonials = state => state.content?.testimonials || [];
export const selectSliderSettings = state => state.content?.sliderSettings || {};
export const selectContentLoading = state => state.content?.isLoading || false;

export default contentSlice.reducer;
