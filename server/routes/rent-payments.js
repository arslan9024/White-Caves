import express from 'express';
import RentPayment from '../models/RentPayment.js';

const router = express.Router();

// GET /api/rent-payments - List rent payments
router.get('/', async (req, res) => {
  try {
    const { contractId, tenantId, landlordId, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (contractId) filter.contractId = contractId;
    if (tenantId) filter.tenantId = tenantId;
    if (landlordId) filter.landlordId = landlordId;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [payments, total] = await Promise.all([
      RentPayment.find(filter).sort({ dueDate: 1 }).skip(skip).limit(parseInt(limit)),
      RentPayment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      payments,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rent-payments/overdue - Get overdue payments
router.get('/overdue', async (req, res) => {
  try {
    const payments = await RentPayment.getOverduePayments();
    res.json({ success: true, payments, count: payments.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rent-payments/upcoming - Get upcoming payments
router.get('/upcoming', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const payments = await RentPayment.getUpcomingPayments(days);
    res.json({ success: true, payments, count: payments.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rent-payments/contract/:contractId/summary - Contract payment summary
router.get('/contract/:contractId/summary', async (req, res) => {
  try {
    const summary = await RentPayment.getContractSummary(req.params.contractId);
    res.json({ success: true, ...summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rent-payments/:id - Get single payment
router.get('/:id', async (req, res) => {
  try {
    const payment = await RentPayment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rent-payments - Create payment record
router.post('/', async (req, res) => {
  try {
    // Schema validation enforced for payload
    const payment = await RentPayment.create(req.body);
    res.status(201).json({ success: true, payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/rent-payments/:id - Update payment
router.put('/:id', async (req, res) => {
  try {
    const payment = await RentPayment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ success: true, payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/rent-payments/:id/mark-paid - Mark as paid
router.post('/:id/mark-paid', async (req, res) => {
  try {
    const { amountPaid, transactionReference, paymentMethod, notes } = req.body;
    const payment = await RentPayment.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: 'paid',
          paidDate: new Date(),
          amountPaid: amountPaid || payment?.amount,
          transactionReference,
          paymentMethod,
          notes,
        },
      },
      { new: true }
    );
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ success: true, payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/rent-payments/:id - Delete payment record
router.delete('/:id', async (req, res) => {
  try {
    const payment = await RentPayment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ success: true, message: 'Payment record deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
