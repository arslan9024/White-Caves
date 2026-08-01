import React, { FC, useState } from 'react';
import { FileText, Clock, AlertCircle, CheckCircle2, ChevronRight, UserCheck } from 'lucide-react';

export interface NOCPipelineItem {
  id: string;
  developer: 'EMAAR' | 'DAMAC' | 'NAKHEEL' | 'SOBHA' | 'MERAAS';
  unitCode: string;
  sellerName: string;
  buyerName: string;
  submissionDate: string; // YYYY-MM-DD
  daysElapsed: number;
  maxGraceDays: number; // 5 days standard
  status: 'SUBMITTED' | 'IN_REVIEW' | 'ESCALATED_TO_MANAGER' | 'NOC_ISSUED';
}

const MOCK_NOC_DATA: NOCPipelineItem[] = [
  {
    id: 'NOC-2026-001',
    developer: 'DAMAC',
    unitCode: 'DAMAC-DH2-V84',
    sellerName: 'Hamdan Al-Falasi',
    buyerName: 'Arthur Pendelton',
    submissionDate: '2026-07-26',
    daysElapsed: 6,
    maxGraceDays: 5,
    status: 'ESCALATED_TO_MANAGER',
  },
  {
    id: 'NOC-2026-002',
    developer: 'EMAAR',
    unitCode: 'DOWNTOWN-BURJ-108',
    sellerName: 'Sarah Jenkins',
    buyerName: 'Mohamed Rashid',
    submissionDate: '2026-07-29',
    daysElapsed: 3,
    maxGraceDays: 5,
    status: 'IN_REVIEW',
  },
  {
    id: 'NOC-2026-003',
    developer: 'NAKHEEL',
    unitCode: 'PALM-VILLA-K14',
    sellerName: 'Vikram Malhotra',
    buyerName: 'Jean-Luc Picard',
    submissionDate: '2026-07-25',
    daysElapsed: 4,
    maxGraceDays: 5,
    status: 'NOC_ISSUED',
  },
];

export const NOCExpressPipeline: FC = () => {
  const [nocItems, setNocItems] = useState<NOCPipelineItem[]>(MOCK_NOC_DATA);

  const handleEscalate = (id: string) => {
    setNocItems(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'ESCALATED_TO_MANAGER' } : item))
    );
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--wc-bg-card, #FFFFFF)',
        border: '1px solid var(--wc-border-light, #E2E8F0)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
      }}
      data-testid="noc-express-pipeline"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--wc-text-primary, #1E293B)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--wc-red-primary, #EF4444)" />
            NOC Express Developer Conveyancing Pipeline
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)', margin: '4px 0 0 0' }}>
            Automated tracking of Developer No Objection Certificates (Emaar, DAMAC, Nakheel) with 5-day grace escalation.
          </p>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '20px', backgroundColor: 'var(--wc-bg-subtle, #F1F5F9)', color: 'var(--wc-text-primary, #334155)' }}>
          {nocItems.length} Active Developer Applications
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {nocItems.map(item => {
          const isOverdue = item.daysElapsed > item.maxGraceDays && item.status !== 'NOC_ISSUED';
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--wc-border-light, #E2E8F0)',
                borderLeft: `4px solid ${isOverdue ? 'var(--wc-red-primary, #EF4444)' : item.status === 'NOC_ISSUED' ? 'var(--wc-success, #16A34A)' : 'var(--wc-info, #3B82F6)'}`,
                backgroundColor: 'var(--wc-bg-subtle, #F8FAFC)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '800', fontSize: '12px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--wc-text-primary, #1E293B)', color: 'var(--wc-text-inverse, #FFFFFF)' }}>{item.developer}</span>
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--wc-text-primary, #1E293B)' }}>{item.unitCode}</span>
                  <span style={{ fontSize: '11px', color: 'var(--wc-text-secondary, #64748B)' }}>Ref: {item.id}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)' }}>
                  <span>Seller: <strong>{item.sellerName}</strong></span>
                  <span>Buyer: <strong>{item.buyerName}</strong></span>
                  <span>Submitted: <strong>{item.submissionDate} ({item.daysElapsed} days)</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {isOverdue && item.status !== 'ESCALATED_TO_MANAGER' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 'bold', color: 'var(--wc-red-primary, #EF4444)' }}>
                    <AlertCircle size={14} />
                    Grace Exceeded (5 Days)
                  </div>
                )}

                {item.status === 'NOC_ISSUED' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 'bold', color: 'var(--wc-success, #16A34A)', backgroundColor: 'var(--wc-success-bg, #DCFCE7)', padding: '8px 12px', borderRadius: '6px' }}>
                    <CheckCircle2 size={14} />
                    NOC Issued & Signed
                  </div>
                ) : item.status === 'ESCALATED_TO_MANAGER' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 'bold', color: 'var(--wc-red-primary, #EF4444)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px' }}>
                    <UserCheck size={14} />
                    Escalated to Manager (@Sophia)
                  </div>
                ) : (
                  <button
                    onClick={() => handleEscalate(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: 'var(--wc-text-primary, #1E293B)',
                      color: 'var(--wc-text-inverse, #FFFFFF)',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Escalate to Manager
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NOCExpressPipeline;
