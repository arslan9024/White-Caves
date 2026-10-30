import { Router } from 'express';
import { requirePermission } from '../middleware/rbac.js';
import {
  createCommission,
  createExpense,
  createInvoice,
  createTaxInvoiceHandler,
  deleteExpense,
  deleteInvoice,
  getCommissionById,
  getCommissions,
  getCorporateTaxSummary,
  getDirectorsLoanSummary,
  getExpenseById,
  getExpenseCatalog,
  getExpenses,
  getInvoiceById,
  getInvoicePdf,
  getInvoices,
  getSummary,
  getVatReturn,
  processBulkPayments,
  updateCommission,
  updateExpense,
  updateInvoice,
} from '../controllers/finance/index.js';

const router = Router();

// Summary & Overview
router.get('/summary', requirePermission('view_payments'), getSummary);

// Commissions
router.get('/commissions', requirePermission('view_payments'), getCommissions);
router.get('/commissions/:id', requirePermission('view_payments'), getCommissionById);
router.post('/commissions', requirePermission('process_payments'), createCommission);
router.patch('/commissions/:id', requirePermission('process_payments'), updateCommission);
router.post('/payments', requirePermission('process_payments'), processBulkPayments);

// Invoices
router.get('/invoices', requirePermission('view_payments'), getInvoices);
router.get('/invoices/:id', requirePermission('view_payments'), getInvoiceById);
router.post('/invoices', requirePermission('process_payments'), createInvoice);
router.patch('/invoices/:id', requirePermission('process_payments'), updateInvoice);
router.delete('/invoices/:id', requirePermission('process_payments'), deleteInvoice);
router.post('/invoices/tax', requirePermission('process_payments'), createTaxInvoiceHandler);
router.get('/invoices/:id/pdf', requirePermission('view_payments'), getInvoicePdf);

// Expenses
router.get('/expenses', requirePermission('view_payments'), getExpenses);
router.get('/expenses/:id', requirePermission('view_payments'), getExpenseById);
router.post('/expenses', requirePermission('process_payments'), createExpense);
router.patch('/expenses/:id', requirePermission('process_payments'), updateExpense);
router.delete('/expenses/:id', requirePermission('process_payments'), deleteExpense);
router.get('/expense-catalog', requirePermission('view_payments'), getExpenseCatalog);

// Tax & Analytics
router.get('/vat-return', requirePermission('view_payments'), getVatReturn);
router.get('/directors-loan-summary', requirePermission('view_payments'), getDirectorsLoanSummary);
router.get('/corporate-tax-summary', requirePermission('view_payments'), getCorporateTaxSummary);

export default router;
