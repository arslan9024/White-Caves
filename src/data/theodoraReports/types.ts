/**
 * theodoraReportsRegistry.ts
 *
 * Master Registry of 67 Enterprise Reports across 14 Standardized Categories
 * for Theodora AI (3.14 - Finance & Accounting Director / CFO Intelligence).
 * Modeled after Zoho Books / Enterprise ERP standards and tailored for
 * UAE Real Estate, FTA 5% VAT, Corporate Tax 9%, RERA Escrow, and Agency Operations.
 */

export type ReportCategoryKey =
  | 'business-overview'
  | 'sales'
  | 'inventory'
  | 'receivables'
  | 'payments-received'
  | 'recurring-invoices'
  | 'payables'
  | 'purchases-expenses'
  | 'taxes'
  | 'banking'
  | 'projects-timesheets'
  | 'accountant'
  | 'currency'
  | 'activity'
  | 'automation';

export interface ReportCategoryMeta {
  id: ReportCategoryKey;
  name: string;
  icon: string;
  description: string;
  badgeColor: string;
}

export interface EnterpriseReport {
  id: string; // e.g. '3.14.R01'
  key: string; // e.g. 'pnl'
  name: string;
  categoryKey: ReportCategoryKey;
  categoryName: string;
  createdBy: string;
  lastVisited: string;
  schedule: string; // e.g. 'Monthly (1st)', 'Quarterly', 'On-Demand', 'Daily'
  description: string;
  uaeRelevance: string;
  columns: string[];
  mockSummary: Record<string, string | number>;
  sampleRows: Record<string, string | number>[];
  tags: string[];
}
