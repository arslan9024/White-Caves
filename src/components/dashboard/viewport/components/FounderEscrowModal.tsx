/**
 * FounderEscrowModal.tsx
 * Statutory Dubai Law No. 8 Escrow Trust Accounts breakdown & goAML Compliance Desk Modal.
 */

import React, { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ESCROW_ACCOUNTS_DATA, EscrowAccountItem } from '../FounderExecutiveDashboard.data';

export interface FounderEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FounderEscrowModal: FC<FounderEscrowModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '600px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                padding: '1.25rem 1.5rem',
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ background: '#059669', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  Statutory CBUAE & DLD Ledger
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.15rem', fontWeight: 800 }}>
                  Law No. 8 Escrow & goAML Compliance Desk
                </h3>
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

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Project Escrow Accounts */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>
                  🏦 Active Law No. 8 Escrow Trust Accounts (AED 842.5M Total)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ESCROW_ACCOUNTS_DATA.map((acc: EscrowAccountItem) => (
                    <div
                      key={acc.id}
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>{acc.project}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{acc.accountDetails}</div>
                      </div>
                      <span style={{ fontWeight: 900, color: '#059669', fontSize: '0.95rem' }}>
                        {acc.amountFormatted}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* goAML Status */}
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '12px 14px', fontSize: '0.78rem', color: '#065F46' }}>
                <div style={{ fontWeight: 800, marginBottom: '4px' }}>⚖️ Statutory goAML Verification (Threshold: ≥ AED 55,000)</div>
                <div>All cash and cryptocurrency-linked transactions above AED 55,000 are automatically screened against CBUAE FIU / goAML blacklists with 0 open compliance flags.</div>
              </div>

              {/* VAT 5% Status */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px', fontSize: '0.78rem', color: '#334155' }}>
                <div style={{ fontWeight: 800, marginBottom: '4px' }}>📑 FTA Form 201 VAT & Corporate Tax</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Q2 2026 VAT 5% Output Tax Filed:</span>
                  <strong style={{ color: '#0F172A' }}>AED 2,270,000</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span>Corporate Tax 9% Small Business Relief:</span>
                  <strong style={{ color: '#059669' }}>Applied (Compliant)</strong>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FounderEscrowModal;
