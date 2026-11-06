// FILE: src/components/crm/AgentListingForm/AgentListingForm.data.js
import {
  Home,
  MapPin,
  Ruler,
  DollarSign,
  Image,
  FileText,
  Building2,
  Castle,
  Hotel,
  Warehouse,
  LandPlot,
  Car,
  Sofa,
  Waves,
  Dumbbell,
  Shield,
  Wifi,
  Sun,
  TreePine,
} from 'lucide-react';

export const STEPS = [
  { id: 1, title: 'Basic Info', icon: Home },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Specifications', icon: Ruler },
  { id: 4, title: 'Pricing', icon: DollarSign },
  { id: 5, title: 'Media', icon: Image },
  { id: 6, title: 'Legal & Marketing', icon: FileText },
];

export const PROPERTY_TYPES = [
  { id: 'apartment', name: 'Apartment', icon: Building2 },
  { id: 'villa', name: 'Villa', icon: Castle },
  { id: 'townhouse', name: 'Townhouse', icon: Home },
  { id: 'penthouse', name: 'Penthouse', icon: Hotel },
  { id: 'duplex', name: 'Duplex', icon: Building2 },
  { id: 'triplex', name: 'Triplex', icon: Building2 },
  { id: 'office', name: 'Office', icon: Warehouse },
  { id: 'retail', name: 'Retail', icon: Warehouse },
  { id: 'warehouse', name: 'Warehouse', icon: Warehouse },
  { id: 'land', name: 'Land', icon: LandPlot },
];

export const DUBAI_COMMUNITIES = [
  'Downtown Dubai',
  'Palm Jumeirah',
  'Dubai Marina',
  'Emirates Hills',
  'Dubai Hills Estate',
  'Jumeirah Bay Island',
  'Business Bay',
  'Arabian Ranches',
  'Al Barari',
  'Bluewaters Island',
  'City Walk',
  'Dubai Creek Harbour',
  'JLT',
  'DIFC',
  'Jumeirah Golf Estates',
  'MBR City',
];

export const AMENITIES = [
  { id: 'pool', name: 'Swimming Pool', icon: Waves },
  { id: 'gym', name: 'Gym', icon: Dumbbell },
  { id: 'security', name: '24/7 Security', icon: Shield },
  { id: 'parking', name: 'Covered Parking', icon: Car },
  { id: 'wifi', name: 'High-Speed WiFi', icon: Wifi },
  { id: 'balcony', name: 'Balcony/Terrace', icon: Sun },
  { id: 'garden', name: 'Private Garden', icon: TreePine },
  { id: 'furnished', name: 'Furnished', icon: Sofa },
];

export const VIEWS = [
  'Sea View',
  'City View',
  'Golf View',
  'Park View',
  'Lake View',
  'Marina View',
  'Garden View',
];

export const COMPLETION_STATUS = [
  { id: 'ready', name: 'Ready to Move' },
  { id: 'off_plan', name: 'Off-Plan' },
  { id: 'under_construction', name: 'Under Construction' },
];

export const FURNISH_TYPES = [
  { id: 'unfurnished', name: 'Unfurnished' },
  { id: 'furnished', name: 'Furnished' },
  { id: 'partially', name: 'Partially Furnished' },
];

export const MARKETING_PACKAGES = [
  { id: 'basic', name: 'Basic', price: 'Free', features: ['Standard listing', 'Basic visibility'] },
  {
    id: 'premium',
    name: 'Premium',
    price: 'AED 500',
    features: ['Featured badge', 'Priority ranking', 'Social promotion'],
  },
  {
    id: 'luxury',
    name: 'Luxury',
    price: 'AED 1,500',
    features: ['All Premium features', 'Virtual staging', 'Drone footage'],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 'AED 5,000',
    features: ['All Luxury features', 'PR coverage', 'International syndication'],
  },
];

export const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  propertyType: '',
  completionStatus: 'ready',
  furnishType: 'unfurnished',
  community: '',
  subCommunity: '',
  buildingName: '',
  floorNumber: '',
  unitNumber: '',
  address: '',
  bedrooms: '',
  bathrooms: '',
  builtUpArea: '',
  plotSize: '',
  parkingSpaces: '',
  yearBuilt: '',
  developer: '',
  amenities: [],
  views: [],
  listingType: 'sale',
  salePrice: '',
  rentPrice: '',
  rentFrequency: 'yearly',
  serviceCharges: '',
  images: [],
  floorPlans: [],
  videoUrl: '',
  virtualTourUrl: '',
  titleDeedNumber: '',
  reraPermitNumber: '',
  ownershipType: 'freehold',
  marketingPackage: 'premium',
  featuredLevel: 5,
};
