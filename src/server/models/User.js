
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  photoUrl: String,
  role: {
    type: String,
    enum: ['VISITOR', 'AGENT', 'EMPLOYEE', 'BUYER', 'SELLER', 'TENANT', 'LANDLORD', 'PROPERTY_OWNER'],
    default: 'VISITOR'
  },
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
