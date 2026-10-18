import type { Model, Types } from 'mongoose';

interface PropertyRecord {
  title: string;
  description: string;
  propertyType: 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'commercial' | 'land';
  listingType: 'sale' | 'rent';
  price: number;
  currency: string;
  location?: {
    community?: string;
    city: string;
    country: string;
    address?: string;
    coordinates?: { lat?: number; lng?: number };
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  amenities: string[];
  status: 'available' | 'under_offer' | 'reserved' | 'sold' | 'rented';
  agentId?: Types.ObjectId;
  developer: string;
  createdAt: Date;
  updatedAt: Date;
}

declare const Property: Model<PropertyRecord>;
export default Property;
