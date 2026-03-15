import mongoose, { Schema, Model, Document } from 'mongoose';

interface IAgent {
  id?: string;
  name?: string;
}

interface IDocument {
  type?: string;
  url?: string;
  name?: string;
  uploadedAt?: Date;
}

interface IInventoryProperty extends Document {
  pNumber?: string;
  area: string;
  project: string;
  masterProject?: string;
  cluster?: string;
  plotNumber?: string;
  building?: string;
  unitNumber?: string;
  floor?: number;
  layout?: string;
  viewType?: string;
  propertyType?: 'villa' | 'townhouse' | 'apartment' | 'plot' | 'penthouse' | 'duplex' | 'studio' | 'other';
  rooms?: number;
  actualArea?: number;
  areaUnit?: string;
  status?: 'available' | 'rented' | 'sold' | 'reserved' | 'off_market' | 'under_renovation';
  purpose?: 'sale' | 'rent' | 'both';
  askingPrice?: number;
  currency?: string;
  registration?: string;
  municipalityNo?: string;
  dewaPremiseNumber?: string;
  otpDubaiRest?: string;
  sdNumber?: string;
  owners?: mongoose.Schema.Types.ObjectId[];
  primaryOwner?: mongoose.Schema.Types.ObjectId;
  agent?: IAgent;
  images?: string[];
  documents?: IDocument[];
  notes?: string;
  tags?: string[];
  featured?: boolean;
  views?: number;
  inquiries?: number;
  lastMaintenanceDate?: Date;
  source?: 'excel_import' | 'manual' | 'api' | 'migration';
  sourceFileId?: string;
  importBatch?: string;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IInventoryPropertyModel extends Model<IInventoryProperty> {
  findByPNumber(pNumber: string | number): Promise<IInventoryProperty | null>;
  getAreaStats(): Promise<
    Array<{
      _id: string;
      total: number;
      available: number;
      rented: number;
      sold: number;
    }>
  >;
  getDistinctAreas(): Promise<string[]>;
}

const InventoryPropertySchema = new Schema<IInventoryProperty>(
  {
    pNumber: {
      type: String,
      index: true,
    },
    area: {
      type: String,
      required: true,
      index: true,
    },
    project: {
      type: String,
      required: true,
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
      default: 'villa',
    },
    rooms: Number,
    actualArea: Number,
    areaUnit: {
      type: String,
      default: 'sqft',
    },
    status: {
      type: String,
      enum: ['available', 'rented', 'sold', 'reserved', 'off_market', 'under_renovation'],
      default: 'available',
      index: true,
    },
    purpose: {
      type: String,
      enum: ['sale', 'rent', 'both'],
      default: 'rent',
    },
    askingPrice: Number,
    currency: {
      type: String,
      default: 'AED',
    },
    registration: String,
    municipalityNo: String,
    dewaPremiseNumber: String,
    otpDubaiRest: String,
    sdNumber: String,
    owners: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Owner',
      },
    ],
    primaryOwner: {
      type: Schema.Types.ObjectId,
      ref: 'Owner',
    },
    agent: {
      id: String,
      name: String,
    },
    images: [String],
    documents: [
      {
        type: String,
        url: String,
        name: String,
        uploadedAt: Date,
      },
    ],
    notes: String,
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
    lastMaintenanceDate: Date,
    source: {
      type: String,
      enum: ['excel_import', 'manual', 'api', 'migration'],
      default: 'manual',
    },
    sourceFileId: String,
    importBatch: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: String,
    updatedBy: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
InventoryPropertySchema.index(
  { pNumber: 1, area: 1 },
  { unique: true, sparse: true }
);
InventoryPropertySchema.index({ area: 1, status: 1 });
InventoryPropertySchema.index({ project: 1 });
InventoryPropertySchema.index({ owners: 1 });
InventoryPropertySchema.index({ municipalityNo: 1 }, { sparse: true });

// Static methods
InventoryPropertySchema.statics.findByPNumber = function (
  this: IInventoryPropertyModel,
  pNumber: string | number
): Promise<IInventoryProperty | null> {
  return this.findOne({ pNumber: String(pNumber) });
};

InventoryPropertySchema.statics.getAreaStats = async function (
  this: IInventoryPropertyModel
): Promise<
  Array<{
    _id: string;
    total: number;
    available: number;
    rented: number;
    sold: number;
  }>
> {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$area',
        total: { $sum: 1 },
        available: {
          $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] },
        },
        rented: { $sum: { $cond: [{ $eq: ['$status', 'rented'] }, 1, 0] } },
        sold: { $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] } },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

InventoryPropertySchema.statics.getDistinctAreas = async function (
  this: IInventoryPropertyModel
): Promise<string[]> {
  return this.distinct('area', { isActive: true });
};

const InventoryProperty: IInventoryPropertyModel = mongoose.model<
  IInventoryProperty,
  IInventoryPropertyModel
>('InventoryProperty', InventoryPropertySchema);

export default InventoryProperty;
export type { IInventoryProperty, IAgent, IDocument };
