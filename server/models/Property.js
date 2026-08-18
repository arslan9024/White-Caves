import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    propertyType: {
      type: String,
      enum: ['apartment', 'villa', 'townhouse', 'penthouse', 'commercial', 'land'],
      default: 'apartment',
    },
    listingType: {
      type: String,
      enum: ['sale', 'rent'],
      default: 'sale',
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'AED',
    },
    location: {
      community: String,
      city: { type: String, default: 'Dubai' },
      country: { type: String, default: 'UAE' },
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    bedrooms: {
      type: Number,
      default: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    area: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['available', 'under_offer', 'reserved', 'sold', 'rented'],
      default: 'available',
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
    },
    developer: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

export default Property;
