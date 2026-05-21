import mongoose from 'mongoose';

const InventoryPropertySchema = new mongoose.Schema(
  {
    pNumber: { type: String, trim: true, index: true },
    area: { type: String, trim: true, index: true },
    cluster: { type: String, trim: true, index: true },
    clusterSource: { type: String, trim: true },
    clusterConfidence: { type: Number, default: 0 },
    project: { type: String, trim: true },
    plotNumber: { type: String, trim: true, index: true },
    building: { type: String, trim: true },
    unitNumber: { type: String, trim: true },
    floor: { type: Number },
    layout: { type: String, trim: true },
    viewType: { type: String, trim: true },
    rooms: { type: Number, default: null },
    actualArea: { type: Number, default: null },
    constructionStage: { type: String, trim: true },
    occupancyStatus: { type: String, trim: true },
    marketAvailability: { type: String, trim: true },
    furnishingLevel: { type: String, trim: true },
    legalStatus: { type: String, trim: true },
    status: { type: String, trim: true, index: true },
    askingPrice: { type: Number, default: 0 },
    currency: { type: String, default: 'AED' },
    registration: { type: String, trim: true },
    municipalityNo: { type: String, trim: true },
    dewaPremiseNumber: { type: String, trim: true },
    otpDubaiRest: { type: String, trim: true },
    source: { type: String, trim: true, default: 'excel_import' },
    importSessionId: { type: String, index: true },
    owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }],
    primaryOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
    tags: [{ type: String }],
    notes: { type: String },
    versionMetadata: {
      previousId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryProperty' },
      versionNumber: { type: Number, default: 1 },
      createdAt: { type: Date },
    },
    isActive: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    updatedBy: { type: String, trim: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);

InventoryPropertySchema.index({ pNumber: 1, area: 1, plotNumber: 1 }, { unique: false });
InventoryPropertySchema.index({ primaryOwner: 1 });
InventoryPropertySchema.index({ owners: 1 });
InventoryPropertySchema.index({ importSessionId: 1, createdAt: -1 });

export default mongoose.models.InventoryProperty ||
  mongoose.model('InventoryProperty', InventoryPropertySchema);
