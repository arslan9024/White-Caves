import mongoose from 'mongoose';

const viewingSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // in minutes
      default: 30
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled'
    },
    notes: String,
    feedback: {
      rating: Number, // 1-5
      tenantImpressions: String,
      agentNotes: String,
      followUpRequired: Boolean,
      followUpDate: Date
    },
    reminderSent: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      sentAt: Date
    },
    attendees: [{
      type: {
        type: String,
        enum: ['tenant', 'landlord', 'agent', 'witness']
      },
      name: String,
      confirmed: { type: Boolean, default: false }
    }],
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    }
  },
  { timestamps: true }
);

// Index for efficient querying
viewingSchema.index({ agentId: 1, scheduledDate: 1 });
viewingSchema.index({ leadId: 1 });
viewingSchema.index({ propertyId: 1 });
viewingSchema.index({ status: 1 });
viewingSchema.index({ scheduledDate: 1 });

export default mongoose.model('Viewing', viewingSchema);
