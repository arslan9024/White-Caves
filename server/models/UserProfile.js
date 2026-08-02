/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Basic Info
    name: String,
    email: String,
    phone: String,
    avatar: String,
    bio: String,

    // Role & Type
    role: {
      type: String,
      enum: ['buyer', 'seller', 'tenant', 'landlord', 'agent', 'admin'],
      default: 'buyer',
    },

    // Profile Completeness
    profileCompletion: {
      percentage: { type: Number, default: 0 },
      completedFields: [String],
      lastUpdated: Date,
    },

    // Personal Info
    nationality: String,
    dateOfBirth: Date,
    gender: String,

    // Contact & Address
    address: {
      street: String,
      building: String,
      area: String,
      emirate: String,
      country: String,
      postalCode: String,
    },

    // For Buyers/Tenants
    preferences: {
      propertyType: [String], // Villa, Apartment, etc.
      budget: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'AED' },
      },
      locations: [String],
      bedrooms: {
        min: Number,
        max: Number,
      },
      amenities: [String],
      rentOrBuy: { type: String, enum: ['rent', 'buy', 'both'], default: 'both' },
      timeline: String, // Immediate, Within 3 months, etc.
    },

    // For Sellers/Landlords
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],

    // For Agents
    agentInfo: {
      license: String,
      licenseExpiry: Date,
      agency: String,
      specialization: [String],
      yearsExperience: Number,
      officeLocation: String,
      officePhone: String,
    },

    // KYC & Verification
    kyc: {
      status: {
        type: String,
        enum: ['pending', 'submitted', 'verified', 'rejected'],
        default: 'pending',
      },
      submittedAt: Date,
      verifiedAt: Date,
      rejectionReason: String,
      verifiedBy: mongoose.Schema.Types.ObjectId, // Admin user
    },

    documents: {
      emiratesId: {
        number: String,
        expiryDate: Date,
        document: String, // URL to uploaded file
        verified: Boolean,
      },
      passport: {
        number: String,
        country: String,
        expiryDate: Date,
        document: String,
        verified: Boolean,
      },
      drivingLicense: {
        number: String,
        expiryDate: Date,
        document: String,
        verified: Boolean,
      },
      addressProof: {
        type: String,
        document: String,
        verified: Boolean,
      },
      bankStatement: {
        document: String,
        uploadedAt: Date,
      },
    },

    // Financial Info (for sellers/landlords)
    financial: {
      bankAccountName: String,
      bankName: String,
      accountNumber: String,
      iban: String,
      currency: { type: String, default: 'AED' },
    },

    // Employment Info
    employment: {
      companyName: String,
      jobTitle: String,
      monthlyIncome: Number,
      employmentType: String, // Full-time, Self-employed, etc.
      employerContact: String,
    },

    // Favorites & Saved Items
    favorites: {
      properties: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Property',
        },
      ],
      searches: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'SavedSearch',
        },
      ],
      agents: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Agent',
        },
      ],
    },

    // Notifications
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
      newPropertyAlerts: { type: Boolean, default: true },
      priceChangeAlerts: { type: Boolean, default: true },
      frequencyPreference: {
        type: String,
        enum: ['instant', 'daily', 'weekly', 'monthly'],
        default: 'daily',
      },
    },

    // Privacy & Settings
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'agents-only'],
        default: 'agents-only',
      },
      showContactInfo: Boolean,
      allowAgentContact: { type: Boolean, default: true },
      dataCollection: { type: Boolean, default: true },
    },

    // Activity
    activityLog: [
      {
        action: String,
        timestamp: Date,
        details: String,
      },
    ],

    lastLogin: Date,
    lastProfileUpdate: Date,

    // Social Links
    social: {
      linkedIn: String,
      whatsApp: String,
      instagram: String,
    },
  },
  { timestamps: true }
);

// Indexes
userProfileSchema.index({ email: 1 });
userProfileSchema.index({ role: 1 });
userProfileSchema.index({ 'kyc.status': 1 });

// Calculate profile completion percentage
userProfileSchema.methods.calculateCompletion = function () {
  const fields = [
    'name',
    'email',
    'phone',
    'avatar',
    'address.street',
    'address.emirate',
    'preferences.propertyType',
    'preferences.budget.min',
    'documents.emiratesId.number',
    'documents.passport.number',
  ];

  let completed = 0;
  fields.forEach(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], this);
    if (value) completed++;
  });

  this.profileCompletion.percentage = Math.round((completed / fields.length) * 100);
  this.profileCompletion.completedFields = fields.filter(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], this);
    return !!value;
  });
  this.profileCompletion.lastUpdated = new Date();
};

export default mongoose.model('UserProfile', userProfileSchema);
