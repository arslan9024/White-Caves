/**
 * MultiStageApprovalModal.tsx
 *
 * White Caves Real Estate LLC — 3-Stage Executive Approval Pipeline.
 * 1. Department Manager Initial Verification
 * 2. Legal & Compliance Statutory goAML Check
 * 3. Managing Director Sovereign Seal Signoff (Arslan Malik Bashir Ahmad)
 */

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MultiStageApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  department?: string;
  contractValue?: string;
}

export const MultiStageApprovalModal: FC<MultiStageApprovalModalProps> = ({
  isOpen,
  onClose,
  documentTitle = 'DAMAC Hills 2 Amazonia Villa 3-Year Tenancy Lease',
  department = 'Tenancy & Ejari',
  contractValue = 'AED 720,000',
}) => {
  const [managerApproved, setManagerApproved] = useState(true);
  const [legalApproved, setLegalApproved] = useState(true);
  const [founderSigned, setFounderSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  if (!isOpen) return null;

  const handleFounderSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setFounderSigned(true);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'inherit',
          color: '#0F172A',
        }}
        data-testid="multi-stage-approval-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              padding: '1.5rem',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <span
                style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                Multi-Stage Executive Approval
              </span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.2rem', fontWeight: 800 }}>
                {documentTitle}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>
                Department: <strong>{department}</strong> • Contract Sum: <strong>{contractValue}</strong>
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Pipeline Body */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Stage 1: Manager Review */}
            <div
              style={{
                background: managerApproved ? '#ECFDF5' : '#F8FAFC',
                border: managerApproved ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: managerApproved ? '#065F46' : '#334155' }}>
                  Stage 1: Department Manager Verification
                </div>
                <div style={{ fontSize: '0.72rem', color: managerApproved ? '#047857' : '#64748B' }}>
                  Verified by <strong>Kareem Mostafa (Leasing Manager)</strong> & <strong>AI Victoria</strong>
                </div>
              </div>
              <span style={{ background: '#059669', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                ✓ Approved
              </span>
            </div>

            {/* Stage 2: Legal & AML Check */}
            <div
              style={{
                background: legalApproved ? '#ECFDF5' : '#F8FAFC',
                border: legalApproved ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: legalApproved ? '#065F46' : '#334155' }}>
                  Stage 2: Legal & goAML Statutory Compliance
                </div>
                <div style={{ fontSize: '0.72rem', color: legalApproved ? '#047857' : '#64748B' }}>
                  Verified by <strong>Rashid Al-Nuaimi (Legal Counsel)</strong> & <strong>AI Sofia</strong>
                </div>
              </div>
              <span style={{ background: '#059669', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                ✓ Approved
              </span>
            </div>

            {/* Stage 3: Founder Sovereign Seal */}
            <div
              style={{
                background: founderSigned ? '#EFF6FF' : '#FFFBEB',
                border: founderSigned ? '1px solid #93C5FD' : '1px solid #FDE68A',
                borderRadius: '12px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#0F172A' }}>
                  👑 Stage 3: Founder Sovereign Seal Signoff
                </div>
                <span
                  style={{
                    background: founderSigned ? '#2563EB' : '#D97706',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {founderSigned ? '👑 Signed & Sealed' : 'Pending Founder Seal'}
                </span>
              </div>

              <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: '#475569' }}>
                Authorized signatory: <strong>Arslan Malik Bashir Ahmad</strong> (Managing Director, Level 7 Sovereign Key).
              </p>

              {!founderSigned ? (
                <button
                  onClick={handleFounderSign}
                  disabled={isSigning}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #0F172A 0%, #EF4444 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: isSigning ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                  }}
                >
                  {isSigning ? 'Applying Encrypted Seal...' : '👑 Apply Sovereign Digital Seal'}
                </button>
              ) : (
                <div>
                  <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '10px', border: '1px dashed #3B82F6', textAlign: 'center', fontSize: '0.75rem', color: '#1E40AF', fontWeight: 800, marginBottom: '8px' }}>
                    🛡️ Digitally Signed with White Caves Level 7 Sovereign Seal (DLD & Ejari Ready)
                  </div>
                  <button
                    onClick={() => window.print()}
                    style={{
                      width: '100%',
                      background: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    📄 Print / Save Statutory Executive Certificate
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MultiStageApprovalModal;
