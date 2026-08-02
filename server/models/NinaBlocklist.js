/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const ninaBlocklistSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  formattedNumber: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    enum: ['manual', 'spam', 'unsubscribed', 'invalid', 'complaint', 'imported'],
    default: 'manual'
  },
  source: {
    type: String,
    default: 'manual'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ninaBlocklistSchema.index({ phoneNumber: 1 });
ninaBlocklistSchema.index({ formattedNumber: 1 });

ninaBlocklistSchema.statics.isBlocked = async function(number) {
  const cleaned = number.replace(/[^\d]/g, '');
  const exists = await this.findOne({
    $or: [
      { phoneNumber: cleaned },
      { formattedNumber: cleaned },
      { phoneNumber: `971${cleaned}` },
      { formattedNumber: `971${cleaned}` }
    ]
  });
  return !!exists;
};

ninaBlocklistSchema.statics.addNumbers = async function(numbers, reason = 'manual', source = 'manual') {
  const operations = numbers.map(num => ({
    updateOne: {
      filter: { phoneNumber: num.replace(/[^\d]/g, '') },
      update: {
        $setOnInsert: {
          phoneNumber: num.replace(/[^\d]/g, ''),
          formattedNumber: num.replace(/[^\d]/g, ''),
          reason,
          source,
          createdAt: new Date()
        }
      },
      upsert: true
    }
  }));

  const result = await this.bulkWrite(operations);
  return result.upsertedCount;
};

ninaBlocklistSchema.statics.removeNumbers = async function(numbers) {
  const cleaned = numbers.map(n => n.replace(/[^\d]/g, ''));
  const result = await this.deleteMany({ phoneNumber: { $in: cleaned } });
  return result.deletedCount;
};

ninaBlocklistSchema.statics.getAllNumbers = async function() {
  const docs = await this.find({}, { phoneNumber: 1, _id: 0 });
  return docs.map(d => d.phoneNumber);
};

export default mongoose.model('NinaBlocklist', ninaBlocklistSchema);
