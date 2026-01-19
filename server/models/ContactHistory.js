import mongoose from 'mongoose';

const contactHistorySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
      index: true,
    },
    contactType: {
      type: String,
      enum: ['call', 'email', 'whatsapp', 'meeting', 'sms', 'in-person'],
      required: true,
    },
    outcome: {
      type: String,
      enum: ['interested', 'not-interested', 'no-answer', 'callback-needed', 'scheduled-viewing'],
      default: 'no-answer',
    },
    notes: {
      type: String,
      default: '',
    },
    nextFollowUpDate: {
      type: Date,
      default: null,
    },
    contactDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    duration: {
      type: Number, // in minutes
      default: null,
    },
    properties: [{
      propertyId: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryProperty',
      interested: Boolean,
    }],
  },
  {
    timestamps: true,
    collection: 'contact_history',
  }
);

// Indexes for querying
contactHistorySchema.index({ ownerId: 1, contactDate: -1 });
contactHistorySchema.index({ contactDate: -1 });
contactHistorySchema.index({ nextFollowUpDate: 1 });

// Methods
contactHistorySchema.statics.getContactHistory = async function(ownerId, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return this.find({
    ownerId,
    contactDate: { $gte: since },
  }).sort({ contactDate: -1 });
};

contactHistorySchema.statics.getPendingFollowUps = async function(limit = 100) {
  return this.find({
    nextFollowUpDate: {
      $lte: new Date(),
      $ne: null,
    },
  })
    .populate('ownerId', 'name email contacts')
    .sort({ nextFollowUpDate: 1 })
    .limit(limit);
};

const ContactHistory = mongoose.model('ContactHistory', contactHistorySchema);

export default ContactHistory;
