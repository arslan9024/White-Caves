const mongoose = require('mongoose');

const securityChequeSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  chequeNumber: { type: String, required: true },
  bank: { type: String, required: true }
});

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
  securityCheque: securityChequeSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;