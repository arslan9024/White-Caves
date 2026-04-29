import mongoose from 'mongoose';

const dubaiCommunitySchema = new mongoose.Schema({
  communityId: { type: String, required: true, unique: true },
  communityName: { type: String, required: true },
  arabicName: String,
  tier: {
    type: String,
    enum: ['super_prime', 'prime', 'established', 'emerging', 'affordable'],
    required: true
  },
  location: {
    district: String,
    area: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    nearestMetro: String,
    distanceToMetroKm: Number,
    nearestMall: String,
    nearestBeachKm: Number,
    distanceToAirportKm: Number,
    distanceToDowntownKm: Number
  },
  propertyTypes: [{
    type: { type: String, enum: ['villa', 'apartment', 'penthouse', 'townhouse', 'plot'] },
    available: Boolean,
    priceRangeAED: { min: Number, max: Number }
  }],
  marketData: {
    averagePricePerSqFt: Number,
    rentalYieldPercent: Number,
    priceGrowthYoY: Number,
    transactionVolume: Number,
    averageDaysOnMarket: Number,
    demandIndex: Number,
    supplyIndex: Number,
    lastUpdated: Date
  },
  demographics: {
    primaryNationalities: [String],
    averageHouseholdIncome: Number,
    familyFriendly: Boolean,
    expatFriendly: Boolean,
    investorPopular: Boolean
  },
  amenities: {
    schools: [{
      name: String,
      curriculum: String,
      rating: Number,
      distanceKm: Number
    }],
    hospitals: [{
      name: String,
      hospitalType: String,
      distanceKm: Number
    }],
    malls: [String],
    parks: [String],
    gyms: [String],
    restaurants: Number,
    beaches: Boolean,
    golf: Boolean,
    marina: Boolean
  },
  infrastructure: {
    roadQuality: { type: Number, min: 1, max: 10 },
    trafficScore: { type: Number, min: 1, max: 10 },
    parkingAvailability: { type: String, enum: ['excellent', 'good', 'moderate', 'limited'] },
    publicTransport: Boolean,
    futureProjects: [{
      projectName: String,
      completionYear: Number,
      impactOnValue: String
    }]
  },
  lifestyle: {
    vibe: { type: String, enum: ['luxury', 'family', 'urban', 'beachfront', 'golf', 'mixed'] },
    noiseLevel: { type: String, enum: ['very_quiet', 'quiet', 'moderate', 'busy'] },
    walkability: { type: Number, min: 1, max: 10 },
    nightlife: Boolean,
    petFriendly: Boolean
  },
  developers: [{
    developerName: String,
    projectCount: Number,
    majorProjects: [String]
  }],
  serviceCharges: {
    averagePerSqFt: Number,
    range: { min: Number, max: Number }
  },
  regulations: {
    freeholdAvailable: Boolean,
    shortTermRentalAllowed: Boolean,
    visaEligible: Boolean,
    minimumInvestmentForVisa: Number
  },
  aiRecommendationScore: {
    forInvestors: Number,
    forFamilies: Number,
    forYoungProfessionals: Number,
    forRetirees: Number,
    forLuxurySeekers: Number
  },
  images: {
    hero: String,
    gallery: [String]
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('DubaiCommunity', dubaiCommunitySchema);
