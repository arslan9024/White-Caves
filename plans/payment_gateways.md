# Multi-Currency Payment Gateways

**Status**: Planned  
**Priority**: High  
**Estimated Effort**: 30 hours  
**Depends On**: Transaction model, commission tracking (backend complete)

---

## Objective

Enable secure online payments for booking deposits, commission disbursement, and service fees. Support AED (primary), USD, EUR, GBP with automatic exchange rates.

---

## Success Criteria

- [ ] Stripe UAE integration for card payments (Visa, Mastercard, AMEX)
- [ ] Multi-currency: AED, USD, EUR, GBP with live exchange rates
- [ ] Escrow-like deposit holding for property reservations
- [ ] Commission auto-disbursement to agent accounts
- [ ] PCI DSS compliance (Stripe handles card data — no PAN touches our server)
- [ ] Payment receipt/invoice PDF generation
- [ ] Reconciliation dashboard for finance team

---

## Payment Gateway Comparison (UAE)

| Gateway | AED Support | Fees | Setup | Notes |
|---------|------------|------|-------|-------|
| **Stripe UAE** | ✅ | 2.9% + 1 AED | Days | Already have `stripe` in deps |
| **Checkout.com** | ✅ | 2.5% + custom | Weeks | Popular in UAE/MENA |
| **Tabby** | ✅ | Buy-now-pay-later | Weeks | Installment payments |
| **PayTabs** | ✅ | 2.8% | Weeks | Local UAE provider |
| **Network International** | ✅ | Custom | Months | Enterprise, bank integration |

**Recommendation**: Stripe UAE (already a dependency) for Phase 1, add Checkout.com for enterprise clients in Phase 2.

---

## Implementation Checklist

### Phase 1: Stripe Integration (15h)
- [ ] Configure Stripe UAE account (AED settlement)
- [ ] Create `server/services/PaymentService.ts`
  - [ ] `createPaymentIntent(amount, currency, metadata)`
  - [ ] `confirmPayment(paymentIntentId)`
  - [ ] `createRefund(paymentIntentId, amount)`
  - [ ] `getPaymentHistory(userId, filters)`
- [ ] API Routes (`server/routes/payments.ts`):
  - [ ] `POST /api/payments/intent` — create payment intent
  - [ ] `POST /api/payments/confirm` — confirm payment
  - [ ] `GET /api/payments` — list user payments
  - [ ] `POST /api/payments/webhook` — Stripe webhook handler
- [ ] Prisma model: `Payment` (id, stripeId, amount, currency, status, type, userId, propertyId, metadata)
- [ ] Frontend: `PaymentForm` component with Stripe Elements
- [ ] Webhook handler for async payment events (success, failure, dispute)
- [ ] Multi-currency: use Stripe's auto-conversion or ECB rates API

### Phase 2: Escrow & Commission Disbursement (10h)
- [ ] Escrow workflow: buyer deposits → held → released on deal close
- [ ] Commission calculation: auto-compute from Transaction + Commission models
- [ ] Stripe Connect for agent payouts (separate connected accounts)
- [ ] Finance dashboard: pending/completed/disputed payments

### Phase 3: Invoice Generation (5h)
- [ ] PDF invoice generation (Puppeteer or `pdf-lib`)
- [ ] VAT calculation (5% UAE VAT)
- [ ] TRN (Tax Registration Number) on invoices
- [ ] Email invoice on payment confirmation

---

## Dubai Regulatory Notes

- RERA requires escrow accounts for off-plan sales (developer payments)
- Agent commission typically 2% (sale) or 5% (annual rent)
- UAE VAT: 5% on service fees, commissions are taxable
- AML/KYC requirements for transactions >55,000 AED
