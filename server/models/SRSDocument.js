/**
 * SRS Document Model
 * Stores generated Software Requirements Specification documents with version history
 */

import mongoose from 'mongoose';

const SRSDocumentSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `SRS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }
  },
  
  version: {
    major: { type: Number, default: 1 },
    minor: { type: Number, default: 0 },
    patch: { type: Number, default: 0 }
  },
  versionString: {
    type: String,
    default: '1.0.0'
  },
  
  title: {
    type: String,
    default: 'White Caves Real Estate Platform - Software Requirements Specification'
  },
  description: String,
  
  generationConfig: {
    detailLevel: {
      type: String,
      enum: ['executive', 'standard', 'detailed', 'comprehensive'],
      default: 'standard'
    },
    format: {
      type: String,
      enum: ['markdown', 'html', 'pdf'],
      default: 'markdown'
    },
    includeDiagrams: { type: Boolean, default: true },
    includeCompliance: { type: Boolean, default: true },
    includeArabic: { type: Boolean, default: false }
  },
  
  content: {
    type: String,
    required: true
  },
  
  sections: [{
    id: String,
    title: String,
    level: Number,
    startIndex: Number,
    endIndex: Number
  }],
  
  analysisSnapshot: {
    timestamp: Date,
    totalFiles: Number,
    totalLines: Number,
    components: Number,
    routes: Number,
    models: Number,
    services: Number,
    completionScore: Number
  },
  
  generatedBy: {
    provider: String,
    model: String,
    tokensUsed: Number,
    generationTime: Number
  },
  
  status: {
    type: String,
    enum: ['draft', 'review', 'approved', 'archived'],
    default: 'draft'
  },
  
  createdBy: {
    type: String,
    default: 'Aurora'
  },
  approvedBy: String,
  approvedAt: Date,
  
  tags: [String],
  
  annotations: [{
    sectionId: String,
    text: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  changeLog: [{
    version: String,
    date: { type: Date, default: Date.now },
    changes: String,
    author: String
  }]
}, {
  timestamps: true
});

SRSDocumentSchema.index({ documentId: 1 });
SRSDocumentSchema.index({ versionString: 1 });
SRSDocumentSchema.index({ status: 1 });
SRSDocumentSchema.index({ createdAt: -1 });

SRSDocumentSchema.virtual('fullVersion').get(function() {
  return `${this.version.major}.${this.version.minor}.${this.version.patch}`;
});

SRSDocumentSchema.pre('save', function(next) {
  this.versionString = `${this.version.major}.${this.version.minor}.${this.version.patch}`;
  next();
});

SRSDocumentSchema.statics.getLatest = function() {
  return this.findOne({ status: { $ne: 'archived' } }).sort({ createdAt: -1 });
};

SRSDocumentSchema.statics.getVersionHistory = function() {
  return this.find({}, 'documentId versionString title status createdAt analysisSnapshot')
    .sort({ createdAt: -1 })
    .limit(50);
};

SRSDocumentSchema.methods.incrementVersion = function(type = 'patch') {
  switch(type) {
    case 'major':
      this.version.major++;
      this.version.minor = 0;
      this.version.patch = 0;
      break;
    case 'minor':
      this.version.minor++;
      this.version.patch = 0;
      break;
    case 'patch':
    default:
      this.version.patch++;
  }
  this.versionString = `${this.version.major}.${this.version.minor}.${this.version.patch}`;
  return this;
};

export default mongoose.model('SRSDocument', SRSDocumentSchema);
