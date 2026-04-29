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
}

export const HOME_PROPERTIES: HomeProperty[] = [
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
