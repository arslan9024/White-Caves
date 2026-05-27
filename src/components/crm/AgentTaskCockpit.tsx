import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: 'new' | 'contacted';
  createdAt: string;
}

type Column = 'overdue' | 'today' | 'upcoming';

interface LeadColumns { overdue: Lead[]; today: Lead[]; upcoming: Lead[] }

const SLA_HOURS = 4;

function categorize(lead: Lead, now: Date): Column {
  const created = new Date(lead.createdAt);
  const diffH = (now.getTime() - created.getTime()) / 3_600_000;
  if (diffH >= SLA_HOURS) return 'overdue';
  const isToday = created.toDateString() === now.toDateString();
  return isToday ? 'today' : 'upcoming';
}

const COL_CFG = {
  overdue:  { label: 'Overdue',  accent: 'text-red-400',   border: 'border-red-500/30',   dot: 'bg-red-500'   },
  today:    { label: 'Today',    accent: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  upcoming: { label: 'Upcoming', accent: 'text-slate-400', border: 'border-slate-500/30', dot: 'bg-slate-500' },
} as const;

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const card      = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

function Skeleton() {
  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
      <div className="h-3 bg-white/10 rounded w-1/2 mb-3" />
      <div className="flex gap-2"><div className="h-8 bg-white/10 rounded flex-1" /><div className="h-8 bg-white/10 rounded flex-1" /></div>
    </div>
  );
}

export default function AgentTaskCockpit() {
  const [cols, setCols]     = useState<LeadColumns>({ overdue: [], today: [], upcoming: [] });
  const [phase, setPhase]   = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      const res = await fetch('/api/leads?status=new,contacted');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { leads?: Lead[] } | Lead[];
      const leads: Lead[] = Array.isArray(json) ? json : (json.leads ?? []);
      const now = new Date();
      const b: LeadColumns = { overdue: [], today: [], upcoming: [] };
      for (const l of leads) b[categorize(l, now)].push(l);
      setCols(b); setPhase('ok');
    } catch (e) { setErrMsg(e instanceof Error ? e.message : 'Error'); setPhase('err'); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const act = (type: string, lead: Lead) => {
    if (type === 'call')      { window.open(`tel:${lead.phone}`); return; }
    if (type === 'whatsapp')  { window.open(`https://wa.me/${lead.phone.replace(/\D/g,'')}`); return; }
    if (type === 'contacted') {
      setCols(prev => {
        const n = { ...prev };
        for (const c of ['overdue','today','upcoming'] as Column[])
          n[c] = prev[c].map(l => l.id === lead.id ? { ...l, status: 'contacted' as const } : l);
        return n;
      });
      fetch(`/api/leads/${lead.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'contacted' }) })
        .catch(() => load());
    }
  };

  if (phase === 'idle' || phase === 'loading') return (
    <div className="bg-[#0A0A0A] min-h-screen p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Agent Task Cockpit</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['overdue','today','upcoming'] as Column[]).map(c => (
          <div key={c}><div className="h-5 bg-white/10 rounded w-24 mb-4 animate-pulse" />{[1,2,3].map(i => <Skeleton key={i} />)}</div>
        ))}
      </div>
    </div>
  );

  if (phase === 'err') return (
    <div className="bg-[#0A0A0A] min-h-screen p-6 flex flex-col items-center justify-center gap-4">
      <p className="text-red-400 text-lg">⚠️ Failed to load tasks</p>
      <p className="text-white/40 text-sm">{errMsg}</p>
      <button onClick={load} aria-label="Retry loading tasks"
        className="px-4 py-2 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-xl hover:bg-yellow-400/30 transition-colors">
        Retry
      </button>
    </div>
  );

  return (
    <div className="bg-[#0A0A0A] min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Agent Task Cockpit</h1>
        <p className="text-white/50 text-sm mt-1">SLA-prioritised lead actions</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['overdue','today','upcoming'] as Column[]).map(col => {
          const cfg   = COL_CFG[col];
          const leads = cols[col];
          return (
            <div key={col}>
              <div className={`flex items-center gap-2 mb-4 pb-2 border-b ${cfg.border}`}>
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} aria-hidden="true" />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${cfg.accent}`}>{cfg.label}</h2>
                <span className="ml-auto text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">{leads.length}</span>
              </div>
              <motion.div className="space-y-3" variants={container} initial="hidden" animate="visible" aria-label={`${cfg.label} leads`}>
                {leads.length === 0 && <motion.p variants={card} className="text-white/30 text-sm text-center py-8">No leads here</motion.p>}
                {leads.map(lead => (
                  <motion.div key={lead.id} variants={card} className={`backdrop-blur-sm bg-white/5 border ${cfg.border} rounded-2xl p-4`}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-white font-medium text-sm">{lead.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lead.status === 'new' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                        {lead.status === 'new' ? 'New' : 'Contacted'}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs mb-1">{lead.phone}</p>
                    <p className="text-white/30 text-xs mb-3">{new Date(lead.createdAt).toLocaleString('en-AE',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key:'call',       label:'📞 Call',        cls:'bg-green-500/10 text-green-400 border-green-500/20'   },
                        { key:'whatsapp',   label:'💬 WhatsApp',    cls:'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                        { key:'contacted',  label:'✓ Contacted',    cls:'bg-blue-500/10 text-blue-400 border-blue-500/20'      },
                        { key:'schedule',   label:'📅 Schedule',    cls:'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
                      ].map(btn => (
                        <button key={btn.key} onClick={() => act(btn.key, lead)}
                          aria-label={`${btn.label} ${lead.name}`}
                          className={`text-xs py-1.5 px-2 rounded-xl border hover:opacity-80 transition-opacity ${btn.cls}`}>
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


