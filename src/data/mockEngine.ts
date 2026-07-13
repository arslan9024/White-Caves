export interface MockProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  type: 'Villa' | 'Penthouse' | 'Apartment' | 'Townhouse';
  status: 'Available' | 'Sold' | 'Off-Plan';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  amenities: string[];
  images: string[];
}

export const generateHighFidelityDubaiMocks = (): MockProperty[] => {
  return [
    {
      id: 'prop-dxb-001',
      title: 'Signature Villa on Frond G',
      location: 'Palm Jumeirah, Dubai',
      price: 125000000,
      currency: 'AED',
      type: 'Villa',
      status: 'Available',
      bedrooms: 6,
      bathrooms: 8,
      sqft: 14000,
      amenities: ['Private Beach', 'Infinity Pool', 'Smart Home', 'Cinema'],
      images: ['/images/mocks/palm-villa-1.jpg'],
    },
    {
      id: 'prop-dxb-002',
      title: 'Triplex Penthouse in Burj Khalifa',
      location: 'Downtown Dubai, Dubai',
      price: 85000000,
      currency: 'AED',
      type: 'Penthouse',
      status: 'Available',
      bedrooms: 4,
      bathrooms: 5,
      sqft: 9500,
      amenities: ['Helipad Access', 'Private Elevator', '360 Views'],
      images: ['/images/mocks/burj-penthouse.jpg'],
    },
    {
      id: 'prop-dxb-003',
      title: 'Waterfront Mansion',
      location: 'Dubai Marina, Dubai',
      price: 65000000,
      currency: 'AED',
      type: 'Villa',
      status: 'Off-Plan',
      bedrooms: 5,
      bathrooms: 6,
      sqft: 11000,
      amenities: ['Yacht Dock', 'Spa', 'Wine Cellar'],
      images: ['/images/mocks/marina-mansion.jpg'],
    }
  ];
};

export const MockEngine = {
  getProperties: generateHighFidelityDubaiMocks,
  getTopAgents: () => [
    { id: 'agt-1', name: 'Sara Al Maktoum', salesVolume: 'AED 450M', tier: 'Platinum' },
    { id: 'agt-2', name: 'Tariq Mansoor', salesVolume: 'AED 320M', tier: 'Gold' },
  ]
};
