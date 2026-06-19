/**
 * Compliance Service — Phase 3D
 * ─────────────────────────────
 * RERA/Ejari/VAT compliance operations:
 * - Ejari CSV export for bulk registration
 * - VAT summary by property type
 * - Compliance overview dashboard data
 *
 * @module complianceService
 */

import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';

const db = prisma as any;

// ─── Types ───────────────────────────────────────────────────────────────

export interface EjariExportRow {
  leaseNumber: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  landlordName: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyType: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  currency: string;
  ejariNumber: string;
  ejariStatus: string;
  ejariRegistrationDate: string;
  ejariExpiryDate: string;
}

export interface VATSummary {
  period: string;
  residential: {
    commissions: number;
    totalAmount: number;
    vatRate: number;
    vatAmount: number;
  };
  commercial: {
    commissions: number;
    totalAmount: number;
    vatRate: number;
    vatAmount: number;
  };
  unclassified: {
    commissions: number;
    totalAmount: number;
    vatRate: number;
    vatAmount: number;
  };
  totals: {
    commissions: number;
    totalAmount: number;
    totalVAT: number;
    grandTotal: number;
  };
}

export interface ComplianceOverview {
  brnCompliance: {
    total: number;
    valid: number;
    expiringSoon: number;
    expired: number;
    notSet: number;
    percentage: number;
  };
  ejariCompliance: {
    totalLeases: number;
    registered: number;
    pending: number;
    expired: number;
    percentage: number;
  };
  documentCompliance: {
    totalProperties: number;
    withDocuments: number;
    percentage: number;
  };
  overallScore: number;
}

// ─── VAT Rates (Dubai regulations) ──────────────────────────────────────

const VAT_RATES: Record<string, number> = {
  residential: 0, // 0% VAT on residential property sales/rentals
  commercial: 5, // 5% VAT on commercial property
  commission: 5, // 5% VAT on commission income (default)
};

// ─── Residential property types ──────────────────────────────────────────

const RESIDENTIAL_TYPES = new Set(['apartment', 'villa', 'townhouse', 'penthouse', 'studio']);

const COMMERCIAL_TYPES = new Set(['commercial', 'office', 'retail', 'warehouse', 'industrial']);

// ─── Ejari CSV Export ────────────────────────────────────────────────────

/**
 * Generate Ejari CSV data for bulk registration.
 * Returns array of rows + CSV string.
 */
export async function generateEjariExport(filters?: {
  status?: string;
  fromDate?: Date;
  toDate?: Date;
}): Promise<{ rows: EjariExportRow[]; csv: string; count: number }> {
  const where: Record<string, unknown> = {};

  if (filters?.status) {
    where.ejariStatus = filters.status;
  }

  if (filters?.fromDate || filters?.toDate) {
    where.startDate = {};
    if (filters?.fromDate) (where.startDate as Record<string, unknown>).gte = filters.fromDate;
    if (filters?.toDate) (where.startDate as Record<string, unknown>).lte = filters.toDate;
  }

  const leases = await db.lease.findMany({
    where,
    include: {
      tenant: { select: { name: true, email: true, phone: true } },
      landlord: { select: { name: true, email: true } },
      property: { select: { title: true, location: true, type: true } },
    },
    orderBy: { startDate: 'desc' },
  });

  const rows: EjariExportRow[] = leases.map((lease: any) => ({
    leaseNumber: lease.leaseNumber || '',
    tenantName: lease.tenant?.name || '',
    tenantEmail: lease.tenant?.email || '',
    tenantPhone: ((lease.tenant as Record<string, unknown>)?.phone as string) || '',
    landlordName: lease.landlord?.name || '',
    propertyTitle: lease.property?.title || '',
    propertyLocation: lease.property?.location || '',
    propertyType: lease.property?.type || '',
    startDate: lease.startDate.toISOString().split('T')[0],
    endDate: lease.endDate.toISOString().split('T')[0],
    monthlyRent: lease.monthlyRent,
    currency: lease.currency,
    ejariNumber: lease.ejariNumber || '',
    ejariStatus: lease.ejariStatus || 'pending',
    ejariRegistrationDate: lease.ejariRegistrationDate?.toISOString().split('T')[0] || '',
    ejariExpiryDate: lease.ejariExpiryDate?.toISOString().split('T')[0] || '',
  }));

  // Generate CSV
  const headers = [
    'Lease Number',
    'Tenant Name',
    'Tenant Email',
    'Tenant Phone',
    'Landlord Name',
    'Property Title',
    'Property Location',
    'Property Type',
    'Start Date',
    'End Date',
    'Monthly Rent',
    'Currency',
    'Ejari Number',
    'Ejari Status',
    'Registration Date',
    'Expiry Date',
  ];

  const csvLines = [
    headers.join(','),
    ...rows.map(r =>
      [
        escapeCSV(r.leaseNumber),
        escapeCSV(r.tenantName),
        escapeCSV(r.tenantEmail),
        escapeCSV(r.tenantPhone),
        escapeCSV(r.landlordName),
        escapeCSV(r.propertyTitle),
        escapeCSV(r.propertyLocation),
        escapeCSV(r.propertyType),
        r.startDate,
        r.endDate,
        r.monthlyRent,
        r.currency,
        escapeCSV(r.ejariNumber),
        r.ejariStatus,
        r.ejariRegistrationDate,
        r.ejariExpiryDate,
      ].join(',')
    ),
  ];

  logger.info('Ejari CSV export generated', { count: rows.length });

  return {
    rows,
    csv: csvLines.join('\n'),
    count: rows.length,
  };
}

/**
 * Escape a value for CSV (handle commas, quotes, newlines).
 */
function escapeCSV(value: string): string {
  if (!value) return '';
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// ─── VAT Summary ─────────────────────────────────────────────────────────

/**
 * Calculate VAT summary for commissions grouped by property type.
 * Dubai VAT rules: 0% residential, 5% commercial, 5% on commission fees.
 */
export async function calculateVATSummary(fromDate?: Date, toDate?: Date): Promise<VATSummary> {
  const where: Record<string, unknown> = {
    status: { in: ['approved', 'paid'] },
  };

  if (fromDate || toDate) {
    where.createdAt = {};
    if (fromDate) (where.createdAt as Record<string, unknown>).gte = fromDate;
    if (toDate) (where.createdAt as Record<string, unknown>).lte = toDate;
  }

  const commissions = await db.commission.findMany({
    where,
    include: {
      property: { select: { type: true } },
    },
  });

  const summary: VATSummary = {
    period: `${fromDate?.toISOString().split('T')[0] || 'All time'} to ${toDate?.toISOString().split('T')[0] || 'Present'}`,
    residential: { commissions: 0, totalAmount: 0, vatRate: VAT_RATES.residential, vatAmount: 0 },
    commercial: { commissions: 0, totalAmount: 0, vatRate: VAT_RATES.commercial, vatAmount: 0 },
    unclassified: { commissions: 0, totalAmount: 0, vatRate: VAT_RATES.commission, vatAmount: 0 },
    totals: { commissions: 0, totalAmount: 0, totalVAT: 0, grandTotal: 0 },
  };

  for (const commission of commissions) {
    const propertyType = commission.property?.type?.toLowerCase() || '';
    const amount = commission.amount;

    if (RESIDENTIAL_TYPES.has(propertyType)) {
      summary.residential.commissions++;
      summary.residential.totalAmount += amount;
      summary.residential.vatAmount += amount * (VAT_RATES.residential / 100);
    } else if (COMMERCIAL_TYPES.has(propertyType)) {
      summary.commercial.commissions++;
      summary.commercial.totalAmount += amount;
      summary.commercial.vatAmount += amount * (VAT_RATES.commercial / 100);
    } else {
      // Unclassified — apply default commission VAT rate
      summary.unclassified.commissions++;
      summary.unclassified.totalAmount += amount;
      summary.unclassified.vatAmount += amount * (VAT_RATES.commission / 100);
    }
  }

  // Calculate totals
  summary.totals.commissions =
    summary.residential.commissions +
    summary.commercial.commissions +
    summary.unclassified.commissions;
  summary.totals.totalAmount =
    summary.residential.totalAmount +
    summary.commercial.totalAmount +
    summary.unclassified.totalAmount;
  summary.totals.totalVAT =
    summary.residential.vatAmount + summary.commercial.vatAmount + summary.unclassified.vatAmount;
  summary.totals.grandTotal = summary.totals.totalAmount + summary.totals.totalVAT;

  logger.info('VAT summary calculated', {
    period: summary.period,
    commissions: summary.totals.commissions,
    totalAmount: summary.totals.totalAmount,
    totalVAT: summary.totals.totalVAT,
  });

  return summary;
}

// ─── Compliance Overview ─────────────────────────────────────────────────

/**
 * Get overall compliance dashboard data.
 * Aggregates BRN status, Ejari registration, and document compliance.
 */
export async function getComplianceOverview(): Promise<ComplianceOverview> {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // BRN Compliance
  const agents = await db.user.findMany({
    where: { role: { in: ['agent', 'owner'] }, status: 'active' },
    select: { brnNumber: true, brnExpiry: true },
  });

  const brnStats = { total: agents.length, valid: 0, expiringSoon: 0, expired: 0, notSet: 0 };
  for (const agent of agents) {
    if (!agent.brnNumber || !agent.brnExpiry) {
      brnStats.notSet++;
    } else if (agent.brnExpiry < now) {
      brnStats.expired++;
    } else if (agent.brnExpiry < thirtyDaysFromNow) {
      brnStats.expiringSoon++;
    } else {
      brnStats.valid++;
    }
  }

  // Ejari Compliance
  const leases = await db.lease.findMany({
    where: { status: { in: ['active', 'expiring'] } },
    select: { ejariStatus: true },
  });

  const ejariStats = { totalLeases: leases.length, registered: 0, pending: 0, expired: 0 };
  for (const lease of leases) {
    if (lease.ejariStatus === 'registered') ejariStats.registered++;
    else if (lease.ejariStatus === 'expired') ejariStats.expired++;
    else ejariStats.pending++;
  }

  // Document Compliance
  const [totalProps, propsWithDocs] = await Promise.all([
    db.property.count({ where: { status: { not: 'off_market' } } }),
    db.property.count({
      where: { status: { not: 'off_market' }, images: { isEmpty: false } },
    }),
  ]);

  const brnPct =
    brnStats.total > 0
      ? Math.round(((brnStats.valid + brnStats.expiringSoon) / brnStats.total) * 100)
      : 100;
  const ejariPct =
    ejariStats.totalLeases > 0
      ? Math.round((ejariStats.registered / ejariStats.totalLeases) * 100)
      : 100;
  const docPct = totalProps > 0 ? Math.round((propsWithDocs / totalProps) * 100) : 100;

  return {
    brnCompliance: { ...brnStats, percentage: brnPct },
    ejariCompliance: { ...ejariStats, percentage: ejariPct },
    documentCompliance: {
      totalProperties: totalProps,
      withDocuments: propsWithDocs,
      percentage: docPct,
    },
    overallScore: Math.round((brnPct + ejariPct + docPct) / 3),
  };
}

// ─── Ejari Status Management ─────────────────────────────────────────────

/**
 * Update Ejari status for a lease.
 */
export async function updateEjariStatus(
  leaseId: string,
  ejariData: {
    ejariNumber?: string;
    ejariStatus?: string;
    ejariRegistrationDate?: Date;
    ejariExpiryDate?: Date;
  }
): Promise<unknown> {
  const lease = await db.lease.findUnique({ where: { id: leaseId } });
  if (!lease) throw new Error('Lease not found');

  const updated = await db.lease.update({
    where: { id: leaseId },
    data: {
      ejariNumber: ejariData.ejariNumber ?? lease.ejariNumber,
      ejariStatus: ejariData.ejariStatus ?? lease.ejariStatus,
      ejariRegistrationDate: ejariData.ejariRegistrationDate ?? lease.ejariRegistrationDate,
      ejariExpiryDate: ejariData.ejariExpiryDate ?? lease.ejariExpiryDate,
    },
  });

  logger.info('Ejari status updated', {
    leaseId,
    ejariNumber: updated.ejariNumber,
    ejariStatus: updated.ejariStatus,
  });
  return updated;
}
