const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['BUYER', 'SELLER', 'TENANT'], required: true },
  serviceType: {
    type: String,
    enum: [
      'PROPERTY_VALUATION', 
      'PROPERTY_LISTING', 
      'PROPERTY_VIEWING', 
      'NEGOTIATION', 
      'DOCUMENTATION', 
      'CONSULTATION',
      'TENANCY_CONTRACT',
      'EJARI_REGISTRATION',
      'DEWA_REGISTRATION',
      'MOVE_IN_PERMIT',
      'KEY_HANDOVER'
    ],
    required: true
  },
  dependencies: [{
    type: String,
    enum: [
      'EJARI_REGISTRATION',
      'DEWA_REGISTRATION',
      'MOVE_IN_PERMIT'
    ]
  }],
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;