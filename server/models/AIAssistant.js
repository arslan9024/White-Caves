import mongoose from 'mongoose';

const AIAssistantSchema = new mongoose.Schema({
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
  role: {
    type: String,
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: '#6B7280'
  },
  description: {
    type: String,
    required: true
  },
  capabilities: [{
    type: String
  }],
  features: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    route: String,
    component: String
  }],
  accessLevel: {
    type: String,
    enum: ['standard', 'elevated', 'executive', 'system'],
    default: 'standard'
  },
  permissions: [{
    resource: String,
    actions: [String]
  }],
  dataFlow: {
    inputs: [String],
    outputs: [String],
    integrations: [String]
  },
  reportsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIAssistant',
    default: null
  },
  subordinates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIAssistant'
  }],
  status: {
    type: String,
    enum: ['online', 'busy', 'idle', 'offline', 'maintenance'],
    default: 'online'
  },
  health: {
    score: { type: Number, min: 0, max: 100, default: 100 },
    lastCheck: Date,
    issues: [String]
  },
  metrics: {
    tasksCompleted: { type: Number, default: 0 },
    avgResponseTime: { type: Number, default: 0 },
    successRate: { type: Number, default: 100 },
    activeConnections: { type: Number, default: 0 }
  },
  settings: {
    autoAssign: { type: Boolean, default: true },
    notificationsEnabled: { type: Boolean, default: true },
    priority: { type: Number, default: 5 }
  },
  isActive: {
    type: Boolean,
    default: true
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

AIAssistantSchema.index({ name: 'text', role: 'text', description: 'text' });
AIAssistantSchema.index({ department: 1 });
AIAssistantSchema.index({ status: 1 });

export default mongoose.model('AIAssistant', AIAssistantSchema);
