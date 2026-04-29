const mongoose = require('mongoose');

const RentPaymentSchema = new mongoose.Schema({
  // Reference to tenancy contract
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TenancyContract',
    required: true,
    index: true
  },

  // Property reference
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryProperty',
    index: true
  },

  // Tenant information
  tenantId: {
    type: String,
    required: true,
    index: true
  },
  tenantName: {
    type: String,
    required: true,
    trim: true
  },
  tenantEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  tenantPhone: String,

  // Landlord information
  landlordId: {
    type: String,
    index: true
  },
  landlordName: String,

  // Payment details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'AED'
  },

  // Payment period
  periodStartDate: {
    type: Date,
    required: true
  },
  periodEndDate: {
    type: Date,
    required: true
  },

  // Installment (1st cheque, 2nd cheque, etc.)
  installmentNumber: {
    type: Number,
    default: 1,
    min: 1
  },
  totalInstallments: {
    type: Number,
    default: 1
  },

  // Payment status
  status: {
    type: String,
    enum: ['pending', 'due', 'partial', 'paid', 'overdue', 'bounced', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },

  // Due date
  dueDate: {
    type: Date,
    required: true,
    index: true
  },

  // Actual payment date
  paidDate: {
    type: Date,
    default: null
  },

  // Payment method
  paymentMethod: {
    type: String,
    enum: ['cheque', 'bank_transfer', 'cash', 'online', 'card', 'other'],
    default: 'cheque'
  },

  // Cheque details (if applicable)
  chequeDetails: {
    chequeNumber: String,
    bankName: String,
    chequeDate: Date,
    accountNumber: String
  },

  // Transaction reference
  transactionReference: {
    type: String,
    trim: true
  },

  // Late fee
  lateFee: {
    type: Number,
    default: 0,
    min: 0
  },
  lateFeeAppliedDate: Date,

  // Discount / adjustment
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountReason: String,

  // Total amount actually paid (may differ due to late fees/discounts)
  amountPaid: {
    type: Number,
    default: 0,
    min: 0
  },

  // Notes
  notes: String,

  // Created by
  createdBy: {
    id: String,
    name: String,
    role: String
  },

  // Last updated by
  updatedBy: {
    id: String,
    name: String
  },

  // Receipt URL / document
  receiptUrl: String,

  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for common queries
RentPaymentSchema.index({ contractId: 1, status: 1 });
RentPaymentSchema.index({ tenantId: 1, status: 1, dueDate: 1 });
RentPaymentSchema.index({ dueDate: 1, status: 1 });

// Virtual: is overdue
RentPaymentSchema.virtual('isOverdue').get(function () {
  return this.status !== 'paid' && this.status !== 'cancelled' && this.dueDate < new Date();
});

// Static: get overdue payments
RentPaymentSchema.statics.getOverduePayments = function () {
  return this.find({
    status: { $in: ['pending', 'due'] },
    dueDate: { $lt: new Date() }
  }).sort({ dueDate: 1 });
};

// Static: get upcoming payments (due in next 30 days)
RentPaymentSchema.statics.getUpcomingPayments = function (days = 30) {
  const future = new Date();
  future.setDate(future.getDate() + days);
  return this.find({
    status: { $in: ['pending', 'due'] },
    dueDate: { $gte: new Date(), $lte: future }
  }).sort({ dueDate: 1 });
};

// Static: summary for a contract
RentPaymentSchema.statics.getContractSummary = async function (contractId) {
  const payments = await this.find({ contractId });
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const paid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amountPaid, 0);
  const overdue = payments.filter(p => p.status !== 'paid' && p.status !== 'cancelled' && p.dueDate < new Date());
  return { total, paid, outstanding: total - paid, overdueCount: overdue.length, payments };
};

const RentPayment = mongoose.model('RentPayment', RentPaymentSchema);

module.exports = RentPayment;
