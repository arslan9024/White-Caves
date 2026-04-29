import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  instanceDate: {
    type: Date,
    required: true,
    index: true
  },
  group: {
    type: String,
    enum: ['Sales', 'Mortgage', 'Gift', 'Other'],
    default: 'Sales'
  },
  procedure: {
    type: String,
    required: true
  },
  isOffplan: {
    type: String,
    enum: ['Off-Plan', 'Ready'],
    default: 'Off-Plan'
  },
  isFreehold: {
    type: String,
    enum: ['Free Hold', 'Leasehold'],
    default: 'Free Hold'
  },
  usage: {
    type: String,
    enum: ['Residential', 'Commercial', 'Industrial', 'Mixed'],
    default: 'Residential'
  },
  area: {
    type: String,
    required: true,
    index: true
  },
  propType: {
    type: String,
    enum: ['Unit', 'Building', 'Land'],
    default: 'Unit'
  },
  propSubType: {
    type: String,
    enum: ['Flat', 'Villa', 'Townhouse', 'Penthouse', 'Studio', 'Office', 'Shop', 'Warehouse', 'Hotel Rooms', 'Plot', 'Other'],
    default: 'Flat'
  },
  transValue: {
    type: Number,
    required: true,
    index: true
  },
  procedureArea: {
    type: Number,
    default: 0
  },
  actualArea: {
    type: Number,
    default: 0
  },
  rooms: {
    type: String,
    default: ''
  },
  parking: {
    type: String,
    default: ''
  },
  nearestMetro: {
    type: String,
    default: ''
  },
  nearestMall: {
    type: String,
    default: ''
  },
  nearestLandmark: {
    type: String,
    default: ''
  },
  totalBuyer: {
    type: Number,
    default: 0
  },
  totalSeller: {
    type: Number,
    default: 0
  },
  masterProject: {
    type: String,
    default: ''
  },
  project: {
    type: String,
    default: '',
    index: true
  }
}, {
  timestamps: true
});

transactionSchema.index({ area: 1, transValue: 1 });
transactionSchema.index({ project: 1, instanceDate: -1 });
transactionSchema.index({ propSubType: 1, rooms: 1 });

export default mongoose.model('Transaction', transactionSchema);
