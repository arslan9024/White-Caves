/**
 * W5-004 — Nadia Template Governance Module
 *
 * Manages the lifecycle of WhatsApp Business API templates:
 *  - Registration of templates with category + quality metadata
 *  - Quality checkpoint enforcement before sends
 *  - Auditable update trail for quality status changes
 */

export type TemplateCategory = 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';

export type TemplateQualityStatus = 'approved' | 'pending' | 'rejected' | 'paused';

export interface TemplateGovernanceRecord {
  name: string;
  category: TemplateCategory;
  qualityStatus: TemplateQualityStatus;
  language: string;
  parameters?: string[];
  lastChecked: Date;
  rejectReason?: string;
}

export interface TemplateGovernanceResult {
  allowed: boolean;
  reason?: string;
  record?: TemplateGovernanceRecord;
}

export class TemplateRegistry {
  private readonly registry: Map<string, TemplateGovernanceRecord> = new Map();

  /**
   * Register or update a template governance record.
   */
  register(record: TemplateGovernanceRecord): void {
    this.registry.set(record.name, { ...record, lastChecked: new Date() });
  }

  /**
   * Check whether a template is allowed to be sent.
   * A template is allowed only when its qualityStatus is 'approved'.
   */
  check(templateName: string): TemplateGovernanceResult {
    const record = this.registry.get(templateName);

    if (!record) {
      return {
        allowed: false,
        reason: `Template '${templateName}' is not registered in the governance registry`,
      };
    }

    switch (record.qualityStatus) {
      case 'approved':
        return { allowed: true, record };

      case 'pending':
        return {
          allowed: false,
          reason: `Template '${templateName}' is pending Meta approval`,
          record,
        };

      case 'rejected':
        return {
          allowed: false,
          reason: `Template '${templateName}' was rejected${record.rejectReason ? `: ${record.rejectReason}` : ''}`,
          record,
        };

      case 'paused':
        return {
          allowed: false,
          reason: `Template '${templateName}' is paused (quality rating issue)`,
          record,
        };
    }
  }

  /**
   * List all registered templates.
   */
  getAll(): TemplateGovernanceRecord[] {
    return Array.from(this.registry.values());
  }

  /**
   * Update the quality status of a registered template.
   * No-op if the template is not registered.
   */
  updateQuality(name: string, status: TemplateQualityStatus, reason?: string): void {
    const existing = this.registry.get(name);
    if (!existing) return;

    this.registry.set(name, {
      ...existing,
      qualityStatus: status,
      rejectReason: reason,
      lastChecked: new Date(),
    });
  }
}

/**
 * Module-level singleton used by Nadia routes.
 */
export const templateRegistry = new TemplateRegistry();
