import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Property Sales',
      'Property Rentals',
      'Property Management',
      'Client Services',
      'Financial Services',
      'Legal & Compliance',
      'Marketing',
      'Technology'
    ]
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String
  },
  icon: {
    type: String,
    default: 'Briefcase'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  aiAssistant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIAssistant'
  },
  workflow: {
    stages: [{
      order: Number,
      name: String,
      description: String,
      duration: String,
      actions: [String],
      automatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AIAssistant'
      }
    }],
    estimatedDuration: String,
    sla: String
  },
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'percentage', 'hourly', 'custom', 'free'],
      default: 'fixed'
    },
    amount: Number,
    currency: { type: String, default: 'AED' },
    percentage: Number,
    details: String
  },
  requirements: [{
    name: String,
    description: String,
    mandatory: Boolean
  }],
  deliverables: [{
    name: String,
    description: String,
    format: String
  }],
  targetAudience: [{
    type: String,
    enum: ['buyers', 'sellers', 'landlords', 'tenants', 'investors', 'developers', 'all']
  }],
  metrics: {
    totalRequests: { type: Number, default: 0 },
    completedRequests: { type: Number, default: 0 },
    avgCompletionTime: { type: Number, default: 0 },
    satisfactionScore: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'coming_soon', 'deprecated', 'maintenance'],
    default: 'active'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  relatedServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

ServiceSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ department: 1 });
ServiceSchema.index({ status: 1 });

export default mongoose.model('Service', ServiceSchema);
