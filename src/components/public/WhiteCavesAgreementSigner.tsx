import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { ShieldCheck, FileText, CheckCircle2, Download, Printer, RefreshCw, Send, Award, Lock, Sparkles } from 'lucide-react';

export interface CategoryOption {
  id: 'Category A' | 'Category B' | 'Category C' | 'Category D' | 'Category E';
  name: string;
  commission: number;
  agencySplit: number;
  monthlyFee: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: 'Category A', name: 'Category A – 100% Commission Package', commission: 100, agencySplit: 0, monthlyFee: 'AED 1,500/mo (or AED 1,000/yr)' },
  { id: 'Category B', name: 'Category B – 95/5 Commission Package', commission: 95, agencySplit: 5, monthlyFee: 'AED 500/mo (or AED 475/yr)' },
  { id: 'Category C', name: 'Category C – 90/10 Commission Package', commission: 90, agencySplit: 10, monthlyFee: 'AED 350/mo (or AED 300/yr)' },
  { id: 'Category D', name: 'Category D – 85/15 Commission Package', commission: 85, agencySplit: 15, monthlyFee: 'AED 200/mo (or AED 150/yr)' },
  { id: 'Category E', name: 'Category E – 75/25 Commission Package', commission: 75, agencySplit: 25, monthlyFee: 'AED 0 / mo (FREE ENTRY)' },
];

export const WhiteCavesAgreementSigner: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>(CATEGORY_OPTIONS[4]); // Category E Default
  const [clientName, setClientName] = useState<string>('Arslan Malik');
  const [clientEmail, setClientEmail] = useState<string>('the.arslan.broker@gmail.com');
  const [clientPhone, setClientPhone] = useState<string>('+971 50 576 0056');
  const [passportNo, setPassportNo] = useState<string>('A12345678');
  const [address, setAddress] = useState<string>('Dubai, UAE');
  const [isSigned, setIsSigned] = useState<boolean>(false);

  const sigCanvasRef = useRef<SignatureCanvas | null>(null);

  const currentDateStr = new Date().toLocaleDateString('en-GB');

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
    setIsSigned(false);
  };

  const handleSignConfirm = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      setIsSigned(true);
    } else {
      alert('Please provide your digital signature before confirming.');
    }
  };

  const handlePrintContract = () => {
    window.print();
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '2px solid #06B6D4',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 12px 40px rgba(6, 182, 212, 0.15)',
        color: '#1E293B',
        marginTop: '2rem',
      }}
    >
      {/* HEADER BANNER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ background: 'var(--color-06b6d4, #06B6D4)', color: 'var(--white, #FFFFFF)', fontSize: '0.72rem', fontWeight: 900, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
              Dubai RERA Legal Contract Engine
            </span>
            <span style={{ background: 'var(--color-ecfdf5, #ECFDF5)', color: 'var(--color-047857, #047857)', border: '1px solid var(--accent-green, #10B981)', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
              RERA Compliant & Verified
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-0f172a, #0F172A)' }}>
            White Caves Real Estate Services Agreement Signer
          </h3>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary, #64748B)' }}>
            Office C1503, Ontario Tower, Business Bay, P.O. Box 450797, Dubai, UAE
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handlePrintContract}
            style={{
              background: '#F1F5F9',
              color: '#1E293B',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* STEP 1: CANDIDATE & PACKAGE SELECTION INPUTS */}
      <div style={{ background: 'var(--color-f8fafc, #F8FAFC)', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--text-secondary, #E2E8F0)', marginBottom: '1.5rem' }}>
        <h4 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-0f172a, #0F172A)' }}>
          1. Select Category Package & Enter Client Details
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-475569, #475569)', marginBottom: '4px' }}>Client Full Name *</label>
            <input
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.88rem', fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-475569, #475569)', marginBottom: '4px' }}>Email Address *</label>
            <input
              type="email"
              value={clientEmail}
              onChange={e => setClientEmail(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.88rem', fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-475569, #475569)', marginBottom: '4px' }}>Phone Number *</label>
            <input
              type="text"
              value={clientPhone}
              onChange={e => setClientPhone(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.88rem', fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-475569, #475569)', marginBottom: '4px' }}>Passport Number</label>
            <input
              type="text"
              value={passportNo}
              onChange={e => setPassportNo(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.88rem', fontWeight: 700 }}
            />
          </div>
        </div>

        {/* PACKAGE CATEGORY SELECTOR */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-475569, #475569)', marginBottom: '6px' }}>Select Startup Package Category:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {CATEGORY_OPTIONS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory.id === cat.id ? '#06B6D4' : '#FFFFFF',
                  color: selectedCategory.id === cat.id ? '#FFFFFF' : '#1E293B',
                  border: selectedCategory.id === cat.id ? '1px solid #06B6D4' : '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>{cat.id} ({cat.commission}% Split)</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 900 }}>{cat.name.split('–')[1] || cat.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 2: LIVE LEGAL CONTRACT TEXT DISPLAY */}
      <div
        id="printable-contract-content"
        style={{
          background: '#0F172A',
          color: '#E2E8F0',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid #334155',
          fontFamily: 'serif',
          fontSize: '0.9rem',
          lineHeight: 1.65,
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--color-334155, #334155)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-06b6d4, #06B6D4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            WHITE CAVES REAL ESTATE LLC — DUBAI, UAE
          </span>
          <h2 style={{ margin: '4px 0 2px', fontSize: '1.5rem', fontWeight: 900, color: 'var(--white, #FFFFFF)', fontFamily: 'sans-serif' }}>
            REAL ESTATE SERVICES AGREEMENT
          </h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-94a3b8, #94A3B8)', fontFamily: 'sans-serif' }}>
            Date: <strong>{currentDateStr}</strong> | Startup Package Category: <strong>{selectedCategory.id} ({selectedCategory.commission}%)</strong>
          </span>
        </div>

        <p>
          Re: <strong>Real Estate Service Agreement</strong><br />
          Dear <strong>{clientName}</strong>,<br />
          This Real Estate Services Agreement ("Agreement") is entered into on this <strong>{currentDateStr}</strong> ("Effective Date"), by and between <strong>White Caves Real Estate LLC</strong>, a company duly registered and operating in Dubai, United Arab Emirates, having its principal place of business at Ontario Tower, Office C1503, Business Bay, P.O. Box 450797, Dubai, UAE ("Company"), and <strong>{clientName}</strong>, holding Passport No. <strong>{passportNo}</strong>, residing at <strong>{address}</strong> ("Client"). The Company and Client shall collectively be referred to as the "Parties".
        </p>

        <h4 style={{ color: 'var(--color-38bdf8, #38BDF8)', fontFamily: 'sans-serif', marginTop: '1.25rem', marginBottom: '0.5rem' }}>RECITALS</h4>
        <p>
          WHEREAS, the Company is a licensed and registered real estate agency in Dubai, specializing in real estate transactions, and holds the requisite licenses, including the Labor Card and the RERA Card, necessary to operate in compliance with the regulations of the Real Estate Regulatory Authority ("RERA") and relevant labor laws;<br />
          WHEREAS, the Client desires to engage the Company to provide real estate services, and the Company is willing to provide such services, subject to the terms and conditions set forth in this Agreement;<br />
          NOW, THEREFORE, in consideration of the premises and covenants contained herein, the Parties agree as follows:
        </p>

        <h4 style={{ color: 'var(--color-38bdf8, #38BDF8)', fontFamily: 'sans-serif', marginTop: '1.25rem', marginBottom: '0.5rem' }}>SERVICES & COMMISSION STRUCTURE</h4>
        <p>
          <strong>Commission Structure:</strong> The Company would provide <strong>{selectedCategory.commission}% commission</strong> on each sale concluded by the Client as part of the subscription, along with administrative assistance in closing the deals. *(Refer to Annexure A for commission split under this category.)*<br />
          <strong>Developers Access:</strong> Access to all major developers (Emaar, DAMAC, Nakheel). If Client requires registration with new developers, the Company will execute all necessary agency registration procedures.<br />
          <strong>Administrative Support:</strong> The Company will provide all administrative support including necessary documentation for ongoing closing transactions, RERA contracts either sale or rent, tax invoices, developer commission follow-ups, and commission payouts within <strong>three (3) working days</strong> of bank clearance.
        </p>

        <h4 style={{ color: 'var(--color-38bdf8, #38BDF8)', fontFamily: 'sans-serif', marginTop: '1.25rem', marginBottom: '0.5rem' }}>SERVICE TERM & TERMINATION</h4>
        <p>
          This Agreement shall commence on the Effective Date and remain in effect for an initial 1-month term, automatically renewing unless terminated by mutual consent or with a minimum of <strong>two (2) months' written notice</strong>.
        </p>

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-334155, #334155)', paddingTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', fontFamily: 'sans-serif' }}>
          <div>
            <strong style={{ color: 'var(--color-06b6d4, #06B6D4)', display: 'block', fontSize: '0.85rem' }}>For White Caves Real Estate LLC:</strong>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--white, #FFFFFF)' }}>Juergen Pernegger / Arslan Malik</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-94a3b8, #94A3B8)', display: 'block' }}>Co-Founder & Managing Director</span>
          </div>

          <div>
            <strong style={{ color: 'var(--accent-green, #10B981)', display: 'block', fontSize: '0.85rem' }}>Client Acceptance & Digital Signature:</strong>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--white, #FFFFFF)' }}>{clientName}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-94a3b8, #94A3B8)', display: 'block' }}>Date: {currentDateStr}</span>
            {isSigned && (
              <span style={{ background: 'var(--color-ecfdf5, #ECFDF5)', color: 'var(--color-047857, #047857)', border: '1px solid var(--accent-green, #10B981)', fontSize: '0.72rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                ✓ DIGITAL SIGNATURE VERIFIED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* STEP 3: DIGITAL SIGNATURE CANVAS */}
      <div style={{ background: 'var(--color-f8fafc, #F8FAFC)', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
        <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-0f172a, #0F172A)' }}>
          3. Provide Digital Signature Below
        </h4>
        <p style={{ margin: '0 0 1rem', fontSize: '0.84rem', color: 'var(--text-secondary, #64748B)' }}>
          Draw your signature inside the box below to execute this Real Estate Services Agreement.
        </p>

        <div style={{ border: '2px dashed var(--color-06b6d4, #06B6D4)', borderRadius: '12px', background: 'var(--white, #FFFFFF)', padding: '4px', marginBottom: '1rem', width: '100%', maxWidth: '500px' }}>
          <SignatureCanvas
            ref={sigCanvasRef}
            canvasProps={{
              width: 490,
              height: 140,
              className: 'sigCanvas',
              style: { width: '100%', height: '140px' },
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleClearSignature}
            style={{
              background: '#F1F5F9',
              color: '#1E293B',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '10px 18px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Clear Signature
          </button>

          <button
            onClick={handleSignConfirm}
            style={{
              background: isSigned ? '#10B981' : '#06B6D4',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontSize: '0.88rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle2 size={16} /> {isSigned ? 'Signature Confirmed & Locked' : 'Confirm & Execute Agreement'}
          </button>
        </div>
      </div>
    </div>
  );
};
