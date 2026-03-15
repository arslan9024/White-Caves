import mongoose, { Schema, Model, Document, Query } from 'mongoose';

interface IContactMethod {
  type: 'mobile' | 'phone' | 'email' | 'whatsapp';
  value: string;
  isPrimary?: boolean;
  isVerified?: boolean;
  label?: string;
  addedAt?: Date;
}

interface IOwner extends Document {
  name: string;
  nameNormalized?: string;
  nationality?: string;
  emiratesId?: string;
  passportNumber?: string;
  dateOfBirth?: Date;
  contacts?: IContactMethod[];
  properties?: mongoose.Schema.Types.ObjectId[];
  notes?: string;
  tags?: string[];
  source?: 'excel_import' | 'manual' | 'api' | 'migration';
  sourceFileId?: string;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IOwnerModel extends Model<IOwner> {
  findByContact(contactValue: string): Promise<IOwner | null>;
  findOrCreateByNameAndContact(
    name: string,
    contacts: IContactMethod[],
    sourceFileId: string
  ): Promise<{ owner: IOwner; isNew: boolean }>;
}

const ContactMethodSchema = new Schema<IContactMethod>(
  {
    type: {
      type: String,
      enum: ['mobile', 'phone', 'email', 'whatsapp'],
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    label: String,
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const OwnerSchema = new Schema<IOwner>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameNormalized: {
      type: String,
    },
    nationality: String,
    emiratesId: String,
    passportNumber: String,
    dateOfBirth: Date,
    contacts: [ContactMethodSchema],
    properties: [
      {
        type: Schema.Types.ObjectId,
        ref: 'InventoryProperty',
      },
    ],
    notes: String,
    tags: [String],
    source: {
      type: String,
      enum: ['excel_import', 'manual', 'api', 'migration'],
      default: 'manual',
    },
    sourceFileId: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: String,
    updatedBy: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
OwnerSchema.index({ nameNormalized: 1 });
OwnerSchema.index({ 'contacts.value': 1 });
OwnerSchema.index({ emiratesId: 1 }, { sparse: true });

// Middleware
OwnerSchema.pre('save', function (next) {
  if (this.name) {
    this.nameNormalized = this.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  next();
});

// Static methods
OwnerSchema.statics.findByContact = async function (contactValue: string): Promise<IOwner | null> {
  const normalized = contactValue.replace(/[^0-9a-zA-Z@.]/g, '').toLowerCase();
  return this.findOne({ 'contacts.value': { $regex: normalized, $options: 'i' } });
};

OwnerSchema.statics.findOrCreateByNameAndContact = async function (
  name: string,
  contacts: IContactMethod[],
  sourceFileId: string
): Promise<{ owner: IOwner; isNew: boolean }> {
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const contact of contacts) {
    const existing = await this.findOne({
      'contacts.value': contact.value,
      nameNormalized: normalizedName,
    });
    if (existing) return { owner: existing, isNew: false };
  }

  const existingByName = await this.findOne({ nameNormalized: normalizedName });
  if (existingByName) {
    for (const contact of contacts) {
      const hasContact = existingByName.contacts!.some((c) => c.value === contact.value);
      if (!hasContact) {
        existingByName.contacts!.push(contact);
      }
    }
    await existingByName.save();
    return { owner: existingByName, isNew: false };
  }

  const newOwner = new this({
    name,
    contacts,
    source: 'excel_import',
    sourceFileId,
  });
  await newOwner.save();
  return { owner: newOwner, isNew: true };
};

const Owner: IOwnerModel = mongoose.model<IOwner, IOwnerModel>('Owner', OwnerSchema);
export default Owner;
export type { IOwner, IContactMethod };
