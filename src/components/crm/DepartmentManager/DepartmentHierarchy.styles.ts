/**
 * DepartmentHierarchy.styles.ts
 * 7-Category Architecture: Styles Layer
 * 3-Tier Bhakti Protocol Styling Definitions (Directors, Managers, Supervisors)
 */

export const hierarchyStyles = {
  container:
    'w-full h-full flex flex-col gap-5 p-6 bg-slate-950 text-slate-100 min-h-screen overflow-y-auto',

  // Top Bar & Breadcrumb
  headerContainer:
    'flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md',
  titleRow: 'flex items-center gap-3',
  titleIconBadge:
    'w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg',
  title: 'text-xl font-bold tracking-tight text-white flex items-center gap-2',
  subtitle: 'text-xs text-slate-400 font-medium',

  breadcrumbTrail: 'flex items-center gap-2 flex-wrap text-xs font-semibold',
  breadcrumbItem:
    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer',
  breadcrumbActive:
    'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-500/10',
  breadcrumbInactive:
    'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800',
  breadcrumbSeparator: 'text-slate-600 font-bold',

  tierBadge: 'px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider',
  tierL1: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  tierL2: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  tierL3: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',

  // Controls Row
  controlsRow: 'flex flex-wrap items-center justify-between gap-3',
  searchContainer: 'relative w-full max-w-sm',
  searchInput:
    'w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all',
  searchIcon: 'absolute left-3 top-2.5 w-4 h-4 text-slate-500',

  statusToast:
    'px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in',

  // Tier 1: Directors Grid (12 Cards)
  directorsGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
  directorCard:
    'relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-200 cursor-grab active:cursor-grabbing group',
  cardDragging: 'opacity-40 scale-95 border-amber-500 ring-2 ring-amber-500/30',
  cardDropTarget: 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/40',

  slotPill:
    'px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-800 text-amber-400 border border-amber-500/20',
  codePill:
    'px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700',

  directorHeader: 'flex items-center justify-between gap-2 mb-3',
  directorTitle:
    'text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1',
  directorDescription: 'text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed',
  directorLeadMeta:
    'p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 flex items-center gap-2.5',
  leadAvatarBadge:
    'w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0',
  leadName: 'text-xs font-semibold text-slate-200 line-clamp-1',
  leadRole: 'text-[11px] text-slate-400 line-clamp-1',

  cardFooterActions: 'flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2',
  drillDownBtn:
    'flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all',
  iconActionBtn:
    'p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-all text-xs',
  demoteBtn:
    'p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all text-xs',

  // Tier 2: Division Managers Grid (9 Cards)
  managersGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  managerCard:
    'relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-grab active:cursor-grabbing group',
  managerSlotPill:
    'px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-800 text-blue-400 border border-blue-500/20',
  managerTitle:
    'text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 min-h-[2.5rem]',
  managerLeadMeta:
    'p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 flex items-center gap-2.5',
  managerAvatarBadge:
    'w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0',
  slaPill:
    'px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  managerDrillDownBtn:
    'flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all',

  // Tier 3: Teams & Supervisors List
  teamsContainer: 'flex flex-col gap-4',
  teamCard:
    'flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-emerald-500/30 transition-all',
  teamIdentity: 'flex items-center gap-3',
  teamAvatarBadge:
    'w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm',
  teamName: 'text-sm font-bold text-white',
  teamSupervisor: 'text-xs text-slate-400 font-medium',
  capabilitiesTags: 'flex items-center gap-1.5 flex-wrap',
  capabilityTag:
    'px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700/80',

  // Unassigned Reserve Pool Deck
  poolContainer:
    'mt-6 p-4 rounded-2xl bg-slate-900/70 border border-dashed border-slate-800 flex flex-col gap-3',
  poolHeader: 'flex items-center justify-between',
  poolTitle: 'text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2',
  poolCountPill:
    'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700',
  poolGrid: 'flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700',
  poolItemCard:
    'flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 cursor-grab active:cursor-grabbing transition-all min-w-[220px] max-w-[260px] shrink-0',
  poolItemAvatar:
    'w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-xs shrink-0',
  poolItemName: 'text-xs font-bold text-slate-200 line-clamp-1',
  poolItemTitle: 'text-[10px] text-slate-400 line-clamp-1',
};
