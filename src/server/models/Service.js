
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String,
    enum: ['BUYER', 'SELLER'],
    required: true 
  },
  serviceType: {
    type: String,
    enum: ['PROPERTY_VALUATION', 'PROPERTY_LISTING', 'PROPERTY_VIEWING', 'NEGOTIATION', 'DOCUMENTATION', 'CONSULTATION'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  description: String,
  startDate: { type: Date, default: Date.now },
  completionDate: Date,
  notes: [{ 
    text: String,
    date: { type: Date, default: Date.now }
  }],
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Service', serviceSchema);
