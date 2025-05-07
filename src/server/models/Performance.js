
const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  achievements: [String],
  rewards: [{
    title: String,
    description: String,
    dateAwarded: Date,
    points: Number
  }],
  metrics: {
    salesClosed: Number,
    clientSatisfaction: Number,
    responseTime: Number
  },
  period: {
    start: Date,
    end: Date
  },
  comments: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Performance', performanceSchema);
