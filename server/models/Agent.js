import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    avatar: String,
    bio: String,
    specialization: String, // e.g., "Luxury Villas", "Off-plan Properties"
    
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviews: {
      type: Number,
      default: 0
    },
    
    responseTime: {
      type: Number, // in minutes
      default: 120
    },
    
    availability: {
      monday: { start: '09:00', end: '18:00', available: true },
      tuesday: { start: '09:00', end: '18:00', available: true },
      wednesday: { start: '09:00', end: '18:00', available: true },
      thursday: { start: '09:00', end: '18:00', available: true },
      friday: { start: '09:00', end: '18:00', available: true },
      saturday: { start: '10:00', end: '16:00', available: true },
      sunday: { start: '10:00', end: '16:00', available: true }
    },
    
    properties: {
      type: Number,
      default: 0
    },
    
    stats: {
      totalLeads: { type: Number, default: 0 },
      convertedLeads: { type: Number, default: 0 },
      conversionRate: { type: Number, default: 0 },
      viewingsScheduled: { type: Number, default: 0 },
      viewingsCompleted: { type: Number, default: 0 },
      contractsSigned: { type: Number, default: 0 }
    },
    
    status: {
      type: String,
      enum: ['active', 'inactive', 'on-leave'],
      default: 'active'
    },
    
    onLeaveUntil: Date,
    
    commission: {
      percentage: Number,
      currency: { type: String, default: 'AED' }
    }
  },
  { timestamps: true }
);

// Indexes
agentSchema.index({ email: 1 });
agentSchema.index({ status: 1 });
agentSchema.index({ rating: -1 });

export default mongoose.model('Agent', agentSchema);
