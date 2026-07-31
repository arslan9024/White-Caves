import React, { useState } from 'react';
import { generatePdcSchedule, ChequeScheduleItem, chequeCountToFrequencyLabel } from '../utils/generatePdcSchedule';

/**
 * LeasingIntakeModal – Full‑screen wizard for creating new lease contracts.
 * Implements the UI spec from business_docs/09_crm_features/leasing-intake-forms.md.
 * Designed with White‑Caves premium dark‑theme palette (midnight #0d0d1a, accent #ff6b6b).
 */
export interface LeasingIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;

export const LeasingIntakeModal: React.FC<LeasingIntakeModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // ==== Form state ==== //
  const [propertyId, setPropertyId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [landlordId, setLandlordId] = useState(''); // auto‑filled from logged‑in user elsewhere
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  // Step 2 – Ejari fields
  const [ejariNumber, setEjariNumber] = useState('');
  const [ejariStatus, setEjariStatus] = useState<'Pending' | 'Registered' | 'Expired' | 'Cancelled'>('Pending');

  // Step 3 – PDC schedule
  const [chequeCount, setChequeCount] = useState<1 | 2 | 4 | 6 | 12>(1);
  const [pdcSchedule, setPdcSchedule] = useState<ChequeScheduleItem[]>([]);

  // Step 4 – Final review
  const [finalize, setFinalize] = useState(false);

  if (!isOpen) return null;

  const next = () => setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev));
  const back = () => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));

  const handleGenerateSchedule = () => {
    if (!monthlyRent || !startDate) return;
    const annualRent = Number(monthlyRent) * 12;
    const schedule = generatePdcSchedule(annualRent, chequeCount, startDate);
    setPdcSchedule(schedule);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      propertyId,
      tenantId,
      landlordId,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      monthlyRent: Number(monthlyRent),
      depositAmount: Number(depositAmount),
      ejariNumber,
      ejariStatus,
      pdcSchedule,
    };
    try {
      const res = await fetch('/api/leases/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create lease');
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    marginBottom: '12px',
    backgroundColor: '#1a1a2e',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#ff6b6b',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    marginRight: '8px',
  };

  const secondaryBtnStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#333',
    color: '#ccc',
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 style={{ color: 'var(--color-ff6b6b, #ff6b6b)', marginTop: 0, marginBottom: '16px' }}>Step 1 – Core Lease Details</h3>
            <input placeholder="Property ID" value={propertyId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPropertyId(e.target.value)} style={inputStyle} />
            <input placeholder="Tenant ID" value={tenantId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenantId(e.target.value)} style={inputStyle} />
            <input type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} style={inputStyle} />
            <input type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} style={inputStyle} />
            <input placeholder="Monthly Rent (AED)" type="number" value={monthlyRent} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyRent(e.target.value)} style={inputStyle} />
            <input placeholder="Deposit (AED)" type="number" value={depositAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepositAmount(e.target.value)} style={inputStyle} />
            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <button style={buttonStyle} onClick={next}>Next →</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 style={{ color: 'var(--color-ff6b6b, #ff6b6b)', marginTop: 0, marginBottom: '16px' }}>Step 2 – Ejari Compliance</h3>
            <input placeholder="Ejari Number" value={ejariNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEjariNumber(e.target.value)} style={inputStyle} />
            <select value={ejariStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEjariStatus(e.target.value as any)} style={inputStyle}>
              <option value="Pending">Pending</option>
              <option value="Registered">Registered</option>
              <option value="Expired">Expired</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <button style={secondaryBtnStyle} onClick={back}>← Back</button>
              <button style={buttonStyle} onClick={next}>Next →</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 style={{ color: 'var(--color-ff6b6b, #ff6b6b)', marginTop: 0, marginBottom: '16px' }}>Step 3 – PDC Cheque Schedule</h3>
            <select value={chequeCount} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChequeCount(Number(e.target.value) as any)} style={inputStyle}>
              <option value={1}>1 – Annual</option>
              <option value={2}>2 – Bi‑annual</option>
              <option value={4}>4 – Quarterly</option>
              <option value={6}>6 – Bi‑monthly</option>
              <option value={12}>12 – Monthly</option>
            </select>
            <button style={{ ...buttonStyle, backgroundColor: 'var(--accent-blue, #3b82f6)', marginBottom: '16px' }} onClick={handleGenerateSchedule}>Generate Schedule</button>
            {pdcSchedule.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--white, #fff)', fontSize: '0.85rem', marginBottom: '16px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-333, #333)', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Cheque #</th>
                    <th style={{ padding: '8px' }}>Bank</th>
                    <th style={{ padding: '8px' }}>Due Date</th>
                    <th style={{ padding: '8px' }}>Amount (AED)</th>
                    <th style={{ padding: '8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pdcSchedule.map((c) => (
                    <tr key={c.chequeNumber} style={{ borderBottom: '1px solid var(--color-222, #222)' }}>
                      <td style={{ padding: '8px' }}>{c.chequeNumber}</td>
                      <td style={{ padding: '8px' }}>{c.bankName}</td>
                      <td style={{ padding: '8px' }}>{c.dueDate}</td>
                      <td style={{ padding: '8px' }}>{c.amountAED}</td>
                      <td style={{ padding: '8px' }}>{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <button style={secondaryBtnStyle} onClick={back}>← Back</button>
              <button style={buttonStyle} onClick={next}>Next →</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 style={{ color: 'var(--color-ff6b6b, #ff6b6b)', marginTop: 0, marginBottom: '16px' }}>Step 4 – Review & Submit</h3>
            <pre style={{ background: 'var(--color-111, #111)', padding: '1rem', borderRadius: '4px', color: 'var(--color-00ffcc, #00ffcc)', fontSize: '0.8rem', overflowX: 'auto', maxHeight: '200px' }}>
{JSON.stringify({ propertyId, tenantId, startDate, endDate, monthlyRent, depositAmount, ejariNumber, ejariStatus, chequeCount: chequeCountToFrequencyLabel(chequeCount), pdcSchedule }, null, 2)}
            </pre>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--white, #fff)', margin: '16px 0', cursor: 'pointer' }}>
              <input type="checkbox" checked={finalize} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFinalize(e.target.checked)} />
              Confirm I have verified all data
            </label>
            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <button style={secondaryBtnStyle} onClick={back}>← Back</button>
              <button style={{ ...buttonStyle, backgroundColor: finalize ? 'var(--accent-green, #10b981)' : 'var(--color-555, #555)', cursor: finalize ? 'pointer' : 'not-allowed' }} disabled={!finalize || loading} onClick={handleSubmit}>
                {loading ? 'Creating...' : 'Create Lease'}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'var(--color-0d0d1a, #0d0d1a)', border: '1px solid var(--color-333, #333)', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', color: 'var(--white, #fff)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-222, #222)', paddingBottom: '12px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Leasing Intake Wizard</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-888, #888)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default LeasingIntakeModal;
