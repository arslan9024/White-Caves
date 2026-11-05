/**
 * White Caves Real Estate LLC - Deal PDC Schedule Section
 * Standard: AEGIS Canonical 7-Category Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { CreditCard } from 'lucide-react';
import { PdcChequeItem } from './DealManager.types';

interface DealPdcScheduleSectionProps {
  pdcSchedule: PdcChequeItem[];
}

export const DealPdcScheduleSection: FC<DealPdcScheduleSectionProps> = ({ pdcSchedule }) => {
  if (!pdcSchedule || pdcSchedule.length === 0) return null;

  return (
    <div>
      <h4
        style={{
          fontSize: '0.85rem',
          fontWeight: 800,
          color: '#38BDF8',
          margin: '0 0 10px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <CreditCard size={14} />
        PDC Cheques Collection Schedule ({pdcSchedule.length} Cheques)
      </h4>
      <div
        style={{
          overflowX: 'auto',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: '#94A3B8',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '8px 12px' }}>Cheque #</th>
              <th style={{ padding: '8px 12px' }}>Drawn Bank</th>
              <th style={{ padding: '8px 12px' }}>Amount AED</th>
              <th style={{ padding: '8px 12px' }}>Maturation Due</th>
              <th style={{ padding: '8px 12px' }}>Clearing Status</th>
            </tr>
          </thead>
          <tbody>
            {pdcSchedule.map((pdc, idx) => (
              <tr key={idx} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#FFFFFF' }}>
                  {pdc.chequeNumber}
                </td>
                <td style={{ padding: '8px 12px', color: '#CBD5E1' }}>{pdc.bankName}</td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#34D399' }}>
                  AED {pdc.amountAED.toLocaleString()}
                </td>
                <td style={{ padding: '8px 12px', color: '#94A3B8' }}>{pdc.dueDate}</td>
                <td style={{ padding: '8px 12px' }}>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background:
                        pdc.status === 'CLEARED'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(245, 158, 11, 0.15)',
                      color: pdc.status === 'CLEARED' ? '#34D399' : '#FBBF24',
                    }}
                  >
                    {pdc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
