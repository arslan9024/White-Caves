import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#6B7280'
  },
  icon: {
    type: String,
    default: 'Building2'
  },
  head: {
    name: String,
    email: String,
    title: String
  },
  assistants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIAssistant'
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  kpis: [{
    name: String,
    target: Number,
    current: Number,
    unit: String
  }],
  budget: {
    allocated: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    currency: { type: String, default: 'AED' }
  },
  status: {
    type: String,
    enum: ['active', 'restructuring', 'inactive'],
    default: 'active'
  },
  order: {
    type: Number,
    default: 0
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

DepartmentSchema.index({ name: 'text', description: 'text' });
DepartmentSchema.index({ status: 1 });

export default mongoose.model('Department', DepartmentSchema);
