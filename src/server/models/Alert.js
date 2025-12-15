import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['price_drop', 'new_listing', 'saved_search_match', 'property_update'],
    required: true 
  },
  property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property'
  },
  savedSearch: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SavedSearch'
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: mongoose.Schema.Types.Mixed,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

alertSchema.index({ user: 1, read: 1 });
alertSchema.index({ createdAt: -1 });

export default mongoose.model('Alert', alertSchema);
