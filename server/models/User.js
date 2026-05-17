import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'landlord', 'tenant', 'agent', 'admin'],
      default: 'buyer',
    },
    nationality: String,
    emiratesId: String,
    passport: {
      number: String,
      country: String,
      expiry: Date,
    },
    preferences: {
      propertyType: String,
      budget: {
        min: Number,
        max: Number,
        isRental: { type: Boolean, default: false },
      },
      locations: [String],
    },
    employer: String,
    monthlyIncome: Number,
    ownedProperties: {
      type: Number,
      default: 0,
    },
    company: String,
    brnNumber: String,
    kycStatus: {
      type: String,
      enum: ['pending', 'submitted', 'verified', 'rejected'],
      default: 'pending',
    },
    kycData: {
      emiratesIdVerified: { type: Boolean, default: false },
      passportVerified: { type: Boolean, default: false },
      addressVerified: { type: Boolean, default: false },
      riskScore: Number,
      verifiedAt: Date,
      verifiedBy: String,
    },
    uaePassLinked: {
      type: Boolean,
      default: false,
    },
    uaePassId: String,
    firebaseUid: String,
    avatar: String,
    address: {
      street: String,
      city: String,
      country: String,
      postalCode: String,
    },
    tags: [String],
    notes: String,
    assignedAgent: {
      id: String,
      name: String,
    },
    source: {
      type: String,
      enum: ['website', 'whatsapp', 'referral', 'walk-in', 'social-media', 'portal', 'other'],
      default: 'website',
    },
    lastActivity: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1 });
userSchema.index({ kycStatus: 1 });
userSchema.index({ nationality: 1 });

userSchema.statics.getByRole = function (role) {
  return this.find({ role, isActive: true });
};

userSchema.statics.getRoleStats = function () {
  return this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);
};

const User = mongoose.model('User', userSchema);
export default User;
