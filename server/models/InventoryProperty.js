import mongoose from 'mongoose';

const InventoryPropertySchema = new mongoose.Schema({
  pNumber: {
    type: String,
    index: true
  },
  area: {
    type: String,
    required: true,
    index: true
  },
  project: {
    type: String,
    required: true
  },
  masterProject: String,
  cluster: String,
  plotNumber: String,
  building: String,
  unitNumber: String,
  floor: Number,
  layout: String,
  viewType: String,
  propertyType: {
    type: String,
    enum: ['villa', 'townhouse', 'apartment', 'plot', 'penthouse', 'duplex', 'studio', 'other'],
    default: 'villa'
  },
  rooms: Number,
  actualArea: Number,
  areaUnit: {
    type: String,
    default: 'sqft'
  },
  // LEGACY - Kept for backward compatibility
  status: {
    type: String,
    enum: ['available', 'rented', 'sold', 'reserved', 'off_market', 'under_renovation'],
    default: 'available',
    index: true
  },
  
  // NEW MULTI-DIMENSIONAL STATUS SYSTEM
  // Allows tracking multiple status dimensions simultaneously
  constructionStage: {
    type: String,
    enum: ['under_construction', 'handed_over', 'ready_for_occupancy'],
    default: 'handed_over',
    index: true
  },
  
  occupancyStatus: {
    type: String,
    enum: ['occupied_by_tenant', 'occupied_by_owner', 'vacant', 'undergoing_renovation'],
    default: 'vacant',
    index: true
  },
  
  marketAvailability: {
    type: String,
    enum: ['available_for_rent', 'available_for_sale', 'available_for_both', 'not_available', 'blocked_from_dld'],
    default: 'available_for_both',
    index: true
  },
  
  furnishingLevel: {
    type: String,
    enum: ['unfurnished', 'semi_furnished', 'furnished'],
    default: 'unfurnished',
    index: true
  },
  
  legalStatus: {
    type: String,
    enum: ['registered_with_dld', 'awaiting_registration', 'off_plan', 'subject_to_mortgage', 'clear_title'],
    default: 'clear_title',
    index: true
  },
  
  // Compliance and regulatory metadata
  reraLicenseNumber: String,
  mortgageRestrictions: [String],
  offPlanExpiryDate: Date,
  dldBlockReasonCode: String,
  
  purpose: {
    type: String,
    enum: ['sale', 'rent', 'both'],
    default: 'rent'
  },
  askingPrice: Number,
  currency: {
    type: String,
    default: 'AED'
  },
  registration: String,
  municipalityNo: String,
  dewaPremiseNumber: String,
  otpDubaiRest: String,
  sdNumber: String,
  owners: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner'
  }],
  primaryOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner'
  },
  
  // Occupancy and tenant tracking
  currentTenant: {
    id: String,
    name: String,
    phone: String,
    email: String
  },
  leaseStartDate: Date,
  leaseEndDate: Date,
  leaseRentAmount: Number,
  leaseRentCurrency: { type: String, default: 'AED' },
  
  agent: {
    id: String,
    name: String
  },
  images: [String],
  documents: [{
    type: { type: String },
    url: String,
    name: String,
    uploadedAt: Date
  }],
  notes: String,
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  inquiries: {
    type: Number,
    default: 0
  },
  lastMaintenanceDate: Date,
  source: {
    type: String,
    enum: ['excel_import', 'manual', 'api', 'migration', 'whatsapp_conversation', 'broker', 'direct_contact'],
    default: 'manual',
    index: true
  },
  sourceFileId: String,
  importBatch: String,
  
  // NEW: Sourcing Metadata (for properties sourced from WhatsApp conversations)
  sourcingMetadata: {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyOpportunity',
      sparse: true
    },
    ownerRelationshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OwnerRelationship',
      sparse: true
    },
    sourceConversationId: String, // WhatsApp conversation ID where property was found
    sourceMessage: String, // Original message from owner
    extractedAt: Date, // When property was extracted from conversation
    extractedBy: String, // Agent or system name that extracted
    discoveredVia: {
      type: String,
      enum: ['conversation_analysis', 'manual_follow_up', 'owner_provided'],
      sparse: true
    },
    verificationCompletedAt: Date,
    verificationCompletedBy: String,
    initialConfidenceScore: Number, // Confidence when first detected
    finalConfidenceScore: Number, // Confidence when verified
    dayToVerification: Number // How many days from detection to verification
  },
  
  // NEW: Owner Information (for directly sourced properties)
  ownerContact: {
    whatsappNumber: String,
    alternatePhone: String,
    ownerEmail: String,
    ownerName: String,
    ownerVerified: Boolean,
    ownerVerifiedAt: Date,
    ownerRelationshipStatus: {
      type: String,
      enum: ['prospect', 'active', 'inactive'],
      sparse: true
    }
  },
  
  // NEW: Property Sourcing Status Workflow
  sourcingStatus: {
    stage: {
      type: String,
      enum: [
        'opportunity_detected',        // Found in conversation, awaiting details
        'details_requested',           // Asked owner for more info
        'details_received',            // Owner provided details
        'partially_verified',          // Some info confirmed
        'fully_verified',              // All info confirmed
        'ready_for_listing',           // Ready to show to agents
        'listed_in_inventory',         // Now in live inventory
        'deal_in_progress',            // Deal/viewing scheduled
        'deal_closed'                  // Property rented or sold
      ],
      default: 'listed_in_inventory',
      index: true
    },
    stageUpdatedAt: Date,
    stageUpdatedBy: String,
    daysInCurrentStage: Number
  },
  
  // NEW: Sourcing Performance Metrics
  sourcingMetrics: {
    leadsReceived: { type: Number, default: 0 },
    viewingsScheduled: { type: Number, default: 0 },
    offersReceived: { type: Number, default: 0 },
    dealsClosedCount: { type: Number, default: 0 },
    daysToDeal: Number, // Days from listing to deal closed
    dealType: { // First deal for this property
      type: String,
      enum: ['rental', 'sale'],
      sparse: true
    },
    dealValue: Number, // AED
    successScore: { // 1-10, how quickly/easily did this property close
      type: Number,
      min: 1,
      max: 10
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: String,
  updatedBy: String
}, {
  timestamps: true
});

InventoryPropertySchema.index({ pNumber: 1, area: 1 }, { unique: true, sparse: true });
InventoryPropertySchema.index({ area: 1, status: 1 });
InventoryPropertySchema.index({ project: 1 });
InventoryPropertySchema.index({ 'owners': 1 });
InventoryPropertySchema.index({ municipalityNo: 1 }, { sparse: true });

// NEW: Indexes for sourcing functionality
InventoryPropertySchema.index({ source: 1 });
InventoryPropertySchema.index({ 'sourcingMetadata.opportunityId': 1 });
InventoryPropertySchema.index({ 'sourcingMetadata.ownerRelationshipId': 1 });
InventoryPropertySchema.index({ 'sourcingMetadata.extractedAt': -1 });
InventoryPropertySchema.index({ 'sourcingMetadata.sourceConversationId': 1 });
InventoryPropertySchema.index({ 'sourcingStatus.stage': 1 });
InventoryPropertySchema.index({ 'ownerContact.whatsappNumber': 1 }, { sparse: true });
InventoryPropertySchema.index({ 'sourcingMetrics.dealsClosedCount': -1 });

InventoryPropertySchema.statics.findByPNumber = function(pNumber) {
  return this.findOne({ pNumber: String(pNumber) });
};

InventoryPropertySchema.statics.getAreaStats = async function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$area',
        total: { $sum: 1 },
        available: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } },
        rented: { $sum: { $cond: [{ $eq: ['$status', 'rented'] }, 1, 0] } },
        sold: { $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] } }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

InventoryPropertySchema.statics.getDistinctAreas = async function() {
  return this.distinct('area', { isActive: true });
};

// ADVANCED QUERY METHOD - Used by Linda/Nina for real-time property matching
InventoryPropertySchema.statics.queryProperties = async function(filters = {}) {
  const query = { isActive: true };
  
  // Multi-dimensional status filtering
  if (filters.constructionStage) query.constructionStage = filters.constructionStage;
  if (filters.occupancyStatus) query.occupancyStatus = filters.occupancyStatus;
  if (filters.marketAvailability) query.marketAvailability = filters.marketAvailability;
  if (filters.furnishingLevel) query.furnishingLevel = filters.furnishingLevel;
  if (filters.legalStatus) query.legalStatus = filters.legalStatus;
  
  // Location filtering
  if (filters.area) query.area = { $regex: filters.area, $options: 'i' };
  if (filters.areas && Array.isArray(filters.areas)) {
    query.area = { $in: filters.areas };
  }
  if (filters.project) query.project = { $regex: filters.project, $options: 'i' };
  
  // Property type and features
  if (filters.propertyType) query.propertyType = filters.propertyType;
  if (filters.propertyTypes && Array.isArray(filters.propertyTypes)) {
    query.propertyType = { $in: filters.propertyTypes };
  }
  
  // Room filtering
  if (filters.minRooms && filters.maxRooms) {
    query.rooms = { $gte: filters.minRooms, $lte: filters.maxRooms };
  } else if (filters.minRooms) {
    query.rooms = { $gte: filters.minRooms };
  } else if (filters.maxRooms) {
    query.rooms = { $lte: filters.maxRooms };
  }
  
  // Area size filtering
  if (filters.minArea && filters.maxArea) {
    query.actualArea = { $gte: filters.minArea, $lte: filters.maxArea };
  } else if (filters.minArea) {
    query.actualArea = { $gte: filters.minArea };
  } else if (filters.maxArea) {
    query.actualArea = { $lte: filters.maxArea };
  }
  
  // Price filtering (for sale properties)
  if (filters.minPrice && filters.maxPrice) {
    query.askingPrice = { $gte: filters.minPrice, $lte: filters.maxPrice };
  } else if (filters.minPrice) {
    query.askingPrice = { $gte: filters.minPrice };
  } else if (filters.maxPrice) {
    query.askingPrice = { $lte: filters.maxPrice };
  }
  
  // Purpose filtering (sale/rent)
  if (filters.purpose) {
    if (filters.purpose === 'rent') {
      query.purpose = { $in: ['rent', 'both'] };
    } else if (filters.purpose === 'sale') {
      query.purpose = { $in: ['sale', 'both'] };
    }
  }
  
  // Tags filtering
  if (filters.tags && Array.isArray(filters.tags)) {
    query.tags = { $in: filters.tags };
  }
  
  // View type filtering
  if (filters.viewType) {
    query.viewType = { $regex: filters.viewType, $options: 'i' };
  }
  
  // Determine sort order
  let sortOptions = { createdAt: -1 }; // Default: newest first
  if (filters.sortBy === 'price_asc') sortOptions = { askingPrice: 1 };
  else if (filters.sortBy === 'price_desc') sortOptions = { askingPrice: -1 };
  else if (filters.sortBy === 'area_asc') sortOptions = { actualArea: 1 };
  else if (filters.sortBy === 'area_desc') sortOptions = { actualArea: -1 };
  else if (filters.sortBy === 'views') sortOptions = { views: -1 };
  else if (filters.sortBy === 'inquiries') sortOptions = { inquiries: -1 };
  
  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;
  
  // Execute query with pagination
  const total = await this.countDocuments(query);
  const properties = await this.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .lean();
  
  return {
    success: true,
    data: properties,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

// STATUS UPDATE METHOD - Called by event system
InventoryPropertySchema.statics.updateStatus = async function(propertyId, statusUpdate, reason = 'manual_update') {
  const property = await this.findById(propertyId);
  if (!property) throw new Error('Property not found');
  
  const originalStatus = {
    constructionStage: property.constructionStage,
    occupancyStatus: property.occupancyStatus,
    marketAvailability: property.marketAvailability,
    furnishingLevel: property.furnishingLevel,
    legalStatus: property.legalStatus
  };
  
  // Apply new status values
  if (statusUpdate.constructionStage) property.constructionStage = statusUpdate.constructionStage;
  if (statusUpdate.occupancyStatus) property.occupancyStatus = statusUpdate.occupancyStatus;
  if (statusUpdate.marketAvailability) property.marketAvailability = statusUpdate.marketAvailability;
  if (statusUpdate.furnishingLevel) property.furnishingLevel = statusUpdate.furnishingLevel;
  if (statusUpdate.legalStatus) property.legalStatus = statusUpdate.legalStatus;
  
  // Update tenant info if provided
  if (statusUpdate.currentTenant) property.currentTenant = statusUpdate.currentTenant;
  if (statusUpdate.leaseStartDate) property.leaseStartDate = statusUpdate.leaseStartDate;
  if (statusUpdate.leaseEndDate) property.leaseEndDate = statusUpdate.leaseEndDate;
  if (statusUpdate.leaseRentAmount) property.leaseRentAmount = statusUpdate.leaseRentAmount;
  
  property.updatedBy = statusUpdate.updatedBy || 'system';
  await property.save();
  
  // Return status change event for event queue
  return {
    propertyId: property._id,
    pNumber: property.pNumber,
    originalStatus,
    newStatus: {
      constructionStage: property.constructionStage,
      occupancyStatus: property.occupancyStatus,
      marketAvailability: property.marketAvailability,
      furnishingLevel: property.furnishingLevel,
      legalStatus: property.legalStatus
    },
    reason,
    timestamp: new Date()
  };
};

// BATCH QUERY METHOD - Used by Mary for analytics
InventoryPropertySchema.statics.getStatusBreakdown = async function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $facet: {
        byConstruction: [
          { $group: { _id: '$constructionStage', count: { $sum: 1 } } }
        ],
        byOccupancy: [
          { $group: { _id: '$occupancyStatus', count: { $sum: 1 } } }
        ],
        byMarketAvailability: [
          { $group: { _id: '$marketAvailability', count: { $sum: 1 } } }
        ],
        byFurnishing: [
          { $group: { _id: '$furnishingLevel', count: { $sum: 1 } } }
        ],
        byLegalStatus: [
          { $group: { _id: '$legalStatus', count: { $sum: 1 } } }
        ],
        totalCount: [
          { $count: 'total' }
        ]
      }
    }
  ]);
};

const InventoryProperty = mongoose.model('InventoryProperty', InventoryPropertySchema);
export default InventoryProperty;
