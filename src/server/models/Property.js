
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  listingType: { type: String, enum: ['RENT', 'SALE'], required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  beds: Number,
  baths: Number,
  features: {
    floorLevel: Number,
    view: String,
    balcony: Boolean,
    parkingSpaces: Number,
    kitchenType: { type: String, enum: ['OPEN', 'CLOSED', 'SEMI_OPEN'] },
    condition: { type: String, enum: ['NEW', 'EXCELLENT', 'GOOD', 'FAIR'] }
  },
  specifications: {
    buildYear: Number,
    lastRenovated: Date,
    totalFloors: Number,
    maintenanceFee: Number,
    plotArea: Number,
    buildUpArea: Number
  },
  sqft: Number,
  amenities: [String],
  images: [String],
  propertyType: { type: String, enum: ['Apartment', 'Villa', 'Townhouse', 'Penthouse'] },
  yearBuilt: Number,
  furnished: Boolean,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  propertyManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Property', propertySchema);
