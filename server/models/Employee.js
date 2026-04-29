import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  jobTitle: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['C-Suite', 'Director', 'Senior', 'Mid', 'Junior', 'Intern'],
    default: 'Mid'
  },
  reportsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  responsibilities: [{
    type: String
  }],
  contact: {
    phone: String,
    extension: String,
    mobile: String
  },
  employment: {
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'intern'],
      default: 'full-time'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on-leave', 'terminated'],
      default: 'active'
    },
    hireDate: Date,
    terminationDate: Date,
    costCenter: String
  },
  aiAssistant: {
    type: String
  },
  salary: {
    grade: String,
    currency: {
      type: String,
      default: 'AED'
    }
  },
  photo: {
    type: String,
    default: '/avatars/default.jpg'
  },
  skills: [{
    type: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiryDate: Date
  }],
  performance: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    lastReview: Date,
    goals: [{
      title: String,
      status: String,
      dueDate: Date
    }]
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

employeeSchema.index({ 'employment.status': 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ level: 1 });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
