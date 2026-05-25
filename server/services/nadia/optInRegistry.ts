/**
 * W5-005 — Nadia Opt-In Registry + Compliance Gate
 *
 * Persists opt-in consent records in memory and gates
 * outbound template sends for marketing categories.
 *
 * Rules per Meta WhatsApp Business Policy:
 *  - MARKETING templates MUST have a valid opt-in
 *  - UTILITY and AUTHENTICATION templates are exempt
 *  - Opt-ins can expire (default: 1 year)
 *  - Opt-out is immediate and irrevocable until re-consent
 */

export interface OptInRecord {
  phone: string;
  optedInAt: Date;
  source: string;
  consentText?: string;
  optedOutAt?: Date;
  expiresAt?: Date;
}

/** Default opt-in validity window: 12 months */
const DEFAULT_EXPIRY_MS = 365 * 24 * 60 * 60 * 1000;

export class OptInRegistry {
  private readonly records: Map<string, OptInRecord> = new Map();

  /**
   * Record a new opt-in (or re-consent, overwriting any previous revocation).
   */
  record(
    phone: string,
    source: string,
    consentText?: string,
    expiryMs: number = DEFAULT_EXPIRY_MS
  ): OptInRecord {
    const now = new Date();
    const entry: OptInRecord = {
      phone,
      optedInAt: now,
      source,
      consentText,
      expiresAt: new Date(now.getTime() + expiryMs),
      optedOutAt: undefined,
    };
    this.records.set(phone, entry);
    return entry;
  }

  /**
   * Revoke consent for a phone number.
   * The record is kept for audit purposes but isOptedIn() returns false.
   */
  revoke(phone: string): void {
    const existing = this.records.get(phone);
    if (existing) {
      this.records.set(phone, { ...existing, optedOutAt: new Date() });
    }
  }

  /**
   * Returns true only if the phone has a valid, non-expired, non-revoked opt-in.
   */
  isOptedIn(phone: string): boolean {
    const record = this.records.get(phone);
    if (!record) return false;
    if (record.optedOutAt) return false;
    if (record.expiresAt && record.expiresAt < new Date()) return false;
    return true;
  }

  /**
   * Retrieve the raw record for a phone (for audit/support).
   */
  getRecord(phone: string): OptInRecord | undefined {
    return this.records.get(phone);
  }

  /**
   * List all opt-in records (active and revoked).
   */
  getAll(): OptInRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Count currently active (non-revoked, non-expired) opt-ins.
   */
  countActive(): number {
    let count = 0;
    for (const record of this.records.values()) {
      if (!record.optedOutAt) {
        if (!record.expiresAt || record.expiresAt >= new Date()) {
          count++;
        }
      }
    }
    return count;
  }
}

/**
 * Returns true when the template category requires a valid opt-in before sending.
 * MARKETING always requires opt-in; UTILITY and AUTHENTICATION are exempt.
 */
export function requiresOptIn(templateCategory: string): boolean {
  return templateCategory === 'MARKETING';
}

/**
 * Module-level singleton used by Nadia routes.
 */
export const optInRegistry = new OptInRegistry();
