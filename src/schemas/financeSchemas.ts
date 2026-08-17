import { z } from 'zod';

export const VatInvoiceSchema = z.object({
  invoiceNumber: z.string().regex(/^INV-\d{4}-\d+$/, 'Invalid Invoice Number format'),
  trn: z.string().regex(/^100\d{12}$/, 'Invalid UAE FTA TRN format'),
  clientName: z.string().min(1),
  propertyTitle: z.string().min(1),
  issueDate: z.string(),
  netAmountAED: z.number().positive(),
  vatRatePct: z.number().default(5),
  vatAmountAED: z.number().nonnegative(),
  grossAmountAED: z.number().positive(),
  paymentStatus: z.enum(['PAID', 'PENDING', 'OVERDUE', 'CANCELLED']).default('PENDING'),
});

export const PostDatedChequeSchema = z.object({
  id: z.string().min(1),
  chequeNumber: z.string().min(4),
  bankName: z.string().min(1),
  tenantName: z.string().min(1),
  amountAED: z.number().positive(),
  dueDate: z.string(),
  status: z.enum(['UPCOMING', 'DUE', 'DEPOSITED', 'CLEARED', 'BOUNCED']),
  propertyId: z.string().optional(),
});

export type VatInvoice = z.infer<typeof VatInvoiceSchema>;
export type PostDatedCheque = z.infer<typeof PostDatedChequeSchema>;
