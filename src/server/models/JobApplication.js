
import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicantName: String,
  applicantEmail: String,
  role: String,
  experience: String,
  licenses: String,
  languages: String,
  workLocation: String,
  status: { 
    type: String, 
    enum: ['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  },
  resume: String,
  coverLetter: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('JobApplication', jobApplicationSchema);
