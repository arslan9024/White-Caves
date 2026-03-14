import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  propertyCode: { type: String, unique: true },
  
  listingSource: {
    platform: { type: String, enum: ['whatsapp', 'email', 'call', 'website', 'walkin'] },
    conversationId: String,
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    capturedBy: String,
    timestamp: Date
  },

  title: { type: String, required: true },
  titleArabic: String,
  description: { type: String, required: true },
  descriptionArabic: String,

  details: {
    emirate: {
      type: String,
      enum: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'RAK', 'Fujairah', 'Umm Al Quwain'],
      default: 'Dubai'
    },
    community: String,
    buildingName: String,
    unitNumber: String,
    propertyType: {
      type: String,
      enum: ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Office', 'Warehouse', 'Land', 'Studio']
    },
    
    permitNumber: String,
    ejariNumber: String,
    dewaNumber: String,
    reraNumber: String,
    dldNumber: String,
    makaniNumber: String,
    
    price: {
      amount: Number,
      currency: { type: String, default: 'AED' },
      paymentTerms: { type: String, enum: ['annually', 'quarterly', 'monthly', 'cheque'] },
      numberOfCheques: Number,
      commission: {
        percentage: { type: Number, default: 2 },
        fixedAmount: Number
      },
      pricePerSqft: Number
    },
    
    size: {
      builtUp: Number,
      plot: Number,
      bedrooms: Number,
      bathrooms: Number,
      maidRoom: Boolean,
      studyRoom: Boolean,
      driverRoom: Boolean
    },
    
    amenities: [{
      type: String,
      enum: [
        'Private Pool', 'Gym', 'Concierge', 'Valet Parking', 'Children\'s Play Area',
        'Barbecue Area', 'Balcony', 'Sea View', 'Private Garden', 'Maids Room',
        'Covered Parking', 'Security', 'Central AC', 'Built-in Wardrobes',
        'Kitchen Appliances', 'Pets Allowed', 'Study Room', 'Private Beach',
        'Golf Course View', 'Burj Khalifa View', 'Marina View', 'Palm View',
        'Smart Home', 'Private Elevator', 'Rooftop Terrace', 'Jacuzzi',
        'Sauna', 'Steam Room', 'Tennis Court', 'Squash Court'
      ]
    }],
    
    documents: [{
      documentType: {
        type: String,
        enum: ['Title Deed', 'Ejari', 'DLD Certificate', 'Building Plans',
               'NOC', 'Passport Copy', 'Visa Copy', 'Emirates ID', 'Trade License',
               'SPA', 'MOU', 'POA', 'Floor Plan', 'Oqood']
      },
      url: String,
      fileName: String,
      expiryDate: Date,
      verified: { type: Boolean, default: false },
      uploadedAt: { type: Date, default: Date.now }
    }]
  },

  listingType: { type: String, enum: ['RENT', 'SALE', 'SHORT_TERM'], required: true },
  
  features: {
    floorLevel: Number,
    totalFloors: Number,
    view: String,
    balcony: Boolean,
    parkingSpaces: Number,
    kitchenType: { type: String, enum: ['OPEN', 'CLOSED', 'SEMI_OPEN'] },
    condition: { type: String, enum: ['NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_RENOVATION'] },
    furnished: { type: String, enum: ['FURNISHED', 'UNFURNISHED', 'SEMI_FURNISHED'] },
    orientation: { type: String, enum: ['NORTH', 'SOUTH', 'EAST', 'WEST', 'CORNER'] }
  },
  
  specifications: {
    buildYear: Number,
    lastRenovated: Date,
    handoverDate: Date,
    isOffPlan: { type: Boolean, default: false },
    completionPercentage: Number,
    maintenanceFee: Number,
    serviceCharge: Number,
    plotArea: Number,
    buildUpArea: Number,
    developer: String,
    masterDeveloper: String
  },

  location: { type: String, required: true },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  
  images: [String],
  virtualTourUrl: String,
  videoUrl: String,
  floorPlanUrl: String,

  status: {
    current: {
      type: String,
      enum: ['available', 'reserved', 'under_contract', 'sold', 'rented', 'off_market', 'coming_soon'],
      default: 'available'
    },
    history: [{
      status: String,
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now },
      notes: String
    }]
  },

  client: {
    type: { type: String, enum: ['buyer', 'seller', 'tenant', 'landlord'] },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requirements: {
      urgency: { type: String, enum: ['immediate', '1_month', '3_months', 'flexible'] },
      viewingTimes: [Date],
      specialRequirements: String,
      preferredLanguage: { type: String, enum: ['en', 'ar'], default: 'en' }
    }
  },

  assignment: {
    primaryAgent: {
      agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      assignedDate: Date,
      assignmentReason: { type: String, enum: ['expertise_match', 'availability', 'client_request', 'round_robin', 'ai_optimized'] }
    },
    supportingAgents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{
      taskId: String,
      googleTaskId: String,
      description: String,
      dueDate: Date,
      completed: { type: Boolean, default: false },
      completedAt: Date
    }]
  },

  viewings: [{
    dateTime: Date,
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    calendarEventId: String,
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled'] },
    feedback: String,
    rating: { type: Number, min: 1, max: 5 },
    followUpTasks: [String],
    notes: String
  }],

  metrics: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    whatsappClicks: { type: Number, default: 0 },
    savedCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    timeOnMarket: Number,
    priceReductions: [{
      oldPrice: Number,
      newPrice: Number,
      date: { type: Date, default: Date.now },
      reason: String
    }]
  },

  leadScore: {
    score: { type: Number, default: 0 },
    factors: {
      priceCompetitiveness: Number,
      locationDemand: Number,
      propertyCondition: Number,
      marketTrend: Number
    },
    lastCalculated: Date
  },

  seo: {
    slug: String,
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  propertyManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  listedDate: Date,
  expectedClosure: Date,
  isFeatured: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

propertySchema.index({ 'details.emirate': 1, 'details.community': 1 });
propertySchema.index({ listingType: 1, 'status.current': 1 });
propertySchema.index({ 'details.price.amount': 1 });
propertySchema.index({ propertyCode: 1 });
propertySchema.index({ 'seo.slug': 1 });

propertySchema.pre('save', function(next) {
  if (!this.propertyCode) {
    const emirateCode = this.details?.emirate?.substring(0, 3).toUpperCase() || 'DXB';
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.propertyCode = `${emirateCode}-${randomId}`;
  }
  next();
});

export default mongoose.model('Property', propertySchema);
