// FILE: src/components/crm/AiAssistantManager/AiAssistantManager.styles.ts
/**
 * White Caves Real Estate LLC - AI Assistants Management System (AIAMS) Styles
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Styles)
 * Single Purpose File Law: < 350 lines
 */

export const aiamsStyles = {
  container:
    'w-full h-full flex flex-col gap-5 p-6 bg-slate-950 text-slate-100 min-h-screen overflow-y-auto [data-theme=light]_&:bg-slate-50 [data-theme=light]_&:text-slate-900',

  headerWrapper:
    'flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/30 border border-slate-800 shadow-xl backdrop-blur-md [data-theme=light]_&:from-white [data-theme=light]_&:via-white [data-theme=light]_&:to-red-50/40 [data-theme=light]_&:border-slate-200 [data-theme=light]_&:shadow-sm',
  headerLeft: 'flex items-center gap-3.5',
  headerIcon:
    'w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center font-bold text-xl shrink-0 [data-theme=light]_&:bg-red-50 [data-theme=light]_&:border-red-200',
  headerTitle: 'text-xl font-black tracking-tight text-white flex flex-wrap items-center gap-2 [data-theme=light]_&:text-slate-900',
  headerSubtitle: 'text-xs text-slate-300 font-medium mt-0.5 [data-theme=light]_&:text-slate-600',

  metricsRow: 'grid grid-cols-2 sm:grid-cols-4 gap-3',
  metricCard: 'p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col [data-theme=light]_&:bg-white [data-theme=light]_&:border-slate-200 [data-theme=light]_&:shadow-sm',
  metricNumber: 'text-xl font-black text-white font-mono [data-theme=light]_&:text-slate-900',
  metricLabel: 'text-[11px] text-slate-400 uppercase tracking-wider font-semibold [data-theme=light]_&:text-slate-500',

  controlsBar:
    'flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 [data-theme=light]_&:bg-white [data-theme=light]_&:border-slate-200 [data-theme=light]_&:shadow-sm',
  searchBox: 'relative flex-1 min-w-[240px] max-w-md',
  searchInput:
    'w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all [data-theme=light]_&:bg-slate-50 [data-theme=light]_&:border-slate-300 [data-theme=light]_&:text-slate-900 [data-theme=light]_&:placeholder-slate-400',
  searchIcon: 'absolute left-3 top-2.5 w-4 h-4 text-slate-500 [data-theme=light]_&:text-slate-400',

  filterGroup: 'flex items-center gap-2 flex-wrap',
  filterSelect:
    'px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500 [data-theme=light]_&:bg-slate-50 [data-theme=light]_&:border-slate-300 [data-theme=light]_&:text-slate-800',
  addBtn:
    'flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/20 cursor-pointer',
  secondaryBtn:
    'flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer [data-theme=light]_&:bg-slate-100 [data-theme=light]_&:text-slate-700 [data-theme=light]_&:border-slate-300 [data-theme=light]_&:hover:bg-slate-200',

  statusToast:
    'px-3.5 py-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-2 font-semibold [data-theme=light]_&:bg-red-50 [data-theme=light]_&:border-red-200 [data-theme=light]_&:text-red-700',

  cardsGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
  card: 'flex flex-col justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-200 group [data-theme=light]_&:bg-white [data-theme=light]_&:border-slate-200 [data-theme=light]_&:shadow-sm [data-theme=light]_&:hover:border-red-400',
  cardTop: 'flex items-start justify-between gap-2 mb-2.5',
  cardIdentity: 'flex items-center gap-2.5 overflow-hidden',
  avatar:
    'w-10 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 flex items-center justify-center font-bold text-sm shrink-0 [data-theme=light]_&:bg-red-50 [data-theme=light]_&:border-red-200',
  name: 'text-sm font-bold text-white group-hover:text-red-300 transition-colors truncate [data-theme=light]_&:text-slate-900 [data-theme=light]_&:group-hover:text-red-600',
  codePill:
    'px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700 [data-theme=light]_&:bg-slate-100 [data-theme=light]_&:text-slate-700 [data-theme=light]_&:border-slate-300',
  roleText: 'text-xs text-slate-400 font-medium line-clamp-1 mt-0.5 [data-theme=light]_&:text-slate-500',

  tierBadge: 'px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold',
  tierExecutive: 'bg-red-500/20 text-red-300 border border-red-500/30 [data-theme=light]_&:bg-red-50 [data-theme=light]_&:text-red-700 [data-theme=light]_&:border-red-200',
  tierManager: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 [data-theme=light]_&:bg-amber-50 [data-theme=light]_&:text-amber-700 [data-theme=light]_&:border-amber-200',
  tierSupervisor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30 [data-theme=light]_&:bg-blue-50 [data-theme=light]_&:text-blue-700 [data-theme=light]_&:border-blue-200',
  tierSpecialist: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 [data-theme=light]_&:bg-emerald-50 [data-theme=light]_&:text-emerald-700 [data-theme=light]_&:border-emerald-200',

  statusPill: 'px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold shrink-0',
  statusOptimal: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 [data-theme=light]_&:bg-emerald-50 [data-theme=light]_&:text-emerald-700 [data-theme=light]_&:border-emerald-200',
  statusActive: 'bg-sky-500/10 text-sky-400 border border-sky-500/20 [data-theme=light]_&:bg-sky-50 [data-theme=light]_&:text-sky-700 [data-theme=light]_&:border-sky-200',
  statusBusy: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 [data-theme=light]_&:bg-amber-50 [data-theme=light]_&:text-amber-700 [data-theme=light]_&:border-amber-200',
  statusStandby: 'bg-slate-700/50 text-slate-400 border border-slate-600/30 [data-theme=light]_&:bg-slate-100 [data-theme=light]_&:text-slate-600 [data-theme=light]_&:border-slate-300',

  metaSection:
    'p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 my-2.5 flex flex-col gap-1 text-xs text-slate-400 [data-theme=light]_&:bg-slate-50 [data-theme=light]_&:border-slate-200',
  metaRow: 'flex items-center justify-between gap-2',
  metaLabel: 'text-[10px] text-slate-500 font-medium uppercase font-mono',
  metaValue: 'text-slate-200 font-semibold font-mono text-[11px] truncate [data-theme=light]_&:text-slate-800',

  tagsRow: 'flex items-center gap-1 flex-wrap mb-3',
  capTag:
    'px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300 border border-slate-700/60 [data-theme=light]_&:bg-slate-100 [data-theme=light]_&:text-slate-700 [data-theme=light]_&:border-slate-300',

  cardFooter: 'flex items-center justify-between pt-2.5 border-t border-slate-800/80 gap-1.5 [data-theme=light]_&:border-slate-200',
  inspectBtn:
    'px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-all cursor-pointer [data-theme=light]_&:bg-slate-100 [data-theme=light]_&:text-slate-700 [data-theme=light]_&:border-slate-300 [data-theme=light]_&:hover:bg-slate-200',
  editBtn:
    'flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-[11px] font-semibold transition-all cursor-pointer [data-theme=light]_&:bg-red-50 [data-theme=light]_&:text-red-700 [data-theme=light]_&:border-red-200',
  deleteBtn:
    'p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-200 border border-rose-500/30 transition-all text-xs cursor-pointer [data-theme=light]_&:bg-rose-50 [data-theme=light]_&:text-rose-700 [data-theme=light]_&:border-rose-200',
};
