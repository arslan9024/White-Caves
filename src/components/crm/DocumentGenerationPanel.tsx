import React, { FC, useState, useCallback } from 'react';
import { mockProperties, mockLeads, mockLeasingTransactions } from '../../mocks/dubaiRealEstateMocks';

const RED = '#EF4444';
const WHITE = '#FFFFFF';
const SLATE = '#1E293B';
const BORDER = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';
const TEXT_MUTED = '#64748B';
const GREEN = '#10B981';

interface DocTemplate {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: string;
  fields: { label: string; key: string; defaultValue: string }[];
}

const DOCUMENT_TEMPLATES: DocTemplate[] = [
  {
    id: 'tenancy_contract',
    icon: '📋',
    title: 'Tenancy Contract (Ejari)',
    description: 'RERA-approved residential tenancy agreement with Ejari registration data',
    type: 'TENANCY_CONTRACT',
    fields: [
      { label: 'Tenant Name', key: 'tenantName', defaultValue: '' },
      { label: 'Landlord Name', key: 'landlordName', defaultValue: '' },
      { label: 'Property Address', key: 'propertyAddress', defaultValue: '' },
      { label: 'Monthly Rent (AED)', key: 'monthlyRent', defaultValue: '' },
      { label: 'Lease Start Date', key: 'leaseStart', defaultValue: '' },
      { label: 'Lease End Date', key: 'leaseEnd', defaultValue: '' },
    ]
  },
  {
    id: 'mou_sale',
    icon: '🤝',
    title: 'MOU / Sale Agreement (Form F)',
    description: 'Memorandum of Understanding for property sale transactions — DLD Form F compliant',
    type: 'MOU_SALE',
    fields: [
      { label: 'Buyer Full Name', key: 'buyerName', defaultValue: '' },
      { label: 'Seller Full Name', key: 'sellerName', defaultValue: '' },
      { label: 'Property Reference', key: 'propertyRef', defaultValue: '' },
      { label: 'Sale Price (AED)', key: 'salePrice', defaultValue: '' },
      { label: 'Deposit Amount (AED)', key: 'depositAmount', defaultValue: '' },
      { label: 'Completion Date', key: 'completionDate', defaultValue: '' },
    ]
  },
  {
    id: 'noc_letter',
    icon: '✅',
    title: 'NOC Letter — RERA Authority',
    description: 'No Objection Certificate for property sub-leasing, alterations, or ownership transfer',
    type: 'NOC',
    fields: [
      { label: 'Applicant Name', key: 'applicantName', defaultValue: '' },
      { label: 'Property ID', key: 'propertyId', defaultValue: '' },
      { label: 'NOC Purpose', key: 'nocPurpose', defaultValue: 'Sub-lease of residential unit' },
      { label: 'Landlord Name', key: 'landlordName', defaultValue: '' },
    ]
  },
  {
    id: 'commission_statement',
    icon: '💰',
    title: 'Agent Commission Statement',
    description: 'Itemized commission invoice with split breakdown, deal references, and VAT 5% section',
    type: 'COMMISSION_STATEMENT',
    fields: [
      { label: 'Agent Name', key: 'agentName', defaultValue: '' },
      { label: 'Deal Reference', key: 'dealReference', defaultValue: '' },
      { label: 'Transaction Value (AED)', key: 'transactionValue', defaultValue: '' },
      { label: 'Commission Rate (%)', key: 'commissionRate', defaultValue: '2' },
      { label: 'Agent Split (%)', key: 'agentSplit', defaultValue: '70' },
      { label: 'Pay Period', key: 'payPeriod', defaultValue: '' },
    ]
  },
  {
    id: 'pdc_schedule',
    icon: '🏦',
    title: 'Post-Dated Cheque (PDC) Schedule',
    description: 'Structured PDC issuance schedule for annual/quarterly rent payments',
    type: 'PDC_SCHEDULE',
    fields: [
      { label: 'Tenant Name', key: 'tenantName', defaultValue: '' },
      { label: 'Annual Rent (AED)', key: 'annualRent', defaultValue: '' },
      { label: 'No. of Cheques', key: 'noOfCheques', defaultValue: '4' },
      { label: 'Bank Name', key: 'bankName', defaultValue: '' },
      { label: 'First Cheque Date', key: 'firstChequeDate', defaultValue: '' },
    ]
  },
  {
    id: 'rera_form7',
    icon: '📜',
    title: 'RERA Form 7 — Eviction Notice',
    description: 'Legally-compliant Form 7 eviction / non-renewal notice as per Dubai Tenancy Law',
    type: 'RERA_FORM7',
    fields: [
      { label: 'Landlord Name', key: 'landlordName', defaultValue: '' },
      { label: 'Tenant Name', key: 'tenantName', defaultValue: '' },
      { label: 'Property Address', key: 'propertyAddress', defaultValue: '' },
      { label: 'Notice Reason', key: 'noticeReason', defaultValue: 'Non-renewal of tenancy contract' },
      { label: 'Vacate By Date', key: 'vacateByDate', defaultValue: '' },
    ]
  }
];

type GenerationStatus = 'idle' | 'generating' | 'done' | 'error';

interface GeneratedDoc {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  sizeKb: number;
  status: 'ready';
}

export const DocumentGenerationPanel: FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [genStatus, setGenStatus] = useState<GenerationStatus>('idle');
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDoc[]>([
    {
      id: 'doc-001',
      type: 'TENANCY_CONTRACT',
      title: 'Tenancy Contract — Khalid Al Rashidi / Dubai Hills',
      timestamp: '2026-07-27 14:30',
      sizeKb: 142,
      status: 'ready',
    },
    {
      id: 'doc-002',
      type: 'COMMISSION_STATEMENT',
      title: 'Commission Statement — Nadia Yusuf / Q2 2026',
      timestamp: '2026-07-26 09:12',
      sizeKb: 88,
      status: 'ready',
    },
    {
      id: 'doc-003',
      type: 'PDC_SCHEDULE',
      title: 'PDC Schedule — Fatima Al Sayed / 4 Cheques',
      timestamp: '2026-07-25 16:45',
      sizeKb: 65,
      status: 'ready',
    }
  ]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; color: string }>>([]);

  const showToast = useCallback((message: string, color = RED) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, color }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const openTemplate = (template: DocTemplate) => {
    setSelectedTemplate(template);
    const defaults: Record<string, string> = {};
    template.fields.forEach(f => { defaults[f.key] = f.defaultValue; });
    setFormValues(defaults);
    setGenStatus('idle');
  };

  const handleGenerate = () => {
    if (!selectedTemplate) return;
    setGenStatus('generating');
    setTimeout(() => {
      const newDoc: GeneratedDoc = {
        id: `doc-${Date.now()}`,
        type: selectedTemplate.type,
        title: `${selectedTemplate.title} — ${formValues['tenantName'] || formValues['agentName'] || formValues['buyerName'] || formValues['applicantName'] || 'Generated'} / ${new Date().toLocaleDateString('en-GB')}`,
        timestamp: new Date().toLocaleString('en-GB'),
        sizeKb: Math.floor(Math.random() * 120) + 60,
        status: 'ready'
      };
      setGeneratedDocs(prev => [newDoc, ...prev]);
      setGenStatus('done');
    }, 1800);
  };

  const docTypeLabel: Record<string, string> = {
    TENANCY_CONTRACT: 'Tenancy',
    MOU_SALE: 'MOU/Sale',
    NOC: 'NOC',
    COMMISSION_STATEMENT: 'Commission',
    PDC_SCHEDULE: 'PDC',
    RERA_FORM7: 'Form 7',
    ALL: 'All Types',
  };

  const docTypeColor: Record<string, string> = {
    TENANCY_CONTRACT: '#3B82F6',
    MOU_SALE: '#10B981',
    NOC: '#F59E0B',
    COMMISSION_STATEMENT: '#8B5CF6',
    PDC_SCHEDULE: '#EC4899',
    RERA_FORM7: '#EF4444',
  };

  const filteredDocs = generatedDocs.filter(d => {
    const matchType = filterType === 'ALL' || d.type === filterType;
    const matchSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div style={{ background: WHITE, color: SLATE, minHeight: '80vh', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: SLATE }}>
            📄 Document Generation Centre
          </h2>
          <p style={{ margin: '6px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
            RERA-compliant templates for contracts, NOCs, commission statements, and PDC schedules
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ background: 'var(--color-def7ec, #DEF7EC)', color: GREEN, fontWeight: 700, fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px' }}>
            ● {generatedDocs.length} Documents Ready
          </span>
          <span style={{ background: '#FEF2F2', color: RED, fontWeight: 700, fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px' }}>
            VAT 5% Auto-Calculated
          </span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '0', borderBottom: `2px solid ${BORDER}`, marginBottom: '24px' }}>
        {(['generate', 'library'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? `3px solid ${RED}` : '3px solid transparent',
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? RED : TEXT_MUTED,
              fontSize: '0.9rem',
              textTransform: 'capitalize',
              marginBottom: '-2px',
            }}
          >
            {tab === 'generate' ? '✨ Generate New' : '📚 Document Library'}
          </button>
        ))}
      </div>

      {/* GENERATE TAB */}
      {activeTab === 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedTemplate ? '1fr 1.2fr' : '1fr', gap: '24px' }}>
          {/* Template Grid */}
          <div>
            <h3 style={{ color: SLATE, marginTop: 0, fontSize: '1rem', fontWeight: 700 }}>
              Select Document Template
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {DOCUMENT_TEMPLATES.map(template => (
                <div
                  key={template.id}
                  onClick={() => openTemplate(template)}
                  style={{
                    background: selectedTemplate?.id === template.id ? '#FEF2F2' : CARD_BG,
                    border: `2px solid ${selectedTemplate?.id === template.id ? RED : BORDER}`,
                    padding: '16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{template.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: SLATE, marginBottom: '4px' }}>
                    {template.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: TEXT_MUTED, lineHeight: 1.4 }}>
                    {template.description}
                  </div>
                  {selectedTemplate?.id === template.id && (
                    <div style={{ marginTop: '8px', fontSize: '0.7rem', fontWeight: 700, color: RED, textTransform: 'uppercase' }}>
                      ● Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Panel */}
          {selectedTemplate && (
            <div style={{ background: CARD_BG, padding: '24px', borderRadius: '12px', border: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem' }}>{selectedTemplate.icon}</span>
                <div>
                  <h3 style={{ margin: 0, color: SLATE, fontSize: '1.1rem' }}>{selectedTemplate.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>Fill in the fields below to generate</span>
                </div>
              </div>

              {/* Auto-fill from transactions */}
              <div style={{ background: 'var(--color-eff6ff, #EFF6FF)', border: '1px solid var(--color-bfdbfe, #BFDBFE)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-blue, #1D4ED8)', fontWeight: 600 }}>⚡ Quick-fill from Active Transactions</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {mockLeasingTransactions.slice(0, 3).map(tx => (
                    <button
                      key={tx.id}
                      onClick={() => {
                        const prop = mockProperties.find(p => p.id === tx.propertyId);
                        setFormValues(prev => ({
                          ...prev,
                          tenantName: tx.tenantName,
                          landlordName: tx.landlordName,
                          agentName: tx.agentAssigned,
                          propertyAddress: prop?.title || tx.propertyId,
                          monthlyRent: '',
                        }));
                      }}
                      style={{ background: WHITE, border: '1px solid #BFDBFE', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', color: '#1D4ED8', fontWeight: 600 }}
                    >
                      {tx.tenantName}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {selectedTemplate.fields.map(field => (
                  <div key={field.key}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: SLATE, display: 'block', marginBottom: '4px' }}>
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={formValues[field.key] || ''}
                      onChange={(e) => setFormValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: `1px solid ${BORDER}`,
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* VAT Preview (for financial docs) */}
              {(selectedTemplate.type === 'COMMISSION_STATEMENT' || selectedTemplate.type === 'MOU_SALE') && (
                <div style={{ background: 'var(--color-fffbeb, #FFFBEB)', border: '1px solid var(--color-fcd34d, #FCD34D)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-92400e, #92400E)' }}>🧮 VAT 5% Preview (Auto-calculated)</div>
                  {formValues.transactionValue || formValues.salePrice ? (
                    <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--color-78350f, #78350F)' }}>
                      Subtotal: AED {Number(formValues.transactionValue || formValues.salePrice || 0).toLocaleString()}<br />
                      VAT (5%): AED {(Number(formValues.transactionValue || formValues.salePrice || 0) * 0.05).toLocaleString()}<br />
                      <strong>Total: AED {(Number(formValues.transactionValue || formValues.salePrice || 0) * 1.05).toLocaleString()}</strong>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: TEXT_MUTED, marginTop: '4px' }}>Enter transaction value to see VAT breakdown</div>
                  )}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={genStatus === 'generating'}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: genStatus === 'generating' ? TEXT_MUTED : RED,
                  color: WHITE,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: genStatus === 'generating' ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {genStatus === 'generating' ? (
                  <>⏳ Generating PDF...</>
                ) : genStatus === 'done' ? (
                  <>✅ Document Ready — Generate Another</>
                ) : (
                  <>📥 Generate Document PDF</>
                )}
              </button>

              {genStatus === 'done' && (
                <div style={{ background: 'var(--color-def7ec, #DEF7EC)', border: '1px solid var(--color-6ee7b7, #6EE7B7)', padding: '12px', borderRadius: '8px', marginTop: '12px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-065f46, #065F46)', fontSize: '0.875rem' }}>
                    ✅ Document generated successfully! View it in Document Library.
                  </div>
                  <button
                    onClick={() => setActiveTab('library')}
                    style={{ marginTop: '8px', background: '#065F46', color: WHITE, border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    Open Library →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* LIBRARY TAB */}
      {activeTab === 'library' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.875rem', minWidth: '220px' }}
            />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['ALL', 'TENANCY_CONTRACT', 'COMMISSION_STATEMENT', 'PDC_SCHEDULE', 'MOU_SALE', 'NOC', 'RERA_FORM7'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    background: filterType === type ? (docTypeColor[type] || RED) : WHITE,
                    color: filterType === type ? WHITE : SLATE,
                    border: `1px solid ${filterType === type ? (docTypeColor[type] || RED) : BORDER}`,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.15s',
                  }}
                >
                  {docTypeLabel[type] || type}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total Documents', value: generatedDocs.length, color: SLATE },
              { label: 'Contracts & Leases', value: generatedDocs.filter(d => d.type === 'TENANCY_CONTRACT' || d.type === 'MOU_SALE').length, color: '#3B82F6' },
              { label: 'Commission Statements', value: generatedDocs.filter(d => d.type === 'COMMISSION_STATEMENT').length, color: '#8B5CF6' },
              { label: 'PDC Schedules', value: generatedDocs.filter(d => d.type === 'PDC_SCHEDULE').length, color: '#EC4899' },
            ].map(stat => (
              <div key={stat.label} style={{ background: CARD_BG, padding: '14px', borderRadius: '8px', borderLeft: `4px solid ${stat.color}` }}>
                <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>{stat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color, marginTop: '4px' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Document Table */}
          <div style={{ background: WHITE, borderRadius: '10px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: SLATE, color: WHITE }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700 }}>DOCUMENT TITLE</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700 }}>TYPE</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700 }}>GENERATED</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700 }}>SIZE</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: TEXT_MUTED }}>
                      No documents found. Generate a new one from the Generate tab.
                    </td>
                  </tr>
                ) : filteredDocs.map((doc, idx) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? WHITE : CARD_BG }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: SLATE }}>{doc.title}</div>
                      <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, fontFamily: 'monospace', marginTop: '2px' }}>{doc.id}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: `${docTypeColor[doc.type] || RED}20`,
                        color: docTypeColor[doc.type] || RED,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}>
                        {docTypeLabel[doc.type] || doc.type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: TEXT_MUTED }}>{doc.timestamp}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: TEXT_MUTED }}>{doc.sizeKb} KB</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          style={{ background: '#0284C7', color: WHITE, border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          👁️ Preview
                        </button>
                        <button
                          onClick={() => showToast(`⬇ Downloading ${doc.title}.pdf...`, RED)}
                          style={{ background: RED, color: WHITE, border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          ⬇ PDF
                        </button>
                        <button
                          onClick={() => showToast(`📤 Sending ${doc.title} via WhatsApp / Email...`, SLATE)}
                          style={{ background: SLATE, color: WHITE, border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          📤 Send
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RERA Live PDF Contract Previewer Modal */}
      {previewDoc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: WHITE, width: '90%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', border: `2px solid ${RED}`, padding: '28px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--text-secondary, #E2E8F0)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ background: '#FEE2E2', color: RED, padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>RERA OFFICIAL PREVIEW</span>
                <h3 style={{ margin: '4px 0 0 0', color: SLATE, fontSize: '1.25rem' }}>{previewDoc.title}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED, fontSize: '1.4rem' }}>✕</button>
            </div>

            <div style={{ background: 'var(--color-fafafa, #FAFAFA)', border: '1px solid var(--text-secondary, #CBD5E1)', padding: '24px', borderRadius: '8px', fontFamily: 'Georgia, serif', color: 'var(--color-334155, #334155)' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px double var(--color-94a3b8, #94A3B8)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: SLATE, textTransform: 'uppercase', letterSpacing: '1px' }}>WHITE CAVES REAL ESTATE LLC</div>
                <div style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>ORN: 29481 | RERA Licensed Brokerage | Dubai, UAE</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: RED, marginTop: '8px', textTransform: 'uppercase' }}>OFFICIAL CONTRACT DOCUMENT PREVIEW</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', marginBottom: '16px' }}>
                <div><strong>Document Reference:</strong> {previewDoc.id}</div>
                <div><strong>Generated Date:</strong> {previewDoc.timestamp}</div>
                <div><strong>Document Type:</strong> {docTypeLabel[previewDoc.type] || previewDoc.type}</div>
                <div><strong>Digital Signature:</strong> Verified (SHA-256)</div>
              </div>

              <div style={{ background: WHITE, border: '1px solid #E2E8F0', padding: '16px', borderRadius: '6px', fontSize: '0.8rem', lineHeight: '1.6' }}>
                <p>This document constitutes a binding agreement executed under Dubai Land Department (DLD) and Real Estate Regulatory Agency (RERA) regulations.</p>
                <p>All clauses contained herein comply with Dubai Law No. 26 of 2007 (as amended by Law No. 33 of 2008) governing relationships between Landlords and Tenants in the Emirate of Dubai.</p>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px dashed var(--text-secondary, #CBD5E1)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: TEXT_MUTED }}>STAMP & DIGITAL SEAL</div>
                  <div style={{ display: 'inline-block', border: `2px solid ${RED}`, color: RED, padding: '6px 12px', borderRadius: '50%', fontWeight: 900, fontSize: '0.75rem', transform: 'rotate(-5deg)', marginTop: '4px' }}>
                    WHITE CAVES<br/>SEALED
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>QR CODE VERIFICATION</div>
                  <div style={{ background: SLATE, color: WHITE, padding: '6px 10px', borderRadius: '4px', fontSize: '0.7rem', fontFamily: 'monospace' }}>
                    [QR: RERA-{previewDoc.id}]
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => showToast(`🖨️ Printing official PDF for ${previewDoc.title}...`, RED)} style={{ background: RED, color: WHITE, border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                🖨️ Print / Download PDF
              </button>
              <button onClick={() => setPreviewDoc(null)} style={{ background: SLATE, color: WHITE, border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
      {toasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div key={t.id} style={{ background: t.color, color: WHITE, padding: '12px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', maxWidth: '360px' }}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentGenerationPanel;
