/**
 * Henry Compliance Engine
 *
 * RERA/DLD document compliance rule catalog ported from
 * `arslan9024/Henry` → `src/compliance/ruleCatalog/`.
 *
 * Provides server-side compliance checking for:
 *   - Tenancy Contracts (Law 26/2007, Decree 43/2013)
 *   - Sales/MOU agreements (DLD transfer rules)
 *   - Addenda and notices (RERA Circular 21-2016, Law 4/2026)
 *   - Ejari registration requirements
 *
 * Used by: POST /api/henry/compliance/check
 * Also consumed by: server/routes/contracts.ts for pre-save validation
 */

// ─── Types ─────────────────────────────────────────────────────────────────

export type Severity = 'error' | 'warning' | 'info';
export type TemplateKey =
  | 'tenancy_contract'
  | 'booking_form'
  | 'addendum'
  | 'viewing_agreement'
  | 'key_handover'
  | 'offer_letter'
  | 'invoice'
  | 'salary_certificate'
  | 'gov_employee_booking';

export interface ComplianceRule {
  ruleId: string;
  templateKeys: TemplateKey[] | 'all'; // Which templates this rule applies to
  severity: Severity;
  title: string;
  message: string;
  uaeLawReference?: string; // e.g., "Law 26/2007 Art. 9"
  check: (data: Record<string, unknown>) => boolean; // Returns true = PASS
}

export interface ComplianceResult {
  ruleId: string;
  severity: Severity;
  title: string;
  message: string;
  passed: boolean;
  uaeLawReference?: string;
}

export interface ComplianceReport {
  templateKey: TemplateKey;
  passedCount: number;
  warningCount: number;
  errorCount: number;
  totalRules: number;
  isCompliant: boolean; // true if no errors
  results: ComplianceResult[];
  evaluatedAt: Date;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function hasValue(data: Record<string, unknown>, key: string): boolean {
  const val = data[key];
  return val !== undefined && val !== null && String(val).trim() !== '';
}

function isValidDate(data: Record<string, unknown>, key: string): boolean {
  const val = data[key];
  if (!val) return false;
  const d = new Date(String(val));
  return !isNaN(d.getTime());
}

function isFutureDate(data: Record<string, unknown>, key: string): boolean {
  const val = data[key];
  if (!val) return false;
  const d = new Date(String(val));
  return !isNaN(d.getTime()) && d > new Date();
}

function isPositiveNumber(data: Record<string, unknown>, key: string): boolean {
  const val = Number(data[key]);
  return !isNaN(val) && val > 0;
}

function isPhoneNumber(data: Record<string, unknown>, key: string): boolean {
  const val = String(data[key] ?? '');
  return /^[\d\s\+\-\(\)]{7,20}$/.test(val);
}

// Emirates ID: 784-YYYY-XXXXXXX-D format
function isValidEmiratesId(data: Record<string, unknown>, key: string): boolean {
  const val = String(data[key] ?? '');
  return /^784-\d{4}-\d{7}-\d$/.test(val);
}

// ─── Rule Catalog ────────────────────────────────────────────────────────────

export const COMPLIANCE_RULES: ComplianceRule[] = [
  // ── Universal rules (all templates) ────────────────────────────────────

  {
    ruleId: 'UC-001',
    templateKeys: 'all',
    severity: 'error',
    title: 'Landlord / Seller Name Required',
    message: 'The landlord or seller full legal name must be present on all real estate documents.',
    uaeLawReference: 'Law 26/2007 Art. 4',
    check: d => hasValue(d, 'landlordName') || hasValue(d, 'sellerName'),
  },
  {
    ruleId: 'UC-002',
    templateKeys: 'all',
    severity: 'error',
    title: 'Tenant / Buyer Name Required',
    message: 'The tenant or buyer full legal name must be present on all real estate documents.',
    uaeLawReference: 'Law 26/2007 Art. 4',
    check: d => hasValue(d, 'tenantName') || hasValue(d, 'buyerName'),
  },
  {
    ruleId: 'UC-003',
    templateKeys: 'all',
    severity: 'error',
    title: 'Property Address Required',
    message: 'The property address or unit number is mandatory on all documents.',
    uaeLawReference: 'RERA Circular 21-2016',
    check: d => hasValue(d, 'propertyAddress') || hasValue(d, 'unitNumber'),
  },
  {
    ruleId: 'UC-004',
    templateKeys: 'all',
    severity: 'warning',
    title: 'Document Date Required',
    message: 'All documents must carry the date of execution.',
    uaeLawReference: 'Law 26/2007 Art. 7',
    check: d => isValidDate(d, 'documentDate') || isValidDate(d, 'agreementDate'),
  },

  // ── Tenancy Contract rules ──────────────────────────────────────────────

  {
    ruleId: 'TC-001',
    templateKeys: ['tenancy_contract'],
    severity: 'error',
    title: 'Lease Start Date Required',
    message: 'The tenancy contract must specify a commencement date.',
    uaeLawReference: 'Law 26/2007 Art. 9',
    check: d => isValidDate(d, 'leaseStartDate') || isValidDate(d, 'startDate'),
  },
  {
    ruleId: 'TC-002',
    templateKeys: ['tenancy_contract'],
    severity: 'error',
    title: 'Lease End Date Required',
    message: 'The tenancy contract must specify an expiry date.',
    uaeLawReference: 'Law 26/2007 Art. 9',
    check: d => isValidDate(d, 'leaseEndDate') || isValidDate(d, 'endDate'),
  },
  {
    ruleId: 'TC-003',
    templateKeys: ['tenancy_contract'],
    severity: 'error',
    title: 'Annual Rent (AED) Required',
    message: 'The annual rent amount in AED must be explicitly stated.',
    uaeLawReference: 'Law 26/2007 Art. 9',
    check: d => isPositiveNumber(d, 'annualRent') || isPositiveNumber(d, 'monthlyRent'),
  },
  {
    ruleId: 'TC-004',
    templateKeys: ['tenancy_contract'],
    severity: 'warning',
    title: 'Security Deposit Amount Recommended',
    message: 'Security deposit (typically 5% annual rent residential, 10% commercial) should be stated.',
    uaeLawReference: 'Law 26/2007 Art. 20',
    check: d => isPositiveNumber(d, 'securityDeposit') || isPositiveNumber(d, 'depositAmount'),
  },
  {
    ruleId: 'TC-005',
    templateKeys: ['tenancy_contract'],
    severity: 'error',
    title: 'Ejari Registration Requirement',
    message: 'All tenancy contracts in Dubai must be registered with Ejari (RERA online registration system).',
    uaeLawReference: 'Law 26/2007 Art. 22',
    check: d =>
      hasValue(d, 'ejariNumber') ||
      String(d['ejariAcknowledged'] ?? '').toLowerCase() === 'true' ||
      d['ejariAcknowledged'] === true,
  },
  {
    ruleId: 'TC-006',
    templateKeys: ['tenancy_contract'],
    severity: 'warning',
    title: 'Tenant Emirates ID Recommended',
    message: 'Tenant\'s Emirates ID number should be recorded for identity verification.',
    uaeLawReference: 'RERA Circular 21-2016',
    check: d => isValidEmiratesId(d, 'tenantEmiratesId') || hasValue(d, 'tenantPassportNumber'),
  },
  {
    ruleId: 'TC-007',
    templateKeys: ['tenancy_contract'],
    severity: 'warning',
    title: 'Number of Cheques (PDC)',
    message: 'The number of post-dated cheques should be specified in the tenancy contract.',
    uaeLawReference: 'Law 26/2007',
    check: d => isPositiveNumber(d, 'numberOfCheques'),
  },
  {
    ruleId: 'TC-008',
    templateKeys: ['tenancy_contract'],
    severity: 'info',
    title: 'RERA Rent Index Reference',
    message: 'Reference to the RERA Rent Index is recommended to validate rent increase calculations.',
    uaeLawReference: 'Decree 43/2013',
    check: d => hasValue(d, 'reraRentIndex') || hasValue(d, 'rentIndexRef'),
  },

  // ── Addendum rules ──────────────────────────────────────────────────────

  {
    ruleId: 'AD-001',
    templateKeys: ['addendum'],
    severity: 'error',
    title: 'Original Contract Reference Required',
    message: 'Addenda must reference the original tenancy contract number or date.',
    uaeLawReference: 'RERA Circular 21-2016',
    check: d => hasValue(d, 'originalContractRef') || hasValue(d, 'originalContractDate'),
  },
  {
    ruleId: 'AD-002',
    templateKeys: ['addendum'],
    severity: 'warning',
    title: 'Rent Increase Capped by Decree 43/2013',
    message: 'For rent increase addenda, the increase must not exceed the RERA rental index cap (0–20% based on market comparison).',
    uaeLawReference: 'Decree 43/2013',
    check: d => {
      if (!d['rentIncreasePercent']) return true; // Not applicable
      const pct = Number(d['rentIncreasePercent']);
      return !isNaN(pct) && pct <= 20;
    },
  },
  {
    ruleId: 'AD-003',
    templateKeys: ['addendum'],
    severity: 'error',
    title: '90-Day Notice for Rent Increase (Form 7)',
    message: 'Rent increase notice must be served at least 90 days before lease expiry (RERA Form 7).',
    uaeLawReference: 'Decree 43/2013 Art. 14',
    check: d => {
      if (!d['noticeDate'] || !d['leaseEndDate']) return true; // Can't check without both
      const notice = new Date(String(d['noticeDate']));
      const leaseEnd = new Date(String(d['leaseEndDate']));
      if (isNaN(notice.getTime()) || isNaN(leaseEnd.getTime())) return true;
      const daysDiff = Math.floor((leaseEnd.getTime() - notice.getTime()) / 86_400_000);
      return daysDiff >= 90;
    },
  },

  // ── Booking Form / MOU rules ────────────────────────────────────────────

  {
    ruleId: 'BF-001',
    templateKeys: ['booking_form'],
    severity: 'error',
    title: 'Purchase Price Required',
    message: 'The agreed sale price in AED must be stated on the booking form.',
    uaeLawReference: 'Law 4/2026',
    check: d => isPositiveNumber(d, 'purchasePrice') || isPositiveNumber(d, 'salePrice'),
  },
  {
    ruleId: 'BF-002',
    templateKeys: ['booking_form'],
    severity: 'error',
    title: 'Buyer Phone Number Required',
    message: 'Buyer\'s contact phone number is mandatory.',
    uaeLawReference: 'DLD Transfer Requirements',
    check: d => isPhoneNumber(d, 'buyerPhone'),
  },
  {
    ruleId: 'BF-003',
    templateKeys: ['booking_form'],
    severity: 'warning',
    title: 'Buyer Emirates ID / Passport Required',
    message: 'For DLD transfer, buyer\'s Emirates ID or passport number must be recorded.',
    uaeLawReference: 'DLD Requirements',
    check: d => isValidEmiratesId(d, 'buyerEmiratesId') || hasValue(d, 'buyerPassportNumber'),
  },
  {
    ruleId: 'BF-004',
    templateKeys: ['booking_form'],
    severity: 'info',
    title: 'Title Deed Number Recommended',
    message: 'Including the current title deed number speeds up the DLD transfer process.',
    uaeLawReference: 'DLD Requirements',
    check: d => hasValue(d, 'titleDeedNumber'),
  },

  // ── Offer Letter rules ──────────────────────────────────────────────────

  {
    ruleId: 'OL-001',
    templateKeys: ['offer_letter'],
    severity: 'error',
    title: 'Offer Amount Required',
    message: 'The offer price in AED must be explicitly stated.',
    check: d => isPositiveNumber(d, 'offerAmount') || isPositiveNumber(d, 'proposedRent'),
  },
  {
    ruleId: 'OL-002',
    templateKeys: ['offer_letter'],
    severity: 'warning',
    title: 'Offer Validity Period Recommended',
    message: 'The offer letter should specify how long the offer remains valid.',
    check: d => isFutureDate(d, 'offerValidUntil') || hasValue(d, 'validityDays'),
  },

  // ── Key Handover rules ──────────────────────────────────────────────────

  {
    ruleId: 'KH-001',
    templateKeys: ['key_handover'],
    severity: 'error',
    title: 'Handover Date Required',
    message: 'The key handover date must be recorded.',
    check: d => isValidDate(d, 'handoverDate'),
  },
  {
    ruleId: 'KH-002',
    templateKeys: ['key_handover'],
    severity: 'warning',
    title: 'DEWA Connection Status Recommended',
    message: 'DEWA connection status and meter reading should be noted at handover.',
    check: d => hasValue(d, 'dewaStatus') || hasValue(d, 'dewaMeterNumber'),
  },

  // ── Invoice rules ───────────────────────────────────────────────────────

  {
    ruleId: 'INV-001',
    templateKeys: ['invoice'],
    severity: 'error',
    title: 'Invoice Amount Required',
    message: 'Invoice must include the net amount.',
    check: d => isPositiveNumber(d, 'amount') || isPositiveNumber(d, 'netAmount'),
  },
  {
    ruleId: 'INV-002',
    templateKeys: ['invoice'],
    severity: 'error',
    title: 'VAT/TRN Compliance (5% on Commercial / Commission)',
    message: 'Commissions and commercial transactions are subject to 5% UAE VAT. TRN must be displayed on the invoice.',
    uaeLawReference: 'UAE VAT Law (Federal Decree 8/2017)',
    check: d => hasValue(d, 'trnNumber') || d['vatApplicable'] === false || d['vatApplicable'] === 'false',
  },
];

// ─── Evaluation engine ───────────────────────────────────────────────────────

/**
 * Evaluate compliance for a document against the applicable rule set.
 *
 * @param templateKey  Which Henry template is being checked
 * @param documentData Key-value map of document fields
 * @returns            ComplianceReport with per-rule pass/fail results
 */
export function evaluateCompliance(
  templateKey: TemplateKey,
  documentData: Record<string, unknown>
): ComplianceReport {
  const applicableRules = COMPLIANCE_RULES.filter(
    r => r.templateKeys === 'all' || r.templateKeys.includes(templateKey)
  );

  const results: ComplianceResult[] = applicableRules.map(rule => {
    let passed = false;
    try {
      passed = rule.check(documentData);
    } catch {
      passed = false; // Treat check errors as failures
    }
    return {
      ruleId: rule.ruleId,
      severity: rule.severity,
      title: rule.title,
      message: rule.message,
      passed,
      uaeLawReference: rule.uaeLawReference,
    };
  });

  const passedCount = results.filter(r => r.passed).length;
  const errorCount = results.filter(r => !r.passed && r.severity === 'error').length;
  const warningCount = results.filter(r => !r.passed && r.severity === 'warning').length;

  return {
    templateKey,
    passedCount,
    warningCount,
    errorCount,
    totalRules: results.length,
    isCompliant: errorCount === 0,
    results,
    evaluatedAt: new Date(),
  };
}

/**
 * Return all rules applicable to a given template (without running checks).
 */
export function getRulesForTemplate(templateKey: TemplateKey): ComplianceRule[] {
  return COMPLIANCE_RULES.filter(
    r => r.templateKeys === 'all' || r.templateKeys.includes(templateKey)
  );
}

/**
 * Return a summary of all available templates and their rule counts.
 */
export function getComplianceSummary(): Record<string, { totalRules: number; errorRules: number; warningRules: number }> {
  const templates: TemplateKey[] = [
    'tenancy_contract', 'booking_form', 'addendum', 'viewing_agreement',
    'key_handover', 'offer_letter', 'invoice', 'salary_certificate', 'gov_employee_booking',
  ];

  const summary: Record<string, { totalRules: number; errorRules: number; warningRules: number }> = {};
  for (const tpl of templates) {
    const rules = getRulesForTemplate(tpl);
    summary[tpl] = {
      totalRules: rules.length,
      errorRules: rules.filter(r => r.severity === 'error').length,
      warningRules: rules.filter(r => r.severity === 'warning').length,
    };
  }
  return summary;
}
