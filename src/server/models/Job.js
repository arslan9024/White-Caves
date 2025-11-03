
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  department: String,
  location: String,
  type: { type: String, enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE'] },
  workLocation: { type: String, enum: ['ONSITE', 'REMOTE', 'HYBRID'], default: 'ONSITE' },
  agentSpecialization: { 
    type: String, 
    enum: ['LEASING', 'SALES_SECONDARY', 'SALES_OFF_PLAN', 'GENERAL', 'FREELANCE_CONSULTANT'],
    default: 'GENERAL'
  },
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', jobSchema);
