/**
 * Document Auto-Fill Service — Phase 4B
 *
 * Automatically populates document template variables from database records.
 * Maps Prisma model fields → Handlebars template variables per document type.
 *
 * Smart clause selection: applies conditional context (sale vs rental,
 * cash vs mortgage, furnished vs unfurnished) to generate contextually
 * appropriate documents.
 *
 * Usage:
 *   import { autoFillVariables, getAutoFillableEntities } from './documentAutoFill.js';
 *   const vars = await autoFillVariables('mou', { leadId, propertyId, transactionId });
 */

import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';
const db = prisma as any;

// ─── Types ──────────────────────────────────────────────────────────────

export interface AutoFillContext {
  leadId?: string;
  propertyId?: string;
  transactionId?: string;
  commissionId?: string;
  viewingId?: string;
  leaseId?: string;
  offerId?: string;
}

export interface AutoFillResult {
  variables: Record<string, string>;
  context: {
    type: string;
    entitiesUsed: string[];
    clauseSelections: Record<string, string>;
    missingFields: string[];
  };
}

export interface AutoFillableEntity {
  type: string;
  label: string;
  requiredEntities: string[];
  optionalEntities: string[];
}

// ─── Entity Registry ────────────────────────────────────────────────────

/**
 * Maps document types → which entities they need for auto-fill.
 */
export const DOCUMENT_ENTITY_MAP: Record<string, AutoFillableEntity> = {
  mou: {
    type: 'mou',
    label: 'Memorandum of Understanding',
    requiredEntities: ['lead', 'property'],
    optionalEntities: ['transaction'],
  },
  form_f: {
    type: 'form_f',
    label: 'Form F — Tenancy Contract',
    requiredEntities: ['lead', 'property'],
    optionalEntities: ['lease'],
  },
  noc: {
    type: 'noc',
    label: 'No Objection Certificate',
    requiredEntities: ['property'],
    optionalEntities: ['lead', 'transaction'],
  },
  commission_invoice: {
    type: 'commission_invoice',
    label: 'Commission Invoice',
    requiredEntities: ['commission'],
    optionalEntities: ['lead', 'property'],
  },
  viewing_report: {
    type: 'viewing_report',
    label: 'Property Viewing Report',
    requiredEntities: ['lead', 'property'],
    optionalEntities: ['viewing'],
  },
  offer_letter: {
    type: 'offer_letter',
    label: 'Property Offer Letter',
    requiredEntities: ['lead', 'property'],
    optionalEntities: ['offer'],
  },
};

// ─── Helper functions ───────────────────────────────────────────────────

function formatDate(date: Date | null | undefined): string {
  if (!date) return '';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatCurrency(amount: number | null | undefined, currency = 'AED'): string {
  if (!amount) return '';
  return `${currency} ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
}

function safe(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

// ─── DB Query Helpers ───────────────────────────────────────────────────

async function fetchLead(leadId: string) {
  return db.lead.findUnique({
    where: { id: leadId },
    include: {
      assignedTo: { select: { id: true, name: true, email: true, phone: true } },
      property: { select: { id: true, title: true, type: true, location: true } },
    },
  });
}

async function fetchProperty(propertyId: string) {
  return db.property.findUnique({
    where: { id: propertyId },
  });
}

async function fetchTransaction(transactionId: string) {
  return db.transaction.findUnique({
    where: { id: transactionId },
    include: {
      lead: { select: { name: true, phone: true, email: true } },
      property: { select: { title: true, location: true, type: true } },
    },
  });
}

async function fetchCommission(commissionId: string) {
  return db.commission.findUnique({
    where: { id: commissionId },
    include: {
      agent: { select: { name: true, email: true } },
      lead: { select: { name: true, company: true, email: true } },
      property: { select: { title: true } },
    },
  });
}

async function fetchViewing(viewingId: string) {
  return db.viewing.findUnique({
    where: { id: viewingId },
    include: {
      lead: { select: { name: true, phone: true, budget: true, budgetCurrency: true, score: true } },
      property: { select: { title: true, location: true, price: true, type: true, area: true, sqft: true } },
    },
  });
}

async function fetchLease(leaseId: string) {
  return db.lease.findUnique({
    where: { id: leaseId },
    include: {
      tenant: { select: { id: true, name: true, email: true, phone: true } },
      property: { select: { title: true, location: true, type: true, area: true, sqft: true } },
    },
  });
}

async function fetchOffer(offerId: string) {
  return db.offer.findUnique({
    where: { id: offerId },
    include: {
      lead: { select: { name: true, phone: true, email: true } },
      buyer: { select: { id: true, name: true, email: true, phone: true } },
      property: { select: { title: true, location: true, type: true, price: true } },
    },
  });
}

// ─── Auto-Fill per Document Type ────────────────────────────────────────

async function autoFillMoU(ctx: AutoFillContext): Promise<AutoFillResult> {
  const vars: Record<string, string> = {};
  const entitiesUsed: string[] = [];
  const missingFields: string[] = [];
  const clauseSelections: Record<string, string> = {};

  // Lead = buyer data
  if (ctx.leadId) {
    const lead = await fetchLead(ctx.leadId);
    if (lead) {
      entitiesUsed.push('lead');
      vars.buyerName = safe(lead.name);
      vars.buyerPhone = safe(lead.phone);
      vars.buyerEmail = safe(lead.email);
      vars.buyerEmiratesId = ''; // Not stored in Lead model — agent fills manually
    }
  }
  if (!vars.buyerName) missingFields.push('buyerName');

  // Property
  if (ctx.propertyId) {
    const prop = await fetchProperty(ctx.propertyId);
    if (prop) {
      entitiesUsed.push('property');
      vars.propertyTitle = safe(prop.title);
      vars.propertyLocation = safe(prop.location);
      vars.propertyType = safe(prop.type);
      vars.propertyArea = prop.sqft ? `${prop.sqft} sq ft` : (safe(prop.area) || '');
      vars.propertyDistrict = safe(prop.area);
      vars.sellerName = ''; // Property doesn't store owner — agent fills
      vars.sellerPhone = '';

      // Smart clause: sale vs rental
      const isSale = ['sale', 'buy'].includes((prop.type || '').toLowerCase());
      clauseSelections.transactionType = isSale ? 'sale' : 'rental';
      vars.transactionType = isSale ? 'Sale' : 'Rental';
    }
  }
  if (!vars.propertyTitle) missingFields.push('propertyTitle');

  // Transaction
  if (ctx.transactionId) {
    const tx = await fetchTransaction(ctx.transactionId);
    if (tx) {
      entitiesUsed.push('transaction');
      vars.agreedPrice = formatCurrency(tx.amount);
      vars.depositAmount = tx.amount ? formatCurrency(tx.amount * 0.1) : ''; // 10% deposit default
      vars.closingDate = formatDate(tx.closingDate || null);
      vars.paymentPlan = safe(tx.notes); // Transaction.notes used for payment plan details

      // Smart clause: payment method
      const terms = (tx.notes || '').toLowerCase();
      if (terms.includes('mortgage')) {
        clauseSelections.paymentMethod = 'mortgage';
        vars.paymentPlan = vars.paymentPlan || 'Subject to mortgage approval';
      } else {
        clauseSelections.paymentMethod = 'cash';
      }
    }
  }

  return { variables: vars, context: { type: 'mou', entitiesUsed, clauseSelections, missingFields } };
}

async function autoFillFormF(ctx: AutoFillContext): Promise<AutoFillResult> {
  const vars: Record<string, string> = {};
  const entitiesUsed: string[] = [];
  const missingFields: string[] = [];
  const clauseSelections: Record<string, string> = {};

  // Lead = tenant data
  if (ctx.leadId) {
    const lead = await fetchLead(ctx.leadId);
    if (lead) {
      entitiesUsed.push('lead');
      vars.tenantName = safe(lead.name);
      vars.tenantPhone = safe(lead.phone);
      vars.tenantNationality = '';
      vars.tenantEmiratesId = '';
    }
  }
  if (!vars.tenantName) missingFields.push('tenantName');

  // Lease data
  if (ctx.leaseId) {
    const lease = await fetchLease(ctx.leaseId);
    if (lease) {
      entitiesUsed.push('lease');
      vars.leaseStart = formatDate(lease.startDate);
      vars.leaseEnd = formatDate(lease.endDate);
      vars.annualRent = formatCurrency(lease.monthlyRent * 12); // Convert monthly to annual
      vars.monthlyRent = formatCurrency(lease.monthlyRent);
      vars.securityDeposit = lease.depositAmount ? formatCurrency(lease.depositAmount) : '';
      vars.ejariNumber = safe(lease.ejariNumber);
      vars.paymentFrequency = 'Monthly';

      // Smart clause: Ejari
      clauseSelections.ejariRegistered = lease.ejariNumber ? 'yes' : 'no';

      // Smart clause: furnished (from lease terms)
      const furnished = (lease.terms || '').toLowerCase();
      if (furnished.includes('furnished')) {
        clauseSelections.furnished = 'yes';
      } else {
        clauseSelections.furnished = 'no';
      }

      // Tenant info from lease
      if (lease.tenant) {
        vars.tenantName = vars.tenantName || safe(lease.tenant.name);
        vars.tenantPhone = vars.tenantPhone || safe(lease.tenant.phone);
      }

      // Property from lease
      if (lease.property) {
        entitiesUsed.push('property');
        vars.propertyTitle = safe(lease.property.title);
        vars.propertyLocation = safe(lease.property.location);
        vars.propertyType = safe(lease.property.type);
        vars.propertyArea = lease.property.sqft ? `${lease.property.sqft} sq ft` : (safe(lease.property.area) || '');
      }
    }
  }

  // Property fallback
  if (!vars.propertyTitle && ctx.propertyId) {
    const prop = await fetchProperty(ctx.propertyId);
    if (prop) {
      entitiesUsed.push('property');
      vars.propertyTitle = safe(prop.title);
      vars.propertyLocation = safe(prop.location);
      vars.propertyType = safe(prop.type);
      vars.propertyArea = prop.sqft ? `${prop.sqft} sq ft` : (safe(prop.area) || '');
    }
  }

  if (!vars.annualRent) missingFields.push('annualRent');

  // Landlord info — not stored, agent provides
  vars.landlordName = '';
  vars.landlordNationality = '';
  vars.landlordEmiratesId = '';
  vars.landlordPhone = '';

  return { variables: vars, context: { type: 'form_f', entitiesUsed, clauseSelections, missingFields } };
}

async function autoFillNOC(ctx: AutoFillContext): Promise<AutoFillResult> {
  const vars: Record<string, string> = {};
  const entitiesUsed: string[] = [];
  const missingFields: string[] = [];
  const clauseSelections: Record<string, string> = {};

  // Property
  if (ctx.propertyId) {
    const prop = await fetchProperty(ctx.propertyId);
    if (prop) {
      entitiesUsed.push('property');
      vars.propertyTitle = safe(prop.title);
      vars.propertyLocation = safe(prop.location);
      vars.propertyType = safe(prop.type);
      vars.propertyArea = prop.sqft ? `${prop.sqft} sq ft` : (safe(prop.area) || '');
      vars.titleDeedNumber = '';
      vars.currentOwner = '';
      vars.outstandingDues = 'None';
      vars.serviceChargesStatus = 'Paid';
      vars.utilityStatus = 'Clear';
      vars.mortgageStatus = 'No outstanding mortgage';

      // Smart clause: freehold vs leasehold
      const type = (prop.type || '').toLowerCase();
      if (type.includes('freehold') || type.includes('villa')) {
        clauseSelections.ownership = 'freehold';
      } else {
        clauseSelections.ownership = 'leasehold';
      }
    }
  }
  if (!vars.propertyTitle) missingFields.push('propertyTitle');

  // New buyer
  if (ctx.leadId) {
    const lead = await fetchLead(ctx.leadId);
    if (lead) {
      entitiesUsed.push('lead');
      vars.newOwner = safe(lead.name);
    }
  }

  // Transaction
  if (ctx.transactionId) {
    const tx = await fetchTransaction(ctx.transactionId);
    if (tx) {
      entitiesUsed.push('transaction');
      vars.transferAmount = formatCurrency(tx.amount);
    }
  }

  // Valid for 30 days by default
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);
  vars.validUntil = formatDate(validUntil);

  return { variables: vars, context: { type: 'noc', entitiesUsed, clauseSelections, missingFields } };
}

async function autoFillCommissionInvoice(ctx: AutoFillContext): Promise<AutoFillResult> {
  const vars: Record<string, string> = {};
  const entitiesUsed: string[] = [];
  const missingFields: string[] = [];
  const clauseSelections: Record<string, string> = {};

  if (ctx.commissionId) {
    const comm = await fetchCommission(ctx.commissionId);
    if (comm) {
      entitiesUsed.push('commission');
      vars.commissionAmount = formatCurrency(comm.amount);
      vars.commissionRate = comm.percentage ? `${comm.percentage}%` : '';
      vars.commissionType = safe(comm.type);
      vars.invoiceNumber = `WC-INV-${Date.now().toString(36).toUpperCase()}`;
      vars.invoiceDate = formatDate(new Date());

      // VAT calculation (Phase 3D)
      const vatRate = comm.vatRate || 5;
      const vatAmount = comm.vatAmount || (comm.amount * vatRate / 100);
      vars.subtotal = formatCurrency(comm.amount);
      vars.vatAmount = formatCurrency(vatAmount);
      vars.totalAmount = formatCurrency(comm.amount + vatAmount);

      // Due date = 30 days
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      vars.dueDate = formatDate(dueDate);

      // Smart clause: sale vs rental commission percentage
      const commType = (comm.type || '').toLowerCase();
      if (commType.includes('sale') || commType.includes('buy')) {
        clauseSelections.rateType = 'sale';
        vars.commissionRate = vars.commissionRate || '2%';
      } else {
        clauseSelections.rateType = 'rental';
        vars.commissionRate = vars.commissionRate || '5%';
      }

      // Agent/client info
      if (comm.agent) {
        vars.agentName = safe(comm.agent.name);
      }
      if (comm.lead) {
        vars.clientName = safe(comm.lead.name);
        vars.clientCompany = safe(comm.lead.company);
        vars.clientEmail = safe(comm.lead.email);
      }
      if (comm.property) {
        vars.propertyTitle = safe(comm.property.title);
      }

      // TRN (Tax Registration Number) — company-level, agent fills
      vars.trnNumber = '';
      vars.bankName = '';
      vars.iban = '';
      vars.swiftCode = '';
    }
  }
  if (!vars.commissionAmount) missingFields.push('commissionAmount');

  return { variables: vars, context: { type: 'commission_invoice', entitiesUsed, clauseSelections, missingFields } };
}

async function autoFillViewingReport(ctx: AutoFillContext): Promise<AutoFillResult> {
  const vars: Record<string, string> = {};
  const entitiesUsed: string[] = [];
  const missingFields: string[] = [];
  const clauseSelections: Record<string, string> = {};

  if (ctx.viewingId) {
    const viewing = await fetchViewing(ctx.viewingId);
    if (viewing) {
      entitiesUsed.push('viewing');
      vars.viewingDate = formatDate(viewing.scheduledAt);
      vars.viewingTime = viewing.scheduledAt?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) || '';
      vars.viewingStatus = safe(viewing.status);
      vars.feedback = safe(viewing.feedback || viewing.notes);
      vars.followUpAction = '';
      vars.nextContactDate = '';

      if (viewing.lead) {
        entitiesUsed.push('lead');
        vars.clientName = safe(viewing.lead.name);
        vars.clientPhone = safe(viewing.lead.phone);
        vars.clientBudget = viewing.lead.budget
          ? formatCurrency(viewing.lead.budget, viewing.lead.budgetCurrency || 'AED')
          : '';
        vars.leadScore = safe(viewing.lead.score);
      }
      if (viewing.property) {
        entitiesUsed.push('property');
        vars.propertyTitle = safe(viewing.property.title);
        vars.propertyLocation = safe(viewing.property.location);
        vars.propertyPrice = formatCurrency(viewing.property.price);
        vars.propertyType = safe(viewing.property.type);
        vars.propertyArea = viewing.property.sqft ? `${viewing.property.sqft} sq ft` : (safe(viewing.property.area) || '');
      }

      // Smart clause: interest level based on lead score
      const score = viewing.lead?.score || 0;
      if (score >= 80) {
        clauseSelections.interestLevel = 'very_high';
        vars.interestLevel = 'Very High';
        vars.likelihood = 'Strong likelihood of proceeding';
      } else if (score >= 60) {
        clauseSelections.interestLevel = 'high';
        vars.interestLevel = 'High';
        vars.likelihood = 'Good potential, follow-up recommended';
      } else if (score >= 30) {
        clauseSelections.interestLevel = 'moderate';
        vars.interestLevel = 'Moderate';
        vars.likelihood = 'Requires nurturing';
      } else {
        clauseSelections.interestLevel = 'low';
        vars.interestLevel = 'Low';
        vars.likelihood = 'Unlikely to convert without significant engagement';
      }
    }
  }

  // Fallback: load from separate IDs
  if (!vars.clientName && ctx.leadId) {
    const lead = await fetchLead(ctx.leadId);
    if (lead) {
      entitiesUsed.push('lead');
      vars.clientName = safe(lead.name);
      vars.clientPhone = safe(lead.phone);
      vars.clientBudget = lead.budget ? formatCurrency(lead.budget, lead.budgetCurrency || 'AED') : '';
      vars.leadScore = safe(lead.score);
    }
  }

  if (!vars.propertyTitle && ctx.propertyId) {
    const prop = await fetchProperty(ctx.propertyId);
    if (prop) {
      entitiesUsed.push('property');
      vars.propertyTitle = safe(prop.title);
      vars.propertyLocation = safe(prop.location);
      vars.propertyPrice = formatCurrency(prop.price);
      vars.propertyType = safe(prop.type);
      vars.propertyArea = prop.sqft ? `${prop.sqft} sq ft` : (safe(prop.area) || '');
    }
  }

  if (!vars.clientName) missingFields.push('clientName');
  if (!vars.propertyTitle) missingFields.push('propertyTitle');

  return { variables: vars, context: { type: 'viewing_report', entitiesUsed, clauseSelections, missingFields } };
}

async function autoFillOfferLetter(ctx: AutoFillContext): Promise<AutoFillResult> {
  const vars: Record<string, string> = {};
  const entitiesUsed: string[] = [];
  const missingFields: string[] = [];
  const clauseSelections: Record<string, string> = {};

  if (ctx.offerId) {
    const offer = await fetchOffer(ctx.offerId);
    if (offer) {
      entitiesUsed.push('offer');
      vars.offeredPrice = formatCurrency(offer.amount);
      vars.earnestDeposit = offer.amount ? formatCurrency(offer.amount * 0.1) : ''; // 10% default
      vars.additionalConditions = safe(offer.terms || offer.notes);

      // Valid for 7 days
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 7);
      vars.validUntil = formatDate(validUntil);

      // Propose closing in 60 days
      const proposedClosing = new Date();
      proposedClosing.setDate(proposedClosing.getDate() + 60);
      vars.proposedClosing = formatDate(proposedClosing);

      if (offer.lead) {
        entitiesUsed.push('lead');
        vars.buyerName = safe(offer.lead.name);
        vars.buyerPhone = safe(offer.lead.phone);
        vars.buyerEmail = safe(offer.lead.email);
      } else if (offer.buyer) {
        entitiesUsed.push('buyer');
        vars.buyerName = safe(offer.buyer.name);
        vars.buyerPhone = safe(offer.buyer.phone);
        vars.buyerEmail = safe(offer.buyer.email);
      }
      if (offer.property) {
        entitiesUsed.push('property');
        vars.propertyTitle = safe(offer.property.title);
        vars.propertyLocation = safe(offer.property.location);
        vars.propertyType = safe(offer.property.type);
        vars.listedPrice = formatCurrency(offer.property.price);
      }

      // Smart clause: payment method
      const notes = ((offer.terms || '') + ' ' + (offer.notes || '')).toLowerCase();
      if (notes.includes('mortgage') || notes.includes('finance')) {
        clauseSelections.paymentMethod = 'mortgage';
        vars.paymentMethod = 'Bank Mortgage / Finance';
      } else {
        clauseSelections.paymentMethod = 'cash';
        vars.paymentMethod = 'Cash';
      }
    }
  }

  // Fallback: separate IDs
  if (!vars.buyerName && ctx.leadId) {
    const lead = await fetchLead(ctx.leadId);
    if (lead) {
      entitiesUsed.push('lead');
      vars.buyerName = safe(lead.name);
      vars.buyerPhone = safe(lead.phone);
      vars.buyerEmail = safe(lead.email);
    }
  }

  if (!vars.propertyTitle && ctx.propertyId) {
    const prop = await fetchProperty(ctx.propertyId);
    if (prop) {
      entitiesUsed.push('property');
      vars.propertyTitle = safe(prop.title);
      vars.propertyLocation = safe(prop.location);
      vars.propertyType = safe(prop.type);
      vars.listedPrice = formatCurrency(prop.price);
    }
  }

  if (!vars.buyerName) missingFields.push('buyerName');
  if (!vars.propertyTitle) missingFields.push('propertyTitle');

  // Seller name — agent fills
  vars.sellerName = '';

  return { variables: vars, context: { type: 'offer_letter', entitiesUsed, clauseSelections, missingFields } };
}

// ─── Dispatcher ─────────────────────────────────────────────────────────

const AUTO_FILL_MAP: Record<string, (ctx: AutoFillContext) => Promise<AutoFillResult>> = {
  mou: autoFillMoU,
  form_f: autoFillFormF,
  noc: autoFillNOC,
  commission_invoice: autoFillCommissionInvoice,
  viewing_report: autoFillViewingReport,
  offer_letter: autoFillOfferLetter,
};

/**
 * Auto-fill template variables from database records.
 *
 * @param type - Document type (mou, form_f, noc, etc.)
 * @param context - Entity IDs to query from
 * @param overrides - Manual overrides that take precedence over DB values
 */
export async function autoFillVariables(
  type: string,
  context: AutoFillContext,
  overrides?: Record<string, string>,
): Promise<AutoFillResult> {
  const filler = AUTO_FILL_MAP[type];
  if (!filler) {
    throw new Error(`No auto-fill mapping for document type: ${type}. Valid: ${Object.keys(AUTO_FILL_MAP).join(', ')}`);
  }

  logger.info(`[DocumentAutoFill] Auto-filling ${type} from: ${JSON.stringify(context)}`);

  const result = await filler(context);

  // Apply overrides (manual values take precedence)
  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      if (value && value.trim()) {
        result.variables[key] = value;
        // Remove from missing if override provided
        const idx = result.context.missingFields.indexOf(key);
        if (idx >= 0) result.context.missingFields.splice(idx, 1);
      }
    }
  }

  logger.info(
    `[DocumentAutoFill] Filled ${Object.keys(result.variables).length} vars, ` +
    `${result.context.entitiesUsed.length} entities, ` +
    `${result.context.missingFields.length} missing, ` +
    `${Object.keys(result.context.clauseSelections).length} clauses`
  );

  return result;
}

/**
 * Get the entity requirements for a document type.
 */
export function getAutoFillableEntities(): AutoFillableEntity[] {
  return Object.values(DOCUMENT_ENTITY_MAP);
}

/**
 * Get entity requirements for a specific document type.
 */
export function getEntityRequirements(type: string): AutoFillableEntity | null {
  return DOCUMENT_ENTITY_MAP[type] || null;
}

export default {
  autoFillVariables,
  getAutoFillableEntities,
  getEntityRequirements,
  DOCUMENT_ENTITY_MAP,
};
