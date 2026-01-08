import mongoose from 'mongoose';

const ContactMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mobile', 'phone', 'email', 'whatsapp'],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  label: String,
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const OwnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameNormalized: {
    type: String
  },
  nationality: String,
  emiratesId: String,
  passportNumber: String,
  dateOfBirth: Date,
  contacts: [ContactMethodSchema],
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryProperty'
  }],
  notes: String,
  tags: [String],
  source: {
    type: String,
    enum: ['excel_import', 'manual', 'api', 'migration'],
    default: 'manual'
  },
  sourceFileId: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: String,
  updatedBy: String
}, {
  timestamps: true
});

OwnerSchema.index({ nameNormalized: 1 });
OwnerSchema.index({ 'contacts.value': 1 });
OwnerSchema.index({ emiratesId: 1 }, { sparse: true });

OwnerSchema.pre('save', function(next) {
  if (this.name) {
    this.nameNormalized = this.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  next();
});

OwnerSchema.statics.findByContact = function(contactValue) {
  const normalized = contactValue.replace(/[^0-9a-zA-Z@.]/g, '').toLowerCase();
  return this.findOne({ 'contacts.value': { $regex: normalized, $options: 'i' } });
};

OwnerSchema.statics.findOrCreateByNameAndContact = async function(name, contacts, sourceFileId) {
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (const contact of contacts) {
    const existing = await this.findOne({ 
      'contacts.value': contact.value,
      nameNormalized: normalizedName
    });
    if (existing) return { owner: existing, isNew: false };
  }
  
  const existingByName = await this.findOne({ nameNormalized: normalizedName });
  if (existingByName) {
    for (const contact of contacts) {
      const hasContact = existingByName.contacts.some(c => c.value === contact.value);
      if (!hasContact) {
        existingByName.contacts.push(contact);
      }
    }
    await existingByName.save();
    return { owner: existingByName, isNew: false };
  }
  
  const newOwner = new this({
    name,
    contacts,
    source: 'excel_import',
    sourceFileId
  });
  await newOwner.save();
  return { owner: newOwner, isNew: true };
};

const Owner = mongoose.model('Owner', OwnerSchema);
export default Owner;
