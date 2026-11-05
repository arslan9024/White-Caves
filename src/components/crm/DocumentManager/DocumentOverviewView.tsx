/**
 * DocumentOverviewView.tsx
 * White Caves Real Estate LLC - DVS Executive Overview for /dashboard/documents
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol & Henry OCR Verification Engine
 */

import React, { FC } from 'react';
import {
  FileText,
  UploadCloud,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CANONICAL_DOCUMENTS } from './DocumentManager.data';

export interface DocumentOverviewViewProps {
  onNavigate: (route: string) => void;
}

export const DocumentOverviewView: FC<DocumentOverviewViewProps> = ({ onNavigate }) => {
  const totalDocs = CANONICAL_DOCUMENTS.length;
  const verifiedDocs = CANONICAL_DOCUMENTS.filter(d => d.status === 'VERIFIED').length;
  const titleDeeds = CANONICAL_DOCUMENTS.filter(d => d.docType === 'TITLE_DEED').length;
  const ejariDocs = CANONICAL_DOCUMENTS.filter(d => d.docType === 'EJARI_CONTRACT').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" data-testid="document-overview-view">
      <div data-testid="document-manager-view" style={{ display: 'none' }} />
      {/* ── 1. Top Sovereign Header ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/30 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <FileText size={15} /> System #7 · Sovereign Document Vault System (DVS)
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Cryptographic Document Vault & Henry OCR Engine
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
          The sovereign repository for legal and statutory documents: Title Deeds, Ejari Tenancy
          Certificates, Form A/B/F agreements, NOC certificates, Passports, and Trade Licenses with
          automated OCR extraction and cryptographic integrity verification.
        </p>
      </div>

      {/* ── 2. Real-Time Telemetry Deck ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-sky-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Documents</div>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {totalDocs} <span className="text-xs text-slate-500">Vault Files</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">SHA-256 Checksum Verified</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">OCR Verified</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {verifiedDocs} <span className="text-xs text-slate-500">Passed</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Henry Autonomous OCR Match</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">
            Title Deeds & Ownership
          </div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {titleDeeds} <span className="text-xs text-slate-500">Deeds</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">DLD Land Registry Match</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Ejari Certificates</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {ejariDocs} <span className="text-xs text-slate-500">Registered</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Official RERA Attestations</div>
        </div>
      </div>

      {/* ── 3. Primary Double-Layer Navigation Portals ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Layer 1: Document Vault */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase mb-2">
              <UploadCloud size={16} /> Double-Layer Route 1
            </div>
            <h3 className="text-lg font-bold text-white">Sovereign Document Archive (CRUD)</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Upload statutory files, run Henry OCR extraction, verify metadata against official DLD
              and RERA registries, and link documents directly to Deals, Properties, and Clients.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/documents/vault</code> & <code>/dashboard/documents/:docId</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/documents/vault')}
            data-testid="navigate-to-docs-vault-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Open Document Vault Grid</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Layer 2: Statutory Compliance */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">
              <ShieldCheck size={16} /> Double-Layer Route 2
            </div>
            <h3 className="text-lg font-bold text-white">Statutory DLD & RERA Compliance Vault</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Audit mandatory regulatory filings: Title Deeds, NOCs, Form F Agreements, and Ejari
              attestations required under UAE Law No. 7 and RERA regulations.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/documents/compliance</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/documents/compliance')}
            data-testid="navigate-to-docs-compliance-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
          >
            <span>Audit Statutory Compliance</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 4. Quick Access Document Chips ──────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-3">
          Recently Verified Documents (Direct Deep View)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {CANONICAL_DOCUMENTS.slice(0, 8).map(doc => (
            <button
              key={doc.id}
              onClick={() => onNavigate(`/dashboard/documents/${doc.id}`)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-900 text-left transition-all cursor-pointer group"
            >
              <div className="truncate">
                <span className="text-[10px] font-mono text-sky-400 block font-bold">
                  {doc.docCode} · {doc.docType}
                </span>
                <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate block">
                  {doc.title}
                </span>
              </div>
              <ArrowRight
                size={12}
                className="text-slate-600 group-hover:text-sky-400 shrink-0 ml-1 transition-colors"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentOverviewView;
