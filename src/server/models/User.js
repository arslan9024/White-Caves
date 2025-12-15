
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, sparse: true, unique: true },
  email: { type: String, sparse: true },
  phone: { type: String, sparse: true },
  name: { type: String, default: '' },
  photoUrl: String,
  roles: {
    type: [String],
    enum: ['VISITOR', 'AGENT', 'EMPLOYEE', 'BUYER', 'SELLER', 'TENANT', 'LANDLORD', 'PROPERTY_OWNER', 'SUPER_USER'],
    default: ['VISITOR']
  },
  role: { type: String, default: 'user' },
  isSuperUser: { type: Boolean, default: false },
  isDecisionMaker: { type: Boolean, default: false },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  verified: { type: Boolean, default: false },
  profileComplete: { type: Boolean, default: false },
  passport: {
    documentUrl: String,
    documentNumber: String,
    expiryDate: Date,
    verified: { type: Boolean, default: false }
  },
  contactInfo: {
    address: String
  },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


export default mongoose.model('User', userSchema);
