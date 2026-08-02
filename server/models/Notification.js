/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  // Recipient user
  userId: {
    type: String,
    required: true,
    index: true
  },

  // Notification type
  type: {
    type: String,
    enum: [
      'property_update',
      'lead_assigned',
      'deal_update',
      'contract_signed',
      'payment_received',
      'maintenance_request',
      'task_assigned',
      'message_received',
      'system_alert',
      'viewing_scheduled',
      'offer_received',
      'bulk_operation',
      'import_complete',
      'reminder'
    ],
    required: true,
    index: true
  },

  // Notification title
  title: {
    type: String,
    required: true,
    trim: true
  },

  // Notification message
  message: {
    type: String,
    required: true
  },

  // Read status
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },

  // Read timestamp
  readAt: {
    type: Date,
    default: null
  },

  // Priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },

  // Optional link/action
  actionUrl: {
    type: String,
    default: null
  },

  // Reference to related entity
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['property', 'lead', 'deal', 'contract', 'payment', 'maintenance', 'task', 'user', 'import'],
      default: null
    },
    entityId: {
      type: String,
      default: null
    }
  },

  // Sender info
  sender: {
    id: { type: String, default: 'system' },
    name: { type: String, default: 'System' }
  },

  // Expiry (null = never expires)
  expiresAt: {
    type: Date,
    default: null
  },

  // Metadata for additional context
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound index for efficient user notification queries
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1, createdAt: -1 });

// Auto-expire documents
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $ne: null } } });

// Instance methods
NotificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static methods
NotificationSchema.statics.markAllReadForUser = function (userId) {
  return this.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

NotificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ userId, isRead: false });
};

NotificationSchema.statics.createForUser = function (userId, data) {
  return this.create({ userId, ...data });
};

NotificationSchema.statics.createForUsers = function (userIds, data) {
  const docs = userIds.map(userId => ({ userId, ...data }));
  return this.insertMany(docs);
};

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
