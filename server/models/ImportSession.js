import mongoose from 'mongoose';

const ImportSessionSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  filePath: String,
  fileHash: String,
  sheetName: String,
  totalRows: Number,
  processedRows: Number,
  propertiesCreated: Number,
  propertiesUpdated: Number,
  ownersCreated: Number,
  ownersUpdated: Number,
  duplicatesFound: Number,
  errorsCount: Number,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  importErrors: [{
    row: Number,
    field: String,
    message: String,
    data: mongoose.Schema.Types.Mixed
  }],
  duplicates: [{
    row: Number,
    existingId: String,
    field: String,
    existingValue: String,
    newValue: String,
    resolution: {
      type: String,
      enum: ['skip', 'replace', 'merge', 'pending'],
      default: 'pending'
    }
  }],
  columnMapping: mongoose.Schema.Types.Mixed,
  importedBy: String,
  startedAt: Date,
  completedAt: Date,
  notes: String
}, {
  timestamps: true
});

ImportSessionSchema.index({ status: 1 });
ImportSessionSchema.index({ createdAt: -1 });

const ImportSession = mongoose.model('ImportSession', ImportSessionSchema);
export default ImportSession;
