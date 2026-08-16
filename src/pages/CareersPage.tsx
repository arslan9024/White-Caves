import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  CheckCircle2,
  FileText,
  Award,
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import PublicLayout from '../components/layout/PublicLayout';
import PageMeta from '../components/seo/PageMeta';
import { authFetch } from '../utils/authFetch';
import '../styles/luxuryDesignSystem.css';
import './CareersPage.css';

export interface OfferLetterTemplate {
  positionId: string;
  title: string;
  department: string;
  compensationType: string;
  splitDetails: string;
  visaPolicy: string;
  perks: string[];
  officialLetterText: string;
}

export interface JobPosition {
  id: string;
  title: string;
  department: 'Sales' | 'Leasing' | 'Off-Plan' | 'CRM & AI';
  type: 'Full-Time' | 'Freelance / High-Split';
  experience: string;
  location: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  offerLetter: OfferLetterTemplate;
}

const JOB_POSITIONS: JobPosition[] = [
  {
    id: 'senior-sales',
    title: 'Senior Off-Plan & Secondary Sales Specialist',
    department: 'Sales',
    type: 'Full-Time',
    experience: '2+ Years Dubai Real Estate',
    location: 'Business Bay, Dubai',
    description: 'Lead high-value off-plan and luxury secondary sales transactions across Dubai prime developments (Emaar, DAMAC, Nakheel).',
    responsibilities: [
      'Represent high-net-worth investors in luxury property acquisitions.',
      'Conduct property walkthroughs and market analysis.',
      'Utilize Nina AI Assistant (+971 50 576 0056) for lead qualification.',
    ],
    requirements: [
      'Valid RERA Broker Card (or eligible for White Caves sponsorship).',
      'Proven track record of AED 5M+ sales volume.',
      'Strong negotiation and closing skills.',
    ],
    offerLetter: {
      positionId: 'senior-sales',
      title: 'Senior Off-Plan & Secondary Sales Specialist',
      department: 'Sales & Advisory',
      compensationType: 'Standard 50/50 Commission Split (Hired Employee)',
      splitDetails: '50% Broker / 50% Agency. Uncapped deal potential.',
      visaPolicy: 'Full UAE Residence Visa & Emirates ID Sponsorship upon closing 1 Sale Transaction.',
      perks: [
        'Full RERA Card Processing & Renewal',
        'Direct Access to 9,210 DAMAC Hills 2 Mandates',
        'Nina AI Bot Lead Distribution Access',
        'Office Space at Ontario Tower – Business Bay',
      ],
      officialLetterText: `OFFICIAL OFFER OF EMPLOYMENT
Position: Senior Off-Plan & Secondary Sales Specialist
Company: White Caves Real Estate LLC (Office 1503, Ontario Tower, Business Bay, Dubai)
Compensation: 50% Broker / 50% Agency Commission Split + Quarterly Performance Bonuses
Visa Sponsorship: Full UAE Residence Visa & Emirates ID sponsored upon 1 Sale Deal.
Perks: RERA Card Processing, Full Developer Access (Emaar, DAMAC, Nakheel), Admin & Document Support.`,
    },
  },
  {
    id: 'leasing-specialist',
    title: 'Residential Leasing & Tenancy Specialist',
    department: 'Leasing',
    type: 'Full-Time',
    experience: '1+ Year UAE Leasing',
    location: 'Business Bay & DAMAC Hills 2',
    description: 'Manage residential leasing portfolios, Ejari contract registrations, and landlord property management across Dubai & Sharjah.',
    responsibilities: [
      'Match prospective tenants with verified villa inventory.',
      'Generate automated Ejari contracts and tenancy agreements.',
      'Audit rental fees using our Sharjah & Dubai Fee Verification Engine.',
    ],
    requirements: [
      'Valid UAE Drivers License.',
      'Familiarity with Ejari registration and RERA tenancy laws.',
      'Fluent in English (Arabic or Russian is a plus).',
    ],
    offerLetter: {
      positionId: 'leasing-specialist',
      title: 'Residential Leasing & Tenancy Specialist',
      department: 'Leasing & Property Management',
      compensationType: 'Standard 50/50 Commission Split',
      splitDetails: '50% Broker / 50% Agency. Fast 24-Hour Payouts.',
      visaPolicy: 'Full UAE Residence Visa Sponsorship upon closing 2 Rental Contracts.',
      perks: [
        'Automatic Ejari Registration System Access',
        'Sharjah Fee Verification Tool Access',
        'Direct Landlord Portfolio Access',
        'Fast 24-Hour Payout Processing',
      ],
      officialLetterText: `OFFICIAL OFFER OF EMPLOYMENT
Position: Residential Leasing & Tenancy Specialist
Company: White Caves Real Estate LLC
Compensation: 50% Broker / 50% Agency Commission Split + 24-Hour Fast Payouts
Visa Sponsorship: Full UAE Residence Visa sponsored upon closing 2 Rental Contracts.
Perks: Ejari Registration System, Landlord Contact Database, Office Space at Ontario Tower.`,
    },
  },
  {
    id: 'dh2-specialist',
    title: 'DAMAC Hills 2 Community Specialist Broker',
    department: 'Off-Plan',
    type: 'Full-Time',
    experience: '1+ Year Real Estate Experience',
    location: 'DAMAC Hills 2, Dubai',
    description: 'Exclusive community broker managing 9,210 villas and 8,767 landlord mandates in DAMAC Hills 2 (VARDON, ALBIZIA, PACIFICA, SANCTUARY).',
    responsibilities: [
      'Conduct daily community viewings and open houses in DAMAC Hills 2.',
      'Maintain relationship with 8,767 registered villa owners.',
      'Provide comparative market valuation reports for sellers.',
    ],
    requirements: [
      'Deep knowledge of DAMAC Hills 2 clusters and townhouse layouts.',
      'Valid RERA Broker License.',
      'High mobility and client relationship focus.',
    ],
    offerLetter: {
      positionId: 'dh2-specialist',
      title: 'DAMAC Hills 2 Community Specialist Broker',
      department: 'Community Sales & Leasing',
      compensationType: '50/50 Hired Employee OR 100% Commission Package',
      splitDetails: 'Choice of 50/50 Employee model or 100% Commission Broker Membership.',
      visaPolicy: 'Immediate or Performance-Based Visa Sponsorship (1 Sale / 2 Rentals).',
      perks: [
        'Exclusive Access to 9,210 Villa Database & 8,767 Landlords',
        'On-Site DAMAC Hills 2 Cluster Office Access',
        'Dedicated Administrative Assistant',
        'High Lead Generation Support',
      ],
      officialLetterText: `OFFICIAL OFFER OF EMPLOYMENT
Position: DAMAC Hills 2 Community Specialist Broker
Company: White Caves Real Estate LLC
Compensation: 50/50 Commission Split OR 100% Commission Membership Tier
Visa Sponsorship: UAE Residence Visa Sponsored upon 1 Sale Deal / 2 Rentals.
Perks: Exclusive 9,210 Villa Database Access, Landlord Contacts, On-Site Cluster Support.`,
    },
  },
  {
    id: 'crm-ai-agent',
    title: 'Customer Relationship Manager & Nina Bot Support Agent',
    department: 'CRM & AI',
    type: 'Full-Time',
    experience: '2+ Years CRM / Operations',
    location: 'Ontario Tower, Business Bay',
    description: 'Manage inbound lead workflows, oversee Nina AI Assistant WhatsApp telemetry (+971 50 576 0056), and assist Managing Director Arslan Malik.',
    responsibilities: [
      'Monitor Nina AI Assistant socket events and lead dispatching.',
      'Qualify inbound leads and assign to senior brokers.',
      'Maintain CRM database integrity and client records.',
    ],
    requirements: [
      'Proficiency with WhatsApp Business API and CRM software.',
      'Strong organizational and client service skills.',
      'Degree in Business, IT, or Communications.',
    ],
    offerLetter: {
      positionId: 'crm-ai-agent',
      title: 'Customer Relationship Manager & Nina Bot Support Agent',
      department: 'Operations & Executive Support',
      compensationType: 'Fixed Salary (AED 6,000 – AED 9,000 / mo)',
      splitDetails: 'AED 7,500 / month Base Salary + Monthly Conversion Bonuses.',
      visaPolicy: 'Immediate UAE Residence Visa & Medical Insurance Sponsorship upon probation.',
      perks: [
        'Fixed Monthly Salary + Performance KPI Bonus',
        'Full UAE Visa & Health Insurance Sponsorship',
        'Direct Work with Managing Director Arslan Malik',
        'Executive Office Suite at Business Bay',
      ],
      officialLetterText: `OFFICIAL OFFER OF EMPLOYMENT
Position: Customer Relationship Manager & Nina Bot Support Agent
Company: White Caves Real Estate LLC
Compensation: AED 7,500 / month Fixed Salary + Monthly Conversion KPI Bonuses
Visa Sponsorship: Full UAE Residence Visa & Medical Insurance upon Probation Completion.
Perks: Executive Office Suite, Direct Operations with MD Arslan Malik, Technology Tools.`,
    },
  },
];

const CareersPage: FC = () => {
  useDocumentTitle('Careers & Executive Hiring | White Caves Real Estate');

  const [activeDepartment, setActiveDepartment] = useState<string>('All');
  const [selectedOfferLetter, setSelectedOfferLetter] = useState<OfferLetterTemplate | null>(null);
  const [applyingPosition, setApplyingPosition] = useState<JobPosition | null>(null);

  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', coverLetter: '' });
  const [applyStatus, setApplyStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const filteredJobs = JOB_POSITIONS.filter(job => {
    if (activeDepartment === 'All') return true;
    return job.department === activeDepartment;
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingPosition) return;
    setApplyStatus('submitting');

    setTimeout(() => {
      setApplyStatus('success');
      setApplyForm({ name: '', email: '', phone: '', coverLetter: '' });
    }, 1200);
  };

  return (
    <PublicLayout>
      <PageMeta
        title="Executive Careers & Hiring Plan | White Caves Real Estate Dubai"
        description="Explore career opportunities at White Caves Real Estate. 50/50 Hired Employee plans, performance-based UAE visa sponsorship, and official offer letter previewer."
      />

      <div style={{ background: '#0F172A', color: '#FFFFFF', paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

          {/* HERO HEADER */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="wc-luxury-italic-gold" style={{ fontSize: '1.05rem', display: 'block', marginBottom: '8px' }}>
              White Caves Real Estate LLC Executive Careers
            </span>
            <h1 className="wc-luxury-serif-title" style={{ fontSize: '2.6rem', margin: '0 0 1rem', color: '#FFFFFF' }}>
              Shape the Future of <span className="wc-luxury-italic-cyan">Dubai Luxury Real Estate</span>
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
              Join our team of high-performing brokers and specialists. Explore our 50/50 Hired Employee model, performance visa sponsorship, and preview your official offer letter below!
            </p>
          </div>

          {/* 4-STAGE HIRING PIPELINE BANNER */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              border: '2px solid #06B6D4',
              borderRadius: '20px',
              padding: '1.75rem',
              marginBottom: '3.5rem',
              boxShadow: '0 8px 32px rgba(6, 182, 212, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <Sparkles size={24} color="#06B6D4" />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                White Caves 4-Stage Executive Hiring Pipeline
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {[
                { step: '1', title: 'CV Screening', desc: 'RERA credentials & transaction history review' },
                { step: '2', title: 'Video Assessment', desc: 'Client communication & area knowledge check' },
                { step: '3', title: 'MD Final Interview', desc: 'Strategy session with Arslan Malik' },
                { step: '4', title: 'Official Offer', desc: 'Offer letter, RERA processing & UAE Visa' },
              ].map(stage => (
                <div key={stage.step} style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ background: '#06B6D4', color: '#FFFFFF', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>
                      {stage.step}
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: '#FFFFFF' }}>{stage.title}</strong>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.4, display: 'block' }}>{stage.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DEPARTMENT FILTER TABS */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '2.5rem' }}>
            {['All', 'Sales', 'Leasing', 'Off-Plan', 'CRM & AI'].map(dept => (
              <button
                key={dept}
                onClick={() => setActiveDepartment(dept)}
                className={`wc-luxury-pill-chip ${activeDepartment === dept ? 'active' : ''}`}
              >
                {dept} Positions
              </button>
            ))}
          </div>

          {/* OPEN POSITIONS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '4rem' }}>
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="wc-luxury-glass-card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ background: '#06B6D4', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase' }}>
                      {job.department}
                    </span>
                    <span style={{ color: '#94A3B8', fontSize: '0.78rem', fontWeight: 700 }}>
                      {job.type}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
                    {job.title}
                  </h3>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#38BDF8', marginBottom: '1rem', fontWeight: 700 }}>
                    <span>📍 {job.location}</span>
                    <span>⌛ {job.experience}</span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                    {job.description}
                  </p>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <strong style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      Key Responsibilities:
                    </strong>
                    <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.82rem', color: '#E2E8F0', lineHeight: 1.5 }}>
                      {job.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  {/* VIEW OFFICIAL OFFER LETTER BUTTON */}
                  <button
                    onClick={() => setSelectedOfferLetter(job.offerLetter)}
                    style={{
                      flex: 1,
                      background: 'rgba(212, 175, 55, 0.15)',
                      color: '#D4AF37',
                      border: '1px solid #D4AF37',
                      borderRadius: '10px',
                      padding: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <FileText size={16} /> Preview Offer Letter
                  </button>

                  {/* APPLY BUTTON */}
                  <button
                    onClick={() => setApplyingPosition(job)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
                    }}
                  >
                    Apply Now ➔
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* WHATSAPP HR FAST APPLICATION CTA */}
          <div style={{ textAlign: 'center', background: '#1E293B', borderRadius: '20px', padding: '2.5rem', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF' }}>
              Want to Apply Directly via WhatsApp HR Desk?
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Connect directly with Managing Director Arslan Malik (+971 50 576 0056) at Business Bay.
            </p>

            <button
              onClick={() => window.open('https://wa.me/971505760056?text=Hi%20White%20Caves%20HR%2C%20I%20want%20to%20apply%20for%20a%20Broker%20position', '_blank')}
              style={{
                background: '#25D366',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 28px',
                fontSize: '0.92rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
              }}
            >
              💬 Instant HR Application via WhatsApp (+971 50 576 0056)
            </button>
          </div>

        </div>
      </div>

      {/* ─── OFFER LETTER PREVIEW MODAL ─── */}
      {selectedOfferLetter && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: '#0F172A',
              border: '2px solid #D4AF37',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '560px',
              width: '100%',
              color: '#FFFFFF',
              boxShadow: '0 20px 60px rgba(212, 175, 55, 0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedOfferLetter(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                color: '#94A3B8',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={24} />
            </button>

            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#D4AF37', textTransform: 'uppercase' }}>
              Official White Caves Employment Package
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '4px 0 1rem', color: '#FFFFFF' }}>
              {selectedOfferLetter.title}
            </h3>

            <div style={{ background: '#1E293B', padding: '14px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: 800 }}>COMPENSATION STRUCTURE</span>
              <strong style={{ fontSize: '1.05rem', color: '#FFFFFF', display: 'block', margin: '2px 0 4px' }}>
                {selectedOfferLetter.compensationType}
              </strong>
              <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>{selectedOfferLetter.splitDetails}</span>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: '12px 14px', borderRadius: '12px', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 900, textTransform: 'uppercase' }}>🛂 UAE VISA SPONSORSHIP POLICY</span>
              <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#ECFDF5', lineHeight: 1.45 }}>
                {selectedOfferLetter.visaPolicy}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Included Employment Perks:
              </strong>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.84rem', color: '#E2E8F0', lineHeight: 1.5 }}>
                {selectedOfferLetter.perks.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* OFFICIAL LETTER PREVIEW TEXT */}
            <div style={{ background: '#020617', padding: '1rem', borderRadius: '10px', border: '1px dashed #334155', fontFamily: 'monospace', fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.5, whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>
              {selectedOfferLetter.officialLetterText}
            </div>

            <button
              onClick={() => {
                setSelectedOfferLetter(null);
                const pos = JOB_POSITIONS.find(j => j.id === selectedOfferLetter.positionId);
                if (pos) setApplyingPosition(pos);
              }}
              style={{
                width: '100%',
                background: '#D4AF37',
                color: '#0F172A',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.9rem',
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              Apply For This Offer Package ➔
            </button>
          </div>
        </div>
      )}

      {/* ─── APPLY FORM MODAL ─── */}
      {applyingPosition && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: '#0F172A',
              border: '2px solid #06B6D4',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '480px',
              width: '100%',
              color: '#FFFFFF',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => { setApplyingPosition(null); setApplyStatus('idle'); }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                color: '#94A3B8',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={24} />
            </button>

            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 900 }}>
              Apply for {applyingPosition.title}
            </h3>

            {applyStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10B981', margin: '0 0 0.5rem' }}>
                  Application Submitted Successfully!
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
                  Our HR Executive team will review your application and contact you via WhatsApp or Email within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#CBD5E1', marginBottom: '4px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applyForm.name}
                    onChange={e => setApplyForm({ ...applyForm, name: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1E293B', color: '#FFFFFF', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#CBD5E1', marginBottom: '4px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={applyForm.email}
                    onChange={e => setApplyForm({ ...applyForm, email: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1E293B', color: '#FFFFFF', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#CBD5E1', marginBottom: '4px' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={applyForm.phone}
                    onChange={e => setApplyForm({ ...applyForm, phone: e.target.value })}
                    placeholder="+971 50 ..."
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1E293B', color: '#FFFFFF', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#CBD5E1', marginBottom: '4px' }}>Short Summary / Cover Note</label>
                  <textarea
                    rows={3}
                    value={applyForm.coverLetter}
                    onChange={e => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                    placeholder="Tell us about your experience..."
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1E293B', color: '#FFFFFF', fontSize: '0.88rem' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={applyStatus === 'submitting'}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                  }}
                >
                  {applyStatus === 'submitting' ? 'Submitting Application...' : 'Submit Application ➔'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

export default CareersPage;
