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
  status: {
    type: String,
    enum: ['available', 'rented', 'sold', 'reserved', 'off_market', 'under_renovation'],
    default: 'available',
    index: true
  },
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
    enum: ['excel_import', 'manual', 'api', 'migration'],
    default: 'manual'
  },
  sourceFileId: String,
  importBatch: String,
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

const InventoryProperty = mongoose.model('InventoryProperty', InventoryPropertySchema);
export default InventoryProperty;
