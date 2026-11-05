/**
 * White Caves Real Estate LLC - Leaderboard Style Tokens
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Styles)
 * Single Purpose File Law: < 350 lines
 */

export const LEADERBOARD_STYLES = {
  container: 'w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col',
  contentWrapper: 'flex-1 p-6 max-w-7xl w-full mx-auto space-y-6',

  // Header
  headerContainer:
    'flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800',
  titleRow: 'flex items-center gap-3',
  titleIcon: 'w-8 h-8 text-amber-400 p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20',
  title: 'text-2xl font-bold tracking-tight text-white flex items-center gap-2',
  subtitle: 'text-sm text-slate-400 mt-1',

  // Metrics Deck
  metricsGrid: 'grid grid-cols-2 md:grid-cols-4 gap-4',
  metricCard:
    'bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors',
  metricLabel:
    'text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between',
  metricValue: 'text-2xl font-black text-white mt-2',
  metricSubtext: 'text-xs text-slate-500 mt-1',

  // Podium
  podiumContainer: 'grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 pb-2 items-end',
  podiumCardGold:
    'relative bg-gradient-to-b from-amber-500/20 via-slate-900/90 to-slate-950 border-2 border-amber-500/60 rounded-2xl p-6 shadow-xl shadow-amber-500/10 flex flex-col items-center text-center transform md:-translate-y-4 transition-transform',
  podiumCardSilver:
    'relative bg-gradient-to-b from-slate-400/20 via-slate-900/90 to-slate-950 border border-slate-400/50 rounded-2xl p-6 shadow-lg shadow-slate-400/10 flex flex-col items-center text-center transition-transform',
  podiumCardBronze:
    'relative bg-gradient-to-b from-amber-800/20 via-slate-900/90 to-slate-950 border border-amber-700/50 rounded-2xl p-6 shadow-lg shadow-amber-800/10 flex flex-col items-center text-center transition-transform',
  crownIcon: 'w-7 h-7 text-amber-400 mb-2 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]',
  podiumAvatar: 'w-20 h-20 rounded-full object-cover ring-4 ring-amber-500/40 shadow-xl mb-3',
  podiumRankBadge:
    'absolute -top-3.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider',

  // Filter Bar
  filterBar:
    'bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3',
  searchBox: 'relative flex-1 min-w-[240px]',
  searchInput:
    'w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50',
  searchIcon: 'w-4 h-4 text-slate-400 absolute left-3 top-3',
  tabGroup: 'flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800',
  tabBtn: 'px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
  tabBtnActive: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm',
  tabBtnInactive: 'text-slate-400 hover:text-slate-200',

  // Table
  tableCard: 'bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl',
  tableHeader:
    'grid grid-cols-12 gap-3 px-6 py-3 bg-slate-900/90 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider',
  tableRow:
    'grid grid-cols-12 gap-3 px-6 py-4 items-center border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors',
  tableRowEligible: 'bg-emerald-950/20 border-l-4 border-l-emerald-500',
  rankCol: 'col-span-1 flex items-center font-bold text-slate-300',
  memberCol: 'col-span-4 flex items-center gap-3',
  tierCol: 'col-span-2 flex items-center',
  xpCol: 'col-span-2 flex flex-col justify-center',
  progressCol: 'col-span-2 flex flex-col justify-center',
  actionCol: 'col-span-1 flex items-center justify-end',

  // Tier Badge
  tierBadge: 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border',

  // Progress Bar
  progressBarBg: 'w-full bg-slate-800 h-2 rounded-full overflow-hidden',
  progressBarFill:
    'h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500',

  // Promotion Drawer
  drawerOverlay: 'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end',
  drawerContent:
    'w-full max-w-lg bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto space-y-6',
  checklistCard: 'bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3',
  checklistItem: 'flex items-start gap-3 text-sm',
  promoteBtn:
    'w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2',
};
