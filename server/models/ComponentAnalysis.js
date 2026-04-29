/**
 * Component Analysis Model
 * Stores component-level analysis results for tracking completion
 */

import mongoose from 'mongoose';

const ComponentAnalysisSchema = new mongoose.Schema({
  analysisRunId: {
    type: String,
    required: true,
    index: true
  },
  
  componentPath: {
    type: String,
    required: true
  },
  componentName: {
    type: String,
    required: true
  },
  componentType: {
    type: String,
    enum: ['component', 'page', 'route', 'model', 'service', 'redux-slice', 'hook', 'utility', 'middleware', 'config', 'stylesheet', 'test', 'other'],
    default: 'component'
  },
  
  metrics: {
    lines: Number,
    size: Number,
    exports: Number,
    imports: Number
  },
  
  eventHandlers: {
    total: Number,
    implemented: Number,
    placeholders: Number,
    byType: mongoose.Schema.Types.Mixed
  },
  
  apiCalls: {
    total: Number,
    endpoints: [String]
  },
  
  reduxUsage: {
    usesSelector: Boolean,
    usesDispatch: Boolean,
    actions: [String]
  },
  
  stateVariables: [String],
  
  completion: {
    score: { type: Number, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['complete', 'partial', 'under-construction', 'empty'],
      default: 'partial'
    },
    hasPlaceholders: Boolean,
    hasMockData: Boolean,
    todoCount: Number
  },
  
  dependencies: {
    internal: [String],
    external: [String]
  },
  
  department: String,
  pillar: String,
  assignedAssistant: String,
  
  recommendations: [{
    priority: { type: String, enum: ['critical', 'high', 'medium', 'low'] },
    type: { type: String, enum: ['feature', 'action', 'api', 'refactor', 'security'] },
    description: String
  }],
  
  immediateActions: [{
    type: String,
    description: String,
    component: String
  }]
}, {
  timestamps: true
});

ComponentAnalysisSchema.index({ analysisRunId: 1, componentPath: 1 });
ComponentAnalysisSchema.index({ componentType: 1 });
ComponentAnalysisSchema.index({ 'completion.score': 1 });
ComponentAnalysisSchema.index({ 'completion.status': 1 });

ComponentAnalysisSchema.statics.getCompletionSummary = async function(analysisRunId) {
  const results = await this.aggregate([
    { $match: { analysisRunId } },
    {
      $group: {
        _id: '$completion.status',
        count: { $sum: 1 },
        avgScore: { $avg: '$completion.score' }
      }
    }
  ]);
  
  return results.reduce((acc, r) => {
    acc[r._id] = { count: r.count, avgScore: Math.round(r.avgScore) };
    return acc;
  }, {});
};

ComponentAnalysisSchema.statics.getByType = function(analysisRunId, type) {
  return this.find({ analysisRunId, componentType: type })
    .sort({ 'completion.score': 1 });
};

ComponentAnalysisSchema.statics.getIncomplete = function(analysisRunId) {
  return this.find({ 
    analysisRunId, 
    'completion.status': { $in: ['under-construction', 'empty', 'partial'] }
  }).sort({ 'completion.score': 1 });
};

export default mongoose.model('ComponentAnalysis', ComponentAnalysisSchema);
