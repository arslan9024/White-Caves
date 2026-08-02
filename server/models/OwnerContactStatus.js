/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const ContactHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['call', 'email', 'whatsapp', 'sms', 'meeting', 'note'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  outcome: String,
  notes: String,
  nextFollowUp: Date,
  createdBy: String,
});

const OwnerContactStatusSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
      unique: true,
    },
    contactStatus: {
      type: String,
      enum: ['never-contacted', 'contacted', 'follow-up-due', 'follow-up-complete', 'interested', 'not-interested'],
      default: 'never-contacted',
    },
    lastContactDate: Date,
    nextFollowUpDate: Date,
    followUpCount: {
      type: Number,
      default: 0,
    },
    contactHistory: [ContactHistorySchema],
    primaryPhone: String,
    primaryEmail: String,
    alternatePhones: [String],
    alternateEmails: [String],
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'email', 'whatsapp'],
      default: 'phone',
    },
    bestTimeToContact: String,
    doNotContact: {
      type: Boolean,
      default: false,
    },
    dnd_reason: String,
    source: {
      type: String,
      enum: ['google_sheets', 'google_contacts', 'manual', 'import'],
      default: 'manual',
    },
    sourceFileId: String,
    importedDate: Date,
    notes: String,
    tags: [String],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

OwnerContactStatusSchema.index({ ownerId: 1 });
OwnerContactStatusSchema.index({ contactStatus: 1 });
OwnerContactStatusSchema.index({ lastContactDate: -1 });
OwnerContactStatusSchema.index({ nextFollowUpDate: 1 });
OwnerContactStatusSchema.index({ primaryPhone: 1 });
OwnerContactStatusSchema.index({ primaryEmail: 1 });

OwnerContactStatusSchema.statics.findByContactStatus = function (status) {
  return this.find({ contactStatus: status }).populate('ownerId');
};

OwnerContactStatusSchema.statics.findOverdueFollowUps = function () {
  const now = new Date();
  return this.find({
    nextFollowUpDate: { $lt: now },
    contactStatus: { $in: ['follow-up-due', 'contacted'] },
  }).populate('ownerId');
};

OwnerContactStatusSchema.statics.findNeverContacted = function () {
  return this.find({ contactStatus: 'never-contacted' }).populate('ownerId');
};

OwnerContactStatusSchema.methods.recordContact = function (type, outcome = '', notes = '', nextFollowUp = null) {
  this.contactHistory.push({
    type,
    date: new Date(),
    outcome,
    notes,
    nextFollowUp,
  });
  this.lastContactDate = new Date();
  this.followUpCount += 1;
  if (type === 'call' || type === 'meeting') {
    this.contactStatus = 'contacted';
  }
  if (nextFollowUp) {
    this.nextFollowUpDate = nextFollowUp;
    if (outcome !== 'not-interested' && outcome !== 'declined') {
      this.contactStatus = 'follow-up-due';
    }
  }
  return this.save();
};

OwnerContactStatusSchema.methods.markAsInterested = function () {
  this.contactStatus = 'interested';
  return this.save();
};

OwnerContactStatusSchema.methods.markAsNotInterested = function (reason = '') {
  this.contactStatus = 'not-interested';
  this.dnd_reason = reason;
  this.doNotContact = true;
  return this.save();
};

OwnerContactStatusSchema.methods.markFollowUpComplete = function () {
  this.contactStatus = 'follow-up-complete';
  return this.save();
};

export default mongoose.model('OwnerContactStatus', OwnerContactStatusSchema);