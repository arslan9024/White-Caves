
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  photoUrl: String,
  roles: {
    type: [String],
    enum: ['VISITOR', 'AGENT', 'EMPLOYEE', 'BUYER', 'SELLER', 'TENANT', 'LANDLORD', 'PROPERTY_OWNER', 'SUPER_USER'],
    default: ['VISITOR']
  },
  isSuperUser: { type: Boolean, default: false },
  isDecisionMaker: { type: Boolean, default: false },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  verified: { type: Boolean, default: false },
  passport: {
    documentUrl: String,
    documentNumber: String,
    expiryDate: Date,
    verified: { type: Boolean, default: false }
  },
  contactInfo: {
    phone: String,
    address: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
