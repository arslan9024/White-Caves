/**
 * Featured properties displayed on the HomePage.
 * Extracted to a separate file to avoid re-creating objects on every render.
 */

export interface HomeProperty {
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
  image: string;
}

export const HOME_PROPERTIES: HomeProperty[] = [
  {
    id: 1,
    title: 'Beachfront Villa with Private Pool - Palm Jumeirah',
    beds: 6,
    baths: 7,
    sqft: 12000,
    price: 45000000,
    amenities: ['Pool', 'Beach Access', 'Parking', 'Security', 'Garden', 'Gym'],
    location: 'Palm Jumeirah',
    type: 'Villa',
    description:
      'Stunning beachfront villa on the prestigious Palm Jumeirah fronds with panoramic views of the Arabian Gulf.',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Burj Khalifa View Penthouse - Downtown Dubai',
    beds: 4,
    baths: 5,
    sqft: 6500,
    price: 35000000,
    amenities: ['Gym', 'Parking', 'Concierge', 'Pool', 'Security'],
    location: 'Downtown Dubai',
    type: 'Penthouse',
    description:
      'Ultra-luxury penthouse with breathtaking views of Burj Khalifa and Dubai Fountain.',
    image:
      'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Mediterranean Style Mansion - Emirates Hills',
    beds: 7,
    baths: 9,
    sqft: 15000,
    price: 65000000,
    amenities: ['Pool', 'Garden', 'Security', 'Parking', 'Gym', 'Cinema'],
    location: 'Emirates Hills',
    type: 'Villa',
    description:
      'Magnificent mansion with lush gardens and golf course views in the most exclusive community.',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Marina Skyline Apartment - Dubai Marina',
    beds: 3,
    baths: 4,
    sqft: 3200,
    price: 8500000,
    amenities: ['Pool', 'Gym', 'Parking', 'Security', 'Concierge'],
    location: 'Dubai Marina',
    type: 'Apartment',
    description: 'Contemporary living space with stunning marina and sea views.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Signature Villa - Palm Jumeirah',
    beds: 5,
    baths: 6,
    sqft: 8500,
    price: 28000000,
    amenities: ['Pool', 'Beach Access', 'Parking', 'Security', 'Garden'],
    location: 'Palm Jumeirah',
    type: 'Villa',
    description: 'Exclusive signature villa with private beach access and infinity pool.',
    image:
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'Sky Collection Duplex - DIFC',
    beds: 4,
    baths: 5,
    sqft: 5200,
    price: 22000000,
    amenities: ['Pool', 'Gym', 'Concierge', 'Parking', 'Security'],
    location: 'DIFC',
    type: 'Penthouse',
    description: "Stunning duplex penthouse in the heart of Dubai's financial district.",
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];
