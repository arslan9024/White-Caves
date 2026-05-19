import mongoose from 'mongoose';

const ImportSessionSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    importedBy: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    columnMapping: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    totalRows: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalRowsProcessed: {
      type: Number,
      default: 0,
      min: 0,
    },
    propertiesCreated: {
      type: Number,
      default: 0,
      min: 0,
    },
    propertiesUpdated: {
      type: Number,
      default: 0,
      min: 0,
    },
    ownersCreated: {
      type: Number,
      default: 0,
      min: 0,
    },
    ownersUpdated: {
      type: Number,
      default: 0,
      min: 0,
    },
    duplicatesFound: {
      type: Number,
      default: 0,
      min: 0,
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalErrors: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    importErrors: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    duplicates: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  { timestamps: true }
);

ImportSessionSchema.index({ userId: 1, createdAt: -1 });
ImportSessionSchema.index({ status: 1, createdAt: -1 });
ImportSessionSchema.index({ fileName: 1 });

export default mongoose.model('ImportSession', ImportSessionSchema);
