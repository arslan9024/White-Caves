/**
 * Transaction & Commission Data Generator
 * =========================================
 * Generates 30+ realistic Dubai real-estate transactions
 * with linked commissions matching Prisma/Redux shapes.
 */

import { createRng } from './rng';

// ─── Constants ────────────────────────────────────────────────

export const TRANSACTION_TYPES = ['sale', 'rental', 'lease'] as const;
export const TRANSACTION_STATUSES = ['draft', 'pending', 'in_progress', 'completed', 'cancelled'] as const;
export const COMMISSION_TYPES = ['sale', 'rental', 'referral'] as const;
export const COMMISSION_STATUSES = ['pending', 'approved', 'paid', 'cancelled'] as const;

const BUYER_FIRST = [
  'Alexander', 'Viktor', 'Nikolai', 'Chen', 'Wei', 'Raj', 'Sanjay',
  'Pierre', 'Giovanni', 'James', 'Oliver', 'Lucas', 'Hugo', 'Liam',
  'Amir', 'Sergei', 'Hans', 'Carlos', 'Thomas', 'William',
];

const BUYER_LAST = [
  'Petrov', 'Ivanov', 'Li', 'Wang', 'Singh', 'Kumar', 'Rossi',
  'Schmidt', 'Dubois', 'Williams', 'Anderson', 'Johansson', 'Garcia',
  'Martinez', 'Fischer', 'Volkov', 'Tanaka', 'Kim', 'Park', 'O\'Brien',
];

const SELLER_FIRST = [
  'Mohammed', 'Khalid', 'Ahmed', 'Fatima', 'Saif', 'Rashid',
  'Ibrahim', 'Hamdan', 'Noor', 'Layla', 'Emaar', 'Damac',
  'Sultan', 'Abdulla', 'Maryam', 'Hessa',
];

const SELLER_LAST = [
  'Al Maktoum', 'Al Rashid', 'Al Habtoor', 'Al Ghurair', 'Properties LLC',
  'Real Estate PJSC', 'Al Falasi', 'Al Mansouri', 'Holdings Group',
  'Al Suwaidi', 'Development Corp', 'Al Mheiri', 'Investments Ltd',
];

const DOCUMENT_TYPES = [
  'MOU_signed.pdf', 'Title_Deed.pdf', 'NOC_letter.pdf', 'SPA_agreement.pdf',
  'Mortgage_approval.pdf', 'Valuation_report.pdf', 'Passport_copy.pdf',
  'Emirates_ID.pdf', 'Bank_statement.pdf', 'Power_of_attorney.pdf',
];

const TRANSACTION_NOTES = [
  'Smooth transaction, buyer secured mortgage pre-approval.',
  'Cash deal, expedited closing within 3 weeks.',
  'Buyer requested extended payment plan — approved by seller.',
  'Multiple counter-offers before final agreement.',
  'Off-plan purchase with developer payment plan.',
  'Investment purchase — buyer is overseas, completed via POA.',
  'Quick closing — buyer very motivated, no contingencies.',
  'Complex deal involving property swap + cash top-up.',
  'Referred by existing client. Premium commission applies.',
  'Rental agreement with option to purchase after 2 years.',
];

// ─── Interfaces ───────────────────────────────────────────────

export interface GeneratedTransaction {
  id: string;
  type: string;
  status: string;
  leadId: string;
  propertyId: string;
  agentId: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  sellerEmail: string;
  amount: number;
  amountFormatted: string;
  offerPrice: { amount: number; currency: 'AED' };
  finalPrice: { amount: number; currency: 'AED' } | null;
  commission: {
    percentage: number;
    amount: number;
    paidToAgent: number;
    paidToBroker: number;
  };
  timeline: {
    inquiryDate: string;
    offerDate: string | null;
    acceptanceDate: string | null;
    signatureDate: string | null;
    closingDate: string | null;
  };
  documents: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedCommission {
  id: string;
  transactionId: string;
  agentId: string;
  leadId: string;
  propertyId: string;
  type: string;
  status: string;
  percentage: number;
  amount: number;
  paidToAgent: number;
  paidToBroker: number;
  notes: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Generator ────────────────────────────────────────────────

export function generateTransactions(count = 30, seed = 200): {
  transactions: GeneratedTransaction[];
  commissions: GeneratedCommission[];
} {
  const rng = createRng(seed);
  const transactions: GeneratedTransaction[] = [];
  const commissions: GeneratedCommission[] = [];

  for (let i = 0; i < count; i++) {
    const txId = `txn-${String(i + 1).padStart(3, '0')}`;
    const type = rng.pick(TRANSACTION_TYPES);
    const agentId = `agent-${String(rng.int(1, 20)).padStart(2, '0')}`;
    const propertyId = `prop-${String(rng.int(1, 50)).padStart(3, '0')}`;
    const leadId = `lead-${String(rng.int(1, 100)).padStart(3, '0')}`;

    // Status distribution: more completed/in_progress for realism
    const statusPool: typeof TRANSACTION_STATUSES[number][] = [
      'completed', 'completed', 'completed', 'in_progress', 'in_progress',
      'pending', 'pending', 'draft', 'cancelled',
    ];
    const status = rng.pick(statusPool);

    // Amount ranges based on type
    let baseAmount: number;
    if (type === 'sale') {
      baseAmount = rng.int(500_000, 30_000_000);
    } else if (type === 'rental') {
      baseAmount = rng.int(50_000, 500_000); // annual rent
    } else {
      baseAmount = rng.int(100_000, 2_000_000); // lease
    }
    baseAmount = Math.round(baseAmount / 10_000) * 10_000;

    const buyerFirst = rng.pick(BUYER_FIRST);
    const buyerLast = rng.pick(BUYER_LAST);
    const sellerFirst = rng.pick(SELLER_FIRST);
    const sellerLast = rng.pick(SELLER_LAST);

    // Commission: 2-5% for sales, 5% for rentals (of annual), 3% for leases
    const commPercentage = type === 'sale' ? rng.int(20, 50) / 10
                         : type === 'rental' ? 5
                         : 3;
    const commAmount = Math.round(baseAmount * commPercentage / 100);
    const agentSplit = rng.int(50, 70) / 100; // 50-70% to agent
    const paidToAgent = Math.round(commAmount * agentSplit);
    const paidToBroker = commAmount - paidToAgent;

    // Offer price: 95-105% of base
    const offerMultiplier = rng.int(95, 105) / 100;
    const offerPrice = Math.round(baseAmount * offerMultiplier / 10_000) * 10_000;

    // Final price: equal to base for completed, null for draft
    const finalPrice = ['completed', 'in_progress'].includes(status) ? baseAmount : null;

    // Timeline
    const daysAgo = rng.int(10, 365);
    const inquiryDate = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];
    const offerDays = rng.int(3, 14);
    const offerDate = status !== 'draft'
      ? new Date(Date.now() - (daysAgo - offerDays) * 86400000).toISOString().split('T')[0]
      : null;
    const acceptDate = ['completed', 'in_progress', 'cancelled'].includes(status)
      ? new Date(Date.now() - (daysAgo - offerDays - rng.int(2, 10)) * 86400000).toISOString().split('T')[0]
      : null;
    const signDate = ['completed'].includes(status)
      ? new Date(Date.now() - (daysAgo - offerDays - rng.int(15, 30)) * 86400000).toISOString().split('T')[0]
      : null;
    const closeDate = status === 'completed'
      ? new Date(Date.now() - rng.int(1, daysAgo - 30 > 1 ? daysAgo - 30 : 1) * 86400000).toISOString().split('T')[0]
      : null;

    // Documents
    const docCount = status === 'completed' ? rng.int(5, 8) : status === 'draft' ? rng.int(0, 2) : rng.int(2, 5);
    const docs = rng.pickN([...DOCUMENT_TYPES], docCount);

    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
    const updatedAt = new Date(Date.now() - rng.int(0, Math.min(daysAgo, 7)) * 86400000).toISOString();

    transactions.push({
      id: txId,
      type,
      status,
      leadId,
      propertyId,
      agentId,
      buyerName: `${buyerFirst} ${buyerLast}`,
      buyerEmail: `${buyerFirst.toLowerCase()}.${buyerLast.toLowerCase().replace(/'/g, '')}@gmail.com`,
      sellerName: `${sellerFirst} ${sellerLast}`,
      sellerEmail: `${sellerFirst.toLowerCase()}.${sellerLast.toLowerCase().replace(/\s+/g, '').replace(/'/g, '')}@whitecaves.ae`,
      amount: baseAmount,
      amountFormatted: `AED ${baseAmount.toLocaleString('en-US')}`,
      offerPrice: { amount: offerPrice, currency: 'AED' },
      finalPrice: finalPrice ? { amount: finalPrice, currency: 'AED' } : null,
      commission: {
        percentage: commPercentage,
        amount: commAmount,
        paidToAgent,
        paidToBroker,
      },
      timeline: {
        inquiryDate,
        offerDate,
        acceptanceDate: acceptDate,
        signatureDate: signDate,
        closingDate: closeDate,
      },
      documents: docs,
      notes: rng.pick(TRANSACTION_NOTES),
      createdAt,
      updatedAt,
    });

    // Generate matching commission record
    const commStatus = status === 'completed' ? rng.pick(['approved', 'paid', 'paid']) as string
                     : status === 'cancelled' ? 'cancelled' as string
                     : 'pending' as string;

    commissions.push({
      id: `comm-${String(i + 1).padStart(3, '0')}`,
      transactionId: txId,
      agentId,
      leadId,
      propertyId,
      type: type === 'sale' ? 'sale' : type === 'rental' ? 'rental' : 'referral',
      status: commStatus,
      percentage: commPercentage,
      amount: commAmount,
      paidToAgent,
      paidToBroker,
      notes: `Commission for ${txId} — ${type} transaction`,
      paidAt: commStatus === 'paid'
        ? new Date(Date.now() - rng.int(1, 30) * 86400000).toISOString()
        : null,
      createdAt,
      updatedAt,
    });
  }

  return { transactions, commissions };
}
