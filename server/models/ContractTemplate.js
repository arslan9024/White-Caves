/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const contractTemplateSchema = new mongoose.Schema(
  {
    // Template Info
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    category: {
      type: String,
      enum: ['rental', 'sale', 'lease', 'maintenance', 'other'],
      default: 'rental',
    },
    version: {
      type: Number,
      default: 1,
    },

    // Template Content
    content: {
      type: String,
      required: true, // HTML template with placeholders {{{field_name}}}
    },
    sections: [
      {
        title: String,
        contentKey: String,
        required: Boolean,
      },
    ],

    // Dynamic Fields
    dynamicFields: [
      {
        fieldName: String, // e.g., "tenant_name", "monthly_rent"
        label: String, // Display name
        type: {
          type: String,
          enum: ['text', 'number', 'date', 'email', 'phone', 'address', 'select'],
        },
        required: Boolean,
        options: [String], // For select type
        placeholder: String,
      },
    ],

    // Signature Fields
    signatureFields: [
      {
        name: String, // "tenant_signature", "landlord_signature", "agent_signature"
        label: String,
        required: Boolean,
        position: {
          page: Number,
          x: Number,
          y: Number,
        },
      },
    ],

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },

    // Audit
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Methods
contractTemplateSchema.methods.validateFields = function (data) {
  const errors = [];

  this.dynamicFields.forEach((field) => {
    if (field.required && !data[field.fieldName]) {
      errors.push(`${field.label} is required`);
    }

    if (data[field.fieldName]) {
      switch (field.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field.fieldName])) {
            errors.push(`${field.label} must be a valid email`);
          }
          break;
        case 'phone':
          if (!/^\+?[\d\s\-()]+$/.test(data[field.fieldName])) {
            errors.push(`${field.label} must be a valid phone number`);
          }
          break;
        case 'date':
          if (isNaN(Date.parse(data[field.fieldName]))) {
            errors.push(`${field.label} must be a valid date`);
          }
          break;
        case 'number':
          if (isNaN(data[field.fieldName])) {
            errors.push(`${field.label} must be a valid number`);
          }
          break;
      }
    }
  });

  return errors;
};

contractTemplateSchema.methods.generateContent = function (data) {
  let content = this.content;

  // Replace all placeholders with actual data
  this.dynamicFields.forEach((field) => {
    const placeholder = new RegExp(`{{{${field.fieldName}}}}`, 'g');
    const value = data[field.fieldName] || '';
    content = content.replace(placeholder, value);
  });

  return content;
};

const ContractTemplate = mongoose.model('ContractTemplate', contractTemplateSchema);

export default ContractTemplate;
