import mongoose, { Schema, Model, Document } from 'mongoose';

interface IImportError {
  row?: number;
  field?: string;
  message?: string;
  data?: Record<string, unknown>;
}

interface IDuplicate {
  row?: number;
  existingId?: string;
  field?: string;
  existingValue?: string;
  newValue?: string;
  resolution?: 'skip' | 'replace' | 'merge' | 'pending';
}

interface IImportSession extends Document {
  fileName: string;
  filePath?: string;
  fileHash?: string;
  sheetName?: string;
  totalRows?: number;
  processedRows?: number;
  propertiesCreated?: number;
  propertiesUpdated?: number;
  ownersCreated?: number;
  ownersUpdated?: number;
  duplicatesFound?: number;
  errorsCount?: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  importErrors?: IImportError[];
  duplicates?: IDuplicate[];
  columnMapping?: Record<string, unknown>;
  importedBy?: string;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ImportSessionSchema = new Schema<IImportSession>(
  {
    fileName: {
      type: String,
      required: true,
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
      default: 'pending',
    },
    importErrors: [
      {
        row: Number,
        field: String,
        message: String,
        data: Schema.Types.Mixed,
      },
    ],
    duplicates: [
      {
        row: Number,
        existingId: String,
        field: String,
        existingValue: String,
        newValue: String,
        resolution: {
          type: String,
          enum: ['skip', 'replace', 'merge', 'pending'],
          default: 'pending',
        },
      },
    ],
    columnMapping: Schema.Types.Mixed,
    importedBy: String,
    startedAt: Date,
    completedAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
ImportSessionSchema.index({ status: 1 });
ImportSessionSchema.index({ createdAt: -1 });

const ImportSession: Model<IImportSession> = mongoose.model<IImportSession>(
  'ImportSession',
  ImportSessionSchema
);

export default ImportSession;
export type { IImportSession, IImportError, IDuplicate };
