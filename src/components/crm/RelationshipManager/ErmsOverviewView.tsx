/**
 * ErmsOverviewView.tsx
 * White Caves Real Estate LLC - ERMS Executive Overview for /dashboard/erms
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Management Systems Directory
 */

import React, { FC } from 'react';
import {
  Network,
  Database,
  GitFork,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  CheckSquare,
  Home,
  Handshake,
  Contact,
  FileText,
  Trophy,
} from 'lucide-react';
import { CANONICAL_ALL_ENTITIES } from './RelationshipEntities.data';
import { CANONICAL_ERD_RELATIONS, CANONICAL_ERD_MODELS } from './RelationshipErd.data';
import { CANONICAL_RELATIONSHIPS } from './RelationshipManager.data';
import { ErmsCorporateUmbrellaBanner } from './ErmsCorporateUmbrellaBanner';

export interface ErmsOverviewViewProps {
  onNavigate: (route: string) => void;
}

const ALL_9_SYSTEMS = [
  {
    code: 'DMS',
    name: 'Department Management System',
    route: '/dashboard/departments',
    icon: <Building2 size={16} color="#EF4444" />,
    count: '12 Slots / 108 Divisions',
  },
  {
    code: 'EMS',
    name: 'Employee Management System',
    route: '/dashboard/employees',
    icon: <Users size={16} color="#3B82F6" />,
    count: '121 Staff Roster',
  },
  {
    code: 'TMS',
    name: 'Task Management System',
    route: '/dashboard/tasks',
    icon: <CheckSquare size={16} color="#10B981" />,
    count: '200+ Core Tasks',
  },
  {
    code: 'PMS',
    name: 'Property Portfolio System',
    route: '/dashboard/REproperties',
    icon: <Home size={16} color="#8B5CF6" />,
    count: 'Luxury Inventory',
  },
  {
    code: 'DMS',
    name: 'Deals & Pipeline System',
    route: '/dashboard/deals',
    icon: <Handshake size={16} color="#C084FC" />,
    count: 'Escrow & Closings',
  },
  {
    code: 'CMS',
    name: 'Customer & Lead System',
    route: '/dashboard/customers',
    icon: <Contact size={16} color="#34D399" />,
    count: 'UHNW Investors',
  },
  {
    code: 'DVS',
    name: 'Document Vault System',
    route: '/dashboard/documents',
    icon: <FileText size={16} color="#38BDF8" />,
    count: 'OCR Vault',
  },
  {
    code: 'LMS',
    name: 'Leaderboard & Gamification',
    route: '/dashboard/leaderboard',
    icon: <Trophy size={16} color="#F59E0B" />,
    count: 'Tiers L0–L5',
  },
  {
    code: 'ERMS',
    name: 'Entities & Relational System',
    route: '/dashboard/erms/entities',
    icon: <Network size={16} color="#10B981" />,
    count: 'System #9 (Mesh)',
  },
];

export const ErmsOverviewView: FC<ErmsOverviewViewProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" data-testid="erms-overview-view">
      {/* ── 1. Top Sovereign Header ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <Network size={15} /> System #9 · Entities & Relationships Management System (ERMS)
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Enterprise Relational Mesh & Entity Control Center
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
          The sovereign data nervous system interconnecting all 9 Management Systems, 95 Prisma
          schema models, hierarchical lineage paths, and foreign key composition constraints.
        </p>
      </div>

      {/* ── 2. Real-Time Telemetry Deck ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Seed Entities</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {CANONICAL_ALL_ENTITIES.length} <span className="text-xs text-slate-500">Nodes</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across 10 core entity types</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-sky-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">UML Schema Models</div>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {CANONICAL_ERD_MODELS.length} <span className="text-xs text-slate-500">Classes</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">With RUP «Entity» stereotypes</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Relational Edges</div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {CANONICAL_ERD_RELATIONS.length} <span className="text-xs text-slate-500">Links</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Composition & Aggregations</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">
            Active Pipeline Chains
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {CANONICAL_RELATIONSHIPS.length}{' '}
            <span className="text-xs text-slate-500">Pipelines</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">AED 41M Escrow Gross Volume</div>
        </div>
      </div>

      {/* ── 3. Primary Double-Layer Navigation Portals ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Layer 1: Entities CRUD Hub */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">
              <Database size={16} /> Double-Layer Route 1
            </div>
            <h3 className="text-lg font-bold text-white">Entities Master Hub (CRUD)</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Directly manage, filter, create, inspect, update, and delete all project entity
              instances (Users, Landlords, Tenants, Properties, Contracts, Deals, Tasks, Invoices,
              Cheques).
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/erms/entities</code> &{' '}
              <code>/dashboard/erms/entities/:entityId</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/erms/entities')}
            data-testid="navigate-to-entities-hub-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg"
          >
            <span>Open Entities CRUD Hub</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Layer 2: Relational Matrix & UML ERD */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase mb-2">
              <GitFork size={16} /> Double-Layer Route 2
            </div>
            <h3 className="text-lg font-bold text-white">Relational Matrix & UML ERD</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Explore the deterministic multi-node execution flow, UML class diagram with
              multiplicities, cascade delete composition rules, and focused binary 2-entity edge
              inspectors.
            </p>
            <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <code>/dashboard/erms/relationships</code> &{' '}
              <code>/dashboard/erms/relationships/:id</code>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/erms/relationships')}
            data-testid="navigate-to-relationships-matrix-btn"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-lg"
          >
            <span>Open Relational Matrix & ERD</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 4. The 9 Core Management Systems Directory ────────────────────── */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
            <ShieldCheck size={16} className="text-emerald-400" />
            White Caves Ecosystem · 9 Core Management Systems
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Governed under Bhakti 1-12-108 Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ALL_9_SYSTEMS.map(sys => (
            <div
              key={sys.code + sys.name}
              onClick={() => onNavigate(sys.route)}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-slate-700">
                  {sys.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="font-mono text-emerald-400 text-[10px]">{sys.code}</span>
                    <span>{sys.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{sys.count}</div>
                </div>
              </div>
              <ArrowRight
                size={13}
                className="text-slate-600 group-hover:text-white transition-colors"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErmsOverviewView;
