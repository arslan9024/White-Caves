import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

export interface LeadTimelineProps { leadId?: string }

type ActivityType = 'inquiry' | 'call' | 'whatsapp' | 'task' | 'viewing' | 'offer' | 'note';
type FilterType   = 'all' | ActivityType;

interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  createdAt: string;
  userName: string;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all',      label: 'All'       },
  { key: 'inquiry',  label: 'Inquiry'   },
  { key: 'call',     label: 'Call'      },
  { key: 'whatsapp', label: 'WhatsApp'  },
  { key: 'task',     label: 'Task'      },
  { key: 'viewing',  label: 'Viewing'   },
  { key: 'offer',    label: 'Offer'     },
];

const TYPE_META: Record<ActivityType, { icon: string; bg: string; text: string }> = {
  inquiry:   { icon: '✨', bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-300' },
  call:      { icon: '📞', bg: 'bg-green-500/20',   text: 'text-green-400'   },
  whatsapp:  { icon: '💬', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  task:      { icon: '⏱️', bg: 'bg-orange-500/20',  text: 'text-orange-300'  },
  viewing:   { icon: '🏠', bg: 'bg-blue-500/20',    text: 'text-blue-400'    },
  offer:     { icon: '📋', bg: 'bg-yellow-500/20',  text: 'text-yellow-400'  },
  note:      { icon: '📝', bg: 'bg-slate-500/20',   text: 'text-slate-400'   },
};

const listItem = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.25 } },
  exit:    { opacity: 0, x: 12, transition: { duration: 0.2  } },
};

export default function LeadTimeline({ leadId: propLeadId }: LeadTimelineProps) {
  const [searchParams]               = useSearchParams();
  const resolvedId                   = propLeadId ?? searchParams.get('leadId') ?? '';

  const [activities, setActivities]  = useState<Activity[]>([]);
  const [filter, setFilter]          = useState<FilterType>('all');
  const [loading, setLoading]        = useState(false);
  const [noteOpen, setNoteOpen]      = useState(false);
  const [noteText, setNoteText]      = useState('');
  const [noteError, setNoteError]    = useState('');
  const mounted                      = useRef(true);

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  const loadActivities = useCallback(async () => {
    if (!resolvedId) return;
    setLoading(true);
    try {
      let res = await fetch(`/api/leads/${resolvedId}/timeline`);
      if (!res.ok) res = await fetch(`/api/leads/${resolvedId}/activities`);
      if (!res.ok) res = await fetch(`/api/activities?leadId=${resolvedId}`);
      if (!res.ok) throw new Error();
      const json = (await res.json()) as { data?: Activity[]; activities?: Activity[] } | Activity[];
      const list: Activity[] = Array.isArray(json) ? json : (json.data ?? json.activities ?? []);
      if (mounted.current) { setActivities(list); setLoading(false); }
    } catch { if (mounted.current) setLoading(false); }
  }, [resolvedId]);

  useEffect(() => { loadActivities(); }, [loadActivities]);

  const submitNote = async () => {
    if (!noteText.trim() || !resolvedId) return;
    const optimistic: Activity = {
      id: `temp-${Date.now()}`, type: 'note', description: noteText.trim(),
      createdAt: new Date().toISOString(), userName: 'You',
    };
    setActivities(prev => [optimistic, ...prev]);
    setNoteText(''); setNoteOpen(false); setNoteError('');
    try {
      const res = await fetch(`/api/leads/${resolvedId}/activities`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'note', description: optimistic.description }),
      });
      if (!res.ok) throw new Error();
    } catch {
      if (mounted.current) {
        setActivities(prev => prev.filter(a => a.id !== optimistic.id));
        setNoteError('Failed to save note. Please try again.');
        setNoteOpen(true); setNoteText(optimistic.description);
      }
    }
  };

  const visible = filter === 'all' ? activities : activities.filter(a => a.type === filter);

  return (
    <div className="bg-[#0A0A0A] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Lead Timeline</h1>
          {resolvedId && <p className="text-white/40 text-xs mt-0.5">Lead ID: {resolvedId}</p>}
        </div>
        <button onClick={() => { setNoteOpen(o => !o); setNoteError(''); }} aria-label="Add note"
          className="px-4 py-2 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-xl text-sm hover:bg-yellow-400/30 transition-colors">
          + Add Note
        </button>
      </div>

      {/* Inline note form */}
      <AnimatePresence>
        {noteOpen && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 overflow-hidden">
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3}
              placeholder="Write your note…" aria-label="Note content"
              className="w-full bg-transparent text-white text-sm placeholder-white/30 resize-none outline-none" />
            {noteError && <p className="text-red-400 text-xs mt-1">{noteError}</p>}
            <div className="flex gap-2 mt-3">
              <button onClick={submitNote} disabled={!noteText.trim()} aria-label="Submit note"
                className="px-3 py-1.5 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-xl text-xs hover:bg-yellow-400/30 transition-colors disabled:opacity-40">
                Save
              </button>
              <button onClick={() => setNoteOpen(false)} aria-label="Cancel note"
                className="px-3 py-1.5 bg-white/5 text-white/50 border border-white/10 rounded-xl text-xs hover:border-white/20 transition-colors">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Activity filter">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} aria-pressed={filter === f.key}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${filter === f.key ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {loading && (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {!loading && visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <span className="text-5xl mb-4" aria-hidden="true">👻</span>
          <p className="text-sm">No activities yet</p>
        </div>
      )}

      {!loading && (
        <ol className="space-y-3" aria-label="Activity timeline">
          <AnimatePresence initial={false}>
            {visible.map(act => {
              const meta = TYPE_META[act.type];
              return (
                <motion.li key={act.id} variants={listItem} initial="hidden" animate="visible" exit="exit"
                  className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${meta.bg}`} aria-hidden="true">
                    {meta.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.bg} ${meta.text}`}>
                        {act.type.charAt(0).toUpperCase() + act.type.slice(1)}
                      </span>
                      <span className="text-white/30 text-xs">{act.userName}</span>
                    </div>
                    <p className="text-white/80 text-sm">{act.description}</p>
                    <p className="text-white/30 text-xs mt-1">
                      {new Date(act.createdAt).toLocaleString('en-AE',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      )}
    </div>
  );
}

