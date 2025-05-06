
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['SCHEDULED', 'RESCHEDULED', 'CANCELLED'],
    default: 'SCHEDULED'
  },
  googleCalendarEventId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
