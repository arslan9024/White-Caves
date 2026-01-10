import mongoose from 'mongoose';

const ZoeConversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  assistant: {
    type: String,
    enum: ['zoe'],
    default: 'zoe'
  },
  query: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  intent: {
    type: String,
    enum: ['department_query', 'service_query', 'process_query', 'contact_query', 'briefing', 'metrics', 'general', 'unknown'],
    default: 'general'
  },
  entities: {
    departments: [String],
    services: [String],
    persons: [String],
    keywords: [String]
  },
  metadata: {
    responseTime: Number,
    confidence: Number,
    sourcesUsed: [String],
    matchedItems: Number
  },
  feedback: {
    helpful: { type: Boolean, default: null },
    rating: { type: Number, min: 1, max: 5 }
  }
}, {
  timestamps: true
});

ZoeConversationSchema.index({ userId: 1, createdAt: -1 });
ZoeConversationSchema.index({ sessionId: 1, createdAt: 1 });
ZoeConversationSchema.index({ intent: 1 });

ZoeConversationSchema.statics.getSessionHistory = async function(sessionId, limit = 10) {
  return this.find({ sessionId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

ZoeConversationSchema.statics.getUserHistory = async function(userId, limit = 50) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const ZoeConversation = mongoose.model('ZoeConversation', ZoeConversationSchema);
export default ZoeConversation;
