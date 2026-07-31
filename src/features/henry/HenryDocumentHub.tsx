/**
 * Henry Document Hub — Frontend Module
 *
 * AI assistant WC-AI-003 "The Record Keeper" integrated into the White Caves CRM.
 *
 * This module provides:
 * - Document generation for 9 luxury PDF templates (Tenancy Contract, Booking Form,
 *   Addendum, Viewing Agreement, Key Handover, Offer Letter, Invoice,
 *   Salary Certificate, Government Employee Booking)
 * - Real-time RERA/DLD compliance checking (25 rules across 7 template groups)
 * - AI-assisted field extraction from PDF/image uploads via server-side Groq/Ollama
 * - Emirates ID OCR
 * - Document archive (persisted to server via /api/henry/records)
 *
 * Design: Client-side PDF rendering via @react-pdf/renderer (if available),
 * server-side record persistence. No localStorage dependency.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../utils/authFetch';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DocumentTemplate {
  key: string;
  label: string;
  icon: string;
  description: string;
  fields: TemplateField[];
}

export interface TemplateField {
  name: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select' | 'textarea' | 'boolean';
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select
}

export interface ComplianceResult {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  passed: boolean;
  uaeLawReference?: string;
}

export interface ComplianceReport {
  templateKey: string;
  passedCount: number;
  warningCount: number;
  errorCount: number;
  totalRules: number;
  isCompliant: boolean;
  results: ComplianceResult[];
  evaluatedAt: string;
}

export interface HenryRecord {
  id: string;
  templateKey: string;
  templateLabel: string;
  fileName: string;
  recordPath: string;
  departmentTag?: string;
  ownerUserId?: string;
  ownerUserEmail?: string;
  unit?: string;
  community?: string;
  tenantName?: string;
  isDraft: boolean;
  status?: 'draft' | 'pending_signature' | 'signed' | 'archived';
  signedAt?: string;
  archivedAt?: string;
  copyNumber: number;
  createdAt: string;
}

// ─── Template Registry ──────────────────────────────────────────────────────

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    key: 'tenancy_contract',
    label: 'Tenancy Contract',
    icon: '📋',
    description: 'DLD Ejari-compliant tenancy agreement (Law 26/2007)',
    fields: [
      { name: 'landlordName', label: 'Landlord Full Name', type: 'text', required: true },
      { name: 'tenantName', label: 'Tenant Full Name', type: 'text', required: true },
      { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
      { name: 'unitNumber', label: 'Unit Number', type: 'text', required: false },
      { name: 'annualRent', label: 'Annual Rent (AED)', type: 'number', required: true },
      { name: 'securityDeposit', label: 'Security Deposit (AED)', type: 'number', required: false },
      { name: 'leaseStartDate', label: 'Lease Start Date', type: 'date', required: true },
      { name: 'leaseEndDate', label: 'Lease End Date', type: 'date', required: true },
      { name: 'numberOfCheques', label: 'Number of PDC Cheques', type: 'number', required: false },
      {
        name: 'tenantEmiratesId',
        label: 'Tenant Emirates ID',
        type: 'text',
        required: false,
        placeholder: '784-YYYY-XXXXXXX-D',
      },
      {
        name: 'ejariAcknowledged',
        label: 'Ejari Registration Acknowledged',
        type: 'boolean',
        required: true,
      },
    ],
  },
  {
    key: 'booking_form',
    label: 'Booking Form / MOU',
    icon: '🏠',
    description: 'Property purchase Memorandum of Understanding',
    fields: [
      { name: 'sellerName', label: 'Seller Full Name', type: 'text', required: true },
      { name: 'buyerName', label: 'Buyer Full Name', type: 'text', required: true },
      { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
      { name: 'purchasePrice', label: 'Purchase Price (AED)', type: 'number', required: true },
      { name: 'titleDeedNumber', label: 'Title Deed Number', type: 'text', required: false },
      { name: 'buyerPhone', label: 'Buyer Phone Number', type: 'text', required: true },
      {
        name: 'buyerEmiratesId',
        label: 'Buyer Emirates ID',
        type: 'text',
        required: false,
        placeholder: '784-YYYY-XXXXXXX-D',
      },
      { name: 'agreementDate', label: 'Agreement Date', type: 'date', required: true },
    ],
  },
  {
    key: 'addendum',
    label: 'Addendum',
    icon: '📝',
    description: 'Lease addendum / rent increase notice (Decree 43/2013)',
    fields: [
      { name: 'landlordName', label: 'Landlord Full Name', type: 'text', required: true },
      { name: 'tenantName', label: 'Tenant Full Name', type: 'text', required: true },
      { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
      {
        name: 'originalContractRef',
        label: 'Original Contract Number',
        type: 'text',
        required: true,
      },
      { name: 'documentDate', label: 'Addendum Date', type: 'date', required: true },
      {
        name: 'rentIncreasePercent',
        label: 'Rent Increase %',
        type: 'number',
        required: false,
        placeholder: 'Max 20% per Decree 43/2013',
      },
      { name: 'leaseEndDate', label: 'Existing Lease End Date', type: 'date', required: false },
      {
        name: 'noticeDate',
        label: 'Notice Date (must be 90+ days before expiry)',
        type: 'date',
        required: false,
      },
    ],
  },
  {
    key: 'offer_letter',
    label: 'Offer Letter',
    icon: '💌',
    description: 'Formal offer letter for purchase or rental',
    fields: [
      { name: 'landlordName', label: 'Landlord / Seller Name', type: 'text', required: true },
      { name: 'tenantName', label: 'Tenant / Buyer Name', type: 'text', required: true },
      { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
      { name: 'offerAmount', label: 'Offer Amount (AED)', type: 'number', required: true },
      { name: 'offerValidUntil', label: 'Offer Valid Until', type: 'date', required: false },
      { name: 'documentDate', label: 'Offer Date', type: 'date', required: true },
    ],
  },
  {
    key: 'key_handover',
    label: 'Key Handover',
    icon: '🔑',
    description: 'Property key handover record',
    fields: [
      { name: 'landlordName', label: 'Landlord / Owner Name', type: 'text', required: true },
      { name: 'tenantName', label: 'Recipient Name', type: 'text', required: true },
      { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
      { name: 'handoverDate', label: 'Handover Date', type: 'date', required: true },
      { name: 'dewaStatus', label: 'DEWA Status', type: 'text', required: false },
      { name: 'dewaMeterNumber', label: 'DEWA Meter Number', type: 'text', required: false },
    ],
  },
  {
    key: 'invoice',
    label: 'Commission Invoice',
    icon: '🧾',
    description: 'Agent commission invoice with UAE VAT compliance',
    fields: [
      { name: 'landlordName', label: 'Client Name', type: 'text', required: true },
      { name: 'tenantName', label: 'Invoice To', type: 'text', required: true },
      { name: 'propertyAddress', label: 'Property Reference', type: 'text', required: true },
      { name: 'amount', label: 'Net Amount (AED)', type: 'number', required: true },
      {
        name: 'trnNumber',
        label: 'TRN Number',
        type: 'text',
        required: false,
        placeholder: 'Tax Registration Number',
      },
      { name: 'vatApplicable', label: 'VAT Applicable (5%)', type: 'boolean', required: false },
      { name: 'documentDate', label: 'Invoice Date', type: 'date', required: true },
    ],
  },
  {
    key: 'viewing_agreement',
    label: 'Viewing Agreement',
    icon: '👁️',
    description: 'Property viewing agreement and non-disclosure',
    fields: [
      { name: 'landlordName', label: 'Agent / Company Name', type: 'text', required: true },
      { name: 'tenantName', label: 'Visitor Name', type: 'text', required: true },
      { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
      { name: 'documentDate', label: 'Viewing Date', type: 'date', required: true },
    ],
  },
  {
    key: 'salary_certificate',
    label: 'Salary Certificate',
    icon: '💼',
    description: 'WPS/SIF payroll salary certificate',
    fields: [
      { name: 'tenantName', label: 'Employee Name', type: 'text', required: true },
      { name: 'landlordName', label: 'Employer Name', type: 'text', required: true },
      { name: 'propertyAddress', label: 'Employee Address', type: 'text', required: false },
      { name: 'annualRent', label: 'Annual Salary (AED)', type: 'number', required: true },
      { name: 'documentDate', label: 'Issue Date', type: 'date', required: true },
    ],
  },
  {
    key: 'gov_employee_booking',
    label: 'Government Employee Booking',
    icon: '🏛️',
    description: 'Booking form for government employees with special terms',
    fields: [
      { name: 'landlordName', label: 'Landlord / Seller Name', type: 'text', required: true },
      { name: 'tenantName', label: 'Government Employee Name', type: 'text', required: true },
      { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
      {
        name: 'purchasePrice',
        label: 'Purchase / Annual Rent (AED)',
        type: 'number',
        required: true,
      },
      {
        name: 'tenantEmiratesId',
        label: 'Emirates ID',
        type: 'text',
        required: true,
        placeholder: '784-YYYY-XXXXXXX-D',
      },
      { name: 'documentDate', label: 'Date', type: 'date', required: true },
    ],
  },
];

// ─── Henry Document Hub Page Component ─────────────────────────────────────

interface HenryDocumentHubProps {
  role?: string;
}

const HenryDocumentHub: React.FC<HenryDocumentHubProps> = () => {
  const [activeTemplate, setActiveTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [records, setRecords] = useState<HenryRecord[]>([]);
  const [activePanel, setActivePanel] = useState<'editor' | 'compliance' | 'archive'>('editor');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedDepartmentTag, setSelectedDepartmentTag] = useState<
    'sales' | 'leasing' | 'finance' | 'compliance' | 'legal' | 'operations'
  >('legal');
  const [selectedOwnerEmail, setSelectedOwnerEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load archive records on mount
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authFetch('/api/henry/records');
      const json = (await res.json()) as {
        success: boolean;
        data: { records: HenryRecord[] };
        error?: string;
      };
      if (json.success) {
        setRecords(json.data.records);
      }
    } catch (err) {
      console.error('[Henry] Failed to load records:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setActiveTemplate(template);
    setFormData({});
    setComplianceReport(null);
    setError(null);
    setSuccessMessage(null);
    setActivePanel('editor');
  };

  const handleFieldChange = (fieldName: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleCheckCompliance = async () => {
    if (!activeTemplate) return;
    setIsChecking(true);
    setError(null);
    try {
      const res = await authFetch('/api/henry/compliance/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateKey: activeTemplate.key, documentData: formData }),
      });
      const json = (await res.json()) as {
        success: boolean;
        data: ComplianceReport;
        error?: string;
      };
      if (json.success) {
        setComplianceReport(json.data);
        setActivePanel('compliance');
      } else {
        setError(json.error ?? 'Compliance check failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compliance check failed');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveRecord = async () => {
    if (!activeTemplate) return;
    setIsSaving(true);
    setError(null);
    try {
      const fileName = `${activeTemplate.key}_${Date.now()}.pdf`;
      const res = await authFetch('/api/henry/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateKey: activeTemplate.key,
          templateLabel: activeTemplate.label,
          fileName,
          recordPath: '',
          unit: (formData.unitNumber as string) ?? null,
          community: (formData.propertyAddress as string) ?? null,
          tenantName: (formData.tenantName as string) ?? null,
          departmentTag: selectedDepartmentTag,
          ownerUserEmail: selectedOwnerEmail || null,
          isDraft: true,
          status: 'pending_signature',
          documentSnapshot: formData,
        }),
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (json.success) {
        setSuccessMessage('Document saved to archive successfully');
        await loadRecords();
        setActivePanel('archive');
      } else {
        setError(json.error ?? 'Save failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExtractFields = async (text: string) => {
    if (!activeTemplate) return;
    setIsExtracting(true);
    setError(null);
    try {
      const res = await authFetch('/api/henry/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, templateKey: activeTemplate.key }),
      });
      const json = (await res.json()) as {
        success: boolean;
        data: { fields: Record<string, unknown>; confidence: number };
        error?: string;
      };
      if (json.success && json.data.fields) {
        setFormData(prev => ({ ...prev, ...json.data.fields }));
        setSuccessMessage(
          `AI extracted fields with ${Math.round((json.data.confidence ?? 0) * 100)}% confidence`
        );
      } else {
        setError(json.error ?? 'Extraction failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI extraction failed');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      const res = await authFetch(`/api/henry/records/${id}`, { method: 'DELETE' });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (json.success) {
        setRecords(prev => prev.filter(r => r.id !== id));
      } else {
        setError(json.error ?? 'Delete failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleMarkSigned = async (id: string) => {
    setError(null);
    try {
      const res = await authFetch(`/api/henry/records/${id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (json.success) {
        setSuccessMessage('Record marked as signed');
        await loadRecords();
      } else {
        setError(json.error ?? 'Unable to mark record as signed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to mark record as signed');
    }
  };

  return (
    <div
      className="henry-document-hub"
      style={{ display: 'flex', height: '100%', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* ── Left: Template List ── */}
      <aside
        style={{
          width: 220,
          borderRight: '1px solid #2a2a2a',
          overflowY: 'auto',
          background: '#111',
          padding: '12px 0',
        }}
      >
        <div
          style={{
            padding: '8px 16px 16px',
            color: '#C9A84C',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 1,
          }}
        >
          📄 HENRY — DOCUMENT HUB
        </div>
        {DOCUMENT_TEMPLATES.map(t => (
          <button
            key={t.key}
            onClick={() => handleTemplateSelect(t)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '10px 16px',
              background: activeTemplate?.key === t.key ? '#1e1e1e' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTemplate?.key === t.key ? '#C9A84C' : '#ccc',
              borderLeft:
                activeTemplate?.key === t.key ? '3px solid #C9A84C' : '3px solid transparent',
              fontSize: 13,
            }}
          >
            <span style={{ marginRight: 8 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
        <hr style={{ borderColor: 'var(--color-2a2a2a, #2a2a2a)', margin: '12px 16px' }} />
        <button
          onClick={() => setActivePanel('archive')}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '10px 16px',
            background: activePanel === 'archive' && !activeTemplate ? '#1e1e1e' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#aaa',
            fontSize: 13,
          }}
        >
          📁 Archive ({records.length})
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-0f0f0f, #0f0f0f)', padding: 24 }}>
        {/* Header */}
        {activeTemplate && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ color: 'var(--white, #fff)', margin: '0 0 6px', fontSize: 20 }}>
              {activeTemplate.icon} {activeTemplate.label}
            </h2>
            <p style={{ color: 'var(--color-888, #888)', margin: 0, fontSize: 13 }}>{activeTemplate.description}</p>

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {(['editor', 'compliance'] as const).map(panel => (
                <button
                  key={panel}
                  onClick={() => setActivePanel(panel)}
                  style={{
                    padding: '6px 16px',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: activePanel === panel ? '#C9A84C' : '#222',
                    color: activePanel === panel ? '#000' : '#aaa',
                    fontWeight: activePanel === panel ? 700 : 400,
                    fontSize: 13,
                  }}
                >
                  {panel === 'editor' ? '✏️ Editor' : '⚖️ Compliance'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Alert messages */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 6,
              padding: '10px 14px',
              marginBottom: 16,
              color: '#ef4444',
              fontSize: 13,
            }}
          >
            ❌ {error}
          </div>
        )}
        {successMessage && (
          <div
            style={{
              background: '#1a3a1a',
              border: '1px solid #2e7d32',
              borderRadius: 6,
              padding: '10px 14px',
              marginBottom: 16,
              color: '#8f8',
              fontSize: 13,
            }}
          >
            ✅ {successMessage}
          </div>
        )}

        {/* Editor Panel */}
        {activeTemplate && activePanel === 'editor' && (
          <DocumentEditor
            template={activeTemplate}
            formData={formData}
            onFieldChange={handleFieldChange}
            onCheckCompliance={handleCheckCompliance}
            onSaveRecord={handleSaveRecord}
            onExtractFields={handleExtractFields}
            selectedDepartmentTag={selectedDepartmentTag}
            onDepartmentTagChange={setSelectedDepartmentTag}
            selectedOwnerEmail={selectedOwnerEmail}
            onOwnerEmailChange={setSelectedOwnerEmail}
            isChecking={isChecking}
            isSaving={isSaving}
            isExtracting={isExtracting}
          />
        )}

        {/* Compliance Panel */}
        {activePanel === 'compliance' && complianceReport && (
          <CompliancePanel report={complianceReport} />
        )}
        {activePanel === 'compliance' && !complianceReport && activeTemplate && (
          <div style={{ color: 'var(--color-888, #888)', padding: 24, textAlign: 'center' }}>
            Fill in the document fields then click "Check Compliance" to run RERA/DLD validation.
          </div>
        )}

        {/* Archive Panel */}
        {activePanel === 'archive' && (
          <ArchivePanel
            records={records}
            isLoading={isLoading}
            onDelete={handleDeleteRecord}
            onRefresh={loadRecords}
            onMarkSigned={handleMarkSigned}
          />
        )}

        {/* No template selected */}
        {!activeTemplate && activePanel === 'editor' && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-555, #555)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <div style={{ fontSize: 16, color: 'var(--color-888, #888)' }}>
              Select a document template from the left panel
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-555, #555)', marginTop: 8 }}>
              Henry generates RERA/DLD-compliant documents for Dubai real estate transactions
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ─── Sub-components ─────────────────────────────────────────────────────────

interface DocumentEditorProps {
  template: DocumentTemplate;
  formData: Record<string, unknown>;
  onFieldChange: (name: string, value: unknown) => void;
  onCheckCompliance: () => void;
  onSaveRecord: () => void;
  onExtractFields: (text: string) => void;
  selectedDepartmentTag: 'sales' | 'leasing' | 'finance' | 'compliance' | 'legal' | 'operations';
  onDepartmentTagChange: (
    tag: 'sales' | 'leasing' | 'finance' | 'compliance' | 'legal' | 'operations'
  ) => void;
  selectedOwnerEmail: string;
  onOwnerEmailChange: (value: string) => void;
  isChecking: boolean;
  isSaving: boolean;
  isExtracting: boolean;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  template,
  formData,
  onFieldChange,
  onCheckCompliance,
  onSaveRecord,
  onExtractFields,
  selectedDepartmentTag,
  onDepartmentTagChange,
  selectedOwnerEmail,
  onOwnerEmailChange,
  isChecking,
  isSaving,
  isExtracting,
}) => {
  const [pasteText, setPasteText] = useState('');
  const [showPaste, setShowPaste] = useState(false);

  return (
    <div>
      {/* AI Extraction Panel */}
      <div
        style={{
          background: '#1a1a2e',
          border: '1px solid #2a2a4a',
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: showPaste ? 12 : 0,
          }}
        >
          <span style={{ color: 'var(--color-9b8ff5, #9b8ff5)', fontWeight: 600, fontSize: 13 }}>
            🤖 AI Field Extraction
          </span>
          <button
            onClick={() => setShowPaste(p => !p)}
            style={{
              padding: '4px 12px',
              background: '#2a2a4a',
              border: '1px solid #4a4a8a',
              borderRadius: 4,
              color: '#9b8ff5',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {showPaste ? '▲ Hide' : '▼ Paste document text to auto-fill fields'}
          </button>
        </div>
        {showPaste && (
          <div>
            <textarea
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
              rows={4}
              placeholder="Paste document text here to auto-extract fields using AI..."
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #333',
                borderRadius: 4,
                color: '#fff',
                padding: 10,
                fontSize: 13,
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={() => {
                onExtractFields(pasteText);
                setShowPaste(false);
              }}
              disabled={!pasteText.trim() || isExtracting}
              style={{
                marginTop: 8,
                padding: '6px 16px',
                background: '#7C3AED',
                border: 'none',
                borderRadius: 4,
                color: '#fff',
                cursor: 'pointer',
                fontSize: 13,
                opacity: !pasteText.trim() || isExtracting ? 0.5 : 1,
              }}
            >
              {isExtracting ? '⏳ Extracting...' : '✨ Extract Fields'}
            </button>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {template.fields.map(field => (
          <div key={field.name}>
            <label style={{ display: 'block', color: 'var(--color-aaa, #aaa)', fontSize: 12, marginBottom: 4 }}>
              {field.label}
              {field.required && <span style={{ color: 'var(--color-e31e24, #E31E24)' }}> *</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={String(formData[field.name] ?? '')}
                onChange={e => onFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                style={{
                  width: '100%',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: 4,
                  color: '#fff',
                  padding: '8px 10px',
                  fontSize: 13,
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            ) : field.type === 'select' ? (
              <select
                value={String(formData[field.name] ?? '')}
                onChange={e => onFieldChange(field.name, e.target.value)}
                style={{
                  width: '100%',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: 4,
                  color: '#fff',
                  padding: '8px 10px',
                  fontSize: 13,
                }}
              >
                <option value="">Select...</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === 'boolean' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id={field.name}
                  checked={Boolean(formData[field.name])}
                  onChange={e => onFieldChange(field.name, e.target.checked)}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label
                  htmlFor={field.name}
                  style={{ color: 'var(--color-ccc, #ccc)', fontSize: 13, cursor: 'pointer' }}
                >
                  Yes
                </label>
              </div>
            ) : (
              <input
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                value={String(formData[field.name] ?? '')}
                onChange={e =>
                  onFieldChange(
                    field.name,
                    field.type === 'number'
                      ? e.target.value === ''
                        ? ''
                        : isNaN(parseFloat(e.target.value))
                          ? ''
                          : parseFloat(e.target.value)
                      : e.target.value
                  )
                }
                placeholder={field.placeholder}
                style={{
                  width: '100%',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: 4,
                  color: '#fff',
                  padding: '8px 10px',
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
        <div>
          <label style={{ display: 'block', color: 'var(--color-aaa, #aaa)', fontSize: 12, marginBottom: 4 }}>
            Department Tag
          </label>
          <select
            value={selectedDepartmentTag}
            onChange={e =>
              onDepartmentTagChange(
                e.target.value as
                  | 'sales'
                  | 'leasing'
                  | 'finance'
                  | 'compliance'
                  | 'legal'
                  | 'operations'
              )
            }
            style={{
              width: '100%',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 4,
              color: '#fff',
              padding: '8px 10px',
              fontSize: 13,
            }}
          >
            <option value="sales">Sales</option>
            <option value="leasing">Leasing</option>
            <option value="finance">Finance</option>
            <option value="compliance">Compliance</option>
            <option value="legal">Legal</option>
            <option value="operations">Operations</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', color: 'var(--color-aaa, #aaa)', fontSize: 12, marginBottom: 4 }}>
            Owner User Email (optional)
          </label>
          <input
            type="email"
            value={selectedOwnerEmail}
            onChange={e => onOwnerEmailChange(e.target.value)}
            placeholder="owner@whitecaves.ae"
            style={{
              width: '100%',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 4,
              color: '#fff',
              padding: '8px 10px',
              fontSize: 13,
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button
          onClick={onCheckCompliance}
          disabled={isChecking}
          style={{
            padding: '10px 20px',
            background: '#1a3a1a',
            border: '1px solid #2e7d32',
            borderRadius: 6,
            color: '#8f8',
            cursor: 'pointer',
            fontSize: 14,
            opacity: isChecking ? 0.6 : 1,
          }}
        >
          {isChecking ? '⏳ Checking...' : '⚖️ Check RERA/DLD Compliance'}
        </button>
        <button
          onClick={onSaveRecord}
          disabled={isSaving}
          style={{
            padding: '10px 20px',
            background: '#C9A84C',
            border: 'none',
            borderRadius: 6,
            color: '#000',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          {isSaving ? '⏳ Saving...' : '📁 Save to Archive'}
        </button>
      </div>
    </div>
  );
};

interface CompliancePanelProps {
  report: ComplianceReport;
}

const CompliancePanel: React.FC<CompliancePanelProps> = ({ report }) => {
  const severityColor = { error: '#ef4444', warning: '#C9A84C', info: '#C9A84C' };
  const severityIcon = { error: '❌', warning: '⚠️', info: 'ℹ️' };

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Passed', value: report.passedCount, color: '#22c55e' },
          { label: 'Errors', value: report.errorCount, color: '#ef4444' },
          { label: 'Warnings', value: report.warningCount, color: '#f59e0b' },
          { label: 'Total', value: report.totalRules, color: '#aaa' },
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              background: '#1a1a1a',
              borderRadius: 8,
              padding: '12px 20px',
              textAlign: 'center',
              flex: 1,
            }}
          >
            <div style={{ color: stat.color, fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
            <div style={{ color: 'var(--color-888, #888)', fontSize: 12 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Overall status */}
      <div
        style={{
          background: report.isCompliant ? '#1a3a1a' : '#3a1a1a',
          border: `1px solid ${report.isCompliant ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 20,
          fontSize: 14,
          color: report.isCompliant ? '#8f8' : '#f88',
        }}
      >
        {report.isCompliant
          ? '✅ Document is compliant — no blocking errors found'
          : `❌ ${report.errorCount} compliance error(s) must be fixed before this document can be finalised`}
      </div>

      {/* Rule results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {report.results
          .filter(r => !r.passed)
          .map(result => (
            <div
              key={result.ruleId}
              style={{
                background: '#1a1a1a',
                border: `1px solid ${severityColor[result.severity]}30`,
                borderLeft: `3px solid ${severityColor[result.severity]}`,
                borderRadius: 6,
                padding: '10px 14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <span style={{ marginRight: 8 }}>{severityIcon[result.severity]}</span>
                  <strong style={{ color: 'var(--white, #fff)', fontSize: 13 }}>{result.title}</strong>
                  {result.uaeLawReference && (
                    <span style={{ marginLeft: 8, color: 'var(--color-666, #666)', fontSize: 11 }}>
                      ({result.uaeLawReference})
                    </span>
                  )}
                </div>
                <span style={{ color: 'var(--color-666, #666)', fontSize: 11, whiteSpace: 'nowrap', marginLeft: 8 }}>
                  {result.ruleId}
                </span>
              </div>
              <p style={{ color: 'var(--color-aaa, #aaa)', margin: '6px 0 0 24px', fontSize: 12 }}>
                {result.message}
              </p>
            </div>
          ))}
        {report.results
          .filter(r => r.passed)
          .map(result => (
            <div
              key={result.ruleId}
              style={{
                background: '#111',
                border: '1px solid #1a3a1a',
                borderLeft: '3px solid #2e7d32',
                borderRadius: 6,
                padding: '8px 14px',
                opacity: 0.7,
              }}
            >
              <span style={{ marginRight: 8 }}>✅</span>
              <strong style={{ color: 'var(--color-666, #666)', fontSize: 12 }}>{result.title}</strong>
            </div>
          ))}
      </div>
    </div>
  );
};

interface ArchivePanelProps {
  records: HenryRecord[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onMarkSigned: (id: string) => void;
}

const ArchivePanel: React.FC<ArchivePanelProps> = ({
  records,
  isLoading,
  onDelete,
  onRefresh,
  onMarkSigned,
}) => (
  <div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <h3 style={{ color: 'var(--white, #fff)', margin: 0 }}>📁 Document Archive ({records.length})</h3>
      <button
        onClick={onRefresh}
        style={{
          padding: '6px 14px',
          background: '#222',
          border: '1px solid #444',
          borderRadius: 4,
          color: '#aaa',
          cursor: 'pointer',
          fontSize: 12,
        }}
      >
        🔄 Refresh
      </button>
    </div>

    {isLoading ? (
      <div style={{ color: 'var(--color-888, #888)', textAlign: 'center', padding: 40 }}>Loading records...</div>
    ) : records.length === 0 ? (
      <div style={{ color: 'var(--color-555, #555)', textAlign: 'center', padding: 40 }}>
        No archived documents yet. Generate and save a document to start the archive.
      </div>
    ) : (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-333, #333)' }}>
              {[
                'Template',
                'File Name',
                'Department',
                'Owner',
                'Unit',
                'Community',
                'Tenant',
                'Status',
                'Signed At',
                'Created',
                '',
              ].map(h => (
                <th
                  key={h}
                  style={{ color: 'var(--color-888, #888)', fontWeight: 600, padding: '8px 12px', textAlign: 'left' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--color-1a1a1a, #1a1a1a)' }}>
                <td style={{ color: 'var(--color-c9a84c, #C9A84C)', padding: '8px 12px' }}>{r.templateLabel}</td>
                <td
                  style={{
                    color: '#ccc',
                    padding: '8px 12px',
                    maxWidth: 180,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.fileName}
                </td>
                <td style={{ color: 'var(--color-aaa, #aaa)', padding: '8px 12px' }}>{r.departmentTag ?? '—'}</td>
                <td style={{ color: 'var(--color-aaa, #aaa)', padding: '8px 12px' }}>{r.ownerUserEmail ?? '—'}</td>
                <td style={{ color: 'var(--color-aaa, #aaa)', padding: '8px 12px' }}>{r.unit ?? '—'}</td>
                <td style={{ color: 'var(--color-aaa, #aaa)', padding: '8px 12px' }}>{r.community ?? '—'}</td>
                <td style={{ color: 'var(--color-aaa, #aaa)', padding: '8px 12px' }}>{r.tenantName ?? '—'}</td>
                <td style={{ padding: '8px 12px' }}>
                  <span
                    style={{
                      background:
                        (r.status ?? (r.isDraft ? 'draft' : 'signed')) === 'signed'
                          ? '#1a2a1a'
                          : '#2a2a1a',
                      color:
                        (r.status ?? (r.isDraft ? 'draft' : 'signed')) === 'signed'
                          ? '#22c55e'
                          : '#f59e0b',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                    }}
                  >
                    {r.status ?? (r.isDraft ? 'draft' : 'signed')}
                  </span>
                </td>
                <td style={{ color: 'var(--color-666, #666)', padding: '8px 12px', whiteSpace: 'nowrap' }}>
                  {r.signedAt ? new Date(r.signedAt).toLocaleString() : '—'}
                </td>
                <td style={{ color: 'var(--color-666, #666)', padding: '8px 12px', whiteSpace: 'nowrap' }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  {r.status !== 'signed' && (
                    <button
                      onClick={() => onMarkSigned(r.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#22c55e',
                        cursor: 'pointer',
                        fontSize: 14,
                        padding: 2,
                        marginRight: 8,
                      }}
                      title="Mark signed"
                    >
                      ✅
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this record?')) onDelete(r.id);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: 16,
                      padding: 2,
                    }}
                    title="Delete record"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default HenryDocumentHub;
