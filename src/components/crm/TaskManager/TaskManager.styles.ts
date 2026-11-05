/**
 * TaskManager.styles.ts
 * 7-Category Architecture: Styles Layer
 * Luxury White Caves styling tokens for 200+ Tasks Management
 */

export const taskStyles = {
  container:
    'w-full h-full flex flex-col gap-5 p-6 bg-slate-950 text-slate-100 min-h-screen overflow-y-auto',

  // Header & Metrics
  headerWrapper:
    'flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md',
  headerLeft: 'flex items-center gap-3',
  headerIcon:
    'w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl',
  headerTitle: 'text-xl font-bold tracking-tight text-white flex items-center gap-2',
  headerSubtitle: 'text-xs text-slate-400 font-medium',

  metricsRow: 'grid grid-cols-2 sm:grid-cols-5 gap-3',
  metricCard: 'p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col',
  metricNumber: 'text-lg font-bold text-white font-mono',
  metricLabel: 'text-[11px] text-slate-400 uppercase tracking-wider font-semibold',

  // Controls & Filter Bar
  controlsBar:
    'flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80',
  searchBox: 'relative flex-1 min-w-[240px] max-w-md',
  searchInput:
    'w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all',
  searchIcon: 'absolute left-3 top-2.5 w-4 h-4 text-slate-500',

  filterGroup: 'flex items-center gap-2 flex-wrap',
  filterSelect:
    'px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500',
  viewToggleBtn:
    'px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all',
  viewToggleActive: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  viewToggleInactive: 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white',

  addBtn:
    'flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20',
  statusToast:
    'px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2',

  // Task Cards Grid / Board
  tasksGrid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4',
  taskCard:
    'flex flex-col justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-200 group',
  taskTop: 'flex items-start justify-between gap-2 mb-2',
  codePill:
    'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700',
  authorityPill:
    'px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',

  priorityBadge: 'px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider',
  priorityCritical: 'bg-red-500/20 text-red-300 border border-red-500/30',
  priorityHigh: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  priorityMedium: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  priorityStandard: 'bg-slate-700/50 text-slate-300 border border-slate-600/30',

  statusPill: 'px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold',
  statusPending: 'bg-slate-800 text-slate-400 border border-slate-700',
  statusProgress: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  statusReview: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  statusCompleted: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  statusBlocked: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',

  taskTitle:
    'text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 my-1',
  taskDesc: 'text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3',

  // Reporting Hierarchy Escalation Card
  escalationCard:
    'p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 flex flex-col gap-1 text-[11px]',
  escalationTitle:
    'text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center justify-between',
  escalationStep: 'flex items-center gap-1.5 text-slate-300',
  escalationBadge: 'px-1.5 py-0.2 rounded text-[9px] font-mono font-bold',
  l3Badge: 'bg-emerald-500/20 text-emerald-300',
  l2Badge: 'bg-blue-500/20 text-blue-300',
  l1Badge: 'bg-red-500/20 text-red-300',
  l0Badge: 'bg-amber-500/20 text-amber-300',

  slaRow:
    'flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 mb-2',
  slaPill: 'font-mono text-emerald-400 font-semibold',

  cardFooter: 'flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2',
  actionBtn:
    'flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all',
  advanceBtn:
    'flex-1 flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all',
};
