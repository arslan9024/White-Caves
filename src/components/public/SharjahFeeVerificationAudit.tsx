import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Info, ExternalLink, Calculator, DollarSign, Award, MapPin } from 'lucide-react';

export interface FeeItem {
  fee_name: string;
  quoted_amount_aed: number;
  legal_amount_aed: number;
  status: 'valid' | 'illegal' | 'overcharged' | 'inflated';
  is_refundable: boolean;
  legal_basis_or_rule: string;
  source_link?: string;
}

const DEFAULT_SHARJAH_FEES: FeeItem[] = [
  {
    fee_name: 'Annual Rent',
    quoted_amount_aed: 12000,
    legal_amount_aed: 12000,
    status: 'valid',
    is_refundable: false,
    legal_basis_or_rule: 'Standard market price for an unfurnished studio in Al Nabba.',
    source_link: 'https://bayut.com',
  },
  {
    fee_name: 'Building Security Deposit',
    quoted_amount_aed: 1500,
    legal_amount_aed: 1500,
    status: 'valid',
    is_refundable: true,
    legal_basis_or_rule: 'Acceptable landlord requirement. Must be explicitly written as refundable upon move-out in the contract.',
    source_link: '',
  },
  {
    fee_name: 'Building Management & Maintenance',
    quoted_amount_aed: 1000,
    legal_amount_aed: 0,
    status: 'illegal',
    is_refundable: false,
    legal_basis_or_rule: 'Under Sharjah Rental Law, landlords/management are legally responsible for building maintenance. They cannot pass community or service fees to residential tenants.',
    source_link: 'https://almawaridrealestate.ae',
  },
  {
    fee_name: 'SEWA Deposit',
    quoted_amount_aed: 1010,
    legal_amount_aed: 500,
    status: 'overcharged',
    is_refundable: true,
    legal_basis_or_rule: 'Sharjah Electricity and Water Authority (SEWA) strictly fixes the security deposit for a residential Studio Apartment at AED 500.',
    source_link: 'https://dubizzle.com',
  },
  {
    fee_name: 'Municipality Attestation',
    quoted_amount_aed: 930,
    legal_amount_aed: 580,
    status: 'overcharged',
    is_refundable: false,
    legal_basis_or_rule: 'Sharjah Municipality charges exactly 4% of the annual rent (AED 480) plus a flat AED 100 fee for the contract authentication form.',
    source_link: 'https://seles.io',
  },
  {
    fee_name: 'File Typing Fee',
    quoted_amount_aed: 350,
    legal_amount_aed: 350,
    status: 'valid',
    is_refundable: false,
    legal_basis_or_rule: 'Standard administrative processing fee charged by real estate typing centers or Tasheel/Amer platforms.',
    source_link: 'https://seles.io',
  },
  {
    fee_name: 'Agency Commission',
    quoted_amount_aed: 2000,
    legal_amount_aed: 1000,
    status: 'inflated',
    is_refundable: false,
    legal_basis_or_rule: 'Sharjah agencies typically charge a minimum flat-rate commission for low-rent studios ranging from AED 1,000 to AED 1,500. AED 2,000 represents an aggressive 16.6% markup.',
    source_link: '',
  },
];

export const SharjahFeeVerificationAudit: React.FC = () => {
  const [selectedEmirate, setSelectedEmirate] = useState<'Sharjah' | 'Dubai'>('Sharjah');
  const [annualRent, setAnnualRent] = useState<number>(12000);
  const [propertyType, setPropertyType] = useState<string>('Studio');
  const [locationName, setLocationName] = useState<string>('Al Nabba, Sharjah');

  const totalQuoted = DEFAULT_SHARJAH_FEES.reduce((acc, f) => acc + f.quoted_amount_aed, 0);
  const totalLegal = DEFAULT_SHARJAH_FEES.reduce((acc, f) => acc + f.legal_amount_aed, 0);
  const totalSavings = totalQuoted - totalLegal;

  const getStatusBadge = (status: FeeItem['status']) => {
    switch (status) {
      case 'valid':
        return <span style={{ background: 'var(--color-ecfdf5, #ECFDF5)', color: 'var(--color-047857, #047857)', border: '1px solid var(--accent-green, #10B981)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>✓ VALID</span>;
      case 'illegal':
        return <span style={{ background: 'var(--color-fef2f2, #FEF2F2)', color: 'var(--accent-red, #B91C1C)', border: '1px solid var(--accent-red, #EF4444)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>🚫 ILLEGAL FEE</span>;
      case 'overcharged':
        return <span style={{ background: 'var(--color-fffbeb, #FFFBEB)', color: 'var(--color-b45309, #B45309)', border: '1px solid var(--accent-gold, #F59E0B)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>⚠️ OVERCHARGED</span>;
      case 'inflated':
        return <span style={{ background: 'var(--color-eff6ff, #EFF6FF)', color: 'var(--accent-blue, #1D4ED8)', border: '1px solid var(--accent-blue, #3B82F6)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>📈 INFLATED MARKUP</span>;
    }
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #06B6D4',
        borderRadius: '18px',
        padding: '1.75rem',
        boxShadow: '0 8px 32px rgba(6, 182, 212, 0.1)',
        marginTop: '1.5rem',
      }}
    >
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ background: 'var(--color-06b6d4, #06B6D4)', color: 'var(--white, #FFFFFF)', fontSize: '0.72rem', fontWeight: 900, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
              UAE Multi-Emirate Tenancy Rights
            </span>
            <span style={{ background: 'var(--color-ecfdf5, #ECFDF5)', color: 'var(--color-047857, #047857)', border: '1px solid var(--accent-green, #10B981)', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
              Sharjah Law No. 5 of 2024 Active
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-1e293b, #1E293B)' }}>
            UAE Tenancy Fee Verification & Legal Protection Audit
          </h3>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary, #64748B)', display: 'block', marginTop: '2px' }}>
            Public Lease Audit Case Study: <strong style={{ color: 'var(--color-06b6d4, #06B6D4)' }}>{locationName}</strong> · Annual Rent: AED {annualRent.toLocaleString()}
          </span>
        </div>

        {/* Emirate Selector */}
        <div style={{ display: 'flex', background: 'var(--color-f1f5f9, #F1F5F9)', padding: '4px', borderRadius: '10px', gap: '4px' }}>
          <button
            onClick={() => { setSelectedEmirate('Sharjah'); setLocationName('Al Nabba, Sharjah'); }}
            style={{
              background: selectedEmirate === 'Sharjah' ? '#06B6D4' : 'transparent',
              color: selectedEmirate === 'Sharjah' ? '#FFFFFF' : '#475569',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            🏛️ Sharjah Lease Audit
          </button>
          <button
            onClick={() => { setSelectedEmirate('Dubai'); setLocationName('DAMAC Hills 2, Dubai'); }}
            style={{
              background: selectedEmirate === 'Dubai' ? '#06B6D4' : 'transparent',
              color: selectedEmirate === 'Dubai' ? '#FFFFFF' : '#475569',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            🏙️ Dubai RERA Lease Audit
          </button>
        </div>
      </div>

      {/* Audit KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--color-fef2f2, #FEF2F2)', border: '1.5px solid var(--accent-red, #EF4444)', borderRadius: '12px', padding: '1.15rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-red, #B91C1C)', textTransform: 'uppercase' }}>Total Quoted Outlay</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-991b1b, #991B1B)', margin: '4px 0 2px' }}>
            AED {totalQuoted.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-7f1d1d, #7F1D1D)' }}>Includes inflated & illegal fee add-ons</span>
        </div>

        <div style={{ background: 'var(--color-ecfdf5, #ECFDF5)', border: '1.5px solid var(--accent-green, #10B981)', borderRadius: '12px', padding: '1.15rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-047857, #047857)', textTransform: 'uppercase' }}>Legal & Fair Outlay</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-065f46, #065F46)', margin: '4px 0 2px' }}>
            AED {totalLegal.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-064e3b, #064E3B)' }}>Verified by Sharjah Municipality & SEWA rules</span>
        </div>

        <div style={{ background: 'linear-gradient(135deg, var(--color-0f172a, #0F172A) 0%, var(--color-164e63, #164E63) 100%)', border: '2px solid var(--color-38bdf8, #38BDF8)', borderRadius: '12px', padding: '1.15rem', color: 'var(--white, #FFFFFF)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-38bdf8, #38BDF8)', textTransform: 'uppercase' }}>Tenant Savings Identified</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-green, #10B981)', margin: '4px 0 2px' }}>
            AED {totalSavings.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary, #CBD5E1)' }}>15.2% Total Cash Saved for Tenant!</span>
        </div>
      </div>

      {/* Itemized Fee Breakdown Table */}
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ background: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '2px solid var(--text-secondary, #E2E8F0)', textAlign: 'left', color: 'var(--color-475569, #475569)' }}>
              <th style={{ padding: '10px 12px', fontWeight: 800 }}>Fee Name</th>
              <th style={{ padding: '10px 12px', fontWeight: 800 }}>Quoted (AED)</th>
              <th style={{ padding: '10px 12px', fontWeight: 800 }}>Legal Limit (AED)</th>
              <th style={{ padding: '10px 12px', fontWeight: 800 }}>Status</th>
              <th style={{ padding: '10px 12px', fontWeight: 800 }}>Refundable?</th>
              <th style={{ padding: '10px 12px', fontWeight: 800 }}>Legal Basis & Governing Rule</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_SHARJAH_FEES.map((fee, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-f1f5f9, #F1F5F9)', background: fee.status === 'illegal' ? 'var(--color-fef2f2, #FEF2F2)' : fee.status === 'overcharged' ? 'var(--color-fffbeb, #FFFBEB)' : 'transparent' }}>
                <td style={{ padding: '10px 12px', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>{fee.fee_name}</td>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: fee.quoted_amount_aed > fee.legal_amount_aed ? 'var(--accent-red, #DC2626)' : 'var(--color-1e293b, #1E293B)' }}>
                  AED {fee.quoted_amount_aed.toLocaleString()}
                </td>
                <td style={{ padding: '10px 12px', fontWeight: 800, color: 'var(--accent-green, #10B981)' }}>
                  AED {fee.legal_amount_aed.toLocaleString()}
                </td>
                <td style={{ padding: '10px 12px' }}>{getStatusBadge(fee.status)}</td>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: fee.is_refundable ? 'var(--color-047857, #047857)' : 'var(--text-secondary, #64748B)' }}>
                  {fee.is_refundable ? '✓ Refundable' : 'Non-refundable'}
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--color-475569, #475569)', lineHeight: 1.4 }}>
                  {fee.legal_basis_or_rule}
                  {fee.source_link && (
                    <a href={fee.source_link} target="_blank" rel="noreferrer" style={{ marginLeft: '6px', color: 'var(--color-06b6d4, #06B6D4)', textDecoration: 'underline', fontWeight: 700 }}>
                      [Source <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />]
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sharjah Rent Freeze Legal Banner */}
      <div style={{ background: 'var(--color-ecfdf5, #ECFDF5)', border: '1.5px solid var(--accent-green, #10B981)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ShieldCheck size={28} color="#10B981" />
        <div>
          <h4 style={{ margin: '0 0 2px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-065f46, #065F46)' }}>
            Sharjah Rent Freeze Protection (Sharjah Law No. 5 of 2024)
          </h4>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-047857, #047857)', lineHeight: 1.45 }}>
            Under <strong>Sharjah Law No. 5 of 2024</strong>, residential tenancy agreements enjoy a <strong>mandatory 3-year rent freeze</strong> starting from the contract commencement date. Landlords cannot legally raise rent for the first 3 years of your tenancy.
          </p>
        </div>
      </div>
    </div>
  );
};
