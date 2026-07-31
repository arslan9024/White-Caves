/**
 * ArgentinaGoalPage — Personal Immigration Tracker (Argentina Citizenship Roadmap)
 *
 * 100-step roadmap across 5 phases:
 *   Phase 1: Dubai Finalization & Spanish Translations (Steps 1-20)
 *   Phase 2: UNC Admission & Digital RENURE Tracking (Steps 21-40)
 *   Phase 3: Argentine Embassy Abu Dhabi Consular Protocol (Steps 41-60)
 *   Phase 4: Arrival in Córdoba & Residence Tracking (Steps 61-80)
 *   Phase 5: Córdoba Federal Court Naturalization & Passport (Steps 81-100)
 *
 * Features:
 * - Per-step completion toggling with localStorage persistence
 * - Phase-level select all / deselect all
 * - Overall progress bar + phase progress bars
 * - Reset with confirmation
 * - Fully accessible (ARIA roles, keyboard operable)
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLogger } from '../../utils/logger';

const log = createLogger('ArgentinaGoalPage');

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'wc-argentina-goal-progress';

function loadProgress(): Record<number, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<number, boolean>) : {};
  } catch (err) {
    log.warn('Failed to load Argentina goal progress', err);
    return {};
  }
}

function saveProgress(progress: Record<number, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    log.warn('Failed to save Argentina goal progress', err);
  }
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Step {
  id: number;
  phase: number;
  text: string;
}

interface Phase {
  id: number;
  title: string;
  emoji: string;
}

const PHASES: Phase[] = [
  { id: 1, title: 'Dubai Finalization & Spanish Translations', emoji: '🇦🇪' },
  { id: 2, title: 'UNC Admission & Digital RENURE Tracking', emoji: '🎓' },
  { id: 3, title: 'Argentine Embassy Abu Dhabi Consular Protocol', emoji: '🏛️' },
  { id: 4, title: 'Arrival in Córdoba & Residence Tracking', emoji: '🏠' },
  { id: 5, title: 'Córdoba Federal Court Naturalization & Passport', emoji: '🇦🇷' },
];

const INITIAL_STEPS: Step[] = [
  // PHASE 1
  { id: 1, phase: 1, text: 'Open the official Dubai Police smart application or visit the UAE Ministry of Interior (MOI) website portal.' },
  { id: 2, phase: 1, text: 'Log in securely using your verified UAE Pass linked directly to your active Emirates ID.' },
  { id: 3, phase: 1, text: 'Select the option to apply for a digital Police Clearance Certificate (PCC) for international immigration use.' },
  { id: 4, phase: 1, text: 'Designate the destination country explicitly as Argentina / Embassy of Argentina in Abu Dhabi.' },
  { id: 5, phase: 1, text: 'Pay the required processing fee for the electronic UAE Police Clearance Certificate through the secure gateway.' },
  { id: 6, phase: 1, text: 'Download the official digital UAE PCC once issued to your registered email profile (typically within 24 hours).' },
  { id: 7, phase: 1, text: 'Verify that the digital certificate explicitly covers your continuous residency period in Dubai spanning from 2020 to present.' },
  { id: 8, phase: 1, text: 'Confirm that your original degree certificate clearly shows the existing physical stamps from MOFA Pakistan.' },
  { id: 9, phase: 1, text: 'Confirm that your original degree certificate clearly shows the valid attestation stamp from MOFA Dubai.' },
  { id: 10, phase: 1, text: 'Create high-resolution color scans of both sides of your fully attested degree and academic transcripts in PDF format.' },
  { id: 11, phase: 1, text: 'Create high-resolution digital scans of your newly issued UAE Police Clearance Certificate.' },
  { id: 12, phase: 1, text: 'Scan your active Pakistani Passport ensuring it has at least 6 months of validity remaining from your projected travel date.' },
  { id: 13, phase: 1, text: 'Scan both the front and back of your active Emirates ID card for reference.' },
  { id: 14, phase: 1, text: 'Access the online registry database of the Colegio de Traductores Públicos inside Argentina.' },
  { id: 15, phase: 1, text: 'Locate and contact a certified public translator (Traductor Público Nacional) who accepts digital submissions.' },
  { id: 16, phase: 1, text: 'Email the digital high-resolution scans of your degree, transcripts, and UAE PCC to the chosen Argentine translator.' },
  { id: 17, phase: 1, text: 'Confirm the pricing structure, payment method, and processing timeframe for the official Spanish translations.' },
  { id: 18, phase: 1, text: 'Instruct the translator to prepare the legal translations containing their formal registration seal and digital signature.' },
  { id: 19, phase: 1, text: 'Verify that the final translated documents contain the legal cross-references to your original MOFA stamps.' },
  { id: 20, phase: 1, text: 'Secure all digital copies of the certified Spanish translations in a dedicated cloud storage backup folder.' },
  // PHASE 2
  { id: 21, phase: 2, text: 'Navigate to the official postgraduate portal of the Facultad de Ciencias Exactas, Físicas y Naturales (FCEFyN) at UNC.' },
  { id: 22, phase: 2, text: 'Draft a formal academic admission inquiry email in Spanish to the administration office at maestriama@fcefyn.unc.edu.ar.' },
  { id: 23, phase: 2, text: 'Attach your certified Spanish translations of your engineering degree, transcripts, and your updated CV.' },
  { id: 24, phase: 2, text: 'Submit your official application for the Maestría en Ciencias de la Ingeniería Mención Administración program.' },
  { id: 25, phase: 2, text: 'Monitor your inbox for communications from the UNC Academic Commission regarding their engineering curriculum equivalency evaluation.' },
  { id: 26, phase: 2, text: 'Receive your formal, official academic Letter of Admission to the master\'s program from the FCEFyN dean\'s office.' },
  { id: 27, phase: 2, text: 'Explicitly request UNC\'s active RENURE registration number (the registry identifier for institutions hosting foreign students).' },
  { id: 28, phase: 2, text: 'Formally request the UNC international student desk to initiate your digital migration data preload.' },
  { id: 29, phase: 2, text: 'Wait for the university administration to upload your personal information into the Argentine Migraciones internal database.' },
  { id: 30, phase: 2, text: 'Receive your formal \'Precarga Electrónica de Datos\' (Electronic Entry Pre-load Confirmation) document via email from UNC.' },
  { id: 31, phase: 2, text: 'Review the Precarga document to confirm your name spelling, passport number, and nationality precisely match your passport data.' },
  { id: 32, phase: 2, text: 'Print out three high-quality physical copies of your formal UNC Admission Letter for consular use.' },
  { id: 33, phase: 2, text: 'Print out three high-quality physical copies of the Precarga Electrónica de Datos document.' },
  { id: 34, phase: 2, text: 'Confirm the exact physical calendar date for the commencement of your master\'s program semesters in Córdoba.' },
  { id: 35, phase: 2, text: 'Pay the required administrative enrollment or booking fees to UNC using your bank account or card in Dubai.' },
  { id: 36, phase: 2, text: 'Obtain an official, stamped digital invoice or payment receipt from the UNC university bursar.' },
  { id: 37, phase: 2, text: 'Verify with the university that your course framework meets the full-time residency requirements dictated by Argentine law.' },
  { id: 38, phase: 2, text: 'Secure the direct internal WhatsApp or phone contact details for the FCEFyN postgraduate international student officer.' },
  { id: 39, phase: 2, text: 'Confirm that no supplementary entrance exams or technical interviews are pending for your engineering file.' },
  { id: 40, phase: 2, text: 'Compile all UNC enrollment papers, fees receipts, and precarga printouts into a physical folder labeled \'UNC ADMISSION\'.' },
  // PHASE 3
  { id: 41, phase: 3, text: 'Visit the official site of the Argentine Embassy in Abu Dhabi to review the current 365-day Student Visa criteria.' },
  { id: 42, phase: 3, text: 'Draft a clear visa appointment request email addressed directly to consular_eearb@mrecic.gov.ar.' },
  { id: 43, phase: 3, text: 'State your Pakistani nationality, your continuous Dubai residence history since 2020, and attach your UNC Precarga document.' },
  { id: 44, phase: 3, text: 'Request an interview slot targeted approximately 90 to 120 days before your master\'s program begins in Córdoba.' },
  { id: 45, phase: 3, text: 'Go to your local bank branch in Dubai and request an official printout of your last 3 months of bank statements.' },
  { id: 46, phase: 3, text: 'Ensure the bank statements are physically stamped by the branch manager, reflecting a clear balance of $4,000–$5,000 USD (equivalent in AED).' },
  { id: 47, phase: 3, text: 'Obtain a formal No Objection Certificate (NOC) from your current Dubai employer detailing your salary and clean exit standing.' },
  { id: 48, phase: 3, text: 'Secure 4 professional passport-sized photographs taken against a plain white background measuring exactly 4×4 cm.' },
  { id: 49, phase: 3, text: 'Download, print, and complete the official Argentine Visa Application Form carefully using blue ink in capital block letters.' },
  { id: 50, phase: 3, text: 'Receive the formal email confirmation from the Abu Dhabi consular section setting your specific visa interview date.' },
  { id: 51, phase: 3, text: 'Assemble your interview folio: Passport, Emirates ID, Dubai PCC, Stamped Bank Records, and the translated UNC files.' },
  { id: 52, phase: 3, text: 'Travel from Dubai to Abu Dhabi to attend your mandatory personal visa interview at the Argentine Embassy.' },
  { id: 53, phase: 3, text: 'Present your documentation to the consular officer and articulate your plans for studying engineering administration in Córdoba.' },
  { id: 54, phase: 3, text: 'Settle the non-refundable consular processing fee utilizing the embassy\'s designated payment protocol.' },
  { id: 55, phase: 3, text: 'Hand over your physical Pakistani passport to the consular authorities for secure processing and visa sticker placement.' },
  { id: 56, phase: 3, text: 'Await the security vetting clearance window (expecting roughly 25 to 45 days for non-GCC nationals).' },
  { id: 57, phase: 3, text: 'Receive the notification from the Abu Dhabi embassy confirming your visa sticker has been successfully printed.' },
  { id: 58, phase: 3, text: 'Collect your physical passport and thoroughly verify that your name spelling and visa type (Estudiante) match perfectly.' },
  { id: 59, phase: 3, text: 'Book your flight ticket routing from Dubai International Airport (DXB) to Córdoba Airport (COR) via Buenos Aires (EZE).' },
  { id: 60, phase: 3, text: 'Formally close out your rental agreements, cell contracts, and finalize financial transitions inside Dubai.' },
  // PHASE 4
  { id: 61, phase: 4, text: 'Arrive at Córdoba Airport (COR), present your passport containing the student visa, and pass through border control.' },
  { id: 62, phase: 4, text: 'Verify that the border official stamps your passport clearly with your correct chronological entry date.' },
  { id: 63, phase: 4, text: 'Check into your pre-booked temporary accommodation located within the central sector of Córdoba city.' },
  { id: 64, phase: 4, text: 'Collect the physical, signed, and stamped hard copies of your Spanish translations from your Argentine public translator.' },
  { id: 65, phase: 4, text: 'Log onto the Argentine Migraciones RADEX portal online to pay your national residency entry processing fees.' },
  { id: 66, phase: 4, text: 'Secure your physical data enrollment appointment at the Delegación Córdoba office of Dirección Nacional de Migraciones.' },
  { id: 67, phase: 4, text: 'Attend the appointment to present your physical visa, passport, translated degree, and submit your biometric fingerprints.' },
  { id: 68, phase: 4, text: 'Obtain your physical \'Residencia Precaria\' document which guarantees your legal status while your DNI prints.' },
  { id: 69, phase: 4, text: 'Wait for the postal service to deliver your first physical temporary DNI (Documento Nacional de Identidad) card to your home address.' },
  { id: 70, phase: 4, text: 'Note the exact day your DNI card was issued; this exact calendar day serves as Day 1 of your 2-year naturalization timeline.' },
  { id: 71, phase: 4, text: 'Lease a permanent apartment inside Córdoba and execute a formal long-term rental contract (Contrato de Alquiler).' },
  { id: 72, phase: 4, text: 'Take your rental contract to a local notary (Escribano Público) to have the signatures legally certified and registered.' },
  { id: 73, phase: 4, text: 'Transfer local utility bills (electricity from EPEC, home internet, water) directly into your name and DNI number.' },
  { id: 74, phase: 4, text: 'Open an Argentine bank account at a local bank (such as Banco de Córdoba or Santander) to handle your local financial footprint.' },
  { id: 75, phase: 4, text: 'Commence your engineering administration master\'s courses at UNC, maintaining good academic standing.' },
  { id: 76, phase: 4, text: 'Obtain a formal certificate of regular student status (Certificado de Alumno Regular) from the UNC registrar every single semester.' },
  { id: 77, phase: 4, text: 'File your annual temporary student residency extension via the RADEX system 30 days prior to your initial DNI expiration.' },
  { id: 78, phase: 4, text: 'Ensure any vacations or travel outside of Argentina do not exceed a collective 60–90 days per calendar year.' },
  { id: 79, phase: 4, text: 'Maintain systematic record keeping of your incoming bank transfers showing how you support yourself financially in Córdoba.' },
  { id: 80, phase: 4, text: 'Communicate in Spanish daily during your classes and lifestyle interactions to build natural fluency for your future court interview.' },
  // PHASE 5
  { id: 81, phase: 5, text: 'Complete exactly 24 months (731 continuous days) of legal residency calculated from the issue date of your first student DNI.' },
  { id: 82, phase: 5, text: 'Retain a local Córdoba immigration lawyer specializing in Federal Naturalization Lawsuits (Ciudadanía por Naturalización).' },
  { id: 83, phase: 5, text: 'Draft your formal legal petition for citizenship addressed explicitly to the Cámara Federal de Apelaciones de Córdoba.' },
  { id: 84, phase: 5, text: 'File the citizenship lawsuit electronically through your attorney via the official Poder Judicial de la Nación (PJN) digital portal.' },
  { id: 85, phase: 5, text: 'Receive your unique federal case tracking index number (Número de Expediente) and identify your assigned federal judge.' },
  { id: 86, phase: 5, text: 'Submit your comprehensive UNC enrollment history, passed exam certificates, and degree translations into the judicial system.' },
  { id: 87, phase: 5, text: 'Submit your certified Córdoba rental contracts and historical utility statements to legally satisfy the continuous domicile criterion.' },
  { id: 88, phase: 5, text: 'Request a fresh, updated national background check from the Argentine Registro Nacional de Reincidencia (RNR).' },
  { id: 89, phase: 5, text: 'Upload your clean local background check (RNR) into your ongoing federal court case files.' },
  { id: 90, phase: 5, text: 'Wait for the federal court judge to dispatch automated official security inquiries (Oficios) to Interpol and federal police forces.' },
  { id: 91, phase: 5, text: 'Obtain the formal court order instructing you to publish a citizenship legal notice in a prominent Córdoba daily newspaper.' },
  { id: 92, phase: 5, text: 'Pay for the notice publication, clip the physical newspaper ad, and submit the paper clipping proof back to the court clerk.' },
  { id: 93, phase: 5, text: 'Receive your formal judicial summons to attend your final in-person citizenship evaluation interview.' },
  { id: 94, phase: 5, text: 'Attend the court interview at the federal courthouse in Córdoba, answering basic integration questions entirely in Spanish.' },
  { id: 95, phase: 5, text: 'Take the formal loyalty oath to the Argentine Constitution in front of the federal judge and court secretary.' },
  { id: 96, phase: 5, text: 'Receive your physical \'Carta de Ciudadanía\' (Citizenship Decree Certificate) signed and stamped by the Federal Judge.' },
  { id: 97, phase: 5, text: 'Book an express update appointment with the main civil registry office (Registro Civil) inside Córdoba city.' },
  { id: 98, phase: 5, text: 'Surrender your temporary student DNI and submit your Carta de Ciudadanía to apply for your permanent Citizen DNI card.' },
  { id: 99, phase: 5, text: 'Schedule your passport biometric data enrollment session through Renaper immediately upon your citizen DNI delivery.' },
  { id: 100, phase: 5, text: 'Collect your physical blue Argentine Passport, unlocking visa-free global travel to more than 165 destinations including Europe.' },
];

// ─── Phase colour palette ─────────────────────────────────────────────────────

const PHASE_COLORS: Record<number, string> = {
  1: '#3B82F6', // blue
  2: '#8B5CF6', // violet
  3: '#F59E0B', // amber
  4: '#10B981', // emerald
  5: '#C9A84C', // gold (White Caves brand accent)
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ProgressBarProps {
  percent: number;
  color: string;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent, color, height = 8 }) => (
  <div
    style={{
      width: '100%',
      background: '#F3F4F6',
      borderRadius: height / 2,
      height,
      overflow: 'hidden',
    }}
    role="progressbar"
    aria-valuenow={percent}
    aria-valuemin={0}
    aria-valuemax={100}
  >
    <div
      style={{
        width: `${percent}%`,
        height: '100%',
        background: color,
        borderRadius: height / 2,
        transition: 'width 0.4s ease',
      }}
    />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ArgentinaGoalPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState<number>(1);
  const [completed, setCompleted] = useState<Record<number, boolean>>(() => loadProgress());

  // Persist changes to localStorage
  useEffect(() => {
    saveProgress(completed);
  }, [completed]);

  const handleToggleStep = useCallback((id: number) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleSelectPhaseAll = useCallback((phaseId: number, complete: boolean) => {
    setCompleted(prev => {
      const next = { ...prev };
      INITIAL_STEPS.filter(s => s.phase === phaseId).forEach(s => {
        next[s.id] = complete;
      });
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all your Argentina timeline progress?')) {
      setCompleted({});
    }
  }, []);

  // ─── Derived stats ────────────────────────────────────────────────────────

  const totalCompleted = useMemo(() => Object.values(completed).filter(Boolean).length, [completed]);
  const progressPercentage = Math.round((totalCompleted / INITIAL_STEPS.length) * 100);

  const phaseStats = useMemo(() => {
    return PHASES.reduce<Record<number, { total: number; completed: number; percent: number }>>(
      (acc, phase) => {
        const phaseSteps = INITIAL_STEPS.filter(s => s.phase === phase.id);
        const completedCount = phaseSteps.filter(s => completed[s.id]).length;
        acc[phase.id] = {
          total: phaseSteps.length,
          completed: completedCount,
          percent: Math.round((completedCount / phaseSteps.length) * 100) || 0,
        };
        return acc;
      },
      {}
    );
  }, [completed]);

  const activePhaseSteps = useMemo(
    () => INITIAL_STEPS.filter(s => s.phase === activePhase),
    [activePhase]
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-f9fafb, #F9FAFB)', padding: '24px' }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <button
          type="button"
          onClick={() => navigate('/crm')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6B7280',
            fontSize: 13,
            padding: '0 0 16px',
            fontFamily: 'inherit',
          }}
          aria-label="Back to dashboard"
        >
          ← Back to dashboard
        </button>

        {/* Hero banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1B4332 100%)',
            borderRadius: 16,
            padding: '28px 32px',
            marginBottom: 24,
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>🇦🇷</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
                Argentina Master Immigration Blueprint
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-94a3b8, #94A3B8)' }}>
                Track your 100 action items across document processing, university enrollment, visa
                protocols, and the 2-year federal court naturalization suit in Córdoba.
              </p>
            </div>
          </div>

          {/* Attestation badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {[
              '✅ MOFA PK + DXB Attestations Complete',
              '🇵🇰 Pakistani Passport Holder',
              '🇦🇪 Dubai Resident (2020–Present)',
              '🎓 UNC Córdoba Master\'s Goal',
            ].map(badge => (
              <span
                key={badge}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 20,
                  padding: '4px 12px',
                  fontSize: 12,
                  color: '#E2E8F0',
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Overall progress */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 24,
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary, #6B7280)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>
                Overall Completion
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 24, fontWeight: 700, color: 'var(--color-0f172a, #0F172A)' }}>
                {progressPercentage}%{' '}
                <span style={{ fontSize: 14, color: 'var(--text-secondary, #6B7280)', fontWeight: 400 }}>
                  ({totalCompleted} / 100 Milestones)
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: 'none',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 12,
                cursor: 'pointer',
                color: '#EF4444',
                fontFamily: 'inherit',
              }}
              aria-label="Reset all progress"
            >
              ↺ Reset progress
            </button>
          </div>
          <ProgressBar percent={progressPercentage} color="#C9A84C" height={10} />
        </div>

        {/* Phase cards overview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12,
            marginBottom: 28,
          }}
        >
          {PHASES.map(phase => {
            const stats = phaseStats[phase.id] ?? { total: 20, completed: 0, percent: 0 };
            const color = PHASE_COLORS[phase.id] ?? '#6B7280';
            const isActive = activePhase === phase.id;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setActivePhase(phase.id)}
                style={{
                  background: isActive ? '#0F172A' : '#fff',
                  border: isActive ? `2px solid ${color}` : '1px solid #E5E7EB',
                  borderRadius: 10,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  boxShadow: isActive ? `0 0 0 2px ${color}30` : '0 1px 3px rgba(0,0,0,0.05)',
                  fontFamily: 'inherit',
                }}
                aria-pressed={isActive}
                aria-label={`Phase ${phase.id}: ${phase.title}`}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>{phase.emoji}</div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: isActive ? '#fff' : '#374151',
                    lineHeight: 1.4,
                    marginBottom: 8,
                  }}
                >
                  Phase {phase.id}
                </div>
                <ProgressBar percent={stats.percent} color={color} height={5} />
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 10,
                    color: isActive ? '#94A3B8' : '#9CA3AF',
                  }}
                >
                  {stats.completed}/{stats.total}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active phase steps */}
        {(() => {
          const phase = PHASES.find(p => p.id === activePhase);
          if (!phase) return null;
          const stats = phaseStats[activePhase] ?? { total: 20, completed: 0, percent: 0 };
          const color = PHASE_COLORS[activePhase] ?? '#6B7280';
          const allComplete = stats.completed === stats.total;

          return (
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #E5E7EB',
                overflow: 'hidden',
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
              }}
            >
              {/* Phase header */}
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #F3F4F6',
                  background: '#FAFAFA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{phase.emoji}</span>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-0f172a, #0F172A)' }}>
                      Phase {phase.id}: {phase.title}
                    </h2>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary, #6B7280)' }}>
                    Steps {(phase.id - 1) * 20 + 1}–{phase.id * 20} ·{' '}
                    <span style={{ color, fontWeight: 600 }}>
                      {stats.completed}/{stats.total} complete ({stats.percent}%)
                    </span>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleSelectPhaseAll(activePhase, true)}
                    disabled={allComplete}
                    style={{
                      background: color,
                      border: 'none',
                      borderRadius: 7,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#fff',
                      cursor: allComplete ? 'not-allowed' : 'pointer',
                      opacity: allComplete ? 0.5 : 1,
                      fontFamily: 'inherit',
                    }}
                  >
                    ✓ All done
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPhaseAll(activePhase, false)}
                    disabled={stats.completed === 0}
                    style={{
                      background: 'none',
                      border: '1px solid #E5E7EB',
                      borderRadius: 7,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#6B7280',
                      cursor: stats.completed === 0 ? 'not-allowed' : 'pointer',
                      opacity: stats.completed === 0 ? 0.5 : 1,
                      fontFamily: 'inherit',
                    }}
                  >
                    Clear phase
                  </button>
                </div>
              </div>

              {/* Phase progress bar */}
              <div style={{ padding: '12px 24px 0' }}>
                <ProgressBar percent={stats.percent} color={color} height={6} />
              </div>

              {/* Steps list */}
              <ul
                style={{ listStyle: 'none', margin: 0, padding: '8px 0 16px' }}
                aria-label={`Phase ${phase.id} steps`}
              >
                {activePhaseSteps.map((step, idx) => {
                  const isDone = !!completed[step.id];
                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => handleToggleStep(step.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          width: '100%',
                          padding: '10px 24px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          borderBottom: idx < activePhaseSteps.length - 1 ? '1px solid #F9FAFB' : 'none',
                          transition: 'background 0.1s',
                          fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'none';
                        }}
                        aria-label={`Step ${step.id}: ${isDone ? 'completed' : 'not completed'} — ${step.text}`}
                        aria-pressed={isDone}
                      >
                        {/* Checkbox indicator */}
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            border: isDone ? `2px solid ${color}` : '2px solid #D1D5DB',
                            background: isDone ? color : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 1,
                            transition: 'all 0.15s',
                          }}
                          aria-hidden="true"
                        >
                          {isDone && (
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                              <path
                                d="M1 5l3.5 3.5L11 1"
                                stroke="#fff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Step number */}
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: isDone ? color : '#9CA3AF',
                            minWidth: 26,
                            marginTop: 2,
                            transition: 'color 0.15s',
                          }}
                        >
                          {step.id}
                        </span>

                        {/* Step text */}
                        <span
                          style={{
                            fontSize: 13,
                            color: isDone ? '#9CA3AF' : '#374151',
                            lineHeight: 1.6,
                            textDecoration: isDone ? 'line-through' : 'none',
                            transition: 'all 0.15s',
                            flex: 1,
                          }}
                        >
                          {step.text}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })()}

        {/* Completion celebration */}
        {totalCompleted === INITIAL_STEPS.length && (
          <div
            style={{
              marginTop: 24,
              background: 'linear-gradient(135deg, #065F46, #1B4332)',
              borderRadius: 12,
              padding: '24px 28px',
              textAlign: 'center',
              color: '#fff',
            }}
            role="status"
            aria-live="polite"
          >
            <div style={{ fontSize: 40, marginBottom: 8 }}>🏆🇦🇷🎉</div>
            <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700 }}>
              All 100 milestones complete!
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--color-a7f3d0, #A7F3D0)' }}>
              Welcome to Argentina. Your blue passport awaits. 🌍
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArgentinaGoalPage;
